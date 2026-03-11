# SlideGroup

SlideGroup provides a horizontally scrollable selection group for filters, tabs, and chip-like navigation.

## Import

```ts
import { SlideGroup } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use `SlideGroup` when navigation items should stay horizontally scrollable on narrow screens.

```vue
<SlideGroup v-model="filter" :items="filters" />
```

### Custom Item Content

Use the `item` slot when each choice needs badges, icons, or richer layout.

```vue
<SlideGroup v-model="filter" :items="filters">
    <template #item="{ item, active }">
        <span>{{ item.label }} {{ active ? '(active)' : '' }}</span>
    </template>
</SlideGroup>
```

### Hidden Controls

Disable visible scroll controls when the surface already has enough horizontal affordance.

```vue
<SlideGroup v-model="filter" :items="filters" :show-controls="false" />
```

## API

### Types

```ts
interface SlideGroupItem {
    key?: string | number;
    label: string;
    value: string | number;
    disabled?: boolean;
}
```

### Props

| Name           | Type                       | Default          |
| -------------- | -------------------------- | ---------------- |
| `modelValue`   | `string \| number \| null` | `null`           |
| `items`        | `SlideGroupItem[]`         | `[]`             |
| `disabled`     | `boolean`                  | `false`          |
| `showControls` | `boolean`                  | `true`           |
| `scrollStep`   | `number`                   | `180`            |
| `snap`         | `boolean`                  | `true`           |
| `ariaLabel`    | `string`                   | `'Slide group'`  |
| `prevLabel`    | `string`                   | `'Scroll left'`  |
| `nextLabel`    | `string`                   | `'Scroll right'` |

### Events

| Name                | Payload                             |
| ------------------- | ----------------------------------- |
| `update:modelValue` | `string \| number`                  |
| `change`            | `(value, item, index, sourceEvent)` |

### Slots

| Name   | Description                                           |
| ------ | ----------------------------------------------------- |
| `item` | Custom item rendering with `{ item, index, active }`. |
| `prev` | Replaces the previous control content.                |
| `next` | Replaces the next control content.                    |

## Theming

Override component tokens through `theme.overrides.components.slideGroup`.

## Tokens

- Layout and controls: `gap`, `controlsGap`, `controlSize`, `controlRadius`, `controlBorderColor`, `controlBackgroundColor`, `controlTextColor`, `controlHoverBackgroundColor`
- Items: `itemPadding`, `itemBorderRadius`, `itemBorderColor`, `itemBackgroundColor`, `itemTextColor`, `itemHoverBackgroundColor`, `itemActiveBackgroundColor`, `itemActiveTextColor`, `itemActiveBorderColor`
- States: `disabledOpacity`

## Recipes

- Use `SlideGroup` for selection patterns with many short labels, not for long-form tab panels with heavy content below.
- Keep item labels short so horizontal scrolling stays an enhancement rather than a necessity.

## Accessibility

- Keyboard navigation supports arrow keys plus `Home` and `End`.
- The viewport exposes a group label through `ariaLabel`.
