<template>
    <LeftSidebarLayout>
        <template #leftSidebar>
            <Menu :items='data.menuList' />
        </template>
    </LeftSidebarLayout>
</template>

<script setup lang='ts'>
import { Menu, LeftSidebarLayout } from '@/lib';
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
                    label: 'Quick start',
                    to: { name: 'docs-started-quick-start' },
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
                    label: 'Not styled mode',
                    to: { name: 'docs-theming-not-styled' },
                },
            ],
        },
        {
            label: 'Components',
            to: { name: 'docs-components' },
            items: [
                {
                    label: 'Button',
                    to: { name: 'docs-components-button' },
                },
            ],
        },
        {
            label: 'Icons',
            to: { name: 'docs-icons' },
            items: [
                {
                    label: 'System icons',
                    to: { name: 'docs-icons-system' },
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