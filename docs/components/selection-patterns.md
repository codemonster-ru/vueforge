# Selection Patterns

This page collects common implementation patterns for the selection family: `Select`, `Autocomplete`, `Combobox`, `MultiSelect`, `TagInput`, and `TreeSelect`.

## Scope

Use these recipes when choosing between static options, remote search, large datasets, and async loading states.

## Examples

### Simple Options

Use static options for short, stable lists.

```vue
<Select
    model-value="editor"
    :options="[
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' }
    ]"
    placeholder="Choose role"
/>
```

### Large Lists

For very large datasets, prefer remote filtering and capped result windows instead of rendering everything at once.

```vue
<Autocomplete
    :options="[
        { label: 'Argentina', value: 'ar' },
        { label: 'Australia', value: 'au' },
        { label: 'Austria', value: 'at' },
        { label: 'Belgium', value: 'be' },
        { label: 'Brazil', value: 'br' },
        { label: 'Canada', value: 'ca' },
        { label: 'Chile', value: 'cl' },
        { label: 'Denmark', value: 'dk' }
    ]"
    :virtual="true"
    :virtual-threshold="100"
    :virtual-item-height="36"
    placeholder="Search country"
/>
```

### Async Options

Use explicit loading and error states for query-driven remote selection.

```vue
<div style="display: grid; gap: 0.75rem;">
    <Combobox
        :options="[
            { label: 'Alex Morgan', value: 1 },
            { label: 'Priya Singh', value: 2 },
            { label: 'Jordan Lee', value: 3 }
        ]"
        loading-text="Loading users..."
        empty-text="No users found"
        placeholder="Find user"
    />
    <InlineMessage severity="info">Async search usually wires `@search` to remote loading logic.</InlineMessage>
</div>
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
