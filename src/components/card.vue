<template>
    <div class='cm-card'>
        <div v-if='$slots.default' class='cm-card__default'>
            <slot name='default' />
        </div>
        <div v-if='$slots.header' class='cm-card__header'>
            <slot name='header' />
        </div>
        <div v-if='$slots.body' class='cm-card__body'>
            <slot name='body' />
        </div>
        <div v-if='$slots.footer' class='cm-card__footer'>
            <slot name='footer' />
        </div>
    </div>
</template>

<style lang='scss'>
.cm-card {
    border: 1px solid var(--cm-card-border-color);
    border-radius: var(--cm-card-border-radius);
}

.cm-card__default {
    padding: var(--cm-card-padding);
}

</style>