import { mount } from '@vue/test-utils';
import InlineMessage from '../inline-message.vue';

describe('InlineMessage', () => {
    it('renders local message content and severity', () => {
        const wrapper = mount(InlineMessage, {
            props: {
                title: 'Password',
                message: 'Use at least 12 characters.',
                severity: 'info',
            },
        });

        const root = wrapper.get('.vf-inline-message');

        expect(root.attributes('data-severity')).toBe('info');
        expect(root.text()).toContain('Password');
        expect(root.text()).toContain('Use at least 12 characters.');
    });

    it('uses alert semantics for warn/danger by default', () => {
        const wrapper = mount(InlineMessage, {
            props: {
                message: 'Email is invalid.',
                severity: 'danger',
            },
        });

        const root = wrapper.get('.vf-inline-message');

        expect(root.attributes('role')).toBe('alert');
        expect(root.attributes('aria-live')).toBe('assertive');
    });

    it('supports explicit role override', () => {
        const wrapper = mount(InlineMessage, {
            props: {
                message: 'Saved.',
                severity: 'success',
                role: 'none',
                ariaLive: 'off',
            },
        });

        const root = wrapper.get('.vf-inline-message');

        expect(root.attributes('role')).toBeUndefined();
        expect(root.attributes('aria-live')).toBe('off');
    });

    it('renders slots and icon content', () => {
        const wrapper = mount(InlineMessage, {
            props: {
                severity: 'warn',
            },
            slots: {
                icon: '<span class="icon-slot">!</span>',
                title: '<strong>Quota</strong>',
                default: '<span>Storage is nearly full</span>',
            },
        });

        expect(wrapper.find('.icon-slot').exists()).toBe(true);
        expect(wrapper.text()).toContain('Quota');
        expect(wrapper.text()).toContain('Storage is nearly full');
    });
});
