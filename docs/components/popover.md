# Popover

## Props

- No props

## Events

- `click`
- `onClick`

## Slots

- `button` (trigger, required for interaction)
- `default`
- `header` / `popoverHeader`
- `body` / `popoverBody`
- `footer` / `popoverFooter`

## Exposes

- `show()`
- `hide()`
- `toggle()`

## Examples

```vue
<Popover>
    <template #button>
        <Button label="Open popover" />
    </template>
    <template #default>Popover content</template>
</Popover>
```

## Tokens

Override via `theme.overrides.components.popover`:

- `borderRadius`, `borderColor`, `backgroundColor`, `shadow`

## Accessibility

- Trigger uses button semantics and exposes `aria-expanded` / `aria-controls`.
- Provide clear trigger text and concise popover content.
- If popover contains interactive controls, ensure keyboard focus order is logical.
