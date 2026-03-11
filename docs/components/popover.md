# Popover

Display contextual overlay content anchored to a trigger without blocking the whole page.

## Import

```ts
import { Popover } from '@codemonster-ru/vueforge';
```

## Examples

Use `Popover` for short contextual tasks and richer helper content that should stay attached to a trigger.

### Basic

Use the default slot for compact informational content.

```vue
<template>
    <Popover placement="bottom-start" :offset="10">
        <template #button>
            <Button label="Open popover" />
        </template>
        <template #default> Popover content </template>
    </Popover>
</template>
```

### Structured Content

Use header/body/footer slots when the popover needs a small card-like structure.

```vue
<template>
    <Popover>
        <template #button>
            <Button label="Project info" variant="outlined" />
        </template>
        <template #header>Workspace notice</template>
        <template #body> New teammates can view dashboards immediately. </template>
        <template #footer>
            <Button label="Dismiss" size="small" />
        </template>
    </Popover>
</template>
```

### Controlled State

Use `v-model` when visible state must stay coordinated with surrounding UI.

```vue
<template>
    <Popover v-model="open">
        <template #button>
            <Button label="Controlled popover" />
        </template>
        <template #default> Controlled overlay content </template>
    </Popover>
</template>
```

### Dismiss Policy

Disable outside click dismissal when the content contains a task that should not close accidentally.

```vue
<template>
    <Popover :close-on-outside="false">
        <template #button>
            <Button label="Review changes" />
        </template>
        <template #default> Confirm the values before closing this card. </template>
    </Popover>
</template>
```

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

## Theming

- Override via `theme.overrides.components.popover`.

## Tokens

Override via `theme.overrides.components.popover`:

- `borderRadius`, `borderColor`, `backgroundColor`, `shadow`, `zIndex`

## Recipes

- Use popovers for contextual help, compact review cards, and lightweight anchored actions.
- Prefer `Modal` when the task is blocking and `Tooltip` when the content is purely supplemental.
- Keep popover bodies concise; once the content becomes a full workflow, move it to a drawer or modal.

## Accessibility

- Trigger uses button semantics and exposes `aria-expanded` / `aria-controls`.
- Supports `Escape` dismiss when `closeOnEsc` is enabled.
- Restores focus to the previously active element on dismiss.
- If popover contains interactive controls, ensure keyboard focus order is logical.
