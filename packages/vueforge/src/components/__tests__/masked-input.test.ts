import { mount } from '@vue/test-utils';
import MaskedInput from '../masked-input.vue';

describe('MaskedInput', () => {
    it('applies string mask and emits masked value', async () => {
        const wrapper = mount(MaskedInput, {
            props: {
                modelValue: '',
                mask: '+7 (###) ###-##-##',
            },
        });
        const input = wrapper.find('input');

        await input.setValue('9123456789');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['+7 (912) 345-67-89']);
    });

    it('emits unmasked value when unmask is true', async () => {
        const wrapper = mount(MaskedInput, {
            props: {
                modelValue: '',
                mask: '+7 (###) ###-##-##',
                unmask: true,
            },
        });
        const input = wrapper.find('input');

        await input.setValue('9123456789');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['9123456789']);
    });

    it('emits complete when all mask tokens are filled', async () => {
        const wrapper = mount(MaskedInput, {
            props: {
                modelValue: '',
                mask: 'AA-##',
            },
        });
        const input = wrapper.find('input');

        await input.setValue('ab12');

        expect(wrapper.emitted('complete')?.[0]).toEqual(['ab-12']);
    });

    it('allows clearing masked value completely', async () => {
        const wrapper = mount(MaskedInput, {
            props: {
                modelValue: '+7 (912) 345-67-89',
                mask: '+7 (###) ###-##-##',
            },
        });
        const input = wrapper.find('input');

        await input.setValue('');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
    });

    it('does not leave trailing literal separators when value is shortened', async () => {
        const wrapper = mount(MaskedInput, {
            props: {
                modelValue: '',
                mask: '+7 (###) ###-##-##',
            },
        });
        const input = wrapper.find('input');

        await input.setValue('91234567');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['+7 (912) 345-67']);
    });

    it('applies native and aria attributes to masked control', () => {
        const wrapper = mount(MaskedInput, {
            props: {
                modelValue: '',
                id: 'phone',
                name: 'phone',
                required: true,
                autocomplete: 'off',
                inputmode: 'tel',
                ariaLabel: 'Phone number',
                ariaDescribedby: 'phone-hint',
                ariaInvalid: true,
            },
        });
        const input = wrapper.find('input');

        expect(input.attributes('id')).toBe('phone');
        expect(input.attributes('name')).toBe('phone');
        expect(input.attributes('required')).toBeDefined();
        expect(input.attributes('autocomplete')).toBe('off');
        expect(input.attributes('inputmode')).toBe('tel');
        expect(input.attributes('aria-label')).toBe('Phone number');
        expect(input.attributes('aria-describedby')).toBe('phone-hint');
        expect(input.attributes('aria-invalid')).toBe('true');
        expect(input.attributes('aria-required')).toBe('true');
    });

    it('applies disabled and readonly semantics', () => {
        const wrapper = mount(MaskedInput, {
            props: {
                modelValue: '12',
                disabled: true,
                readonly: true,
            },
        });
        const root = wrapper.find('.vf-masked-input');
        const input = wrapper.find('input');

        expect(root.classes()).toContain('vf-masked-input_disabled');
        expect(input.attributes('disabled')).toBeDefined();
        expect(input.attributes('readonly')).toBeDefined();
    });

    it('emits focus and blur events', async () => {
        const wrapper = mount(MaskedInput, {
            props: {
                modelValue: '12',
            },
        });
        const input = wrapper.find('input');

        await input.trigger('focus');
        await input.trigger('blur');

        expect(wrapper.emitted('focus')).toBeTruthy();
        expect(wrapper.emitted('blur')).toBeTruthy();
    });
});
