# Carousel

Carousel displays sequential slides with arrows, indicators, keyboard support, swipe gestures, and optional autoplay.

## Import

```ts
import Carousel from '@/package/components/carousel.vue';
```

## Examples

### Basic

Use `v-model` to control the active slide from application state.

```vue
<Carousel v-model="activeSlide" :items="slides">
    <template #item="{ item }">
        <article
            style="
                display: grid;
                gap: 0.9rem;
                min-height: 15rem;
                align-content: start;
                padding: 0.5rem;
            "
        >
            <span
                style="
                    display: inline-flex;
                    width: fit-content;
                    padding: 0.2rem 0.55rem;
                    border-radius: 999px;
                    background: color-mix(in srgb, var(--vf-docs-link-hover-bg) 70%, transparent);
                    color: var(--vf-docs-link-color);
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                "
            >
                {{ item.kicker }}
            </span>
            <div style="display: grid; gap: 0.45rem;">
                <h3 style="margin: 0; font-size: 2rem; line-height: 1.05;">{{ item.title }}</h3>
                <p style="margin: 0; max-width: 30rem; color: var(--vf-docs-secondary-text);">
                    {{ item.description }}
                </p>
            </div>
            <strong style="font-size: 0.95rem; color: var(--vf-docs-text);">{{ item.meta }}</strong>
        </article>
    </template>
</Carousel>
```

### Autoplay

Enable autoplay for hero banners and lightweight promotional surfaces.

```vue
<Carousel
    v-model="activeSlide"
    :items="heroSlides"
    autoplay
    :autoplay-interval="4000"
    :show-indicators="false"
/>
```

### Controlled Navigation

Disable looping when the slide sequence has a clear start and end.

```vue
<Carousel
    v-model="activeSlide"
    :items="slides"
    :loop="false"
    :show-arrows="true"
    :show-indicators="true"
/>
```

### Custom Navigation Icons

Use `prevIcon` and `nextIcon` to match the surrounding icon set.

```vue
<Carousel v-model="activeSlide" :items="slides">
    <template #prevIcon>
        <Icon icon="arrowLeft" />
    </template>

    <template #nextIcon>
        <Icon icon="arrowRight" />
    </template>
</Carousel>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `number` | `0` |
| `items` | `unknown[]` | `[]` |
| `autoplay` | `boolean` | `false` |
| `autoplayInterval` | `number` | `5000` |
| `loop` | `boolean` | `true` |
| `keyboard` | `boolean` | `true` |
| `swipe` | `boolean` | `true` |
| `pauseOnHover` | `boolean` | `true` |
| `showArrows` | `boolean` | `true` |
| `showIndicators` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `ariaLabel` | `string` | `'Carousel'` |
| `slideKey` | `string \| ((item: unknown, index: number) => string \| number) \| undefined` | `undefined` |
| `pt` | `PassThroughOptions \| undefined` | `undefined` |
| `unstyled` | `boolean` | `false` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `number` |
| `change` | `{ index, previousIndex, source }` |

### Slots

| Name | Description |
| --- | --- |
| `item` | Custom slide content with `{ item, index, active }`. |
| `prevIcon` | Replaces the previous-arrow icon. |
| `nextIcon` | Replaces the next-arrow icon. |

## Theming

Override component tokens through `theme.overrides.components.carousel`.

## Tokens

- Surface and layout: `gap`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `slideMinHeight`, `slidePadding`
- Motion: `transitionDuration`, `transitionEasing`
- Arrows: `arrowSize`, `arrowSizeMobile`, `arrowOffset`, `arrowBorderColor`, `arrowBorderRadius`, `arrowBackgroundColor`, `arrowTextColor`
- Indicators: `indicatorsGap`, `indicatorSize`, `indicatorBorderColor`, `indicatorBackgroundColor`, `indicatorActiveBorderColor`, `indicatorActiveBackgroundColor`
- Focus and state: `focusRingShadow`, `focusBorderColor`, `disabledOpacity`

## Recipes

- Use Carousel for feature highlights, onboarding banners, and simple card-like slideshows.
- Prefer `Window` when the content behaves like a stateful multi-step region rather than a visual slider.

## Accessibility

- Carousel renders a `region` with `aria-roledescription="carousel"` and per-slide group labels.
- Keyboard support includes `ArrowLeft`, `ArrowRight`, `Home`, and `End`.
- Swipe gestures and autoplay are optional, so interaction can stay predictable in dense layouts.
