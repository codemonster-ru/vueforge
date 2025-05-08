<template>
    <div class="vf-demo">
        <slot />
    </div>
</template>

<style lang="scss">
.vf-demo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    border-radius: 6px;
    margin-bottom: 12px;
    background-color: var(--vf-bg-soft-color);
}
</style>
