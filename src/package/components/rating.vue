<template>
    <div
        class="vf-rating"
        :class="getClass"
        ref="rootRef"
        role="radiogroup"
        :aria-label="ariaLabel || undefined"
        :aria-readonly="readonly || undefined"
        :aria-disabled="disabled || undefined"
        @mousemove="onRootMove"
        @mouseleave="onRootLeave"
    >
        <button
            v-for="item in items"
            :key="item"
            type="button"
            class="vf-rating__item"
            ref="itemRefs"
            role="radio"
            :aria-checked="getAriaChecked(item)"
            :aria-label="getItemLabel(item)"
            :tabindex="getTabIndex(item)"
            :disabled="disabled"
            @focus="onFocus"
            @blur="onBlur"
            @click="onSelect(item, $event)"
            @keydown="onKeydown(item, $event)"
        >
            <span class="vf-rating__icon vf-rating__icon_empty">
                <slot name="icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="vf-rating__svg">
                        <path
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                            fill="currentColor"
                        />
                    </svg>
                </slot>
            </span>
            <span class="vf-rating__icon vf-rating__icon_fill" :style="{ width: getFillWidth(item) }">
                <span class="vf-rating__icon_inner">
                    <slot name="active-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true" class="vf-rating__svg">
                            <path
                                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                fill="currentColor"
                            />
                        </svg>
                    </slot>
                </span>
            </span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type RatingSize = 'small' | 'normal' | 'large';

interface Props {
    modelValue?: number;
    max?: number;
    size?: RatingSize;
    allowHalf?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
}

const emits = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: 0,
    max: 5,
    size: 'normal',
    allowHalf: false,
    readonly: false,
    disabled: false,
    ariaLabel: '',
});

const hoverValue = ref<number | null>(null);
const rootRef = ref<HTMLElement | null>(null);
const itemRefs = ref<HTMLElement[]>([]);
const step = computed(() => (props.allowHalf ? 0.5 : 1));
const maxValue = computed(() => Math.max(1, Math.floor(props.max)));
const items = computed(() => Array.from({ length: maxValue.value }, (_, index) => index + 1));
const displayValue = computed(() => {
    const raw = hoverValue.value ?? props.modelValue ?? 0;
    const clamped = Math.min(maxValue.value, Math.max(0, raw));

    if (props.allowHalf) {
        return Math.round(clamped * 2) / 2;
    }

    return Math.round(clamped);
});
const focusIndex = computed(() => {
    const value = Math.min(maxValue.value, Math.max(0, props.modelValue ?? 0));

    if (value === 0) {
        return 1;
    }

    return Math.min(maxValue.value, Math.max(1, Math.ceil(value)));
});

const getClass = computed(() => {
    const classes = [`vf-rating_${props.size}`];

    if (props.disabled) {
        classes.push('vf-rating_disabled');
    }

    if (props.readonly) {
        classes.push('vf-rating_readonly');
    }

    if (hoverValue.value !== null) {
        classes.push('vf-rating_hover');
    }

    return classes;
});

