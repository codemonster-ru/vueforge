# Pass-Through and Unstyled API

## Purpose

Enable deep customization (attrs/classes/styles per part) and opt-out from built-in classes without forking VueForge components.

## Contract

- `pt?: PassThroughOptions`
- `unstyled?: boolean`

`pt` keys are component part names (`root`, `trigger`, `img`, etc.) and values can be:

- static attrs object
- resolver function `(context) => attrs`

## Example

```vue
<Image
    src="/cover.png"
    :pt="{
        root: { class: 'media-root' },
        img: ({ error }) => ({ class: error ? 'media-error' : 'media-img' }),
    }"
/>
```

```vue
<SpeedDial
    :actions="actions"
    unstyled
    :pt="{
        root: { class: 'fab-root' },
        trigger: { class: 'fab-trigger' },
        action: ({ index }) => ({ class: `fab-action-${index}` }),
    }"
/>
```

## Supported Parts (current baseline)

- `Carousel`: `root`, `viewport`, `track`, `slide`, `prevArrow`, `nextArrow`, `indicators`, `indicator`
- `Chart`: `root`, `state`, `canvasWrap`, `canvas`
- `Image`: `root`, `trigger`, `img`, `overlay`, `dialog`, `preview`, `close`
- `SpeedDial`: `root`, `trigger`, `actions`, `item`, `action`, `label`
- `OverlayPanel`: `root`, `header`, `close`

## Notes

- `unstyled` removes built-in part classes for supported components.
- `pt` classes/styles are merged after internal defaults (or act as the only classes in `unstyled` mode).
