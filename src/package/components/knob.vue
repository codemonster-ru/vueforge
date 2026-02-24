<template>
    <div class="vf-knob" :class="{ 'vf-knob_disabled': disabled }" :style="knobStyle">
        <div
            ref="controlRef"
            class="vf-knob__control"
            role="slider"
            :tabindex="disabled ? -1 : 0"
            :aria-label="ariaLabel"
            :aria-disabled="disabled ? 'true' : undefined"
            :aria-readonly="readonly ? 'true' : undefined"
            :aria-valuemin="minValue"
            :aria-valuemax="maxValue"
            :aria-valuenow="currentValue"
            :aria-valuetext="showValue ? String(currentValue) : undefined"
            @keydown="onKeydown"
            @focus="onFocus"
            @blur="onBlur"
            @mousedown.prevent="onPointerDown"
        >
            <svg class="vf-knob__svg" :viewBox="`0 0 ${sizeValue} ${sizeValue}`" aria-hidden="true">
                <circle class="vf-knob__track" :cx="center" :cy="center" :r="radius" />
                <path class="vf-knob__fill" :d="arcPath" />
                <circle class="vf-knob__thumb" :cx="thumbX" :cy="thumbY" :r="thumbRadius" />
            </svg>
            <div v-if="showValue" class="vf-knob__value">{{ currentValue }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

interface Props {
    modelValue?: number;
    min?: number;
    max?: number;
    step?: number;
    size?: number;
    strokeWidth?: number;
    showValue?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    ariaLabel?: string;
}

const emits = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    size: 120,
    strokeWidth: 10,
    showValue: false,
    disabled: false,
    readonly: false,
    ariaLabel: 'Knob',
});

const controlRef = ref<HTMLElement | null>(null);
const internalValue = ref(0);
const dragging = ref(false);
let pendingPointerChanged = false;

const minValue = computed(() => (Number.isFinite(props.min) ? props.min : 0));
const maxValue = computed(() => (Number.isFinite(props.max) ? props.max : 100));
const stepValue = computed(() => (props.step > 0 ? props.step : 1));
const sizeValue = computed(() => Math.max(48, props.size));
const strokeValue = computed(() => Math.max(2, props.strokeWidth));

const clamp = (value: number) => Math.min(maxValue.value, Math.max(minValue.value, value));
const normalize = (value: number) => {
    const safe = Number.isFinite(value) ? value : minValue.value;
    const clamped = clamp(safe);
    const step = stepValue.value;
    const decimals = step.toString().includes('.') ? step.toString().split('.')[1].length : 0;
    const snapped = Math.round((clamped - minValue.value) / step) * step + minValue.value;

    return Number.parseFloat(snapped.toFixed(decimals));
};

const currentValue = computed(() => normalize(internalValue.value));
const range = computed(() => Math.max(1, maxValue.value - minValue.value));
const progress = computed(() => (currentValue.value - minValue.value) / range.value);

const center = computed(() => sizeValue.value / 2);
const radius = computed(() => center.value - strokeValue.value);
const thumbRadius = computed(() => Math.max(3, strokeValue.value * 0.55));
const startAngle = 135;
const sweep = 270;

const degToRad = (deg: number) => (deg * Math.PI) / 180;
const pointAt = (angleDeg: number) => {
    const angle = degToRad(angleDeg - 90);

    return {
        x: center.value + Math.cos(angle) * radius.value,
        y: center.value + Math.sin(angle) * radius.value,
    };
};

