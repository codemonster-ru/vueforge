# Popover

## Props

- `modelValue?: boolean` (optional controlled mode)
- `placement?: 'bottom' | 'top' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'` (default `bottom`)
- `offset?: number` (default `8`)
- `disabled?: boolean` (default `false`)
- `closeOnEsc?: boolean` (default `true`)
- `closeOnOutside?: boolean` (default `true`)

## Events

- `update:modelValue`
- `open`
- `close`
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
<Popover placement="bottom-start" :offset="10">
    <template #button>
        <Button label="Open popover" />
    </template>
    <template #default>Popover content</template>
</Popover>
```

## Theming

- Override via `theme.overrides.components.popover`.

## Tokens

Override via `theme.overrides.components.popover`:

- `borderRadius`, `borderColor`, `backgroundColor`, `shadow`, `zIndex`

## Recipes

- Info popover anchored to icon button with short helper content.
- Compact action card with header/body/footer slots.
- Controlled popover (`v-model`) coordinated with external state.

## Accessibility

- Trigger uses button semantics and exposes `aria-expanded` / `aria-controls`.
- Supports `Escape` dismiss when `closeOnEsc` is enabled.
- Restores focus to the previously active element on dismiss.
- If popover contains interactive controls, ensure keyboard focus order is logical.

## Interaction Contract

- Trigger behavior:
    - `click`, `Enter`, `Space` toggle visibility
    - emits legacy `click`/`onClick` on trigger interaction
- Dismiss behavior:
    - outside click dismisses when `closeOnOutside=true`
    - `Escape` dismisses when `closeOnEsc=true`
    - dismiss restores focus to element active before opening
- Controlled mode:
    - with `modelValue`, component emits `update:modelValue` and delegates visible state to parent
- Positioning:
    - popup is teleported to `body`
    - `placement` + `offset` are applied via floating positioning with flip fallback

## Z-Index Policy

- Popover layer uses `--vf-popover-z-index` (default token: `70`).
- It is intentionally above dropdown (`50`) and below modal/drawer overlays (`100`) in default theme.
