# Density and Motion Setup

VueForge supports runtime UI preferences for density and motion:

- density presets: `normal`, `comfortable`, `compact`
- reduced motion toggle

## Plugin setup

```ts
app.use(VueForge, {
    density: 'compact',
    reducedMotion: false,
});
```

## Runtime API

```ts
import {
    applyUiPreferences,
    getDensityPreset,
    getReducedMotion,
    getUiPreferences,
    setDensityPreset,
    setReducedMotion,
} from '@codemonster-ru/vueforge';

setDensityPreset('comfortable');
setReducedMotion(true);
applyUiPreferences({ density: 'compact', reducedMotion: false });

const density = getDensityPreset();
const reduced = getReducedMotion();
const ui = getUiPreferences();
```

## Behavior

- Density presets update root `data-vf-density` and adjust shared sizing CSS variables.
- Reduced motion updates root `data-vf-reduced-motion` and minimizes animation/transition durations.
- OS preference `prefers-reduced-motion: reduce` is respected by default.
