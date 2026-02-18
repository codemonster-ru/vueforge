<template>
    <section
        v-show="isVisible"
        :id="panelId"
        class="vf-wizard-step"
        role="tabpanel"
        :aria-labelledby="stepId"
        :aria-hidden="isVisible ? 'false' : 'true'"
    >
        <slot />
    </section>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { wizardKey, type WizardValue } from './wizard-context';

interface Props {
    value: WizardValue;
}

const props = defineProps<Props>();
const wizard = inject(wizardKey, null);

if (!wizard) {
    throw new Error('WizardStep must be used inside Wizard');
}

const isVisible = computed(() => wizard.isActive(props.value));
const panelId = computed(() => wizard.getPanelId(props.value));
const stepId = computed(() => wizard.getStepId(props.value));
</script>

<style lang="scss">
.vf-wizard-step {
    width: 100%;
    min-width: 0;
}
</style>
