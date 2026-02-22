# SplitButton

## Purpose

Provide advanced task-focused interactions for authoring, media/input control, and guided workflows.
Enable product features that require richer interaction than basic form controls.

## Props

- `modelValue?: boolean` (dropdown open state)
- `items?: Array<SplitButtonItem>`
- `label?: string`
- `icon?: string`
- `type?: 'button' | 'submit' | 'reset'` (default `button`)
- `size?: 'small' | 'normal' | 'large'`
- `variant?: 'filled' | 'outlined' | 'text'`
- `severity?: string`
- `disabled?: boolean` (default `false`)
- `loading?: boolean` (default `false`)
- `placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom' | 'top'`
- `offset?: number` (default `6`)
- `closeOnSelect?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `matchTriggerWidth?: boolean` (default `true`)
- `toggleAriaLabel?: string` (default `Toggle actions`)

`SplitButtonItem` supports:

- `label?: string`
- `to?: string`
- `href?: string`
- `url?: string`
- `icon?: string`
- `active?: boolean`
- `disabled?: boolean`
- `separator?: boolean`
- `command?: () => void`

## Events

- `click` (primary action)
- `update:modelValue`
- `open`
- `close`
- `select`

## Slots

- `default` (primary button content)
- `menu` (custom dropdown content)

## Examples

```vue
<SplitButton
    label="Save"
    :items="[
        { label: 'Save draft', command: saveDraft },
        { label: 'Save and publish', command: publish },
    ]"
    @click="save"
/>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Override via `theme.overrides.components.splitbutton`.

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
