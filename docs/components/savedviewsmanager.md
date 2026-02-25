# SavedViewsManager

## Purpose

Manage reusable list-page view configurations with save/rename/share/default actions.
Helps teams persist common filter states for backoffice and analytics workflows.

## Props

- `modelValue?: string | null` (selected view id)
- `items?: Array<{ id: string; name: string; state?: unknown; shared?: boolean; isDefault?: boolean; updatedAt?: string }>`
- `currentState?: unknown`
- `allowShare?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Saved views manager`)
- `viewsLabel?: string` (default `Saved views`)
- `noViewLabel?: string` (default `No view selected`)
- `defaultBadgeLabel?: string` (default `default`)
- `namePlaceholder?: string` (default `View name`)
- `saveLabel?: string` (default `Save current`)
- `renameLabel?: string` (default `Rename`)
- `setDefaultLabel?: string` (default `Set default`)
- `shareLabel?: string` (default `Share`)
- `unshareLabel?: string` (default `Unshare`)
- `deleteLabel?: string` (default `Delete`)

## Events

- `update:modelValue`
- `update:items`
- `select`
- `save`
- `rename`
- `setDefault`
- `share`
- `delete`
- `change`

## Slots

- This component does not expose named slots.

## Examples

```vue
<SavedViewsManager
    v-model="activeViewId"
    :items="savedViews"
    :current-state="currentFilters"
    @update:items="savedViews = $event"
/>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.savedViewsManager`):

- `gap`, `padding`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `secondaryTextColor`
- `rowGap`, `labelFontSize`
- `controlHeight`, `controlBorderColor`, `controlBorderRadius`, `controlBackgroundColor`
- `focusBorderColor`, `focusRing`
- `dangerTextColor`, `dangerBorderColor`
- `disabledOpacity`

## Accessibility

- Root uses `role="region"` with configurable `ariaLabel`.
- Selection and actions rely on native `select`/`input`/`button` controls.
- Keep view names explicit (avoid duplicates) for clear assistive-tech announcements.
