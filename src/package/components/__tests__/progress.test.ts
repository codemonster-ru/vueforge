import { mount } from '@vue/test-utils';
import Progress from '../progress.vue';

describe('Progress', () => {
    it('renders linear progress by default', () => {
        const wrapper = mount(Progress);

        expect(wrapper.classes()).toContain('vf-progress');
        expect(wrapper.classes()).toContain('vf-progress_linear');
        expect(wrapper.attributes('role')).toBe('progressbar');
    });

    it('applies determinate value to linear bar', () => {
        const wrapper = mount(Progress, { props: { value: 42 } });
        const bar = wrapper.find('.vf-progress__bar');

        expect(bar.attributes('style')).toContain('width: 42%');
        expect(wrapper.attributes('aria-valuenow')).toBe('42');
    });

    it('renders indeterminate state when value is missing', () => {
        const wrapper = mount(Progress);

        expect(wrapper.classes()).toContain('vf-progress_indeterminate');
        expect(wrapper.attributes('aria-valuenow')).toBeUndefined();
    });

    it('renders circular variant', () => {
        const wrapper = mount(Progress, { props: { variant: 'circular' } });

        expect(wrapper.classes()).toContain('vf-progress_circular');
        expect(wrapper.find('svg').exists()).toBe(true);
    });
});
