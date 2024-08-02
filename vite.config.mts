import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { copyFileSync, unlinkSync, existsSync } from 'node:fs';
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
    theme: {
        name: 'theme',
        entry: resolve(__dirname, './src/theme.ts'),
        fileName: 'theme.js',
    },
};

const currentConfig = config[process.env.LIB_NAME];

if (currentConfig === undefined) {
    throw new Error('LIB_NAME is not defined or is not valid');
}

const removeUnnecessary = () => {
    if (existsSync('dist/styles.d.ts')) copyFileSync('dist/index.d.ts', 'dist/index.d.mts');
    if (existsSync('dist/styles.d.ts')) unlinkSync('dist/styles.d.ts');
    if (existsSync('dist/styles.js.mjs')) unlinkSync('dist/styles.js.mjs');
    if (existsSync('dist/styles.js.umd.js')) unlinkSync('dist/styles.js.umd.js');
    if (existsSync('dist/theme.d.ts')) unlinkSync('dist/theme.d.ts');
    if (existsSync('dist/theme.js.mjs')) unlinkSync('dist/theme.js.mjs');
    if (existsSync('dist/theme.js.umd.js')) unlinkSync('dist/theme.js.umd.js');
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            afterBuild: () => {
                setTimeout(removeUnnecessary, 50);
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
                            return `components/${fileName}/${fileName}.css`;
                        }

                        return assetInfo.name;
                    }

                    if (process.env.LIB_NAME === 'styles') {
                        return `styles/${fileName}.css`;
                    }

                    if (process.env.LIB_NAME === 'theme') {
                        return `styles/${fileName}.css`;
                    }
                },
            },
        },
    },
});