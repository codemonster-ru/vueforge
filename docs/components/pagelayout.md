# PageLayout

## Purpose

- Provide a layout preset for `sidebar/content/aside` page composition.
- Handle responsive collapse behavior for side regions on mobile viewports.

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

## Example

```vue
<PageLayout v-model:sidebar-collapsed="sidebarCollapsed" v-model:aside-collapsed="asideCollapsed">
    <template #sidebar>Navigation</template>
    <template #default>Main content</template>
    <template #aside>Context panel</template>
</PageLayout>
```

## Tokens

Component tokens (override via `theme.overrides.components.pageLayout`):

- `minHeight`, `gap`, `backgroundColor`, `textColor`
- `headerPadding`, `headerBorderColor`, `controlsGap`
- `contentPadding`, `contentBackgroundColor`
- `panelBackgroundColor`, `panelBorderColor`
- `footerPadding`, `footerBorderColor`
- `toggleSize`, `toggleBorderRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`
- `overlayBackgroundColor`, `zIndex`

## Responsive

- On mobile (`window < mobileBreakpoint`), sidebar/aside become off-canvas panels.
- `showMobileToggles` controls built-in toggles for panel open/close on mobile.

## SSR/Hydration

- Keep initial `sidebarCollapsed`/`asideCollapsed` deterministic from app state for stable SSR output.
- Mobile mode is viewport-driven; avoid SSR assumptions that depend on client width.

## Testing

- Covers region rendering, collapsed state classes, mobile drawer toggles/overlays, and desktop collapse emit behavior.

## Accessibility

- Uses semantic landmarks (`main`, `aside`) and configurable ARIA labels for side regions.
- Supports Escape close behavior for open mobile side panels.
