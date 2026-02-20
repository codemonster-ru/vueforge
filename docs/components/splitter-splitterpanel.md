# Splitter / SplitterPanel

## Overview

Props (`Splitter`):

- `modelValue?: number[]` (v-model panel sizes in %)
- `minSizes?: number[]` (panel minimum sizes in %)
- `direction?: 'horizontal' | 'vertical'` (default `horizontal`)
- `gutterSize?: number | string` (default `8`)
- `disabled?: boolean` (default `false`)

Props (`SplitterPanel`):

- `size?: number` (initial panel size in % when `v-model` is not provided)
- `minSize?: number` (minimum panel size in %)

Events (`Splitter`):

- `update:modelValue`
- `change`

## Props

- No additional props documented for this component at the moment.

## Events

- This component does not emit component-specific events.

## Slots

- This component does not expose named slots.

## Examples

```vue
<Splitter v-model="splitSizes" :min-sizes="[20, 20]" style="height: 280px">
    <SplitterPanel>Navigation</SplitterPanel>
    <SplitterPanel>Content</SplitterPanel>
</Splitter>
```

## Tokens

Component tokens (override via `theme.overrides.components.splitter`):

- `borderColor`, `borderRadius`
- `panelBackgroundColor`
- `handleWidth`, `handleHeight`, `handleRadius`, `handleColor`
- `gutterActiveBackgroundColor`
- `disabledOpacity`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
