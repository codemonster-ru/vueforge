# RichTextEditor

## Purpose

Provide advanced task-focused interactions for authoring, media/input control, and guided workflows.
Enable product features that require richer interaction than basic form controls.

## Props

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `format?: 'markdown' | 'html'` (default `markdown`)
- `rows?: number` (default `6`)
- `maxLength?: number` (default `0`, disabled when `0`)
- `showToolbar?: boolean` (default `true`)
- `toolbar?: Array<'bold' | 'italic' | 'underline' | 'link' | 'bulletList' | 'orderedList' | 'code'>`
- `toolbarLabel?: string` (default `Text formatting toolbar`)
- `ariaLabel?: string` (default `Rich text editor`)

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`
- `action` (payload: `action`, `nextValue`)

## Slots

- This component does not expose named slots.

## Examples

```vue
<RichTextEditor
    v-model="article"
    format="markdown"
    :rows="8"
    :max-length="2000"
    :toolbar="['bold', 'italic', 'link', 'bulletList', 'code']"
/>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Verify control affordances, panel sizing, and gesture/mouse interactions across device classes.
Ensure compact layouts preserve clarity for actions, handles, and contextual hints.

## SSR/Hydration

Keep initial value and panel-closed/base state stable between server and client output.
Hydrate client-only interaction engines (editor, drag, command layers) without DOM mismatch.

## Testing

Cover core interaction loops, boundary conditions, and value/state synchronization.
Add accessibility tests for keyboard alternatives, labelling, and focus behavior.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
