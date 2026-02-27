import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import ToggleButton from '../toggle-button.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

describe('ToggleButton', () => {
    it('emits model updates and change payload on click', async () => {
        const wrapper = mount(ToggleButton, {
            props: {
                modelValue: false,
                label: 'Mute',
            },
        });

        await wrapper.get('.vf-toggle-button').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
        expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true);
    });

    it('applies active and aria-pressed state from modelValue', () => {
        const wrapper = mount(ToggleButton, {
            props: {
                modelValue: true,
                label: 'Pinned',
            },
        });

        expect(wrapper.classes()).toContain('vf-toggle-button_active');
        expect(wrapper.attributes('aria-pressed')).toBe('true');
    });

    it('respects disabled state and does not emit updates', async () => {
        const wrapper = mount(ToggleButton, {
            props: {
                modelValue: false,
                disabled: true,
            },
        });

        await wrapper.get('.vf-toggle-button').trigger('click');

        expect(wrapper.classes()).toContain('vf-toggle-button_disabled');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('uses state-specific labels/icons when provided', () => {
        const wrapper = mount(ToggleButton, {
            props: {
                modelValue: true,
                onLabel: 'Enabled',
                offLabel: 'Disabled',
                onIcon: 'check',
                offIcon: 'xmark',
                ariaLabelOn: 'Disable mode',
                ariaLabelOff: 'Enable mode',
            },
        });

        expect(wrapper.text()).toContain('Enabled');
        expect(wrapper.attributes('aria-label')).toBe('Disable mode');
        expect(wrapper.find('.vf-icon-stub').exists()).toBe(true);
    });
});
