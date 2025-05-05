import { createApp } from 'vue';
import { VueForge, DefaultTheme } from '@/index';
import { createRouter, createWebHistory } from 'vue-router';
import App from '@/example/App.vue';
import HomeView from './views/HomeView.vue';
import LayoutsView from './views/layouts/LayoutsView.vue';
import DefaultLayoutView from './views/layouts/DefaultLayoutView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: HomeView,
        },
        {
            path: '/layouts',
            redirect: '/layouts/default',
            component: LayoutsView,
            children: [
                {
                    path: 'default',
                    component: DefaultLayoutView,
                },
            ],
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