const endAngle = computed(() => startAngle + sweep * progress.value);
const thumbX = computed(() => pointAt(endAngle.value).x);
const thumbY = computed(() => pointAt(endAngle.value).y);
const arcPath = computed(() => {
    const start = pointAt(startAngle);
    const end = pointAt(endAngle.value);
    const largeArcFlag = endAngle.value - startAngle > 180 ? 1 : 0;

    return `M ${start.x} ${start.y} A ${radius.value} ${radius.value} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
});

const knobStyle = computed(() => ({
    '--vf-knob-size': `${sizeValue.value}px`,
    '--vf-knob-stroke-width': `${strokeValue.value}px`,
}));

const emitValue = (value: number, source: 'input' | 'change') => {
    const next = normalize(value);
    if (next === currentValue.value && source === 'input') {
        return;
    }

    internalValue.value = next;
    emits('update:modelValue', next);
    emits(source, next);
};

const setFromPointer = (clientX: number, clientY: number, source: 'input' | 'change') => {
    if (!controlRef.value) {
        return;
    }

    const rect = controlRef.value.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI + 90;
    const normalizedAngle = (angle + 360) % 360;
    const offset = ((normalizedAngle - startAngle + 360) % 360) / sweep;
    const bounded = Math.min(1, Math.max(0, offset));
    const value = minValue.value + bounded * range.value;

    emitValue(value, source);
};

const onPointerMove = (event: MouseEvent) => {
    if (!dragging.value || props.disabled || props.readonly) {
        return;
    }

    pendingPointerChanged = true;
    setFromPointer(event.clientX, event.clientY, 'input');
};

const onPointerUp = (event: MouseEvent) => {
    if (!dragging.value) {
        return;
    }

    dragging.value = false;
    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);

    if (pendingPointerChanged) {
        setFromPointer(event.clientX, event.clientY, 'change');
        pendingPointerChanged = false;
    }
};

const onPointerDown = (event: MouseEvent) => {
    if (props.disabled || props.readonly) {
        return;
    }

    dragging.value = true;
    pendingPointerChanged = false;
    setFromPointer(event.clientX, event.clientY, 'input');
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
};

const onKeydown = (event: KeyboardEvent) => {
    if (props.disabled || props.readonly) {
        return;
    }

    const coarseStep = stepValue.value * 10;

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        emitValue(currentValue.value + stepValue.value, 'input');
        emitValue(currentValue.value, 'change');
        return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault();
        emitValue(currentValue.value - stepValue.value, 'input');
        emitValue(currentValue.value, 'change');
        return;
    }

    if (event.key === 'PageUp') {
        event.preventDefault();
        emitValue(currentValue.value + coarseStep, 'input');
        emitValue(currentValue.value, 'change');
        return;
    }

    if (event.key === 'PageDown') {
        event.preventDefault();
        emitValue(currentValue.value - coarseStep, 'input');
        emitValue(currentValue.value, 'change');
        return;
    }

    if (event.key === 'Home') {
        event.preventDefault();
        emitValue(minValue.value, 'input');
        emitValue(minValue.value, 'change');
        return;
    }

    if (event.key === 'End') {
        event.preventDefault();
        emitValue(maxValue.value, 'input');
        emitValue(maxValue.value, 'change');
    }
};

const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

watch(
    () => [props.modelValue, props.min, props.max, props.step],
    () => {
        internalValue.value = normalize(props.modelValue ?? minValue.value);
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
});
</script>

<style lang="scss">
.vf-knob {
    display: inline-flex;
    width: var(--vf-knob-size);
    height: var(--vf-knob-size);
    color: var(--vf-knob-text-color);
}

.vf-knob__control {
    position: relative;
    width: 100%;
    height: 100%;
    outline: none;
    border-radius: 999px;
}

.vf-knob__control:focus-visible {
    box-shadow: var(--vf-knob-focus-ring-shadow);
}

.vf-knob__svg {
    width: 100%;
    height: 100%;
    display: block;
}

.vf-knob__track {
    fill: none;
    stroke: var(--vf-knob-track-color);
    stroke-width: var(--vf-knob-stroke-width);
}

.vf-knob__fill {
    fill: none;
    stroke: var(--vf-knob-fill-color);
    stroke-width: var(--vf-knob-stroke-width);
    stroke-linecap: round;
}

.vf-knob__thumb {
    fill: var(--vf-knob-thumb-color);
    stroke: var(--vf-knob-thumb-border-color);
    stroke-width: var(--vf-border-width);
}

.vf-knob__value {
    position: absolute;
    inset: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--vf-knob-value-font-size);
    color: var(--vf-knob-value-color);
    user-select: none;
}

.vf-knob_disabled {
    opacity: var(--vf-knob-disabled-opacity);
}
</style>
