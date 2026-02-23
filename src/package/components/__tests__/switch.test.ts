import { mount } from '@vue/test-utils';
import Switch from '../switch.vue';

describe('Switch', () => {
    it('emits update:modelValue and change on toggle', async () => {
        const wrapper = mount(Switch, {
            props: {
                modelValue: false,
            },
        });
        const input = wrapper.find('input[type="checkbox"]');

        await input.setValue(true);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
        expect(wrapper.emitted('change')?.length).toBe(1);
    });

    it('applies native and aria attributes to switch control', () => {
        const wrapper = mount(Switch, {
            props: {
                modelValue: true,
                id: 'notifications',
                name: 'notifications',
                required: true,
                ariaLabel: 'Enable notifications',
                ariaDescribedby: 'notifications-hint',
                ariaInvalid: true,
            },
        });
        const input = wrapper.find('input[type="checkbox"]');

        expect(input.attributes('id')).toBe('notifications');
        expect(input.attributes('name')).toBe('notifications');
        expect(input.attributes('required')).toBeDefined();
        expect(input.attributes('aria-label')).toBe('Enable notifications');
        expect(input.attributes('aria-describedby')).toBe('notifications-hint');
        expect(input.attributes('aria-invalid')).toBe('true');
        expect(input.attributes('aria-required')).toBe('true');
    });

    it('applies disabled semantics and class', () => {
        const wrapper = mount(Switch, {
            props: {
                modelValue: false,
                disabled: true,
            },
        });

        expect(wrapper.classes()).toContain('vf-switch_disabled');
        expect(wrapper.find('input[type="checkbox"]').attributes('disabled')).toBeDefined();
    });

    it('renders label from slot', () => {
        const wrapper = mount(Switch, {
            slots: {
                default: '<span class="slot-label">Custom switch label</span>',
            },
        });

        expect(wrapper.find('.slot-label').text()).toBe('Custom switch label');
    });
});
