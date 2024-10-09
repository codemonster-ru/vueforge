<template>
    <cm-header>
        <template #left>
            <slot name='headerLeft' />
        </template>
        <template #right>
            <slot name='headerRight' />
        </template>
    </cm-header>
    <cm-content>
        <cm-container>
            <router-view />
        </cm-container>
    </cm-content>
    <cm-footer>
        <cm-container>
            <slot name='footerDefault' />
        </cm-container>
    </cm-footer>
</template>

<script setup lang='ts'>
import { CmHeader, CmContent, CmFooter, CmContainer } from '..';
</script>