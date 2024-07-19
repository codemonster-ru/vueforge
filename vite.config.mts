import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { copyFileSync } from 'node:fs';
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
                        return `${fileName}/${fileName}.css`;
                    }

                    return assetInfo.name;
                },
            },
        },
    },
});