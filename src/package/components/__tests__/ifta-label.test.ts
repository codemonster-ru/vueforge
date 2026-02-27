import { mount } from '@vue/test-utils';
import IftaLabel from '../ifta-label.vue';

describe('IftaLabel', () => {
    it('renders label with for/id mapping and required marker', () => {
        const wrapper = mount(IftaLabel, {
            props: {
                label: 'Email',
                forId: 'email',
                required: true,
            },
            slots: {
                default: '<input id="email" />',
            },
        });

        const label = wrapper.get('.vf-ifta-label__label');
        expect(label.text()).toContain('Email');
        expect(label.attributes('for')).toBe('email');
        expect(wrapper.find('.vf-ifta-label__required').exists()).toBe(true);
    });

    it('supports disabled and invalid states', () => {
        const wrapper = mount(IftaLabel, {
            props: {
                label: 'Amount',
                disabled: true,
                invalid: true,
            },
            slots: {
                default: '<input />',
            },
        });

        expect(wrapper.classes()).toContain('vf-ifta-label_disabled');
        expect(wrapper.classes()).toContain('vf-ifta-label_invalid');
    });

    it('supports size variants', () => {
        const small = mount(IftaLabel, {
            props: { label: 'Small', size: 'small' },
            slots: { default: '<input />' },
        });
        const large = mount(IftaLabel, {
            props: { label: 'Large', size: 'large' },
            slots: { default: '<input />' },
        });

        expect(small.classes()).toContain('vf-ifta-label_small');
        expect(large.classes()).toContain('vf-ifta-label_large');
    });

    it('supports custom label slot', () => {
        const wrapper = mount(IftaLabel, {
            slots: {
                default: '<input />',
                label: '<span class="custom-label">Profile name</span>',
            },
        });

        expect(wrapper.find('.custom-label').text()).toBe('Profile name');
    });
});
