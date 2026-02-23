# Carousel

## Purpose

Display sequential slides with keyboard navigation, touch swipe, and optional autoplay for feature highlights, onboarding, and content galleries.

## Props

- `modelValue?: number` (default `0`)
- `items?: Array<unknown>`
- `autoplay?: boolean` (default `false`)
- `autoplayInterval?: number` (default `5000`)
- `loop?: boolean` (default `true`)
- `keyboard?: boolean` (default `true`)
- `swipe?: boolean` (default `true`)
- `pauseOnHover?: boolean` (default `true`)
- `showArrows?: boolean` (default `true`)
- `showIndicators?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Carousel`)
- `slideKey?: string | ((item, index) => string | number)`
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

## Events

- `update:modelValue`
- `change` (`{ index, previousIndex, source }`)

## Slots

- `item` - custom slide rendering (`{ item, index, active }`)
- `prevIcon`
- `nextIcon`

## Examples

```vue
<Carousel v-model="activeSlide" :items="slides">
    <template #item="{ item }">
        <article class="promo-slide">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
        </article>
    </template>
</Carousel>
```

```vue
<Carousel v-model="activeSlide" :items="heroSlides" autoplay :autoplay-interval="4000" :show-indicators="false" />
```

## Theming

- Override via `theme.overrides.components.carousel`.

## Tokens

- `gap`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `slideMinHeight`, `slidePadding`
- `transitionDuration`, `transitionEasing`
- `arrowSize`, `arrowSizeMobile`, `arrowOffset`, `arrowBorderColor`, `arrowBorderRadius`, `arrowBackgroundColor`, `arrowTextColor`
- `indicatorsGap`, `indicatorSize`, `indicatorBorderColor`, `indicatorBackgroundColor`, `indicatorActiveBorderColor`, `indicatorActiveBackgroundColor`
- `focusRingShadow`, `focusBorderColor`, `disabledOpacity`

## Recipes

- Product hero: autoplay + loop with short promotional copy and CTA inside each slide.
- Onboarding flow: disable autoplay, keep indicators visible, and persist `v-model` index in route/query state.

## Accessibility

- Root uses `role="region"` with `aria-roledescription="carousel"` and configurable `ariaLabel`.
- Slides expose `role="group"` with `aria-roledescription="slide"` and sequence labels.
- Keyboard support: `ArrowLeft`, `ArrowRight`, `Home`, `End`.

## Responsive

- Swipe gestures are enabled by default for touch devices.
- Keep slide content concise and vertically compact on mobile to avoid scroll conflicts.
- Arrow controls shrink on narrow viewports via mobile token sizing.

## SSR/Hydration

- Initial slide is derived from props and rendered deterministically.
- Autoplay interval starts only after mount, preventing SSR/client mismatch.

## Testing

- Cover keyboard and swipe interactions, autoplay progression, and boundary behavior with/without looping.
- Assert ARIA roles/labels for root, slides, and indicator controls.
