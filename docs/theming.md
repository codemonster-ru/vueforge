# Theming

VueForge maps theme tokens to CSS variables and supports runtime updates.

## Basic setup

```ts
import { VueForge, DefaultTheme } from '@codemonster-ru/vueforge';

app.use(VueForge, {
    theme: {
        preset: DefaultTheme,
    },
});
```

## Override tokens

```ts
import { setTheme } from '@codemonster-ru/vueforge';
import { DefaultTheme } from '@codemonster-ru/vueforge';

setTheme({
    preset: DefaultTheme,
    overrides: {
        colors: {
            blue: '#2b6cb0',
        },
        components: {
            container: {
                maxWidthLg: '68rem',
            },
        },
    },
});
```

## Runtime updates

```ts
import { updateTheme } from '@codemonster-ru/vueforge';

updateTheme({
    overrides: {
        colors: {
            green: '#18a66a',
        },
    },
});
```

## Theme API

- `setTheme(options)` - apply preset with optional overrides
- `updateTheme(partial)` - patch current theme
- `getTheme()` - read active options

## Token Validation Guidance

Use strict token hygiene to avoid runtime styling regressions:

- Prefer known token keys from component docs; avoid ad-hoc keys.
- Keep value types consistent:
    - lengths: `px`, `rem`, `%` (example: `12px`, `1rem`)
    - colors: CSS color values (`#hex`, `rgb()`, `hsl()`, CSS vars)
    - booleans/enums: only documented values
- Validate overrides in review:
    - unknown component token keys
    - malformed CSS values
    - mismatched scale usage (`small`/`large` nested tokens)
- Apply token changes incrementally and visually verify at least one representative page.

## Layout Primitive Token Examples

```ts
updateTheme({
    overrides: {
        components: {
            container: {
                maxWidthLg: '72rem',
                paddingX: '1.25rem',
            },
            section: {
                paddingY: '3rem',
                backgroundColorSurface: '#f7f8fb',
            },
            grid: {
                gap: '1rem',
                breakpointMd: '900px',
            },
            stack: {
                gap: '0.875rem',
            },
            inline: {
                gap: '0.5rem',
            },
        },
    },
});
```

## Related docs

- Components catalog: [`components/README.md`](components/README.md)
- `Container` tokens example: [`components/container.md`](components/container.md)
