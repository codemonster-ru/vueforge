# EmptyState

## Props

- `title?: string`
- `description?: string`
- `icon?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- This component does not emit component-specific events.

## Slots

- `default` - description content (fallbacks to `description`)
- `title` (optional)
- `icon` (optional)
- `actions` (optional)

## Examples

```vue
<EmptyState title="No projects yet" description="Create your first project to get started." icon="📂">
    <template #actions>
        <Button label="Create project" size="small" />
        <Button label="Import" size="small" severity="secondary" />
    </template>
</EmptyState>
```

## Tokens

Component tokens (override via `theme.overrides.components.emptyState`):

- `gap`, `bodyGap`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`, `maxWidth`
- `iconSize`, `iconColor`
- `titleFontSize`, `titleLineHeight`, `titleFontWeight`, `titleColor`
- `descriptionFontSize`, `descriptionLineHeight`, `descriptionColor`
- `actionsGap`
- `small.padding`, `small.iconSize`, `small.titleFontSize`, `small.descriptionFontSize`
- `large.padding`, `large.iconSize`, `large.titleFontSize`, `large.descriptionFontSize`


Component tokens (override via `theme.overrides.components.textarea`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `minHeight`, `resize`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`


Component tokens (override via `theme.overrides.components.richTextEditor`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `minHeight`, `resize`
- `toolbarGap`, `toolbarPadding`, `toolbarBorderColor`, `toolbarBackgroundColor`
- `toolbarButtonMinWidth`, `toolbarButtonPadding`, `toolbarButtonRadius`
- `toolbarButtonBorderColor`, `toolbarButtonBackgroundColor`, `toolbarButtonTextColor`
- `toolbarButtonHoverBackgroundColor`, `toolbarButtonActiveBackgroundColor`
- `counterFontSize`, `counterColor`, `counterDangerColor`
- `small.fontSize`, `small.padding`, `small.toolbarButtonPadding`
- `large.fontSize`, `large.padding`, `large.toolbarButtonPadding`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
