import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TimePicker from '../timepicker.vue';

const mountTimePicker = (props: Record<string, unknown> = {}) => {
    return mount(TimePicker, {
        props,
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
    });
};

describe('TimePicker', () => {
    it('shows placeholder when value is empty', () => {
        const wrapper = mountTimePicker({ placeholder: 'Pick time' });

        expect(wrapper.find('.vf-timepicker__label').text()).toBe('Pick time');
    });

    it('emits selected time in HH:mm format', async () => {
        const wrapper = mountTimePicker({ modelValue: '09:00', step: 30 });

        await wrapper.find('.vf-timepicker__control').trigger('click');
        await nextTick();
        await wrapper.find('[data-time="10:30"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['10:30']);
        expect(wrapper.emitted('change')?.[0]).toEqual(['10:30']);
    });

    it('disables times outside min and max', async () => {
        const wrapper = mountTimePicker({
            modelValue: '10:00',
            min: '09:00',
            max: '18:00',
            step: 60,
        });

        await wrapper.find('.vf-timepicker__control').trigger('click');
        await nextTick();

        expect(wrapper.find('[data-time="08:00"]').attributes('disabled')).toBeDefined();
        expect(wrapper.find('[data-time="19:00"]').attributes('disabled')).toBeDefined();
        expect(wrapper.find('[data-time="10:00"]').attributes('disabled')).toBeUndefined();
    });

    it('opens with keyboard and selects option with Enter', async () => {
        const wrapper = mountTimePicker({ modelValue: '09:00', step: 30 });
        const control = wrapper.find('.vf-timepicker__control');

        await control.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.find('.vf-timepicker').classes()).toContain('vf-timepicker_open');

        const option = wrapper.find('[data-time="10:30"]');
        await option.trigger('focus');
        await option.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['10:30']);
    });

    it('does not open in readonly mode', async () => {
        const wrapper = mountTimePicker({ modelValue: '09:00', readonly: true });
        const control = wrapper.find('.vf-timepicker__control');

        await control.trigger('click');
        await control.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.find('.vf-timepicker').classes()).not.toContain('vf-timepicker_open');
        expect(control.attributes('aria-readonly')).toBe('true');
    });

    it('treats invalid time value as empty display', () => {
        const wrapper = mountTimePicker({
            modelValue: '25:00',
            placeholder: 'Pick time',
        });

        expect(wrapper.find('.vf-timepicker__label').text()).toBe('Pick time');
    });
});
