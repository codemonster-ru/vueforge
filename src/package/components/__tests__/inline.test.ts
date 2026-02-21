import { mount } from '@vue/test-utils';
import Inline from '../inline.vue';

describe('Inline', () => {
    it('renders with default tag and class', () => {
        const wrapper = mount(Inline, {
            slots: {
                default: 'Content',
            },
        });

        expect(wrapper.element.tagName).toBe('DIV');
        expect(wrapper.classes()).toContain('vf-inline');
        expect(wrapper.text()).toContain('Content');
    });

    it('supports custom element', () => {
        const wrapper = mount(Inline, {
            props: {
                as: 'section',
            },
        });

        expect(wrapper.element.tagName).toBe('SECTION');
    });

    it('applies gap, align, justify and wrap overrides', () => {
        const wrapper = mount(Inline, {
            props: {
                gap: '1rem',
                align: 'end',
                justify: 'space-between',
                wrap: 'nowrap',
            },
        });

        const style = wrapper.attributes('style');

        expect(style).toContain('--vf-inline-gap-override: 1rem;');
        expect(style).toContain('--vf-inline-align-items-override: end;');
        expect(style).toContain('--vf-inline-justify-content-override: space-between;');
        expect(style).toContain('--vf-inline-wrap-override: nowrap;');
    });
});
