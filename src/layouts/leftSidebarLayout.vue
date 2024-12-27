<template>
    <div class='cm-left-sidebar-flexbox'>
        <div class='cm-left-sidebar'>
            <slot name='leftSidebar' />
        </div>
        <div class='cm-main-content'>
            <router-view />
        </div>
    </div>
</template>

<style lang='scss'>
.cm-left-sidebar-flexbox {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}

.cm-left-sidebar {
    width: 250px;
    margin-right: 48px;
}

.cm-main-content {
    width: calc(100% - (250px + 48px));
}
</style>