# Splitter / SplitterPanel

Splitter and `SplitterPanel` provide resizable panes with keyboard support and optional persisted sizes.

## Import

```ts
import Splitter from '@/package/components/splitter.vue';
import SplitterPanel from '@/package/components/splitter-panel.vue';
```

## Examples

### Basic

Use `Splitter` when users should be able to resize adjacent workspace panes.

```vue
<Splitter v-model="splitSizes" :min-sizes="[20, 20]" style="height: 280px">
    <SplitterPanel>Navigation</SplitterPanel>
    <SplitterPanel>Content</SplitterPanel>
</Splitter>
```

### Nested Splitters

Nest splitters to build IDE-style or analytics workspaces.

```vue
<Splitter
    direction="horizontal"
    persistence="local"
    persistence-key="workspace-layout"
    :min-sizes="[20, 20]"
    style="height: 360px"
>
    <SplitterPanel>
        <Splitter direction="vertical" :min-sizes="[30, 20]">
            <SplitterPanel>Explorer</SplitterPanel>
            <SplitterPanel>Inspector</SplitterPanel>
        </Splitter>
    </SplitterPanel>
    <SplitterPanel>Editor</SplitterPanel>
</Splitter>
```

## API

### Splitter Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `number[]` | `[]` |
| `minSizes` | `number[]` | `[]` |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `gutterSize` | `number \| string` | `8` |
| `disabled` | `boolean` | `false` |
| `persistence` | `'none' \| 'local' \| 'session'` | `'none'` |
| `persistenceKey` | `string` | `''` |

### SplitterPanel Props

| Name | Type | Default |
| --- | --- | --- |
| `size` | `number \| undefined` | `undefined` |
| `minSize` | `number \| undefined` | `undefined` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `number[]` |
| `change` | `number[]` |

## Theming

Override component tokens through `theme.overrides.components.splitter`.

## Tokens

- `borderColor`
- `borderRadius`
- `panelBackgroundColor`
- `handleWidth`
- `handleHeight`
- `handleRadius`
- `handleColor`
- `gutterActiveBackgroundColor`
- `disabledOpacity`

## Recipes

- Use `Splitter` when end users should control pane sizes. Use `SplitLayout` when the layout should stay opinionated and preset-driven.
- Only enable persistence when pane sizes are part of a durable workspace preference.

## Accessibility

- Gutters expose `role="separator"` with orientation and min, max, and current values.
- Keyboard resizing supports arrows, `Home`, `End`, `PageUp`, and `PageDown`.
