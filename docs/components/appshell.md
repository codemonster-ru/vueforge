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

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
