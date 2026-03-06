# SavedViewsManager

SavedViewsManager manages reusable filter and view presets for operational list pages.

## Import

```ts
import SavedViewsManager from '@/package/components/saved-views-manager.vue';
```

## Examples

### Basic

Use `SavedViewsManager` when users need to persist list filters, columns, or search state.

```vue
<SavedViewsManager
    v-model="activeViewId"
    :items="savedViews"
    :current-state="currentFilters"
    @update:items="savedViews = $event"
/>
```

### Shared Views

Enable sharing when teams need common presets like "Escalated tickets" or "My approvals".

```vue
<SavedViewsManager
    v-model="activeViewId"
    :items="savedViews"
    :current-state="currentFilters"
    allow-share
/>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `string \| null` | `null` |
| `items` | `SavedViewItem[]` | `[]` |
| `currentState` | `unknown` | `undefined` |
| `allowShare` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `ariaLabel` | `string` | `'Saved views manager'` |
| `viewsLabel` | `string` | `'Saved views'` |
| `noViewLabel` | `string` | `'No view selected'` |
| `defaultBadgeLabel` | `string` | `'default'` |
| `namePlaceholder` | `string` | `'View name'` |
| `saveLabel` | `string` | `'Save current'` |
| `renameLabel` | `string` | `'Rename'` |
| `setDefaultLabel` | `string` | `'Set default'` |
| `shareLabel` | `string` | `'Share'` |
| `unshareLabel` | `string` | `'Unshare'` |
| `deleteLabel` | `string` | `'Delete'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `string \| null` |
| `update:items` | `SavedViewItem[]` |
| `select` | `SavedViewItem \| null` |
| `save` | `SavedViewItem` |
| `rename` | `SavedViewItem` |
| `setDefault` | `SavedViewItem` |
| `share` | `(view, shared)` |
| `delete` | `SavedViewItem` |
| `change` | `SavedViewItem[]` |

## Theming

Override component tokens through `theme.overrides.components.savedViewsManager`.

## Tokens

- Surface: `gap`, `padding`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `secondaryTextColor`
- Layout: `rowGap`, `labelFontSize`
- Controls: `controlHeight`, `controlBorderColor`, `controlBorderRadius`, `controlBackgroundColor`
- States: `focusBorderColor`, `focusRing`, `dangerTextColor`, `dangerBorderColor`, `disabledOpacity`

## Recipes

- Treat saved views as durable user data, not just ephemeral UI state.
- Keep names explicit and non-duplicative so users can distinguish similar presets quickly.

## Accessibility

- The root uses `role="region"` with a configurable label.
- Selection and editing rely on native select, input, and button controls.
