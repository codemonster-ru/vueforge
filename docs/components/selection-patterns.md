# Selection Patterns

This page collects common implementation patterns for the selection family: `Select`, `Autocomplete`, `Combobox`, `MultiSelect`, `TagInput`, and `TreeSelect`.

## Scope

Use these recipes when choosing between static options, remote search, large datasets, and async loading states.

## Examples

### Simple Options

Use static options for short, stable lists.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const role = ref<string | undefined>();
const roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
];
</script>

<template>
    <Select v-model="role" :options="roles" placeholder="Choose role" />
</template>
```

### Large Lists

For very large datasets, prefer remote filtering and capped result windows instead of rendering everything at once.

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';

const query = ref('');
const loading = ref(false);
const options = ref<Array<{ label: string; value: string }>>([]);
const page = ref(1);
const hasMore = ref(true);

const fetchPage = async (value: string, nextPage: number) => {
    loading.value = true;

    try {
        const response = await fetch(`/api/countries?q=${encodeURIComponent(value)}&page=${nextPage}&limit=100`);
        const payload = await response.json();
        options.value = nextPage === 1 ? payload.items : [...options.value, ...payload.items];
        hasMore.value = payload.hasMore;
        page.value = nextPage;
    } finally {
        loading.value = false;
    }
};

watch(query, async value => {
    await fetchPage(value, 1);
});

const onLoadMore = async () => {
    if (!hasMore.value || loading.value) {
        return;
    }

    await fetchPage(query.value, page.value + 1);
};
</script>

<template>
    <Autocomplete
        :options="options"
        :loading="loading"
        :virtual="true"
        :virtual-threshold="100"
        :virtual-item-height="36"
        placeholder="Search country"
        @search="query = $event"
        @load-more="onLoadMore"
    />
</template>
```

### Async Options

Use explicit loading and error states for query-driven remote selection.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const value = ref<string | number | undefined>();
const options = ref<Array<{ label: string; value: string | number }>>([]);
const loading = ref(false);
const error = ref('');

const onSearch = async (term: string) => {
    loading.value = true;
    error.value = '';

    try {
        const response = await fetch(`/api/users?search=${encodeURIComponent(term)}`);
        options.value = await response.json();
    } catch {
        options.value = [];
        error.value = 'Failed to load options';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <Combobox
        v-model="value"
        :options="options"
        :loading="loading"
        loading-text="Loading users..."
        empty-text="No users found"
        placeholder="Find user"
        @search="onSearch"
    />
    <p v-if="error">{{ error }}</p>
</template>
```

## Guidance

- Use static options for small stable lists, remote search for medium or large dynamic datasets, and virtualization only when rendering cost becomes real.
- Prefer server-driven filtering once option counts move beyond a few hundred rows.
- Use `clearable` only when reset behavior is expected and safe in the surrounding form flow.

## Theming

This is a pattern page. Apply theme overrides on the concrete components such as `select`, `autocomplete`, `combobox`, `multiselect`, or `treeselect`.

## Accessibility

- Every selection control still needs an explicit label and clear empty and loading text.
- Preserve keyboard support for open, navigate, select, clear, and close flows across all recipes.
