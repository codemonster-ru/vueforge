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

## Related docs

- Components catalog: [`components/README.md`](components/README.md)
- `Container` tokens example: [`components/container.md`](components/container.md)
