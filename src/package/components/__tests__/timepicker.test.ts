import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TimePicker from '../timepicker.vue';

const mountTimePicker = (props: Record<string, unknown> = {}) => {
    return mount(TimePicker, {
        props,
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
});
