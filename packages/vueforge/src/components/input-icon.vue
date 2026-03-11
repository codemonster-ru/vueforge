<template>
    <component
        :is="as"
        class="vf-input-icon"
        :class="`vf-input-icon_${side}`"
        :aria-hidden="decorative ? 'true' : undefined"
        :aria-label="decorative ? undefined : ariaLabel || undefined"
    >
        <slot>
            <Icon
                v-if="icon"
                size="1em"
                :icon="icon"
                :aria-hidden="decorative ? 'true' : undefined"
                :role="decorative ? 'presentation' : 'img'"
                :aria-label="decorative ? undefined : ariaLabel || undefined"
            />
        </slot>
    </component>
</template>

<script setup lang="ts">
import { VueIconify as Icon } from '@codemonster-ru/vueiconify';

type Side = 'start' | 'end';

interface Props {
    icon?: string;
    side?: Side;
    as?: string;
    decorative?: boolean;
    ariaLabel?: string;
}

defineOptions({ name: 'VfInputIcon' });

withDefaults(defineProps<Props>(), {
    icon: '',
    side: 'start',
    as: 'span',
    decorative: true,
    ariaLabel: '',
});
</script>

<style lang="scss">
.vf-input-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--vf-input-icon-color);
    font-size: var(--vf-input-icon-size);
    line-height: 1;
}
</style>
