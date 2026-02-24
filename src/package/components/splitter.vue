<template>
    <div ref="root" :class="getClass">
        <slot />
        <div
            v-for="(_item, index) in gutterCount"
            :key="`gutter-${index}`"
            class="vf-splitter__gutter"
            :class="{ 'is-dragging': dragIndex === index }"
            :style="getGutterStyle(index)"
            role="separator"
            :aria-orientation="separatorOrientation"
            :aria-valuemin="Math.round(getGutterAriaMin(index))"
            :aria-valuemax="Math.round(getGutterAriaMax(index))"
            :aria-valuenow="Math.round(sizes[index] ?? 0)"
            :aria-disabled="props.disabled ? 'true' : undefined"
            :aria-controls="getGutterAriaControls(index)"
            :tabindex="props.disabled ? -1 : 0"
            @mousedown.prevent="onGutterMouseDown($event, index)"
            @keydown="onGutterKeydown($event, index)"
        >
            <span class="vf-splitter__gutter-handle" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref, watch } from 'vue';
import { splitterKey, type SplitterDirection, type SplitterPanelConfig } from './splitter-context';

interface Props {
    modelValue?: Array<number>;
    minSizes?: Array<number>;
    direction?: SplitterDirection;
    gutterSize?: number | string;
    disabled?: boolean;
    persistence?: 'none' | 'local' | 'session';
    persistenceKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    minSizes: () => [],
    direction: 'horizontal',
    gutterSize: 8,
    disabled: false,
    persistence: 'none',
    persistenceKey: '',
});
const emits = defineEmits(['update:modelValue', 'change']);

let splitterPanelIdCounter = 0;

const root = ref<HTMLElement | null>(null);
const panels = ref<Array<SplitterPanelConfig>>([]);
const sizes = ref<Array<number>>([]);
const dragIndex = ref<number | null>(null);

const toCssSize = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);
const isPositiveNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value > 0;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const roundTo = (value: number, precision = 4) => {
    const factor = 10 ** precision;

    return Math.round(value * factor) / factor;
};

const normalizeTo100 = (items: Array<number>) => {
    if (!items.length) {
        return [];
    }

    const total = items.reduce((sum, item) => sum + item, 0);

    if (total <= 0) {
        const equal = 100 / items.length;

        return items.map((_item, index) =>
            index === items.length - 1 ? roundTo(100 - equal * (items.length - 1)) : equal,
        );
    }

    const scaled = items.map(item => (item / total) * 100);
    const rounded = scaled.map(item => roundTo(item));
    const diff = roundTo(100 - rounded.reduce((sum, item) => sum + item, 0));
    const lastIndex = rounded.length - 1;

    rounded[lastIndex] = roundTo(rounded[lastIndex] + diff);

    return rounded;
};

const applyMinSizes = (inputSizes: Array<number>, minSizes: Array<number>) => {
    if (!inputSizes.length) {
        return [];
    }

    const rawMinSum = minSizes.reduce((sum, item) => sum + item, 0);
    const mins = rawMinSum >= 100 ? normalizeTo100(minSizes) : minSizes.map(item => Math.max(item, 0));
    const next = inputSizes.map((item, index) => Math.max(item, mins[index] ?? 0));

    let total = next.reduce((sum, item) => sum + item, 0);

    if (total > 100) {
        let excess = total - 100;
        let guard = 0;

        while (excess > 0.0001 && guard < 50) {
            const candidates = next
                .map((item, index) => ({ index, slack: item - (mins[index] ?? 0) }))
                .filter(item => item.slack > 0.0001);

            if (!candidates.length) {
                break;
            }

            const reducible = candidates.reduce((sum, item) => sum + item.slack, 0);

            if (reducible <= excess + 0.0001) {
                candidates.forEach(item => {
                    next[item.index] = mins[item.index] ?? 0;
                });
                excess -= reducible;
                ++guard;
                continue;
            }

            candidates.forEach(item => {
                const ratio = item.slack / reducible;
                next[item.index] = next[item.index] - excess * ratio;
            });
            excess = 0;
            ++guard;
        }
    } else if (total < 100) {
        const missing = 100 - total;
        const add = missing / next.length;

        for (let i = 0; i < next.length; ++i) {
            next[i] += add;
        }
    }

    const rounded = next.map(item => roundTo(item));
    const diff = roundTo(100 - rounded.reduce((sum, item) => sum + item, 0));

    rounded[rounded.length - 1] = roundTo(rounded[rounded.length - 1] + diff);

    return rounded;
};

