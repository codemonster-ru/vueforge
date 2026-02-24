# Inplace

## Purpose

Provide a display-to-edit container that toggles inline content without opening overlays.

## Props

- `modelValue?: boolean` (v-model active state, default `false`)
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

- `display` inactive renderer (trigger state)
- `content` active inline content
- `actions` action area (`{ close }` slot prop)
- default slot fallback for content body

## Examples

```vue
<Inplace v-model="editing">
    <template #display>
        <button type="button">Edit profile bio</button>
    </template>
    <template #content>
        <textarea v-model="bio" rows="3" />
    </template>
</Inplace>
```

## Theming

- Override via `theme.overrides.components.inplace`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `padding`, `contentPadding`, `actionsGap`
- `buttonPadding`, `buttonRadius`
- `buttonBorderColor`, `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `focusRingShadow`, `disabledOpacity`

## Recipes

- Inline rename/edit blocks in table rows.
- Editable profile fields inside cards and settings forms.

## Accessibility

- Active state content uses `role="group"` and keyboard `Escape` close behavior.
- Keep custom `display` slot trigger keyboard-accessible (`button` preferred).

## Responsive

- Best used in narrow layouts where dialogs feel heavy.
- Keep actions compact on mobile and avoid multi-line action labels.

## SSR/Hydration

- Server render is deterministic from `modelValue`.
- Outside-click and keyboard listeners are attached only on client.

## Testing

- Cover toggle lifecycle events, `Escape` close behavior, outside click close, and disabled guards.
