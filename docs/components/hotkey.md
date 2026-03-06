# Hotkey

Hotkey is a scoped keyboard shortcut utility component backed by the `useHotkey` composable.

## Import

```ts
import Hotkey from '@/package/components/hotkey.vue';
import { useHotkey } from '@/package/components/use-hotkey';
```

## Examples

### Component Wrapper

Use the component when a shortcut should stay scoped to a subtree.

```vue
<Hotkey combo="mod+k" @trigger="openPalette">
    <div />
</Hotkey>
```

### Scoped Shortcut

Keep `scoped` enabled when the shortcut should only work while focus is inside the wrapper subtree.

```vue
<Hotkey combo="mod+enter" scoped @trigger="submitDraft">
    <FormEditor />
</Hotkey>
```

### Composable

Use `useHotkey` directly when no wrapper element is needed.

```ts
useHotkey({
    combo: 'mod+k',
    handler: () => openPalette(),
    enabled: true,
});
```

## API

### Component Props

| Name | Type | Default |
| --- | --- | --- |
| `combo` | `string \| string[]` | `'mod+k'` |
| `enabled` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `scoped` | `boolean` | `true` |
| `event` | `'keydown' \| 'keyup'` | `'keydown'` |
| `preventDefault` | `boolean` | `true` |
| `stopPropagation` | `boolean` | `false` |
| `ignoreInputs` | `boolean` | `true` |
| `allowInInputs` | `boolean` | `false` |
| `exact` | `boolean` | `true` |
| `as` | `string` | `'div'` |

### Component Events

| Name | Payload |
| --- | --- |
| `trigger` | `{ event, combo }` |

### Component Slots

| Name | Description |
| --- | --- |
| `default` | Scoped slot with `{ trigger }`. |

### Composable API

```ts
useHotkey({
    combo,
    handler,
    enabled,
    event,
    preventDefault,
    stopPropagation,
    ignoreInputs,
    allowInInputs,
    exact,
    target,
    scopeRef,
})
```

## Recipes

- Use Hotkey for command palettes, save actions, editor shortcuts, and local workspace commands.
- Prefer the composable when the shortcut belongs to a page or feature module rather than a specific render wrapper.

## Accessibility

- By default hotkeys ignore `input`, `textarea`, `select`, and `contenteditable` targets.
- Scoped mode prevents shortcuts from leaking outside the intended interactive region.

