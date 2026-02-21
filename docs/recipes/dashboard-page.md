# Starter Recipe: Dashboard Page

## Goal

Build a dashboard shell with `PageHeader`, `Grid`, `Card`, and `DataTable`.

## Example

```vue
<template>
    <Section as="main" background="surface">
        <Container size="xl">
            <Stack gap="1rem">
                <PageHeader title="Dashboard" subtitle="System health and team activity" />
                <Grid :columns="12" gap="1rem" :breakpoints="{ md: { columns: 12 } }">
                    <GridItem :span="12" :breakpoints="{ md: { span: 4 } }">
                        <Card>
                            <template #header>Active users</template>
                            <template #body>1,248</template>
                        </Card>
                    </GridItem>
                    <GridItem :span="12" :breakpoints="{ md: { span: 4 } }">
                        <Card>
                            <template #header>Errors</template>
                            <template #body>12</template>
                        </Card>
                    </GridItem>
                    <GridItem :span="12" :breakpoints="{ md: { span: 4 } }">
                        <Card>
                            <template #header>Deploys</template>
                            <template #body>4 today</template>
                        </Card>
                    </GridItem>
                    <GridItem :span="12">
                        <Card>
                            <template #header>Recent activity</template>
                            <template #body>
                                <DataTable
                                    :columns="[
                                        { field: 'user', header: 'User', sortable: true },
                                        { field: 'action', header: 'Action' },
                                        { field: 'time', header: 'Time', align: 'right' },
                                    ]"
                                    :rows="[
                                        { id: 1, user: 'Alice', action: 'Created report', time: '09:12' },
                                        { id: 2, user: 'Bob', action: 'Updated role', time: '09:40' },
                                    ]"
                                    row-key="id"
                                    sortable
                                />
                            </template>
                        </Card>
                    </GridItem>
                </Grid>
            </Stack>
        </Container>
    </Section>
</template>
```
