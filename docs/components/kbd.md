# Kbd

## Purpose

Visual keyboard-key primitive for shortcut hints in docs and UI.

## Props

- `keys?: string | Array<string>` (string combos are split by `separator`)
- `separator?: string` (default `+`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string`

## Slots

- `default` (fallback content when `keys` is empty)
- `key` scoped slot: `{ label, index }`

## Example

```vue
<Kbd keys="Ctrl+Shift+P" />
```

## Tokens

Component tokens (override via `theme.overrides.components.kbd`):

- `fontFamily`
- `fontSize`
- `fontWeight`
- `lineHeight`
- `gap`
- `keyPadding`
- `keyMinWidth`
- `keyBorderRadius`
- `keyBorderColor`
- `keyBackgroundColor`
- `keyTextColor`
- `keyShadow`
- `separatorColor`
- `disabledOpacity`
- `small.fontSize`
- `small.keyPadding`
- `small.keyMinWidth`
- `large.fontSize`
- `large.keyPadding`
- `large.keyMinWidth`
