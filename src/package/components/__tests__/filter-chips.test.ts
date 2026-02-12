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
});
