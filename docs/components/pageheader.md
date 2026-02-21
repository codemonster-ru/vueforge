# PageHeader

## Props

- `title?: string`
- `subtitle?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `divider?: boolean` (default `false`)
- `mobileBreakpoint?: number` (default `720`)
- `actionsAriaLabel?: string` (default `Page actions`)
- `metaAriaLabel?: string` (default `Page metadata`)

## Events

- This component does not emit component-specific events.

## Slots

- `breadcrumbs` (optional)
- `title` (optional) - replaces `title` prop rendering
- `subtitle` (optional) - replaces `subtitle` prop rendering
- `meta` (optional)
- `actions` (optional)
- `default` (optional) - additional body content

## Examples

```vue
<PageHeader title="Projects" subtitle="Manage active projects and team workload.">
    <template #breadcrumbs>
        <Breadcrumbs :items="breadcrumbItems" />
    </template>
    <template #meta>
        <Badge severity="info" variant="soft">24 active</Badge>
        <Chip label="Last sync: 2m ago" />
    </template>
    <template #actions>
        <Button label="Import" variant="outlined" severity="secondary" />
        <Button label="New project" icon="plus" />
    </template>
</PageHeader>
```

## Theming

- Override via `theme.overrides.components.pageHeader`.

## Tokens

Component tokens (override via `theme.overrides.components.pageHeader`):

- `gap`, `contentGap`, `breadcrumbGap`, `actionsGap`, `metaGap`
- `padding`, `borderRadius`, `borderColor`, `backgroundColor`, `textColor`, `dividerColor`
- `titleFontSize`, `titleLineHeight`, `titleFontWeight`
- `subtitleFontSize`, `subtitleColor`
- `small.padding`, `small.titleFontSize`, `small.subtitleFontSize`
- `large.padding`, `large.titleFontSize`, `large.subtitleFontSize`

## Recipes

- Resource list header: breadcrumbs + title/subtitle + right-aligned primary actions.
- Compact mobile header: `size="small"` and minimal action group.
- Detail page header: title slot with custom heading level and meta badges.

## Accessibility

- `PageHeader` renders title in `h1` by default. Use one `h1` per page view.
- For nested contexts, prefer `#title` slot and render lower heading levels (`h2`/`h3`) manually.
- `meta` and `actions` containers are exposed as grouped regions with configurable aria labels.
- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
