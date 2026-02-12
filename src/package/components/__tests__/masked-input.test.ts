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
});
