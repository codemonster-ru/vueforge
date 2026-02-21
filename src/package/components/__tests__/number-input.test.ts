import { mount } from '@vue/test-utils';
import NumberInput from '../number-input.vue';

describe('NumberInput', () => {
    it('emits update:modelValue with a number on input', async () => {
        const wrapper = mount(NumberInput, { props: { modelValue: null } });
        const control = wrapper.find('input');

        await control.setValue('12');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([12]);
    });

    it('emits null on empty input', async () => {
        const wrapper = mount(NumberInput, { props: { modelValue: 5 } });
        const control = wrapper.find('input');

        await control.setValue('');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null]);
    });

    it('steps value with ArrowUp and ArrowDown keys', async () => {
        const wrapper = mount(NumberInput, {
            props: { modelValue: 2, step: 2, min: 0, max: 10 },
        });
        const control = wrapper.find('input');

        await control.trigger('keydown', { key: 'ArrowUp' });
        await control.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4]);
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0]);
    });

    it('applies native and aria attributes to number control', () => {
        const wrapper = mount(NumberInput, {
            props: {
                modelValue: 3,
                id: 'quantity',
                name: 'quantity',
                required: true,
                autocomplete: 'off',
                inputmode: 'numeric',
                ariaLabel: 'Quantity',
                ariaDescribedby: 'quantity-hint',
                ariaInvalid: true,
            },
        });
        const control = wrapper.find('input');

        expect(control.attributes('id')).toBe('quantity');
        expect(control.attributes('name')).toBe('quantity');
        expect(control.attributes('required')).toBeDefined();
        expect(control.attributes('autocomplete')).toBe('off');
        expect(control.attributes('inputmode')).toBe('numeric');
        expect(control.attributes('aria-label')).toBe('Quantity');
        expect(control.attributes('aria-describedby')).toBe('quantity-hint');
        expect(control.attributes('aria-invalid')).toBe('true');
        expect(control.attributes('aria-required')).toBe('true');
    });

    it('applies disabled and readonly semantics', () => {
        const wrapper = mount(NumberInput, {
            props: { modelValue: 2, disabled: true, readonly: true },
        });
        const root = wrapper.find('.vf-number-input');
        const control = wrapper.find('input');

        expect(root.classes()).toContain('vf-number-input_disabled');
        expect(control.attributes('disabled')).toBeDefined();
        expect(control.attributes('readonly')).toBeDefined();
    });

    it('emits focus and blur events', async () => {
        const wrapper = mount(NumberInput, { props: { modelValue: null } });
        const control = wrapper.find('input');

        await control.trigger('focus');
        await control.trigger('blur');

        expect(wrapper.emitted('focus')).toBeTruthy();
        expect(wrapper.emitted('blur')).toBeTruthy();
    });
});
