import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import DocsAppView from './DocsAppView.vue';
import { docsRoutes, firstComponentsRoute, firstDocsRoute } from './docs-structure';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: firstDocsRoute,
        },
        {
            path: '/playground',
            redirect: firstDocsRoute,
        },
        {
            path: '/docs/components',
            redirect: firstComponentsRoute,
        },
        ...docsRoutes
            .filter(path => path !== '/docs/components')
            .map(path => ({
                path,
                component: DocsAppView,
            })),
    ],
});

createApp(DocsAppView).use(router).mount('#app');
