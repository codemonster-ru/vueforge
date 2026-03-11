# PageHeader

Standardize page titles, subtitles, metadata, and actions at the top of application views.

## Import

```ts
import { PageHeader } from '@codemonster-ru/vueforge-layouts';
```

## Examples

Use `PageHeader` as the canonical page intro block before building one-off header layouts.

### Basic

Use title and subtitle props for straightforward pages with no extra regions.

```vue
<template>
    <PageHeader title="Projects" subtitle="Manage active projects and team workload." />
</template>
```

### With Actions

Use the `actions` slot for primary and secondary page-level actions.

```vue
<template>
    <PageHeader title="Projects" subtitle="Manage active projects and team workload.">
        <template #actions>
            <Button label="Import" variant="outlined" severity="secondary" />
            <Button label="New project" icon="plus" />
        </template>
    </PageHeader>
</template>
```

### With Breadcrumbs And Meta

Use `breadcrumbs` and `meta` when the page needs route context and lightweight status metadata.

```vue
<template>
    <PageHeader title="Projects" subtitle="Overview and team activity.">
        <template #breadcrumbs>
            <Breadcrumbs
                :items="[
                    { label: 'Home', to: '/' },
                    { label: 'Projects', active: true },
                ]"
            />
        </template>
        <template #meta>
            <Badge severity="info">24 active</Badge>
            <Chip label="Last sync: 2m ago" />
        </template>
    </PageHeader>
</template>
```

### Custom Title Slot

Use the `title` slot when the page must render a different heading level or custom title markup.

```vue
<template>
    <PageHeader subtitle="Resource-specific context">
        <template #title>
            <h2 style="margin: 0;">Workspace settings</h2>
        </template>
    </PageHeader>
</template>
```

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

- Use `PageHeader` once per page view and keep all top-of-page chrome inside it.
- Prefer props for simple pages and slots only when the content truly needs structural customization.
- Keep `actions` limited to page-level operations; row-level or card-level actions belong closer to their content.

## Accessibility

- `PageHeader` renders title in `h1` by default. Use one `h1` per page view.
- For nested contexts, prefer `#title` slot and render lower heading levels (`h2`/`h3`) manually.
- `meta` and `actions` containers are exposed as grouped regions with configurable aria labels.
- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
