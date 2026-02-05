<template>
    <div :class="getClass">
        <button
            :id="headerId"
            class="vf-accordion__header"
            type="button"
            :disabled="isDisabled"
            :aria-expanded="isOpen"
            :aria-controls="panelId"
            @click="onClick"
        >
            <span class="vf-accordion__title">
                <slot name="title">{{ title }}</slot>
            </span>
            <span class="vf-accordion__icon" aria-hidden="true"></span>
        </button>
        <div
            v-if="shouldRender"
            :id="panelId"
            class="vf-accordion__panel"
            :class="{ 'vf-accordion__panel_open': isOpen }"
            role="region"
            :aria-labelledby="headerId"
            :aria-hidden="isOpen ? undefined : 'true'"
        >
            <div class="vf-accordion__panel-inner">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { accordionKey, type AccordionContext, type AccordionValue } from './accordion-context';

interface Props {
    value: AccordionValue;
    title?: string;
    disabled?: boolean;
    unmount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    disabled: false,
    unmount: false,
});

const context = inject<AccordionContext | null>(accordionKey, null);

const isOpen = computed(() => {
    if (!context) {
        return false;
    }

    const current = context.modelValue.value;

    if (Array.isArray(current)) {
        return current.includes(props.value);
    }

    return current === props.value;
});

const isDisabled = computed(() => (context?.disabled.value ?? false) || props.disabled);

const headerId = computed(() => (context ? context.getHeaderId(props.value) : undefined));
const panelId = computed(() => (context ? context.getPanelId(props.value) : undefined));

const shouldRender = computed(() => {
    if (!props.unmount) {
        return true;
    }

    return isOpen.value;
});

const getClass = computed(() => {
    const classes = ['vf-accordion-item'];

    if (isOpen.value) {
        classes.push('vf-accordion-item_open');
    }

    if (isDisabled.value) {
        classes.push('vf-accordion-item_disabled');
    }

    return classes;
});

const onClick = (event: Event) => {
    if (!context || isDisabled.value) {
        return;
    }

    context.onToggle(props.value, event);
};
</script>

<style lang="scss">
.vf-accordion-item {
    border: var(--vf-border-width) solid var(--vf-accordion-border-color);
    border-radius: var(--vf-accordion-border-radius);
    background-color: var(--vf-accordion-background-color);
    overflow: hidden;
}

.vf-accordion__header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-accordion-header-gap);
    padding: var(--vf-accordion-header-padding);
    border: none;
    background-color: var(--vf-accordion-header-background-color);
    color: var(--vf-accordion-header-text-color);
    font-size: var(--vf-accordion-header-font-size);
    font-weight: var(--vf-accordion-header-font-weight);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    transition:
        background-color 0.2s ease,
        color 0.2s ease;
}

.vf-accordion__header:focus-visible {
    outline: none;
    box-shadow: var(--vf-accordion-focus-ring-shadow);
    border-radius: calc(var(--vf-accordion-border-radius) - 1px);
}

.vf-accordion__header:hover:not(:disabled) {
    background-color: var(--vf-accordion-header-hover-background-color);
}

.vf-accordion-item_open .vf-accordion__header {
    background-color: var(--vf-accordion-header-active-background-color);
}

.vf-accordion__title {
    flex: 1;
}

.vf-accordion__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--vf-accordion-icon-size);
    height: var(--vf-accordion-icon-size);
    color: var(--vf-accordion-icon-color);
    transition: transform 0.2s ease;
}

.vf-accordion__icon::before {
    content: '';
    width: calc(var(--vf-accordion-icon-size) / 2);
    height: calc(var(--vf-accordion-icon-size) / 2);
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(45deg);
}

.vf-accordion-item_open .vf-accordion__icon {
    transform: rotate(180deg);
}

.vf-accordion__panel {
    display: grid;
    grid-template-rows: 0fr;
    padding: var(--vf-accordion-content-padding);
    border-top: var(--vf-border-width) solid var(--vf-accordion-divider-color);
    background-color: var(--vf-accordion-content-background-color);
    color: var(--vf-accordion-content-text-color);
    opacity: 0;
    transition:
        grid-template-rows 0.2s ease,
        opacity 0.2s ease;
}

.vf-accordion__panel-inner {
    overflow: hidden;
}

.vf-accordion__panel_open {
    grid-template-rows: 1fr;
    opacity: 1;
}

.vf-accordion-item_disabled {
    opacity: var(--vf-accordion-disabled-opacity);

    .vf-accordion__header {
        cursor: not-allowed;
    }
}

.vf-accordion_outlined {
    .vf-accordion-item {
        background-color: transparent;
    }

    .vf-accordion__header {
        background-color: transparent;
    }

    .vf-accordion__panel {
        background-color: transparent;
    }
}

.vf-accordion_small {
    .vf-accordion__header {
        padding: var(--vf-accordion-small-header-padding);
        font-size: var(--vf-accordion-small-header-font-size);
    }

    .vf-accordion__panel {
        padding: var(--vf-accordion-small-content-padding);
    }
}

.vf-accordion_large {
    .vf-accordion__header {
        padding: var(--vf-accordion-large-header-padding);
        font-size: var(--vf-accordion-large-header-font-size);
    }

    .vf-accordion__panel {
        padding: var(--vf-accordion-large-content-padding);
    }
}
</style>
