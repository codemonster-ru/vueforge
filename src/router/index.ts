import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    routes: [
        {
            path: '/',
            component: () => import('@/layouts/DefaultLayout.vue'),
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: () => import('@/views/HomeView.vue'),
                },
                {
                    path: 'docs',
                    name: 'docs',
                    redirect: { name: 'docs-started' },
                    component: () => import('@/layouts/DocsLayout.vue'),
                    children: [
                        {
                            path: 'started',
                            name: 'docs-started',
                            redirect: { name: 'docs-started-quick-start' },
                            children: [
                                {
                                    path: 'introduction',
                                    name: 'docs-started-introduction',
                                    component: () => import('@/views/docs/started/IntroductionView.vue'),
                                },
                                {
                                    path: 'quick-start',
                                    name: 'docs-started-quick-start',
                                    component: () => import('@/views/docs/started/QuickStartView.vue'),
                                },
                            ],
                        },
                        {
                            path: 'configuration',
                            name: 'docs-configuration',
                            component: () => import('@/views/docs/ConfigurationView.vue'),
                        },
                        {
                            path: 'theming',
                            name: 'docs-theming',
                            redirect: { name: 'docs-theming-styled' },
                            children: [
                                {
                                    path: 'styled',
                                    name: 'docs-theming-styled',
                                    component: () => import('@/views/docs/theming/StyledModeView.vue'),
                                },
                                {
                                    path: 'unstyled',
                                    name: 'docs-theming-unstyled',
                                    component: () => import('@/views/docs/theming/UnstyledModeView.vue'),
                                },
                            ],
                        },
                        {
                            path: 'components',
                            name: 'docs-components',
                            redirect: { name: 'docs-components-button' },
                            children: [
                                {
                                    path: 'button',
                                    name: 'docs-components-button',
                                    component: () => import('@/views/docs/components/ButtonView.vue'),
                                },
                            ],
                        },
                        {
                            path: 'icons',
                            name: 'docs-icons',
                            redirect: { name: 'docs-icons-system' },
                            children: [
                                {
                                    path: 'system',
                                    name: 'docs-icons-system',
                                    component: () => import('@/views/docs/icons/SystemIconsView.vue'),
                                },
                                {
                                    path: 'custom',
                                    name: 'docs-icons-custom',
                                    component: () => import('@/views/docs/icons/CustomIconsView.vue'),
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    history: createWebHistory(),
});

export { router };