<template>
    <div class="vf-avatar" :class="getClass" :data-status="status || undefined" role="img" :aria-label="ariaLabel">
        <div class="vf-avatar__content">
            <slot>
                <img
                    v-if="shouldRenderImage"
                    class="vf-avatar__image"
                    :src="src"
                    :alt="alt || name || ''"
                    @error="onError"
                />
                <span v-else class="vf-avatar__initials">{{ initials }}</span>
            </slot>
        </div>
        <span v-if="status" class="vf-avatar__status" :data-status="status" aria-hidden="true" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type AvatarSize = 'small' | 'normal' | 'large';
type AvatarShape = 'circle' | 'rounded';
type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

interface Props {
    src?: string;
    alt?: string;
    name?: string;
    size?: AvatarSize;
    shape?: AvatarShape;
    status?: AvatarStatus;
}

const props = withDefaults(defineProps<Props>(), {
    src: '',
    alt: '',
    name: '',
    size: 'normal',
    shape: 'circle',
    status: undefined,
});

const hasError = ref(false);

const getInitials = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
        return '';
    }

    const parts = trimmed.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const initials = computed(() => getInitials(props.name || props.alt || ''));
const shouldRenderImage = computed(() => Boolean(props.src && !hasError.value));
const ariaLabel = computed(() => {
    if (props.alt) {
        return props.alt;
    }

    if (props.name) {
        return props.name;
    }

    return undefined;
});

const getClass = computed(() => [`vf-avatar_size-${props.size}`, `vf-avatar_shape-${props.shape}`]);

const onError = () => {
    hasError.value = true;
};

watch(
    () => props.src,
    () => {
        hasError.value = false;
    },
);
</script>

<style lang="scss">
.vf-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--vf-avatar-size);
    height: var(--vf-avatar-size);
    font-size: var(--vf-avatar-font-size);
    font-weight: var(--vf-avatar-font-weight);
    color: var(--vf-avatar-text-color);
    background-color: var(--vf-avatar-background-color);
    border: var(--vf-avatar-border-width) solid var(--vf-avatar-border-color);
    border-radius: var(--vf-avatar-border-radius);
    overflow: visible;
    position: relative;
    text-transform: uppercase;
    user-select: none;
}

.vf-avatar_shape-circle {
    border-radius: 50%;
}

.vf-avatar__content {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
    overflow: hidden;
}

.vf-avatar__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.vf-avatar__initials {
    line-height: 1;
}

.vf-avatar__status {
    position: absolute;
    right: 0;
    bottom: 0;
    width: var(--vf-avatar-status-size);
    height: var(--vf-avatar-status-size);
    border-radius: 50%;
    border: var(--vf-avatar-status-border-width) solid var(--vf-avatar-status-border-color);
    background-color: var(--vf-avatar-status-offline-color);
    transform: translate(0, 0);
}

.vf-avatar_size-small .vf-avatar__status {
    width: var(--vf-avatar-small-status-size);
    height: var(--vf-avatar-small-status-size);
}

.vf-avatar_size-large .vf-avatar__status {
    width: var(--vf-avatar-large-status-size);
    height: var(--vf-avatar-large-status-size);
}

.vf-avatar__status[data-status='online'] {
    background-color: var(--vf-avatar-status-online-color);
}

.vf-avatar__status[data-status='busy'] {
    background-color: var(--vf-avatar-status-busy-color);
}

.vf-avatar__status[data-status='away'] {
    background-color: var(--vf-avatar-status-away-color);
}

.vf-avatar_size-small {
    width: var(--vf-avatar-small-size);
    height: var(--vf-avatar-small-size);
    font-size: var(--vf-avatar-small-font-size);
}

.vf-avatar_size-large {
    width: var(--vf-avatar-large-size);
    height: var(--vf-avatar-large-size);
    font-size: var(--vf-avatar-large-font-size);
}
</style>
