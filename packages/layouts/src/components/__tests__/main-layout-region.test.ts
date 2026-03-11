import { mount } from '@vue/test-utils';
import MainLayoutRegion from '../main-layout-region.vue';

describe('MainLayoutRegion', () => {
    it('renders main landmark by default', () => {
        const wrapper = mount(MainLayoutRegion, {
            slots: {
                default: '<div class="content">Main content</div>',
            },
        });

        const root = wrapper.get('main.vf-main-layout-region');
        expect(root.attributes('role')).toBeUndefined();
        expect(root.attributes('aria-label')).toBe('Main content');
        expect(wrapper.get('.content').text()).toBe('Main content');
    });

    it('uses role=main when rendered as non-main element', () => {
        const wrapper = mount(MainLayoutRegion, {
            props: {
                as: 'section',
            },
        });

        const root = wrapper.get('section.vf-main-layout-region');
        expect(root.attributes('role')).toBe('main');
    });

    it('supports constrained centered layout and max width override', () => {
        const wrapper = mount(MainLayoutRegion, {
            props: {
                constrained: true,
                center: true,
                maxWidth: '60rem',
                bordered: true,
            },
        });

        const root = wrapper.get('.vf-main-layout-region');
        const inner = wrapper.get('.vf-main-layout-region__inner');
        expect(root.classes()).toContain('vf-main-layout-region_bordered');
        expect(root.attributes('style')).toContain('--vf-main-layout-region-max-width-override: 60rem');
        expect(inner.classes()).toContain('vf-main-layout-region__inner_constrained');
        expect(inner.classes()).toContain('vf-main-layout-region__inner_centered');
    });
});
