# Layout Recipe: Analytics Shell

Compose analytics pages with pinned controls and split visualization/detail panes.

```vue
<template>
    <PageLayout :show-desktop-toggles="true">
        <template #default>
            <StickyRegion as="header" offset="0px" shadow>
                <Inline gap="0.75rem">
                    <Button label="Refresh" />
                    <Button label="Export" variant="outline" />
                </Inline>
            </StickyRegion>
            <SplitLayout preset="editor-preview">
                <template #default>
                    <Card>Primary analytics panel</Card>
                </template>
                <template #secondary>
                    <DataTable :columns="columns" :rows="rows" />
                </template>
            </SplitLayout>
        </template>
        <template #aside>
            <Card> Saved views and query notes </Card>
        </template>
    </PageLayout>
</template>
```
