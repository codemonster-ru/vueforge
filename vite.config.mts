import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { copyFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            afterBuild: () => {
                copyFileSync('dist/index.d.ts', 'dist/index.d.mts');
            },
        }),
    ],
    resolve: {
        alias: [
            { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        ],
    },
    build: {
        cssCodeSplit: true,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'index',
            fileName: 'index',
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
                assetFileNames: (assetInfo) => {
                    if (/\.css$/.test(assetInfo.name ?? '')) {
                        const fileName = assetInfo.name.replace('.css', '');

                        if (fileName === 'index') {
                            return `theme.css`;
                        }

                        return `${fileName}/${fileName}.css`;
                    }

                    return assetInfo.name;
                },
            },
        },
    },
});