const getStorage = (): Storage | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    if (props.persistence === 'local') {
        return window.localStorage;
    }
    if (props.persistence === 'session') {
        return window.sessionStorage;
    }

    return null;
};

const getResolvedPersistenceKey = () => {
    if (!props.persistenceKey) {
        return '';
    }

    return `vf-splitter:${props.persistenceKey}`;
};

const readPersistedSizes = (count: number) => {
    const storage = getStorage();
    const key = getResolvedPersistenceKey();

    if (!storage || !key || count <= 0) {
        return null;
    }

    try {
        const raw = storage.getItem(key);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length !== count || !parsed.every(isPositiveNumber)) {
            return null;
        }

        return normalizeTo100(parsed as Array<number>);
    } catch {
        return null;
    }
};

const persistSizes = (nextSizes: Array<number>) => {
    const storage = getStorage();
    const key = getResolvedPersistenceKey();

    if (!storage || !key || !nextSizes.length) {
        return;
    }

    try {
        storage.setItem(key, JSON.stringify(nextSizes.map(size => roundTo(size, 6))));
    } catch {
        // ignore persistence errors (quota/private mode)
    }
};

const getInitialSizes = (count: number) => {
    if (!count) {
        return [];
    }

    const external = props.modelValue;

    if (external.length === count && external.every(isPositiveNumber)) {
        return normalizeTo100(external);
    }

    const persisted = readPersistedSizes(count);
    if (persisted) {
        return persisted;
    }

    const panelSizes = panels.value.map(panel => panel.size);
    const defined = panelSizes.filter(isPositiveNumber) as Array<number>;

    if (!defined.length) {
        return normalizeTo100(Array.from({ length: count }, () => 1));
    }

    const sumDefined = defined.reduce((sum, item) => sum + item, 0);
    const missingCount = panelSizes.length - defined.length;
    const next: Array<number> = panelSizes.map(item => (isPositiveNumber(item) ? (item as number) : 0));

    if (sumDefined < 100 && missingCount > 0) {
        const missing = 100 - sumDefined;
        const fill = missing / missingCount;

        for (let i = 0; i < next.length; ++i) {
            if (!isPositiveNumber(panelSizes[i])) {
                next[i] = fill;
            }
        }

        return normalizeTo100(next);
    }

    return normalizeTo100(next);
};

const getMinSizes = () => {
    return panels.value.map((panel, index) => {
        const fromProp = props.minSizes[index];

        if (isPositiveNumber(fromProp)) {
            return fromProp as number;
        }

        if (isPositiveNumber(panel.minSize)) {
            return panel.minSize as number;
        }

        return 5;
    });
};

const syncSizes = () => {
    const count = panels.value.length;
    const initial = getInitialSizes(count);
    const next = applyMinSizes(initial, getMinSizes());

    sizes.value = next;
};

const getClass = computed(() => {
    const classes = ['vf-splitter', `vf-splitter_${props.direction}`];

    if (props.disabled) {
        classes.push('vf-splitter_disabled');
    }

    return classes;
});
const gutterCount = computed(() => Math.max(0, panels.value.length - 1));
const separatorOrientation = computed(() => (props.direction === 'horizontal' ? 'vertical' : 'horizontal'));
const resolvedGutterSize = computed(() => toCssSize(props.gutterSize));

