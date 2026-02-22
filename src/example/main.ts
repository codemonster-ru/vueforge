import { createApp } from 'vue';
import { VueForge, DefaultTheme } from '@/index';
import { createRouter, createWebHistory } from 'vue-router';
import App from '@/example/App.vue';
import HomeView from './views/HomeView.vue';
import VisualRegressionView from './views/VisualRegressionView.vue';
import PerformanceBenchmarkView from './views/PerformanceBenchmarkView.vue';
import PlaygroundView from './views/PlaygroundView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
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
