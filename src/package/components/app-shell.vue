<template>
    <div
        class="vf-app-shell"
        :class="{
            'vf-app-shell_collapsed': !isMobile && localCollapsed,
            'vf-app-shell_mobile': isMobile,
            'vf-app-shell_mobile-open': isMobile && mobileSidebarOpen,
            'vf-app-shell_sticky-header': stickyHeader,
            'vf-app-shell_full-height': fullHeight,
        }"
        :style="shellStyle"
    >
        <aside class="vf-app-shell__sidebar" :aria-hidden="isMobile && !mobileSidebarOpen ? 'true' : 'false'">
            <slot name="sidebar" :mobile="isMobile" :collapsed="localCollapsed" />
        </aside>

        <button
            v-if="isMobile && mobileSidebarOpen"
            type="button"
            class="vf-app-shell__overlay"
            :aria-label="closeSidebarLabel"
            @click="closeMobileSidebar"
        />

        <header class="vf-app-shell__header">
            <button
                v-if="showToggle"
                type="button"
                class="vf-app-shell__toggle"
                :aria-label="toggleLabel"
                @click="onToggle"
            >
                {{ toggleIcon }}
            </button>
            <div class="vf-app-shell__header-content">
                <slot
                    name="header"
                    :mobile="isMobile"
                    :collapsed="localCollapsed"
                    :mobile-sidebar-open="mobileSidebarOpen"
                    :toggle-sidebar="onToggle"
                />
            </div>
        </header>

        <main class="vf-app-shell__main" :aria-label="mainAriaLabel">
            <slot />
        </main>

        <footer v-if="hasFooter" class="vf-app-shell__footer">
            <slot name="footer" :mobile="isMobile" :collapsed="localCollapsed" />
        </footer>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue';

interface Props {
    modelValue?: boolean;
    sidebarWidth?: string;
    sidebarCollapsedWidth?: string;
    mobileBreakpoint?: number;
    stickyHeader?: boolean;
    fullHeight?: boolean;
    showToggle?: boolean;
    closeOnEsc?: boolean;
    toggleLabel?: string;
    closeSidebarLabel?: string;
    toggleIcon?: string;
    mainAriaLabel?: string;
}

const emits = defineEmits(['update:modelValue', 'sidebar-toggle', 'breakpoint-change']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    sidebarWidth: '16rem',
    sidebarCollapsedWidth: '4.25rem',
    mobileBreakpoint: 1024,
    stickyHeader: true,
    fullHeight: true,
    showToggle: true,
    closeOnEsc: true,
    toggleLabel: 'Toggle sidebar',
    closeSidebarLabel: 'Close sidebar',
    toggleIcon: '☰',
    mainAriaLabel: 'Main content',
});

const slots = useSlots();
const hasFooter = computed(() => Boolean(slots.footer));
const localCollapsed = ref(Boolean(props.modelValue));
const isMobile = ref(false);
const mobileSidebarOpen = ref(false);

const shellStyle = computed(() => ({
    '--vf-app-shell-sidebar-width-prop': props.sidebarWidth,
    '--vf-app-shell-sidebar-collapsed-width-prop': props.sidebarCollapsedWidth,
}));

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
    }
};

const emitToggle = () => {
    emits('sidebar-toggle', {
        mobile: isMobile.value,
        collapsed: localCollapsed.value,
        open: isMobile.value ? mobileSidebarOpen.value : !localCollapsed.value,
    });
};

const onToggle = () => {
    if (isMobile.value) {
        mobileSidebarOpen.value = !mobileSidebarOpen.value;
        emitToggle();

        return;
    }

    localCollapsed.value = !localCollapsed.value;
    emits('update:modelValue', localCollapsed.value);
    emitToggle();
};

const closeMobileSidebar = () => {
    if (!mobileSidebarOpen.value) {
        return;
    }

    mobileSidebarOpen.value = false;
    emitToggle();
};

const onWindowKeydown = (event: KeyboardEvent) => {
    if (!props.closeOnEsc || !mobileSidebarOpen.value) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        closeMobileSidebar();
    }
};

watch(
    () => props.modelValue,
    value => {
        localCollapsed.value = Boolean(value);
    },
);

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
.vf-app-shell {
    --vf-app-shell-sidebar-current-width: var(--vf-app-shell-sidebar-width-prop);
    display: grid;
    grid-template-columns: var(--vf-app-shell-sidebar-current-width) minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr) auto;
    grid-template-areas:
        'sidebar header'
        'sidebar main'
        'sidebar footer';
    gap: var(--vf-app-shell-gap);
    background-color: var(--vf-app-shell-background-color);
    color: var(--vf-app-shell-text-color);
}

.vf-app-shell_full-height {
    min-height: 100vh;
}

.vf-app-shell_collapsed {
    --vf-app-shell-sidebar-current-width: var(--vf-app-shell-sidebar-collapsed-width-prop);
}

.vf-app-shell__sidebar {
    grid-area: sidebar;
    min-width: 0;
    border-right: var(--vf-border-width) solid var(--vf-app-shell-sidebar-border-color);
    background-color: var(--vf-app-shell-sidebar-background-color);
    overflow: auto;
}

.vf-app-shell__header {
    grid-area: header;
    min-width: 0;
    min-height: var(--vf-app-shell-header-height);
    padding: var(--vf-app-shell-header-padding);
    border-bottom: var(--vf-border-width) solid var(--vf-app-shell-header-border-color);
    background-color: var(--vf-app-shell-header-background-color);
    display: flex;
    align-items: center;
    gap: var(--vf-app-shell-header-gap);
    z-index: 1;
}

.vf-app-shell_sticky-header .vf-app-shell__header {
    position: sticky;
    top: 0;
}

.vf-app-shell__toggle {
    width: var(--vf-app-shell-toggle-size);
    height: var(--vf-app-shell-toggle-size);
    border: none;
    border-radius: var(--vf-app-shell-toggle-border-radius);
    background-color: var(--vf-app-shell-toggle-background-color);
    color: var(--vf-app-shell-toggle-text-color);
    font: inherit;
    cursor: pointer;
    flex: 0 0 auto;
}

.vf-app-shell__toggle:hover {
    background-color: var(--vf-app-shell-toggle-hover-background-color);
}

.vf-app-shell__header-content {
    min-width: 0;
    flex: 1 1 auto;
}

.vf-app-shell__main {
    grid-area: main;
    min-width: 0;
    min-height: 0;
    padding: var(--vf-app-shell-content-padding);
    background-color: var(--vf-app-shell-main-background-color);
    overflow: auto;
}

.vf-app-shell__footer {
    grid-area: footer;
    min-width: 0;
    padding: var(--vf-app-shell-footer-padding);
    border-top: var(--vf-border-width) solid var(--vf-app-shell-footer-border-color);
    background-color: var(--vf-app-shell-footer-background-color);
}

.vf-app-shell__overlay {
    position: fixed;
    inset: 0;
    border: none;
    background-color: var(--vf-app-shell-overlay-background-color);
    z-index: var(--vf-app-shell-z-index);
}

.vf-app-shell_mobile {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr) auto;
    grid-template-areas:
        'header'
        'main'
        'footer';
}

.vf-app-shell_mobile .vf-app-shell__sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: var(--vf-app-shell-sidebar-width-prop);
    max-width: min(88vw, var(--vf-app-shell-sidebar-width-prop));
    transform: translateX(-100%);
    transition: transform 0.18s ease;
    z-index: calc(var(--vf-app-shell-z-index) + 1);
}

.vf-app-shell_mobile-open .vf-app-shell__sidebar {
    transform: translateX(0);
}
</style>
