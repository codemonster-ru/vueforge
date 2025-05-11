<template>
    <header class="vf-header">
        <slot />
    </header>
</template>

<style>
.vf-header {
    height: var(--vf-header-height);
    display: flex;
    padding-top: var(--vf-header-padding);
    border-bottom: var(--vf-header-border-bottom);
    margin-bottom: var(--vf-header-margin-bottom);
    padding-bottom: var(--vf-header-padding);
    background-color: var(--vf-header-background-color);
}
</style>
