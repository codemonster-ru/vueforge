# PageHeader

## Props

- `title?: string`
- `subtitle?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `divider?: boolean` (default `false`)

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

## Tokens

Component tokens (override via `theme.overrides.components.pageHeader`):

- `gap`, `contentGap`, `breadcrumbGap`, `actionsGap`, `metaGap`
- `padding`, `borderRadius`, `borderColor`, `backgroundColor`, `textColor`, `dividerColor`
- `titleFontSize`, `titleLineHeight`, `titleFontWeight`
- `subtitleFontSize`, `subtitleColor`
- `small.padding`, `small.titleFontSize`, `small.subtitleFontSize`
- `large.padding`, `large.titleFontSize`, `large.subtitleFontSize`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
