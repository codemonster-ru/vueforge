import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { vi } from 'vitest';
import DocsAppView from '../DocsAppView.vue';
import { docsRoutes, firstDocsRoute } from '../docs-structure';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

const createTestRouter = (path = firstDocsRoute) => {
    void path;
    return createRouter({
        history: createMemoryHistory(),
        routes: [
            {
                path: '/',
                component: { template: '<div />' },
            },
            {
                path: '/playground',
                component: { template: '<div />' },
            },
            {
                path: '/examples',
                component: { template: '<div />' },
            },
            {
                path: '/docs',
                redirect: firstDocsRoute,
            },
            ...docsRoutes.map(path => ({
                path,
                component: DocsAppView,
            })),
        ],
    });
};

describe('DocsAppView', () => {
    it('renders docs shell regions', async () => {
        const router = createTestRouter(firstDocsRoute);
        router.push(firstDocsRoute);
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-app"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-header"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-sidebar"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-content"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-footer"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-next-link"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-toc"]').exists()).toBe(true);
    });

    it('highlights active sidebar item for the current docs route', async () => {
        const router = createTestRouter('/docs/components/chart');
        router.push('/docs/components/chart');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('.vf-docs__title').text()).toBe('Chart');
        expect(wrapper.find('.vf-panelmenu-node__link.is-active').text()).toBe('Chart');
        expect(wrapper.find('[data-testid="vf-docs-markdown"]').text()).toContain(
            'Provide an adapter-based chart wrapper with a stable VueForge API',
        );
        expect(wrapper.find('[data-testid="vf-docs-markdown"] pre code').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-live-preview"]').exists()).toBe(true);
    });

    it('resolves internal markdown links to docs routes', async () => {
        const router = createTestRouter('/docs/components');
        router.push('/docs/components');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        const themingLink = wrapper
            .findAll('[data-testid="vf-docs-markdown"] a')
            .find(link => link.text().trim() === 'Theming');
        expect(themingLink).toBeDefined();
        expect(themingLink?.attributes('href')).toBe('/docs/theming');
    });

    it('filters sidebar links and opens mobile drawer', async () => {
        const router = createTestRouter('/docs/components/chart');
        router.push('/docs/components/chart');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        await wrapper.find('[data-testid="vf-docs-search"]').setValue('chart');
        const links = wrapper.findAll('.vf-panelmenu-node__link');
        expect(links.some(link => link.text().toLowerCase().includes('chart'))).toBe(true);
        expect(links.every(link => link.text().toLowerCase().includes('chart'))).toBe(true);

        await wrapper.find('[data-testid="vf-docs-mobile-toggle"]').trigger('click');
        expect(wrapper.find('[data-testid="vf-docs-mobile-drawer"]').exists()).toBe(true);
    });

    it('marks hash heading as active in the table of contents', async () => {
        const router = createTestRouter('/docs/components/chart#props');
        router.push('/docs/components/chart#props');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        await nextTick();
        await nextTick();
        const activeTocItem = wrapper.find('.vf-docs__toc-item_active');
        expect(activeTocItem.exists()).toBe(true);
        expect(activeTocItem.text()).toContain('Props');
    });

    it('does not render live preview for non-component docs pages', async () => {
        const router = createTestRouter('/docs/theming');
        router.push('/docs/theming');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-live-preview"]').exists()).toBe(false);
    });

    it('renders registry-based live preview for additional component docs routes', async () => {
        const router = createTestRouter('/docs/components/textarea');
        router.push('/docs/components/textarea');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-live-preview"]').exists()).toBe(true);
    });
});
