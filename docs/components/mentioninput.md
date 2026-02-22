# MentionInput

## Purpose

Capture user text and numeric input with consistent API, validation hooks, and theming behavior.
Support high-frequency form entry scenarios in SaaS settings, auth, and CRUD flows.

## Props

- `modelValue?: string` (v-model)
- `suggestions?: Array<{ label: string; value?: string | number; trigger?: string; disabled?: boolean }>` (default `[]`)
- `triggers?: Array<string>` (default `['@', '#']`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `autocomplete?: string` (default `off`)
- `inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'` (default `text`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No matches`)
- `minQueryLength?: number` (default `1`)
- `maxSuggestions?: number` (default `8`)
- `appendSpace?: boolean` (default `true`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Mention input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)

## Events

- `update:modelValue`
- `input`
- `change`
- `search` (payload: `{ trigger: string; query: string }`)
- `select`
- `insert` (payload: `{ trigger, query, option, text, range }`)
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<MentionInput
    v-model="message"
    :suggestions="[
        { label: 'alice', value: 'alice', trigger: '@' },
        { label: 'frontend', value: 'frontend', trigger: '#' },
    ]"
    placeholder="Type @name or #topic"
/>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.mentionInput`):

- `minWidth`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`, `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionGap`, `optionBorderRadius`, `optionFontSize`
- `optionHoverBackgroundColor`, `optionTriggerColor`
- `emptyPadding`, `emptyColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

Note: default filled backgrounds for Input/Select/Textarea use `controls.backgroundColor` (defaults to `bgSoftColor`). Set it to `bgColor` to disable soft backgrounds.

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Validate control height, helper/error text wrapping, and icon/addon placement across breakpoints.
Ensure virtual keyboards and touch interaction do not clip labels, hints, or action icons.

## SSR/Hydration

Keep initial value, disabled, and readonly states identical between server and client render.
Avoid hydration mismatches from client-only formatting or masking initialization.

## Testing

Cover v-model updates, input/change/blur events, and validation edge cases.
Add accessibility tests for labeling, error semantics, and keyboard interaction contracts.

## Accessibility

- Input exposes combobox semantics (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-autocomplete="list"`).
- Suggestion panel uses `role="listbox"` and options use `role="option"` with `aria-selected` for highlighted state.
- Provide an accessible name (`label` + `id`, or `ariaLabel` / `ariaLabelledby`).
- For help/error text, wire `ariaDescribedby`.
- For invalid and required states, use `ariaInvalid` / `required` (or `ariaRequired` override).
- Keyboard focus uses the component focus ring (`:focus-within`) for visible state.
