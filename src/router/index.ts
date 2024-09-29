import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    routes: [
        {
            path: '/',
            component: () => import('@/views/HomeView.vue'),
        },
    ],
    history: createWebHistory(),
});

export { router };