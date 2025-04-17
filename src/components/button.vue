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
    <Link v-else :to='props.to' :type='props.type' :class='getClass' :disabled='props.loading || props.disabled'>
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
    </Link>
</template>

<script setup lang='ts'>
import { computed, defineProps } from 'vue';
import { Link } from '..';
import { CmIcon } from '@codemonster-ru/vueiconify';

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

<style lang='scss'>
.cm-button {
    display: inline-flex;
    position: relative;
    cursor: pointer;
    user-select: none;
    align-items: center;
    justify-content: center;
    padding: var(--cm-button-padding);
    font-size: 1rem;
    font-family: inherit;
    border-radius: var(--cm-button-border-radius);
    overflow: hidden;
}

.cm-button_text {
    border: 1px solid transparent;
    background-color: transparent;
}

.cm-button_outlined {
    background-color: transparent;
}

.cm-button_primary {
    &.cm-button_text {
        color: var(--cm-button-text-primary-color);

        &:not(.cm-button_disabled) {
            &:hover {
                background-color: var(--cm-button-text-primary-hover-background-color);
            }
        }
    }

    &.cm-button_outlined {
        color: var(--cm-button-outlined-primary-color);
        border: 1px solid var(--cm-button-outlined-primary-border-color);

        &:not(.cm-button_disabled) {
            &:hover {
                background-color: var(--cm-button-outlined-primary-hover-background-color);
            }
        }
    }

    &:not(.cm-button_text):not(.cm-button_outlined) {
        color: var(--cm-button-primary-color);
        border: 1px solid var(--cm-button-primary-border-color);
        background-color: var(--cm-button-primary-background-color);

        &:not(.cm-button_disabled) {
            &:hover {
                color: var(--cm-button-primary-hover-color);
                border: 1px solid var(--cm-button-primary-hover-border-color);
                background-color: var(--cm-button-primary-hover-background-color);
            }

            &:active {
                color: var(--cm-button-primary-active-color);
                border: 1px solid var(--cm-button-primary-active-border-color);
                background-color: var(var(--cm-button-primary-active-border-color));
            }
        }
    }
}

.cm-button_secondary {
    &.cm-button_text {
        color: var(--cm-button-text-secondary-color);

        &:not(.cm-button_disabled) {
            &:hover {
                background-color: var(--cm-button-text-secondary-hover-background-color);
            }
        }
    }

    &.cm-button_outlined {
        color: var(--cm-button-outlined-secondary-color);
        border: 1px solid var(--cm-button-outlined-secondary-border-color);

        &:not(.cm-button_disabled) {
            &:hover {
                background-color: var(--cm-button-outlined-secondary-hover-background-color);
            }
        }
    }

    &:not(.cm-button_text):not(.cm-button_outlined) {
        color: var(--cm-button-secondary-color);
        border: 1px solid var(--cm-button-secondary-border-color);
        background-color: var(--cm-button-secondary-background-color);

        &:not(.cm-button_disabled) {
            &:hover {
                color: var(--cm-button-secondary-hover-color);
                border: 1px solid var(--cm-button-secondary-hover-border-color);
                background-color: var(--cm-button-secondary-hover-background-color);
            }

            &:active {
                color: var(--cm-button-secondary-active-color);
                border: 1px solid var(--cm-button-secondary-active-border-color);
                background-color: var(--cm-button-secondary-active-background-color);
            }
        }
    }
}

.cm-button_success {
    &.cm-button_text {
        color: var(--cm-button-text-success-color);

        &:not(.cm-button_disabled) {
            &:hover {
                background-color: var(--cm-button-text-success-hover-background-color);
            }
        }
    }

    &.cm-button_outlined {
        color: var(--cm-button-outlined-success-color);
        border: 1px solid var(--cm-button-outlined-success-border-color);

        &:not(.cm-button_disabled) {
            &:hover {
                background-color: var(--cm-button-outlined-success-hover-background-color);
            }
        }
    }

    &:not(.cm-button_text):not(.cm-button_outlined) {
        color: var(--cm-button-success-color);
        border: 1px solid var(--cm-button-success-border-color);
        background-color: var(--cm-button-success-background-color);

        &:not(.cm-button_disabled) {
            &:hover {
                color: var(--cm-button-success-hover-color);
                border: 1px solid var(--cm-button-success-hover-border-color);
                background-color: var(--cm-button-success-hover-background-color);
            }

            &:active {
                color: var(--cm-button-success-active-color);
                border: 1px solid var(--cm-button-success-active-border-color);
                background-color: var(--cm-button-success-active-background-color);
            }
        }
    }
}

