<template>
    <div class="vf-container">
        <slot />
    </div>
</template>

<style lang="scss">
.vf-container {
    width: 100%;
    display: flex;
    margin-right: auto;
    margin-left: auto;
    padding-right: var(--vf-container-padding);
    padding-left: var(--vf-container-padding);
}

@media (min-width: 640px) {
    .vf-container {
        max-width: calc(640px - var(--vf-container-padding) * 2);
    }
}

@media (min-width: 768px) {
    .vf-container {
        max-width: calc(768px - var(--vf-container-padding) * 2);
    }
}

@media (min-width: 1024px) {
    .vf-container {
        max-width: calc(1024px - var(--vf-container-padding) * 2);
    }
}

@media (min-width: 1280px) {
    .vf-container {
        max-width: calc(1280px - var(--vf-container-padding) * 2);
    }
}

@media (min-width: 1536px) {
    .vf-container {
        max-width: calc(1536px - var(--vf-container-padding) * 2);
    }
}
</style>
