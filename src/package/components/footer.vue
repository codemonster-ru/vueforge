<template>
    <footer class="vf-footer">
        <slot />
    </footer>
</template>

<style>
.vf-footer {
    flex: 0 0 auto;
    color: var(--vf-footer-color);
    margin-top: var(--vf-footer-margin-top);
    border-top: var(--vf-footer-border-top);
    padding-top: var(--vf-footer-padding);
    padding-bottom: var(--vf-footer-padding);
    background-color: var(--vf-footer-background-color);
}
</style>