const clampValue = (value: number) => Math.min(maxValue.value, Math.max(0, value));
const snapValue = (value: number) => {
    const next = Math.round(value / step.value) * step.value;

    return clampValue(next);
};
const resolvePointerValue = (index: number, event: MouseEvent) => {
    if (!props.allowHalf) {
        return index;
    }

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offset = event.clientX - rect.left;

    return offset <= rect.width / 2 ? index - 0.5 : index;
};
const updateValue = (value: number) => {
    const next = snapValue(value);

    emits('update:modelValue', next);
    emits('change', next);
};
const onRootMove = (event: MouseEvent) => {
    if (props.disabled || props.readonly) {
        return;
    }

    const elements = itemRefs.value.filter(Boolean);

    if (!elements.length) {
        return;
    }

    const x = event.clientX;
    const firstRect = elements[0].getBoundingClientRect();
    const lastRect = elements[elements.length - 1].getBoundingClientRect();

    if (x < firstRect.left) {
        hoverValue.value = 0;

        return;
    }

    if (x > lastRect.right) {
        hoverValue.value = maxValue.value;

        return;
    }

    let closestIndex = 0;
    let closestRect = firstRect;
    let closestDistance = Number.POSITIVE_INFINITY;

    elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const distance = Math.abs(x - center);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
            closestRect = rect;
        }
    });

    let next = closestIndex + 1;

    if (props.allowHalf) {
        const center = closestRect.left + closestRect.width / 2;
        next = x < center ? next - 0.5 : next;
    }

    hoverValue.value = clampValue(next);
};
const onRootLeave = () => {
    hoverValue.value = null;
};
const onSelect = (index: number, event: MouseEvent) => {
    if (props.disabled || props.readonly) {
        return;
    }

    updateValue(resolvePointerValue(index, event));
};
const onKeydown = (index: number, event: KeyboardEvent) => {
    if (props.disabled || props.readonly) {
        return;
    }

    let next = props.modelValue ?? 0;

    switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
            next = (props.modelValue ?? 0) + step.value;
            break;
        case 'ArrowLeft':
        case 'ArrowDown':
            next = (props.modelValue ?? 0) - step.value;
            break;
        case 'Home':
            next = 0;
            break;
        case 'End':
            next = maxValue.value;
            break;
        case ' ':
        case 'Enter':
            next = index;
            break;
        default:
            return;
    }

    event.preventDefault();

    updateValue(next);
};
const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

const getFillWidth = (index: number) => {
    const raw = displayValue.value - (index - 1);
    const fill = Math.min(1, Math.max(0, raw));

    if (!props.allowHalf) {
        return fill >= 1 ? '100%' : '0%';
    }

    if (fill >= 1) {
        return '100%';
    }

    return fill >= 0.5 ? '50%' : '0%';
};
const getTabIndex = (index: number) => {
    return index === focusIndex.value ? 0 : -1;
};
const getAriaChecked = (index: number) => {
    if ((props.modelValue ?? 0) === 0) {
        return false;
    }

    return index === focusIndex.value;
};
const getItemLabel = (index: number) => {
    if (!props.ariaLabel) {
        return `${index}`;
    }

    return `${props.ariaLabel} ${index}`;
};
</script>

<style lang="scss">
.vf-rating {
    display: inline-flex;
    align-items: center;
    gap: var(--vf-rating-gap);
    --vf-rating-item-size: var(--vf-rating-size);
}

.vf-rating__item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--vf-rating-item-size);
    height: var(--vf-rating-item-size);
    padding: 0;
    border: none;
    background: transparent;
    font-size: var(--vf-rating-item-size);
    line-height: 1;
    color: var(--vf-rating-color);
    cursor: pointer;
    overflow: hidden;
}

.vf-rating__icon {
    display: block;
    width: 100%;
    height: 100%;
    line-height: 1;
}

.vf-rating__icon_empty {
    position: absolute;
    inset: 0;
}

.vf-rating__icon_fill {
    position: absolute;
    inset: 0;
    overflow: hidden;
    color: var(--vf-rating-active-color);
    pointer-events: none;
}

.vf-rating__icon_inner {
    position: absolute;
    inset: 0;
    width: var(--vf-rating-item-size);
    height: var(--vf-rating-item-size);
}

.vf-rating__svg {
    width: 100%;
    height: 100%;
    display: block;
}

.vf-rating__item:focus-visible {
    outline: none;
    box-shadow: var(--vf-rating-focus-ring-shadow);
    border-radius: var(--vf-rating-focus-radius, 4px);
}

.vf-rating_hover .vf-rating__icon_fill {
    color: var(--vf-rating-hover-color);
}

.vf-rating_disabled {
    opacity: var(--vf-rating-disabled-opacity);
}

.vf-rating_disabled .vf-rating__item {
    cursor: not-allowed;
}

.vf-rating_readonly .vf-rating__item {
    cursor: default;
}

.vf-rating_small .vf-rating__item {
    --vf-rating-item-size: var(--vf-rating-small-size);
}

.vf-rating_large .vf-rating__item {
    --vf-rating-item-size: var(--vf-rating-large-size);
}
</style>
