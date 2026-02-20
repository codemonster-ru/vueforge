import { mount } from '@vue/test-utils';
import Container from '../container.vue';

describe('Container', () => {
    it('renders with default tag and size', () => {
        const wrapper = mount(Container, {
            slots: {
                default: 'Content',
            },
        });

        expect(wrapper.element.tagName).toBe('DIV');
        expect(wrapper.classes()).toContain('vf-container');
        expect(wrapper.classes()).toContain('vf-container_lg');
        expect(wrapper.text()).toContain('Content');
    });

    it('supports custom element and full size', () => {
        const wrapper = mount(Container, {
            props: {
                as: 'main',
                size: 'full',
            },
        });

        expect(wrapper.element.tagName).toBe('MAIN');
        expect(wrapper.classes()).toContain('vf-container_full');
    });

    it('applies maxWidth and paddingX overrides', () => {
        const wrapper = mount(Container, {
            props: {
                maxWidth: '90rem',
                paddingX: '2rem',
            },
        });

        const style = wrapper.attributes('style');

        expect(style).toContain('--vf-container-max-width-override: 90rem;');
        expect(style).toContain('--vf-container-padding-x-override: 2rem;');
    });
});
