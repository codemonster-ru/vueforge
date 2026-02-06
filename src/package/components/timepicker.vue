<template>
    <div ref="root" :class="getClass">
        <button
            ref="control"
            class="vf-timepicker__control"
            type="button"
            :disabled="disabled"
            :aria-expanded="open"
            :aria-controls="panelId"
            aria-haspopup="listbox"
            @click="togglePanel"
            @keydown.down.prevent="openAndFocus"
            @keydown.enter.prevent="togglePanel"
            @keydown.esc.prevent="close"
            @focus="onFocus"
            @blur="onBlur"
        >
            <span class="vf-timepicker__label" :class="{ 'vf-timepicker__label_placeholder': !selectedLabel }">
                {{ selectedLabel || placeholder }}
            </span>
            <span class="vf-timepicker__chevron" aria-hidden="true">&#9662;</span>
        </button>
        <Teleport to="body">
            <div
                v-show="open"
                :id="panelId"
                ref="panel"
                class="vf-timepicker__panel"
                role="listbox"
                :data-placement="currentPlacement"
            >
                <button
                    v-for="option in options"
                    :key="option.value"
                    class="vf-timepicker__option"
                    :class="{ 'is-active': option.isSelected, 'is-disabled': option.isDisabled }"
                    type="button"
                    role="option"
                    :data-time="option.value"
                    :disabled="option.isDisabled"
                    :aria-selected="option.isSelected"
                    @click="selectTime(option.value)"
                >
                    {{ option.label }}
                </button>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { autoUpdate, computePosition, flip, offset } from '@codemonster-ru/floater.js';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type TimeFormat = '24h' | '12h';
type Placement = 'bottom' | 'top';

let timePickerIdCounter = 0;

interface Props {
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    min?: string;
    max?: string;
    step?: number;
    format?: TimeFormat;
    variant?: Variant;
    size?: Size;
}

interface TimeOption {
    value: string;
    label: string;
    minutes: number;
    isSelected: boolean;
    isDisabled: boolean;
}

type FloaterInstance = {
    update: () => Promise<void>;
    destroy: () => void;
} | null;

const emits = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    placeholder: '',
    disabled: false,
    readonly: false,
    min: undefined,
    max: undefined,
    step: 30,
    format: '24h',
    variant: 'filled',
    size: 'normal',
});

const root = ref<HTMLElement | null>(null);
const control = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const open = ref(false);
const basePlacement = ref<Placement>('bottom');
const currentPlacement = ref<Placement>('bottom');
const panelId = `vf-timepicker-panel-${++timePickerIdCounter}`;
let floater: FloaterInstance = null;

