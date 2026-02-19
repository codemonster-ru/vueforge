<template>
    <button v-if="isButton" :type="buttonType" :class="getClass" :disabled="props.loading || isDisabled">
        <v-icon v-if="props.icon && !props.loading" :icon="props.icon" :class="getIconClass" />
        <v-icon v-if="props.loading" icon="circleNotch" :class="getIconClass" spin />
        <template v-if="$slots.default">
            <span :class="getLabelClass">
                <slot />
            </span>
        </template>
        <template v-else-if="label">
            <span :class="getLabelClass">
                {{ label }}
            </span>
        </template>
    </button>
    <Link
        v-else
        :to="props.to"
        :href="props.href ?? props.url"
        :as="linkType"
        :class="getClass"
        :disabled="props.loading || isDisabled"
    >
        <v-icon v-if="props.icon" :icon="props.icon" :class="getIconClass" />
        <template v-if="$slots.default">
            <span :class="getLabelClass">
                <slot />
            </span>
        </template>
        <template v-else-if="label">
            <span :class="getLabelClass">
                {{ label }}
            </span>
        </template>
    </Link>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import Link from '@/package/components/link.vue';
import { CmIcon as VIcon } from '@codemonster-ru/vueiconify';
import { buttonGroupContextKey } from '@/package/components/button-group-context';

type ButtonType = 'button' | 'submit' | 'reset';
type LinkType = 'a' | 'router-link';

interface Props {
    to?: string | object;
    href?: string;
    url?: string;
    as?: 'button' | 'link';
    icon?: string;
    type?: string;
    size?: string;
    label?: string;
    loading?: boolean;
    rounded?: boolean;
    iconPos?: 'top' | 'right' | 'bottom' | 'left';
    variant?: string;
    severity?: string;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    to: undefined,
    href: undefined,
    url: undefined,
    as: undefined,
    icon: undefined,
    type: 'button',
    size: undefined,
    label: '',
    loading: false,
    rounded: false,
    iconPos: 'left',
    variant: undefined,
    severity: undefined,
    disabled: false,
});
const buttonGroupContext = inject(buttonGroupContextKey, null);
const buttonTypes: Array<ButtonType> = ['button', 'submit', 'reset'];
const isButtonType = (value: string | undefined): value is ButtonType => {
    return !!value && buttonTypes.includes(value as ButtonType);
};
const isButton = computed(() => {
    if (props.as) {
        return props.as === 'button';
    }
    if (props.to || props.href || props.url) {
        return false;
    }
    if (props.type && !isButtonType(props.type)) {
        return false;
    }
    return true;
});
const buttonType = computed<ButtonType>(() => {
    return isButtonType(props.type) ? props.type : 'button';
});
const linkType = computed<LinkType>(() => {
    if (props.as === 'link') {
        return props.to ? 'router-link' : 'a';
    }
    if (props.type && !isButtonType(props.type)) {
        if (props.type === 'router-link') {
            return props.to ? 'router-link' : 'a';
        }
        return 'a';
    }
    return props.to ? 'router-link' : 'a';
});
const getClass = computed(() => {
    const size = props.size ?? buttonGroupContext?.value.size ?? 'normal';
    const variant = props.variant ?? buttonGroupContext?.value.variant;
    const severity = props.severity ?? buttonGroupContext?.value.severity ?? 'primary';
    const disabled = props.loading || props.disabled || buttonGroupContext?.value.disabled;
    let classes = ['vf-button', `vf-button_${severity}`];

    if (['top', 'bottom'].includes(props.iconPos)) {
        classes.push('vf-button_vertical');
    }

    if (variant === 'text') {
        classes.push('vf-button_text');
    }

    if (variant === 'outlined') {
        classes.push('vf-button_outlined');
    }

    if (['small', 'large'].indexOf(size) > -1) {
        classes.push(`vf-button_${size}`);
    }

    if (disabled) {
        classes.push('vf-button_disabled');
    }

    if (props.rounded) {
        classes.push('vf-button_rounded');
    }

    return classes;
});
const isDisabled = computed(() => props.disabled || buttonGroupContext?.value.disabled === true);
const getIconClass = computed(() => {
    return ['vf-button__icon', `vf-button__icon_${props.iconPos}`];
});
const getLabelClass = computed(() => {
    return ['vf-button__label'];
});
</script>