.cm-button_info {
    &.cm-button_text {
        color: var(--cm-button-text-info-color);

        &:not(.cm-button_disabled) {
            &:hover {
                background-color: var(--cm-button-text-info-hover-background-color);
            }
        }
    }

    &.cm-button_outlined {
        color: var(--cm-button-outlined-info-color);
        border: 1px solid var(--cm-button-outlined-info-border-color);

        &:not(.cm-button_disabled) {
            &:hover {
                background-color: var(--cm-button-outlined-info-hover-background-color);
            }
        }
    }

    &:not(.cm-button_text):not(.cm-button_outlined) {
        color: var(--cm-button-info-color);
        border: 1px solid var(--cm-button-info-border-color);
        background-color: var(--cm-button-info-background-color);

        &:not(.cm-button_disabled) {
            &:hover {
                color: var(--cm-button-info-hover-color);
                border: 1px solid var(--cm-button-info-hover-border-color);
                background-color: var(--cm-button-info-hover-background-color);
            }

            &:active {
                color: var(--cm-button-info-active-color);
                border: 1px solid var(--cm-button-info-active-border-color);
                background-color: var(--cm-button-info-active-background-color);
            }
        }
    }
}

.cm-button_warning {
    &.cm-button_text {
        color: var(--cm-button-text-warning-color);

        &:not(.cm-button_disabled) {
            &:hover {
                background-color: var(--cm-button-text-warning-hover-background-color);
            }
        }
    }

    &.cm-button_outlined {
        color: var(--cm-button-outlined-warning-color);
        border: 1px solid var(--cm-button-outlined-warning-border-color);

        &:not(.cm-button_disabled) {
            &:hover {
                background-color: var(--cm-button-outlined-warning-hover-background-color);
            }
        }
    }

    &:not(.cm-button_text):not(.cm-button_outlined) {
        color: var(--cm-button-warning-color);
        border: 1px solid var(--cm-button-warning-border-color);
        background-color: var(--cm-button-warning-background-color);

        &:not(.cm-button_disabled) {
            &:hover {
                color: var(--cm-button-warning-hover-color);
                border: 1px solid var(--cm-button-warning-hover-border-color);
                background-color: var(--cm-button-warning-hover-background-color);
            }

            &:active {
                color: var(--cm-button-warning-active-color);
                border: 1px solid var(--cm-button-warning-active-border-color);
                background-color: var(--cm-button-warning-active-background-color);
            }
        }
    }
}

.cm-button_danger {
    &.cm-button_text {
        color: var(--cm-button-text-danger-color);

        &:not(.cm-button_disabled) {
            &:hover {
                background-color: var(--cm-button-text-danger-hover-background-color);
            }
        }
    }

    &.cm-button_outlined {
        color: var(--cm-button-outlined-danger-color);
        border: 1px solid var(--cm-button-outlined-danger-border-color);

        &:not(.cm-button_disabled) {
            &:hover {
                background-color: var(--cm-button-outlined-danger-hover-background-color);
            }
        }
    }

    &:not(.cm-button_text):not(.cm-button_outlined) {
        color: var(--cm-button-danger-color);
        border: 1px solid var(--cm-button-danger-border-color);
        background-color: var(--cm-button-danger-background-color);

        &:not(.cm-button_disabled) {
            &:hover {
                color: var(--cm-button-danger-hover-color);
                border: 1px solid var(--cm-button-danger-hover-border-color);
                background-color: var(--cm-button-danger-hover-background-color);
            }

            &:active {
                color: var(--cm-button-danger-active-color);
                border: 1px solid var(--cm-button-danger-active-border-color);
                background-color: var(--cm-button-danger-active-background-color);
            }
        }
    }
}

.cm-button_vertical {
    flex-direction: column;
}

.cm-button__icon {
    display: inline-block;
}

.cm-button__icon_top {
    + .cm-button__label {
        margin-top: 6px;
    }
}

.cm-button__icon_right {
    order: 1;

    + .cm-button__label {
        margin-right: 6px;
    }
}

.cm-button__icon_bottom {
    order: 1;

    + .cm-button__label {
        margin-bottom: 6px;
    }
}

.cm-button__icon_left {
    + .cm-button__label {
        margin-left: 6px;
    }
}

.cm-button_disabled {
    opacity: 0.6;
    cursor: default;
}

.cm-button_rounded {
    border-radius: var(--cm-button-rounded-border-radius);
}

.cm-button_small {
    font-size: var(--cm-button-small-font-size);
    padding: var(--cm-button-small-padding);
}

.cm-button_large {
    font-size: var(--cm-button-large-font-size);
    padding: var(--cm-button-large-padding);
}
</style>