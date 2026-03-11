# Show / Hide

Show and Hide are breakpoint-aware rendering helpers for responsive visibility.

## Import

```ts
import { Show, Hide } from '@codemonster-ru/vueforge';
import { Show, Hide } from '@codemonster-ru/vueforge';
```

## Examples

### Show On Desktop

```vue
<Show from="md">
    <Toolbar />
</Show>
```

### Hide On Desktop

```vue
<Hide from="md">
    <Drawer model-value>
        Mobile-only navigation
    </Drawer>
</Hide>
```

### Bounded Range

```vue
<Show from="sm" to="lg">
    <TabletOnlyPanel />
</Show>
```

## API

### Shared Props

| Name   | Type                                        | Default     |
| ------ | ------------------------------------------- | ----------- |
| `as`   | `string`                                    | `'div'`     |
| `from` | `'sm' \| 'md' \| 'lg' \| 'xl' \| undefined` | `undefined` |
| `to`   | `'sm' \| 'md' \| 'lg' \| 'xl' \| undefined` | `undefined` |
| `when` | `boolean`                                   | `true`      |

### Breakpoints

- `sm = 640`
- `md = 768`
- `lg = 1024`
- `xl = 1280`

### Behavior

- `Show` renders only when `from <= width < to` within the provided range.
- `Hide` inverts the same range logic and suppresses content inside the matching window.

## Recipes

- Use Show and Hide for responsive-only fragments where CSS alone is not enough because the subtree should not render at all.
- Prefer CSS visibility helpers when render cost is low and you only need visual hiding.

## Accessibility

- Because these helpers add or remove DOM entirely, avoid using them for content that should remain available to assistive technology across breakpoints.
- Server output renders by default and final visibility is resolved after hydration using viewport width.
