import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Autocomplete from '../autocomplete.vue';
import { setLocaleText } from '@/package/config/locale-text';

const options = [
    { label: 'United States', value: 'us' },
    { label: 'Germany', value: 'de' },
    { label: 'Japan', value: 'jp', disabled: true },
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
    afterEach(() => {
        setLocaleText();
    });

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

    it('closes panel on Escape after opening with keyboard', async () => {
        const wrapper = mountAutocomplete();
        const input = wrapper.find('input');

        await input.trigger('focus');
        expect(wrapper.find('.vf-autocomplete').classes()).toContain('vf-autocomplete_open');

        await input.trigger('keydown', { key: 'Escape' });

        expect(wrapper.find('.vf-autocomplete').classes()).not.toContain('vf-autocomplete_open');
    });

    it('does not search or open panel in readonly mode', async () => {
        const wrapper = mountAutocomplete({ readonly: true });
        const input = wrapper.find('input');

        await input.setValue('ger');
        await input.trigger('focus');
        await input.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.emitted('search')).toBeFalsy();
        expect(wrapper.find('.vf-autocomplete').classes()).not.toContain('vf-autocomplete_open');
        expect(wrapper.find('.vf-autocomplete__chevron').attributes('disabled')).toBeDefined();
    });

    it('uses global locale loading and empty labels by default and keeps prop override priority', async () => {
        setLocaleText({
            autocomplete: {
                loadingText: 'Buscando...',
                emptyText: 'Sin resultados',
            },
        });

        const loadingWrapper = mountAutocomplete({ loading: true });
        const loadingInput = loadingWrapper.find('input');
        await loadingInput.trigger('focus');
        await nextTick();
        expect(loadingWrapper.text()).toContain('Buscando...');

        const emptyWrapper = mountAutocomplete({ options: [] });
        const emptyInput = emptyWrapper.find('input');
        await emptyInput.trigger('focus');
        await nextTick();
        expect(emptyWrapper.text()).toContain('Sin resultados');

        const overrideWrapper = mountAutocomplete({
            options: [],
            emptyText: 'Custom empty',
        });
        const overrideInput = overrideWrapper.find('input');
        await overrideInput.trigger('focus');
        await nextTick();
        expect(overrideWrapper.text()).toContain('Custom empty');
    });
});
