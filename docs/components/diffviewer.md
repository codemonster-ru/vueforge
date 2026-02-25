# DiffViewer

## Purpose

Compare text or JSON payloads in `inline` or `split` mode for audit/debug and review workflows.

## Props

- `before?: unknown`
- `after?: unknown`
- `mode?: 'inline' | 'split'` (default `inline`)
- `format?: 'auto' | 'text' | 'json'` (default `auto`)
- `showToolbar?: boolean` (default `true`)
- `copyable?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Diff viewer`)
- `emptyText?: string` (default `No diff data.`)
- `inlineLabel?: string` (default `Inline`)
- `splitLabel?: string` (default `Split`)
- `beforeLabel?: string` (default `Before`)
- `afterLabel?: string` (default `After`)
- `copyLabel?: string` (default `Copy diff`)

## Events

- `update:mode`
- `copy({ text })`

## Slots

- N/A

## Examples

```vue
<DiffViewer :before="previousPayload" :after="nextPayload" mode="split" format="json" />
```

## Theming

- Override via `theme.overrides.components.diffViewer`.

## Tokens

- Layout/surface: `gap`, `padding`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- Typography: `fontFamily`, `fontSize`, `lineHeight`
- Toolbar/controls: `toolbarGap`, `toolbarGroupGap`, `control*`, `controlActive*`
- Rows/cells: `dividerColor`, `cellPadding`, `rowGap`, `cellGap`, `rowBorderRadius`, `lineColor`, `markerColor`
- States: `addedBackgroundColor`, `removedBackgroundColor`, `changedBackgroundColor`, `emptyColor`

## Recipes

- Use `format="json"` for payload/object diffs in audit pages.
- Use `mode="inline"` for compact side panels and `split` for desktop detail drawers.

## Accessibility

- Mode toggles expose `aria-pressed` and remain keyboard reachable.
- Split mode renders semantic table structure for line comparison.

## Responsive

- Inline mode stays compact on narrow panels; split mode is suited for wider layouts.

## SSR/Hydration

- Deterministic rendering from `before`/`after` values and selected mode.

## Testing

- Cover mode switch, JSON formatting, line state rendering, and copy action events.
