import { mount } from '@vue/test-utils';
import Divider from '../divider.vue';

describe('Divider', () => {
    it('renders horizontal divider by default', () => {
        const wrapper = mount(Divider);

        expect(wrapper.attributes('role')).toBe('separator');
        expect(wrapper.attributes('aria-orientation')).toBe('horizontal');
        expect(wrapper.classes()).toContain('vf-divider_horizontal');
        expect(wrapper.classes()).toContain('vf-divider_solid');
    });

    it('supports vertical orientation and inset', () => {
        const wrapper = mount(Divider, {
            props: {
                orientation: 'vertical',
                inset: true,
                variant: 'dashed',
            },
        });

        expect(wrapper.classes()).toContain('vf-divider_vertical');
        expect(wrapper.classes()).toContain('vf-divider_inset');
        expect(wrapper.classes()).toContain('vf-divider_dashed');
    });

    it('renders label for horizontal orientation', () => {
        const wrapper = mount(Divider, {
            props: {
                label: 'OR',
            },
        });

        expect(wrapper.classes()).toContain('vf-divider_with-label');
        expect(wrapper.find('.vf-divider__label').text()).toBe('OR');
    });
});
