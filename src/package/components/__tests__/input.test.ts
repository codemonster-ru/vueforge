import { mount } from '@vue/test-utils';
import Input from '../input.vue';

describe('Input', () => {
    it('emits update:modelValue and input on typing', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } });
        const input = wrapper.find('input');

        await input.setValue('hello');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello']);
        expect(wrapper.emitted('input')).toBeTruthy();
    });

    it('applies native and aria attributes to the input control', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
                id: 'email',
                name: 'email',
                required: true,
                autocomplete: 'email',
                inputmode: 'email',
                ariaLabel: 'Email address',
                ariaDescribedby: 'email-hint',
                ariaInvalid: true,
            },
        });
        const input = wrapper.find('input');

        expect(input.attributes('id')).toBe('email');
        expect(input.attributes('name')).toBe('email');
        expect(input.attributes('required')).toBeDefined();
        expect(input.attributes('autocomplete')).toBe('email');
        expect(input.attributes('inputmode')).toBe('email');
        expect(input.attributes('aria-label')).toBe('Email address');
        expect(input.attributes('aria-describedby')).toBe('email-hint');
        expect(input.attributes('aria-invalid')).toBe('true');
        expect(input.attributes('aria-required')).toBe('true');
    });

    it('reflects disabled and readonly semantics', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: 'abc',
                disabled: true,
                readonly: true,
            },
        });
        const root = wrapper.find('.vf-input');
        const input = wrapper.find('input');

        expect(root.classes()).toContain('vf-input_disabled');
        expect(input.attributes('disabled')).toBeDefined();
        expect(input.attributes('readonly')).toBeDefined();
    });

    it('emits focus and blur events', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } });
        const input = wrapper.find('input');

        await input.trigger('focus');
        await input.trigger('blur');

        expect(wrapper.emitted('focus')).toBeTruthy();
        expect(wrapper.emitted('blur')).toBeTruthy();
    });
});
