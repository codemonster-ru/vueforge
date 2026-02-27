# Hotkey

## Purpose

Scoped keyboard shortcut utility with accessibility-safe defaults and optional composable API.

## Component Props

- `combo?: string | string[]` (default `mod+k`)
- `enabled?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `scoped?: boolean` (default `true`)
- `event?: 'keydown' | 'keyup'` (default `keydown`)
- `preventDefault?: boolean` (default `true`)
- `stopPropagation?: boolean` (default `false`)
- `ignoreInputs?: boolean` (default `true`)
- `allowInInputs?: boolean` (default `false`)
- `exact?: boolean` (default `true`)
- `as?: string` (default `div`)

## Events

- `trigger` payload: `{ event, combo }`

## Slots

- `default` scoped slot: `{ trigger }`

## Composable

- `useHotkey(options)` with `combo`, `handler`, `enabled`, `event`, `target`, `scopeRef`, and safety flags.

## Example

```vue
<Hotkey combo="mod+k" @trigger="openPalette">
    <div />
</Hotkey>
```

## Accessibility

- By default ignores shortcuts inside `input/textarea/select/contenteditable`.
- Scoped mode requires focus/target within wrapper subtree.
