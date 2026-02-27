import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import IconField from '../icon-field.vue';
import InputIcon from '../input-icon.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

describe('IconField', () => {
    it('applies variant/size/disabled classes and group semantics', () => {
        const wrapper = mount(IconField, {
            props: {
                variant: 'outlined',
                size: 'small',
                disabled: true,
                ariaLabel: 'Search field',
            },
            slots: {
                default: '<input class="vf-input__control" />',
            },
        });

        expect(wrapper.classes()).toContain('vf-icon-field');
        expect(wrapper.classes()).toContain('vf-icon-field_outlined');
        expect(wrapper.classes()).toContain('vf-icon-field_small');
        expect(wrapper.classes()).toContain('vf-icon-field_disabled');
        expect(wrapper.attributes('role')).toBe('group');
        expect(wrapper.attributes('aria-label')).toBe('Search field');
    });

    it('renders start/end slots and marks helper classes', () => {
        const wrapper = mount(IconField, {
            slots: {
                start: '<span class="start-slot">S</span>',
                default: '<input class="vf-input__control" />',
                end: '<span class="end-slot">E</span>',
            },
        });

        expect(wrapper.classes()).toContain('vf-icon-field_has-start');
        expect(wrapper.classes()).toContain('vf-icon-field_has-end');
        expect(wrapper.find('.start-slot').exists()).toBe(true);
        expect(wrapper.find('.end-slot').exists()).toBe(true);
    });
});

describe('InputIcon', () => {
    it('renders icon helper with side class', () => {
        const wrapper = mount(InputIcon, {
            props: {
                icon: 'magnifyingGlass',
                side: 'end',
            },
        });

        expect(wrapper.classes()).toContain('vf-input-icon');
        expect(wrapper.classes()).toContain('vf-input-icon_end');
    });

    it('supports non-decorative mode and custom tag', () => {
        const wrapper = mount(InputIcon, {
            props: {
                as: 'i',
                decorative: false,
                ariaLabel: 'Search icon',
            },
        });

        expect(wrapper.element.tagName).toBe('I');
        expect(wrapper.attributes('aria-hidden')).toBeUndefined();
        expect(wrapper.attributes('aria-label')).toBe('Search icon');
    });
});
