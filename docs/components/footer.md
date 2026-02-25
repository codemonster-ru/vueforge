# Footer

## Purpose

- Provide app/page footer layout with `left`/`center`/`right` content regions.
- Keep footer semantics consistent across shells and standalone pages.

## Props

- `as?: string` (default `footer`)
- `bordered?: boolean` (default `true`)
- `dense?: boolean` (default `false`)
- `wrap?: boolean` (default `true`)
- `stackOnMobile?: boolean` (default `true`)
- `mobileBreakpoint?: number` (default `720`)
- `ariaLabel?: string` (optional landmark label)
- `groupAriaLabel?: string` (default `Footer content`)
- `leftAriaLabel?: string` (default `Footer left section`)
- `centerAriaLabel?: string` (default `Footer center section`)
- `rightAriaLabel?: string` (default `Footer right section`)

## Slots

- `left` (optional)
- `center` (optional)
- `right` (optional)
- `default` (renders only when named slots are absent)

## Example

```vue
<Footer>
    <template #left>© 2026 Codemonster</template>
    <template #center><a href="/status">Status</a></template>
    <template #right><a href="/terms">Terms</a></template>
</Footer>
```

## Tokens

Component tokens (override via `theme.overrides.components.footer`):

- `minHeight`, `denseMinHeight`
- `padding`, `densePadding`
- `gap`, `mobileGap`, `sectionGap`
- `borderColor`, `backgroundColor`, `textColor`

## Responsive

- `stackOnMobile` switches to vertical region layout below `mobileBreakpoint`.

## SSR/Hydration

- Keep `stackOnMobile` and `mobileBreakpoint` deterministic in SSR paths to avoid post-hydration layout jumps.

## Testing

- Covers region slot rendering, landmark semantics, variants, and mobile stacking behavior.

## Accessibility

- Uses native `footer` landmark by default; non-footer tags receive `role="contentinfo"`.
- Region groups expose explicit ARIA labels for screen-reader navigation.
