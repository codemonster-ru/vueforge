import { mount } from '@vue/test-utils';
import Checkbox from '../checkbox.vue';

describe('Checkbox', () => {
    it('emits update:modelValue and change on toggle', async () => {
        const wrapper = mount(Checkbox, {
            props: {
                modelValue: false,
            },
        });
        const input = wrapper.find('input[type="checkbox"]');

        await input.setValue(true);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
        expect(wrapper.emitted('change')?.length).toBe(1);
    });

    it('applies native and aria attributes to checkbox control', () => {
        const wrapper = mount(Checkbox, {
            props: {
                modelValue: true,
                id: 'terms',
                name: 'terms',
                required: true,
                ariaLabel: 'Accept terms',
                ariaDescribedby: 'terms-hint',
                ariaInvalid: true,
            },
        });
        const input = wrapper.find('input[type="checkbox"]');

        expect(input.attributes('id')).toBe('terms');
        expect(input.attributes('name')).toBe('terms');
        expect(input.attributes('required')).toBeDefined();
        expect(input.attributes('aria-label')).toBe('Accept terms');
        expect(input.attributes('aria-describedby')).toBe('terms-hint');
        expect(input.attributes('aria-invalid')).toBe('true');
        expect(input.attributes('aria-required')).toBe('true');
    });

    it('applies disabled semantics and class', () => {
        const wrapper = mount(Checkbox, {
            props: {
                modelValue: false,
                disabled: true,
            },
        });

        expect(wrapper.classes()).toContain('vf-checkbox_disabled');
        expect(wrapper.find('input[type="checkbox"]').attributes('disabled')).toBeDefined();
    });

    it('renders label from slot', () => {
        const wrapper = mount(Checkbox, {
            slots: {
                default: '<span class="slot-label">Custom label</span>',
            },
        });

        expect(wrapper.find('.slot-label').text()).toBe('Custom label');
    });
});