const getPanelStyle = (id: string) => {
    const index = panels.value.findIndex(panel => panel.id === id);

    if (index < 0) {
        return undefined;
    }

    const size = `${sizes.value[index] ?? 0}%`;
    const minSize = `${getMinSizes()[index] ?? 0}%`;

    if (props.direction === 'vertical') {
        return {
            flex: `0 0 ${size}`,
            minHeight: minSize,
        };
    }

    return {
        flex: `0 0 ${size}`,
        minWidth: minSize,
    };
};

const getGutterOffset = (index: number) => {
    return sizes.value.slice(0, index + 1).reduce((sum, item) => sum + item, 0);
};
const getGutterStyle = (index: number) => {
    const offset = getGutterOffset(index);

    if (props.direction === 'vertical') {
        return {
            top: `calc(${offset}% - (${resolvedGutterSize.value} / 2))`,
            left: '0',
            right: '0',
            height: resolvedGutterSize.value,
        };
    }

    return {
        left: `calc(${offset}% - (${resolvedGutterSize.value} / 2))`,
        top: '0',
        bottom: '0',
        width: resolvedGutterSize.value,
    };
};
const getGutterAriaControls = (index: number) => {
    const first = panels.value[index]?.id;
    const second = panels.value[index + 1]?.id;

    return [first, second].filter(Boolean).join(' ') || undefined;
};
const getGutterAriaMin = (index: number) => {
    const mins = getMinSizes();

    return mins[index] ?? 0;
};
const getGutterAriaMax = (index: number) => {
    const mins = getMinSizes();
    const pairTotal = (sizes.value[index] ?? 0) + (sizes.value[index + 1] ?? 0);

    return Math.max(getGutterAriaMin(index), pairTotal - (mins[index + 1] ?? 0));
};

const applyResizeDelta = (index: number, deltaPercent: number, emitUpdate = true) => {
    const current = [...sizes.value];

    if (!current[index] || !current[index + 1]) {
        return;
    }

    const mins = getMinSizes();
    const pairTotal = current[index] + current[index + 1];
    const minA = mins[index] ?? 0;
    const minB = mins[index + 1] ?? 0;
    const nextA = clamp(current[index] + deltaPercent, minA, pairTotal - minB);
    const nextB = pairTotal - nextA;

    current[index] = roundTo(nextA);
    current[index + 1] = roundTo(nextB);

    const normalized = applyMinSizes(normalizeTo100(current), mins);

    sizes.value = normalized;
    persistSizes(normalized);

    if (emitUpdate) {
        emits('update:modelValue', [...normalized]);
    }
};

let startPoint = 0;
let startSizes: [number, number] = [0, 0];

const onMouseMove = (event: MouseEvent) => {
    if (dragIndex.value === null || !root.value) {
        return;
    }

    const bounds = root.value.getBoundingClientRect();
    const axisLength = props.direction === 'vertical' ? bounds.height : bounds.width;

    if (axisLength <= 0) {
        return;
    }

    const point = props.direction === 'vertical' ? event.clientY : event.clientX;
    const deltaPercent = ((point - startPoint) / axisLength) * 100;
    const rawA = startSizes[0] + deltaPercent;
    const appliedDelta = rawA - (sizes.value[dragIndex.value] ?? 0);

    applyResizeDelta(dragIndex.value, appliedDelta, true);
};

const stopDragging = () => {
    if (dragIndex.value === null) {
        return;
    }

    dragIndex.value = null;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', stopDragging);
    emits('change', [...sizes.value]);
};

const onGutterMouseDown = (event: MouseEvent, index: number) => {
    if (props.disabled || !root.value) {
        return;
    }

    event.stopPropagation();
    dragIndex.value = index;
    startPoint = props.direction === 'vertical' ? event.clientY : event.clientX;
    startSizes = [sizes.value[index] ?? 0, sizes.value[index + 1] ?? 0];
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDragging);
};

