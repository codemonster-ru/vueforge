<template>
    <component :is="as" class="vf-footer" :class="rootClass" :role="landmarkRole" :aria-label="ariaLabel || undefined">
        <div
            v-if="$slots.left"
            class="vf-footer__section vf-footer__section_left"
            role="group"
            :aria-label="leftAriaLabel"
        >
            <slot name="left" />
        </div>
        <div
            v-if="$slots.center"
            class="vf-footer__section vf-footer__section_center"
            role="group"
            :aria-label="centerAriaLabel"
        >
            <slot name="center" />
        </div>
        <div
            v-if="$slots.right"
            class="vf-footer__section vf-footer__section_right"
            role="group"
            :aria-label="rightAriaLabel"
        >
            <slot name="right" />
        </div>
        <div
            v-if="$slots.default && !$slots.left && !$slots.center && !$slots.right"
            class="vf-footer__section vf-footer__section_default"
            role="group"
            :aria-label="groupAriaLabel"
        >
            <slot />
        </div>
    </component>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

interface Props {
    as?: string;
    bordered?: boolean;
    dense?: boolean;
    wrap?: boolean;
    stackOnMobile?: boolean;
    mobileBreakpoint?: number;
    ariaLabel?: string;
    groupAriaLabel?: string;
    leftAriaLabel?: string;
    centerAriaLabel?: string;
    rightAriaLabel?: string;
}

defineOptions({ name: 'VfFooter' });

const props = withDefaults(defineProps<Props>(), {
    as: 'footer',
    bordered: true,
    dense: false,
    wrap: true,
    stackOnMobile: true,
    mobileBreakpoint: 720,
    ariaLabel: '',
    groupAriaLabel: 'Footer content',
    leftAriaLabel: 'Footer left section',
    centerAriaLabel: 'Footer center section',
    rightAriaLabel: 'Footer right section',
});

const isMobile = ref(false);

const syncViewport = () => {
    if (typeof window === 'undefined') {
        return;
    }

    isMobile.value = window.innerWidth <= props.mobileBreakpoint;
};

const landmarkRole = computed(() => {
    if (props.as.toLowerCase() === 'footer') {
        return undefined;
    }

    return 'contentinfo';
});

const rootClass = computed(() => {
    const classes = [];

    if (props.bordered) {
        classes.push('vf-footer_bordered');
    }

    if (props.dense) {
        classes.push('vf-footer_dense');
    }

    if (props.wrap) {
        classes.push('vf-footer_wrap');
    }

    if (props.stackOnMobile && isMobile.value) {
        classes.push('vf-footer_mobile');
    }

    return classes;
});

if (typeof window !== 'undefined') {
    syncViewport();
    window.addEventListener('resize', syncViewport, false);
}

onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', syncViewport, false);
    }
});
</script>

<style lang="scss">
.vf-footer {
    min-height: var(--vf-footer-min-height);
    padding: var(--vf-footer-padding);
    background-color: var(--vf-footer-background-color);
    color: var(--vf-footer-text-color);
    display: flex;
    align-items: center;
    gap: var(--vf-footer-gap);
}

.vf-footer_bordered {
    border-top: var(--vf-border-width) solid var(--vf-footer-border-color);
}

.vf-footer_dense {
    min-height: var(--vf-footer-dense-min-height);
    padding: var(--vf-footer-dense-padding);
}

.vf-footer_wrap {
    flex-wrap: wrap;
}

.vf-footer__section {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--vf-footer-section-gap);
}

.vf-footer__section_left {
    margin-inline-end: auto;
}

.vf-footer__section_center {
    margin-inline: auto;
}

.vf-footer__section_right {
    margin-inline-start: auto;
}

.vf-footer_mobile {
    flex-direction: column;
    align-items: stretch;
    gap: var(--vf-footer-mobile-gap);
}

.vf-footer_mobile .vf-footer__section {
    margin-inline: 0;
    width: 100%;
    justify-content: flex-start;
}
</style>
