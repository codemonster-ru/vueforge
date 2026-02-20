# Input

## Props

- `modelValue?: string | number` (v-model, default `''`)
- `type?: string` (default `text`)
- `placeholder?: string`
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`

## Slots

- `prefix`
- `suffix`

## Examples

```vue
<Input v-model="email" placeholder="Email" />
<Input v-model="query" variant="outlined">
    <template #prefix>рџ”Ћ</template>
</Input>
```

## Tokens

Override via `theme.overrides.components.input`.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
