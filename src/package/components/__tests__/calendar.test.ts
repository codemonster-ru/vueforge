import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Calendar from '../calendar.vue';
import { setDateTimeLocale } from '../../config/date-time-locale';

const mountCalendar = (props: Record<string, unknown> = {}) => {
    return mount(Calendar, {
        props,
        attachTo: document.body,
    });
};

describe('Calendar', () => {
    afterEach(() => {
        setDateTimeLocale({ locale: 'en-US', firstDayOfWeek: 0 });
    });

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

    it('supports keyboard day navigation', async () => {
        const wrapper = mountCalendar({ modelValue: '2026-02-10' });
        const day = wrapper.find('[data-date="2026-02-10"]');

        await day.trigger('focus');
        await day.trigger('keydown', { key: 'ArrowRight' });
        await nextTick();

        const active = document.activeElement as HTMLElement | null;
        expect(active?.getAttribute('data-date')).toBe('2026-02-11');
    });

    it('selects date with keyboard Enter', async () => {
        const wrapper = mountCalendar({ modelValue: '2026-02-10' });
        const day = wrapper.find('[data-date="2026-02-14"]');

        await day.trigger('focus');
        await day.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-02-14']);
    });

    it('does not select in readonly mode', async () => {
        const wrapper = mountCalendar({ modelValue: '2026-02-10', readonly: true });
        const day = wrapper.find('[data-date="2026-02-14"]');

        await day.trigger('click');
        await day.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('treats invalid ISO value as empty selection', () => {
        const wrapper = mountCalendar({ modelValue: '2026-02-31' });

        expect(wrapper.find('.vf-calendar__day.is-selected').exists()).toBe(false);
    });

    it('uses global locale config when locale props are omitted', () => {
        setDateTimeLocale({ locale: 'de-DE', firstDayOfWeek: 1 });
        const wrapper = mountCalendar({ modelValue: '2026-02-10' });

        const weekday = wrapper.findAll('.vf-calendar__weekday')[0].text();
        const expected = new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(new Date(2026, 0, 5));

        expect(weekday).toBe(expected);
    });
});
