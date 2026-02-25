import { mount } from '@vue/test-utils';
import StickyRegion from '../sticky-region.vue';

describe('StickyRegion', () => {
    it('renders default sticky top region', () => {
        const wrapper = mount(StickyRegion, {
            slots: {
                default: 'Actions',
            },
        });

        expect(wrapper.classes()).toContain('vf-sticky-region');
        expect(wrapper.classes()).toContain('vf-sticky-region_top');
        expect(wrapper.text()).toContain('Actions');
        expect(wrapper.attributes('style')).toContain('--vf-sticky-region-offset-prop: 0px;');
    });

    it('supports bottom edge with bordered/shadow and z-index override', () => {
        const wrapper = mount(StickyRegion, {
            props: {
                edge: 'bottom',
                offset: '2rem',
                bordered: true,
                shadow: true,
                zIndex: 300,
            },
        });

        expect(wrapper.classes()).toContain('vf-sticky-region_bottom');
        expect(wrapper.classes()).toContain('vf-sticky-region_bordered');
        expect(wrapper.classes()).toContain('vf-sticky-region_shadow');
        expect(wrapper.attributes('style')).toContain('--vf-sticky-region-offset-prop: 2rem;');
        expect(wrapper.attributes('style')).toContain('--vf-sticky-region-z-index-prop: 300;');
    });

    it('sets region role for non-semantic tag', () => {
        const wrapper = mount(StickyRegion, {
            props: {
                as: 'div',
                ariaLabel: 'Sticky actions',
            },
        });

        expect(wrapper.attributes('role')).toBe('region');
        expect(wrapper.attributes('aria-label')).toBe('Sticky actions');
    });
});
