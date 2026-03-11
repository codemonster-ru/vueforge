# Core Cookbook: Copy-Paste Recipes

Practical copy-paste snippets for common app screens built with VueForge core components.

## 1) App Shell + Navigation

```vue
<template>
    <AppShell>
        <template #sidebar>
            <Menu :items="menuItems" />
        </template>
        <template #default>
            <Section as="main">
                <Container size="lg">
                    <PageHeader title="Overview" subtitle="Team workspace" />
                </Container>
            </Section>
        </template>
    </AppShell>
</template>

<script setup lang="ts">
const menuItems = [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'Settings', to: '/settings' },
];
</script>
```

## 2) Filter Bar + Search + Actions

```vue
<template>
    <Inline align="center" justify="space-between" gap="0.75rem" wrap="wrap">
        <Inline gap="0.5rem" wrap="wrap">
            <Input v-model="query" placeholder="Search projects..." />
            <FilterChips v-model="filters" :options="statusOptions" clearable />
        </Inline>
        <Inline gap="0.5rem">
            <Button variant="outlined" severity="secondary"> Export </Button>
            <Button> Create project </Button>
        </Inline>
    </Inline>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const query = ref('');
const filters = ref<Array<string>>([]);
const statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'In progress', value: 'progress' },
    { label: 'Done', value: 'done' },
];
</script>
```

## 3) Server-Ready Data Table Section

```vue
<template>
    <Card>
        <template #header> Users </template>
        <template #body>
            <DataTable
                :rows="rows"
                :columns="columns"
                row-key="id"
                sortable
                server
                :page="page"
                :page-size="pageSize"
                :filters="{ search: query }"
                @request="onRequest"
            />
        </template>
    </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const page = ref(1);
const pageSize = ref(20);
const query = ref('');
const rows = ref([{ id: 1, name: 'Alice', role: 'Admin' }]);
const columns = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'role', header: 'Role' },
];

const onRequest = (payload: unknown) => {
    console.log('fetch server data', payload);
};
</script>
```

## 4) Async Form Pattern

```vue
<template>
    <Form :initial-values="{ email: '' }" :validate="validate" :submit="submit">
        <template #default="{ values, errors, setFieldValue }">
            <Stack gap="0.75rem">
                <FormField label="Email" :error="errors.email">
                    <template #default="{ id }">
                        <Input
                            :id="id"
                            :model-value="String(values.email ?? '')"
                            @update:model-value="v => setFieldValue('email', v)"
                        />
                    </template>
                </FormField>
                <Button type="submit"> Save </Button>
            </Stack>
        </template>
    </Form>
</template>

<script setup lang="ts">
const validate = (values: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    if (!String(values.email ?? '').includes('@')) {
        errors.email = 'Invalid email';
    }
    return errors;
};

const submit = async (values: Record<string, unknown>) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    console.log('submit', values);
};
</script>
```

## 5) Confirm + Modal Workflow

```vue
<template>
    <Button severity="danger" @click="open = true"> Delete project </Button>

    <Modal v-model="open" title="Delete project">
        <Stack gap="1rem">
            <p>Are you sure you want to delete this project?</p>
            <Inline justify="end" gap="0.5rem">
                <Button variant="outlined" severity="secondary" @click="open = false"> Cancel </Button>
                <Button severity="danger" @click="confirmDelete"> Delete </Button>
            </Inline>
        </Stack>
    </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const open = ref(false);
const confirmDelete = () => {
    open.value = false;
};
</script>
```

## 6) Global Overlays

```vue
<template>
    <Inline gap="0.5rem">
        <Button @click="drawerOpen = true"> Open drawer </Button>
        <Button @click="toastOpen = true"> Show toast </Button>
    </Inline>

    <Drawer v-model="drawerOpen">Navigation and secondary actions</Drawer>
    <ToastContainer v-if="toastOpen">
        <Toast severity="success" title="Saved" description="Changes were stored successfully." />
    </ToastContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawerOpen = ref(false);
const toastOpen = ref(true);
</script>
```