const onGutterKeydown = (event: KeyboardEvent, index: number) => {
    if (props.disabled) {
        return;
    }

    const decrementKeys = props.direction === 'horizontal' ? ['ArrowLeft', 'ArrowUp'] : ['ArrowUp', 'ArrowLeft'];
    const incrementKeys = props.direction === 'horizontal' ? ['ArrowRight', 'ArrowDown'] : ['ArrowDown', 'ArrowRight'];

    if (![...decrementKeys, ...incrementKeys, 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.key === 'Home') {
        const mins = getMinSizes();
        const current = sizes.value[index] ?? 0;
        const target = mins[index] ?? 0;

        applyResizeDelta(index, target - current);
    } else if (event.key === 'End') {
        const mins = getMinSizes();
        const total = (sizes.value[index] ?? 0) + (sizes.value[index + 1] ?? 0);
        const current = sizes.value[index] ?? 0;
        const target = total - (mins[index + 1] ?? 0);

        applyResizeDelta(index, target - current);
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
        const step = event.shiftKey ? 25 : 10;
        const delta = event.key === 'PageDown' ? step : -step;

        applyResizeDelta(index, delta);
    } else {
        const step = event.shiftKey ? 5 : 2;
        const delta = incrementKeys.includes(event.key) ? step : -step;

        applyResizeDelta(index, delta);
    }

    emits('change', [...sizes.value]);
};

const registerPanel = (config: Omit<SplitterPanelConfig, 'id'>) => {
    const id = `vf-splitter-panel-${++splitterPanelIdCounter}`;

    panels.value.push({
        id,
        size: config.size,
        minSize: config.minSize,
    });
    syncSizes();

    return id;
};
const unregisterPanel = (id: string) => {
    panels.value = panels.value.filter(panel => panel.id !== id);
    syncSizes();
};

provide(splitterKey, {
    direction: computed(() => props.direction),
    disabled: computed(() => props.disabled),
    registerPanel,
    unregisterPanel,
    getPanelStyle,
});

watch(
    () => props.modelValue,
    () => {
        if (dragIndex.value !== null) {
            return;
        }

        if (props.modelValue.length === panels.value.length && props.modelValue.every(isPositiveNumber)) {
            sizes.value = applyMinSizes(normalizeTo100(props.modelValue), getMinSizes());
        }
    },
    { deep: true },
);
watch(
    () => props.minSizes,
    () => {
        const next = applyMinSizes(normalizeTo100(sizes.value), getMinSizes());

        sizes.value = next;
        persistSizes(next);
    },
    { deep: true },
);

onBeforeUnmount(() => {
    stopDragging();
});
</script>

<style lang="scss">
.vf-splitter {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    border: var(--vf-border-width) solid var(--vf-splitter-border-color);
    border-radius: var(--vf-splitter-border-radius);
    overflow: hidden;
}

.vf-splitter_horizontal {
    flex-direction: row;
}

.vf-splitter_vertical {
    flex-direction: column;
}

.vf-splitter__gutter {
    position: absolute;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: col-resize;
    background: transparent;
    outline: none;
}

.vf-splitter_vertical .vf-splitter__gutter {
    cursor: row-resize;
}

.vf-splitter__gutter::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: transparent;
    transition: background-color 0.2s ease;
}

.vf-splitter__gutter-handle {
    position: relative;
    display: block;
    width: var(--vf-splitter-handle-width);
    height: var(--vf-splitter-handle-height);
    border-radius: var(--vf-splitter-handle-radius);
    background-color: var(--vf-splitter-handle-color);
}

.vf-splitter_horizontal .vf-splitter__gutter-handle {
    width: var(--vf-splitter-handle-width);
    height: var(--vf-splitter-handle-height);
}

.vf-splitter_vertical .vf-splitter__gutter-handle {
    width: var(--vf-splitter-handle-height);
    height: var(--vf-splitter-handle-width);
}

.vf-splitter__gutter:hover::before,
.vf-splitter__gutter:focus-visible::before,
.vf-splitter__gutter.is-dragging::before {
    background-color: var(--vf-splitter-gutter-active-background-color);
}

.vf-splitter_disabled {
    opacity: var(--vf-splitter-disabled-opacity);
}

.vf-splitter_disabled .vf-splitter__gutter {
    pointer-events: none;
}
</style>