<style lang="scss">
.vf-button {
    display: inline-flex;
    position: relative;
    cursor: pointer;
    user-select: none;
    align-items: center;
    justify-content: center;
    height: var(--vf-controls-height);
    box-sizing: border-box;
    padding: var(--vf-button-padding);
    font-size: var(--vf-button-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    border-radius: var(--vf-button-border-radius);
    overflow: hidden;
}

.vf-button_text {
    border: var(--vf-border-width) solid transparent;
    background-color: transparent;
}

.vf-button_outlined {
    background-color: transparent;
}

.vf-button_primary {
    &.vf-button_text {
        color: var(--vf-button-text-primary-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-text-primary-hover-background-color);
            }
        }
    }

    &.vf-button_outlined {
        color: var(--vf-button-outlined-primary-color);
        border: var(--vf-border-width) solid var(--vf-button-outlined-primary-border-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-outlined-primary-hover-background-color);
            }
        }
    }

    &:not(.vf-button_text):not(.vf-button_outlined) {
        color: var(--vf-button-primary-color);
        border: var(--vf-border-width) solid var(--vf-button-primary-border-color);
        background-color: var(--vf-button-primary-background-color);

        &:not(.vf-button_disabled) {
            &:hover {
                color: var(--vf-button-primary-hover-color);
                border: var(--vf-border-width) solid var(--vf-button-primary-hover-border-color);
                background-color: var(--vf-button-primary-hover-background-color);
            }

            &:active {
                color: var(--vf-button-primary-active-color);
                border: var(--vf-border-width) solid var(--vf-button-primary-active-border-color);
                background-color: var(--vf-button-primary-active-background-color);
            }
        }
    }
}

.vf-button_secondary {
    &.vf-button_text {
        color: var(--vf-button-text-secondary-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-text-secondary-hover-background-color);
            }
        }
    }

    &.vf-button_outlined {
        color: var(--vf-button-outlined-secondary-color);
        border: var(--vf-border-width) solid var(--vf-button-outlined-secondary-border-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-outlined-secondary-hover-background-color);
            }
        }
    }

    &:not(.vf-button_text):not(.vf-button_outlined) {
        color: var(--vf-button-secondary-color);
        border: var(--vf-border-width) solid var(--vf-button-secondary-border-color);
        background-color: var(--vf-button-secondary-background-color);

        &:not(.vf-button_disabled) {
            &:hover {
                color: var(--vf-button-secondary-hover-color);
                border: var(--vf-border-width) solid var(--vf-button-secondary-hover-border-color);
                background-color: var(--vf-button-secondary-hover-background-color);
            }

            &:active {
                color: var(--vf-button-secondary-active-color);
                border: var(--vf-border-width) solid var(--vf-button-secondary-active-border-color);
                background-color: var(--vf-button-secondary-active-background-color);
            }
        }
    }
}

.vf-button_success {
    &.vf-button_text {
        color: var(--vf-button-text-success-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-text-success-hover-background-color);
            }
        }
    }

    &.vf-button_outlined {
        color: var(--vf-button-outlined-success-color);
        border: var(--vf-border-width) solid var(--vf-button-outlined-success-border-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-outlined-success-hover-background-color);
            }
        }
    }

    &:not(.vf-button_text):not(.vf-button_outlined) {
        color: var(--vf-button-success-color);
        border: var(--vf-border-width) solid var(--vf-button-success-border-color);
        background-color: var(--vf-button-success-background-color);

        &:not(.vf-button_disabled) {
            &:hover {
                color: var(--vf-button-success-hover-color);
                border: var(--vf-border-width) solid var(--vf-button-success-hover-border-color);
                background-color: var(--vf-button-success-hover-background-color);
            }

            &:active {
                color: var(--vf-button-success-active-color);
                border: var(--vf-border-width) solid var(--vf-button-success-active-border-color);
                background-color: var(--vf-button-success-active-background-color);
            }
        }
    }
}

