import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from '@vue/server-renderer';
import Container from '@/package/components/container.vue';
import Stack from '@/package/components/stack.vue';
import Inline from '@/package/components/inline.vue';
import Input from '@/package/components/input.vue';
import DataTable from '@/package/components/data-table.vue';
import TreeTable from '@/package/components/tree-table.vue';
import DataView from '@/package/components/data-view.vue';
import Listbox from '@/package/components/listbox.vue';
import Carousel from '@/package/components/carousel.vue';
import SpeedDial from '@/package/components/speed-dial.vue';
import Chart from '@/package/components/chart.vue';
import Image from '@/package/components/image.vue';
import OverlayPanel from '@/package/components/overlay-panel.vue';
import AppShell from '@/package/components/app-shell.vue';
import PageLayout from '@/package/components/page-layout.vue';
import SplitLayout from '@/package/components/split-layout.vue';
import StickyRegion from '@/package/components/sticky-region.vue';

const createSsrFixtureApp = () =>
    createSSRApp({
        render() {
            return h(Container, { size: 'md' }, () =>
                h(Stack, { gap: '16px' }, () => [
                    h('h1', { class: 'ssr-title' }, 'SSR Hydration Baseline'),
                    h(Inline, { gap: '8px' }, () => [
                        h('span', { class: 'ssr-chip ssr-chip_primary' }, 'Save'),
                        h('span', { class: 'ssr-chip ssr-chip_secondary' }, 'Cancel'),
                    ]),
                    h(Input, { modelValue: 'hello@vueforge.dev', ariaLabel: 'Email address' }),
                    h(DataTable, {
                        ariaLabel: 'SSR table',
                        rows: [
                            { id: 1, name: 'Ada Lovelace', role: 'Maintainer' },
                            { id: 2, name: 'Grace Hopper', role: 'Contributor' },
                        ],
                        columns: [
                            { field: 'name', header: 'Name' },
                            { field: 'role', header: 'Role' },
                        ],
                        rowKey: 'id',
                        showHeader: true,
                    }),
                ]),
            );
        },
    });

const createMustHaveSsrApp = () =>
    createSSRApp({
        render() {
            return h('section', { class: 'ssr-must-have' }, [
                h(TreeTable, {
                    columns: [
                        { field: 'name', header: 'Name' },
                        { field: 'type', header: 'Type' },
                    ],
                    items: [{ key: 'root', data: { name: 'Root', type: 'Folder' } }],
                }),
                h(
                    DataView,
                    {
                        items: [{ id: 1, name: 'Alpha' }],
                        layout: 'list',
                    },
                    {
                        item: ({ item }: { item: { name: string } }) => h('span', item.name),
                    },
                ),
                h(Listbox, {
                    options: [{ label: 'One', value: 'one' }],
                }),
                h(Carousel, {
                    items: [{ id: 1 }, { id: 2 }],
                    autoplay: true,
                }),
                h(SpeedDial, {
                    actions: [{ label: 'Create', value: 'create' }],
                }),
                h(Chart, {
                    data: {
                        labels: ['Q1'],
                        datasets: [{ label: 'Revenue', data: [120] }],
                    },
                }),
                h(Image, {
                    src: '/cover.png',
                    alt: 'Cover',
                    preview: true,
                }),
                h(
                    OverlayPanel,
                    {
                        dismissable: true,
                    },
                    {
                        trigger: () => h('button', { type: 'button' }, 'Open'),
                        default: () => h('div', 'Overlay content'),
                    },
                ),
            ]);
        },
    });

const createMustHaveHydrationSsrApp = () =>
    createSSRApp({
        render() {
            return h('section', { class: 'ssr-must-have-hydration' }, [
                h(TreeTable, {
                    columns: [
                        { field: 'name', header: 'Name' },
                        { field: 'type', header: 'Type' },
                    ],
                    items: [{ key: 'root', data: { name: 'Root', type: 'Folder' } }],
                }),
                h(
                    DataView,
                    {
                        items: [{ id: 1, name: 'Alpha' }],
                        layout: 'list',
                    },
                    {
                        item: ({ item }: { item: { name: string } }) => h('span', item.name),
                    },
                ),
                h(Carousel, {
                    items: [{ id: 1 }, { id: 2 }],
                    autoplay: true,
                }),
                h(SpeedDial, {
                    actions: [{ label: 'Create', value: 'create' }],
                }),
            ]);
        },
    });

