<template>
    <button v-if='props.type === "button"' :class='getClass' :disabled='props.loading || props.disabled'>
        <cm-icon v-if='props.icon && !props.loading' :icon='props.icon' :class='getIconClass' />
        <cm-icon v-if='props.loading' icon='circleNotch' :class='getIconClass' spin />
        <template v-if='$slots.default'>
            <span :class='getLabelClass'>
                <slot />
            </span>
        </template>
        <template v-else-if='label'>
            <span :class='getLabelClass'>
                {{ label }}
            </span>
        </template>
    </button>
    <cm-link v-else :to='props.to' :type='props.type' :class='getClass' :disabled='props.loading || props.disabled'>
        <cm-icon v-if='props.icon' :icon='props.icon' :class='getIconClass' />
        <template v-if='$slots.default'>
            <span :class='getLabelClass'>
                <slot />
            </span>
        </template>
        <template v-else-if='label'>
            <span :class='getLabelClass'>
                {{ label }}
            </span>
        </template>
    </cm-link>
</template>

<script setup lang='ts'>
import('./button.scss');
import('./buttonTheme.scss');
import { computed, defineProps } from 'vue';
import { CmLink } from '@/lib';
import { CmIcon } from '@codemonster-ru/icons';

interface Props {
    to?: string | object,
    icon?: string,
    type?: string,
    size?: string,
    label?: string,
    loading?: boolean,
    rounded?: boolean,
    iconPos?: 'top' | 'right' | 'bottom' | 'left',
    variant?: string,
    severity?: string,
    disabled?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
    to: undefined,
    icon: undefined,
    type: 'button',
    size: 'normal',
    label: '',
    loading: false,
    rounded: false,
    iconPos: 'left',
    variant: undefined,
    severity: 'primary',
    disabled: false,
});
const getClass = computed(() => {
    let classes = [
        'cm-button',
        `cm-button_${props.severity}`,
    ];

    if (['top', 'bottom'].includes(props.iconPos)) {
        classes.push('cm-button_vertical');
    }

    if (props.variant === 'text') {
        classes.push('cm-button_text');
    }

    if (props.variant === 'outlined') {
        classes.push('cm-button_outlined');
    }

    if (['small', 'large'].indexOf(props.size) > -1) {
        classes.push(`cm-button_${props.size}`);
    }

    if (props.loading || props.disabled) {
        classes.push('cm-button_disabled');
    }

    if (props.rounded) {
        classes.push('cm-button_rounded');
    }

    return classes;
});
const getIconClass = computed(() => {
    return ['cm-button__icon', `cm-button__icon_${props.iconPos}`];
});
const getLabelClass = computed(() => {
    return ['cm-button__label'];
});
</script>