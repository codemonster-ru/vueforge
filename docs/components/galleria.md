# Galleria

Galleria is a media-focused gallery with a main stage, thumbnail navigation, indicators, captions, and optional autoplay.

## Import

```ts
import Galleria from '@/package/components/galleria.vue';
```

## Examples

### Basic

Use Galleria when users need to inspect one media item at a time with a stronger visual focus than Carousel.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const activeIndex = ref(0);
const media = [
    { src: '/gallery/1.jpg', thumbnailSrc: '/gallery/thumbs/1.jpg', alt: 'Item one', caption: 'Intro scene' },
    { src: '/gallery/2.jpg', thumbnailSrc: '/gallery/thumbs/2.jpg', alt: 'Item two', caption: 'Detail view' },
];
</script>

<template>
    <Galleria v-model="activeIndex" :items="media" />
</template>
```

### Minimal Controls

Hide thumbnails, indicators, or captions when the gallery should stay compact.

```vue
<Galleria
    v-model="activeIndex"
    :items="media"
    :show-thumbnails="false"
    :show-indicators="true"
    :show-caption="false"
/>
```

### Product Gallery

Keep thumbnails visible for catalogs and detail pages where users compare images directly.

```vue
<Galleria
    v-model="activeIndex"
    :items="productImages"
    show-thumbnails
    show-caption
    :circular="false"
/>
```

### Autoplay Showcase

Enable autoplay for passive marketing or presentation use cases.

```vue
<Galleria
    v-model="activeIndex"
    :items="campaignMedia"
    auto-play
    :auto-play-interval="3500"
/>
```

## API

### Types

```ts
interface GalleriaItem {
    src: string;
    thumbnailSrc?: string;
    alt?: string;
    caption?: string;
    disabled?: boolean;
    key?: string | number;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `items` | `GalleriaItem[]` | `[]` |
| `modelValue` | `number` | `0` |
| `showThumbnails` | `boolean` | `true` |
| `showIndicators` | `boolean` | `true` |
| `showCaption` | `boolean` | `true` |
| `circular` | `boolean` | `true` |
| `autoPlay` | `boolean` | `false` |
| `autoPlayInterval` | `number` | `5000` |
| `pauseOnHover` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `ariaLabel` | `string` | `'Media gallery'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `number` |
| `change` | `{ index, previousIndex, source }` |
| `itemClick` | `{ item, index, event }` |

## Theming

Override component tokens through `theme.overrides.components.galleria`.

## Tokens

- Surface: `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `padding`
- Stage: `stageGap`, `maxHeight`, `imageRadius`, `imageBackgroundColor`
- Caption: `captionGap`, `captionFontSize`, `captionColor`
- Navigation: `navSize`, `navBorderColor`, `navBackgroundColor`, `navTextColor`
- Indicators and thumbnails: `indicatorsGap`, `indicatorColor`, `indicatorActiveColor`, `thumbnailsGap`, `thumbnailsItemGap`, `thumbnailSize`, `thumbnailRadius`, `thumbnailBorderColor`, `thumbnailActiveBorderColor`
- State: `disabledOpacity`

## Recipes

- Use Galleria for product detail pages, media review, and image-heavy editorial blocks.
- Prefer `Carousel` when the content is mixed media or text-first and thumbnails are not important.

## Accessibility

- Galleria renders region/carousel semantics with keyboard support for `ArrowLeft`, `ArrowRight`, `Home`, and `End`.
- The current media item exposes progression like `x of y`.
- Disabled media items stay non-interactive in the thumbnail strip.

