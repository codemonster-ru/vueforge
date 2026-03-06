# PageLayout

Compose page shells with optional sidebar and aside regions that collapse responsively.

## Import

```ts
import { PageLayout } from '@codemonster-ru/vueforge';
```

## Examples

Use `PageLayout` when the page has a stable main region plus one or two supporting rails.

### Basic

Use the default three-region layout for admin workspaces and detail screens with contextual panels.

```vue
<template>
    <PageLayout>
        <template #sidebar>
            <Card>Navigation</Card>
        </template>
        <Card>Main content</Card>
        <template #aside>
            <Card>Context panel</Card>
        </template>
    </PageLayout>
</template>
```

### Header And Footer Slots

Use the layout slots when the shell needs controls or summary regions outside the main body.

```vue
<template>
    <PageLayout>
        <template #header>
            <PageHeader title="Projects" subtitle="Overview and team activity." />
        </template>
        <template #sidebar>
            <Card>Filters</Card>
        </template>
        <Card>Dashboard content</Card>
        <template #footer>
            <Inline justify="space-between">
                <span>Last updated 2m ago</span>
                <Button label="Refresh" size="small" />
            </Inline>
        </template>
    </PageLayout>
</template>
```

### Collapsed Rails

Use controlled collapse state when desktop rail visibility should stay in sync with route or app preferences.

```vue
<template>
    <PageLayout :sidebar-collapsed="true" :aside-collapsed="true">
        <template #sidebar>
            <Card>Collapsed sidebar region</Card>
        </template>
        <Card>Main workspace</Card>
        <template #aside>
            <Card>Collapsed aside region</Card>
        </template>
    </PageLayout>
</template>
```

### Custom Rail Widths

Adjust widths when the product shell has a fixed navigation contract.

```vue
<template>
    <PageLayout sidebar-width="18rem" aside-width="22rem">
        <template #sidebar>
            <Card>Wide navigation</Card>
        </template>
        <Card>Main content area</Card>
        <template #aside>
            <Card>Wide detail panel</Card>
        </template>
    </PageLayout>
</template>
```

## Props

- `sidebarCollapsed?: boolean` (default `false`)
- `asideCollapsed?: boolean` (default `false`)
- `sidebarWidth?: string` (default `16rem`)
- `asideWidth?: string` (default `18rem`)
- `mobileBreakpoint?: number` (default `1024`)
- `showMobileToggles?: boolean` (default `true`)
- `showDesktopToggles?: boolean` (default `false`)
- `closeOnEsc?: boolean` (default `true`)
- `sidebarToggleLabel?: string` (default `Toggle sidebar`)
- `asideToggleLabel?: string` (default `Toggle details panel`)
- `closeSidebarLabel?: string` (default `Close sidebar`)
- `closeAsideLabel?: string` (default `Close details panel`)
- `sidebarToggleIcon?: string` (default `☰`)
- `asideToggleIcon?: string` (default `▤`)
- `mainAriaLabel?: string` (default `Page content`)
- `sidebarAriaLabel?: string` (default `Page sidebar`)
- `asideAriaLabel?: string` (default `Page aside`)

## Events

- `update:sidebarCollapsed`
- `update:asideCollapsed`
- `breakpoint-change`

## Slots

- `header` (optional) - slot props `{ mobile, sidebarOpen, asideOpen, toggleSidebar, toggleAside }`
- `sidebar` (optional) - slot props `{ mobile, open }`
- `default` - main content
- `aside` (optional) - slot props `{ mobile, open }`
- `footer` (optional) - slot props `{ mobile, sidebarOpen, asideOpen, toggleSidebar, toggleAside }`

## Theming

- Override via `theme.overrides.components.pageLayout`.

## Tokens

Component tokens (override via `theme.overrides.components.pageLayout`):

- `minHeight`, `gap`, `backgroundColor`, `textColor`
- `headerPadding`, `headerBorderColor`, `controlsGap`
- `contentPadding`, `contentBackgroundColor`
- `panelBackgroundColor`, `panelBorderColor`
- `footerPadding`, `footerBorderColor`
- `toggleSize`, `toggleBorderRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`
- `overlayBackgroundColor`, `zIndex`

## Recipes

- Use `PageLayout` when the presence of sidebar/aside is structural, not incidental.
- Keep rail width decisions in `sidebarWidth`/`asideWidth` rather than page-specific CSS.
- Let the layout own mobile drawer behavior instead of rebuilding overlay logic at each page level.

## Accessibility

- Uses semantic landmarks (`main`, `aside`) and configurable ARIA labels for side regions.
- Supports Escape close behavior for open mobile side panels.
