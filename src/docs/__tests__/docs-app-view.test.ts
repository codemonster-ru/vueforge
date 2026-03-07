import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { vi } from 'vitest';
import DocsAppView from '../DocsAppView.vue';
import { docsPages, docsRoutes, firstDocsRoute } from '../docs-structure';

vi.mock('@codemonster-ru/vueiconify', () => ({
    VueIconify: {
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
        const router = createTestRouter('/docs/components/button');
        router.push('/docs/components/button');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('.vf-docs__title').text()).toBe('Button');
        expect(wrapper.find('.vf-panelmenu-node__link.is-active').text()).toBe('Button');
        expect(wrapper.find('[data-testid="vf-docs-markdown"]').text()).toContain(
            'Trigger actions with a clear visual hierarchy, optional icons, loading feedback, and link-style navigation.',
        );
        expect(wrapper.find('[data-testid="vf-docs-markdown"] pre code').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-example-block"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-example-preview"]').text()).toContain('Save');
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

    it('does not render example blocks for non-component docs pages', async () => {
        const router = createTestRouter('/docs/theming');
        router.push('/docs/theming');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-example-block"]').exists()).toBe(false);
    });

    it('renders example blocks for additional component docs routes', async () => {
        const router = createTestRouter('/docs/components/textarea');
        router.push('/docs/components/textarea');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-example-block"]').exists()).toBe(true);
    });

    it('renders textarea examples without preview warnings', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const router = createTestRouter('/docs/components/textarea');
        router.push('/docs/components/textarea');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        await nextTick();
        await nextTick();

        expect(wrapper.find('[data-testid="vf-docs-example-preview"]').exists()).toBe(true);

        const warnings = warnSpy.mock.calls.map(([message]) => String(message));
        expect(
            warnings.some(message => message.includes('Expected Number with value 4, got String with value "4"')),
        ).toBe(false);
        expect(warnings.some(message => message.includes('Property undefined was accessed during render'))).toBe(false);

        warnSpy.mockRestore();
    });

    it('renders live preview for simple v-model-only examples', async () => {
        const router = createTestRouter('/docs/components/accordion-accordionitem');
        router.push('/docs/components/accordion-accordionitem');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-example-block"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-example-preview"] .vf-accordion__header').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-example-preview"]').text()).toContain('Shipping');
        expect(wrapper.text()).not.toContain('Live preview is not available for this example yet.');
    });

    it('renders live preview for self-contained activity feed examples', async () => {
        const router = createTestRouter('/docs/components/activityfeed');
        router.push('/docs/components/activityfeed');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-example-block"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-example-preview"]').text()).toContain('Invoice approved');
        expect(wrapper.text()).toContain('Design review scheduled');
        expect(wrapper.text()).not.toContain('Live preview is not available for this example yet.');
    });

    it('renders live preview for self-contained advanced filter panel examples', async () => {
        const router = createTestRouter('/docs/components/advancedfilterpanel');
        router.push('/docs/components/advancedfilterpanel');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-example-preview"]').text()).toContain('Status');
        expect(wrapper.find('[data-testid="vf-docs-example-preview"]').text()).toContain('Apply');
        expect(wrapper.text()).toContain('Search by owner');
    });

    it('renders alert examples that use nested slot templates', async () => {
        const router = createTestRouter('/docs/components/alert');
        router.push('/docs/components/alert');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain('Retry payment');
        expect(wrapper.text()).toContain('Workspace notice');
    });

    it('renders acronym and demo-only nested components inside docs preview', async () => {
        const blockRouter = createTestRouter('/docs/components/blockui');
        blockRouter.push('/docs/components/blockui');
        await blockRouter.isReady();

        const blockWrapper = mount(DocsAppView, {
            global: {
                plugins: [blockRouter],
            },
        });

        expect(blockWrapper.text()).toContain('Saving changes');
        expect(blockWrapper.text()).toContain('Form content');
        expect(blockWrapper.text()).toContain('Release dashboard');
        expect(blockWrapper.text()).toContain('Workspace summary');
        expect(blockWrapper.find('[data-testid="vf-docs-example-preview"] .vf-blockui__overlay_fullscreen').exists()).toBe(
            false,
        );
        expect(blockWrapper.find('[data-testid="vf-docs-example-preview"] .vf-blockui__overlay').exists()).toBe(true);

        const themeRouter = createTestRouter('/docs/components/themeprovider');
        themeRouter.push('/docs/components/themeprovider');
        await themeRouter.isReady();

        const themeWrapper = mount(DocsAppView, {
            global: {
                plugins: [themeRouter],
            },
        });

        expect(themeWrapper.find('.vf-docs-demo-stub').exists()).toBe(true);
        expect(themeWrapper.text()).toContain('Dashboard Sidebar');
    });

    it('renders avatar group examples that reuse shared members data across blocks', async () => {
        const router = createTestRouter('/docs/components/avatargroup');
        router.push('/docs/components/avatargroup');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('.vf-avatar-group__item').exists()).toBe(true);
        expect(wrapper.text()).toContain('Ada Lovelace');
    });

    it('renders meter group and timeline examples that reuse shared collections across blocks', async () => {
        const meterRouter = createTestRouter('/docs/components/metergroup');
        meterRouter.push('/docs/components/metergroup');
        await meterRouter.isReady();

        const meterWrapper = mount(DocsAppView, {
            global: {
                plugins: [meterRouter],
            },
        });

        expect(meterWrapper.text()).toContain('CPU');
        expect(meterWrapper.text()).toContain('API latency');

        const timelineRouter = createTestRouter('/docs/components/timeline');
        timelineRouter.push('/docs/components/timeline');
        await timelineRouter.isReady();

        const timelineWrapper = mount(DocsAppView, {
            global: {
                plugins: [timelineRouter],
            },
        });

        expect(timelineWrapper.text()).toContain('Created');
        expect(timelineWrapper.text()).toContain('Done');
    });

    it('renders bottom navigation examples inside the preview frame on desktop docs layout', async () => {
        const router = createTestRouter('/docs/components/bottomnavigation');
        router.push('/docs/components/bottomnavigation');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('.vf-bottom-navigation').exists()).toBe(true);
        expect(wrapper.text()).toContain('Home');
        expect(wrapper.text()).toContain('Search');
        expect(wrapper.findAll('[data-testid="vf-docs-example-preview"] .vf-icon-stub').length).toBeGreaterThan(0);
        expect(wrapper.find('[data-testid="vf-docs-example-preview"] .vf-bottom-navigation_fixed').exists()).toBe(
            false,
        );
        expect(
            wrapper.find('[data-testid="vf-docs-example-preview"] .vf-bottom-navigation_mobile-only').exists(),
        ).toBe(false);
    });

    it('renders bottom sheet examples inside preview blocks instead of teleporting into the page', async () => {
        const router = createTestRouter('/docs/components/bottomsheet');
        router.push('/docs/components/bottomsheet');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-example-preview"] .vf-bottom-sheet_preview').exists()).toBe(true);
        expect(wrapper.find('[data-testid="vf-docs-example-preview"] .vf-bottom-sheet__panel').exists()).toBe(true);
        expect(document.body.querySelector('.vf-bottom-sheet:not(.vf-bottom-sheet_preview)')).toBeNull();
    });

    it('lets stateful bottom sheet previews reset to their initial state without reloading the page', async () => {
        const router = createTestRouter('/docs/components/bottomsheet');
        router.push('/docs/components/bottomsheet');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        const preview = wrapper
            .findAll('[data-testid="vf-docs-example-preview"]')
            .find(candidate => candidate.find('.vf-bottom-sheet_preview').exists());

        expect(preview).toBeDefined();
        expect(preview?.find('.vf-bottom-sheet_preview').exists()).toBe(true);
        expect(preview?.find('[data-testid="vf-docs-example-reset"]').exists()).toBe(false);

        await preview?.find('.vf-bottom-sheet__close').trigger('click');
        await nextTick();
        await nextTick();

        expect(preview?.find('.vf-bottom-sheet_preview').exists()).toBe(false);
        expect(preview?.find('[data-testid="vf-docs-example-reset"]').text()).toBe('Open preview');

        await preview?.find('[data-testid="vf-docs-example-reset"]').trigger('click');
        await nextTick();
        await nextTick();

        expect(preview?.find('.vf-bottom-sheet_preview').exists()).toBe(true);
        expect(preview?.find('[data-testid="vf-docs-example-reset"]').exists()).toBe(false);
    });

    it('renders teleport-based overlay components inside preview blocks', async () => {
        const pages = [
            {
                route: '/docs/components/confirmdialog',
                previewSelector: '.vf-confirm-dialog .vf-modal__panel',
                bodySelector: '.vf-confirm-dialog:not(.vf-modal_preview)',
            },
            {
                route: '/docs/components/modal',
                previewSelector: '.vf-modal_preview .vf-modal__panel',
                bodySelector: '.vf-modal:not(.vf-modal_preview)',
            },
            {
                route: '/docs/components/drawer',
                previewSelector: '.vf-drawer_preview .vf-drawer__panel',
                bodySelector: '.vf-drawer:not(.vf-drawer_preview)',
            },
            {
                route: '/docs/components/notificationcenter',
                previewSelector: '.vf-notification-center_preview .vf-notification-center__panel',
                bodySelector: '.vf-notification-center:not(.vf-notification-center_preview)',
            },
            {
                route: '/docs/components/tour',
                previewSelector: '.vf-tour_preview .vf-tour__panel',
                bodySelector: '.vf-tour:not(.vf-tour_preview)',
            },
            {
                route: '/docs/components/commandpalette',
                previewSelector: '.vf-command-palette_preview .vf-command-palette__panel',
                bodySelector: '.vf-command-palette:not(.vf-command-palette_preview)',
            },
        ];

        for (const page of pages) {
            const router = createTestRouter(page.route);
            router.push(page.route);
            await router.isReady();

            const wrapper = mount(DocsAppView, {
                global: {
                    plugins: [router],
                },
            });

            expect(wrapper.find(`[data-testid="vf-docs-example-preview"] ${page.previewSelector}`).exists()).toBe(true);
            expect(document.body.querySelector(page.bodySelector)).toBeNull();
        }
    });

    it('renders the basic command palette preview with visible commands', async () => {
        const router = createTestRouter('/docs/components/commandpalette');
        router.push('/docs/components/commandpalette');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        const preview = wrapper.find('[data-testid="vf-docs-example-preview"]');
        expect(preview.find('.vf-command-palette_preview .vf-command-palette__panel').exists()).toBe(true);
        expect(preview.text()).toContain('Open docs');
        expect(preview.text()).toContain('Save and publish');
    });

    it('renders comment thread examples with demo comments', async () => {
        const router = createTestRouter('/docs/components/commentthread');
        router.push('/docs/components/commentthread');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        const preview = wrapper.find('[data-testid="vf-docs-example-preview"]');
        expect(preview.text()).toContain('Please update the copy.');
        expect(preview.text()).toContain('Updated in the latest commit.');
    });

    it('renders context menu inside preview with readable menu items', async () => {
        const router = createTestRouter('/docs/components/contextmenu');
        router.push('/docs/components/contextmenu');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        const preview = wrapper.find('[data-testid="vf-docs-example-preview"]');
        const target = preview.find('.vf-context-menu_preview');

        await target.trigger('contextmenu');
        await nextTick();

        expect(preview.find('.vf-context-menu__panel').exists()).toBe(true);
        expect(preview.text()).toContain('Open');
        expect(preview.text()).toContain('Duplicate');
    });

    it('renders datatable examples with shared demo columns and rows', async () => {
        const router = createTestRouter('/docs/components/datatable');
        router.push('/docs/components/datatable');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        const previews = wrapper.findAll('[data-testid="vf-docs-example-preview"]');
        expect(previews.length).toBeGreaterThan(1);
        expect(wrapper.text()).toContain('Alice');
        expect(wrapper.text()).toContain('Platform');
        expect(wrapper.text()).toContain('Details for Alice');
    });

    it('renders dataview examples with shared demo items', async () => {
        const router = createTestRouter('/docs/components/dataview');
        router.push('/docs/components/dataview');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain('Starter kit');
        expect(wrapper.text()).toContain('Admin dashboard');
        expect(wrapper.text()).toContain('No products');
    });

    it('renders confirm popup examples inline inside the preview frame', async () => {
        const router = createTestRouter('/docs/components/confirmpopup');
        router.push('/docs/components/confirmpopup');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        const previews = wrapper.findAll('[data-testid="vf-docs-example-preview"]');
        expect(previews.length).toBeGreaterThan(0);
        expect(wrapper.findAll('.vf-confirm-popup_preview .vf-popover__wrapper')).toHaveLength(0);

        const preview = previews[0];
        await preview.find('.vf-confirm-popup_preview .vf-popover__button').trigger('click');
        await nextTick();

        expect(preview.find('.vf-confirm-popup_preview .vf-popover__wrapper').exists()).toBe(true);
        expect(preview.text()).toContain('Delete row?');
    });

    it('renders chart wrapper examples with the built-in docs adapter', async () => {
        const router = createTestRouter('/docs/components/areachart');
        router.push('/docs/components/areachart');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-example-preview"]').exists()).toBe(true);
        expect(wrapper.find('.vf-docs-demo-chart__surface').exists()).toBe(true);
        expect(wrapper.text()).toContain('Q1');
    });

    it('renders bubble chart examples with chart-specific series fallbacks', async () => {
        const router = createTestRouter('/docs/components/bubblechart');
        router.push('/docs/components/bubblechart');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-example-preview"]').exists()).toBe(true);
        expect(wrapper.find('.vf-docs-demo-chart__surface').exists()).toBe(true);
        expect(wrapper.findAll('.vf-docs-demo-chart__bubble').length).toBeGreaterThan(0);
        expect(wrapper.text()).toContain('Accounts');
        expect(wrapper.text()).not.toContain('props.series.map is not a function');
    });

    it('renders base chart examples with the built-in docs adapter and table fallback control', async () => {
        const router = createTestRouter('/docs/components/chart');
        router.push('/docs/components/chart');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        const accessibleFallbackBlock = wrapper
            .findAll('[data-testid="vf-docs-example-block"]')
            .find(candidate => candidate.text().includes('Accessible Table Fallback'));

        expect(accessibleFallbackBlock).toBeDefined();
        expect(accessibleFallbackBlock?.find('[data-testid="vf-docs-example-preview"] .vf-docs-demo-chart__surface').exists()).toBe(true);
        expect(accessibleFallbackBlock?.text()).toContain('Show data table');
        expect(accessibleFallbackBlock?.text()).toContain('Revenue increased over the last four quarters.');
    });

    it('renders code editor examples with the built-in docs adapter', async () => {
        const router = createTestRouter('/docs/components/codeeditor');
        router.push('/docs/components/codeeditor');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        const basicBlock = wrapper
            .findAll('[data-testid="vf-docs-example-block"]')
            .find(candidate => candidate.text().includes('Basic'));

        expect(basicBlock).toBeDefined();
        expect(basicBlock?.find('[data-testid="vf-docs-example-preview"]').exists()).toBe(true);
        expect(basicBlock?.find('.vf-docs-demo-editor').exists()).toBe(true);
        expect((basicBlock?.find('.vf-docs-demo-editor').element as HTMLTextAreaElement).value).toContain(
            'export const releaseChannels',
        );
        expect(basicBlock?.findAll('.vf-code-editor__meta').at(-1)?.text()).toBe('Editable');

        const readonlyBlock = wrapper
            .findAll('[data-testid="vf-docs-example-block"]')
            .find(candidate => candidate.text().includes('Readonly Review'));

        expect(readonlyBlock).toBeDefined();
        expect(readonlyBlock?.findAll('.vf-code-editor__meta').at(-1)?.text()).toBe('Read-only');
        expect((readonlyBlock?.find('.vf-docs-demo-editor').element as HTMLTextAreaElement).value).toContain(
            '"environment": "staging"',
        );
    });

    it('renders carousel examples with docs-specific slide data', async () => {
        const router = createTestRouter('/docs/components/carousel');
        router.push('/docs/components/carousel');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-example-preview"] .vf-carousel').exists()).toBe(true);
        expect(wrapper.text()).toContain('Launch faster');
        expect(wrapper.text()).toContain('3 teams onboarded');
    });

    it('renders selection pattern examples without script-only dependencies', async () => {
        const router = createTestRouter('/docs/components/selection-patterns');
        router.push('/docs/components/selection-patterns');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find('[data-testid="vf-docs-example-preview"]').exists()).toBe(true);
        expect(wrapper.text()).toContain('Choose role');
        expect(wrapper.text()).toContain('Async search usually wires');
    });

    it('keeps fixed app bar examples visible inside docs preview', async () => {
        const router = createTestRouter('/docs/components/appbar');
        router.push('/docs/components/appbar');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain('Admin console');
    });

    it('renders self-contained app shell basic example', async () => {
        const router = createTestRouter('/docs/components/appshell');
        router.push('/docs/components/appshell');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain('Navigation');
        expect(wrapper.text()).toContain('Workspace overview');
        expect(wrapper.text()).not.toContain('Live preview is not available for this example yet.');
    });

    it('hides preview container for unsupported examples instead of rendering fallback copy', async () => {
        const router = createTestRouter('/docs/components/activityfeed');
        router.push('/docs/components/activityfeed');
        await router.isReady();

        const wrapper = mount(DocsAppView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).not.toContain('Live preview is not available for this example yet.');
    });

    it('keeps live preview available on interactive component docs pages', async () => {
        const interactivePages = docsPages
            .filter(page => page.groupKey === 'components' && !page.isIndex)
            .filter(page => /##\s+Examples\b/.test(page.markdown))
            .filter(
                page =>
                    /<script setup\b|\badapter\b|v-model|:[a-z][\w-]*="[\w[\]'{]/i.test(page.markdown) &&
                    ![
                        '/docs/components/dialogservice-confirmservice',
                        '/docs/components/dynamicdialog',
                        '/docs/components/validation',
                    ].includes(page.routePath),
            );

        const routesWithoutPreview: string[] = [];

        for (const page of interactivePages) {
            const router = createTestRouter(page.routePath);
            router.push(page.routePath);
            await router.isReady();

            const wrapper = mount(DocsAppView, {
                global: {
                    plugins: [router],
                },
            });

            await nextTick();
            await nextTick();

            const exampleBlocks = wrapper.findAll('[data-testid="vf-docs-example-block"]');
            const previewBlocks = wrapper.findAll('[data-testid="vf-docs-example-preview"]');

            if (exampleBlocks.length > 0 && previewBlocks.length === 0) {
                routesWithoutPreview.push(page.routePath);
            }
        }

        expect(routesWithoutPreview).toEqual([]);
    }, 20_000);
});
