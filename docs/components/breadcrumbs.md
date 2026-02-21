# Breadcrumbs

## Props

- `items?: Array<{ label?: string; to?: string; href?: string; url?: string; active?: boolean; disabled?: boolean }>`
- `separator?: string` (default `/`)
- `ariaLabel?: string` (default `Breadcrumbs`)

## Events

- This component does not emit component-specific events.

## Slots

- `item` - slot props: `{ item, index, isLast, active }`
- `separator` (optional) - slot props: `{ separator }`

## Examples

```vue
<Breadcrumbs
    :items="[
        { label: 'Home', to: '/' },
        { label: 'Settings', to: '/settings' },
        { label: 'Profile', active: true },
    ]"
/>
```

## Tokens

Component tokens (override via `theme.overrides.components.breadcrumbs`):

- `gap`, `fontSize`, `textColor`, `hoverColor`, `activeColor`
- `separatorColor`, `disabledOpacity`

## Accessibility

- Breadcrumbs root uses semantic `nav` with `aria-label` (default `Breadcrumbs`).
- Current item is rendered with `aria-current="page"` and should be a non-link label.
- Use descriptive labels and keep hierarchy short (typically 2-4 levels).
- Preserve separator readability when providing custom separator content.
