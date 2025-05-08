<template>
    <div class="vf-card">
        <div v-if="$slots.default" class="vf-card__default">
            <slot name="default" />
        </div>
        <div v-if="$slots.header" class="vf-card__header">
            <slot name="header" />
        </div>
        <div v-if="$slots.body" class="vf-card__body">
            <slot name="body" />
        </div>
        <div v-if="$slots.footer" class="vf-card__footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<style lang="scss">
.vf-card {
    border: 1px solid var(--vf-card-border-color);
    border-radius: var(--vf-card-border-radius);
}

.vf-card__default {
    padding: var(--vf-card-padding);
}
</style>
