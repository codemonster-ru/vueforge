<template>
    <section class="vf-page-layout" :class="rootClass" :style="layoutStyle">
        <header v-if="hasHeader" class="vf-page-layout__header">
            <slot
                name="header"
                :mobile="isMobile"
                :sidebar-open="mobileSidebarOpen"
                :aside-open="mobileAsideOpen"
                :toggle-sidebar="toggleSidebar"
                :toggle-aside="toggleAside"
            />
        </header>

        <div
            v-if="(isMobile ? showMobileToggles : showDesktopToggles) && (hasSidebar || hasAside)"
            class="vf-page-layout__controls"
        >
            <button
                v-if="hasSidebar"
                type="button"
                class="vf-page-layout__toggle"
                :aria-label="sidebarToggleLabel"
                @click="toggleSidebar"
            >
                {{ sidebarToggleIcon }}
            </button>
            <button
                v-if="hasAside"
                type="button"
                class="vf-page-layout__toggle"
                :aria-label="asideToggleLabel"
                @click="toggleAside"
            >
                {{ asideToggleIcon }}
            </button>
        </div>

        <div class="vf-page-layout__body">
            <aside
                v-if="hasSidebar"
                class="vf-page-layout__sidebar"
                :aria-label="sidebarAriaLabel"
                :aria-hidden="isSidebarHidden ? 'true' : 'false'"
            >
                <slot name="sidebar" :mobile="isMobile" :open="isMobile ? mobileSidebarOpen : !sidebarCollapsed" />
            </aside>

            <main class="vf-page-layout__main" :aria-label="mainAriaLabel">
                <slot />
            </main>

            <aside
                v-if="hasAside"
                class="vf-page-layout__aside"
                :aria-label="asideAriaLabel"
                :aria-hidden="isAsideHidden ? 'true' : 'false'"
            >
                <slot name="aside" :mobile="isMobile" :open="isMobile ? mobileAsideOpen : !asideCollapsed" />
            </aside>
        </div>

        <button
            v-if="isMobile && mobileSidebarOpen"
            type="button"
            class="vf-page-layout__overlay vf-page-layout__overlay_left"
            :aria-label="closeSidebarLabel"
            @click="closeSidebar"
        />
        <button
            v-if="isMobile && mobileAsideOpen"
            type="button"
            class="vf-page-layout__overlay vf-page-layout__overlay_right"
            :aria-label="closeAsideLabel"
            @click="closeAside"
        />

        <footer v-if="hasFooter" class="vf-page-layout__footer">
            <slot
                name="footer"
                :mobile="isMobile"
                :sidebar-open="mobileSidebarOpen"
                :aside-open="mobileAsideOpen"
                :toggle-sidebar="toggleSidebar"
                :toggle-aside="toggleAside"
            />
        </footer>
    </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue';

interface Props {
    sidebarCollapsed?: boolean;
    asideCollapsed?: boolean;
    sidebarWidth?: string;
    asideWidth?: string;
    mobileBreakpoint?: number;
    showMobileToggles?: boolean;
    showDesktopToggles?: boolean;
    closeOnEsc?: boolean;
    sidebarToggleLabel?: string;
    asideToggleLabel?: string;
    closeSidebarLabel?: string;
    closeAsideLabel?: string;
    sidebarToggleIcon?: string;
    asideToggleIcon?: string;
    mainAriaLabel?: string;
    sidebarAriaLabel?: string;
    asideAriaLabel?: string;
}

defineOptions({ name: 'VfPageLayout' });

const props = withDefaults(defineProps<Props>(), {
    sidebarCollapsed: false,
    asideCollapsed: false,
    sidebarWidth: '16rem',
    asideWidth: '18rem',
    mobileBreakpoint: 1024,
    showMobileToggles: true,
    showDesktopToggles: false,
    closeOnEsc: true,
    sidebarToggleLabel: 'Toggle sidebar',
    asideToggleLabel: 'Toggle details panel',
    closeSidebarLabel: 'Close sidebar',
    closeAsideLabel: 'Close details panel',
    sidebarToggleIcon: '\u2630',
    asideToggleIcon: '\u25a4',
    mainAriaLabel: 'Page content',
    sidebarAriaLabel: 'Page sidebar',
    asideAriaLabel: 'Page aside',
});

