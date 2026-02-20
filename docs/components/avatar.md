# Avatar

## Props

- `src?: string`
- `alt?: string`
- `name?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `shape?: 'circle' | 'rounded'` (default `circle`)
- `status?: 'online' | 'offline' | 'busy' | 'away'`

## Events

- This component does not emit component-specific events.

## Slots

- `default` - custom avatar content

## Examples

```vue
<Avatar name="Ada Lovelace" />
<Avatar src="/img/ada.png" alt="Ada Lovelace" size="large" />
<Avatar name="Ada Lovelace" status="online" />
```

## Tokens

Component tokens (override via `theme.overrides.components.avatar`):

- `size`, `fontSize`, `fontWeight`
- `backgroundColor`, `textColor`, `borderColor`, `borderWidth`, `borderRadius`
- `statusSize`, `statusBorderWidth`, `statusBorderColor`
- `statusOnlineColor`, `statusOfflineColor`, `statusBusyColor`, `statusAwayColor`
- `small.size`, `small.fontSize`, `small.statusSize`
- `large.size`, `large.fontSize`, `large.statusSize`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
