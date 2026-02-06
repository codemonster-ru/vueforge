<template>
    <nav class="vf-breadcrumbs" :aria-label="ariaLabel">
        <ol class="vf-breadcrumbs__list">
            <template v-for="(item, index) in items" :key="getKey(item, index)">
                <li
                    class="vf-breadcrumbs__item"
                    :class="{ 'is-current': isCurrent(item, index), 'is-disabled': item.disabled }"
                >
                    <slot
                        name="item"
                        :item="item"
                        :index="index"
                        :is-last="index === items.length - 1"
                        :active="isCurrent(item, index)"
                    >
                        <span v-if="isCurrent(item, index)" class="vf-breadcrumbs__current" aria-current="page">
                            {{ item.label }}
                        </span>
                        <Link
                            v-else
                            class="vf-breadcrumbs__link"
                            :to="item.to"
                            :href="item.href ?? item.url"
                            :disabled="item.disabled"
                        >
                            {{ item.label }}
                        </Link>
                    </slot>
                </li>
                <li v-if="index < items.length - 1" class="vf-breadcrumbs__separator" aria-hidden="true">
                    <slot name="separator" :separator="separator">{{ separator }}</slot>
                </li>
            </template>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import type { RouteLocationAsRelativeGeneric, RouteLocationAsPathGeneric } from 'vue-router';
import { computed } from 'vue';
import Link from '@/package/components/link.vue';

interface BreadcrumbItem {
    label?: string;
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    href?: string;
    url?: string;
    active?: boolean;
    disabled?: boolean;
}

interface Props {
    items?: Array<BreadcrumbItem>;
    separator?: string;
    ariaLabel?: string;
}

defineOptions({ name: 'VfBreadcrumbs' });

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    separator: '/',
    ariaLabel: 'Breadcrumbs',
});

const items = computed(() => props.items ?? []);

const hasExplicitActive = computed(() => items.value.some(item => item.active !== undefined));
const isCurrent = (item: BreadcrumbItem, index: number) => {
    if (hasExplicitActive.value) {
        return item.active === true;
    }

    return index === items.value.length - 1;
};

const getKey = (item: BreadcrumbItem, index: number) => {
    const base = item.label ?? item.to ?? item.href ?? item.url ?? 'crumb';

    return `${base}_${index.toString()}`;
};
</script>

<style lang="scss">
.vf-breadcrumbs {
    display: block;
    --vf-link-hover-color: var(--vf-breadcrumbs-hover-color);
    --vf-link-active-color: var(--vf-breadcrumbs-active-color);
}

.vf-breadcrumbs__list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--vf-breadcrumbs-gap);
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--vf-breadcrumbs-font-size);
    line-height: var(--vf-typography-line-height);
    color: var(--vf-breadcrumbs-text-color);
}

.vf-breadcrumbs__item {
    display: inline-flex;
    align-items: center;
}

.vf-breadcrumbs__link {
    color: inherit;
    text-decoration: none;
}

.vf-breadcrumbs__current {
    color: var(--vf-breadcrumbs-active-color);
}

.vf-breadcrumbs__separator {
    display: inline-flex;
    align-items: center;
    color: var(--vf-breadcrumbs-separator-color);
}

.vf-breadcrumbs__item.is-disabled {
    opacity: var(--vf-breadcrumbs-disabled-opacity);
}
</style>
