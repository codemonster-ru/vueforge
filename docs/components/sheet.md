# Sheet

Sheet is a neutral surface primitive for grouped content, lightweight panels, and embedded sections inside larger layouts.

## Import

```ts
import Sheet from '@/package/components/sheet.vue';
```

## Examples

### Basic

Use the default elevated surface for compact grouped content.

```vue
<Sheet>
    <p>Reusable surface for compact summaries, side notes, and inline details.</p>
</Sheet>
```

### Header And Footer

Add structure with `header` and `footer` slots when the surface wraps a complete block.

```vue
<Sheet variant="outlined" bordered>
    <template #header>
        Summary
    </template>

    <p>Reusable neutral surface for compact content sections.</p>

    <template #footer>
        <Button size="sm">
            Action
        </Button>
    </template>
</Sheet>
```

### Variants

Choose the visual weight that matches the surrounding layout.

```vue
<div class="sheet-grid">
    <Sheet variant="elevated">Elevated</Sheet>
    <Sheet variant="flat">Flat</Sheet>
    <Sheet variant="outlined" bordered>Outlined</Sheet>
    <Sheet variant="tonal">Tonal</Sheet>
</div>
```

### Interactive Surface

Enable `interactive` when the whole surface behaves like a hoverable or clickable block.

```vue
<Sheet interactive aria-label="Open project summary">
    <template #header>
        Project Alpha
    </template>
    <p>Hover styles can support card-like selection or drill-down affordances.</p>
</Sheet>
```

### Semantic Root

Use `as` to align the root element with the surrounding document structure.

```vue
<Sheet as="article" variant="outlined" aria-label="Release note">
    <h3>Version 2.8</h3>
    <p>Production rollout scheduled for Friday.</p>
</Sheet>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `as` | `string` | `'div'` |
| `variant` | `'elevated' \| 'flat' \| 'outlined' \| 'tonal'` | `'elevated'` |
| `bordered` | `boolean` | `false` |
| `rounded` | `boolean` | `true` |
| `interactive` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `ariaLabel` | `string \| undefined` | `undefined` |

### Slots

| Name | Description |
| --- | --- |
| `header` | Optional top section. |
| `default` | Main surface content. |
| `footer` | Optional bottom section. |

## Theming

Override component tokens through `theme.overrides.components.sheet`.

## Tokens

- Surface: `borderRadius`, `borderColor`, `sectionBorderColor`, `backgroundColor`, `textColor`
- Tonal variant: `tonalBackgroundColor`, `tonalTextColor`
- Elevation and motion: `shadow`, `shadowHover`, `transition`
- States and spacing: `disabledOpacity`, `headerPadding`, `bodyPadding`, `footerPadding`

## Recipes

- Use Sheet as the base container for small dashboard cards, embedded settings blocks, and secondary side content.
- Prefer `Panel` when the container needs a built-in title, actions area, or collapsible behavior.

## Accessibility

- `as` lets you preserve document semantics such as `article`, `section`, or `aside`.
- Disabled sheets expose `aria-disabled` without changing their structural semantics.

