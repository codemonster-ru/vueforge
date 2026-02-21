import { mount } from '@vue/test-utils';
import Section from '../section.vue';

describe('Section', () => {
    it('renders with default tag and classes', () => {
        const wrapper = mount(Section, {
            slots: {
                default: 'Content',
            },
        });

        expect(wrapper.element.tagName).toBe('SECTION');
        expect(wrapper.classes()).toContain('vf-section');
        expect(wrapper.classes()).toContain('vf-section_background-transparent');
        expect(wrapper.text()).toContain('Content');
    });

    it('supports custom element and background variant', () => {
        const wrapper = mount(Section, {
            props: {
                as: 'div',
                background: 'muted',
            },
        });

        expect(wrapper.element.tagName).toBe('DIV');
        expect(wrapper.classes()).toContain('vf-section_background-muted');
    });

    it('applies bordered class and runtime padding override', () => {
        const wrapper = mount(Section, {
            props: {
                bordered: true,
                paddingY: '3rem',
            },
        });

        expect(wrapper.classes()).toContain('vf-section_bordered');
        expect(wrapper.attributes('style')).toContain('--vf-section-padding-y-override: 3rem;');
    });
});
