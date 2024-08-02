import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { copyFileSync, unlinkSync } from 'node:fs';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const config = {
    index: {
        name: 'index',
        entry: resolve(__dirname, './src/index.ts'),
        fileName: 'index.ts',
    },
    styles: {
        name: 'styles',
        entry: resolve(__dirname, './src/styles.ts'),
        fileName: 'styles.js',
    },
};

const currentConfig = config[process.env.LIB_NAME];

if (currentConfig === undefined) {
    throw new Error('LIB_NAME is not defined or is not valid');
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            afterBuild: () => {
                if (process.env.LIB_NAME === 'index') {
                    copyFileSync('dist/index.d.ts', 'dist/index.d.mts');
                }

                if (process.env.LIB_NAME === 'styles') {
                    setTimeout(function() {
                        unlinkSync('dist/styles.d.ts');
                        unlinkSync('dist/styles.js.mjs');
                        unlinkSync('dist/styles.js.umd.js');
                    }, 100);
                }
            },
        }),
    ],
    resolve: {
        alias: [
            { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        ],
    },
    build: {
        emptyOutDir: process.env.LIB_NAME === 'index',
        cssCodeSplit: true,
        lib: {
            ...currentConfig,
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
                assetFileNames: (assetInfo) => {
                    const fileName = assetInfo.name.replace('.css', '');

                    if (process.env.LIB_NAME === 'index') {
                        if (/\.css$/.test(assetInfo.name ?? '')) {

                            if (fileName === 'index') {
                                return `theme.css`;
                            }

                            if (/Theme$/.test(fileName)) {
                                let folder = fileName.replace('Theme', '');

                                return `components/${folder}/theme.css`;
                            }

                            return `components/${fileName}/${fileName}.css`;
                        }

                        return assetInfo.name;
                    }

                    if (process.env.LIB_NAME === 'styles') {
                        return `styles/${fileName}.css`;
                    }
                },
            },
        },
    },
});