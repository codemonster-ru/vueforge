import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DatePicker from '../datepicker.vue';
import { setDateTimeLocale } from '../../config/date-time-locale';

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
    afterEach(() => {
        setDateTimeLocale({ locale: 'en-US', firstDayOfWeek: 0 });
    });

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

    it('opens with keyboard and closes with Escape', async () => {
        const wrapper = mountDatePicker();
        const control = wrapper.find('.vf-datepicker__control');

        await control.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.find('.vf-datepicker').classes()).toContain('vf-datepicker_open');

        await control.trigger('keydown', { key: 'Escape' });
        expect(wrapper.find('.vf-datepicker').classes()).not.toContain('vf-datepicker_open');
    });

    it('does not open in readonly mode', async () => {
        const wrapper = mountDatePicker({ readonly: true });
        const control = wrapper.find('.vf-datepicker__control');

        await control.trigger('click');
        await control.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.find('.vf-datepicker').classes()).not.toContain('vf-datepicker_open');
        expect(control.attributes('aria-readonly')).toBe('true');
    });

    it('treats invalid ISO modelValue as empty state', () => {
        const wrapper = mountDatePicker({
            modelValue: '2026-02-31',
            placeholder: 'Pick date',
        });

        expect(wrapper.find('.vf-datepicker__label').text()).toBe('Pick date');
    });

    it('uses global locale/weekday config and allows local prop override', async () => {
        setDateTimeLocale({ locale: 'fr-FR', firstDayOfWeek: 1 });
        const wrapper = mountDatePicker({
            locale: 'en-US',
            firstDayOfWeek: 0,
        });

        await wrapper.find('.vf-datepicker__control').trigger('click');
        await nextTick();

        const weekday = wrapper.findAll('.vf-datepicker__weekday')[0].text();
        const expected = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(2026, 0, 4));

        expect(weekday).toBe(expected);
    });
});
