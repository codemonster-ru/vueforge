# Dropdown

Open contextual menus and custom overlay content from a trigger without managing popup plumbing manually.

## Import

```ts
import { Dropdown } from '@codemonster-ru/vueforge';
```

## Examples

Treat `Dropdown` as a positioning and close-policy primitive. Use the built-in item list for simple menus and the default slot for custom content.

### Menu Items

Pass `items` for a lightweight action menu driven by menu semantics.

```vue
<template>
    <Dropdown
        :items="[
            { label: 'View details', href: '#' },
            { label: 'Duplicate', href: '#' },
            { separator: true },
            { label: 'Archive', href: '#', disabled: true }
        ]"
    >
        <template #trigger>
            <Button label="Actions" />
        </template>
    </Dropdown>
</template>
```

### Custom Content

Use the default slot when the popup needs richer controls than a standard menu item list.

```vue
<template>
    <Dropdown>
        <template #trigger>
            <Button label="Quick actions" variant="outlined" />
        </template>
        <div style="display: grid; gap: 0.5rem; min-width: 12rem;">
            <Button label="Create report" size="small" data-dropdown-close />
            <Button label="Share link" size="small" variant="text" data-dropdown-close />
        </div>
    </Dropdown>
</template>
```

### Placement

Change `placement` when the menu belongs to a right-aligned toolbar or a top-positioned trigger.

```vue
<template>
    <Dropdown placement="bottom-end">
        <template #trigger>
            <Button label="More" severity="secondary" />
        </template>
        <div style="display: grid; gap: 0.35rem; min-width: 10rem;">
            <Button label="Rename" size="small" variant="text" data-dropdown-close />
            <Button label="Delete" size="small" variant="text" severity="danger" data-dropdown-close />
        </div>
    </Dropdown>
</template>
```

### Controlled State

Use `v-model` when open state must stay in sync with surrounding UI logic.

```vue
<template>
    <Dropdown v-model="open">
        <template #trigger>
            <Button label="Controlled dropdown" />
        </template>
        <div style="display: grid; gap: 0.5rem; min-width: 12rem;">
            <div>Overlay content</div>
            <Button label="Close" size="small" data-dropdown-close />
        </div>
    </Dropdown>
</template>
```

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

## Theming

- Override via `theme.overrides.components.dropdown`.

## Tokens

Component tokens (override via `theme.overrides.components.dropdown`):

- `panelPadding`, `panelBorderRadius`, `panelBorderColor`
- `panelBackgroundColor`, `panelShadow`, `zIndex`
- `disabledOpacity`, `itemPadding`

## Recipes

- Use `items` for conventional action menus and the default slot for custom layouts.
- Keep `closeOnSelect` enabled unless the overlay contains multi-step interactions.
- Prefer `matchTriggerWidth=true` for form-like popups and `false` for compact contextual menus.

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
