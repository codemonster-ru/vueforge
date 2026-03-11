<template>
    <section class="vf-split-layout" :class="rootClass" :style="layoutStyle">
        <div v-if="showToggleBar" class="vf-split-layout__controls">
            <button
                v-if="showSecondaryPane"
                type="button"
                class="vf-split-layout__toggle"
                :aria-label="secondaryToggleLabel"
                @click="toggleSecondary"
            >
                {{ secondaryToggleIcon }}
            </button>
            <button
                v-if="showTertiaryPane"
                type="button"
                class="vf-split-layout__toggle"
                :aria-label="tertiaryToggleLabel"
                @click="toggleTertiary"
            >
                {{ tertiaryToggleIcon }}
            </button>
        </div>

        <div class="vf-split-layout__body">
            <main class="vf-split-layout__primary" :aria-label="primaryAriaLabel">
                <slot />
            </main>

            <aside
                v-if="showSecondaryPane"
                class="vf-split-layout__secondary"
                :aria-label="secondaryAriaLabel"
                :aria-hidden="isSecondaryHidden ? 'true' : 'false'"
            >
                <slot
                    name="secondary"
                    :mobile="isMobile"
                    :open="isMobile ? mobileSecondaryOpen : !secondaryCollapsed"
                />
            </aside>

            <aside
                v-if="showTertiaryPane"
                class="vf-split-layout__tertiary"
                :aria-label="tertiaryAriaLabel"
                :aria-hidden="isTertiaryHidden ? 'true' : 'false'"
            >
                <slot name="tertiary" :mobile="isMobile" :open="isMobile ? mobileTertiaryOpen : !tertiaryCollapsed" />
            </aside>
        </div>

        <button
            v-if="isMobile && mobileSecondaryOpen"
            type="button"
            class="vf-split-layout__overlay"
            :aria-label="closeSecondaryLabel"
            @click="closeSecondary"
        />
        <button
            v-if="isMobile && mobileTertiaryOpen"
            type="button"
            class="vf-split-layout__overlay"
            :aria-label="closeTertiaryLabel"
            @click="closeTertiary"
        />
    </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue';

type SplitLayoutPreset = 'master-detail' | 'inspector' | 'editor-preview';

interface Props {
    preset?: SplitLayoutPreset;
    secondaryCollapsed?: boolean;
    tertiaryCollapsed?: boolean;
    secondaryWidth?: string;
    tertiaryWidth?: string;
    mobileBreakpoint?: number;
    showMobileToggles?: boolean;
    showDesktopToggles?: boolean;
    closeOnEsc?: boolean;
    primaryAriaLabel?: string;
    secondaryAriaLabel?: string;
    tertiaryAriaLabel?: string;
    secondaryToggleLabel?: string;
    tertiaryToggleLabel?: string;
    closeSecondaryLabel?: string;
    closeTertiaryLabel?: string;
    secondaryToggleIcon?: string;
    tertiaryToggleIcon?: string;
}

defineOptions({ name: 'VfSplitLayout' });

const props = withDefaults(defineProps<Props>(), {
    preset: 'master-detail',
    secondaryCollapsed: false,
    tertiaryCollapsed: false,
    secondaryWidth: '22rem',
    tertiaryWidth: '18rem',
    mobileBreakpoint: 1024,
    showMobileToggles: true,
    showDesktopToggles: false,
    closeOnEsc: true,
    primaryAriaLabel: 'Primary pane',
    secondaryAriaLabel: 'Secondary pane',
    tertiaryAriaLabel: 'Tertiary pane',
    secondaryToggleLabel: 'Toggle secondary pane',
    tertiaryToggleLabel: 'Toggle tertiary pane',
    closeSecondaryLabel: 'Close secondary pane',
    closeTertiaryLabel: 'Close tertiary pane',
    secondaryToggleIcon: '\u25a4',
    tertiaryToggleIcon: '\u2630',
});

const emits = defineEmits<{
    (event: 'update:secondaryCollapsed', value: boolean): void;
    (event: 'update:tertiaryCollapsed', value: boolean): void;
    (event: 'breakpoint-change', mobile: boolean): void;
}>();

