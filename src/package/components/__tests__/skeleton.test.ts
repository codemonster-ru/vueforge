import { mount } from '@vue/test-utils';
import Skeleton from '../skeleton.vue';

describe('Skeleton', () => {
    it('renders with default classes', () => {
        const wrapper = mount(Skeleton);

        expect(wrapper.classes()).toContain('vf-skeleton');
        expect(wrapper.classes()).toContain('vf-skeleton_text');
        expect(wrapper.classes()).toContain('vf-skeleton_animated');
    });

    it('applies width and height styles', () => {
        const wrapper = mount(Skeleton, { props: { width: 120, height: 16, variant: 'rect' } });

        expect(wrapper.attributes('style')).toContain('width: 120px');
        expect(wrapper.attributes('style')).toContain('height: 16px');
        expect(wrapper.classes()).toContain('vf-skeleton_rect');
    });

    it('disables animation when animated is false', () => {
        const wrapper = mount(Skeleton, { props: { animated: false } });

        expect(wrapper.classes()).not.toContain('vf-skeleton_animated');
    });
});
