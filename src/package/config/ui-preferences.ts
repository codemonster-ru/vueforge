export type DensityPreset = 'normal' | 'comfortable' | 'compact';

type UiPreferencesState = {
    density: DensityPreset;
    reducedMotion: boolean;
};

const state: UiPreferencesState = {
    density: 'normal',
    reducedMotion: false,
};

const ensureStyleElement = () => {
    if (typeof document === 'undefined') {
        return null;
    }

    const existing = document.getElementById('vueforge-ui-preferences');

    if (existing && existing.tagName.toLowerCase() === 'style') {
        return existing as HTMLStyleElement;
    }

    const style = document.createElement('style');
    style.id = 'vueforge-ui-preferences';
    document.head.appendChild(style);

    return style;
};

const applyPreferences = () => {
    if (typeof document === 'undefined') {
        return;
    }

    const root = document.documentElement;
    if (state.density === 'normal') {
        root.removeAttribute('data-vf-density');
    } else {
        root.setAttribute('data-vf-density', state.density);
    }

    if (state.reducedMotion) {
        root.setAttribute('data-vf-reduced-motion', 'true');
    } else {
        root.removeAttribute('data-vf-reduced-motion');
    }

    const style = ensureStyleElement();
    if (!style) {
        return;
    }

    style.textContent = `
:root {
  --vf-motion-duration-fast: 120ms;
  --vf-motion-duration-normal: 200ms;
  --vf-motion-duration-slow: 320ms;
  --vf-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
}
:root[data-vf-density='comfortable'] {
  --vf-controls-height: 3rem;
  --vf-typography-font-size: 1rem;
}
:root[data-vf-density='compact'] {
  --vf-controls-height: 2.25rem;
  --vf-typography-font-size: 0.875rem;
}
:root[data-vf-reduced-motion='true'] * {
  animation-duration: 1ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 1ms !important;
  scroll-behavior: auto !important;
}
@media (prefers-reduced-motion: reduce) {
  :root * {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
`;
};

export const setDensityPreset = (density: DensityPreset) => {
    state.density = density;
    applyPreferences();
};

export const getDensityPreset = () => state.density;

export const setReducedMotion = (value: boolean) => {
    state.reducedMotion = Boolean(value);
    applyPreferences();
};

export const getReducedMotion = () => state.reducedMotion;

export const getUiPreferences = () => ({
    density: state.density,
    reducedMotion: state.reducedMotion,
});

export const applyUiPreferences = (preferences: Partial<UiPreferencesState>) => {
    if (preferences.density) {
        setDensityPreset(preferences.density);
    }

    if (preferences.reducedMotion !== undefined) {
        setReducedMotion(preferences.reducedMotion);
    }
};