const emits = defineEmits<{
    (event: 'update:sidebarCollapsed', value: boolean): void;
    (event: 'update:asideCollapsed', value: boolean): void;
    (event: 'breakpoint-change', mobile: boolean): void;
}>();

const slots = useSlots();
const hasHeader = computed(() => Boolean(slots.header));
const hasFooter = computed(() => Boolean(slots.footer));
const hasSidebar = computed(() => Boolean(slots.sidebar));
const hasAside = computed(() => Boolean(slots.aside));

const sidebarCollapsed = ref(Boolean(props.sidebarCollapsed));
const asideCollapsed = ref(Boolean(props.asideCollapsed));
const isMobile = ref(false);
const mobileSidebarOpen = ref(false);
const mobileAsideOpen = ref(false);

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
        mobileSidebarOpen.value = false;
        mobileAsideOpen.value = false;
    }
};

const closeSidebar = () => {
    mobileSidebarOpen.value = false;
};

const closeAside = () => {
    mobileAsideOpen.value = false;
};

const toggleSidebar = () => {
    if (isMobile.value) {
        mobileSidebarOpen.value = !mobileSidebarOpen.value;
        if (mobileSidebarOpen.value) {
            mobileAsideOpen.value = false;
        }
        return;
    }

    sidebarCollapsed.value = !sidebarCollapsed.value;
    emits('update:sidebarCollapsed', sidebarCollapsed.value);
};

const toggleAside = () => {
    if (isMobile.value) {
        mobileAsideOpen.value = !mobileAsideOpen.value;
        if (mobileAsideOpen.value) {
            mobileSidebarOpen.value = false;
        }
        return;
    }

    asideCollapsed.value = !asideCollapsed.value;
    emits('update:asideCollapsed', asideCollapsed.value);
};

const onWindowKeydown = (event: KeyboardEvent) => {
    if (!props.closeOnEsc) {
        return;
    }

    if (event.key !== 'Escape') {
        return;
    }

    if (mobileSidebarOpen.value || mobileAsideOpen.value) {
        event.preventDefault();
        closeSidebar();
        closeAside();
    }
};

watch(
    () => props.sidebarCollapsed,
    value => {
        sidebarCollapsed.value = Boolean(value);
    },
);

watch(
    () => props.asideCollapsed,
    value => {
        asideCollapsed.value = Boolean(value);
    },
);

const layoutStyle = computed(() => ({
    '--vf-page-layout-sidebar-width-prop': props.sidebarWidth,
    '--vf-page-layout-aside-width-prop': props.asideWidth,
}));

const isSidebarHidden = computed(() => {
    if (!hasSidebar.value) {
        return true;
    }

    if (isMobile.value) {
        return !mobileSidebarOpen.value;
    }

    return sidebarCollapsed.value;
});

const isAsideHidden = computed(() => {
    if (!hasAside.value) {
        return true;
    }

    if (isMobile.value) {
        return !mobileAsideOpen.value;
    }

    return asideCollapsed.value;
});

const rootClass = computed(() => {
    return [
        isMobile.value ? 'vf-page-layout_mobile' : null,
        hasSidebar.value ? null : 'vf-page-layout_no-sidebar',
        hasAside.value ? null : 'vf-page-layout_no-aside',
        sidebarCollapsed.value ? 'vf-page-layout_sidebar-collapsed' : null,
        asideCollapsed.value ? 'vf-page-layout_aside-collapsed' : null,
        mobileSidebarOpen.value ? 'vf-page-layout_mobile-sidebar-open' : null,
        mobileAsideOpen.value ? 'vf-page-layout_mobile-aside-open' : null,
    ];
});

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
.vf-page-layout {
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    gap: var(--vf-page-layout-gap);
    background-color: var(--vf-page-layout-background-color);
    color: var(--vf-page-layout-text-color);
    min-height: var(--vf-page-layout-min-height);
}

