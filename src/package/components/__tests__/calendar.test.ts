import { mount } from '@vue/test-utils';
import Calendar from '../calendar.vue';

const mountCalendar = (props: Record<string, unknown> = {}) => {
    return mount(Calendar, { props });
};

describe('Calendar', () => {
    it('emits selected date in ISO format', async () => {
        const wrapper = mountCalendar({ modelValue: '2026-02-10' });

        await wrapper.find('[data-date="2026-02-14"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-02-14']);
        expect(wrapper.emitted('change')?.[0]).toEqual(['2026-02-14']);
    });

    it('disables dates outside min and max', () => {
        const wrapper = mountCalendar({
            modelValue: '2026-02-10',
            min: '2026-02-05',
            max: '2026-02-20',
        });

        expect(wrapper.find('[data-date="2026-02-01"]').attributes('disabled')).toBeDefined();
        expect(wrapper.find('[data-date="2026-02-25"]').attributes('disabled')).toBeDefined();
        expect(wrapper.find('[data-date="2026-02-10"]').attributes('disabled')).toBeUndefined();
    });
});
