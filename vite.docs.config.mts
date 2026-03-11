import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

const getAlphaChunkSuffix = (id: string) => {
    const fileName =
        id
            .split('/')
            .at(-1)
            ?.replace(/\.[^.]+$/u, '')
            .toLowerCase() ?? '';
    const firstCharacter = fileName.charAt(0);

    if (firstCharacter >= 'a' && firstCharacter <= 'f') {
        return 'a-f';
    }

    if (firstCharacter >= 'g' && firstCharacter <= 'm') {
        return 'g-m';
    }

    if (firstCharacter >= 'n' && firstCharacter <= 's') {
        return 'n-s';
    }

    return 't-z';
};

export default defineConfig({
    root: 'apps/docs',
    plugins: [vue()],
    resolve: {
        alias: [
            { find: '@core', replacement: fileURLToPath(new URL('./packages/vueforge/src', import.meta.url)) },
            { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        ],
    },
    build: {
        outDir: '../../dist/docs',
        emptyOutDir: true,
        chunkSizeWarningLimit: 650,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    const normalizedId = id.replace(/\\/g, '/');

                    if (normalizedId.includes('/src/docs/DocsExamplePreview.vue')) {
                        return 'docs-preview-runtime';
                    }

                    if (normalizedId.includes('/packages/vueforge/src/components/')) {
                        return 'docs-preview-core';
                    }

                    if (normalizedId.includes('/packages/layouts/src/components/')) {
                        return 'docs-preview-layouts';
                    }

                    if (normalizedId.includes('/docs/components/')) {
                        return `docs-content-components-${getAlphaChunkSuffix(normalizedId)}`;
                    }

                    if (
                        normalizedId.includes('/docs/guides/') ||
                        normalizedId.includes('/docs/recipes/') ||
                        normalizedId.includes('/docs/audits/') ||
                        normalizedId.includes('/docs/accessibility/') ||
                        normalizedId.includes('/docs/contributing/') ||
                        normalizedId.includes('/docs/migrations/')
                    ) {
                        return 'docs-content-guides';
                    }

                    if (
                        normalizedId.includes('/src/docs/docs-markdown.ts') ||
                        normalizedId.includes('/src/docs/docs-features.ts') ||
                        normalizedId.includes('/src/docs/docs-structure.ts') ||
                        normalizedId.includes('/docs/browser-support.md') ||
                        normalizedId.includes('/docs/theming.md') ||
                        normalizedId.includes('/docs/api-conventions.md')
                    ) {
                        return 'docs-content-core';
                    }

                    if (
                        normalizedId.includes('/node_modules/vue/') ||
                        normalizedId.includes('/node_modules/vue-router/') ||
                        normalizedId.includes('/node_modules/@vue/')
                    ) {
                        return 'vue-vendor';
                    }

                    if (normalizedId.includes('/node_modules/@codemonster-ru/vue-codeblock/')) {
                        return 'codeblock-vendor';
                    }
                },
            },
        },
    },
});
