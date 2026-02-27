# Sheet

## Purpose

Generic surface container for grouped content blocks with `elevated`, `flat`, `outlined`, and `tonal` variants.

## Props

- `as?: string` (default `div`)
- `variant?: 'elevated' | 'flat' | 'outlined' | 'tonal'` (default `elevated`)
- `bordered?: boolean` (default `false`)
- `rounded?: boolean` (default `true`)
- `interactive?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string`

## Slots

- `header` (optional)
- `default` (body)
- `footer` (optional)

## Example

```vue
<Sheet variant="outlined" bordered>
    <template #header>Summary</template>
    <p>Reusable neutral surface for compact content sections.</p>
    <template #footer>
        <Button size="sm">Action</Button>
    </template>
</Sheet>
```

## Tokens

Component tokens (override via `theme.overrides.components.sheet`):

- `borderRadius`, `borderColor`, `sectionBorderColor`
- `backgroundColor`, `textColor`
- `tonalBackgroundColor`, `tonalTextColor`
- `shadow`, `shadowHover`, `transition`
- `disabledOpacity`
- `headerPadding`, `bodyPadding`, `footerPadding`

## Accessibility

- Supports semantic root via `as`.
- Exposes `aria-disabled` when disabled.
