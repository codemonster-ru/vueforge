# SelectionControl / SelectionControlGroup

SelectionControl and SelectionControlGroup are low-level primitives behind checkbox, radio, and switch behaviors. They are useful when you need shared selection semantics with custom composition rather than higher-level form controls.

## Import

```ts
import SelectionControl from '@/package/components/selection-control.vue';
import SelectionControlGroup from '@/package/components/selection-control-group.vue';
```

## Examples

### Basic Group

```vue
<SelectionControlGroup v-model="channels" type="checkbox">
    <SelectionControl value="email" label="Email" />
    <SelectionControl value="sms" label="SMS" />
</SelectionControlGroup>
```

### Radio Group

```vue
<SelectionControlGroup v-model="priority" type="radio" name="priority">
    <SelectionControl value="low" label="Low" />
    <SelectionControl value="high" label="High" />
</SelectionControlGroup>
```

### Switch Primitive

```vue
<SelectionControl v-model="enabled" type="switch" label="Enable notifications" />
```

## API

### SelectionControl Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `unknown` | `undefined` |
| `value` | `string \| number \| boolean` | `true` |
| `type` | `'checkbox' \| 'radio' \| 'switch'` | `'checkbox'` |
| `label` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `id` | `string \| undefined` | `undefined` |
| `name` | `string \| undefined` | `undefined` |
| `required` | `boolean` | `false` |
| `ariaLabel` | `string \| undefined` | `undefined` |
| `ariaLabelledby` | `string \| undefined` | `undefined` |
| `ariaDescribedby` | `string \| undefined` | `undefined` |
| `ariaInvalid` | `boolean \| 'true' \| 'false' \| undefined` | `undefined` |
| `ariaRequired` | `boolean \| 'true' \| 'false' \| undefined` | `undefined` |

### SelectionControl Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | updated value |
| `change` | `value, event` |

### SelectionControlGroup Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `unknown` | `undefined` |
| `type` | `'checkbox' \| 'radio' \| 'switch'` | `'checkbox'` |
| `name` | `string \| undefined` | `undefined` |
| `disabled` | `boolean` | `false` |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` |
| `multiple` | `boolean \| undefined` | `undefined` |
| `ariaLabel` | `string` | `''` |
| `ariaLabelledby` | `string` | `''` |

### SelectionControlGroup Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | updated group value |
| `change` | `value, event` |

## Theming

- `theme.overrides.components.selectionControl` controls the checkbox, radio, and switch primitives.
- `theme.overrides.components.selectionControlGroup` controls primitive group spacing.

## Tokens

- `selectionControl`: `gap`, `textColor`, `disabledOpacity`, `box*`, `radio*`, `switch*`
- `selectionControlGroup`: `gap`, `horizontalGap`

## Recipes

- Use these primitives when building custom field wrappers, matrix inputs, or composite selection UIs.
- Prefer `Checkbox`, `RadioGroup`, and `Switch` for standard consumer-facing forms.

## Accessibility

- Radio groups use `radiogroup`; checkbox and switch groups use `group`.
- Switch mode maps to a checkbox input with `role="switch"` and explicit `aria-checked`.
