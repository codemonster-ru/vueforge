# EmptyState

## Purpose

- Communicate no-data/no-results/no-access scenarios with clear guidance and actions.
- Standardize empty experiences across tables, dashboards, and detail views.

## Props

- `title?: string`
- `description?: string`
- `icon?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- This component does not emit component-specific events.

## Slots

- `default` - description content (fallbacks to `description`)
- `title` (optional)
- `icon` (optional)
- `actions` (optional)

## Examples

```vue
<EmptyState title="No projects yet" description="Create your first project to get started." icon="??">
    <template #actions>
        <Button label="Create project" size="small" />
        <Button label="Import" size="small" severity="secondary" />
    </template>
</EmptyState>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.emptyState`):

- `gap`, `bodyGap`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`, `maxWidth`
- `iconSize`, `iconColor`
- `titleFontSize`, `titleLineHeight`, `titleFontWeight`, `titleColor`
- `descriptionFontSize`, `descriptionLineHeight`, `descriptionColor`
- `actionsGap`
- `small.padding`, `small.iconSize`, `small.titleFontSize`, `small.descriptionFontSize`
- `large.padding`, `large.iconSize`, `large.titleFontSize`, `large.descriptionFontSize`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

- Verify illustration/text/action layout remains readable on small screens.
- Ensure call-to-action buttons wrap without breaking hierarchy.

## SSR/Hydration

- Empty state content should be deterministic from server data state.
- Avoid hydration mismatch between loading and empty branches.

## Testing

- Cover content variants (empty/filter/error-like messaging) and action slots.
- Add tests for localization length expansion and responsive wrapping.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