const slots = useSlots();
const hasSecondary = computed(() => Boolean(slots.secondary));
const hasTertiary = computed(() => Boolean(slots.tertiary));
const showSecondaryPane = computed(() => {
    if (!hasSecondary.value) {
        return false;
    }

    return props.preset !== 'inspector';
});
const showTertiaryPane = computed(() => {
    if (!hasTertiary.value) {
        return false;
    }

    return props.preset === 'inspector';
});
const isMobile = ref(false);
const secondaryCollapsed = ref(Boolean(props.secondaryCollapsed));
const tertiaryCollapsed = ref(Boolean(props.tertiaryCollapsed));
const mobileSecondaryOpen = ref(false);
const mobileTertiaryOpen = ref(false);

const syncViewport = () => {
    if (typeof window === 'undefined') {
        return;
    }

    const nextMobile = window.innerWidth < props.mobileBreakpoint;
    if (nextMobile !== isMobile.value) {
        isMobile.value = nextMobile;
        emits('breakpoint-change', nextMobile);
    }

    if (!nextMobile) {
        mobileSecondaryOpen.value = false;
        mobileTertiaryOpen.value = false;
    }
};

const showToggleBar = computed(() => (isMobile.value ? props.showMobileToggles : props.showDesktopToggles));

const closeSecondary = () => {
    mobileSecondaryOpen.value = false;
};

const closeTertiary = () => {
    mobileTertiaryOpen.value = false;
};

const toggleSecondary = () => {
    if (isMobile.value) {
        mobileSecondaryOpen.value = !mobileSecondaryOpen.value;
        if (mobileSecondaryOpen.value) {
            mobileTertiaryOpen.value = false;
        }
        return;
    }

    secondaryCollapsed.value = !secondaryCollapsed.value;
    emits('update:secondaryCollapsed', secondaryCollapsed.value);
};

const toggleTertiary = () => {
    if (isMobile.value) {
        mobileTertiaryOpen.value = !mobileTertiaryOpen.value;
        if (mobileTertiaryOpen.value) {
            mobileSecondaryOpen.value = false;
        }
        return;
    }

    tertiaryCollapsed.value = !tertiaryCollapsed.value;
    emits('update:tertiaryCollapsed', tertiaryCollapsed.value);
};

const onWindowKeydown = (event: KeyboardEvent) => {
    if (!props.closeOnEsc || event.key !== 'Escape') {
        return;
    }

    if (mobileSecondaryOpen.value || mobileTertiaryOpen.value) {
        event.preventDefault();
        closeSecondary();
        closeTertiary();
    }
};

watch(
    () => props.secondaryCollapsed,
    value => {
        secondaryCollapsed.value = Boolean(value);
    },
);

watch(
    () => props.tertiaryCollapsed,
    value => {
        tertiaryCollapsed.value = Boolean(value);
    },
);

const isSecondaryHidden = computed(() => {
    if (!showSecondaryPane.value) {
        return true;
    }

    return isMobile.value ? !mobileSecondaryOpen.value : secondaryCollapsed.value;
});
const isTertiaryHidden = computed(() => {
    if (!showTertiaryPane.value) {
        return true;
    }

    return isMobile.value ? !mobileTertiaryOpen.value : tertiaryCollapsed.value;
});

const rootClass = computed(() => [
    `vf-split-layout_${props.preset}`,
    isMobile.value ? 'vf-split-layout_mobile' : null,
    secondaryCollapsed.value ? 'vf-split-layout_secondary-collapsed' : null,
    tertiaryCollapsed.value ? 'vf-split-layout_tertiary-collapsed' : null,
    showSecondaryPane.value ? null : 'vf-split-layout_no-secondary',
    showTertiaryPane.value ? null : 'vf-split-layout_no-tertiary',
    mobileSecondaryOpen.value ? 'vf-split-layout_mobile-secondary-open' : null,
    mobileTertiaryOpen.value ? 'vf-split-layout_mobile-tertiary-open' : null,
]);

