import { mount } from '@vue/test-utils';
import Sheet from '../sheet.vue';

describe('Sheet', () => {
    it('renders elevated variant by default', () => {
        const wrapper = mount(Sheet, {
            slots: {
                default: '<p>Body</p>',
            },
        });

        expect(wrapper.classes()).toContain('vf-sheet');
        expect(wrapper.classes()).toContain('vf-sheet_elevated');
        expect(wrapper.classes()).toContain('vf-sheet_rounded');
        expect(wrapper.find('.vf-sheet__body').text()).toContain('Body');
    });

    it('supports outlined variant and optional border class', () => {
        const wrapper = mount(Sheet, {
            props: {
                variant: 'outlined',
                bordered: true,
                rounded: false,
            },
        });

        expect(wrapper.classes()).toContain('vf-sheet_outlined');
        expect(wrapper.classes()).toContain('vf-sheet_bordered');
        expect(wrapper.classes()).not.toContain('vf-sheet_rounded');
    });

    it('renders header and footer sections when slots are provided', () => {
        const wrapper = mount(Sheet, {
            slots: {
                header: '<h3>Header</h3>',
                default: '<div>Content</div>',
                footer: '<button type="button">Action</button>',
            },
        });

        expect(wrapper.find('.vf-sheet__header').exists()).toBe(true);
        expect(wrapper.find('.vf-sheet__footer').exists()).toBe(true);
    });

    it('supports semantic element and disabled accessibility state', () => {
        const wrapper = mount(Sheet, {
            props: {
                as: 'section',
                interactive: true,
                disabled: true,
                ariaLabel: 'Summary surface',
            },
        });

        expect(wrapper.element.tagName).toBe('SECTION');
        expect(wrapper.classes()).toContain('vf-sheet_interactive');
        expect(wrapper.classes()).toContain('vf-sheet_disabled');
        expect(wrapper.attributes('aria-disabled')).toBe('true');
        expect(wrapper.attributes('aria-label')).toBe('Summary surface');
    });
});
