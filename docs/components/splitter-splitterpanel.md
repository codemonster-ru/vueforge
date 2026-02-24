# Splitter / SplitterPanel

## Purpose

Provide advanced task-focused interactions for authoring, media/input control, and guided workflows.
Enable product features that require richer interaction than basic form controls.

## Overview

Props (`Splitter`):

- `modelValue?: number[]` (v-model panel sizes in %)
- `minSizes?: number[]` (panel minimum sizes in %)
- `direction?: 'horizontal' | 'vertical'` (default `horizontal`)
- `gutterSize?: number | string` (default `8`)
- `disabled?: boolean` (default `false`)
- `persistence?: 'none' | 'local' | 'session'` (default `none`)
- `persistenceKey?: string` (used when `persistence` is enabled)

Props (`SplitterPanel`):

- `size?: number` (initial panel size in % when `v-model` is not provided)
- `minSize?: number` (minimum panel size in %)

Events (`Splitter`):

- `update:modelValue`
- `change`

## Props

- No additional props documented for this component at the moment.

## Events

- `Splitter`: `update:modelValue`, `change`
- `SplitterPanel`: no emitted events

## Slots

- `Splitter`: default slot for `SplitterPanel` children
- `SplitterPanel`: default slot for panel content

## Examples

```vue
<Splitter v-model="splitSizes" :min-sizes="[20, 20]" style="height: 280px">
    <SplitterPanel>Navigation</SplitterPanel>
    <SplitterPanel>Content</SplitterPanel>
</Splitter>
```

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

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.splitter`):

- `borderColor`, `borderRadius`
- `panelBackgroundColor`
- `handleWidth`, `handleHeight`, `handleRadius`, `handleColor`
- `gutterActiveBackgroundColor`
- `disabledOpacity`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Verify control affordances, panel sizing, and gesture/mouse interactions across device classes.
Ensure compact layouts preserve clarity for actions, handles, and contextual hints.

## SSR/Hydration

Keep initial value and panel-closed/base state stable between server and client output.
Hydrate client-only interaction engines (editor, drag, command layers) without DOM mismatch.

## Testing

Cover core interaction loops, boundary conditions, and value/state synchronization.
Add accessibility tests for keyboard alternatives, labelling, and focus behavior.

## Accessibility

- Gutters expose `role="separator"` with orientation and current value metadata.
- Keyboard resizing is supported on focused gutter (`Arrow` keys, `Home`, `End`, `PageUp`, `PageDown`).
- Ensure handle contrast and focus styles remain visible in custom themes.
