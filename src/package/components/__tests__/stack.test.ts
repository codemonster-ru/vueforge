import { mount } from '@vue/test-utils';
import Stack from '../stack.vue';

describe('Stack', () => {
    it('renders with default tag and class', () => {
        const wrapper = mount(Stack, {
            slots: {
                default: 'Content',
            },
        });

        expect(wrapper.element.tagName).toBe('DIV');
        expect(wrapper.classes()).toContain('vf-stack');
        expect(wrapper.text()).toContain('Content');
    });

    it('supports custom element', () => {
        const wrapper = mount(Stack, {
            props: {
                as: 'section',
            },
        });

        expect(wrapper.element.tagName).toBe('SECTION');
    });

    it('applies gap, align, justify and wrap overrides', () => {
        const wrapper = mount(Stack, {
            props: {
                gap: '1rem',
                align: 'center',
                justify: 'space-between',
                wrap: 'wrap',
            },
        });

        const style = wrapper.attributes('style');

        expect(style).toContain('--vf-stack-gap-override: 1rem;');
        expect(style).toContain('--vf-stack-align-items-override: center;');
        expect(style).toContain('--vf-stack-justify-content-override: space-between;');
        expect(style).toContain('--vf-stack-wrap-override: wrap;');
    });
});
