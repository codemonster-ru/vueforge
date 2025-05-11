<template>
    <footer class="vf-footer">
        <slot />
    </footer>
</template>

<style lang="scss">
.vf-footer {
    flex: 0 0 auto;
    color: var(--vf-footer-color);
    margin-top: 24px;
    padding-top: var(--vf-footer-padding);
    padding-bottom: var(--vf-footer-padding);
    background-color: var(--vf-footer-background-color);
    border-top: 1px solid var(--vf-footer-border-color);
}
</style>
