import { mount } from '@vue/test-utils';
import ScrollPanel from '../scroll-panel.vue';

describe('ScrollPanel', () => {
    it('renders scrollable region with default role and aria label', () => {
        const wrapper = mount(ScrollPanel, {
            props: {
                ariaLabel: 'Log output',
            },
            slots: {
                default: '<div class="content">Items</div>',
            },
        });

        expect(wrapper.classes()).toContain('vf-scrollpanel');
        expect(wrapper.attributes('role')).toBe('region');
        expect(wrapper.attributes('aria-label')).toBe('Log output');
        expect(wrapper.find('.content').exists()).toBe(true);
    });

    it('applies height settings and exposes scrollTo helper', () => {
        const wrapper = mount(ScrollPanel, {
            props: {
                height: '220px',
                minHeight: '100px',
                maxHeight: '300px',
            },
        });

        const style = wrapper.attributes('style');
        expect(style).toContain('height: 220px;');
        expect(style).toContain('min-height: 100px;');
        expect(style).toContain('max-height: 300px;');
        expect(typeof (wrapper.vm as { scrollTo: (top: number) => void }).scrollTo).toBe('function');
    });
});
