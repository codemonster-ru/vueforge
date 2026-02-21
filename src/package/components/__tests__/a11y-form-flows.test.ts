import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Form from '../form.vue';
import Input from '../input.vue';

describe('A11y Form Flows', () => {
    it('maps input accessibility attributes correctly', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
                required: true,
                ariaInvalid: true,
                ariaDescribedby: 'email-help',
            },
        });

        const input = wrapper.find('input');

        expect(input.attributes('required')).toBeDefined();
        expect(input.attributes('aria-required')).toBe('true');
        expect(input.attributes('aria-invalid')).toBe('true');
        expect(input.attributes('aria-describedby')).toBe('email-help');
    });

    it('emits blur and value updates for named controls in form flow', async () => {
        const wrapper = mount(Form, {
            props: {
                modelValue: {},
                ariaLabel: 'Profile form',
            },
            slots: {
                default: `
                    <label for="email">Email</label>
                    <input id="email" name="email" type="email" />
                `,
            },
        });

        const form = wrapper.find('form');
        const input = wrapper.find('input[name="email"]');

        expect(form.attributes('aria-label')).toBe('Profile form');

        await input.setValue('hello@example.com');
        await input.trigger('change');
        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.length).toBeGreaterThan(0);

        await input.trigger('focusout');
        await nextTick();

        expect(wrapper.emitted('blur')?.[0]?.[0]).toBe('email');
    });
});
