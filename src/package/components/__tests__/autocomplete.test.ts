import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Autocomplete from '../autocomplete.vue';

const options = [
    { label: 'United States', value: 'us' },
    { label: 'Germany', value: 'de' },
    { label: 'Japan', value: 'jp' },
];

const mountAutocomplete = (props: Record<string, unknown> = {}) => {
    return mount(Autocomplete, {
        props: { options, ...props },
        global: {
            stubs: {
                teleport: true,
            },
        },
    });
};

describe('Autocomplete', () => {
    it('filters options and emits search', async () => {
        const wrapper = mountAutocomplete();
        const input = wrapper.find('input');

        await input.setValue('ger');
        await nextTick();

        expect(wrapper.emitted('search')?.[0]).toEqual(['ger']);
        expect(wrapper.findAll('.vf-autocomplete__option')).toHaveLength(1);
        expect(wrapper.find('.vf-autocomplete__option').text()).toBe('Germany');
    });

    it('emits update:modelValue when option is clicked', async () => {
        const wrapper = mountAutocomplete();
        const input = wrapper.find('input');

        await input.trigger('focus');
        await nextTick();
        await wrapper.findAll('.vf-autocomplete__option')[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['de']);
        expect(wrapper.emitted('change')?.[0]).toEqual(['de']);
    });

    it('selects highlighted option with keyboard', async () => {
        const wrapper = mountAutocomplete();
        const input = wrapper.find('input');

        await input.trigger('focus');
        await input.trigger('keydown', { key: 'ArrowDown' });
        await input.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['de']);
    });
});
