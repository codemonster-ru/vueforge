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

<script setup lang='ts'>
import('./card.scss');
import('./cardTheme.scss');
</script>