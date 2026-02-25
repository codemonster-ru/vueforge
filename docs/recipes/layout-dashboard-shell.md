# Layout Recipe: Dashboard Shell

Use `AppBar`, `PageLayout`, and `ResizableSidebar` for an operations dashboard shell.

```vue
<template>
    <AppBar title="Operations Dashboard" />
    <PageLayout v-model:sidebar-collapsed="sidebarCollapsed" :show-desktop-toggles="true">
        <template #sidebar>
            <ResizableSidebar v-model="sidebarWidth" v-model:collapsed="sidebarCollapsed">
                <NavigationRail :items="navItems" :collapsed="sidebarCollapsed" />
            </ResizableSidebar>
        </template>
        <template #default>
            <StickyRegion as="header" bordered>Filters / Actions</StickyRegion>
            <div>Dashboard widgets and KPI cards</div>
        </template>
        <template #aside>
            <Card>Alerts and recent activity</Card>
        </template>
    </PageLayout>
</template>
```
