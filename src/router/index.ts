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
                            redirect: { name: 'docs-started-setup' },
                            children: [
                                {
                                    path: 'introduction',
                                    name: 'docs-started-introduction',
                                    component: () => import('@/views/docs/started/IntroductionView.vue'),
                                },
                                {
                                    path: 'setup',
                                    name: 'docs-started-setup',
                                    component: () => import('@/views/docs/started/SetupView.vue'),
                                },
                            ],
                        },
                        {
                            path: 'installation',
                            name: 'docs-installation',
                            redirect: { name: 'docs-installation-vite' },
                            children: [
                                {
                                    path: 'vite',
                                    name: 'docs-installation-vite',
                                    component: () => import('@/views/docs/installation/ViteView.vue'),
                                },
                                {
                                    path: 'cdn',
                                    name: 'docs-installation-cdn',
                                    component: () => import('@/views/docs/installation/CdnView.vue'),
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
                            redirect: { name: 'docs-components-body' },
                            children: [
                                {
                                    path: 'body',
                                    name: 'docs-components-body',
                                    component: () => import('@/views/docs/components/BodyView.vue'),
                                },
                            ],
                        },
                        {
                            path: 'icons',
                            name: 'docs-icons',
                            redirect: { name: 'docs-icons-codemonster' },
                            children: [
                                {
                                    path: 'codemonster',
                                    name: 'docs-icons-codemonster',
                                    component: () => import('@/views/docs/icons/CodemonsterIconsView.vue'),
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