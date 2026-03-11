# Layout Recipe: Mobile Adaptive Shell

Combine `Show`/`Hide` with layout presets to deliver mobile-first shell behavior.

```vue
<template>
    <Show to="md">
        <Drawer v-model="mobileNavOpen" placement="left">
            <NavigationRail :items="navItems" :show-toggle="false" />
        </Drawer>
    </Show>

    <Show from="md">
        <PageLayout>
            <template #sidebar>
                <NavigationRail :items="navItems" />
            </template>
            <template #default>
                <StickyRegion as="header"> Page actions </StickyRegion>
                <router-view />
            </template>
        </PageLayout>
    </Show>

    <Hide from="md">
        <AppBar title="Workspace">
            <template #actions>
                <Button label="Menu" @click="mobileNavOpen = true" />
            </template>
        </AppBar>
    </Hide>
</template>
```
