import { mount } from '@vue/test-utils';
import { h } from 'vue';
import Form from '../form.vue';

describe('Form', () => {
    it('updates values from named controls and emits model update', async () => {
        const wrapper = mount(Form, {
            slots: {
                default: () => h('input', { name: 'email' }),
            },
        });

        const input = wrapper.find('input');
        await input.setValue('hello@example.com');

        const modelUpdates = wrapper.emitted('update:modelValue');

        expect(modelUpdates).toBeTruthy();
        expect(modelUpdates?.at(-1)?.[0]).toEqual({ email: 'hello@example.com' });
    });

    it('emits invalidSubmit when validator returns errors', async () => {
        const wrapper = mount(Form, {
            props: {
                validate: values => {
                    const nextErrors: Record<string, string> = {};

                    if (values.email) {
                        return nextErrors;
                    }

                    nextErrors.email = 'Email is required';

                    return nextErrors;
                },
            },
            slots: {
                default: ({ errors }: { errors: Record<string, string> }) =>
                    h('div', [h('input', { name: 'email' }), h('p', { class: 'error' }, errors.email ?? '')]),
            },
        });

        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('invalidSubmit')).toBeTruthy();
        expect(wrapper.find('.error').text()).toBe('Email is required');
    });

    it('emits submit when validator passes', async () => {
        const wrapper = mount(Form, {
            props: {
                validate: values => {
                    const nextErrors: Record<string, string> = {};

                    if (values.email) {
                        return nextErrors;
                    }

                    nextErrors.email = 'Email is required';

                    return nextErrors;
                },
            },
            slots: {
                default: () => h('input', { name: 'email' }),
            },
        });

        await wrapper.find('input').setValue('ok@example.com');
        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('submit')).toBeTruthy();
        expect(wrapper.emitted('invalidSubmit')).toBeFalsy();
    });

    it('handles async validation and emits invalidSubmit', async () => {
        const wrapper = mount(Form, {
            props: {
                validate: async values => {
                    await Promise.resolve();
                    const nextErrors: Record<string, string> = {};

                    if (!values.email) {
                        nextErrors.email = 'Email is required';
                    }

                    return nextErrors;
                },
            },
            slots: {
                default: ({ errors }: { errors: Record<string, string> }) =>
                    h('div', [h('input', { name: 'email' }), h('p', { class: 'error' }, errors.email ?? '')]),
            },
        });

        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('invalidSubmit')).toBeTruthy();
        expect(wrapper.find('.error').text()).toBe('Email is required');
    });

    it('maps submit errors and emits submitError', async () => {
        const wrapper = mount(Form, {
            props: {
                validate: () => ({}),
                submit: async () => {
                    throw new Error('API');
                },
                mapSubmitError: () => ({
                    _form: 'Request failed, try again',
                }),
            },
            slots: {
                default: ({ errors }: { errors: Record<string, string> }) =>
                    h('div', [h('input', { name: 'email' }), h('p', { class: 'error' }, errors._form ?? '')]),
            },
        });

        await wrapper.find('input').setValue('ok@example.com');
        await wrapper.find('form').trigger('submit');
        await Promise.resolve();
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('submitError')).toBeTruthy();
        expect(wrapper.emitted('invalidSubmit')).toBeTruthy();
        expect(wrapper.find('.error').text()).toBe('Request failed, try again');
    });
});
