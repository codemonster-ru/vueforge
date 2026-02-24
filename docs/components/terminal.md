# Terminal

## Purpose

Display command history and output logs in a terminal-style container for admin/dev tooling UI.

## Props

- `entries?: Array<TerminalEntry>` (default `[]`)
- `prompt?: string` (default `$`)
- `showTimestamps?: boolean` (default `true`)
- `maxHeight?: string` (default `20rem`)
- `clearable?: boolean` (default `false`)
- `copyable?: boolean` (default `false`)
- `autoScroll?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Terminal log`)
- `emptyText?: string` (default `No command output yet`)
- `clearLabel?: string` (default `Clear`)
- `copyLabel?: string` (default `Copy log`)

## Events

- `clear`
- `copy` (`{ text: string }`)
- `entryClick` (`{ entry, index, event }`)

## Slots

- `actions` custom toolbar actions
- `entry` custom entry renderer (`{ entry, index }`)
- `empty` custom empty state

## Examples

```vue
<Terminal :entries="logs" copyable clearable aria-label="Deploy log" @copy="onCopy" @clear="logs = []" />
```

## Theming

- Override via `theme.overrides.components.terminal`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `fontFamily`, `fontSize`
- `toolbarPadding`, `actionsGap`, `dividerColor`
- `actionBorderColor`, `actionRadius`, `actionBackgroundColor`, `actionTextColor`, `actionPadding`
- `bodyPadding`, `entryGap`
- `timeFontSize`, `timeColor`, `promptColor`
- `entryNeutralColor`, `entryInfoColor`, `entrySuccessColor`, `entryWarnColor`, `entryErrorColor`
- `emptyColor`, `disabledOpacity`

## Recipes

- CI/CD job output viewer with copy/clear controls.
- Command audit panel in internal tools.

## Accessibility

- Uses `role="log"` with `aria-live="polite"` for output updates.
- Entry rows are clickable and emit payload for detail drill-down.

## Responsive

- Constrain height via `maxHeight` and keep internal vertical scrolling.
- For mobile layouts, reduce surrounding paddings and keep action labels short.

## SSR/Hydration

- Initial render is deterministic from static `entries`.
- Clipboard API usage is guarded and only runs on client action.

## Testing

- Cover log rendering, actions (`copy`/`clear`), entry click events, disabled behavior, and auto-scroll on updates.
