# Card

## Props

- No props

## Events

- This component does not emit component-specific events.

## Slots

- `default`
- `header`
- `body`
- `footer`

## Examples

```vue
<Card>
    <template #header>Header</template>
    <template #body>Main content</template>
    <template #footer>Footer</template>
</Card>
```

## Theming

- Override via `theme.overrides.components.card`.

## Tokens

Override via `theme.overrides.components.card`:

- `padding`, `borderColor`, `borderRadius`

## Recipes

- Information card with header/body/footer slots.
- Section container card wrapping `PageHeader` and controls.
- Lightweight tile cards in grid/list layouts.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
