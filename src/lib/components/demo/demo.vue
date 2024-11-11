<template>
    <div class='cm-demo'>
        <slot />
    </div>
</template>

<style lang='scss'>
.cm-demo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    border-radius: 6px;
    margin-bottom: 12px;
    background-color: var(--cm-bg-soft);
}
</style>