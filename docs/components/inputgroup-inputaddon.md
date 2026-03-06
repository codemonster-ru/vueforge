# InputGroup / InputAddon

Compose multiple related controls and addons into one combined input surface.

## Import

```ts
import { InputAddon, InputGroup } from '@codemonster-ru/vueforge';
```

## Examples

Use `InputGroup` when a field, addon, and adjacent action should read as one control cluster.

### Basic

Use `InputAddon` for currency, unit, or protocol prefixes and suffixes.

```vue
<template>
    <InputGroup>
        <InputAddon>$</InputAddon>
        <NumberInput :model-value="149" :min="0" :step="1" />
    </InputGroup>
</template>
```

### With Button

Use a trailing action when the field and command belong together.

```vue
<template>
    <InputGroup>
        <Input model-value="https://acme.example" />
        <Button label="Copy" />
    </InputGroup>
</template>
```

### Outlined

Use `outlined` when the group sits on a filled card or dense settings panel.

```vue
<template>
    <InputGroup variant="outlined">
        <InputAddon>@</InputAddon>
        <Input model-value="workspace" />
    </InputGroup>
</template>
```

### Compact Size

Use size on the group to keep addon density aligned with the wrapped controls.

```vue
<template>
    <InputGroup size="small">
        <InputAddon>kg</InputAddon>
        <NumberInput :model-value="5" />
    </InputGroup>
</template>
```

## InputGroup Props

- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## InputAddon Props

- `as?: string` (default `span`)

## Events

- This component does not emit component-specific events.

## Slots

- `InputGroup`: `default`
- `InputAddon`: `default`

## Theming

- Override via `theme.overrides.components.inputGroup`.

## Tokens

Component tokens (override via `theme.overrides.components.inputGroup`):

- `gap`, `borderRadius`
- `addonPadding`, `addonFontSize`
- `addonBackgroundColor`, `addonOutlinedBackgroundColor`
- `addonTextColor`, `addonBorderColor`, `disabledOpacity`
- `small.addonPadding`, `small.addonFontSize`
- `large.addonPadding`, `large.addonFontSize`

## Recipes

- Use `InputGroup` for controls that form one semantic unit, not arbitrary neighbors.
- Prefer `InputAddon` for passive content like currency or domain hints; use buttons for interactive actions.
- Keep grouped controls visually compatible in size and variant.

## Accessibility

- `InputGroup` exposes `role="group"` and supports group labelling via `ariaLabel` or `ariaLabelledby`.
- Use `InputAddon` for contextual text or symbols; keep interactive actions as focusable controls inside the group.
