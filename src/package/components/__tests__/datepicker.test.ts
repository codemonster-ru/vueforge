import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DatePicker from '../datepicker.vue';

const mountDatePicker = (props: Record<string, unknown> = {}) => {
    return mount(DatePicker, {
        props,
        global: {
            stubs: {
                teleport: true,
            },
        },
    });
};

describe('DatePicker', () => {
    it('shows placeholder when value is empty', () => {
        const wrapper = mountDatePicker({ placeholder: 'Pick date' });

        expect(wrapper.find('.vf-datepicker__label').text()).toBe('Pick date');
    });

    it('emits selected date in ISO format', async () => {
        const wrapper = mountDatePicker({ modelValue: '2026-02-10' });

        await wrapper.find('.vf-datepicker__control').trigger('click');
        await nextTick();
        await wrapper.find('[data-date="2026-02-14"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-02-14']);
        expect(wrapper.emitted('change')?.[0]).toEqual(['2026-02-14']);
    });

    it('disables dates outside min and max', async () => {
        const wrapper = mountDatePicker({
            modelValue: '2026-02-10',
            min: '2026-02-05',
            max: '2026-02-20',
        });

        await wrapper.find('.vf-datepicker__control').trigger('click');
        await nextTick();

        expect(wrapper.find('[data-date="2026-02-01"]').attributes('disabled')).toBeDefined();
        expect(wrapper.find('[data-date="2026-02-25"]').attributes('disabled')).toBeDefined();
        expect(wrapper.find('[data-date="2026-02-10"]').attributes('disabled')).toBeUndefined();
    });
});
