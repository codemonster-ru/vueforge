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

    it('respects readonly mode and prevents opening/selecting', async () => {
        const wrapper = mountDateTimePicker({
            modelValue: '2026-02-10T09:00',
            readonly: true,
        });

        const control = wrapper.find('.vf-datetimepicker__control');

        expect(control.attributes('aria-readonly')).toBe('true');

        await control.trigger('click');
        await nextTick();

        expect(wrapper.find('.vf-datetimepicker__panel').isVisible()).toBe(false);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('supports custom aria labels for control and panel', async () => {
        const wrapper = mountDateTimePicker({
            ariaLabel: 'Meeting date and time',
            panelAriaLabel: 'Meeting planner panel',
            timeListAriaLabel: 'Meeting times',
        });

        await wrapper.find('.vf-datetimepicker__control').trigger('click');
        await nextTick();

        expect(wrapper.find('.vf-datetimepicker__control').attributes('aria-label')).toBe('Meeting date and time');
        expect(wrapper.find('.vf-datetimepicker__panel').attributes('aria-label')).toBe('Meeting planner panel');
        expect(wrapper.find('.vf-datetimepicker__times').attributes('aria-label')).toBe('Meeting times');
    });

    it('selects time with keyboard and closes panel', async () => {
        const wrapper = mountDateTimePicker({
            modelValue: '2026-02-10T09:00',
            minuteStep: 30,
        });

        await wrapper.find('.vf-datetimepicker__control').trigger('click');
        await nextTick();

        await wrapper.find('[data-date="2026-02-14"]').trigger('click');

        const timeButton = wrapper.find('[data-time="10:30"]');
        await timeButton.trigger('focus');
        await timeButton.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-02-14T10:30']);
        expect(wrapper.find('.vf-datetimepicker__panel').isVisible()).toBe(false);
    });

    it('falls back to placeholder for invalid modelValue', () => {
        const wrapper = mountDateTimePicker({
            modelValue: 'invalid-value',
            placeholder: 'Select datetime',
        });

        expect(wrapper.find('.vf-datetimepicker__label').text()).toBe('Select datetime');
    });

    it('keeps boundary times selectable when equal to min/max', async () => {
        const wrapper = mountDateTimePicker({
            modelValue: '2026-02-10T10:00',
            min: '2026-02-10T10:00',
            max: '2026-02-10T12:00',
            minuteStep: 60,
        });

        await wrapper.find('.vf-datetimepicker__control').trigger('click');
        await nextTick();

        expect(wrapper.find('[data-time="10:00"]').attributes('disabled')).toBeUndefined();
        expect(wrapper.find('[data-time="12:00"]').attributes('disabled')).toBeUndefined();
        expect(wrapper.find('[data-time="09:00"]').attributes('disabled')).toBeDefined();
        expect(wrapper.find('[data-time="13:00"]').attributes('disabled')).toBeDefined();
    });
});
