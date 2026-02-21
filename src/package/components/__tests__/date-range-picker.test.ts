import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DateRangePicker from '../date-range-picker.vue';
import { setDateTimeLocale } from '../../config/date-time-locale';

const mountDateRangePicker = (props: Record<string, unknown> = {}) => {
    return mount(DateRangePicker, {
        props,
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
    });
};

describe('DateRangePicker', () => {
    afterEach(() => {
        setDateTimeLocale({ locale: 'en-US', firstDayOfWeek: 0 });
    });

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

    it('opens with keyboard and closes with Escape', async () => {
        const wrapper = mountDateRangePicker();
        const control = wrapper.find('.vf-daterangepicker__control');

        await control.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.find('.vf-daterangepicker').classes()).toContain('vf-daterangepicker_open');

        await control.trigger('keydown', { key: 'Escape' });
        expect(wrapper.find('.vf-daterangepicker').classes()).not.toContain('vf-daterangepicker_open');
    });

    it('supports keyboard range commit with Enter', async () => {
        const wrapper = mountDateRangePicker({ modelValue: ['2026-02-10', null] });
        const control = wrapper.find('.vf-daterangepicker__control');

        await control.trigger('click');
        await nextTick();

        const day = wrapper.find('[data-date="2026-02-14"]');
        await day.trigger('focus');
        await day.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-02-10', '2026-02-14']]);
    });

    it('does not open or select in readonly mode', async () => {
        const wrapper = mountDateRangePicker({ modelValue: ['2026-02-10', null], readonly: true });
        const control = wrapper.find('.vf-daterangepicker__control');

        await control.trigger('click');
        await control.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.find('.vf-daterangepicker').classes()).not.toContain('vf-daterangepicker_open');
        expect(control.attributes('aria-readonly')).toBe('true');
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('treats invalid ISO range values as empty display', () => {
        const wrapper = mountDateRangePicker({
            modelValue: ['2026-02-31', '2026-02-40'],
            placeholder: 'Pick range',
        });

        expect(wrapper.find('.vf-daterangepicker__label').text()).toBe('Pick range');
    });

    it('starts range from empty null modelValue', async () => {
        const wrapper = mountDateRangePicker({
            modelValue: null,
        });

        await wrapper.find('.vf-daterangepicker__control').trigger('click');
        await nextTick();
        await wrapper.find('[data-date="2026-02-14"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-02-14', null]]);
    });

    it('normalizes range when second pick is before start', async () => {
        const wrapper = mountDateRangePicker({
            modelValue: ['2026-02-14', null],
        });

        await wrapper.find('.vf-daterangepicker__control').trigger('click');
        await nextTick();
        await wrapper.find('[data-date="2026-02-10"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-02-10', '2026-02-14']]);
    });

    it('uses global locale config when props are omitted', async () => {
        setDateTimeLocale({ locale: 'it-IT', firstDayOfWeek: 1 });
        const wrapper = mountDateRangePicker();

        await wrapper.find('.vf-daterangepicker__control').trigger('click');
        await nextTick();

        const weekday = wrapper.findAll('.vf-daterangepicker__weekday')[0].text();
        const expected = new Intl.DateTimeFormat('it-IT', { weekday: 'short' }).format(new Date(2026, 0, 5));

        expect(weekday).toBe(expected);
    });
});
