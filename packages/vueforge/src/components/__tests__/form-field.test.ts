import { mount } from '@vue/test-utils';
import { h } from 'vue';
import FormField from '../form-field.vue';

describe('FormField', () => {
    it('renders label, hint, and error text', () => {
        const wrapper = mount(FormField, {
            props: {
                label: 'Email',
                hint: 'We never share it',
                error: 'Email is required',
            },
        });

        expect(wrapper.find('.vf-form-field__label').text()).toContain('Email');
        expect(wrapper.find('.vf-form-field__hint').text()).toBe('We never share it');
        expect(wrapper.find('.vf-form-field__error').text()).toBe('Email is required');
        expect(wrapper.classes()).toContain('vf-form-field_invalid');
    });

    it('passes generated accessibility ids to default slot', () => {
        const wrapper = mount(FormField, {
            props: {
                label: 'Email',
                hint: 'We never share it',
                error: 'Email is required',
            },
            slots: {
                default: ({
                    id,
                    describedBy,
                    invalid,
                    required,
                    ariaInvalid,
                    ariaRequired,
                }: {
                    id: string;
                    describedBy?: string;
                    invalid?: boolean;
                    required?: boolean;
                    ariaInvalid?: string;
                    ariaRequired?: string;
                }) =>
                    h('input', {
                        id,
                        'aria-describedby': describedBy,
                        'data-invalid': invalid ? 'true' : 'false',
                        'data-required': required ? 'true' : 'false',
                        'aria-invalid': ariaInvalid,
                        'aria-required': ariaRequired,
                    }),
            },
        });
        const control = wrapper.find('input');

        expect(control.attributes('id')).toBeTruthy();
        expect(control.attributes('aria-describedby')).toContain('-hint');
        expect(control.attributes('aria-describedby')).toContain('-error');
        expect(control.attributes('data-invalid')).toBe('true');
        expect(control.attributes('aria-invalid')).toBe('true');
    });

    it('wires describedBy only to available messages', () => {
        const hintOnly = mount(FormField, {
            props: {
                hint: 'Hint text',
            },
            slots: {
                default: ({ describedBy }: { describedBy?: string }) =>
                    h('input', { id: 'hint-only', 'aria-describedby': describedBy }),
            },
        });

        expect(hintOnly.find('input').attributes('aria-describedby')).toContain('-hint');
        expect(hintOnly.find('input').attributes('aria-describedby')).not.toContain('-error');

        const errorOnly = mount(FormField, {
            props: {
                error: 'Error text',
            },
            slots: {
                default: ({ describedBy }: { describedBy?: string }) =>
                    h('input', { id: 'error-only', 'aria-describedby': describedBy }),
            },
        });

        expect(errorOnly.find('input').attributes('aria-describedby')).toContain('-error');
        expect(errorOnly.find('.vf-form-field__error').attributes('role')).toBe('alert');

        const plain = mount(FormField, {
            props: {
                label: 'No messages',
            },
            slots: {
                default: ({ describedBy }: { describedBy?: string }) =>
                    h('input', { id: 'plain', 'aria-describedby': describedBy }),
            },
        });

        expect(plain.find('input').attributes('aria-describedby')).toBeUndefined();
    });

    it('keeps required semantics consistent in label and slot props', () => {
        const wrapper = mount(FormField, {
            props: {
                id: 'username',
                label: 'Username',
                required: true,
            },
            slots: {
                default: ({ id, ariaRequired }: { id: string; ariaRequired?: string }) =>
                    h('input', { id, 'aria-required': ariaRequired }),
            },
        });

        expect(wrapper.find('.vf-form-field__label').attributes('for')).toBe('username');
        expect(wrapper.find('.vf-form-field__required').exists()).toBe(true);
        expect(wrapper.find('.vf-form-field__required').attributes('aria-hidden')).toBe('true');
        expect(wrapper.find('input').attributes('aria-required')).toBe('true');
    });
});
