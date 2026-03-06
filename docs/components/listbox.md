# Listbox

Listbox provides an always-visible option list for single or multiple selection with grouped options and keyboard-first navigation.

## Import

```ts
import Listbox from '@/package/components/listbox.vue';
```

## Examples

### Basic

```vue
<Listbox v-model="value" :options="options" />
```

### Multiple Selection

```vue
<Listbox v-model="values" :options="options" multiple />
```

### Grouped Options

```vue
<Listbox
    v-model="values"
    :options="[
        {
            label: 'Public',
            options: [
                { label: 'Read', value: 'read' },
                { label: 'Comment', value: 'comment' },
            ],
        },
        { label: 'Admin', options: [{ label: 'Write', value: 'write' }] },
    ]"
    multiple
/>
```

### Custom Option Content

```vue
<Listbox v-model="value" :options="options">
    <template #option="{ option, selected }">
        <span :class="{ 'is-selected': selected }">
            {{ option.label }}
        </span>
    </template>
</Listbox>
```

## API

### Types

```ts
type ListboxValue = string | number;

interface ListboxOption {
    label: string;
    value: ListboxValue;
    disabled?: boolean;
}

interface ListboxOptionGroup {
    label: string;
    options: ListboxOption[];
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `ListboxValue \| ListboxValue[] \| undefined` | `undefined` |
| `options` | `(ListboxOption \| ListboxOptionGroup)[]` | `[]` |
| `multiple` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `size` | `'small' \| 'normal' \| 'large'` | `'normal'` |
| `variant` | `'filled' \| 'outlined'` | `'filled'` |
| `ariaLabel` | `string` | `'Listbox'` |
| `emptyText` | `string` | `'No options'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | selected value payload |
| `change` | `nextValue, option, event` |
| `focus` | `FocusEvent` |
| `blur` | `FocusEvent` |

### Slots

| Name | Description |
| --- | --- |
| `option` | Custom option content with `{ option, selected, highlighted }`. |
| `empty` | Replaces the empty state. |

## Theming

Override component tokens through `theme.overrides.components.listbox`.

## Tokens

- Surface: `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `padding`, `minHeight`, `maxHeight`
- Focus and grouping: `focusRingShadow`, `focusBorderColor`, `groupGapTop`, `groupLabelPadding`, `groupLabelColor`, `groupLabelFontSize`
- Options: `optionPadding`, `optionBorderRadius`, `optionHighlightedBackgroundColor`, `optionSelectedBackgroundColor`, `optionSelectedTextColor`
- Empty and state: `emptyPadding`, `emptyColor`, `disabledOpacity`, `small.*`, `large.*`

## Recipes

- Use Listbox when users need persistent visibility of choices rather than a dropdown trigger.
- Prefer `Select` for compact forms where the options do not need to stay visible all the time.

## Accessibility

- Listbox uses `role="listbox"` and `role="option"` with `aria-selected`.
- Keyboard support includes `ArrowUp`, `ArrowDown`, `Home`, `End`, `Enter`, and `Space`.
- Multi-select mode exposes `aria-multiselectable`.