.vf-button_info {
    &.vf-button_text {
        color: var(--vf-button-text-info-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-text-info-hover-background-color);
            }
        }
    }

    &.vf-button_outlined {
        color: var(--vf-button-outlined-info-color);
        border: var(--vf-border-width) solid var(--vf-button-outlined-info-border-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-outlined-info-hover-background-color);
            }
        }
    }

    &:not(.vf-button_text):not(.vf-button_outlined) {
        color: var(--vf-button-info-color);
        border: var(--vf-border-width) solid var(--vf-button-info-border-color);
        background-color: var(--vf-button-info-background-color);

        &:not(.vf-button_disabled) {
            &:hover {
                color: var(--vf-button-info-hover-color);
                border: var(--vf-border-width) solid var(--vf-button-info-hover-border-color);
                background-color: var(--vf-button-info-hover-background-color);
            }

            &:active {
                color: var(--vf-button-info-active-color);
                border: var(--vf-border-width) solid var(--vf-button-info-active-border-color);
                background-color: var(--vf-button-info-active-background-color);
            }
        }
    }
}

.vf-button_warning {
    &.vf-button_text {
        color: var(--vf-button-text-warning-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-text-warning-hover-background-color);
            }
        }
    }

    &.vf-button_outlined {
        color: var(--vf-button-outlined-warning-color);
        border: var(--vf-border-width) solid var(--vf-button-outlined-warning-border-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-outlined-warning-hover-background-color);
            }
        }
    }

    &:not(.vf-button_text):not(.vf-button_outlined) {
        color: var(--vf-button-warning-color);
        border: var(--vf-border-width) solid var(--vf-button-warning-border-color);
        background-color: var(--vf-button-warning-background-color);

        &:not(.vf-button_disabled) {
            &:hover {
                color: var(--vf-button-warning-hover-color);
                border: var(--vf-border-width) solid var(--vf-button-warning-hover-border-color);
                background-color: var(--vf-button-warning-hover-background-color);
            }

            &:active {
                color: var(--vf-button-warning-active-color);
                border: var(--vf-border-width) solid var(--vf-button-warning-active-border-color);
                background-color: var(--vf-button-warning-active-background-color);
            }
        }
    }
}

.vf-button_danger {
    &.vf-button_text {
        color: var(--vf-button-text-danger-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-text-danger-hover-background-color);
            }
        }
    }

    &.vf-button_outlined {
        color: var(--vf-button-outlined-danger-color);
        border: var(--vf-border-width) solid var(--vf-button-outlined-danger-border-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-outlined-danger-hover-background-color);
            }
        }
    }

    &:not(.vf-button_text):not(.vf-button_outlined) {
        color: var(--vf-button-danger-color);
        border: var(--vf-border-width) solid var(--vf-button-danger-border-color);
        background-color: var(--vf-button-danger-background-color);

        &:not(.vf-button_disabled) {
            &:hover {
                color: var(--vf-button-danger-hover-color);
                border: var(--vf-border-width) solid var(--vf-button-danger-hover-border-color);
                background-color: var(--vf-button-danger-hover-background-color);
            }

            &:active {
                color: var(--vf-button-danger-active-color);
                border: var(--vf-border-width) solid var(--vf-button-danger-active-border-color);
                background-color: var(--vf-button-danger-active-background-color);
            }
        }
    }
}

.vf-button_vertical {
    flex-direction: column;
}

.vf-button__icon {
    display: inline-block;
}

.vf-button__icon_top {
    + .vf-button__label {
        margin-top: var(--vf-button-icon-gap);
    }
}

.vf-button__icon_right {
    order: 1;

    + .vf-button__label {
        margin-right: var(--vf-button-icon-gap);
    }
}

.vf-button__icon_bottom {
    order: 1;

    + .vf-button__label {
        margin-bottom: var(--vf-button-icon-gap);
    }
}

.vf-button__icon_left {
    + .vf-button__label {
        margin-left: var(--vf-button-icon-gap);
    }
}

.vf-button_disabled {
    opacity: var(--vf-states-disabled-opacity);
    cursor: default;
}

.vf-button_rounded {
    border-radius: var(--vf-button-rounded-border-radius);
}

.vf-button_small {
    font-size: var(--vf-button-small-font-size);
    padding: var(--vf-button-small-padding);
}

.vf-button_large {
    font-size: var(--vf-button-large-font-size);
    padding: var(--vf-button-large-padding);
}
</style>
