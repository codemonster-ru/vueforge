<template>
    <div :class="getClass" role="group" :aria-disabled="disabled ? 'true' : undefined">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { buttonGroupContextKey } from '@/package/components/button-group-context';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined' | 'text';
type Severity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
type Orientation = 'horizontal' | 'vertical';

interface Props {
    size?: Size;
    variant?: Variant;
    severity?: Severity;
    disabled?: boolean;
    orientation?: Orientation;
    attached?: boolean;
}

defineOptions({ name: 'VfButtonGroup' });

const props = withDefaults(defineProps<Props>(), {
    size: undefined,
    variant: undefined,
    severity: undefined,
    disabled: false,
    orientation: 'horizontal',
    attached: false,
});

const contextValue = computed(() => ({
    size: props.size,
    variant: props.variant,
    severity: props.severity,
    disabled: props.disabled,
}));

provide(buttonGroupContextKey, contextValue);

const getClass = computed(() => {
    const classes = ['vf-button-group', `vf-button-group_${props.orientation}`];

    if (props.attached) {
        classes.push('vf-button-group_attached');
    }

    if (props.disabled) {
        classes.push('vf-button-group_disabled');
    }

    return classes;
});
</script>

<style lang="scss">
.vf-button-group {
    display: inline-flex;
    align-items: stretch;
    gap: var(--vf-button-group-gap);
}

.vf-button-group_vertical {
    flex-direction: column;
}

.vf-button-group_attached {
    gap: 0;
}

.vf-button-group_attached.vf-button-group_horizontal > :not(:first-child) {
    margin-left: calc(var(--vf-border-width) * -1);
}

.vf-button-group_attached.vf-button-group_vertical > :not(:first-child) {
    margin-top: calc(var(--vf-border-width) * -1);
}

.vf-button-group_attached
    > :is(.vf-button, .vf-splitbutton, .vf-dropdown > .vf-button, .vf-dropdown__trigger > .vf-button) {
    border-radius: 0;
}

.vf-button-group_attached > :first-child:is(.vf-button, .vf-splitbutton) {
    border-top-left-radius: var(--vf-button-group-border-radius);
    border-bottom-left-radius: var(--vf-button-group-border-radius);
}

.vf-button-group_attached > :last-child:is(.vf-button, .vf-splitbutton) {
    border-top-right-radius: var(--vf-button-group-border-radius);
    border-bottom-right-radius: var(--vf-button-group-border-radius);
}

.vf-button-group_attached.vf-button-group_vertical > :first-child:is(.vf-button, .vf-splitbutton) {
    border-top-right-radius: var(--vf-button-group-border-radius);
    border-bottom-left-radius: 0;
}

.vf-button-group_attached.vf-button-group_vertical > :last-child:is(.vf-button, .vf-splitbutton) {
    border-top-right-radius: 0;
    border-bottom-left-radius: var(--vf-button-group-border-radius);
}

.vf-button-group_attached > .vf-splitbutton:first-child .vf-splitbutton__main {
    border-top-left-radius: var(--vf-button-group-border-radius);
    border-bottom-left-radius: var(--vf-button-group-border-radius);
}

.vf-button-group_attached > .vf-splitbutton:last-child .vf-splitbutton__toggle {
    border-top-right-radius: var(--vf-button-group-border-radius);
    border-bottom-right-radius: var(--vf-button-group-border-radius);
}

.vf-button-group_disabled {
    opacity: var(--vf-button-group-disabled-opacity);
    pointer-events: none;
}
</style>
