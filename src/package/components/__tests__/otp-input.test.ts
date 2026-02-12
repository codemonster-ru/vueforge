import { mount } from '@vue/test-utils';
import OtpInput from '../otp-input.vue';

describe('OtpInput', () => {
    it('emits update:modelValue from input', async () => {
        const wrapper = mount(OtpInput, {
            props: { modelValue: '', length: 4 },
        });
        const cells = wrapper.findAll('input');

        await cells[0].setValue('1');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1']);
    });

    it('emits complete when code reaches full length', async () => {
        const wrapper = mount(OtpInput, {
            props: { modelValue: '123', length: 4 },
        });
        const cells = wrapper.findAll('input');

        await cells[3].setValue('4');

        expect(wrapper.emitted('complete')?.[0]).toEqual(['1234']);
    });

    it('applies pasted value and emits paste', async () => {
        const wrapper = mount(OtpInput, {
            props: { modelValue: '', length: 4 },
        });
        const root = wrapper.find('.vf-otp-input');

        await root.trigger('paste', {
            clipboardData: {
                getData: () => '12a3',
            },
        });

        expect(wrapper.emitted('paste')?.[0]).toEqual(['12a3']);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123']);
    });

    it('backspace clears previous cell when current is empty', async () => {
        const wrapper = mount(OtpInput, {
            props: { modelValue: '12', length: 4 },
        });
        const cells = wrapper.findAll('input');

        await cells[2].trigger('keydown', { key: 'Backspace' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1']);
    });
});
