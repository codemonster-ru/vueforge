import { createApp } from 'vue';
import { VueForge, DefaultTheme } from '@/index';
import { createRouter, createWebHistory } from 'vue-router';
import App from '@/example/App.vue';
import HomeView from './views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: HomeView,
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
