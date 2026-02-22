# Card

## Purpose

- Provide reusable content surface for dashboards, lists, and settings blocks.
- Centralize elevation/border/padding behavior across the system.

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

## Responsive

- Validate internal spacing and slot layout under compact breakpoints.
- Ensure media/header/footer sections reflow cleanly on small screens.

## SSR/Hydration

- Card markup is static and should hydrate without state divergence.
- Confirm token-based visual variants render identically server/client.

## Testing

- Cover surface variants, slot combinations, and interactive card states if enabled.
- Add visual regression tests for bordered/elevated styles.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
