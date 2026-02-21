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

    it('applies group and cell aria/native attributes', () => {
        const wrapper = mount(OtpInput, {
            props: {
                modelValue: '12',
                length: 4,
                id: 'otp',
                name: 'otp',
                required: true,
                ariaLabel: 'Verification code',
                ariaDescribedby: 'otp-hint',
                ariaInvalid: true,
            },
        });
        const root = wrapper.find('.vf-otp-input');
        const cells = wrapper.findAll('input');

        expect(root.attributes('id')).toBe('otp');
        expect(root.attributes('role')).toBe('group');
        expect(root.attributes('aria-label')).toBe('Verification code');
        expect(root.attributes('aria-describedby')).toBe('otp-hint');
        expect(cells).toHaveLength(4);
        expect(cells[0].attributes('name')).toBe('otp-1');
        expect(cells[0].attributes('required')).toBeDefined();
        expect(cells[0].attributes('aria-label')).toBe('OTP digit 1 of 4');
        expect(cells[0].attributes('aria-invalid')).toBe('true');
        expect(cells[0].attributes('aria-required')).toBe('true');
    });

    it('does not mutate value on backspace when readonly', async () => {
        const wrapper = mount(OtpInput, {
            props: { modelValue: '12', length: 4, readonly: true },
        });
        const cells = wrapper.findAll('input');

        await cells[1].trigger('keydown', { key: 'Backspace' });

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
});
