# Scheduler

Scheduler renders resource timelines for bookings, planning, and dispatch-style workflows.

## Import

```ts
import Scheduler from '@/package/components/scheduler.vue';
```

## Examples

### Basic

Use `Scheduler` for room booking, support rotations, or equipment planning.

```vue
<Scheduler
    v-model="selectedEventId"
    :resources="rooms"
    :events="bookings"
    @event-click="openBooking"
/>
```

### Slot Creation

Listen to `slot-click` when empty time slots should open a creation flow.

```vue
<Scheduler
    v-model="selectedEventId"
    :resources="rooms"
    :events="bookings"
    :start-hour="8"
    :end-hour="18"
    :slot-minutes="30"
    @slot-click="openCreateDialog"
/>
```

### Readonly Timeline

Use `readonly` when the schedule is inspectable but should not create new items from slots.

```vue
<Scheduler
    :resources="rooms"
    :events="bookings"
    readonly
/>
```

## API

### Types

```ts
interface SchedulerResource {
    id: string | number;
    label: string;
    meta?: string;
}

interface SchedulerEvent {
    id: string | number;
    resourceId: string | number;
    title: string;
    start: string | number;
    end: string | number;
    color?: string;
    disabled?: boolean;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `resources` | `SchedulerResource[]` | `[]` |
| `events` | `SchedulerEvent[]` | `[]` |
| `modelValue` | `string \| number \| null` | `null` |
| `title` | `string` | `'Scheduler'` |
| `startHour` | `number` | `8` |
| `endHour` | `number` | `20` |
| `slotMinutes` | `number` | `30` |
| `locale` | `string` | `'en'` |
| `timeZone` | `string \| undefined` | `undefined` |
| `disabled` | `boolean` | `false` |
| `readonly` | `boolean` | `false` |
| `ariaLabel` | `string` | `'Scheduler timeline'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `string \| number \| null` |
| `eventClick` | `SchedulerEvent` |
| `slotClick` | `{ resourceId, start, end }` |

## Theming

Override component tokens through `theme.overrides.components.scheduler`.

## Tokens

- Surface and header: `gap`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `padding`, `title*`, `subtitle*`
- Grid sizing: `resourceWidth`, `minTimelineWidth`, `minGridWidth`, `gridGap`, `slotMinWidth`
- Head and rows: `head*`, `dividerColor`, `rowBorderRadius`, `resource*`, `track*`, `slotHeight`, `slotHoverBackgroundColor`
- Events: `eventHeight`, `eventBackgroundColor`, `eventTextColor`, `eventBorderColor`, `eventBorderRadius`, `eventPadding`, `eventFontSize`, `eventTitleFontWeight`, `eventTimeFontSize`, `eventSelectedOutlineColor`

## Recipes

- Use `slotMinutes` to reflect the actual scheduling granularity of the domain, not just a UI preference.
- Keep `readonly` for reporting or calendar-inspection surfaces that should not imply editability.

## Accessibility

- Empty slots and events are rendered as buttons, so scheduling interactions stay keyboard reachable.
- Resource labels remain visible alongside the timeline to preserve context while scanning horizontally.
