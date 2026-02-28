import { createApp } from 'vue';
import { VueForge, DefaultTheme } from '@/index';
import { createRouter, createWebHistory } from 'vue-router';
import App from '@/example/App.vue';
import HomeView from './views/HomeView.vue';
import VisualRegressionView from './views/VisualRegressionView.vue';
import PerformanceBenchmarkView from './views/PerformanceBenchmarkView.vue';
import PlaygroundView from './views/PlaygroundView.vue';
import DocsAppView from '@/docs/DocsAppView.vue';
import { docsRoutes, firstComponentsRoute, firstDocsRoute } from '@/docs/docs-structure';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: firstDocsRoute,
        },
        {
            path: '/examples',
            component: HomeView,
        },
        {
            path: '/visual-regression',
            component: VisualRegressionView,
        },
        {
            path: '/performance-benchmark',
            component: PerformanceBenchmarkView,
        },
        {
            path: '/playground',
            component: PlaygroundView,
        },
        {
            path: '/docs',
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
const app = createApp(App);

app.use(router);
app.use(VueForge, {
    theme: {
        preset: DefaultTheme,
    },
});
app.mount('#app');
