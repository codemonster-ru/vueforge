# AppShell

## Props

- `modelValue?: boolean` (v-model collapsed state on desktop)
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

- `sidebar` (optional) - slot props `{ mobile, collapsed }`
- `header` (optional) - slot props `{ mobile, collapsed, mobileSidebarOpen, toggleSidebar }`
- `default` - main content
- `footer` (optional) - slot props `{ mobile, collapsed }`

## Examples

```vue
<AppShell v-model="collapsed">
    <template #sidebar>Sidebar</template>
    <template #header>Header</template>
    <div>Main</div>
    <template #footer>Footer</template>
</AppShell>
```

## Recipe: App-level layout composition

```vue
<template>
    <AppShell v-model="collapsed" :mobile-breakpoint="960">
        <template #sidebar="{ collapsed }">
            <nav aria-label="Primary navigation">
                <Menu :items="menuItems" :collapsed="collapsed" />
            </nav>
        </template>

        <template #header="{ toggleSidebar }">
            <Container size="xl">
                <Inline align="center" justify="space-between" wrap="nowrap">
                    <h1>Workspace</h1>
                    <Button label="Toggle sidebar" @click="toggleSidebar" />
                </Inline>
            </Container>
        </template>

        <Container size="xl">
            <Section>
                <router-view />
            </Section>
        </Container>

        <template #footer>
            <Container size="xl">Status: All systems operational</Container>
        </template>
    </AppShell>
</template>
```

## Tokens

Component tokens (override via `theme.overrides.components.appShell`):

- `gap`, `backgroundColor`, `textColor`
- `sidebarBackgroundColor`, `sidebarBorderColor`
- `headerHeight`, `headerPadding`, `headerGap`, `headerBackgroundColor`, `headerBorderColor`
- `contentPadding`, `mainBackgroundColor`
- `footerPadding`, `footerBorderColor`, `footerBackgroundColor`
- `toggleSize`, `toggleBorderRadius`, `toggleBackgroundColor`, `toggleTextColor`, `toggleHoverBackgroundColor`
- `overlayBackgroundColor`, `zIndex`

## Accessibility

- AppShell uses landmark elements (`aside`, `header`, `main`, `footer`) to provide structural navigation.
- Keep a single primary page `main` landmark active in the application view.
- Use semantic navigation inside the sidebar slot (for example `nav` with `aria-label`).
- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
