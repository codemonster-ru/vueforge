# Parallax

Parallax applies scroll-driven decorative motion with reduced-motion compliance and offset clamping.

## Import

```ts
import { Parallax } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

```vue
<Parallax :speed="0.25" :max-offset="140">
    <img src="/hero-layer.png" alt="" />
</Parallax>
```

### Horizontal Motion

```vue
<Parallax axis="x" :speed="0.18" reverse>
    <DecorativeBadgeCloud />
</Parallax>
```

### Reduced Motion Override

```vue
<Parallax :reduced-motion="false">
    <HeroBackground />
</Parallax>
```

## API

### Props

| Name            | Type              | Default |
| --------------- | ----------------- | ------- |
| `as`            | `string`          | `'div'` |
| `speed`         | `number`          | `0.2`   |
| `axis`          | `'x' \| 'y'`      | `'y'`   |
| `reverse`       | `boolean`         | `false` |
| `maxOffset`     | `number`          | `120`   |
| `clamp`         | `boolean`         | `true`  |
| `disabled`      | `boolean`         | `false` |
| `reducedMotion` | `boolean \| null` | `null`  |
| `ariaLabel`     | `string`          | `''`    |

### Events

| Name     | Payload      |
| -------- | ------------ |
| `change` | `{ offset }` |

### Slots

| Name      | Description                      |
| --------- | -------------------------------- |
| `default` | Decorative content to transform. |

## Theming

Override component tokens through `theme.overrides.components.parallax`.

## Tokens

- `overflow`
- `transformOrigin`
- `transition`
- `disabledOpacity`

## Recipes

- Use Parallax for decorative hero layers, background accents, and non-essential motion depth.
- Avoid using it for primary content or controls that need stable positioning during scroll.

## Accessibility

- Motion auto-disables when `prefers-reduced-motion: reduce` is active or `data-vf-reduced-motion="true"` is present on `<html>`.
- Reduced motion can be overridden explicitly through the prop when the host app has stricter policy control.
