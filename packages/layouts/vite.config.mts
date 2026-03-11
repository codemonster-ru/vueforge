import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            include: ['src/**/*.ts', 'src/**/*.vue'],
            exclude: ['../../src/docs/**', '../../src/**/*.test.ts', '../../src/**/__tests__/**'],
            insertTypesEntry: true,
            outDir: 'dist',
            strictOutput: true,
            rollupTypes: true,
        }),
    ],
    resolve: {
        alias: [
            { find: '@core', replacement: fileURLToPath(new URL('../vueforge/src', import.meta.url)) },
            { find: '@', replacement: fileURLToPath(new URL('../../src', import.meta.url)) },
        ],
    },
    build: {
        emptyOutDir: true,
        cssCodeSplit: true,
        lib: {
            name: 'vueforgeLayouts',
            entry: resolve(__dirname, './src/index.ts'),
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
});
