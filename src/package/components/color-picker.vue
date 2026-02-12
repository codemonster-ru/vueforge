<template>
    <div ref="root" :class="getClass">
        <button
            class="vf-color-picker__control"
            type="button"
            :disabled="disabled"
            :aria-expanded="open"
            :aria-label="ariaLabel"
            @click="togglePanel"
        >
            <span class="vf-color-picker__swatch" :style="{ backgroundColor: previewColor }" />
            <span class="vf-color-picker__value">{{ displayValue }}</span>
            <span class="vf-color-picker__chevron">▾</span>
        </button>
        <div v-if="open" class="vf-color-picker__panel">
            <div class="vf-color-picker__row">
                <input class="vf-color-picker__native" type="color" :value="hexColor" @input="onColorInput" />
            </div>
            <div v-if="alpha" class="vf-color-picker__row">
                <input
                    class="vf-color-picker__alpha"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    :value="alphaPercent"
                    @input="onAlphaInput"
                />
                <span class="vf-color-picker__alpha-value">{{ alphaPercent }}%</span>
            </div>
            <div class="vf-color-picker__row">
                <input
                    class="vf-color-picker__text"
                    type="text"
                    :placeholder="placeholder"
                    :value="displayValue"
                    @change="onTextChange"
                />
            </div>
            <div v-if="presets.length" class="vf-color-picker__presets">
                <button
                    v-for="(preset, index) in presets"
                    :key="`${preset}-${index}`"
                    class="vf-color-picker__preset"
                    type="button"
                    :style="{ backgroundColor: parseColor(preset).preview }"
                    @click="onPresetClick(preset)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type Format = 'hex' | 'rgb' | 'hsl';

interface Props {
    modelValue?: string;
    format?: Format;
    alpha?: boolean;
    presets?: Array<string>;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    size?: Size;
    variant?: Variant;
    ariaLabel?: string;
}

interface ParsedColor {
    r: number;
    g: number;
    b: number;
    a: number;
    valid: boolean;
    preview: string;
}

const emits = defineEmits(['update:modelValue', 'change', 'open', 'close']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: '#3b82f6',
    format: 'hex',
    alpha: false,
    presets: () => [],
    placeholder: '#3b82f6',
    disabled: false,
    readonly: false,
    size: 'normal',
    variant: 'filled',
    ariaLabel: 'Color picker',
});

const root = ref<HTMLElement | null>(null);
const open = ref(false);
const hexColor = ref('#3b82f6');
const alphaPercent = ref(100);

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const toHex = (value: number) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');

const parseHex = (value: string): ParsedColor | null => {
    const normalized = value.trim().replace(/^#/, '');

    if (![3, 4, 6, 8].includes(normalized.length)) {
        return null;
    }

    let expanded = normalized;

    if (normalized.length === 3 || normalized.length === 4) {
        expanded = normalized
            .split('')
            .map(char => `${char}${char}`)
            .join('');
    }

    if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(expanded)) {
        return null;
    }

    const r = Number.parseInt(expanded.slice(0, 2), 16);
    const g = Number.parseInt(expanded.slice(2, 4), 16);
    const b = Number.parseInt(expanded.slice(4, 6), 16);
    const a = expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1;

    return { r, g, b, a, valid: true, preview: `rgba(${r}, ${g}, ${b}, ${a})` };
};

const parseRgb = (value: string): ParsedColor | null => {
    const match = value.trim().match(/^rgba?\((.*)\)$/i);

    if (!match) {
        return null;
    }

    const parts = match[1].split(',').map(item => item.trim());

    if (parts.length !== 3 && parts.length !== 4) {
        return null;
    }

    const r = Number(parts[0]);
    const g = Number(parts[1]);
    const b = Number(parts[2]);
    const a = parts.length === 4 ? Number(parts[3]) : 1;

    if (![r, g, b, a].every(Number.isFinite)) {
        return null;
    }

    const cr = clamp(r, 0, 255);
    const cg = clamp(g, 0, 255);
    const cb = clamp(b, 0, 255);
    const ca = clamp(a, 0, 1);

    return { r: cr, g: cg, b: cb, a: ca, valid: true, preview: `rgba(${cr}, ${cg}, ${cb}, ${ca})` };
};

const hslToRgb = (h: number, s: number, l: number) => {
    const hs = ((h % 360) + 360) % 360;
    const sn = clamp(s, 0, 100) / 100;
    const ln = clamp(l, 0, 100) / 100;
    const c = (1 - Math.abs(2 * ln - 1)) * sn;
    const x = c * (1 - Math.abs(((hs / 60) % 2) - 1));
    const m = ln - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (hs < 60) {
        r = c;
        g = x;
    } else if (hs < 120) {
        r = x;
        g = c;
    } else if (hs < 180) {
        g = c;
        b = x;
    } else if (hs < 240) {
        g = x;
        b = c;
    } else if (hs < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    };
};

