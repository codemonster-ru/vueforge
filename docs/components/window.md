# Window

## Purpose

Stateful pager container for switching between content panes with keyboard and transition support.

## Props

- `modelValue?: string | number | null`
- `items?: Array<WindowItem>`
- `loop?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `showControls?: boolean` (default `true`)
- `keyboard?: boolean` (default `true`)
- `transition?: 'slide-horizontal' | 'slide-vertical' | 'fade' | 'none'` (default `slide-horizontal`)
- `ariaLabel?: string` (default `Window`)
- `controlsAriaLabel?: string` (default `Window controls`)
- `prevLabel?: string` (default `Previous`)
- `nextLabel?: string` (default `Next`)

## Events

- `update:modelValue`
- `change`
- `prev`
- `next`

## Slots

- `item` (scoped: `{ item, index, value }`)
- `controls` (scoped: `{ index, item, canPrev, canNext, prev, next }`)
- `default` (fallback body when `item` slot is omitted)

## Example

```vue
<Window v-model="step" :items="steps" :loop="false">
    <template #item="{ value }">
        <div v-if="value === 'profile'">Profile pane</div>
        <div v-else-if="value === 'billing'">Billing pane</div>
        <div v-else>Confirm pane</div>
    </template>
</Window>
```

## Tokens

Component tokens (override via `theme.overrides.components.window`):

- `gap`, `padding`, `minHeight`
- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `controlsGap`
- `controlPadding`, `controlRadius`
- `controlBorderColor`, `controlBackgroundColor`, `controlTextColor`
- `controlHoverBackgroundColor`
- `transitionDuration`, `transitionTiming`
- `disabledOpacity`

## Accessibility

- Uses `region` semantics and keyboard pane navigation.
- Keyboard support: `ArrowLeft/ArrowRight`, `PageUp/PageDown`, `Home/End`.
