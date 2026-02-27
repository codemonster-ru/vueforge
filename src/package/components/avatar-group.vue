<template>
    <div class="vf-avatar-group" :class="rootClass" role="group" :aria-label="ariaLabel">
        <div
            v-for="(item, index) in visibleItems"
            :key="item.key ?? `${item.name ?? 'avatar'}-${index.toString()}`"
            class="vf-avatar-group__item"
        >
            <slot name="item" :item="item" :index="index">
                <Avatar
                    class="vf-avatar-group__avatar"
                    :src="item.src"
                    :alt="item.alt"
                    :name="item.name"
                    :status="item.status"
                    :size="item.size ?? size"
                    :shape="item.shape ?? shape"
                />
            </slot>
        </div>

        <div v-if="overflowCount > 0" class="vf-avatar-group__item vf-avatar-group__item_overflow">
            <slot name="overflow" :count="overflowCount">
                <Avatar
                    class="vf-avatar-group__avatar vf-avatar-group__avatar_overflow"
                    :name="`+${overflowCount.toString()}`"
                    :alt="`${overflowCount.toString()} ${overflowLabel}`"
                    :size="size"
                    :shape="shape"
                />
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Avatar from './avatar.vue';

type AvatarSize = 'small' | 'normal' | 'large';
type AvatarShape = 'circle' | 'rounded';
type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarGroupItem {
    key?: string | number;
    src?: string;
    alt?: string;
    name?: string;
    size?: AvatarSize;
    shape?: AvatarShape;
    status?: AvatarStatus;
}

interface Props {
    items?: Array<AvatarGroupItem>;
    max?: number | null;
    size?: AvatarSize;
    shape?: AvatarShape;
    overlap?: boolean;
    ariaLabel?: string;
    overflowLabel?: string;
    disabled?: boolean;
}

defineOptions({ name: 'VfAvatarGroup' });

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    max: null,
    size: 'normal',
    shape: 'circle',
    overlap: true,
    ariaLabel: 'Avatar group',
    overflowLabel: 'more',
    disabled: false,
});

const normalizedMax = computed(() => {
    if (props.max == null) {
        return props.items.length;
    }

    return Math.max(0, props.max);
});

const visibleItems = computed(() => props.items.slice(0, normalizedMax.value));
const overflowCount = computed(() => Math.max(0, props.items.length - normalizedMax.value));

const rootClass = computed(() => ({
    'vf-avatar-group_overlap': props.overlap,
    'vf-avatar-group_stack': !props.overlap,
    'vf-avatar-group_disabled': props.disabled,
}));
</script>

<style lang="scss">
.vf-avatar-group {
    display: inline-flex;
    align-items: center;
}

.vf-avatar-group__item {
    position: relative;
}

.vf-avatar-group_overlap .vf-avatar-group__item + .vf-avatar-group__item {
    margin-inline-start: calc(-1 * var(--vf-avatar-group-overlap-offset));
}

.vf-avatar-group_stack {
    gap: var(--vf-avatar-group-gap);
}

.vf-avatar-group__avatar {
    box-shadow: 0 0 0 var(--vf-avatar-group-ring-width) var(--vf-avatar-group-ring-color);
}

.vf-avatar-group__avatar_overflow {
    background-color: var(--vf-avatar-group-overflow-background-color);
    color: var(--vf-avatar-group-overflow-text-color);
}

.vf-avatar-group_disabled {
    opacity: var(--vf-avatar-group-disabled-opacity);
    pointer-events: none;
}
</style>
