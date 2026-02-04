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
                default: ({ id, describedBy }: { id: string; describedBy?: string }) =>
                    h('input', {
                        id,
                        'aria-describedby': describedBy,
                    }),
            },
        });
        const control = wrapper.find('input');

        expect(control.attributes('id')).toBeTruthy();
        expect(control.attributes('aria-describedby')).toContain('-hint');
        expect(control.attributes('aria-describedby')).toContain('-error');
    });
});
