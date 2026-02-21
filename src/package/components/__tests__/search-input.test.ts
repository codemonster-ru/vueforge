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

    it('applies native and aria attributes to search control', () => {
        const wrapper = mount(SearchInput, {
            props: {
                modelValue: '',
                id: 'search',
                name: 'search',
                required: true,
                autocomplete: 'off',
                inputmode: 'search',
                ariaLabel: 'Search projects',
                ariaDescribedby: 'search-hint',
                ariaInvalid: true,
            },
        });
        const input = wrapper.find('input');

        expect(input.attributes('id')).toBe('search');
        expect(input.attributes('name')).toBe('search');
        expect(input.attributes('required')).toBeDefined();
        expect(input.attributes('autocomplete')).toBe('off');
        expect(input.attributes('inputmode')).toBe('search');
        expect(input.attributes('aria-label')).toBe('Search projects');
        expect(input.attributes('aria-describedby')).toBe('search-hint');
        expect(input.attributes('aria-invalid')).toBe('true');
        expect(input.attributes('aria-required')).toBe('true');
    });

    it('does not emit search from Enter when disabled or readonly', async () => {
        const disabled = mount(SearchInput, {
            props: { modelValue: 'x', disabled: true, debounce: 0 },
        });
        const readonly = mount(SearchInput, {
            props: { modelValue: 'x', readonly: true, debounce: 0 },
        });

        await disabled.find('input').trigger('keydown.enter');
        await readonly.find('input').trigger('keydown.enter');

        expect(disabled.emitted('search')).toBeFalsy();
        expect(readonly.emitted('search')).toBeFalsy();
    });
});
