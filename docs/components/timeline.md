# Timeline

## Props

- `items?: Array<{ id?: string | number; title?: string; description?: string; date?: string; icon?: string; status?: 'neutral' | 'info' | 'success' | 'warn' | 'danger' }>` (default `[]`)
- `orientation?: 'vertical' | 'horizontal'` (default `vertical`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## Events

- This component does not emit component-specific events.

## Slots

- `marker` (props: `item`, `index`)
- `item` (props: `item`, `index`)

## Examples

```vue
<Timeline
    :items="[
        { title: 'Created', description: 'Issue created', date: '2026-02-17', status: 'info' },
        { title: 'In progress', description: 'Developer started work', date: '2026-02-18', status: 'warn' },
        { title: 'Done', description: 'Issue closed', date: '2026-02-19', status: 'success' },
    ]"
/>
<Timeline :items="events" orientation="horizontal" size="small" />
```

## Tokens

Component tokens (override via `theme.overrides.components.timeline`):

- `gap`, `itemGap`
- `markerSize`, `markerBorderRadius`, `markerBorderWidth`, `markerBackgroundColor`, `markerBorderColor`, `markerTextColor`, `markerIconSize`, `dotSize`
- `lineThickness`, `lineLength`, `lineColor`
- `titleFontSize`, `titleColor`, `descriptionFontSize`, `descriptionColor`, `dateFontSize`, `dateColor`
- `info.markerBackgroundColor`, `info.markerBorderColor`, `info.markerTextColor`, `info.lineColor`
- `success.markerBackgroundColor`, `success.markerBorderColor`, `success.markerTextColor`, `success.lineColor`
- `warn.markerBackgroundColor`, `warn.markerBorderColor`, `warn.markerTextColor`, `warn.lineColor`
- `danger.markerBackgroundColor`, `danger.markerBorderColor`, `danger.markerTextColor`, `danger.lineColor`
- `small.itemGap`, `small.markerSize`, `small.markerIconSize`, `small.dotSize`, `small.lineLength`, `small.dateFontSize`, `small.titleFontSize`, `small.descriptionFontSize`
- `large.itemGap`, `large.markerSize`, `large.markerIconSize`, `large.dotSize`, `large.lineLength`, `large.dateFontSize`, `large.titleFontSize`, `large.descriptionFontSize`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
