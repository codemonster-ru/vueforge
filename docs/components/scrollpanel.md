# ScrollPanel

ScrollPanel provides a styled scrollable container for logs, side panels, and long inline content.

## Import

```ts
import { ScrollPanel } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use `ScrollPanel` when a section needs its own bounded scroll area.

```vue
<ScrollPanel height="18rem" aria-label="Deployment logs">
    <pre>{{ logs }}</pre>
</ScrollPanel>
```

### Constrained Range

Use `min-height` and `max-height` when the container should grow within limits.

```vue
<ScrollPanel min-height="12rem" max-height="24rem">
    ...
</ScrollPanel>
```

### Always Visible Scrollbars

Enable `always-show` where discoverability of overflow matters more than minimal chrome.

```vue
<ScrollPanel height="16rem" always-show>
    ...
</ScrollPanel>
```

## API

### Props

| Name         | Type                  | Default               |
| ------------ | --------------------- | --------------------- |
| `height`     | `string`              | `'16rem'`             |
| `minHeight`  | `string \| undefined` | `undefined`           |
| `maxHeight`  | `string \| undefined` | `undefined`           |
| `alwaysShow` | `boolean`             | `false`               |
| `role`       | `string`              | `'region'`            |
| `ariaLabel`  | `string`              | `'Scrollable region'` |
| `tabIndex`   | `number`              | `0`                   |

### Exposed Methods

| Name                       | Description                              |
| -------------------------- | ---------------------------------------- |
| `getViewport()`            | Returns the scrollable viewport element. |
| `scrollTo(top, behavior?)` | Scrolls the viewport to a position.      |

## Theming

`ScrollPanel` currently uses a CSS variable contract in component styles, but this repo does not include a dedicated preset file in `packages/vueforge/src/themes/default/components/` for it yet.

## Tokens

- `borderColor`
- `borderRadius`
- `backgroundColor`
- `textColor`
- `contentPadding`
- `focusRingColor`
- `scrollbarSize`
- `scrollbarTrackColor`
- `scrollbarThumbColor`

## Recipes

- Use `ScrollPanel` for bounded content regions, not as a replacement for whole-page scrolling.
- Keep the `ariaLabel` specific when multiple scroll regions exist on the same screen.

## Accessibility

- The viewport is focusable by default and exposes configurable `role` and `aria-label`.
- Keyboard users should be able to reach and scroll the region without relying on pointer interaction.
