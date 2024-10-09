<template>
    <cm-left-sidebar-layout>
        <template #leftSidebar>
            <cm-menu :items='data.menuList' />
        </template>
    </cm-left-sidebar-layout>
</template>

<script setup lang='ts'>
import { CmMenu, CmLeftSidebarLayout } from '@/lib';
import { reactive } from 'vue';

const data = reactive({
    menuList: [
        {
            label: 'Getting started',
            to: { name: 'docs-started' },
            items: [
                {
                    label: 'Introduction',
                    to: { name: 'docs-started-introduction' },
                },
                {
                    label: 'Setup',
                    to: { name: 'docs-started-setup' },
                },
            ],
        },
        {
            label: 'Installation',
            to: { name: 'docs-installation' },
            items: [
                {
                    label: 'Vite',
                    to: { name: 'docs-installation-vite' },
                },
                {
                    label: 'CDN',
                    to: { name: 'docs-installation-cdn' },
                },
            ],
        },
        {
            label: 'Configuration',
            to: { name: 'docs-configuration' },
        },
        {
            label: 'Theming',
            to: { name: 'docs-theming' },
            items: [
                {
                    label: 'Styled mode',
                    to: { name: 'docs-theming-styled' },
                },
                {
                    label: 'Unstyled mode',
                    to: { name: 'docs-theming-unstyled' },
                },
            ],
        },
        {
            label: 'Components',
            to: { name: 'docs-components' },
            items: [
                {
                    label: 'body',
                    to: { name: 'docs-components-body' },
                },
            ],
        },
        {
            label: 'Icons',
            to: { name: 'docs-icons' },
            items: [
                {
                    label: 'Codemonster icons',
                    to: { name: 'docs-icons-codemonster' },
                },
                {
                    label: 'Custom icons',
                    to: { name: 'docs-icons-custom' },
                },
            ],
        },
    ],
});
</script>