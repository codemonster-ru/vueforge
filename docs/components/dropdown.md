# Dropdown

## Purpose

Handle layered interactions (dialogs, overlays, contextual actions, and transient notifications) with consistent behavior.
Centralize close policies, focus management, and stack/layer contracts for complex SaaS screens.

## Props

- `modelValue?: boolean` (v-model)
- `items?: Array<{ label?: string; to?: string; href?: string; url?: string; icon?: string; disabled?: boolean; separator?: boolean; command?: () => void }>`
- `placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom' | 'top'` (default `bottom-start`)
- `offset?: number` (default `6`)
- `disabled?: boolean`
- `closeOnSelect?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `matchTriggerWidth?: boolean` (default `true`)

## Events

- `update:modelValue`
- `open`
- `close`
- `select`

## Slots

- `trigger`
- `default` (optional) - dropdown content (defaults to `items` list if provided)

Note: For custom dropdown content, add `data-dropdown-close` to clickable elements to auto-close on click.

## Examples

```vue
<Dropdown :items="menuItems">
    <template #trigger>
        <Button label="Actions" />
    </template>
</Dropdown>
```

## Theming

- Override via `theme.overrides.components.dropdown`.

## Tokens

Component tokens (override via `theme.overrides.components.dropdown`):

- `panelPadding`, `panelBorderRadius`, `panelBorderColor`
- `panelBackgroundColor`, `panelShadow`, `zIndex`
- `disabledOpacity`, `itemPadding`

## Recipes

- Action menu button with default item list (`items` prop).
- Custom content menu using `#default` and `data-dropdown-close` hooks.
- Toolbar menu aligned to trigger width (`matchTriggerWidth=true`).

## Responsive

Verify overlay sizing, placement fallback, and viewport collision handling on mobile/tablet/desktop.
Ensure gesture/touch close interactions and action buttons remain accessible on small screens.

## SSR/Hydration

Render closed/open initial state deterministically and keep portal/container structure hydration-safe.
Initialize positioning/focus logic only after mount to avoid server-client markup drift.

## Testing

Cover open/close triggers, escape/outside click behavior, focus trap/restore, and stacking order.
Add accessibility tests for ARIA roles, labelling, and keyboard navigation in layered UI.

## Accessibility

- Trigger exposes popup state via `aria-expanded`.
- Keyboard close via `Escape` is available when `closeOnEsc` is enabled.
- For custom menu content, ensure focusable actions have clear text labels.

## Interaction Contract

- Trigger behavior:
    - `click`, `Enter`, `Space` toggle dropdown open state
    - `ArrowDown` opens and focuses first item
    - `ArrowUp` opens and focuses last item
- Panel keyboard behavior:
    - `ArrowDown`/`ArrowUp` moves focus between menu items
    - `Home`/`End` focuses first/last item
    - `Escape` closes dropdown and returns focus to trigger when `closeOnEsc=true`
- Selection behavior:
    - emits `select` on panel click
    - closes after select when `closeOnSelect=true` and clicked item is menu action or has `data-dropdown-close`
- Outside click closes dropdown.

## Positioning and Z-Index Policy

- Popup placement is controlled by `placement` + `offset`, with fallback flip to opposite side when needed.
- `matchTriggerWidth=true` applies trigger width as popup minimum width.
- Popup layer uses `zIndex` token (`--vf-dropdown-z-index`, default `50`), intentionally below modal/drawer overlays (`100`).