const minMinutes = computed(() => parseTime(props.min));
const maxMinutes = computed(() => parseTime(props.max));
const selectedMinutes = computed(() => parseTime(props.modelValue));
const selectedLabel = computed(() => {
    if (selectedMinutes.value === null) {
        return '';
    }

    return formatLabel(selectedMinutes.value, props.format);
});
const stepMinutes = computed(() => {
    if (!props.step || props.step <= 0) {
        return 30;
    }

    return Math.min(Math.max(Math.round(props.step), 1), 1440);
});
const options = computed<Array<TimeOption>>(() => {
    const result: Array<TimeOption> = [];
    const step = stepMinutes.value;
    const min = minMinutes.value;
    const max = maxMinutes.value;

    for (let minutes = 0; minutes < 1440; minutes += step) {
        const value = formatTime(minutes);

        result.push({
            value,
            minutes,
            label: formatLabel(minutes, props.format),
            isSelected: selectedMinutes.value === minutes,
            isDisabled: isDisabled(minutes, min, max),
        });
    }

    return result;
});
const getClass = computed(() => {
    const classes = ['vf-timepicker', `vf-timepicker_${props.variant}`, open.value ? 'vf-timepicker_open' : ''];

    if (props.size !== 'normal') {
        classes.push(`vf-timepicker_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-timepicker_disabled');
    }

    return classes.filter(Boolean);
});

const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

const openPanel = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    open.value = true;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';
};

const close = () => {
    open.value = false;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';
};

const togglePanel = () => {
    if (open.value) {
        close();

        return;
    }

    openPanel();
};

const openAndFocus = async () => {
    if (!open.value) {
        openPanel();

        await nextTick();
    }

    panel.value?.querySelector<HTMLButtonElement>('.vf-timepicker__option:not(.is-disabled)')?.focus();
};

const selectTime = (value: string) => {
    if (props.readonly) {
        return;
    }

    const minutes = parseTime(value);

    if (minutes === null || isDisabled(minutes, minMinutes.value, maxMinutes.value)) {
        return;
    }

    emits('update:modelValue', value);
    emits('change', value);

    close();
};

const onDocumentClick = (event: MouseEvent) => {
    if (!open.value || !root.value) {
        return;
    }

    const target = event.target as Node;

    if (root.value.contains(target) || panel.value?.contains(target)) {
        return;
    }

    close();
};

const mountFloater = () => {
    if (!control.value || !panel.value) {
        return;
    }

    const reference = control.value;
    const floating = panel.value;

    const applyPosition = async () => {
        const {
            x,
            y,
            placement: resolvedPlacement,
        } = await computePosition(reference, floating, {
            placement: basePlacement.value,
            strategy: 'fixed',
            middleware: [offset(2), flip({ placements: ['bottom', 'top'] })],
        });

        currentPlacement.value = (resolvedPlacement as Placement) ?? basePlacement.value;
        const referenceWidth = reference.getBoundingClientRect().width;

        floating.style.minWidth = `${referenceWidth}px`;
        floating.style.width = `${referenceWidth}px`;
        floating.style.left = `${x}px`;
        floating.style.top = `${y}px`;
    };
    const update = async () => {
        await applyPosition();
    };

    const cleanup = autoUpdate(reference, () => {
        void update();
    });

    const onScrollOrResize = () => {
        void update();
    };

    document.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize, false);

    floater = {
        update,
        destroy: () => {
            cleanup();
            document.removeEventListener('scroll', onScrollOrResize, true);
            window.removeEventListener('resize', onScrollOrResize, false);
        },
    };

    void floater.update();
};

const scrollSelectedIntoView = () => {
    if (!panel.value || selectedMinutes.value === null) {
        return;
    }

    const selected = panel.value.querySelector<HTMLElement>(`[data-time="${formatTime(selectedMinutes.value)}"]`);

    if (!selected || typeof selected.scrollIntoView !== 'function') {
        return;
    }

    selected.scrollIntoView({ block: 'nearest' });
};

watch(open, async value => {
    if (!value) {
        if (floater) {
            floater.destroy();
            floater = null;
        }

        return;
    }

    await nextTick();

    if (!floater) {
        mountFloater();
    }

    void floater?.update();

    scrollSelectedIntoView();
});

watch(
    () => [props.min, props.max, props.step],
    () => {
        void floater?.update();
    },
);

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    floater?.destroy();
    floater = null;
});

function parseTime(value?: string) {
    if (!value) {
        return null;
    }

    const match = value.match(/^(\d{2}):(\d{2})$/);

    if (!match) {
        return null;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return null;
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return null;
    }

    return hours * 60 + minutes;
}

function formatTime(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function formatLabel(totalMinutes: number, format: TimeFormat) {
    if (format === '12h') {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        const normalized = hours % 12 || 12;

        return `${normalized}:${String(minutes).padStart(2, '0')} ${period}`;
    }

    return formatTime(totalMinutes);
}

function isDisabled(value: number, min: number | null, max: number | null) {
    if (min !== null && value < min) {
        return true;
    }

    if (max !== null && value > max) {
        return true;
    }

    return false;
}
</script>

<style lang="scss">
.vf-timepicker {
    position: relative;
    display: inline-block;
    min-width: var(--vf-timepicker-min-width);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border-radius: var(--vf-timepicker-border-radius);
    border: var(--vf-border-width) solid var(--vf-timepicker-border-color);
    background-color: var(--vf-timepicker-background-color);
    color: var(--vf-timepicker-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-timepicker_outlined {
    background-color: transparent;
}

.vf-timepicker__control {
    width: 100%;
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border: none;
    background: transparent;
    color: inherit;
    padding: var(--vf-timepicker-padding);
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-timepicker-control-gap);
    font-size: var(--vf-timepicker-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    cursor: pointer;
    outline: none;
}

.vf-timepicker__label {
    text-align: left;
}

.vf-timepicker__label_placeholder {
    color: var(--vf-timepicker-placeholder-color);
}

.vf-timepicker__chevron {
    font-size: var(--vf-timepicker-chevron-size);
    opacity: 0.7;
}

.vf-timepicker__panel {
    position: fixed;
    z-index: 50;
    padding: var(--vf-timepicker-panel-padding);
    max-height: var(--vf-timepicker-panel-max-height);
    overflow: auto;
    border-radius: calc(var(--vf-timepicker-border-radius) + var(--vf-timepicker-panel-radius-offset));
    border: var(--vf-border-width) solid var(--vf-timepicker-panel-border-color);
    background-color: var(--vf-timepicker-panel-background-color);
    box-shadow: var(--vf-timepicker-panel-shadow);
    color: var(--vf-timepicker-text-color);
}

.vf-timepicker__option {
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    padding: var(--vf-timepicker-option-padding);
    border-radius: var(--vf-timepicker-option-border-radius);
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-typography-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
}

.vf-timepicker__option:hover:not(.is-disabled),
.vf-timepicker__option:focus-visible:not(.is-disabled) {
    background-color: var(--vf-timepicker-option-hover-background-color);
    outline: none;
}

.vf-timepicker__option.is-active {
    background-color: var(--vf-timepicker-option-active-background-color);
    color: var(--vf-timepicker-option-active-text-color);
}

.vf-timepicker__option.is-disabled {
    opacity: var(--vf-timepicker-disabled-opacity);
    cursor: not-allowed;
}

.vf-timepicker_open {
    border-color: var(--vf-timepicker-focus-border-color);
    box-shadow: var(--vf-timepicker-focus-ring-shadow);
}

.vf-timepicker:hover:not(.vf-timepicker_disabled) {
    border-color: var(--vf-timepicker-hover-border-color);
}

.vf-timepicker:focus-within:not(.vf-timepicker_disabled) {
    border-color: var(--vf-timepicker-focus-border-color);
}

.vf-timepicker_small {
    .vf-timepicker__control {
        padding: var(--vf-timepicker-small-padding);
        font-size: var(--vf-timepicker-small-font-size);
    }
}

.vf-timepicker_large {
    .vf-timepicker__control {
        padding: var(--vf-timepicker-large-padding);
        font-size: var(--vf-timepicker-large-font-size);
    }
}

.vf-timepicker_disabled {
    opacity: var(--vf-timepicker-disabled-opacity);
    cursor: not-allowed;

    .vf-timepicker__control {
        cursor: not-allowed;
    }
}
</style>
