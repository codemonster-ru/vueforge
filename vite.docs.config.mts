import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
    root: 'apps/docs',
    plugins: [vue()],
    resolve: {
        alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
    },
    build: {
        outDir: '../../dist/docs',
        emptyOutDir: true,
    },
});
