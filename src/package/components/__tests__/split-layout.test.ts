import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SplitLayout from '../split-layout.vue';

const mountSplitLayout = (options: Parameters<typeof mount>[1] = {}) =>
    mount(SplitLayout, {
        props: {
            preset: 'master-detail',
        },
        slots: {
            default: 'Primary',
            secondary: 'Secondary',
            tertiary: 'Tertiary',
        },
        ...options,
    });

describe('SplitLayout', () => {
    it('renders preset composition regions', async () => {
        const wrapper = mountSplitLayout();
        await nextTick();

        expect(wrapper.classes()).toContain('vf-split-layout_master-detail');
        expect(wrapper.find('.vf-split-layout__primary').text()).toContain('Primary');
        expect(wrapper.find('.vf-split-layout__secondary').text()).toContain('Secondary');
        expect(wrapper.find('.vf-split-layout__tertiary').exists()).toBe(false);
    });

    it('emits desktop collapsed update for secondary pane', async () => {
        const previousWidth = window.innerWidth;
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 1440,
        });
        window.dispatchEvent(new Event('resize'));

        const wrapper = mountSplitLayout({
            props: {
                showDesktopToggles: true,
                preset: 'editor-preview',
            },
        });
        await nextTick();

        await wrapper.find('.vf-split-layout__toggle').trigger('click');
        expect(wrapper.emitted('update:secondaryCollapsed')?.[0]?.[0]).toBe(true);

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });

    it('opens and closes secondary pane on mobile', async () => {
        const previousWidth = window.innerWidth;
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 640,
        });
        window.dispatchEvent(new Event('resize'));

        const wrapper = mountSplitLayout({
            props: {
                mobileBreakpoint: 800,
                preset: 'master-detail',
            },
        });
        await nextTick();

        const toggles = wrapper.findAll('.vf-split-layout__toggle');
        await toggles[0].trigger('click');
        expect(wrapper.classes()).toContain('vf-split-layout_mobile-secondary-open');

        await wrapper.find('.vf-split-layout__overlay').trigger('click');
        expect(wrapper.classes()).not.toContain('vf-split-layout_mobile-secondary-open');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });

    it('emits tertiary collapse update for inspector preset', async () => {
        const previousWidth = window.innerWidth;
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 1440,
        });
        window.dispatchEvent(new Event('resize'));

        const wrapper = mountSplitLayout({
            props: {
                preset: 'inspector',
                showDesktopToggles: true,
            },
        });
        await nextTick();

        const toggles = wrapper.findAll('.vf-split-layout__toggle');
        await toggles[0].trigger('click');
        expect(wrapper.emitted('update:tertiaryCollapsed')?.[0]?.[0]).toBe(true);

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });
});
