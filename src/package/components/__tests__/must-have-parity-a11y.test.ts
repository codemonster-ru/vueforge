import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import Carousel from '../carousel.vue';
import Chart from '../chart.vue';
import DataView from '../data-view.vue';
import Image from '../image.vue';
import Listbox from '../listbox.vue';
import MegaMenu from '../mega-menu.vue';
import NavigationRail from '../navigation-rail.vue';
import OverlayPanel from '../overlay-panel.vue';
import PanelMenu from '../panel-menu.vue';
import PageLayout from '../page-layout.vue';
import ResizableSidebar from '../resizable-sidebar.vue';
import SpeedDial from '../speed-dial.vue';
import TreeTable from '../tree-table.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

describe('Must-have parity keyboard and ARIA regression', () => {
    it('TreeTable exposes treegrid semantics and keyboard expand/select contract', async () => {
        const wrapper = mount(TreeTable, {
            props: {
                columns: [
                    { field: 'name', header: 'Name' },
                    { field: 'type', header: 'Type' },
                ],
                items: [
                    {
                        key: 'docs',
                        data: { name: 'Docs', type: 'Folder' },
                        children: [{ key: 'api', data: { name: 'API', type: 'File' } }],
                    },
                ],
                expandedKeys: [],
            },
        });

        const row = wrapper.find('.vf-treetable__body .vf-treetable__row');
        await row.trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.find('[role="treegrid"]').exists()).toBe(true);
        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['docs']]);
    });

    it('Listbox exposes listbox/option roles and keyboard selection', async () => {
        const wrapper = mount(Listbox, {
            props: {
                options: [
                    { label: 'Alpha', value: 'a' },
                    { label: 'Beta', value: 'b' },
                ],
            },
        });

        const list = wrapper.find('[role="listbox"]');
        await list.trigger('keydown', { key: 'ArrowDown' });
        await list.trigger('keydown', { key: 'Enter' });
        expect(wrapper.findAll('[role="option"]')).toHaveLength(2);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b']);
    });

    it('MegaMenu exposes navigation/menu ARIA contracts', async () => {
        const megaMenu = mount(MegaMenu, {
            props: {
                items: [{ label: 'Products', items: [{ label: 'Analytics', href: '#' }] }],
            },
        });
        const trigger = megaMenu.find('.vf-megamenu__trigger');
        await trigger.trigger('keydown', { key: 'Enter' });
        expect(megaMenu.find('[role="menubar"]').exists()).toBe(true);
        expect(trigger.attributes('aria-expanded')).toBe('true');
    });

    it('PanelMenu supports tree semantics with keyboard toggle', async () => {
        const wrapper = mount(PanelMenu, {
            props: {
                items: [{ key: 'group', label: 'Group', items: [{ label: 'Leaf', href: '#' }] }],
            },
        });

        const trigger = wrapper.find('.vf-panelmenu-node__trigger');
        await trigger.trigger('keydown', { key: 'Enter' });

        expect(wrapper.find('[role="tree"]').exists()).toBe(true);
        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['group']]);
    });

    it('Carousel exposes carousel semantics and keyboard navigation', async () => {
        const wrapper = mount(Carousel, {
            props: {
                items: [{ id: 1 }, { id: 2 }],
                loop: false,
            },
        });

        await wrapper.trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.attributes('aria-roledescription')).toBe('carousel');
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
    });

    it('SpeedDial exposes menu semantics and keyboard trigger/action contracts', async () => {
        const wrapper = mount(SpeedDial, {
            props: {
                actions: [
                    { label: 'Create', value: 'create' },
                    { label: 'Edit', value: 'edit' },
                ],
            },
            attachTo: document.body,
        });

        await wrapper.find('.vf-speed-dial__trigger').trigger('keydown', { key: 'Enter' });
        await nextTick();
        const firstAction = wrapper.find('.vf-speed-dial__action');
        await firstAction.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.find('[role="menu"]').exists()).toBe(true);
        wrapper.unmount();
    });

    it('Chart, DataView, and Image expose expected ARIA contracts', async () => {
        const chart = mount(Chart, {
            props: {
                adapter: { mount: () => ({}), destroy: () => undefined },
                data: { labels: ['Q1'], datasets: [{ label: 'Revenue', data: [120] }] },
                ariaLabel: 'Revenue chart',
            },
        });
        expect(chart.find('canvas').attributes('role')).toBe('img');

        const dataView = mount(DataView, {
            props: {
                items: [{ id: 1, name: 'One' }],
                layout: 'list',
            },
        });
        expect(dataView.find('.vf-dataview__content').attributes('role')).toBe('list');

        const image = mount(Image, {
            props: {
                src: '/cover.png',
                preview: true,
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });
        await image.find('.vf-image__trigger').trigger('click');
        expect(image.find('.vf-image__dialog').attributes('role')).toBe('dialog');
    });

    it('OverlayPanel keeps popover keyboard/ARIA dismiss behavior', async () => {
        const wrapper = mount(OverlayPanel, {
            props: {
                closeOnEscape: true,
            },
            attachTo: document.body,
            global: {
                stubs: {
                    teleport: true,
                },
            },
            slots: {
                trigger: '<button type="button">Open</button>',
                default: '<div>Content</div>',
            },
        });

        await wrapper.find('.vf-popover__button').trigger('click');
        await nextTick();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();
        expect(wrapper.emitted('hide')?.length).toBe(1);
    });

    it('collapsible/resizable navigation regions keep keyboard and ARIA contracts', async () => {
        const rail = mount(NavigationRail, {
            props: {
                items: [
                    { key: 'home', label: 'Home', href: '#' },
                    { key: 'ops', label: 'Ops', href: '#' },
                ],
                collapsed: false,
            },
            global: {
                stubs: {
                    RouterLink: {
                        template: '<a class="router-link-stub"><slot /></a>',
                    },
                },
            },
        });
        expect(rail.find('.vf-navigation-rail__list').attributes('role')).toBe('menu');
        expect(rail.findAll('[role="menuitem"]').length).toBe(2);

        const sidebar = mount(ResizableSidebar, {
            props: {
                modelValue: 260,
                minWidth: 220,
                maxWidth: 320,
            },
            slots: {
                default: 'Sidebar',
            },
        });
        const separator = sidebar.find('[role="separator"]');
        expect(separator.exists()).toBe(true);
        await separator.trigger('keydown', { key: 'ArrowRight' });
        expect(sidebar.emitted('update:modelValue')?.length).toBeGreaterThan(0);

        const previousWidth = window.innerWidth;
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 640,
        });
        window.dispatchEvent(new Event('resize'));

        const page = mount(PageLayout, {
            props: {
                mobileBreakpoint: 800,
                showMobileToggles: true,
                closeOnEsc: true,
            },
            slots: {
                sidebar: 'Sidebar',
                default: 'Main',
            },
            attachTo: document.body,
        });
        await nextTick();

        await page.find('.vf-page-layout__toggle').trigger('click');
        expect(page.find('.vf-page-layout__sidebar').attributes('aria-hidden')).toBe('false');

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();
        expect(page.find('.vf-page-layout__sidebar').attributes('aria-hidden')).toBe('true');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));

        rail.unmount();
        sidebar.unmount();
        page.unmount();
    });
});