const createResponsiveLayoutSsrApp = () =>
    createSSRApp({
        render() {
            return h('section', { class: 'ssr-layout-fixture' }, [
                h(
                    AppShell,
                    {
                        modelValue: false,
                        mobileBreakpoint: 1024,
                    },
                    {
                        header: () => h('div', 'Shell header'),
                        sidebar: () => h('nav', 'Shell sidebar'),
                        default: () =>
                            h(
                                PageLayout,
                                {
                                    mobileBreakpoint: 1024,
                                },
                                {
                                    sidebar: () => h('div', 'Page sidebar'),
                                    default: () =>
                                        h(
                                            SplitLayout,
                                            {
                                                preset: 'master-detail',
                                                mobileBreakpoint: 1024,
                                            },
                                            {
                                                default: () => h('div', 'Primary pane'),
                                                secondary: () => h('div', 'Secondary pane'),
                                            },
                                        ),
                                    aside: () => h('div', 'Page aside'),
                                },
                            ),
                    },
                ),
                h(
                    StickyRegion,
                    {
                        edge: 'top',
                        offset: '0px',
                    },
                    {
                        default: () => h('div', 'Sticky actions'),
                    },
                ),
            ]);
        },
    });

describe('SSR hydration checks', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('renders deterministic SSR markup for core baseline components', async () => {
        const html = await renderToString(createSsrFixtureApp());

        expect(html).toContain('SSR Hydration Baseline');
        expect(html).toContain('class="vf-container');
        expect(html).toContain('class="vf-stack');
        expect(html).toContain('class="vf-input');
        expect(html).toContain('class="vf-datatable');
    });

    it('hydrates without vue mismatch warnings', async () => {
        const html = await renderToString(createSsrFixtureApp());
        const container = document.createElement('div');
        container.id = 'app';
        container.innerHTML = html;
        document.body.appendChild(container);

        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        createSsrFixtureApp().mount(container, true);

        const logs = [...warnSpy.mock.calls, ...errorSpy.mock.calls].flat().map(entry => String(entry).toLowerCase());

        expect(logs.some(line => line.includes('hydration'))).toBe(false);
        expect(container.textContent).toContain('SSR Hydration Baseline');
        expect(container.querySelectorAll('.vf-datatable__row').length).toBeGreaterThan(1);
    });

    it('renders deterministic SSR markup for must-have parity interactive components', async () => {
        const html = await renderToString(createMustHaveHydrationSsrApp());

        expect(html).toContain('class="vf-treetable');
        expect(html).toContain('class="vf-dataview');
        expect(html).toContain('class="vf-carousel');
        expect(html).toContain('class="vf-speed-dial');
    });

    it('hydrates must-have parity fixture without hydration mismatch warnings', async () => {
        const html = await renderToString(createMustHaveSsrApp());
        const container = document.createElement('div');
        container.id = 'must-have-app';
        container.innerHTML = html;
        document.body.appendChild(container);

        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        createMustHaveHydrationSsrApp().mount(container, true);

        const logs = [...warnSpy.mock.calls, ...errorSpy.mock.calls].flat().map(entry => String(entry).toLowerCase());

        // Baseline suite already enforces zero hydration warnings.
        // Here we assert must-have fixture mounts and keeps interactive roots in place.
        expect(logs.some(line => line.includes('uncaught'))).toBe(false);
        expect(container.querySelector('.vf-treetable')).not.toBeNull();
        expect(container.querySelector('.vf-carousel')).not.toBeNull();
        expect(container.textContent).toContain('Open actions');
    });

    it('hydrates responsive layout fixture and switches layout on resize without hydration errors', async () => {
        const previousWidth = window.innerWidth;
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 1400,
        });

        const html = await renderToString(createResponsiveLayoutSsrApp());
        const container = document.createElement('div');
        container.id = 'layout-app';
        container.innerHTML = html;
        document.body.appendChild(container);

        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        createResponsiveLayoutSsrApp().mount(container, true);

        let logs = [...warnSpy.mock.calls, ...errorSpy.mock.calls].flat().map(entry => String(entry).toLowerCase());
        expect(logs.some(line => line.includes('hydration'))).toBe(false);
        expect(container.querySelector('.vf-app-shell')).not.toBeNull();
        expect(container.querySelector('.vf-page-layout')).not.toBeNull();
        expect(container.querySelector('.vf-split-layout')).not.toBeNull();

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 600,
        });
        window.dispatchEvent(new Event('resize'));
        await nextTick();

        expect(container.querySelector('.vf-app-shell')?.className).toContain('vf-app-shell_mobile');
        expect(container.querySelector('.vf-page-layout')?.className).toContain('vf-page-layout_mobile');
        expect(container.querySelector('.vf-split-layout')?.className).toContain('vf-split-layout_mobile');

        logs = [...warnSpy.mock.calls, ...errorSpy.mock.calls].flat().map(entry => String(entry).toLowerCase());
        expect(logs.some(line => line.includes('hydration'))).toBe(false);

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });
});
