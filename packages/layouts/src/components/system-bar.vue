<template>
    <component
        :is="as"
        class="vf-system-bar"
        :class="rootClass"
        :style="rootStyle"
        :role="landmarkRole"
        :aria-label="ariaLabel || undefined"
    >
        <div v-if="$slots.start" class="vf-system-bar__start" role="group" :aria-label="startAriaLabel || undefined">
            <slot name="start" />
        </div>
        <div class="vf-system-bar__center" role="group" :aria-label="centerAriaLabel || undefined">
            <slot>
                <slot name="center" />
            </slot>
        </div>
        <div v-if="$slots.end" class="vf-system-bar__end" role="group" :aria-label="endAriaLabel || undefined">
            <slot name="end" />
        </div>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    as?: string;
    fixed?: boolean;
    sticky?: boolean;
    dense?: boolean;
    bordered?: boolean;
    ariaLabel?: string;
    startAriaLabel?: string;
    centerAriaLabel?: string;
    endAriaLabel?: string;
    zIndex?: string | number;
}

defineOptions({ name: 'VfSystemBar' });

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    fixed: false,
    sticky: false,
    dense: false,
    bordered: true,
    ariaLabel: 'System bar',
    startAriaLabel: 'System status',
    centerAriaLabel: 'System bar content',
    endAriaLabel: 'System actions',
    zIndex: '',
});

const landmarkRole = computed(() => {
    if (props.as.toLowerCase() === 'header') {
        return undefined;
    }

    return 'region';
});

const rootClass = computed(() => [
    {
        'vf-system-bar_fixed': props.fixed,
        'vf-system-bar_sticky': !props.fixed && props.sticky,
        'vf-system-bar_dense': props.dense,
        'vf-system-bar_bordered': props.bordered,
    },
]);

const rootStyle = computed(() => {
    const styles: Record<string, string> = {};

    if (props.zIndex !== '') {
        styles['--vf-system-bar-z-index-prop'] = String(props.zIndex);
    }

    return styles;
});
</script>

<style lang="scss">
.vf-system-bar {
    min-height: var(--vf-system-bar-height);
    padding: var(--vf-system-bar-padding);
    display: flex;
    align-items: center;
    gap: var(--vf-system-bar-gap);
    background-color: var(--vf-system-bar-background-color);
    color: var(--vf-system-bar-text-color);
    z-index: var(--vf-system-bar-z-index-prop, var(--vf-system-bar-z-index));
}

.vf-system-bar_bordered {
    border-bottom: var(--vf-border-width) solid var(--vf-system-bar-border-color);
}

.vf-system-bar_dense {
    min-height: var(--vf-system-bar-dense-height);
    padding: var(--vf-system-bar-dense-padding);
}

.vf-system-bar_fixed {
    position: fixed;
    inset-block-start: 0;
    inset-inline: 0;
}

.vf-system-bar_sticky {
    position: sticky;
    inset-block-start: 0;
}

.vf-system-bar__start,
.vf-system-bar__center,
.vf-system-bar__end {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--vf-system-bar-section-gap);
}

.vf-system-bar__center {
    flex: 1 1 auto;
}

.vf-system-bar__end {
    margin-inline-start: auto;
}
</style>
