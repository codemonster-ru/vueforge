<template>
    <span
        v-bind="rootAttrs"
        :style="rootStyle"
        :role="resolvedRole"
        :aria-hidden="resolvedAriaHidden"
        :aria-label="resolvedAriaLabel"
    >
        <v-icon v-bind="glyphAttrs" :icon="icon" :spin="spin" />
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CmIcon as VIcon } from '@codemonster-ru/vueiconify';
import { resolvePassThrough, withPartClass, type PassThroughOptions } from '@/package/config/pass-through';

interface Props {
    icon?: string;
    size?: string | number;
    color?: string;
    spin?: boolean;
    decorative?: boolean;
    ariaLabel?: string;
    pt?: PassThroughOptions;
    unstyled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    icon: '',
    size: undefined,
    color: undefined,
    spin: false,
    decorative: false,
    ariaLabel: 'Icon',
    pt: undefined,
    unstyled: false,
});

const ptContext = computed(() => ({
    decorative: props.decorative,
    spin: props.spin,
    hasIcon: Boolean(props.icon),
}));

const rootAttrs = computed(() =>
    withPartClass(
        resolvePassThrough(props.pt, 'root', ptContext.value),
        ['vf-icon', props.spin ? 'vf-icon_spin' : null].filter(Boolean).join(' '),
        props.unstyled,
    ),
);
const glyphAttrs = computed(() =>
    withPartClass(resolvePassThrough(props.pt, 'glyph', ptContext.value), 'vf-icon__glyph', props.unstyled),
);

const rootStyle = computed(() => ({
    fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
    color: props.color,
}));
const resolvedRole = computed(() => (props.decorative ? 'presentation' : 'img'));
const resolvedAriaHidden = computed(() => (props.decorative ? 'true' : undefined));
const resolvedAriaLabel = computed(() => (props.decorative ? undefined : props.ariaLabel));
</script>

<style lang="scss">
.vf-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--vf-icon-size);
    height: var(--vf-icon-size);
    font-size: var(--vf-icon-size);
    color: var(--vf-icon-color);
    line-height: 1;
}

.vf-icon__glyph {
    width: 1em;
    height: 1em;
}

.vf-icon_spin {
    animation: vf-icon-spin var(--vf-icon-spin-duration) linear infinite;
}

@keyframes vf-icon-spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
