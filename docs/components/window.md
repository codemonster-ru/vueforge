# Window

Window is a stateful pane switcher for stepped content, feature tours, and compact paged regions with built-in keyboard navigation.

## Import

```ts
import Window from '@/package/components/window.vue';
```

## Examples

### Basic

Pass `items` and bind `v-model` to control the active pane.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const step = ref('profile');
const steps = [
    { value: 'profile', label: 'Profile' },
    { value: 'billing', label: 'Billing' },
    { value: 'confirm', label: 'Confirm' },
];
</script>

<template>
    <Window v-model="step" :items="steps" :loop="false">
        <template #item="{ value }">
            <div v-if="value === 'profile'">Profile pane</div>
            <div v-else-if="value === 'billing'">Billing pane</div>
            <div v-else>Confirm pane</div>
        </template>
    </Window>
</template>
```

### Custom Controls

Override the controls slot when the window should use design-system buttons or richer navigation chrome.

```vue
<Window v-model="step" :items="steps">
    <template #controls="{ canPrev, canNext, prev, next }">
        <Inline gap="sm">
            <Button size="sm" variant="outlined" :disabled="!canPrev" @click="prev">
                Back
            </Button>
            <Button size="sm" :disabled="!canNext" @click="next">
                Continue
            </Button>
        </Inline>
    </template>

    <template #item="{ value }">
        <StepContent :step="value" />
    </template>
</Window>
```

### Transition Modes

Switch transitions to match the mental model of the content.

```vue
<Window v-model="active" :items="views" transition="fade" />
```

### Controlled Navigation

Disable looping when the pane sequence represents a bounded workflow.

```vue
<Window
    v-model="active"
    :items="views"
    :loop="false"
    prev-label="Previous step"
    next-label="Next step"
/>
```

## API

### Types

```ts
type WindowValue = string | number;

interface WindowItem {
    value: WindowValue;
    label?: string;
    disabled?: boolean;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `string \| number \| null` | `null` |
| `items` | `WindowItem[]` | `[]` |
| `loop` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `showControls` | `boolean` | `true` |
| `keyboard` | `boolean` | `true` |
| `transition` | `'slide-horizontal' \| 'slide-vertical' \| 'fade' \| 'none'` | `'slide-horizontal'` |
| `ariaLabel` | `string` | `'Window'` |
| `controlsAriaLabel` | `string` | `'Window controls'` |
| `prevLabel` | `string` | `'Previous'` |
| `nextLabel` | `string` | `'Next'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `WindowValue` |
| `change` | `{ value, item, index, direction }` |
| `prev` | `{ value, item, index }` |
| `next` | `{ value, item, index }` |

### Slots

| Name | Description |
| --- | --- |
| `item` | Custom pane rendering with `{ item, index, value }`. |
| `controls` | Custom controls with `{ index, item, canPrev, canNext, prev, next }`. |
| `default` | Fallback content when `item` is omitted. |

## Theming

Override component tokens through `theme.overrides.components.window`.

## Tokens

- Layout: `gap`, `padding`, `minHeight`
- Surface: `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- Controls: `controlsGap`, `controlPadding`, `controlRadius`, `controlBorderColor`, `controlBackgroundColor`, `controlTextColor`, `controlHoverBackgroundColor`
- Motion and states: `transitionDuration`, `transitionTiming`, `disabledOpacity`

## Recipes

- Use Window for lightweight stepped flows, settings panes, and embedded tutorials.
- Prefer `Tabs` when users need direct random access to labeled sections rather than next/previous navigation.

## Accessibility

- Window renders a focusable `region` and supports `ArrowLeft`, `ArrowRight`, `PageUp`, `PageDown`, `Home`, and `End`.
- Disabled items are skipped by the internal navigation logic.

