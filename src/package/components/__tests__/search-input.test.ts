import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import SearchInput from '../search-input.vue';

describe('SearchInput', () => {
    it('emits update:modelValue and debounced search on input', async () => {
        vi.useFakeTimers();
        const wrapper = mount(SearchInput, {
            props: { modelValue: '', debounce: 200 },
        });
        const input = wrapper.find('input');

        await input.setValue('abc');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['abc']);
        expect(wrapper.emitted('search')).toBeFalsy();

        vi.advanceTimersByTime(200);

        expect(wrapper.emitted('search')?.[0]).toEqual(['abc']);

        vi.useRealTimers();
    });

    it('emits immediate search on Enter', async () => {
        vi.useFakeTimers();
        const wrapper = mount(SearchInput, {
            props: { modelValue: '', debounce: 500 },
        });
        const input = wrapper.find('input');

        await input.setValue('term');
        await input.trigger('keydown.enter');

        expect(wrapper.emitted('search')?.[0]).toEqual(['term']);

        vi.useRealTimers();
    });

    it('clears value and emits clear event', async () => {
        const wrapper = mount(SearchInput, {
            props: {
                modelValue: 'query',
                clearable: true,
                debounce: 0,
            },
        });

        await wrapper.find('.vf-search-input__clear').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
        expect(wrapper.emitted('clear')?.[0]).toEqual([]);
        expect(wrapper.emitted('search')?.[0]).toEqual(['']);
    });
});
