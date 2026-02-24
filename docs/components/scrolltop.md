# ScrollTop

## Purpose

Render a floating utility button that scrolls the page or a container back to top.

## Props

- `threshold?: number` (default `240`) - show button after this scroll offset
- `behavior?: ScrollBehavior` (default `smooth`)
- `target?: Window | HTMLElement | null` (default `window`)
- `right?: string` (default `1rem`)
- `bottom?: string` (default `1rem`)
- `zIndex?: number | string` (default `60`)
- `showLabel?: boolean` (default `false`)
- `label?: string` (default `Top`)
- `icon?: string` (default `↑`)
- `ariaLabel?: string` (default `Scroll to top`)
- `alwaysVisible?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `click`

## Slots

- `default` - custom button content

## Example

```vue
<ScrollTop :threshold="320" />
```

```vue
<ScrollTop :target="listRef" behavior="auto" show-label label="Back" />
```

## Theming

- Override via `theme.overrides.components.scrolltop`.

## Tokens

- `size`, `padding`, `gap`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `hoverBackgroundColor`
- `focusRingColor`, `iconSize`, `labelFontSize`, `disabledOpacity`

## Accessibility

- Uses native `button` element with configurable `aria-label`.

## Testing

- Cover visibility threshold, click behavior for window/element targets, and always-visible mode.
