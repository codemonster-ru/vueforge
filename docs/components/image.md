# Image

## Purpose

Render optimized media with optional preview/lightbox mode for detail inspection and gallery-style workflows.

## Props

- `src?: string`
- `alt?: string`
- `fallbackSrc?: string`
- `fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'` (default `cover`)
- `width?: string | number`
- `height?: string | number`
- `loading?: 'eager' | 'lazy'` (default `lazy`)
- `preview?: boolean` (default `false`)
- `modelValue?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEscape?: boolean` (default `true`)
- `previewGroup?: Array<{ src: string; alt?: string; downloadName?: string }>` (default `[]`)
- `previewStartIndex?: number` (default `0`)
- `loopPreview?: boolean` (default `true`)
- `zoomStep?: number` (default `0.25`)
- `minZoom?: number` (default `1`)
- `maxZoom?: number` (default `3`)
- `showDownload?: boolean` (default `false`)
- `downloadLabel?: string` (default `Download image`)
- `downloadFileName?: string` (default `''`)
- `prevLabel?: string` (default `Previous image`)
- `nextLabel?: string` (default `Next image`)
- `zoomInLabel?: string` (default `Zoom in`)
- `zoomOutLabel?: string` (default `Zoom out`)
- `zoomResetLabel?: string` (default `Reset zoom`)
- `previewAriaLabel?: string` (default `Open image preview`)
- `dialogAriaLabel?: string` (default `Image preview`)
- `closeLabel?: string` (default `Close preview`)
- `teleport?: boolean` (default `true`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

## Events

- `update:modelValue`
- `open`
- `close` (`'overlay' | 'esc' | 'button'`)
- `load`
- `error`
- `previewChange` (`{ index, src }`)
- `zoomChange` (`{ zoom }`)

## Slots

- `default` not used

## Examples

```vue
<Image src="/assets/cover.jpg" alt="Project cover" width="320" height="180" />
```

```vue
<Image v-model="previewOpen" src="/assets/report.png" alt="Quarterly report chart" preview fit="contain" />
```

```vue
<Image
    v-model="previewOpen"
    preview
    :preview-group="gallery"
    :preview-start-index="activeIndex"
    :show-download="true"
    @preview-change="({ index }) => (activeIndex = index)"
/>
```

## Theming

- Override via `theme.overrides.components.image`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`
- `overlayZIndex`, `overlayPadding`, `overlayBackgroundColor`
- `previewMaxWidth`, `previewMaxHeight`, `previewBorderRadius`, `previewBackgroundColor`, `previewShadow`
- `closeOffset`, `closeSize`, `closeBorderColor`, `closeBackgroundColor`, `closeTextColor`
- `toolbarOffset`, `toolbarGap`, `navOffset`
- `controlSize`, `controlFontSize`, `controlBorderColor`, `controlBackgroundColor`, `controlTextColor`
- `counterTextColor`, `counterFontSize`
- `focusRingShadow`, `disabledOpacity`

## Recipes

- Table thumbnail preview: compact inline image with click-to-open detail view.
- Asset gallery: controlled lightbox state synchronized with parent gallery navigation.
- Large-media review: combine `previewGroup`, keyboard navigation, and `showDownload` for ops/content workflows.

## Accessibility

- Preview trigger is a button with explicit `aria-label`.
- Lightbox uses `role="dialog"` with `aria-modal="true"`.
- Keyboard support in preview: `ArrowLeft`/`ArrowRight` for group navigation, `Home`/`End` for first/last item, `+`/`-`/`0` for zoom.
- `Escape` closes preview when enabled.
- Provide meaningful `alt` for each image in `previewGroup` (do not rely on file names/IDs).

## Responsive

- Preview dialog is viewport-bounded via max width/height tokens.
- Use explicit `width`/`height` for stable layout in mobile lists and data cards.

## SSR/Hydration

- Base image rendering is deterministic from props.
- Overlay interaction and keyboard listeners are attached only on client.

## Testing

- Cover open/close (`overlay`, `esc`, close button), fallback source behavior, and emitted load/error events.
- Assert preview group navigation, zoom contracts (`zoomChange`), and download action attributes in lightbox mode.
- Assert dialog semantics and controlled `v-model` updates.
