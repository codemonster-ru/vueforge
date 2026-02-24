# Galleria

## Purpose

Provide a gallery-focused media component with main image stage, thumbnail navigation, indicators, and keyboard-friendly traversal.

## Props

- `items?: Array<GalleriaItem>`
- `modelValue?: number` (default `0`)
- `showThumbnails?: boolean` (default `true`)
- `showIndicators?: boolean` (default `true`)
- `showCaption?: boolean` (default `true`)
- `circular?: boolean` (default `true`)
- `autoPlay?: boolean` (default `false`)
- `autoPlayInterval?: number` (default `5000`)
- `pauseOnHover?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Media gallery`)

`GalleriaItem`:

- `src: string`
- `thumbnailSrc?: string`
- `alt?: string`
- `caption?: string`
- `disabled?: boolean`
- `key?: string | number`

## Events

- `update:modelValue`
- `change` (`{ index, previousIndex, source }`)
- `itemClick` (`{ item, index, event }`)

## Slots

- This component does not expose named slots.

## Examples

```vue
<Galleria
    v-model="activeIndex"
    :items="[
        { src: '/gallery/1.jpg', thumbnailSrc: '/gallery/thumbs/1.jpg', alt: 'Item one', caption: 'Intro scene' },
        { src: '/gallery/2.jpg', thumbnailSrc: '/gallery/thumbs/2.jpg', alt: 'Item two', caption: 'Detail view' },
    ]"
/>
```

## Theming

- Override via `theme.overrides.components.galleria`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `padding`
- `stageGap`, `maxHeight`, `imageRadius`, `imageBackgroundColor`
- `captionGap`, `captionFontSize`, `captionColor`
- `navSize`, `navBorderColor`, `navBackgroundColor`, `navTextColor`
- `indicatorsGap`, `indicatorColor`, `indicatorActiveColor`
- `thumbnailsGap`, `thumbnailsItemGap`, `thumbnailSize`, `thumbnailRadius`, `thumbnailBorderColor`, `thumbnailActiveBorderColor`
- `disabledOpacity`

## Recipes

- Product/media detail gallery with thumb strip and caption text.
- Marketing showcase with autoplay and manual keyboard fallback.

## Accessibility

- Root uses region/carousel semantics with descriptive `ariaLabel`.
- Stage image exposes `x of y` progression in `aria-label`.
- Keyboard support: `ArrowLeft`/`ArrowRight`, `Home`/`End`.

## Responsive

- Thumbnail strip scrolls horizontally and stays touch-friendly.
- Stage image uses `object-fit: contain` with bounded max-height.

## SSR/Hydration

- Deterministic initial rendering from `items` and `modelValue`.
- Autoplay timer starts only on client.

## Testing

- Cover button/keyboard navigation, thumbnail/disabled behavior, autoplay transitions, and `itemClick` emission.
