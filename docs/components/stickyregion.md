# StickyRegion

StickyRegion is a utility wrapper for sticky headers, subheaders, and action bars.

## Import

```ts
import StickyRegion from '@/package/components/sticky-region.vue';
```

## Examples

### Top Sticky Header

Use `edge="top"` for action bars and section headers that should stay visible while scrolling.

```vue
<StickyRegion as="header" edge="top" offset="3.5rem" bordered shadow>
    <Toolbar aria-label="Page actions" />
</StickyRegion>
```

### Bottom Sticky Actions

Use `edge="bottom"` for mobile or workflow completion actions.

```vue
<StickyRegion edge="bottom" offset="0px" shadow>
    <Button label="Save changes" />
</StickyRegion>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `as` | `string` | `'div'` |
| `edge` | `'top' \| 'bottom'` | `'top'` |
| `offset` | `string` | `'0px'` |
| `zIndex` | `string \| number` | `''` |
| `bordered` | `boolean` | `false` |
| `shadow` | `boolean` | `false` |
| `ariaLabel` | `string` | `''` |

## Theming

Override component tokens through `theme.overrides.components.stickyRegion`.

## Tokens

- `zIndex`
- `padding`
- `borderColor`
- `backgroundColor`
- `textColor`
- `shadow`

## Recipes

- Use `offset` to line sticky regions up with app bars, system bars, or other already-sticky shell surfaces.
- Keep sticky wrappers limited to meaningful utility regions, not arbitrary content blocks.

## Accessibility

- Non-semantic tags receive `role="region"`, while semantic `header` and `footer` keep their native meaning.
- Add `ariaLabel` when multiple sticky regions exist on the same screen.
