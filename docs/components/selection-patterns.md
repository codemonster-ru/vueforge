# Selection Patterns

Recipes for selection-family components (`Select`, `Autocomplete`, `Combobox`, `MultiSelect`, `TagInput`, `TreeSelect`).

## 1) Simple Options

Use for short static lists.

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

## 2) Large List

Use remote filtering and capped result windows instead of rendering very large arrays at once.

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

## 3) Async Options

Use explicit loading/error states with query-driven fetching.

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

## Theming

- Pattern guide only; use theme overrides of concrete components (`select`, `autocomplete`, `combobox`, etc.).

## Accessibility

- Ensure each selection control has an accessible label and clear empty/loading text.
- Preserve keyboard operability for open, navigate, select, clear, and close flows.

## Notes

- Keep `readonly` and `disabled` semantics consistent across the selection family.
- Prefer server-driven filtering for lists larger than a few hundred options.
- Use `clearable` only when reset behavior is expected in the form flow.
