<template>
    <div :class="rootClass" role="toolbar" :aria-label="ariaLabel">
        <div
            v-if="$slots.start"
            class="vf-toolbar__section vf-toolbar__section_start"
            role="group"
            :aria-label="startAriaLabel"
        >
            <slot name="start" />
        </div>
        <div
            v-if="$slots.center"
            class="vf-toolbar__section vf-toolbar__section_center"
            role="group"
            :aria-label="centerAriaLabel"
        >
            <slot name="center" />
        </div>
        <div
            v-if="$slots.end"
            class="vf-toolbar__section vf-toolbar__section_end"
            role="group"
            :aria-label="endAriaLabel"
        >
            <slot name="end" />
        </div>
        <div
            v-if="$slots.default && !$slots.start && !$slots.center && !$slots.end"
            class="vf-toolbar__section vf-toolbar__section_default"
            role="group"
            :aria-label="groupAriaLabel"
        >
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Orientation = 'horizontal' | 'vertical';

interface Props {
    orientation?: Orientation;
    wrap?: boolean;
    dense?: boolean;
    ariaLabel?: string;
    groupAriaLabel?: string;
    startAriaLabel?: string;
    centerAriaLabel?: string;
    endAriaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    orientation: 'horizontal',
    wrap: true,
    dense: false,
    ariaLabel: 'Toolbar',
    groupAriaLabel: 'Toolbar group',
    startAriaLabel: 'Toolbar start group',
    centerAriaLabel: 'Toolbar center group',
    endAriaLabel: 'Toolbar end group',
});

const rootClass = computed(() => {
    const classes = ['vf-toolbar', `vf-toolbar_${props.orientation}`];

    if (props.wrap) {
        classes.push('vf-toolbar_wrap');
    }
    if (props.dense) {
        classes.push('vf-toolbar_dense');
    }

    return classes;
});
</script>

<style lang="scss">
.vf-toolbar {
    display: flex;
    gap: var(--vf-toolbar-section-gap);
    padding: var(--vf-toolbar-padding);
    border: var(--vf-border-width) solid var(--vf-toolbar-border-color);
    border-radius: var(--vf-toolbar-border-radius);
    background-color: var(--vf-toolbar-background-color);
    color: var(--vf-toolbar-text-color);
}

.vf-toolbar_horizontal {
    align-items: center;
}

.vf-toolbar_vertical {
    flex-direction: column;
    align-items: stretch;
}

.vf-toolbar_wrap {
    flex-wrap: wrap;
}

.vf-toolbar__section {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-toolbar-control-gap);
}

.vf-toolbar__section_start {
    margin-inline-end: auto;
}

.vf-toolbar__section_center {
    margin-inline: auto;
}

.vf-toolbar__section_end {
    margin-inline-start: auto;
}

.vf-toolbar_dense {
    padding: var(--vf-toolbar-dense-padding);
}
</style>
