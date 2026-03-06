# Image

Image renders media with fallback handling and an optional preview lightbox with zoom, grouped navigation, and download support.

## Import

```ts
import Image from '@/package/components/image.vue';
```

## Examples

### Basic

Use `Image` when you need design-system styling, fallback handling, or preview behavior instead of a raw `<img>`.

```vue
<Image src="/assets/cover.jpg" alt="Project cover" width="320" height="180" />
```

### Fallback Source

Provide `fallback-src` for broken asset URLs, user-generated uploads, or remote media that may disappear.

```vue
<Image
    src="/assets/missing.jpg"
    fallback-src="/assets/placeholder.jpg"
    alt="Asset preview"
    width="320"
    height="180"
/>
```

### Preview

Enable `preview` when users need to inspect screenshots, product images, or report attachments in a lightbox.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const previewOpen = ref(false);
</script>

<template>
    <Image
        v-model="previewOpen"
        src="/assets/report.png"
        alt="Quarterly report chart"
        preview
        fit="contain"
        width="320"
        height="180"
    />
</template>
```

### Preview Group

Use `preview-group` to create gallery navigation across related images.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const previewOpen = ref(false);
const activeIndex = ref(0);

const gallery = [
    { src: '/assets/screens/overview.png', alt: 'Overview screen' },
    { src: '/assets/screens/details.png', alt: 'Details screen' },
    { src: '/assets/screens/export.png', alt: 'Export screen' },
];
</script>

<template>
    <Image
        v-model="previewOpen"
        :src="gallery[0].src"
        :alt="gallery[0].alt"
        preview
        :preview-group="gallery"
        :preview-start-index="activeIndex"
        show-download
        @preview-change="({ index }) => (activeIndex = index)"
    />
</template>
```

## API

### Types

```ts
interface PreviewItem {
    src: string;
    alt?: string;
    downloadName?: string;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `src` | `string` | `''` |
| `alt` | `string` | `''` |
| `fallbackSrc` | `string` | `''` |
| `fit` | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| `width` | `string \| number \| undefined` | `undefined` |
| `height` | `string \| number \| undefined` | `undefined` |
| `loading` | `'eager' \| 'lazy'` | `'lazy'` |
| `preview` | `boolean` | `false` |
| `modelValue` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `closeOnOverlay` | `boolean` | `true` |
| `closeOnEscape` | `boolean` | `true` |
| `previewGroup` | `PreviewItem[]` | `[]` |
| `previewStartIndex` | `number` | `0` |
| `loopPreview` | `boolean` | `true` |
| `zoomStep` | `number` | `0.25` |
| `minZoom` | `number` | `1` |
| `maxZoom` | `number` | `3` |
| `showDownload` | `boolean` | `false` |
| `downloadLabel` | `string` | `'Download image'` |
| `downloadFileName` | `string` | `''` |
| `prevLabel` | `string` | `'Previous image'` |
| `nextLabel` | `string` | `'Next image'` |
| `zoomInLabel` | `string` | `'Zoom in'` |
| `zoomOutLabel` | `string` | `'Zoom out'` |
| `zoomResetLabel` | `string` | `'Reset zoom'` |
| `previewAriaLabel` | `string` | `'Open image preview'` |
| `dialogAriaLabel` | `string` | `'Image preview'` |
| `closeLabel` | `string` | `'Close preview'` |
| `teleport` | `boolean` | `true` |
| `pt` | `PassThroughOptions \| undefined` | `undefined` |
| `unstyled` | `boolean` | `false` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `boolean` |
| `open` | none |
| `close` | `'overlay' \| 'esc' \| 'button'` |
| `load` | image load event |
| `error` | image error event |
| `previewChange` | `{ index, src }` |
| `zoomChange` | `{ zoom }` |

## Theming

Override component tokens through `theme.overrides.components.image`.

## Tokens

- Base image: `borderColor`, `borderRadius`, `backgroundColor`
- Overlay and preview: `overlayZIndex`, `overlayPadding`, `overlayBackgroundColor`, `previewMaxWidth`, `previewMaxHeight`, `previewBorderRadius`, `previewBackgroundColor`, `previewShadow`
- Controls: `closeOffset`, `closeSize`, `closeBorderColor`, `closeBackgroundColor`, `closeTextColor`, `toolbarOffset`, `toolbarGap`, `navOffset`, `controlSize`, `controlFontSize`, `controlBorderColor`, `controlBackgroundColor`, `controlTextColor`
- Counter and state: `counterTextColor`, `counterFontSize`, `focusRingShadow`, `disabledOpacity`

## Recipes

- Use `Image` for screenshots, asset libraries, and media review flows where fallback and preview behavior matter.
- Prefer a plain `<img>` only when you do not need lightbox behavior, grouped navigation, or design-system tokens.

## Accessibility

- Preview mode uses a button trigger and dialog semantics for the lightbox.
- Grouped previews support keyboard navigation, zoom controls, and explicit labels for next, previous, download, and close actions.
- Always provide meaningful `alt` text instead of relying on filenames or surrounding captions.
