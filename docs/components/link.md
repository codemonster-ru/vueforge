# Link

## Props

- `to?: string | object`
- `href?: string`
- `url?: string`
- `as?: 'a' | 'router-link'`
- `type?: string`
- `label?: string`
- `active?: boolean`
- `disabled?: boolean`

## Events

- `click`
- `active`
- `update:active`
- `onActive`

## Slots

- `default`

## Examples

```vue
<Link href="https://example.com" target="_blank">External</Link>
<Link to="/settings">Router link</Link>
```

## Tokens

Override via `theme.overrides.components.link`:

- `hoverColor`, `activeColor`

## Accessibility

- Disabled links set `aria-disabled` and remove keyboard tab focus (`tabindex=-1`).
- Router links expose active state via classes (`vf-link_active`, `vf-link_partially-active`).
- Prefer clear link text for screen-reader readability.
