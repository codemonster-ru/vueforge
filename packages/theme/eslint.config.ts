import { createTsConfig } from '../../eslint.base.mjs';

export default createTsConfig({
  ignores: ['dist/**', 'coverage/**'],
});
