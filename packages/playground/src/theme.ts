import type { App, Plugin } from 'vue';

import VuePlayground from './VuePlayground.vue';

export type ThemeMode = 'light' | 'dark';

export type VuePlaygroundThemeTokenName =
  | 'fontFamily'
  | 'surface'
  | 'surfaceMuted'
  | 'border'
  | 'text'
  | 'textMuted'
  | 'tabBg'
  | 'tabText'
  | 'tabBorder'
  | 'tabActiveBg'
  | 'tabActiveText'
  | 'runBg'
  | 'runText'
  | 'runBorder'
  | 'consoleBg'
  | 'consoleText'
  | 'ssrHint'
  | 'iframeBg'
  | 'radiusMd'
  | 'radiusLg';

export type VuePlaygroundThemeTokens = Record<VuePlaygroundThemeTokenName, string>;

export interface VuePlaygroundThemeConfig {
  light?: Partial<VuePlaygroundThemeTokens>;
  dark?: Partial<VuePlaygroundThemeTokens>;
  target?: string;
}

export interface VuePlaygroundPluginOptions {
  componentName?: string;
  theme?: VuePlaygroundThemeConfig;
}

const LIGHT_TOKENS: VuePlaygroundThemeTokens = {
  fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
  surface: '#ffffff',
  surfaceMuted: '#f3f3f3',
  border: '#d9dde3',
  text: '#1f232b',
  textMuted: '#616773',
  tabBg: '#f3f3f3',
  tabText: '#1f232b',
  tabBorder: '#d9dde3',
  tabActiveBg: '#0e639c',
  tabActiveText: '#ffffff',
  runBg: '#0e639c',
  runText: '#ffffff',
  runBorder: '#0e639c',
  consoleBg: '#252526',
  consoleText: '#ffffff',
  ssrHint: '#616773',
  iframeBg: '#ffffff',
  radiusMd: '10px',
  radiusLg: '14px'
};

const DARK_TOKENS: VuePlaygroundThemeTokens = {
  fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
  surface: '#252526',
  surfaceMuted: '#2d2f33',
  border: '#3f434a',
  text: '#f2f3f5',
  textMuted: '#b0b6c0',
  tabBg: '#2d2f33',
  tabText: '#f2f3f5',
  tabBorder: '#3f434a',
  tabActiveBg: '#0e639c',
  tabActiveText: '#ffffff',
  runBg: '#0e639c',
  runText: '#ffffff',
  runBorder: '#0e639c',
  consoleBg: '#1f2023',
  consoleText: '#ffffff',
  ssrHint: '#b0b6c0',
  iframeBg: '#ffffff',
  radiusMd: '10px',
  radiusLg: '14px'
};

const TOKEN_VAR_MAP: Record<VuePlaygroundThemeTokenName, string> = {
  fontFamily: '--cm-pg-font-family',
  surface: '--cm-pg-surface',
  surfaceMuted: '--cm-pg-surface-muted',
  border: '--cm-pg-border',
  text: '--cm-pg-text',
  textMuted: '--cm-pg-text-muted',
  tabBg: '--cm-pg-tab-bg',
  tabText: '--cm-pg-tab-text',
  tabBorder: '--cm-pg-tab-border',
  tabActiveBg: '--cm-pg-tab-active-bg',
  tabActiveText: '--cm-pg-tab-active-text',
  runBg: '--cm-pg-run-bg',
  runText: '--cm-pg-run-text',
  runBorder: '--cm-pg-run-border',
  consoleBg: '--cm-pg-console-bg',
  consoleText: '--cm-pg-console-text',
  ssrHint: '--cm-pg-ssr-hint',
  iframeBg: '--cm-pg-iframe-bg',
  radiusMd: '--cm-pg-radius-md',
  radiusLg: '--cm-pg-radius-lg'
};

function resolveTarget(target?: string): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  if (!target) {
    return document.documentElement;
  }

  return document.querySelector(target);
}

function applyTokens(mode: ThemeMode, overrides?: Partial<VuePlaygroundThemeTokens>, target?: string): void {
  const element = resolveTarget(target);
  if (!element) {
    return;
  }

  const base = mode === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;
  const merged: VuePlaygroundThemeTokens = {
    ...base,
    ...(overrides ?? {})
  };

  for (const [tokenName, cssVarName] of Object.entries(TOKEN_VAR_MAP)) {
    const value = merged[tokenName as VuePlaygroundThemeTokenName];
    element.style.setProperty(`--cm-pg-${mode}-${cssVarName.replace('--cm-pg-', '')}`, value);
  }
}

export function setVuePlaygroundTheme(config: VuePlaygroundThemeConfig = {}): void {
  applyTokens('light', config.light, config.target);
  applyTokens('dark', config.dark, config.target);
}

export const VuePlaygroundPlugin: Plugin = {
  install(app: App, options: VuePlaygroundPluginOptions = {}) {
    app.component(options.componentName ?? 'VuePlayground', VuePlayground);

    if (options.theme) {
      const target = options.theme.target;
      applyTokens('light', options.theme.light, target);
      applyTokens('dark', options.theme.dark, target);
    }
  }
};

export const vuePlaygroundDefaultLightTokens = LIGHT_TOKENS;
export const vuePlaygroundDefaultDarkTokens = DARK_TOKENS;
