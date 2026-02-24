# Toolbar

## Purpose

Arrange grouped action controls in start/center/end zones for app and page toolbars.

## Props

- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)
- `wrap?: boolean` (default `true`)
- `dense?: boolean` (default `false`)
- `ariaLabel?: string` (default `Toolbar`)
- `groupAriaLabel?: string` (default `Toolbar group`)
- `startAriaLabel?: string` (default `Toolbar start group`)
- `centerAriaLabel?: string` (default `Toolbar center group`)
- `endAriaLabel?: string` (default `Toolbar end group`)

## Slots

- `default` (single group mode)
- `start`
- `center`
- `end`

## Example

```vue
<Toolbar aria-label="Data table controls">
    <template #start>
        <Button size="small">Create</Button>
        <Button size="small" variant="outlined">Import</Button>
    </template>
    <template #center>
        <Input placeholder="Search..." />
    </template>
    <template #end>
        <ButtonGroup>
            <Button size="small">Refresh</Button>
            <Button size="small">Export</Button>
        </ButtonGroup>
    </template>
</Toolbar>
```

## Theming

- Override via `theme.overrides.components.toolbar`.

## Tokens

- `padding`, `densePadding`
- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `sectionGap`, `controlGap`

## Accessibility

- Root uses `role="toolbar"` with configurable label.
- Rendered sections use `role="group"` to express grouped controls.

## Testing

- Cover named-group rendering, role/aria contracts, and orientation/wrap variants.