const rgbToHsl = (r: number, g: number, b: number) => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    let h = 0;

    if (delta !== 0) {
        if (max === rn) {
            h = ((gn - bn) / delta) % 6;
        } else if (max === gn) {
            h = (bn - rn) / delta + 2;
        } else {
            h = (rn - gn) / delta + 4;
        }

        h *= 60;
    }

    if (h < 0) {
        h += 360;
    }

    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const parseHsl = (value: string): ParsedColor | null => {
    const match = value.trim().match(/^hsla?\((.*)\)$/i);

    if (!match) {
        return null;
    }

    const parts = match[1].split(',').map(item => item.trim().replace('%', ''));

    if (parts.length !== 3 && parts.length !== 4) {
        return null;
    }

    const h = Number(parts[0]);
    const s = Number(parts[1]);
    const l = Number(parts[2]);
    const a = parts.length === 4 ? Number(parts[3]) : 1;

    if (![h, s, l, a].every(Number.isFinite)) {
        return null;
    }

    const rgb = hslToRgb(h, s, l);
    const ca = clamp(a, 0, 1);

    return { ...rgb, a: ca, valid: true, preview: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${ca})` };
};

const parseColor = (value: string): ParsedColor => {
    const parsed = parseHex(value) ?? parseRgb(value) ?? parseHsl(value);

    if (!parsed) {
        return { r: 59, g: 130, b: 246, a: 1, valid: false, preview: 'rgba(59, 130, 246, 1)' };
    }

    return parsed;
};

const formatColor = (r: number, g: number, b: number, a: number) => {
    if (props.format === 'rgb') {
        return props.alpha ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})` : `rgb(${r}, ${g}, ${b})`;
    }

    if (props.format === 'hsl') {
        const hsl = rgbToHsl(r, g, b);

        return props.alpha
            ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a.toFixed(2)})`
            : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }

    const base = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

    if (!props.alpha) {
        return base;
    }

    return `${base}${toHex(a * 255)}`;
};

const syncFromModel = (value: string) => {
    const parsed = parseColor(value);

    hexColor.value = `#${toHex(parsed.r)}${toHex(parsed.g)}${toHex(parsed.b)}`;
    alphaPercent.value = Math.round(clamp(parsed.a, 0, 1) * 100);
};

watch(
    () => props.modelValue,
    value => {
        syncFromModel(value);
    },
    { immediate: true },
);

const previewColor = computed(() => {
    const parsed = parseColor(hexColor.value);

    return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${props.alpha ? alphaPercent.value / 100 : 1})`;
});

const displayValue = computed(() => {
    const parsed = parseColor(hexColor.value);
    const alphaValue = props.alpha ? alphaPercent.value / 100 : 1;

    return formatColor(parsed.r, parsed.g, parsed.b, alphaValue);
});

const getClass = computed(() => {
    const classes = ['vf-color-picker', `vf-color-picker_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-color-picker_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-color-picker_disabled');
    }

    return classes;
});

const emitColor = () => {
    const parsed = parseColor(hexColor.value);
    const alphaValue = props.alpha ? alphaPercent.value / 100 : 1;
    const value = formatColor(parsed.r, parsed.g, parsed.b, alphaValue);

    emits('update:modelValue', value);
    emits('change', value);
};

const onColorInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    hexColor.value = target.value;

    emitColor();
};

const onAlphaInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    alphaPercent.value = clamp(Number(target.value), 0, 100);

    emitColor();
};

const onTextChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const parsed = parseColor(target.value);

    if (!parsed.valid) {
        target.value = displayValue.value;

        return;
    }

    hexColor.value = `#${toHex(parsed.r)}${toHex(parsed.g)}${toHex(parsed.b)}`;

    if (props.alpha) {
        alphaPercent.value = Math.round(parsed.a * 100);
    }

    emitColor();
};

const onPresetClick = (preset: string) => {
    if (props.disabled || props.readonly) {
        return;
    }

    const parsed = parseColor(preset);

    if (!parsed.valid) {
        return;
    }

    hexColor.value = `#${toHex(parsed.r)}${toHex(parsed.g)}${toHex(parsed.b)}`;

    if (props.alpha) {
        alphaPercent.value = Math.round(parsed.a * 100);
    }

    emitColor();
};

const closePanel = () => {
    if (!open.value) {
        return;
    }

    open.value = false;

    emits('close');
};

const openPanel = () => {
    if (open.value || props.disabled || props.readonly) {
        return;
    }

    open.value = true;

    emits('open');
};

const togglePanel = () => {
    if (open.value) {
        closePanel();
    } else {
        openPanel();
    }
};

const onDocumentClick = (event: MouseEvent) => {
    if (!open.value || !root.value) {
        return;
    }

    if (root.value.contains(event.target as Node)) {
        return;
    }

    closePanel();
};

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
});
</script>

<style lang="scss">
.vf-color-picker {
    position: relative;
    display: inline-block;
    min-width: var(--vf-color-picker-min-width);
}

