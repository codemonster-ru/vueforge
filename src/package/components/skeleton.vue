<template>
    <div v-if="!isPreset" :class="getClass" :style="inlineStyle" aria-hidden="true" />
    <div v-else :class="presetClass" :style="presetStyle" aria-hidden="true">
        <template v-if="props.preset === 'table'">
            <div class="vf-skeleton-preset__table-header">
                <div v-for="column in normalizedTableColumns" :key="`th-${column}`" class="vf-skeleton__block" />
            </div>
            <div v-for="row in normalizedTableRows" :key="`tr-${row}`" class="vf-skeleton-preset__table-row">
                <div v-for="column in normalizedTableColumns" :key="`td-${row}-${column}`" class="vf-skeleton__block" />
            </div>
        </template>

        <template v-else-if="props.preset === 'list'">
            <div v-for="row in normalizedListRows" :key="`list-${row}`" class="vf-skeleton-preset__list-row">
                <div class="vf-skeleton__block vf-skeleton__block_circle" />
                <div class="vf-skeleton-preset__list-lines">
                    <div class="vf-skeleton__block" />
                    <div class="vf-skeleton__block vf-skeleton-preset__list-secondary" />
                </div>
            </div>
        </template>

        <template v-else-if="props.preset === 'form'">
            <div v-for="row in normalizedFormRows" :key="`form-${row}`" class="vf-skeleton-preset__form-row">
                <div class="vf-skeleton__block vf-skeleton-preset__form-label" />
                <div class="vf-skeleton__block vf-skeleton-preset__form-field" />
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'text' | 'rect' | 'circle';
type Preset = 'none' | 'table' | 'list' | 'form';

interface Props {
    width?: string | number;
    height?: string | number;
    variant?: Variant;
    animated?: boolean;
    preset?: Preset;
    tableRows?: number;
    tableColumns?: number;
    listRows?: number;
    formRows?: number;
}

const props = withDefaults(defineProps<Props>(), {
    width: '',
    height: '',
    variant: 'text',
    animated: true,
    preset: 'none',
    tableRows: 4,
    tableColumns: 4,
    listRows: 4,
    formRows: 4,
});

const normalizeSize = (value?: string | number) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }

    return typeof value === 'number' ? `${value}px` : value;
};

const inlineStyle = computed(() => {
    const width = normalizeSize(props.width);
    const height = normalizeSize(props.height);
    const style: Record<string, string> = {};

    if (width) {
        style.width = width;
    }
    if (height) {
        style.height = height;
    }

    if (props.variant === 'circle') {
        if (!width && height) {
            style.width = height;
        }

        if (!height && width) {
            style.height = width;
        }
    }

    return style;
});

const getClass = computed(() => {
    const classes = ['vf-skeleton', `vf-skeleton_${props.variant}`];

    if (props.animated) {
        classes.push('vf-skeleton_animated');
    }

    return classes;
});

const isPreset = computed(() => props.preset !== 'none');
const normalizedTableRows = computed(() => Math.max(1, props.tableRows));
const normalizedTableColumns = computed(() => Math.max(1, props.tableColumns));
const normalizedListRows = computed(() => Math.max(1, props.listRows));
const normalizedFormRows = computed(() => Math.max(1, props.formRows));

const presetClass = computed(() => {
    const classes = ['vf-skeleton-preset', `vf-skeleton-preset_${props.preset}`];

    if (props.animated) {
        classes.push('vf-skeleton-preset_animated');
    }

    return classes;
});

const presetStyle = computed(() => ({
    '--vf-skeleton-preset-table-columns': String(normalizedTableColumns.value),
}));
</script>

<style lang="scss">
@keyframes vf-skeleton-shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

.vf-skeleton {
    display: block;
    width: var(--vf-skeleton-width);
    height: var(--vf-skeleton-height);
    border-radius: var(--vf-skeleton-border-radius);
    background: linear-gradient(
        90deg,
        var(--vf-skeleton-background-color) 0%,
        var(--vf-skeleton-shimmer-color) 50%,
        var(--vf-skeleton-background-color) 100%
    );
    background-size: 200% 100%;
}

.vf-skeleton_animated {
    animation: vf-skeleton-shimmer var(--vf-skeleton-animation-duration) ease-in-out infinite;
}

.vf-skeleton_text {
    height: var(--vf-skeleton-line-height);
}

.vf-skeleton_circle {
    border-radius: 50%;
}

.vf-skeleton__block {
    border-radius: var(--vf-skeleton-border-radius);
    background: linear-gradient(
        90deg,
        var(--vf-skeleton-background-color) 0%,
        var(--vf-skeleton-shimmer-color) 50%,
        var(--vf-skeleton-background-color) 100%
    );
    background-size: 200% 100%;
}

.vf-skeleton__block_circle {
    border-radius: 50%;
}

.vf-skeleton-preset_animated .vf-skeleton__block {
    animation: vf-skeleton-shimmer var(--vf-skeleton-animation-duration) ease-in-out infinite;
}

.vf-skeleton-preset {
    display: grid;
    gap: var(--vf-skeleton-preset-gap);
}

.vf-skeleton-preset__table-header,
.vf-skeleton-preset__table-row {
    display: grid;
    grid-template-columns: repeat(var(--vf-skeleton-preset-table-columns), minmax(0, 1fr));
    gap: var(--vf-skeleton-preset-gap);
}

.vf-skeleton-preset__table-header .vf-skeleton__block {
    height: var(--vf-skeleton-preset-table-header-height);
}

.vf-skeleton-preset__table-row .vf-skeleton__block {
    height: var(--vf-skeleton-preset-table-row-height);
}

.vf-skeleton-preset__list-row {
    display: grid;
    grid-template-columns: var(--vf-skeleton-preset-list-avatar-size) minmax(0, 1fr);
    gap: var(--vf-skeleton-preset-gap);
    align-items: center;
}

.vf-skeleton-preset__list-row > .vf-skeleton__block_circle {
    width: var(--vf-skeleton-preset-list-avatar-size);
    height: var(--vf-skeleton-preset-list-avatar-size);
}

.vf-skeleton-preset__list-lines {
    display: grid;
    gap: calc(var(--vf-skeleton-preset-gap) * 0.6);
}

.vf-skeleton-preset__list-lines .vf-skeleton__block {
    height: var(--vf-skeleton-preset-list-line-height);
}

.vf-skeleton-preset__list-secondary {
    width: var(--vf-skeleton-preset-list-secondary-width);
}

.vf-skeleton-preset__form-row {
    display: grid;
    gap: calc(var(--vf-skeleton-preset-gap) * 0.6);
}

.vf-skeleton-preset__form-label {
    width: var(--vf-skeleton-preset-form-label-width);
    height: var(--vf-skeleton-preset-form-label-height);
}

.vf-skeleton-preset__form-field {
    width: 100%;
    height: var(--vf-skeleton-preset-form-field-height);
}
</style>
