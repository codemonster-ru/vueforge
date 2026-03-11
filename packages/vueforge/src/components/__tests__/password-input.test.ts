import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import PasswordInput from '../password-input.vue';

describe('PasswordInput', () => {
    it('emits update:modelValue on input', async () => {
        const wrapper = mount(PasswordInput, { props: { modelValue: '' } });
        const input = wrapper.find('input');

        await input.setValue('secret123');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['secret123']);
    });

    it('toggles input type and emits toggleVisibility', async () => {
        const wrapper = mount(PasswordInput, { props: { modelValue: 'secret' } });
        const input = wrapper.find('input');
        const toggle = wrapper.find('.vf-password-input__toggle');

        expect(input.attributes('type')).toBe('password');

        await toggle.trigger('click');

        expect(input.attributes('type')).toBe('text');
        expect(toggle.attributes('aria-label')).toBe('Hide password');
        expect(wrapper.emitted('toggleVisibility')?.[0]).toEqual([true]);
    });

    it('applies native and aria attributes to password control', () => {
        const wrapper = mount(PasswordInput, {
            props: {
                modelValue: 'secret',
                id: 'password',
                name: 'password',
                required: true,
                ariaLabel: 'Account password',
                ariaDescribedby: 'password-hint',
                ariaInvalid: true,
            },
        });
        const input = wrapper.find('input');

        expect(input.attributes('id')).toBe('password');
        expect(input.attributes('name')).toBe('password');
        expect(input.attributes('required')).toBeDefined();
        expect(input.attributes('aria-label')).toBe('Account password');
        expect(input.attributes('aria-describedby')).toBe('password-hint');
        expect(input.attributes('aria-invalid')).toBe('true');
        expect(input.attributes('aria-required')).toBe('true');
    });

    it('applies disabled and readonly semantics', () => {
        const wrapper = mount(PasswordInput, {
            props: {
                modelValue: 'secret',
                disabled: true,
                readonly: true,
            },
        });
        const input = wrapper.find('input');
        const toggle = wrapper.find('.vf-password-input__toggle');

        expect(wrapper.classes()).toContain('vf-password-input_disabled');
        expect(input.attributes('disabled')).toBeDefined();
        expect(input.attributes('readonly')).toBeDefined();
        expect(toggle.attributes('disabled')).toBeDefined();
    });

    it('shows strength label when enabled', () => {
        const wrapper = mount(PasswordInput, {
            props: {
                modelValue: 'Secret123!',
                showStrength: true,
            },
        });

        expect(wrapper.find('.vf-password-input__strength-label').text()).toBe('Strong password');
    });

    it('shows caps lock hint on keyboard event and hides on blur', async () => {
        const wrapper = mount(PasswordInput, {
            props: {
                modelValue: 'secret',
            },
        });
        const input = wrapper.find('input');

        const event = new KeyboardEvent('keydown');
        Object.defineProperty(event, 'getModifierState', {
            value: (key: string) => key === 'CapsLock',
        });

        input.element.dispatchEvent(event);

        await nextTick();

        expect(wrapper.find('.vf-password-input__caps-lock').exists()).toBe(true);

        await input.trigger('blur');

        expect(wrapper.find('.vf-password-input__caps-lock').exists()).toBe(false);
    });
});
