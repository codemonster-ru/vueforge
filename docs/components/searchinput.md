# SearchInput

Capture search queries with built-in debounce, loading, and clear interactions.

## Import

```ts
import { SearchInput } from '@codemonster-ru/vueforge';
```

## Examples

Use `SearchInput` when typing should produce search intent directly and the field needs its own query-specific affordances.

### Basic

Use a basic search input for toolbar filtering and page-level search.

```vue
<template>
    <SearchInput v-model="query" placeholder="Search projects" clearable />
</template>
```

### Debounced Search

Increase `debounce` for heavier remote queries to avoid unnecessary backend traffic.

```vue
<template>
    <SearchInput v-model="customerQuery" placeholder="Search customers" :debounce="500" />
</template>
```

### Loading

Use the loading state while results are still being fetched after the current query.

```vue
<template>
    <SearchInput v-model="repositoryQuery" placeholder="Search repositories" loading variant="outlined" />
</template>
```

### Sizes

Scale the field to fit compact headers or larger page hero search bars.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <SearchInput v-model="smallQuery" size="small" placeholder="Small search" />
        <SearchInput v-model="normalQuery" placeholder="Default search" />
        <SearchInput v-model="largeQuery" size="large" placeholder="Large search" />
    </div>
</template>
```

### Disabled And Readonly

Use `disabled` when search is unavailable and `readonly` when the current query should remain visible but not editable.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <SearchInput v-model="disabledQuery" disabled placeholder="Disabled search" />
        <SearchInput v-model="readonlyQuery" readonly clearable />
    </div>
</template>
```

## Props

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `autocomplete?: string` (default `off`)
- `inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'` (default `search`)
- `debounce?: number` (default `300`)
- `loading?: boolean` (default `false`)
- `clearable?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Search input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)

## Events

- `update:modelValue`
- `input`
- `change`
- `search`
- `clear`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.searchInput`.

## Tokens

Component tokens (override via `theme.overrides.components.searchInput`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `iconSize`, `iconColor`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `loadingSize`, `loadingBorderColor`, `loadingTopBorderColor`
- `small.fontSize`, `small.padding`, `small.iconSize`, `small.clearSize`
- `large.fontSize`, `large.padding`, `large.iconSize`, `large.clearSize`

## Recipes

- Use `SearchInput` instead of generic `Input` when you need debounced `search` events and a dedicated clear action.
- Keep `debounce` low for local filtering and higher for remote queries.
- Show `loading` only for the active request; stale loading indicators make search feel broken.

## Accessibility

- Provide an accessible name (`label` + `id`, or `ariaLabel` / `ariaLabelledby`).
- For help/error text, wire `ariaDescribedby`.
- For invalid and required states, use `ariaInvalid` / `required` (or `ariaRequired` override).
- `Enter` triggers immediate `search`, while normal typing uses debounce.
- Clear action is a keyboard-accessible button with `aria-label`.
- Keyboard focus uses the component focus ring (`:focus-within`) for visible state.
