# Avatar

Avatar renders a user or entity image, initials fallback, and optional presence status.

## Import

```ts
import Avatar from '@/package/components/avatar.vue';
```

## Examples

### Initials

Use name-driven initials when image data is unavailable or unnecessary.

```vue
<Avatar name="Ada Lovelace" />
```

### Image

Pass `src` and `alt` when the avatar should display a real profile image.

```vue
<Avatar src="/img/ada.png" alt="Ada Lovelace" size="large" />
```

### Status

Use `status` for lightweight presence or activity indicators in messaging and collaboration surfaces.

```vue
<div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
    <Avatar name="Ada Lovelace" status="online" />
    <Avatar name="Alan Turing" status="busy" />
    <Avatar name="Grace Hopper" status="away" />
</div>
```

### Shape And Size

Adjust shape and size to match list items, cards, and denser admin layouts.

```vue
<div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
    <Avatar name="Small" size="small" />
    <Avatar name="Rounded" shape="rounded" />
    <Avatar name="Large" size="large" />
</div>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `src` | `string` | `''` |
| `alt` | `string` | `''` |
| `name` | `string` | `''` |
| `size` | `'small' \| 'normal' \| 'large'` | `'normal'` |
| `shape` | `'circle' \| 'rounded'` | `'circle'` |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away' \| undefined` | `undefined` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Replaces the default image or initials content. |

## Theming

Override component tokens through `theme.overrides.components.avatar`.

## Tokens

- Base avatar: `size`, `fontSize`, `fontWeight`, `backgroundColor`, `textColor`, `borderColor`, `borderWidth`, `borderRadius`
- Status indicator: `statusSize`, `statusBorderWidth`, `statusBorderColor`, `statusOnlineColor`, `statusOfflineColor`, `statusBusyColor`, `statusAwayColor`
- Sizes: `small.size`, `small.fontSize`, `small.statusSize`, `large.size`, `large.fontSize`, `large.statusSize`

## Recipes

- Use initials fallback whenever image URLs are optional or user-provided.
- Keep presence indicators for truly live status, not generic metadata.

## Accessibility

- The root exposes `role="img"` and derives its accessible label from `alt` or `name`.
- If you fully override the default slot, preserve equivalent meaning for non-visual users.
