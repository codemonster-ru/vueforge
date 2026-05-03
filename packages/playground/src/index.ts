export { default as VuePlayground } from './VuePlayground.vue';
export type { VuePlaygroundProps } from './props';

export {
  VuePlaygroundPlugin,
  setVuePlaygroundTheme,
  vuePlaygroundDefaultDarkTokens,
  vuePlaygroundDefaultLightTokens
} from './theme';

export type {
  ThemeMode,
  VuePlaygroundPluginOptions,
  VuePlaygroundThemeConfig,
  VuePlaygroundThemeTokenName,
  VuePlaygroundThemeTokens
} from './theme';
