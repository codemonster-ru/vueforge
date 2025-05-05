<template>
    <div class='cm-content'>
        <slot />
    </div>
</template>

<style lang='scss'>
.cm-content {
    display: flex;
    flex: 1;

    .cm-container {
        display: flex;
    }
}
</style>