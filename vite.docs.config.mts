import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
    },
    build: {
        outDir: 'dist/docs',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                docs: fileURLToPath(new URL('./docs-index.html', import.meta.url)),
            },
        },
    },
});
