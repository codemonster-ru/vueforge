<template>
    <div class="vf-content">
        <slot />
    </div>
</template>

<style lang="scss">
.vf-content {
    display: flex;
    flex: 1;

    .vf-container {
        display: flex;
    }
}
</style>
