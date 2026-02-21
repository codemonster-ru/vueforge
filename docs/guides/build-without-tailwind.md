# Build Without Tailwind

VueForge does not require Tailwind CSS. Components rely on Vue + theme tokens and can be used with plain CSS/SCSS.

## 1. Install and Import

```bash
npm i @codemonster-ru/vueforge
```

```ts
import { createApp } from 'vue';
import App from './App.vue';
import VueForge from '@codemonster-ru/vueforge';

createApp(App).use(VueForge).mount('#app');
```

## 2. Base Styles

Import your own global stylesheet and define app-level layout rules there.

```css
/* app.css */
:root {
    --app-page-padding: 1rem;
}

body {
    margin: 0;
    font-family:
        ui-sans-serif,
        system-ui,
        -apple-system,
        Segoe UI,
        sans-serif;
}
```

## 3. Theme Overrides

Use VueForge token overrides instead of utility classes.

```ts
import { setTheme } from '@codemonster-ru/vueforge';

setTheme({
    overrides: {
        components: {
            button: {
                borderRadius: '10px',
            },
            card: {
                borderRadius: '14px',
            },
        },
    },
});
```

## 4. Layout Primitives

Prefer `Container`, `Section`, `Grid`, `Stack`, `Inline` to keep layout consistent without utility frameworks.

```vue
<Section background="surface">
    <Container size="xl">
        <Stack gap="1rem">
            <PageHeader title="Dashboard" subtitle="Overview and activity" />
            <Grid :columns="12" gap="1rem">
                <GridItem :span="12" :breakpoints="{ md: { span: 4 } }"><Card>Left</Card></GridItem>
                <GridItem :span="12" :breakpoints="{ md: { span: 8 } }"><Card>Right</Card></GridItem>
            </Grid>
        </Stack>
    </Container>
</Section>
```

## 5. Build Notes

- No Tailwind PostCSS plugin is required.
- Use your existing Vite/Webpack CSS pipeline (CSS/SCSS modules or global styles).
- Keep token overrides in one place to avoid per-page style drift.
