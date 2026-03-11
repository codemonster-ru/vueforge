import { mount } from '@vue/test-utils';
import Spinner from '../spinner.vue';

describe('Spinner', () => {
    it('renders inline spinner by default', () => {
        const wrapper = mount(Spinner);

        expect(wrapper.classes()).toContain('vf-spinner');
        expect(wrapper.classes()).toContain('vf-spinner_inline');
        expect(wrapper.attributes('role')).toBe('status');
    });

    it('supports overlay variant and custom size', () => {
        const wrapper = mount(Spinner, {
            props: {
                variant: 'overlay',
                size: 'large',
                severity: 'success',
            },
        });

        expect(wrapper.classes()).toContain('vf-spinner_overlay');
        expect(wrapper.classes()).toContain('vf-spinner_size-large');
        expect(wrapper.attributes('data-severity')).toBe('success');
    });

    it('renders label content', () => {
        const wrapper = mount(Spinner, {
            props: {
                label: 'Loading data...',
            },
        });

        expect(wrapper.find('.vf-spinner__label').text()).toBe('Loading data...');
    });
});
