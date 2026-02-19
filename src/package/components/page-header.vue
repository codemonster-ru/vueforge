<template>
    <header :class="getClass">
        <div v-if="$slots.breadcrumbs" class="vf-page-header__breadcrumbs">
            <slot name="breadcrumbs" />
        </div>

        <div class="vf-page-header__main">
            <div class="vf-page-header__content">
                <h1 v-if="hasTitle" class="vf-page-header__title">
                    <slot name="title">{{ title }}</slot>
                </h1>
                <p v-if="hasSubtitle" class="vf-page-header__subtitle">
                    <slot name="subtitle">{{ subtitle }}</slot>
                </p>
                <div v-if="$slots.meta" class="vf-page-header__meta">
                    <slot name="meta" />
                </div>
                <div v-if="$slots.default" class="vf-page-header__body">
                    <slot />
                </div>
            </div>

            <div v-if="$slots.actions" class="vf-page-header__actions">
                <slot name="actions" />
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

type Size = 'small' | 'normal' | 'large';

interface Props {
    title?: string;
    subtitle?: string;
    size?: Size;
    divider?: boolean;
}

defineOptions({ name: 'VfPageHeader' });

const props = withDefaults(defineProps<Props>(), {
    title: '',
    subtitle: '',
    size: 'normal',
    divider: false,
});

const slots = useSlots();

const hasTitle = computed(() => !!props.title || !!slots.title);
const hasSubtitle = computed(() => !!props.subtitle || !!slots.subtitle);

const getClass = computed(() => {
    const classes = ['vf-page-header'];

    if (props.size !== 'normal') {
        classes.push(`vf-page-header_${props.size}`);
    }

    if (props.divider) {
        classes.push('vf-page-header_divider');
    }

    return classes;
});
</script>

<style lang="scss">
.vf-page-header {
    display: grid;
    gap: var(--vf-page-header-gap);
    padding: var(--vf-page-header-padding);
    border: var(--vf-border-width) solid var(--vf-page-header-border-color);
    border-radius: var(--vf-page-header-border-radius);
    background-color: var(--vf-page-header-background-color);
    color: var(--vf-page-header-text-color);
}

.vf-page-header__breadcrumbs {
    display: flex;
    align-items: center;
    min-width: 0;
    margin-bottom: var(--vf-page-header-breadcrumb-gap);
}

.vf-page-header__main {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--vf-page-header-actions-gap);
}

.vf-page-header__content {
    display: grid;
    gap: var(--vf-page-header-content-gap);
    min-width: 0;
}

.vf-page-header__title {
    margin: 0;
    font-size: var(--vf-page-header-title-font-size);
    line-height: var(--vf-page-header-title-line-height);
    font-weight: var(--vf-page-header-title-font-weight);
    color: inherit;
}

.vf-page-header__subtitle {
    margin: 0;
    font-size: var(--vf-page-header-subtitle-font-size);
    line-height: var(--vf-typography-line-height);
    color: var(--vf-page-header-subtitle-color);
}

.vf-page-header__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--vf-page-header-meta-gap);
}

.vf-page-header__body {
    color: var(--vf-page-header-subtitle-color);
}

.vf-page-header__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: var(--vf-page-header-actions-gap);
}

.vf-page-header_divider {
    border-bottom: var(--vf-border-width) solid var(--vf-page-header-divider-color);
}

.vf-page-header_small {
    padding: var(--vf-page-header-small-padding);

    .vf-page-header__title {
        font-size: var(--vf-page-header-small-title-font-size);
    }

    .vf-page-header__subtitle {
        font-size: var(--vf-page-header-small-subtitle-font-size);
    }
}

.vf-page-header_large {
    padding: var(--vf-page-header-large-padding);

    .vf-page-header__title {
        font-size: var(--vf-page-header-large-title-font-size);
    }

    .vf-page-header__subtitle {
        font-size: var(--vf-page-header-large-subtitle-font-size);
    }
}

@media (max-width: 720px) {
    .vf-page-header__main {
        flex-direction: column;
    }

    .vf-page-header__actions {
        justify-content: flex-start;
    }
}
</style>
