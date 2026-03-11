import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => {
    const entry = mode === 'development' ? './src/docs/main.ts' : './src/index.ts';

    return {
        plugins: [
            vue(),
            dts({
                include: ['src/index.ts'],
                exclude: ['src/docs/**', 'src/**/*.test.ts', 'src/**/__tests__/**'],
                insertTypesEntry: true,
                outDir: 'dist',
            }),
        ],
        resolve: {
            alias: [
                { find: '@core', replacement: fileURLToPath(new URL('./packages/vueforge/src', import.meta.url)) },
                { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
            ],
        },
        test: {
            globals: true,
            environment: 'jsdom',
            include: ['src/**/*.test.ts', 'packages/**/*.test.ts', 'tests/**/*.test.ts'],
            server: {
                deps: {
                    inline: ['@codemonster-ru/vueiconify'],
                },
            },
        },
        build: {
            emptyOutDir: true,
            cssCodeSplit: true,
            lib: {
                name: 'index',
                entry: resolve(__dirname, entry),
                fileName: 'index.ts',
                formats: ['es', 'umd'],
            },
            rollupOptions: {
                external: ['vue', 'vue-router', '@codemonster-ru/vueiconify'],
                output: {
                    globals: {
                        vue: 'Vue',
                        'vue-router': 'VueRouter',
                        '@codemonster-ru/vueiconify': 'index',
                    },
                },
            },
        },
    };
});
