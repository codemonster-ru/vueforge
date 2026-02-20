# InputGroup / InputAddon

## Overview

Props (`InputGroup`):

- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `disabled?: boolean` (default `false`)

Props (`InputAddon`):

- `as?: string` (default `span`)

## Props

- No additional props documented for this component at the moment.

## Events

- This component does not emit component-specific events.

## Slots

- `default` - group controls/addons content

## Examples

```vue
<InputGroup>
    <InputAddon>$</InputAddon>
    <NumberInput v-model="price" :min="0" :step="0.5" />
    <Button label="Apply" />
</InputGroup>
```

## Tokens

Component tokens (override via `theme.overrides.components.inputGroup`):

- `gap`, `borderRadius`
- `addonPadding`, `addonFontSize`
- `addonBackgroundColor`, `addonOutlinedBackgroundColor`
- `addonTextColor`, `addonBorderColor`, `disabledOpacity`
- `small.addonPadding`, `small.addonFontSize`
- `large.addonPadding`, `large.addonFontSize`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
