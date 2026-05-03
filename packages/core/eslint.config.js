import { createVueTsConfig } from '../../eslint.base.mjs';

export default createVueTsConfig({
  ignores: ['dist/**', 'coverage/**'],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
});