.vf-color-picker__control {
    display: flex;
    align-items: center;
    gap: var(--vf-color-picker-gap);
    width: 100%;
    padding: var(--vf-color-picker-padding);
    border-radius: var(--vf-color-picker-border-radius);
    border: var(--vf-border-width) solid var(--vf-color-picker-border-color);
    background-color: var(--vf-color-picker-background-color);
    color: var(--vf-color-picker-text-color);
    font-size: var(--vf-color-picker-font-size);
    font-family: inherit;
    cursor: pointer;
}

.vf-color-picker__control:hover:not(:disabled) {
    border-color: var(--vf-color-picker-hover-border-color);
}

.vf-color-picker__control:focus-visible {
    border-color: var(--vf-color-picker-focus-border-color);
    box-shadow: var(--vf-color-picker-focus-ring-shadow);
    outline: none;
}

.vf-color-picker__swatch {
    width: var(--vf-color-picker-swatch-size);
    height: var(--vf-color-picker-swatch-size);
    border-radius: var(--vf-color-picker-swatch-radius);
    border: var(--vf-border-width) solid var(--vf-color-picker-preset-border-color);
    flex-shrink: 0;
}

.vf-color-picker__value {
    flex: 1;
    text-align: left;
}

.vf-color-picker__panel {
    position: absolute;
    z-index: 20;
    top: calc(100% + 0.35rem);
    left: 0;
    width: 100%;
    min-width: var(--vf-color-picker-min-width);
    padding: var(--vf-color-picker-panel-padding);
    border-radius: var(--vf-color-picker-border-radius);
    border: var(--vf-border-width) solid var(--vf-color-picker-panel-border-color);
    background-color: var(--vf-color-picker-panel-background-color);
    box-shadow: var(--vf-color-picker-panel-shadow);
    display: grid;
    gap: var(--vf-color-picker-panel-gap);
}

.vf-color-picker__row {
    display: flex;
    align-items: center;
    gap: var(--vf-color-picker-gap);
}

.vf-color-picker__native {
    width: 100%;
    height: 2rem;
    border: none;
    background: transparent;
    padding: 0;
}

.vf-color-picker__alpha {
    flex: 1;
    accent-color: var(--vf-color-picker-range-accent-color);
}

.vf-color-picker__alpha-value {
    min-width: 2.5rem;
    text-align: right;
    font-size: 0.85em;
}

.vf-color-picker__text {
    width: 100%;
    box-sizing: border-box;
    padding: var(--vf-color-picker-padding);
    border-radius: var(--vf-color-picker-border-radius);
    border: var(--vf-border-width) solid var(--vf-color-picker-border-color);
    background-color: var(--vf-color-picker-background-color);
    color: var(--vf-color-picker-text-color);
    font: inherit;
}

.vf-color-picker__text::placeholder {
    color: var(--vf-color-picker-placeholder-color);
}

.vf-color-picker__text:focus {
    border-color: var(--vf-color-picker-focus-border-color);
    box-shadow: var(--vf-color-picker-focus-ring-shadow);
    outline: none;
}

.vf-color-picker__presets {
    display: flex;
    flex-wrap: wrap;
    gap: var(--vf-color-picker-gap);
}

.vf-color-picker__preset {
    width: var(--vf-color-picker-preset-size);
    height: var(--vf-color-picker-preset-size);
    border-radius: var(--vf-color-picker-preset-radius);
    border: var(--vf-border-width) solid var(--vf-color-picker-preset-border-color);
    cursor: pointer;
}

.vf-color-picker__preset:hover {
    border-color: var(--vf-color-picker-preset-hover-border-color);
}

.vf-color-picker_outlined .vf-color-picker__control,
.vf-color-picker_outlined .vf-color-picker__text {
    background-color: transparent;
}

.vf-color-picker_small .vf-color-picker__control,
.vf-color-picker_small .vf-color-picker__text {
    padding: var(--vf-color-picker-small-padding);
    font-size: var(--vf-color-picker-small-font-size);
}

.vf-color-picker_small .vf-color-picker__swatch {
    width: var(--vf-color-picker-small-swatch-size);
    height: var(--vf-color-picker-small-swatch-size);
}

.vf-color-picker_small .vf-color-picker__preset {
    width: var(--vf-color-picker-small-preset-size);
    height: var(--vf-color-picker-small-preset-size);
}

.vf-color-picker_large .vf-color-picker__control,
.vf-color-picker_large .vf-color-picker__text {
    padding: var(--vf-color-picker-large-padding);
    font-size: var(--vf-color-picker-large-font-size);
}

.vf-color-picker_large .vf-color-picker__swatch {
    width: var(--vf-color-picker-large-swatch-size);
    height: var(--vf-color-picker-large-swatch-size);
}

.vf-color-picker_large .vf-color-picker__preset {
    width: var(--vf-color-picker-large-preset-size);
    height: var(--vf-color-picker-large-preset-size);
}

.vf-color-picker_disabled {
    opacity: var(--vf-color-picker-disabled-opacity);
}

.vf-color-picker_disabled .vf-color-picker__control {
    cursor: not-allowed;
}
</style>
