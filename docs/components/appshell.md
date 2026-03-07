# AppShell

Compose the top-level application frame with sidebar, header, main, and optional footer regions.

## Import

```ts
import { AppShell } from '@codemonster-ru/vueforge';
```

## Examples

Use `AppShell` as the outer layout for SaaS-style workspaces rather than hand-building shell chrome on each page.

### Basic

Use sidebar, header, and main regions for a standard application frame.

```vue
<template>
    <AppShell :full-height="false">
        <template #sidebar>
            <NavigationRail
                :show-toggle="false"
                style="height: 100%; border-right: none;"
                :items="[
                    { key: 'overview', label: 'Overview', icon: 'house', active: true },
                    { key: 'billing', label: 'Billing', icon: 'creditCard' },
                    { key: 'settings', label: 'Settings', icon: 'gear' }
                ]"
            />
        </template>

        <template #header>
            <strong>Workspace</strong>
        </template>

        <Section>
            <Stack gap="0.75rem">
                <strong>Workspace overview</strong>
                <span>Pending approvals: 3</span>
                <span>Active incidents: 1</span>
            </Stack>
        </Section>
    </AppShell>
</template>
```

### With Footer

Use the footer slot for persistent shell status or utility content.

```vue
<template>
    <AppShell>
        <template #sidebar>Sidebar</template>
        <template #header>Header</template>
        <div>Main</div>
        <template #footer>
            <Inline gap="0.5rem">Status: All systems operational</Inline>
        </template>
    </AppShell>
</template>
```

### Mobile Breakpoint

Adjust `mobileBreakpoint` when the shell should switch earlier or later into overlay-sidebar mode.

```vue
<template>
    <AppShell :mobile-breakpoint="960" />
</template>
```

## Props

- `modelValue?: boolean` (v-model desktop collapsed state, default `false`)
- `sidebarWidth?: string` (default `16rem`)
- `sidebarCollapsedWidth?: string` (default `4.25rem`)
- `mobileBreakpoint?: number` (default `1024`)
- `stickyHeader?: boolean` (default `true`)
- `fullHeight?: boolean` (default `true`)
- `showToggle?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `toggleLabel?: string` (default `Toggle sidebar`)
- `closeSidebarLabel?: string` (default `Close sidebar`)
- `toggleIcon?: string` (default `☰`)
- `mainAriaLabel?: string` (default `Main content`)

## Events

- `update:modelValue`
- `sidebar-toggle`
- `breakpoint-change`

## Slots

- `sidebar` with `{ mobile, collapsed }`
- `header` with `{ mobile, collapsed, mobileSidebarOpen, toggleSidebar }`
- `default`
- `footer` with `{ mobile, collapsed }`

## Theming

- Override via `theme.overrides.components.appShell`.

## Tokens

Component tokens (override via `theme.overrides.components.appShell`):

- `gap`, `backgroundColor`, `textColor`
- `sidebarBackgroundColor`, `sidebarBorderColor`
- `headerHeight`, `headerPadding`, `headerGap`, `headerBackgroundColor`, `headerBorderColor`
- `contentPadding`, `mainBackgroundColor`
- `footerPadding`, `footerBorderColor`, `footerBackgroundColor`
- `toggleSize`, `toggleBorderRadius`, `toggleBackgroundColor`, `toggleTextColor`, `toggleHoverBackgroundColor`
- `overlayBackgroundColor`, `zIndex`

## Recipes

- Keep `AppShell` controlled from app state when collapse state should persist across routes.
- Use the header slot for shell chrome and the main slot for page-level layout components.
- Let the sidebar slot provide its own `nav` semantics rather than hardcoding navigation inside the shell.

## Accessibility

- Uses structural landmarks such as `aside`, `header`, `main`, and `footer`.
- Keep one primary `main` landmark active for the current application view.
- Use semantic navigation inside the sidebar slot, for example `nav` with an explicit label.