const layoutStyle = computed(() => ({
    '--vf-split-layout-secondary-width-prop': props.secondaryWidth,
    '--vf-split-layout-tertiary-width-prop': props.tertiaryWidth,
}));

if (typeof window !== 'undefined') {
    syncViewport();
    window.addEventListener('resize', syncViewport, false);
    window.addEventListener('keydown', onWindowKeydown, false);
}

onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', syncViewport, false);
        window.removeEventListener('keydown', onWindowKeydown, false);
    }
});
</script>

<style lang="scss">
.vf-split-layout {
    min-height: var(--vf-split-layout-min-height);
    background-color: var(--vf-split-layout-background-color);
    color: var(--vf-split-layout-text-color);
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: var(--vf-split-layout-gap);
}

.vf-split-layout__controls {
    display: inline-flex;
    gap: var(--vf-split-layout-controls-gap);
    padding: 0 var(--vf-split-layout-padding);
}

.vf-split-layout__toggle {
    width: var(--vf-split-layout-toggle-size);
    height: var(--vf-split-layout-toggle-size);
    border: var(--vf-border-width) solid var(--vf-split-layout-toggle-border-color);
    border-radius: var(--vf-split-layout-toggle-border-radius);
    background-color: var(--vf-split-layout-toggle-background-color);
    color: var(--vf-split-layout-toggle-text-color);
    cursor: pointer;
}

.vf-split-layout__body {
    min-width: 0;
    min-height: 0;
    display: grid;
    gap: var(--vf-split-layout-gap);
    grid-template-columns:
        minmax(0, 1fr)
        var(--vf-split-layout-secondary-width-current, var(--vf-split-layout-secondary-width-prop))
        var(--vf-split-layout-tertiary-width-current, var(--vf-split-layout-tertiary-width-prop));
}

.vf-split-layout_secondary-collapsed {
    --vf-split-layout-secondary-width-current: 0;
}

.vf-split-layout_tertiary-collapsed {
    --vf-split-layout-tertiary-width-current: 0;
}

.vf-split-layout_no-secondary {
    --vf-split-layout-secondary-width-current: 0;
}

.vf-split-layout_no-tertiary {
    --vf-split-layout-tertiary-width-current: 0;
}

.vf-split-layout_master-detail {
    --vf-split-layout-tertiary-width-current: 0;
}

.vf-split-layout_inspector {
    --vf-split-layout-secondary-width-current: 0;
}

.vf-split-layout__primary {
    min-width: 0;
    min-height: 0;
    overflow: auto;
    padding: var(--vf-split-layout-padding);
    background-color: var(--vf-split-layout-primary-background-color);
}

.vf-split-layout__secondary,
.vf-split-layout__tertiary {
    min-width: 0;
    overflow: auto;
    padding: var(--vf-split-layout-panel-padding);
    border: var(--vf-border-width) solid var(--vf-split-layout-panel-border-color);
    background-color: var(--vf-split-layout-panel-background-color);
}

.vf-split-layout_mobile .vf-split-layout__body {
    grid-template-columns: minmax(0, 1fr);
}

.vf-split-layout_mobile .vf-split-layout__secondary,
.vf-split-layout_mobile .vf-split-layout__tertiary {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    width: min(88vw, var(--vf-split-layout-secondary-width-prop));
    transform: translateX(100%);
    transition: transform 0.18s ease;
    z-index: calc(var(--vf-split-layout-z-index) + 1);
}

.vf-split-layout_mobile .vf-split-layout__tertiary {
    width: min(88vw, var(--vf-split-layout-tertiary-width-prop));
}

.vf-split-layout_mobile-secondary-open .vf-split-layout__secondary {
    transform: translateX(0);
}

.vf-split-layout_mobile-tertiary-open .vf-split-layout__tertiary {
    transform: translateX(0);
}

.vf-split-layout__overlay {
    position: fixed;
    inset: 0;
    border: none;
    background-color: var(--vf-split-layout-overlay-background-color);
    z-index: var(--vf-split-layout-z-index);
}
</style>
