# Inplace

Switch a small region from display mode into inline editing without opening a dialog or drawer.

## Import

```ts
import { Inplace } from '@codemonster-ru/vueforge';
```

## Examples

Use `Inplace` when editing should stay embedded in the current layout and not interrupt surrounding context.

### Basic

Use display and content slots to toggle a simple editable region.

```vue
<template>
    <Inplace v-model="editing">
        <template #display>
            <button type="button">Edit profile bio</button>
        </template>
        <template #content>
            <textarea v-model="bio" rows="3" />
        </template>
    </Inplace>
</template>
```

### Custom Actions

Use the `actions` slot when the active state needs custom buttons.

```vue
<template>
    <Inplace :model-value="true">
        <template #content>
            <Input model-value="Workspace name" />
        </template>
        <template #actions="{ close }">
            <Button size="small" variant="outlined" @click="close()">Done</Button>
        </template>
    </Inplace>
</template>
```

### Default Content Fallback

Use `contentText` or the default slot for quick inline display-to-edit blocks.

```vue
<template>
    <Inplace content-text="Editable content" />
</template>
```

## Props

- `modelValue?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `closeOnEscape?: boolean` (default `true`)
- `closeOnOutsideClick?: boolean` (default `true`)
- `contentText?: string` (default `Editable content`)
- `editLabel?: string` (default `Edit`)
- `closeLabel?: string` (default `Close`)
- `ariaLabel?: string` (default `Inplace editor`)

## Events

- `update:modelValue`
- `open`
- `close`
- `toggle`

## Slots

- `display`
- `content`
- `actions` with `{ close }`
- `default`

## Theming

- Override via `theme.overrides.components.inplace`.

## Tokens

Component tokens (override via `theme.overrides.components.inplace`):

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `padding`, `contentPadding`, `actionsGap`
- `buttonPadding`, `buttonRadius`
- `buttonBorderColor`, `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `focusRingShadow`, `disabledOpacity`

## Recipes

- Use `Inplace` for small contextual edits inside cards, rows, and summaries.
- Prefer dialogs when editing needs more space, validation, or multi-step flow.
- Keep the display trigger keyboard-accessible; a real button is the safest default.

## Accessibility

- Active content uses a grouped inline editing region.
- `Escape` close behavior is available when enabled.
- Outside-click closing is client-only behavior and should not hide essential unsaved state unexpectedly.
