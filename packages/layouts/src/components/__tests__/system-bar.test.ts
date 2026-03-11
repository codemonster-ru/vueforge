import { mount } from '@vue/test-utils';
import SystemBar from '../system-bar.vue';

describe('SystemBar', () => {
    it('renders start/center/end regions with aria groups', () => {
        const wrapper = mount(SystemBar, {
            slots: {
                start: '<span>Online</span>',
                center: '<span>UTC 12:45</span>',
                end: '<button type="button">Profile</button>',
            },
        });

        expect(wrapper.find('.vf-system-bar__start').attributes('role')).toBe('group');
        expect(wrapper.find('.vf-system-bar__center').attributes('role')).toBe('group');
        expect(wrapper.find('.vf-system-bar__end').attributes('role')).toBe('group');
        expect(wrapper.attributes('role')).toBe('region');
    });

    it('supports fixed/dense/bordered flags and z-index override', () => {
        const wrapper = mount(SystemBar, {
            props: {
                fixed: true,
                dense: true,
                bordered: true,
                zIndex: 300,
            },
        });

        expect(wrapper.classes()).toContain('vf-system-bar_fixed');
        expect(wrapper.classes()).toContain('vf-system-bar_dense');
        expect(wrapper.classes()).toContain('vf-system-bar_bordered');
        expect(wrapper.attributes('style')).toContain('--vf-system-bar-z-index-prop: 300');
    });

    it('does not force region role when rendered as header', () => {
        const wrapper = mount(SystemBar, {
            props: {
                as: 'header',
            },
        });

        expect(wrapper.attributes('role')).toBeUndefined();
    });
});
