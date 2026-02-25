import { mount } from '@vue/test-utils';
import VirtualScroller from '../virtual-scroller.vue';

describe('VirtualScroller', () => {
    it('renders only visible items when virtual mode is enabled', async () => {
        const items = Array.from({ length: 40 }, (_, index) => `Item ${index}`);
        const wrapper = mount(VirtualScroller, {
            props: {
                items,
                itemHeight: 30,
                height: '120px',
                overscan: 1,
            },
            slots: {
                default: slotProps => `${slotProps.index}:${slotProps.item}`,
            },
        });

        expect(wrapper.findAll('.vf-virtual-scroller__item')).toHaveLength(6);
        expect(wrapper.text()).toContain('0:Item 0');

        const viewport = wrapper.find('.vf-virtual-scroller');
        const element = viewport.element as HTMLElement;

        element.scrollTop = 150;

        await viewport.trigger('scroll');

        const rendered = wrapper.findAll('.vf-virtual-scroller__item');

        expect(rendered).toHaveLength(6);
        expect(wrapper.text()).toContain('4:Item 4');
        expect(wrapper.text()).not.toContain('0:Item 0');
    });

    it('emits rangeChange and reachEnd events', async () => {
        const items = Array.from({ length: 12 }, (_, index) => index);
        const wrapper = mount(VirtualScroller, {
            props: {
                items,
                itemHeight: 20,
                height: '100px',
                overscan: 0,
            },
        });

        expect(wrapper.emitted('rangeChange')).toBeTruthy();

        const viewport = wrapper.find('.vf-virtual-scroller');
        const element = viewport.element as HTMLElement;

        element.scrollTop = 140;

        await viewport.trigger('scroll');

        expect(wrapper.emitted('reachEnd')).toBeTruthy();
    });

    it('renders empty slot when there are no items', () => {
        const wrapper = mount(VirtualScroller, {
            props: {
                items: [],
            },
            slots: {
                empty: '<div class="custom-empty">Empty state</div>',
            },
        });

        expect(wrapper.find('.custom-empty').exists()).toBe(true);
    });

    it('supports error-state fallback via empty slot for failed large-list fetches', () => {
        const wrapper = mount(VirtualScroller, {
            props: {
                items: [],
                height: '240px',
                virtual: true,
            },
            slots: {
                empty: '<div class="virtual-error">Failed to load feed</div>',
            },
        });

        expect(wrapper.find('.virtual-error').exists()).toBe(true);
    });
});
