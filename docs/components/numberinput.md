# NumberInput

Capture bounded numeric values with typing, arrow-key stepping, and optional increment controls.

## Import

```ts
import { NumberInput } from '@codemonster-ru/vueforge';
```

## Examples

Use `NumberInput` when the value is numeric by definition and the UI should help users stay within a valid range.

### Basic

Use the default control for quantities, seats, retry counts, and similar bounded values.

```vue
<template>
    <NumberInput v-model="quantity" :min="0" :max="10" :step="1" placeholder="Quantity" />
</template>
```

### Precision

Use `precision` for currency-like or ratio-like fields that must round consistently.

```vue
<template>
    <NumberInput v-model="discount" :min="0" :max="1" :step="0.05" :precision="2" placeholder="Discount" />
</template>
```

### Without Controls

Hide the step buttons when the layout is tight or the field is primarily typed rather than clicked.

```vue
<template>
    <NumberInput v-model="port" :min="1024" :max="65535" :controls="false" placeholder="Port" />
</template>
```

### Sizes

Adjust `size` to match dense toolbars or roomier forms without changing behavior.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <NumberInput v-model="smallValue" size="small" placeholder="Small number input" />
        <NumberInput v-model="normalValue" placeholder="Default number input" />
        <NumberInput v-model="largeValue" size="large" placeholder="Large number input" />
    </div>
</template>
```

### Disabled And Readonly

Use `disabled` to block editing entirely and `readonly` when the numeric value should remain visible but fixed.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <NumberInput v-model="disabledCount" disabled placeholder="Disabled input" />
        <NumberInput v-model="readonlyCount" readonly />
    </div>
</template>
```

## Props

- `modelValue?: number | null` (v-model)
- `min?: number`
- `max?: number`
- `step?: number` (default `1`)
- `precision?: number`
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `autocomplete?: string`
- `inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'`
- `controls?: boolean` (default `true`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Number input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`

## Slots

- `prefix`
- `suffix`

## Theming

- Override via `theme.overrides.components.numberInput`.

## Tokens

Override via `theme.overrides.components.numberInput`:

- `gap`, `fontSize`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`, `disabledOpacity`
- `controlWidth`, `controlGap`, `controlFontSize`, `controlRadius`
- `controlBackgroundColor`, `controlHoverBackgroundColor`, `controlTextColor`, `controlBorderColor`
- `small.padding`, `small.fontSize`, `small.controlWidth`, `small.controlFontSize`
- `large.padding`, `large.fontSize`, `large.controlWidth`, `large.controlFontSize`

## Recipes

- Use `min`, `max`, `step`, and `precision` together so validation and stepping follow the same business rule.
- Hide controls when the field appears in dense tables or inline editors.
- Prefer `NumberInput` over free-form text input whenever the backend expects a real number.

## Accessibility

- Provide an accessible name (`label` + `id`, or `ariaLabel` / `ariaLabelledby`).
- For help/error text, wire `ariaDescribedby`.
- For invalid and required states, use `ariaInvalid` / `required` (or `ariaRequired` override).
- Arrow keys are supported for stepping: `ArrowUp` increments and `ArrowDown` decrements.
- Keyboard focus uses the component focus ring (`:focus-within`) for visible state.
