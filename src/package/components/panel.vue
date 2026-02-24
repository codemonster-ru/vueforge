<template>
    <section :class="rootClass" :aria-disabled="disabled || undefined">
        <header v-if="hasHeader" class="vf-panel__header">
            <div class="vf-panel__heading">
                <slot name="header">
                    <h3 v-if="hasTitle" class="vf-panel__title">
                        <slot name="title">{{ title }}</slot>
                    </h3>
                    <p v-if="hasSubtitle" class="vf-panel__subtitle">
                        <slot name="subtitle">{{ subtitle }}</slot>
                    </p>
                </slot>
            </div>
            <div
                v-if="$slots.actions || collapsible"
                class="vf-panel__actions"
                role="group"
                :aria-label="actionsAriaLabel || undefined"
            >
                <slot name="actions" />
                <button
                    v-if="collapsible"
                    type="button"
                    class="vf-panel__toggle"
                    :aria-expanded="expanded"
                    :aria-controls="bodyId"
                    :disabled="disabled"
                    @click="togglePanel"
                >
                    {{ expanded ? collapseLabel : expandLabel }}
                </button>
            </div>
        </header>
        <div v-if="expanded" :id="bodyId" class="vf-panel__body">
            <slot />
        </div>
        <footer v-if="$slots.footer && expanded" class="vf-panel__footer">
            <slot name="footer" />
        </footer>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface Props {
    modelValue?: boolean;
    title?: string;
    subtitle?: string;
    size?: Size;
    variant?: Variant;
    collapsible?: boolean;
    disabled?: boolean;
    actionsAriaLabel?: string;
    expandLabel?: string;
    collapseLabel?: string;
}

let panelIdSeed = 0;

const props = withDefaults(defineProps<Props>(), {
    modelValue: true,
    title: '',
    subtitle: '',
    size: 'normal',
    variant: 'filled',
    collapsible: false,
    disabled: false,
    actionsAriaLabel: 'Panel actions',
    expandLabel: 'Expand',
    collapseLabel: 'Collapse',
});

const emits = defineEmits(['update:modelValue', 'toggle']);

const slots = useSlots();
const expanded = ref(props.modelValue);
panelIdSeed += 1;
const panelId = `vf-panel-${panelIdSeed.toString(36)}`;
const bodyId = `${panelId}-body`;

watch(
    () => props.modelValue,
    value => {
        expanded.value = value;
    },
);

const hasTitle = computed(() => !!props.title || !!slots.title);
const hasSubtitle = computed(() => !!props.subtitle || !!slots.subtitle);
const hasHeader = computed(
    () => hasTitle.value || hasSubtitle.value || !!slots.header || !!slots.actions || props.collapsible,
);

const rootClass = computed(() => {
    const classes = ['vf-panel', `vf-panel_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-panel_${props.size}`);
    }
    if (props.disabled) {
        classes.push('vf-panel_disabled');
    }
    if (!expanded.value) {
        classes.push('vf-panel_collapsed');
    }

    return classes;
});

const togglePanel = (event: Event) => {
    if (props.disabled) {
        return;
    }

    const next = !expanded.value;
    expanded.value = next;
    emits('update:modelValue', next);
    emits('toggle', next, event);
};
</script>

<style lang="scss">
.vf-panel {
    border: var(--vf-border-width) solid var(--vf-panel-border-color);
    border-radius: var(--vf-panel-border-radius);
    background-color: var(--vf-panel-background-color);
    color: var(--vf-panel-text-color);
}

.vf-panel__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--vf-panel-header-gap);
    padding: var(--vf-panel-header-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-panel-footer-border-color);
}

.vf-panel__heading {
    display: grid;
    gap: 0.2rem;
}

.vf-panel__title {
    margin: 0;
    font-size: var(--vf-panel-title-font-size);
    font-weight: var(--vf-panel-title-font-weight);
}

.vf-panel__subtitle {
    margin: 0;
    font-size: var(--vf-panel-subtitle-font-size);
    color: var(--vf-panel-subtitle-color);
}

.vf-panel__actions {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--vf-panel-actions-gap);
}

.vf-panel__toggle {
    border: var(--vf-border-width) solid var(--vf-panel-toggle-border-color);
    border-radius: var(--vf-panel-toggle-radius);
    background-color: var(--vf-panel-toggle-background-color);
    color: var(--vf-panel-toggle-text-color);
    padding: 0.15rem 0.45rem;
    min-height: var(--vf-panel-toggle-size);
    cursor: pointer;
    font: inherit;
}

.vf-panel__toggle:hover {
    background-color: var(--vf-panel-toggle-hover-background-color);
}

.vf-panel__body {
    padding: var(--vf-panel-body-padding);
}

.vf-panel__footer {
    padding: var(--vf-panel-footer-padding);
    border-top: var(--vf-border-width) solid var(--vf-panel-footer-border-color);
}

.vf-panel_small .vf-panel__title {
    font-size: var(--vf-panel-small-title-font-size);
}

.vf-panel_small .vf-panel__body,
.vf-panel_small .vf-panel__footer,
.vf-panel_small .vf-panel__header {
    padding: var(--vf-panel-small-padding);
}

.vf-panel_large .vf-panel__title {
    font-size: var(--vf-panel-large-title-font-size);
}

.vf-panel_large .vf-panel__body,
.vf-panel_large .vf-panel__footer,
.vf-panel_large .vf-panel__header {
    padding: var(--vf-panel-large-padding);
}

.vf-panel_outlined {
    background-color: transparent;
}

.vf-panel_disabled {
    opacity: var(--vf-panel-disabled-opacity);
}

.vf-panel_disabled .vf-panel__toggle {
    cursor: not-allowed;
}
</style>
