# Breadcrumbs

## Purpose

- Expose hierarchical navigation context for deep SaaS routes.
- Improve orientation and quick back-navigation inside multi-level workflows.

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

## Theming

- Override via `theme.overrides.components.breadcrumbs`.

## Tokens

Component tokens (override via `theme.overrides.components.breadcrumbs`):

- `gap`, `fontSize`, `textColor`, `hoverColor`, `activeColor`
- `separatorColor`, `disabledOpacity`

## Recipes

- Application hierarchy: `Home / Section / Page` with last item active.
- Product workspace: include entity type level (`Projects / Project A / Settings`).
- Custom separator: provide `#separator` slot for icon-based separators.

## Responsive

- Validate truncation/collapse strategy for long breadcrumb chains on mobile.
- Ensure separators and current-page item remain legible at small widths.

## SSR/Hydration

- Breadcrumb item order and current-page semantics must be deterministic in SSR.
- Client should only enhance interaction, not rewrite structure at hydration.

## Testing

- Cover item rendering, current/disabled states, separators, and custom slot content.
- Add tests for overflow behavior with long paths.

## Accessibility

- Breadcrumbs root uses semantic `nav` with `aria-label` (default `Breadcrumbs`).
- Current item is rendered with `aria-current="page"` and should be a non-link label.
- Use descriptive labels and keep hierarchy short (typically 2-4 levels).
- Preserve separator readability when providing custom separator content.
