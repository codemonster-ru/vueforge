import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DateRangePicker from '../date-range-picker.vue';

const mountDateRangePicker = (props: Record<string, unknown> = {}) => {
    return mount(DateRangePicker, {
        props,
        global: {
            stubs: {
                teleport: true,
            },
        },
    });
};

describe('DateRangePicker', () => {
    it('shows placeholder when range is empty', () => {
        const wrapper = mountDateRangePicker({ placeholder: 'Pick range' });

        expect(wrapper.find('.vf-daterangepicker__label').text()).toBe('Pick range');
    });

    it('emits selected range in ISO format', async () => {
        const wrapper = mountDateRangePicker({ modelValue: ['2026-02-10', null] });

        await wrapper.find('.vf-daterangepicker__control').trigger('click');
        await nextTick();
        await wrapper.find('[data-date="2026-02-14"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-02-10', '2026-02-14']]);
        expect(wrapper.emitted('change')?.[0]).toEqual([['2026-02-10', '2026-02-14']]);
    });

    it('disables dates outside min and max', async () => {
        const wrapper = mountDateRangePicker({
            modelValue: ['2026-02-10', null],
            min: '2026-02-05',
            max: '2026-02-20',
        });

        await wrapper.find('.vf-daterangepicker__control').trigger('click');
        await nextTick();

        expect(wrapper.find('[data-date="2026-02-01"]').attributes('disabled')).toBeDefined();
        expect(wrapper.find('[data-date="2026-02-25"]').attributes('disabled')).toBeDefined();
        expect(wrapper.find('[data-date="2026-02-10"]').attributes('disabled')).toBeUndefined();
    });
});
