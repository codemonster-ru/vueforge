# SplitLayout

## Purpose

- Provide ready-to-use split page presets:
    - `master-detail`
    - `inspector`
    - `editor-preview`

## Props

- `preset?: 'master-detail' | 'inspector' | 'editor-preview'` (default `master-detail`)
- `secondaryCollapsed?: boolean` (default `false`)
- `tertiaryCollapsed?: boolean` (default `false`)
- `secondaryWidth?: string` (default `22rem`)
- `tertiaryWidth?: string` (default `18rem`)
- `mobileBreakpoint?: number` (default `1024`)
- `showMobileToggles?: boolean` (default `true`)
- `showDesktopToggles?: boolean` (default `false`)
- `closeOnEsc?: boolean` (default `true`)
- `primaryAriaLabel?: string` (default `Primary pane`)
- `secondaryAriaLabel?: string` (default `Secondary pane`)
- `tertiaryAriaLabel?: string` (default `Tertiary pane`)

## Events

- `update:secondaryCollapsed`
- `update:tertiaryCollapsed`
- `breakpoint-change`

## Slots

- `default` - primary pane
- `secondary` (optional)
- `tertiary` (optional)

## Example

```vue
<SplitLayout preset="editor-preview" v-model:secondary-collapsed="previewCollapsed">
    <CodeEditor />
    <template #secondary>
        <DiffViewer />
    </template>
</SplitLayout>
```

## Tokens

Component tokens (override via `theme.overrides.components.splitLayout`):

- `minHeight`, `gap`
- `padding`, `panelPadding`, `controlsGap`
- `backgroundColor`, `textColor`
- `primaryBackgroundColor`, `panelBackgroundColor`, `panelBorderColor`
- `toggleSize`, `toggleBorderRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`
- `overlayBackgroundColor`, `zIndex`

## Responsive

- Secondary/tertiary panes become right-side off-canvas panels below `mobileBreakpoint`.

## SSR/Hydration

- Keep initial collapsed state deterministic (`secondaryCollapsed`/`tertiaryCollapsed`) for stable SSR output.

## Testing

- Covers preset class rendering, desktop collapse emits, and mobile open/close behavior.

## Accessibility

- Uses semantic `main` + `aside` landmarks and configurable ARIA labels per pane.
