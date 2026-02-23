# SpeedDial

## Purpose

Provide a floating action menu pattern for quick, high-priority actions in app shells and dense management interfaces.

## Props

- `modelValue?: boolean` (default `false`)
- `actions?: Array<SpeedDialAction>`
- `direction?: 'up' | 'down' | 'left' | 'right'` (default `up`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Speed dial actions`)
- `openLabel?: string` (default `Open actions`)
- `closeLabel?: string` (default `Close actions`)
- `closeOnAction?: boolean` (default `true`)
- `closeOnOutsideClick?: boolean` (default `true`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

## Events

- `update:modelValue`
- `toggle` (`boolean`)
- `action` (`{ action, index, value }`)

## Slots

- `trigger` - custom trigger content (`{ open }`)
- `action` - custom action content (`{ action, index }`)

## Examples

```vue
<SpeedDial
    v-model="open"
    :actions="[
        { label: 'Create task', value: 'create' },
        { label: 'Invite member', value: 'invite' },
        { label: 'Export', value: 'export' },
    ]"
    @action="onQuickAction"
/>
```

```vue
<SpeedDial v-model="open" :actions="actions" direction="left">
    <template #trigger="{ open }">{{ open ? 'Close' : 'Quick' }}</template>
</SpeedDial>
```

## Theming

- Override via `theme.overrides.components.speeddial`.

## Tokens

- `gap`, `zIndex`, `offsetX`, `offsetY`, `offsetXMobile`, `offsetYMobile`
- `transitionDuration`, `transitionEasing`
- `triggerSize`, `triggerPaddingX`, `triggerBorderRadius`, `triggerBorderColor`, `triggerBackgroundColor`, `triggerTextColor`, `triggerShadow`
- `actionSize`, `actionPaddingX`, `actionBorderRadius`, `actionBorderColor`, `actionBackgroundColor`, `actionTextColor`, `actionShadow`
- `labelBackgroundColor`, `labelTextColor`, `labelPadding`
- `focusRingShadow`, `focusBorderColor`, `disabledOpacity`

## Recipes

- Floating create menu for dashboards with secondary actions (`create`, `import`, `invite`).
- Context quick-actions for mobile where top-bar buttons are limited.

## Accessibility

- Trigger exposes `aria-haspopup="menu"` and `aria-expanded`.
- Actions render as `menuitem` controls in a `role="menu"` container.
- Keyboard support includes `Enter/Space` toggle on trigger and `Arrow`, `Home/End`, `Escape` inside action list.

## Responsive

- Component is fixed-position and uses mobile offsets on narrow screens.
- Prefer concise action labels to keep floating menu compact on phones.

## SSR/Hydration

- Closed/open state is deterministic from `modelValue`.
- Outside-click behavior is bound on client only and does not affect SSR output.

## Testing

- Cover toggle behavior, action emission payload, keyboard navigation, and outside-click close behavior.
- Assert ARIA menu semantics for trigger and action list.
