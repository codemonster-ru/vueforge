# JSONViewer

## Purpose

Render structured JSON payloads with expandable nodes, type highlighting, and copyable JSON paths.

## Props

- `value?: unknown`
- `expandedDepth?: number` (default `1`)
- `sortKeys?: boolean` (default `true`)
- `showRoot?: boolean` (default `true`)
- `copyable?: boolean` (default `true`)
- `showToolbar?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `JSON viewer`)
- `emptyText?: string` (default `No JSON data.`)
- `expandLabel?: string` (default `Expand`)
- `collapseLabel?: string` (default `Collapse`)
- `expandAllLabel?: string` (default `Expand all`)
- `collapseAllLabel?: string` (default `Collapse all`)
- `copyPathLabel?: string` (default `Copy path`)
- `copyJsonLabel?: string` (default `Copy JSON`)

## Events

- `toggle({ path, expanded })`
- `copyPath({ path })`
- `copy({ text })`

## Slots

- N/A

## Examples

```vue
<JSONViewer :value="payload" :expanded-depth="2" @copyPath="onPathCopy" />
```

## Theming

- Override via `theme.overrides.components.jsonViewer`.

## Tokens

- Layout: `gap`, `padding`, `indentSize`, `rowGap`, `rowMinHeight`, `cellGap`
- Surface: `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- Typography: `fontFamily`, `fontSize`, `lineHeight`
- Controls: `toolbarGap`, `toolbarGroupGap`, `control*`, `toggleSize`
- Syntax colors: `keyColor`, `punctuationColor`, `metaColor`, `stringColor`, `numberColor`, `booleanColor`, `nullColor`, `emptyColor`

## Recipes

- Use in audit/event detail drawers to inspect request and response payloads.
- Wire `copyPath` for quick filter/query construction in debugging tooling.

## Accessibility

- Tree uses `role="tree"` / `role="treeitem"` with `aria-level` and `aria-expanded`.
- Toolbar and per-row controls remain keyboard-accessible.

## Responsive

- Monospace rows preserve readability in narrow side panels with stable indentation.

## SSR/Hydration

- Tree rows are deterministic from input payload and expansion state.

## Testing

- Cover expand/collapse behavior, copy-path/copy-json flows, syntax rendering, and empty state.
