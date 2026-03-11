import { mount } from '@vue/test-utils';
import Message from '../message.vue';

describe('Message', () => {
    it('renders as alert alias with severity state', () => {
        const wrapper = mount(Message, {
            props: {
                title: 'Heads up',
                message: 'Profile is incomplete',
                severity: 'info',
            },
        });

        const root = wrapper.get('.vf-alert');
        expect(root.classes()).toContain('vf-message');
        expect(root.attributes('data-severity')).toBe('info');
        expect(root.text()).toContain('Heads up');
        expect(root.text()).toContain('Profile is incomplete');
    });

    it('forwards close and update:modelValue events', async () => {
        const wrapper = mount(Message, {
            props: {
                modelValue: true,
                closable: true,
            },
        });

        await wrapper.get('.vf-alert__close').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        expect(wrapper.emitted('close')?.length).toBe(1);
    });

    it('supports slot pass-through', () => {
        const wrapper = mount(Message, {
            props: {
                closable: true,
            },
            slots: {
                title: '<strong>Custom title</strong>',
                default: '<span>Custom body</span>',
                actions: '<button class="msg-action" type="button">Retry</button>',
            },
        });

        expect(wrapper.find('.msg-action').exists()).toBe(true);
        expect(wrapper.text()).toContain('Custom title');
        expect(wrapper.text()).toContain('Custom body');
    });
});
