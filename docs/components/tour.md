# Tour

Tour guides users through targeted UI steps with spotlighting, anchored positioning, progress, and explicit skip or complete flows.

## Import

```ts
import Tour from '@/package/components/tour.vue';
```

## Examples

### Basic

Use Tour for first-run onboarding and guided feature discovery.

```vue
<Tour
    v-model="tourOpen"
    :steps="[
        { target: '#tour-start', title: 'Start', content: 'Launch onboarding here.' },
        { target: '#tour-search', title: 'Search', content: 'Find projects quickly.', placement: 'bottom' },
    ]"
/>
```

### Per-Step Placement

Override placement or offset for individual steps when targets need different anchoring.

```vue
<Tour
    v-model="tourOpen"
    :steps="[
        { target: '#nav', title: 'Navigation', content: 'Primary workspace links.', placement: 'right' },
        { target: '#filters', title: 'Filters', content: 'Refine the list.', placement: 'bottom', offset: 16 },
    ]"
/>
```

### Custom Content

Use slots when the panel needs richer markup or product-specific actions.

```vue
<Tour v-model="tourOpen" :steps="steps">
    <template #title="{ step }">
        <strong>{{ step?.title }}</strong>
    </template>

    <template #default="{ step, index }">
        <div>
            <p>{{ step?.content }}</p>
            <small>Step {{ index + 1 }}</small>
        </div>
    </template>
</Tour>
```

### Custom Actions

Use the `actions` slot when the tour should integrate with your own button primitives or analytics hooks.

```vue
<Tour v-model="tourOpen" :steps="steps">
    <template #actions="{ isFirst, isLast, prev, next, skip }">
        <Inline gap="sm">
            <Button size="sm" variant="text" @click="skip">Skip</Button>
            <Button size="sm" variant="outlined" :disabled="isFirst" @click="prev">Back</Button>
            <Button size="sm" @click="next">{{ isLast ? 'Finish' : 'Next' }}</Button>
        </Inline>
    </template>
</Tour>
```

## API

### Types

```ts
type Placement = 'top' | 'bottom' | 'left' | 'right';

interface TourStep {
    target?: string | HTMLElement;
    title?: string;
    content?: string;
    placement?: Placement;
    offset?: number;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `boolean` | `false` |
| `steps` | `TourStep[]` | `[]` |
| `startIndex` | `number` | `0` |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` |
| `offset` | `number` | `10` |
| `mask` | `boolean` | `true` |
| `closeOnOverlay` | `boolean` | `true` |
| `closeOnEsc` | `boolean` | `true` |
| `showSkip` | `boolean` | `true` |
| `showProgress` | `boolean` | `true` |
| `spotlightPadding` | `number` | `6` |
| `nextLabel` | `string` | `'Next'` |
| `prevLabel` | `string` | `'Back'` |
| `finishLabel` | `string` | `'Finish'` |
| `skipLabel` | `string` | `'Skip'` |
| `ariaLabel` | `string` | `'Tour'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `boolean` |
| `open` | none |
| `close` | `reason: 'overlay' \| 'esc' \| 'complete' \| 'skip'` |
| `stepChange` | `index, step` |
| `next` | `index, step` |
| `prev` | `index, step` |
| `complete` | current step |
| `skip` | current step |

### Slots

| Name | Description |
| --- | --- |
| `default` | Step content with `{ step, index }`. |
| `title` | Step title with `{ step, index }`. |
| `actions` | Custom controls with `{ step, index, isFirst, isLast, prev, next, skip }`. |

## Theming

Override component tokens through `theme.overrides.components.tour`.

## Tokens

- Layering and panel: `zIndex`, `overlayBackgroundColor`, `width`, `maxWidth`, `padding`, `borderRadius`, `borderColor`, `backgroundColor`, `textColor`, `shadow`
- Title and content: `titleGap`, `titleFontSize`, `titleLineHeight`, `titleFontWeight`, `contentGap`, `contentFontSize`, `contentLineHeight`, `contentColor`
- Progress and actions: `progressGap`, `progressFontSize`, `progressColor`, `actionsGap`
- Buttons: `buttonMinWidth`, `buttonPadding`, `buttonRadius`, `buttonBorderColor`, `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`, `secondaryButtonBorderColor`, `secondaryButtonBackgroundColor`, `secondaryButtonTextColor`, `secondaryButtonHoverBackgroundColor`
- Spotlight and state: `spotlightRadius`, `spotlightBorderWidth`, `spotlightBorderColor`, `disabledOpacity`

## Recipes

- Use Tour for first-run walkthroughs, feature announcements, and contextual training overlays.
- Prefer lightweight inline hints or `Popover` when users only need one contextual explanation rather than a multi-step flow.

## Accessibility

- Tour renders a `dialog` with `aria-modal="true"` and restores focus on close.
- `Escape` dismissal and overlay dismissal are configurable.
- Spotlighted positioning updates as the target moves or the viewport resizes.

