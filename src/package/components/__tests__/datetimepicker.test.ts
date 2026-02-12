import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DateTimePicker from '../datetimepicker.vue';

const mountDateTimePicker = (props: Record<string, unknown> = {}) => {
    return mount(DateTimePicker, {
        props,
        global: {
            stubs: {
                teleport: true,
            },
        },
    });
};

describe('DateTimePicker', () => {
    it('shows placeholder when value is empty', () => {
        const wrapper = mountDateTimePicker({ placeholder: 'Pick date and time' });

        expect(wrapper.find('.vf-datetimepicker__label').text()).toBe('Pick date and time');
    });

    it('emits selected datetime in ISO format', async () => {
        const wrapper = mountDateTimePicker({ modelValue: '2026-02-10T09:00', minuteStep: 30 });

        await wrapper.find('.vf-datetimepicker__control').trigger('click');
        await nextTick();
        await wrapper.find('[data-date="2026-02-14"]').trigger('click');
        await wrapper.find('[data-time="10:30"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['2026-02-14T10:30']);
        expect(wrapper.emitted('change')?.[1]).toEqual(['2026-02-14T10:30']);
        expect(wrapper.find('.vf-datetimepicker__panel').isVisible()).toBe(false);
    });

    it('disables time options outside min and max for selected day', async () => {
        const wrapper = mountDateTimePicker({
            modelValue: '2026-02-10T10:00',
            min: '2026-02-10T09:00',
            max: '2026-02-10T18:00',
            minuteStep: 60,
        });

        await wrapper.find('.vf-datetimepicker__control').trigger('click');
        await nextTick();

        expect(wrapper.find('[data-time="08:00"]').attributes('disabled')).toBeDefined();
        expect(wrapper.find('[data-time="19:00"]').attributes('disabled')).toBeDefined();
        expect(wrapper.find('[data-time="10:00"]').attributes('disabled')).toBeUndefined();
    });
});
