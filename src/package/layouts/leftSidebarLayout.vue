<template>
    <div class="vf-left-sidebar-flexbox">
        <div class="vf-left-sidebar">
            <slot name="leftSidebar" />
        </div>
        <div class="vf-main-content">
            <router-view />
        </div>
    </div>
</template>

<style lang="scss">
.vf-left-sidebar-flexbox {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}

.vf-left-sidebar {
    width: 250px;
    margin-right: 48px;
}

.vf-main-content {
    width: calc(100% - (250px + 48px));
}
</style>
