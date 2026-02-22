<template>
    <main class="vf-visual" data-testid="vf-visual-root">
        <Container size="lg">
            <Stack gap="24px">
                <Section bordered background="muted" data-testid="vf-visual-header">
                    <Stack gap="16px">
                        <h1 class="vf-visual__title">VueForge Visual Baseline</h1>
                        <Inline gap="12px">
                            <Button>Primary action</Button>
                            <Button severity="secondary">Secondary action</Button>
                            <Button variant="outlined" severity="success">Outlined action</Button>
                        </Inline>
                        <Inline gap="12px">
                            <Input model-value="hello@vueforge.dev" aria-label="Email" />
                            <Input model-value="Search components..." aria-label="Search" />
                        </Inline>
                    </Stack>
                </Section>

                <Section bordered data-testid="vf-visual-layout">
                    <Grid columns="12" gap="16px">
                        <GridItem span="4">
                            <Card>
                                <template #default>
                                    <Stack gap="8px">
                                        <h2 class="vf-visual__card-title">Summary</h2>
                                        <p class="vf-visual__text">
                                            Stable card snapshot for spacing, borders, and typography.
                                        </p>
                                    </Stack>
                                </template>
                            </Card>
                        </GridItem>
                        <GridItem span="8">
                            <Card>
                                <template #default>
                                    <Stack gap="8px">
                                        <h2 class="vf-visual__card-title">Release checks</h2>
                                        <Inline gap="8px">
                                            <Badge label="Lint" severity="success" />
                                            <Badge label="Typecheck" severity="success" />
                                            <Badge label="Unit tests" severity="success" />
                                        </Inline>
                                    </Stack>
                                </template>
                            </Card>
                        </GridItem>
                    </Grid>
                </Section>

                <Section bordered data-testid="vf-visual-data">
                    <DataTable
                        aria-label="Visual baseline table"
                        :rows="rows"
                        :columns="columns"
                        row-key="id"
                        striped
                        hover
                    />
                </Section>
            </Stack>
        </Container>
    </main>
</template>

<script setup lang="ts">
import type { DataTableColumn } from '@/package/components/data-table.vue';

const rows = [
    { id: 1, name: 'Ada Lovelace', role: 'Maintainer', status: 'Active' },
    { id: 2, name: 'Linus Torvalds', role: 'Reviewer', status: 'Active' },
    { id: 3, name: 'Grace Hopper', role: 'Contributor', status: 'Idle' },
];

const columns: Array<DataTableColumn> = [
    { field: 'name', header: 'Name', width: '240px' },
    { field: 'role', header: 'Role', width: '180px' },
    { field: 'status', header: 'Status', width: '140px' },
];
</script>

<style scoped lang="scss">
.vf-visual {
    padding: 32px 0;
}

.vf-visual__title {
    margin: 0;
    font-size: 28px;
}

.vf-visual__card-title {
    margin: 0;
    font-size: 18px;
}

.vf-visual__text {
    margin: 0;
}
</style>
