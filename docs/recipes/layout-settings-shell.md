# Layout Recipe: Settings Shell

Use a compact shell with section navigation and form content.

```vue
<template>
    <AppBar title="Workspace Settings" dense />
    <SplitLayout preset="master-detail" v-model:secondary-collapsed="navCollapsed">
        <template #default>
            <Form>
                <FormField label="Workspace name">
                    <Input model-value="Acme Cloud" />
                </FormField>
            </Form>
        </template>
        <template #secondary>
            <NavigationRail :items="settingsSections" :collapsed="navCollapsed" />
        </template>
    </SplitLayout>
</template>
```
