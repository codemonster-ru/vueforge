import { createVueTsConfig } from '../../eslint.base.mjs';

export default createVueTsConfig({
  ignores: ['dist/**', 'node_modules/**'],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
});
