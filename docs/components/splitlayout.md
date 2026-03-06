# SplitLayout

SplitLayout provides ready-made multi-pane workspace layouts such as master-detail, inspector, and editor-preview.

## Import

```ts
import SplitLayout from '@/package/components/split-layout.vue';
```

## Examples

### Master Detail

Use the default preset for list-and-details style workspaces.

```vue
<SplitLayout>
    <DataTable />
    <template #secondary>
        <Card>Details</Card>
    </template>
</SplitLayout>
```

### Editor Preview

Use `editor-preview` when the secondary pane acts as a live result or comparison surface.

```vue
<SplitLayout preset="editor-preview" v-model:secondary-collapsed="previewCollapsed">
    <CodeEditor />
    <template #secondary>
        <DiffViewer />
    </template>
</SplitLayout>
```

### Inspector

Use `inspector` when the tertiary pane is the main secondary surface.

```vue
<SplitLayout preset="inspector" v-model:tertiary-collapsed="inspectorCollapsed">
    <CanvasArea />
    <template #tertiary>
        <FormField />
    </template>
</SplitLayout>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `preset` | `'master-detail' \| 'inspector' \| 'editor-preview'` | `'master-detail'` |
| `secondaryCollapsed` | `boolean` | `false` |
| `tertiaryCollapsed` | `boolean` | `false` |
| `secondaryWidth` | `string` | `'22rem'` |
| `tertiaryWidth` | `string` | `'18rem'` |
| `mobileBreakpoint` | `number` | `1024` |
| `showMobileToggles` | `boolean` | `true` |
| `showDesktopToggles` | `boolean` | `false` |
| `closeOnEsc` | `boolean` | `true` |
| `primaryAriaLabel` | `string` | `'Primary pane'` |
| `secondaryAriaLabel` | `string` | `'Secondary pane'` |
| `tertiaryAriaLabel` | `string` | `'Tertiary pane'` |
| `secondaryToggleLabel` | `string` | `'Toggle secondary pane'` |
| `tertiaryToggleLabel` | `string` | `'Toggle tertiary pane'` |
| `closeSecondaryLabel` | `string` | `'Close secondary pane'` |
| `closeTertiaryLabel` | `string` | `'Close tertiary pane'` |
| `secondaryToggleIcon` | `string` | unicode icon |
| `tertiaryToggleIcon` | `string` | unicode icon |

### Events

| Name | Payload |
| --- | --- |
| `update:secondaryCollapsed` | `boolean` |
| `update:tertiaryCollapsed` | `boolean` |
| `breakpoint-change` | `boolean` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Primary pane content. |
| `secondary` | Secondary pane content with `{ mobile, open }`. |
| `tertiary` | Tertiary pane content with `{ mobile, open }`. |

## Theming

Override component tokens through `theme.overrides.components.splitLayout`.

## Tokens

- Surface and layout: `minHeight`, `gap`, `padding`, `panelPadding`, `backgroundColor`, `textColor`
- Panels: `primaryBackgroundColor`, `panelBackgroundColor`, `panelBorderColor`
- Controls and overlay: `controlsGap`, `toggleSize`, `toggleBorderRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`, `overlayBackgroundColor`, `zIndex`

## Recipes

- Use `SplitLayout` for opinionated pane presets and `Splitter` when users need arbitrary resizable panes.
- Keep collapsed state controlled in parent workflow code when layout state must survive route changes or saved workspace preferences.

## Accessibility

- The component uses `main` and `aside` landmarks with configurable labels.
- Mobile overlays can be dismissed with escape when `closeOnEsc` is enabled.
