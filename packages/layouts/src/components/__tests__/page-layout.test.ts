import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import PageLayout from '../page-layout.vue';

const mountLayout = (options: Parameters<typeof mount>[1] = {}) =>
    mount(PageLayout, {
        props: {
            sidebarCollapsed: false,
            asideCollapsed: false,
        },
        slots: {
            header: 'Header',
            sidebar: 'Sidebar',
            default: 'Content',
            aside: 'Aside',
            footer: 'Footer',
        },
        ...options,
    });

describe('PageLayout', () => {
    it('renders header/sidebar/main/aside/footer regions', async () => {
        const wrapper = mountLayout();

        await nextTick();

        expect(wrapper.find('.vf-page-layout__header').text()).toContain('Header');
        expect(wrapper.find('.vf-page-layout__sidebar').text()).toContain('Sidebar');
        expect(wrapper.find('.vf-page-layout__main').text()).toContain('Content');
        expect(wrapper.find('.vf-page-layout__aside').text()).toContain('Aside');
        expect(wrapper.find('.vf-page-layout__footer').text()).toContain('Footer');
    });

    it('applies desktop collapsed classes from props', async () => {
        const wrapper = mountLayout({
            props: {
                sidebarCollapsed: true,
                asideCollapsed: true,
            },
        });

        await nextTick();
        expect(wrapper.classes()).toContain('vf-page-layout_sidebar-collapsed');
        expect(wrapper.classes()).toContain('vf-page-layout_aside-collapsed');
    });

    it('opens mobile sidebar with toggle button and closes with overlay', async () => {
        const previousWidth = window.innerWidth;

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 640,
        });
        window.dispatchEvent(new Event('resize'));

        const wrapper = mountLayout({
            props: {
                mobileBreakpoint: 800,
            },
        });

        await nextTick();
        const toggles = wrapper.findAll('.vf-page-layout__toggle');
        await toggles[0].trigger('click');
        expect(wrapper.classes()).toContain('vf-page-layout_mobile-sidebar-open');

        await wrapper.find('.vf-page-layout__overlay_left').trigger('click');
        expect(wrapper.classes()).not.toContain('vf-page-layout_mobile-sidebar-open');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });

    it('emits collapsed updates on desktop toggle', async () => {
        const previousWidth = window.innerWidth;
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 1440,
        });
        window.dispatchEvent(new Event('resize'));

        const wrapper = mountLayout({
            props: {
                showDesktopToggles: true,
            },
        });
        await nextTick();

        await wrapper.vm.$nextTick();
        await wrapper.find('.vf-page-layout__toggle').trigger('click');
        expect(wrapper.emitted('update:sidebarCollapsed')?.[0]?.[0]).toBe(true);

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });
});
