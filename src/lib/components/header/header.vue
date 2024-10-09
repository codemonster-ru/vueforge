<template>
    <header class='cm-header'>
        <cm-container>
            <div v-if='$slots.left' class='cm-header__left'>
                <slot name='left' />
            </div>
            <div v-if='$slots.right' class='cm-header__right'>
                <slot name='right' />
            </div>
        </cm-container>
    </header>
</template>

<script setup lang='ts'>
import('./header.scss');
import('./headerTheme.scss');

import { CmContainer } from '@/lib';
</script>