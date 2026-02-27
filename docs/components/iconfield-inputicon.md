# IconField / InputIcon

## Purpose

Provide consistent icon placement contracts for input-like controls.

## IconField Props

- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## InputIcon Props

- `icon?: string`
- `side?: 'start' | 'end'` (default `start`)
- `as?: string` (default `span`)
- `decorative?: boolean` (default `true`)
- `ariaLabel?: string`

## Slots

- `IconField`: `start`, `default`, `end`
- `InputIcon`: `default` (custom icon body)

## Example

```vue
<IconField>
    <template #start>
        <InputIcon icon="magnifyingGlass" />
    </template>
    <Input v-model="query" placeholder="Search" />
    <template #end>
        <InputIcon side="end" icon="xMark" />
    </template>
</IconField>
```

## Tokens

- `theme.overrides.components.iconField`:
  `iconSize`, `iconColor`, `slotOffset`, `controlPaddingStart`, `controlPaddingEnd`, `disabledOpacity`
- `theme.overrides.components.inputIcon`:
  `size`, `color`

## Accessibility

- `IconField` exposes `role="group"` for grouped control semantics.
- Use `InputIcon` with `decorative=false` and `ariaLabel` when icon conveys meaning.
