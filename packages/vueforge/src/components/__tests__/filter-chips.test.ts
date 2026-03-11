import { mount } from '@vue/test-utils';
import FilterChips from '../filter-chips.vue';

const options = [
    { label: 'Open', value: 'open' },
    { label: 'In progress', value: 'progress' },
    { label: 'Done', value: 'done' },
];

describe('FilterChips', () => {
    it('toggles values in multiple mode', async () => {
        const wrapper = mount(FilterChips, {
            props: {
                modelValue: ['open'],
                options,
                multiple: true,
            },
        });

        await wrapper.find('[data-value="progress"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['open', 'progress']]);
    });

    it('selects and clears in single mode when allowEmpty is true', async () => {
        const wrapper = mount(FilterChips, {
            props: {
                modelValue: 'open',
                options,
                multiple: false,
                allowEmpty: true,
            },
        });

        await wrapper.find('[data-value="done"]').trigger('click');
        await wrapper.setProps({ modelValue: 'done' });
        await wrapper.find('[data-value="done"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['done']);
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([null]);
    });

    it('does not clear active option in single mode when allowEmpty is false', async () => {
        const wrapper = mount(FilterChips, {
            props: {
                modelValue: 'open',
                options,
                multiple: false,
                allowEmpty: false,
            },
        });

        await wrapper.find('[data-value="open"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('clears selection with clear button', async () => {
        const wrapper = mount(FilterChips, {
            props: {
                modelValue: ['open', 'done'],
                options,
                clearable: true,
            },
        });

        await wrapper.find('.vf-filter-chips__clear').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]]);
        expect(wrapper.emitted('clear')?.length).toBe(1);
    });

    it('sets aria-pressed for selected and unselected chips', () => {
        const wrapper = mount(FilterChips, {
            props: {
                modelValue: ['open'],
                options,
            },
        });

        expect(wrapper.find('[data-value="open"]').attributes('aria-pressed')).toBe('true');
        expect(wrapper.find('[data-value="progress"]').attributes('aria-pressed')).toBe('false');
    });

    it('does not emit changes when option is disabled', async () => {
        const wrapper = mount(FilterChips, {
            props: {
                modelValue: ['open'],
                options: [
                    { label: 'Open', value: 'open' },
                    { label: 'Blocked', value: 'blocked', disabled: true },
                ],
            },
        });

        await wrapper.find('[data-value="blocked"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
    });

    it('uses clearLabel for clear button aria-label', () => {
        const wrapper = mount(FilterChips, {
            props: {
                modelValue: ['open'],
                options,
                clearable: true,
                clearLabel: 'Clear active filters',
            },
        });

        expect(wrapper.find('.vf-filter-chips__clear').attributes('aria-label')).toBe('Clear active filters');
    });
});
