# Scheduler

## Purpose

Render resource timeline schedules for time-slot planning, booking, and operations dispatch flows.

## Props

- `resources?: Array<SchedulerResource>` (default `[]`)
- `events?: Array<SchedulerEvent>` (default `[]`)
- `modelValue?: string | number | null` (selected event id)
- `title?: string` (default `Scheduler`)
- `startHour?: number` (default `8`)
- `endHour?: number` (default `20`)
- `slotMinutes?: number` (default `30`)
- `locale?: string` (default `en`)
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `ariaLabel?: string` (default `Scheduler timeline`)

`SchedulerResource`:

- `id: string | number`
- `label: string`
- `meta?: string`

`SchedulerEvent`:

- `id: string | number`
- `resourceId: string | number`
- `title: string`
- `start: string | number` (`HH:mm` or absolute minutes)
- `end: string | number` (`HH:mm` or absolute minutes)
- `color?: string`
- `disabled?: boolean`

## Events

- `update:modelValue`
- `eventClick(event)`
- `slotClick({ resourceId, start, end })`

## Slots

- N/A

## Examples

```vue
<Scheduler
    v-model="selectedEventId"
    :resources="rooms"
    :events="bookings"
    :start-hour="8"
    :end-hour="18"
    :slot-minutes="30"
    @slotClick="openCreateDialog"
/>
```

## Theming

- Override via `theme.overrides.components.scheduler`.

## Tokens

- Surface/layout: `gap`, `padding`, `border*`, `backgroundColor`, `textColor`
- Header/title: `title*`, `subtitle*`, `head*`
- Grid sizing: `resourceWidth`, `minTimelineWidth`, `minGridWidth`, `gridGap`, `slotMinWidth`
- Rows/resources: `rowBorderRadius`, `resource*`, `track*`, `dividerColor`
- Slots/events: `slotHeight`, `slotHoverBackgroundColor`, `event*`

## Recipes

- Room booking timeline with click-to-create slot interactions.
- Team shift planning with overlapping assignments and lane stacking.

## Accessibility

- Timeline uses list/grid-like structure with labeled slot buttons and event buttons.
- `slotClick` and `eventClick` are keyboard reachable via native buttons.

## Responsive

- Timeline supports horizontal scroll in narrow layouts while preserving resource column.

## SSR/Hydration

- Deterministic layout from props; no client-only random identifiers.

## Testing

- Cover slot click payloads, event selection, overlap lane rendering, and timeline range generation.
