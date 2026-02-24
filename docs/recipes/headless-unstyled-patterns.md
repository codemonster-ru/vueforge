# Recipe: Headless and Unstyled Patterns

## Purpose

Show practical usage patterns for `pt` and `unstyled` when integrating VueForge components into a custom design system.

## Recipe 1: Brand-first Carousel

```vue
<Carousel
    :items="slides"
    unstyled
    :pt="{
        root: { class: 'brand-carousel' },
        viewport: { class: 'brand-carousel__viewport' },
        slide: ({ active }) => ({ class: active ? 'brand-carousel__slide is-active' : 'brand-carousel__slide' }),
        prevArrow: { class: 'brand-carousel__prev' },
        nextArrow: { class: 'brand-carousel__next' },
    }"
>
    <template #item="{ item }">
        <article class="brand-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
        </article>
    </template>
</Carousel>
```

## Recipe 2: Custom Media Lightbox Controls

```vue
<Image
    v-model="open"
    preview
    :src="hero.src"
    :alt="hero.alt"
    :show-download="true"
    unstyled
    :pt="{
        root: { class: 'media' },
        trigger: { class: 'media__trigger' },
        overlay: { class: 'media__overlay' },
        dialog: { class: 'media__dialog' },
        preview: { class: 'media__preview' },
        toolbarButton: ({ disabled }) => ({
            class: disabled ? 'media__toolbar-btn is-disabled' : 'media__toolbar-btn',
        }),
        download: { class: 'media__download' },
    }"
/>
```

## Recipe 3: Tokenless SpeedDial in App Shell

```vue
<SpeedDial
    v-model="open"
    :actions="actions"
    unstyled
    :pt="{
        root: { class: 'fab' },
        trigger: { class: 'fab__trigger' },
        actions: { class: 'fab__actions' },
        item: ({ open }) => ({ class: open ? 'fab__item is-open' : 'fab__item' }),
        action: ({ index }) => ({ class: `fab__action fab__action-${index}` }),
        label: { class: 'fab__label' },
    }"
>
    <template #action="{ action }">
        <span>{{ action.label }}</span>
    </template>
</SpeedDial>
```

## Notes

- Start from `unstyled` only when a custom style layer fully covers focus/hover/disabled states.
- Keep `pt` resolver functions pure and deterministic for SSR/hydration safety.
- When adding or renaming parts, update:
  `docs/guides/pass-through-unstyled.md`,
  `docs/audits/headless-parity-matrix.md`,
  and `src/package/components/__tests__/headless-parity.test.ts`.
