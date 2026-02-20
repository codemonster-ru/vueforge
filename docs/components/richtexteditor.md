# RichTextEditor

## Props

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `format?: 'markdown' | 'html'` (default `markdown`)
- `rows?: number` (default `6`)
- `maxLength?: number` (default `0`, disabled when `0`)
- `showToolbar?: boolean` (default `true`)
- `toolbar?: Array<'bold' | 'italic' | 'underline' | 'link' | 'bulletList' | 'orderedList' | 'code'>`
- `toolbarLabel?: string` (default `Text formatting toolbar`)
- `ariaLabel?: string` (default `Rich text editor`)

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`
- `action` (payload: `action`, `nextValue`)

## Slots

- This component does not expose named slots.

## Examples

```vue
<RichTextEditor
    v-model="article"
    format="markdown"
    :rows="8"
    :max-length="2000"
    :toolbar="['bold', 'italic', 'link', 'bulletList', 'code']"
/>
```

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
