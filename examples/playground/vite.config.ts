import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: /^@codemonster-ru\/vueforge-playground$/,
        replacement: fileURLToPath(new URL('../../packages/playground/src/index.ts', import.meta.url))
      },
      {
        find: /^@codemonster-ru\/vueforge-playground-core$/,
        replacement: fileURLToPath(new URL('../../packages/playground-core/src/index.ts', import.meta.url))
      }
    ]
  }
});
