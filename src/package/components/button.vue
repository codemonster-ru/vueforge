<template>
    <button v-if="props.type === 'button'" :class="getClass" :disabled="props.loading || props.disabled">
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
    <Link v-else :to="props.to" :type="props.type" :class="getClass" :disabled="props.loading || props.disabled">
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
import { computed, defineProps } from 'vue';
import { Link } from '@/index';
import { CmIcon as VIcon } from '@codemonster-ru/vueiconify';

interface Props {
    to?: string | object;
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
    let classes = ['vf-button', `vf-button_${props.severity}`];

    if (['top', 'bottom'].includes(props.iconPos)) {
        classes.push('vf-button_vertical');
    }

    if (props.variant === 'text') {
        classes.push('vf-button_text');
    }

    if (props.variant === 'outlined') {
        classes.push('vf-button_outlined');
    }

    if (['small', 'large'].indexOf(props.size) > -1) {
        classes.push(`vf-button_${props.size}`);
    }

    if (props.loading || props.disabled) {
        classes.push('vf-button_disabled');
    }

    if (props.rounded) {
        classes.push('vf-button_rounded');
    }

    return classes;
});
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
    padding: var(--vf-button-padding);
    font-size: 1rem;
    font-family: inherit;
    border-radius: var(--vf-button-border-radius);
    overflow: hidden;
}

.vf-button_text {
    border: 1px solid transparent;
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
        border: 1px solid var(--vf-button-outlined-primary-border-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-outlined-primary-hover-background-color);
            }
        }
    }

    &:not(.vf-button_text):not(.vf-button_outlined) {
        color: var(--vf-button-primary-color);
        border: 1px solid var(--vf-button-primary-border-color);
        background-color: var(--vf-button-primary-background-color);

        &:not(.vf-button_disabled) {
            &:hover {
                color: var(--vf-button-primary-hover-color);
                border: 1px solid var(--vf-button-primary-hover-border-color);
                background-color: var(--vf-button-primary-hover-background-color);
            }

            &:active {
                color: var(--vf-button-primary-active-color);
                border: 1px solid var(--vf-button-primary-active-border-color);
                background-color: var(var(--vf-button-primary-active-border-color));
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
        border: 1px solid var(--vf-button-outlined-secondary-border-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-outlined-secondary-hover-background-color);
            }
        }
    }

    &:not(.vf-button_text):not(.vf-button_outlined) {
        color: var(--vf-button-secondary-color);
        border: 1px solid var(--vf-button-secondary-border-color);
        background-color: var(--vf-button-secondary-background-color);

        &:not(.vf-button_disabled) {
            &:hover {
                color: var(--vf-button-secondary-hover-color);
                border: 1px solid var(--vf-button-secondary-hover-border-color);
                background-color: var(--vf-button-secondary-hover-background-color);
            }

            &:active {
                color: var(--vf-button-secondary-active-color);
                border: 1px solid var(--vf-button-secondary-active-border-color);
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
        border: 1px solid var(--vf-button-outlined-success-border-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-outlined-success-hover-background-color);
            }
        }
    }

    &:not(.vf-button_text):not(.vf-button_outlined) {
        color: var(--vf-button-success-color);
        border: 1px solid var(--vf-button-success-border-color);
        background-color: var(--vf-button-success-background-color);

        &:not(.vf-button_disabled) {
            &:hover {
                color: var(--vf-button-success-hover-color);
                border: 1px solid var(--vf-button-success-hover-border-color);
                background-color: var(--vf-button-success-hover-background-color);
            }

            &:active {
                color: var(--vf-button-success-active-color);
                border: 1px solid var(--vf-button-success-active-border-color);
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
        border: 1px solid var(--vf-button-outlined-info-border-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-outlined-info-hover-background-color);
            }
        }
    }

    &:not(.vf-button_text):not(.vf-button_outlined) {
        color: var(--vf-button-info-color);
        border: 1px solid var(--vf-button-info-border-color);
        background-color: var(--vf-button-info-background-color);

        &:not(.vf-button_disabled) {
            &:hover {
                color: var(--vf-button-info-hover-color);
                border: 1px solid var(--vf-button-info-hover-border-color);
                background-color: var(--vf-button-info-hover-background-color);
            }

            &:active {
                color: var(--vf-button-info-active-color);
                border: 1px solid var(--vf-button-info-active-border-color);
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
        border: 1px solid var(--vf-button-outlined-warning-border-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-outlined-warning-hover-background-color);
            }
        }
    }

    &:not(.vf-button_text):not(.vf-button_outlined) {
        color: var(--vf-button-warning-color);
        border: 1px solid var(--vf-button-warning-border-color);
        background-color: var(--vf-button-warning-background-color);

        &:not(.vf-button_disabled) {
            &:hover {
                color: var(--vf-button-warning-hover-color);
                border: 1px solid var(--vf-button-warning-hover-border-color);
                background-color: var(--vf-button-warning-hover-background-color);
            }

            &:active {
                color: var(--vf-button-warning-active-color);
                border: 1px solid var(--vf-button-warning-active-border-color);
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
        border: 1px solid var(--vf-button-outlined-danger-border-color);

        &:not(.vf-button_disabled) {
            &:hover {
                background-color: var(--vf-button-outlined-danger-hover-background-color);
            }
        }
    }

    &:not(.vf-button_text):not(.vf-button_outlined) {
        color: var(--vf-button-danger-color);
        border: 1px solid var(--vf-button-danger-border-color);
        background-color: var(--vf-button-danger-background-color);

        &:not(.vf-button_disabled) {
            &:hover {
                color: var(--vf-button-danger-hover-color);
                border: 1px solid var(--vf-button-danger-hover-border-color);
                background-color: var(--vf-button-danger-hover-background-color);
            }

            &:active {
                color: var(--vf-button-danger-active-color);
                border: 1px solid var(--vf-button-danger-active-border-color);
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
        margin-top: 6px;
    }
}

.vf-button__icon_right {
    order: 1;

    + .vf-button__label {
        margin-right: 6px;
    }
}

.vf-button__icon_bottom {
    order: 1;

    + .vf-button__label {
        margin-bottom: 6px;
    }
}

.vf-button__icon_left {
    + .vf-button__label {
        margin-left: 6px;
    }
}

.vf-button_disabled {
    opacity: 0.6;
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
