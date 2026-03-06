# Hover

Hover exposes hover and focus interaction state with keyboard parity and optional controlled mode.

## Import

```ts
import Hover from '@/package/components/hover.vue';
```

## Examples

### Basic

```vue
<Hover v-slot="{ active }">
    <Card :class="{ 'is-elevated': active }">
        Hover or focus me
    </Card>
</Hover>
```

### Controlled State

```vue
<Hover v-model="active" :open-delay="80" :close-delay="120">
    <template #default="{ active }">
        <TooltipLikeCard :active="active" />
    </template>
</Hover>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `as` | `string` | `'div'` |
| `modelValue` | `boolean \| undefined` | `undefined` |
| `disabled` | `boolean` | `false` |
| `openDelay` | `number` | `0` |
| `closeDelay` | `number` | `0` |
| `ariaLabel` | `string` | `''` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `boolean` |
| `change` | `boolean` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Scoped slot with `{ hovered, focused, active }`. |

## Theming

Override component tokens through `theme.overrides.components.hover`.

## Tokens

- `disabledOpacity`

## Recipes

- Use Hover to drive lightweight reveal states, elevated surfaces, and keyboard-parity hover affordances.
- Prefer explicit state components when the interaction is semantically closer to disclosure than hover.

## Accessibility

- Focus enters the same active lifecycle as pointer hover, so keyboard users receive the same affordances.
- Disabled state clears internal hover state and suppresses delayed activation.

