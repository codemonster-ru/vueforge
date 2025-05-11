<template>
    <header class="vf-header">
        <slot />
    </header>
</template>

<style lang="scss">
.vf-header {
    height: var(--vf-header-height);
    min-height: var(--vf-header-min-height);
    display: flex;
    padding-top: var(--vf-header-padding);
    border-bottom: 1px solid var(--vf-header-border-color);
    margin-bottom: 24px;
    padding-bottom: var(--vf-header-padding);
    background-color: var(--vf-header-background-color);
}
</style>
