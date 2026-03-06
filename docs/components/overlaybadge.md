# OverlayBadge

OverlayBadge decorates an icon, button, or avatar with a compact count or status marker.

## Import

```ts
import OverlayBadge from '@/package/components/overlay-badge.vue';
```

## Examples

### Count Badge

Use count mode for inboxes, alerts, and queued tasks.

```vue
<OverlayBadge :value="8" severity="info">
    <button type="button" aria-label="Inbox">Inbox</button>
</OverlayBadge>
```

### Dot Badge

Use dot mode when only presence or unread state matters.

```vue
<OverlayBadge dot aria-label="Unread notifications">
    <button type="button" aria-label="Notifications">Alerts</button>
</OverlayBadge>
```

### Overflow Formatting

Use `max` and `show-zero` to control display behavior in dense navigation surfaces.

```vue
<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <OverlayBadge :value="128" :max="99">
        <button type="button">Queue</button>
    </OverlayBadge>
    <OverlayBadge :value="0" show-zero severity="neutral">
        <button type="button">Builds</button>
    </OverlayBadge>
</div>
```

### Directive Usage

Use the directive form when you only need decoration on an existing element.

```vue
<button v-overlay-badge="{ value: 3, severity: 'warn' }" type="button">
    Alerts
</button>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `value` | `string \| number \| null \| undefined` | `undefined` |
| `hidden` | `boolean` | `false` |
| `dot` | `boolean` | `false` |
| `max` | `number` | `99` |
| `showZero` | `boolean` | `false` |
| `severity` | `'neutral' \| 'info' \| 'success' \| 'warn' \| 'danger'` | `'danger'` |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| `ariaLabel` | `string` | `''` |
| `as` | `string` | `'span'` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Target content that receives the badge overlay. |

## Theming

Override component tokens through `theme.overrides.components.overlayBadge`.

## Tokens

- Layout: `minSize`, `dotSize`, `paddingX`, `borderRadius`, `zIndex`
- Base colors and typography: `borderColor`, `backgroundColor`, `textColor`, `fontSize`, `fontWeight`, `lineHeight`
- Positioning: `topOffset`, `rightOffset`, `bottomOffset`, `leftOffset`
- Severities: `neutral*`, `info*`, `success*`, `warn*`, `danger*`

## Recipes

- Use counts when quantity matters and dot mode when a binary state is enough.
- Keep `ariaLabel` explicit when the badge content changes the meaning of the underlying action.

## Accessibility

- Decorative badges are hidden from assistive tech unless `ariaLabel` is provided.
- The wrapped trigger still needs its own accessible name; the badge does not replace it.