.vf-page-layout__header {
    min-width: 0;
    padding: var(--vf-page-layout-header-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-page-layout-header-border-color);
}

.vf-page-layout__controls {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--vf-page-layout-controls-gap);
    padding: 0 var(--vf-page-layout-content-padding);
}

.vf-page-layout__toggle {
    width: var(--vf-page-layout-toggle-size);
    height: var(--vf-page-layout-toggle-size);
    border: var(--vf-border-width) solid var(--vf-page-layout-toggle-border-color);
    border-radius: var(--vf-page-layout-toggle-border-radius);
    background-color: var(--vf-page-layout-toggle-background-color);
    color: var(--vf-page-layout-toggle-text-color);
    font: inherit;
    cursor: pointer;
}

.vf-page-layout__toggle:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--vf-primary-color);
}

.vf-page-layout__body {
    display: grid;
    min-width: 0;
    min-height: 0;
    grid-template-columns:
        var(--vf-page-layout-sidebar-width-current, var(--vf-page-layout-sidebar-width-prop))
        minmax(0, 1fr)
        var(--vf-page-layout-aside-width-current, var(--vf-page-layout-aside-width-prop));
    gap: var(--vf-page-layout-gap);
}

.vf-page-layout_sidebar-collapsed {
    --vf-page-layout-sidebar-width-current: 0;
}

.vf-page-layout_aside-collapsed {
    --vf-page-layout-aside-width-current: 0;
}

.vf-page-layout_no-sidebar {
    --vf-page-layout-sidebar-width-current: 0;
}

.vf-page-layout_no-aside {
    --vf-page-layout-aside-width-current: 0;
}

.vf-page-layout__sidebar,
.vf-page-layout__aside {
    min-width: 0;
    overflow: auto;
    background-color: var(--vf-page-layout-panel-background-color);
    border: var(--vf-border-width) solid var(--vf-page-layout-panel-border-color);
}

.vf-page-layout__main {
    min-width: 0;
    min-height: 0;
    overflow: auto;
    padding: var(--vf-page-layout-content-padding);
    background-color: var(--vf-page-layout-content-background-color);
}

.vf-page-layout__footer {
    min-width: 0;
    padding: var(--vf-page-layout-footer-padding);
    border-top: var(--vf-border-width) solid var(--vf-page-layout-footer-border-color);
}

.vf-page-layout_mobile .vf-page-layout__body {
    grid-template-columns: minmax(0, 1fr);
}

.vf-page-layout_mobile .vf-page-layout__sidebar,
.vf-page-layout_mobile .vf-page-layout__aside {
    position: fixed;
    top: 0;
    bottom: 0;
    width: min(88vw, var(--vf-page-layout-sidebar-width-prop));
    z-index: calc(var(--vf-page-layout-z-index) + 1);
    transform: translateX(-100%);
    transition: transform 0.18s ease;
}

.vf-page-layout_mobile .vf-page-layout__aside {
    width: min(88vw, var(--vf-page-layout-aside-width-prop));
    right: 0;
    left: auto;
    transform: translateX(100%);
}

.vf-page-layout_mobile-sidebar-open .vf-page-layout__sidebar {
    transform: translateX(0);
}

.vf-page-layout_mobile-aside-open .vf-page-layout__aside {
    transform: translateX(0);
}

.vf-page-layout__overlay {
    position: fixed;
    inset: 0;
    border: none;
    background-color: var(--vf-page-layout-overlay-background-color);
    z-index: var(--vf-page-layout-z-index);
}

.vf-page-layout__overlay_right {
    left: auto;
}
</style>
