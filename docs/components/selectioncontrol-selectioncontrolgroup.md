# SelectionControl / SelectionControlGroup

## Purpose

Shared primitives for checkbox/radio/switch behaviors with optional group-managed state.

## SelectionControl Props

- `modelValue?: unknown`
- `value?: string | number | boolean` (default `true`)
- `type?: 'checkbox' | 'radio' | 'switch'` (default `checkbox`)
- `label?: string`
- `disabled?: boolean`
- `id?: string`
- `name?: string`
- `required?: boolean`
- `ariaLabel?: string`
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'`

## SelectionControlGroup Props

- `modelValue?: unknown`
- `type?: 'checkbox' | 'radio' | 'switch'` (default `checkbox`)
- `name?: string`
- `disabled?: boolean`
- `direction?: 'vertical' | 'horizontal'` (default `vertical`)
- `multiple?: boolean` (default auto: `true` except radio)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## Events

- `SelectionControl`: `update:modelValue`, `change`
- `SelectionControlGroup`: `update:modelValue`, `change`

## Example

```vue
<SelectionControlGroup v-model="channels" type="checkbox">
    <SelectionControl value="email" label="Email" />
    <SelectionControl value="sms" label="SMS" />
</SelectionControlGroup>
```

## Tokens

- `theme.overrides.components.selectionControl`:
  `gap`, `textColor`, `disabledOpacity`,
  `box*`, `radio*`, `switch*`
- `theme.overrides.components.selectionControlGroup`:
  `gap`, `horizontalGap`

## Accessibility

- Group uses `radiogroup` role for radio type and `group` for checkbox/switch.
- Switch mode maps to native checkbox with `role="switch"` and `aria-checked`.
