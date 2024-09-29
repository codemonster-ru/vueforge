import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { copyFileSync, unlinkSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const config = {
    dev: {
        name: 'dev',
        entry: resolve(__dirname, './src/main.ts'),
        fileName: 'main.ts',
    },
    docs: {
        name: 'docs',
        entry: resolve(__dirname, './src/main.ts'),
        fileName: 'main.ts',
    },
    index: {
        name: 'index',
        entry: resolve(__dirname, './src/lib/index.ts'),
        fileName: 'index.ts',
        formats: ['es', 'umd'],
    },
    styles: {
        name: 'styles',
        entry: resolve(__dirname, './src/lib/styles.ts'),
        fileName: 'styles.js',
        formats: ['es', 'umd'],
    },
    theme: {
        name: 'theme',
        entry: resolve(__dirname, './src/lib/theme.ts'),
        fileName: 'theme.js',
        formats: ['es', 'umd'],
    },
    colors: {
        name: 'colors',
        entry: resolve(__dirname, './src/lib/colors.ts'),
        fileName: 'colors.js',
        formats: ['es', 'umd'],
    },
};

const currentConfig = config[process.env.LIB_NAME];

if (currentConfig === undefined) {
    throw new Error('LIB_NAME is not defined or is not valid');
}

const removeUnnecessary = () => {
    if (process.env.LIB_NAME === 'docs') {
        if (existsSync('dist/lib')) rmSync('dist/lib', { recursive: true, force: true });
    } else {
        if (existsSync('dist/styles.d.ts')) copyFileSync('dist/index.d.ts', 'dist/index.d.mts');
        if (existsSync('dist/styles.d.ts')) unlinkSync('dist/styles.d.ts');
        if (existsSync('dist/styles.js.mjs')) unlinkSync('dist/styles.js.mjs');
        if (existsSync('dist/styles.js.umd.js')) unlinkSync('dist/styles.js.umd.js');
        if (existsSync('dist/theme.d.ts')) unlinkSync('dist/theme.d.ts');
        if (existsSync('dist/theme.js.mjs')) unlinkSync('dist/theme.js.mjs');
        if (existsSync('dist/theme.js.umd.js')) unlinkSync('dist/theme.js.umd.js');
        if (existsSync('dist/colors.d.ts')) unlinkSync('dist/colors.d.ts');
        if (existsSync('dist/colors.js.mjs')) unlinkSync('dist/colors.js.mjs');
        if (existsSync('dist/colors.js.umd.js')) unlinkSync('dist/colors.js.umd.js');
    }
};

let viteConfig = {
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
};

if (process.env.LIB_NAME !== 'docs') {
    viteConfig.build = {
        emptyOutDir: process.env.LIB_NAME === 'docs' || process.env.LIB_NAME === 'index',
        cssCodeSplit: true,
        lib: {
            ...currentConfig,
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

                    if (process.env.LIB_NAME === 'colors') {
                        return `styles/${fileName}.css`;
                    }
                },
            },
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig(viteConfig);