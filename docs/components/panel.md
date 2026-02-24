# Panel

## Purpose

Group related content with optional heading actions and collapsible body.

## Props

- `modelValue?: boolean` (default `true`) - expanded state (`v-model`)
- `title?: string`
- `subtitle?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `collapsible?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `actionsAriaLabel?: string` (default `Panel actions`)
- `expandLabel?: string` (default `Expand`)
- `collapseLabel?: string` (default `Collapse`)

## Events

- `update:modelValue`
- `toggle` (payload: `boolean`, `event`)

## Slots

- `default`
- `header`
- `title`
- `subtitle`
- `actions`
- `footer`

## Example

```vue
<Panel v-model="open" title="Project Summary" subtitle="Sprint 12" collapsible>
    <template #actions>
        <Button size="small">Edit</Button>
        <Button size="small" variant="outlined">Share</Button>
    </template>

    <p>Delivery status and risks for current sprint.</p>

    <template #footer>
        <small>Last updated 5 min ago</small>
    </template>
</Panel>
```

## Theming

- Override via `theme.overrides.components.panel`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `headerPadding`, `bodyPadding`, `footerPadding`, `footerBorderColor`, `headerGap`
- `titleFontSize`, `titleFontWeight`, `subtitleFontSize`, `subtitleColor`
- `actionsGap`
- `toggleSize`, `toggleRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`, `toggleHoverBackgroundColor`
- `disabledOpacity`
- `small.padding`, `small.titleFontSize`
- `large.padding`, `large.titleFontSize`

## Accessibility

- Action area uses `role="group"` for grouped controls.
- Collapse button exposes `aria-expanded` and `aria-controls`.

## Testing

- Cover toggle emit/state behavior and actions group rendering.
