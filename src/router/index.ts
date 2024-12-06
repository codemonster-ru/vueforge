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
                    meta: {
                        title: 'Vue UI component library',
                    },
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
                                    meta: {
                                        title: 'Introduction',
                                    },
                                    component: () => import('@/views/docs/started/IntroductionView.vue'),
                                },
                                {
                                    path: 'quick-start',
                                    name: 'docs-started-quick-start',
                                    meta: {
                                        title: 'Quick start',
                                    },
                                    component: () => import('@/views/docs/started/QuickStartView.vue'),
                                },
                            ],
                        },
                        {
                            path: 'configuration',
                            name: 'docs-configuration',
                            meta: {
                                title: 'Configuration',
                            },
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
                                    meta: {
                                        title: 'Styled mode',
                                    },
                                    component: () => import('@/views/docs/theming/StyledModeView.vue'),
                                },
                                {
                                    path: 'not-styled',
                                    name: 'docs-theming-not-styled',
                                    meta: {
                                        title: 'Not styled mode',
                                    },
                                    component: () => import('@/views/docs/theming/NotStyledModeView.vue'),
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
                                    meta: {
                                        title: 'Button component',
                                    },
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
                                    meta: {
                                        title: 'System icons',
                                    },
                                    component: () => import('@/views/docs/icons/SystemIconsView.vue'),
                                },
                                {
                                    path: 'custom',
                                    name: 'docs-icons-custom',
                                    meta: {
                                        title: 'Custom icons',
                                    },
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

router.beforeEach((to) => {
    let title: string = 'Default Title';

    if (Object.prototype.hasOwnProperty.call(to, 'meta') && Object.prototype.hasOwnProperty.call(to.meta, 'title')) {
        title = to.meta.title as string;
    }

    document.title = `${title} | Codemonster UI`;
});

export { router };