import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MultiSelect from '../multi-select.vue';

const options = [
    { label: 'United States', value: 'us' },
    { label: 'Germany', value: 'de' },
    { label: 'Japan', value: 'jp' },
];

const mountMultiSelect = (props: Record<string, unknown> = {}) => {
    return mount(MultiSelect, {
        props: { options, ...props },
        global: {
            stubs: {
                teleport: true,
            },
        },
    });
};

describe('MultiSelect', () => {
    it('emits selected values when options are toggled', async () => {
        const wrapper = mountMultiSelect({ modelValue: [] });

        await wrapper.find('.vf-multiselect__control').trigger('click');
        await nextTick();

        const optionButtons = wrapper.findAll('.vf-multiselect__option');

        await optionButtons[0].trigger('click');
        await wrapper.setProps({ modelValue: ['us'] });
        await optionButtons[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['us']]);
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['us', 'de']]);
    });

    it('filters options and emits search', async () => {
        const wrapper = mountMultiSelect();

        await wrapper.find('.vf-multiselect__control').trigger('click');
        await nextTick();
        await wrapper.find('.vf-multiselect__search-control').setValue('ger');
        await nextTick();

        expect(wrapper.emitted('search')?.[0]).toEqual(['ger']);
        expect(wrapper.findAll('.vf-multiselect__option')).toHaveLength(1);
        expect(wrapper.find('.vf-multiselect__option').text()).toContain('Germany');
    });

    it('clears value when clear button is clicked', async () => {
        const wrapper = mountMultiSelect({
            modelValue: ['de'],
            clearable: true,
        });

        await wrapper.find('.vf-multiselect__clear').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]]);
        expect(wrapper.emitted('change')?.[0]).toEqual([[]]);
    });

    it('removes a selected chip by remove action', async () => {
        const wrapper = mountMultiSelect({
            modelValue: ['us', 'de'],
        });

        const chipRemove = wrapper.findAll('.vf-multiselect__chip-remove')[0];
        await chipRemove.trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['de']]);
        expect(wrapper.emitted('change')?.[0]).toEqual([['de']]);
    });

    it('removes last selected item on Backspace from trigger', async () => {
        const wrapper = mountMultiSelect({
            modelValue: ['us', 'de'],
        });
        const trigger = wrapper.find('.vf-multiselect__control');

        await trigger.trigger('keydown', { key: 'Backspace' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['us']]);
    });

    it('does not open or search in readonly mode', async () => {
        const wrapper = mountMultiSelect({
            modelValue: ['us'],
            readonly: true,
        });
        const trigger = wrapper.find('.vf-multiselect__control');

        await trigger.trigger('click');
        await trigger.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.find('.vf-multiselect').classes()).not.toContain('vf-multiselect_open');
        expect(trigger.attributes('aria-readonly')).toBe('true');
    });
});
