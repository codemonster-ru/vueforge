import { mount } from '@vue/test-utils';
import FloatLabel from '../float-label.vue';

describe('FloatLabel', () => {
    it('renders label and required marker', () => {
        const wrapper = mount(FloatLabel, {
            props: {
                label: 'Email',
                required: true,
                forId: 'email',
            },
            slots: {
                default: '<input id="email" />',
            },
        });

        const label = wrapper.get('.vf-float-label__label');
        expect(label.text()).toContain('Email');
        expect(label.attributes('for')).toBe('email');
        expect(wrapper.find('.vf-float-label__required').exists()).toBe(true);
    });

    it('floats when modelValue is filled', () => {
        const wrapper = mount(FloatLabel, {
            props: {
                label: 'Name',
                modelValue: 'Ada',
            },
            slots: {
                default: '<input />',
            },
        });

        expect(wrapper.classes()).toContain('vf-float-label_floating');
    });

    it('floats on focus and resets after blur when empty', async () => {
        const wrapper = mount(FloatLabel, {
            props: {
                label: 'City',
            },
            slots: {
                default: '<input />',
            },
        });

        const root = wrapper.get('.vf-float-label');

        await root.trigger('focusin');
        expect(wrapper.classes()).toContain('vf-float-label_floating');

        await root.trigger('focusout');
        expect(wrapper.classes()).not.toContain('vf-float-label_floating');
    });

    it('supports size and disabled/invalid states', () => {
        const wrapper = mount(FloatLabel, {
            props: {
                label: 'Phone',
                size: 'large',
                disabled: true,
                invalid: true,
            },
            slots: {
                default: '<input />',
            },
        });

        expect(wrapper.classes()).toContain('vf-float-label_large');
        expect(wrapper.classes()).toContain('vf-float-label_disabled');
        expect(wrapper.classes()).toContain('vf-float-label_invalid');
    });
});
