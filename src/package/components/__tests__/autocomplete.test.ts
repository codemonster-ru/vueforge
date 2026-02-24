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

    it('supports virtualized rendering and emits loadMore near the end', async () => {
        const longOptions = Array.from({ length: 150 }).map((_, index) => ({
            label: `Country ${index}`,
            value: index,
        }));

        const wrapper = mount(Autocomplete, {
            props: {
                options: longOptions,
                virtual: true,
                virtualThreshold: 100,
                virtualItemHeight: 20,
                loadMoreOffset: 1,
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        const input = wrapper.find('input');
        await input.trigger('focus');
        await nextTick();

        const rendered = wrapper.findAll('.vf-autocomplete__option');
        expect(rendered.length).toBeLessThan(150);

        const panel = wrapper.find('.vf-autocomplete__panel');
        Object.defineProperty(panel.element, 'clientHeight', { value: 120, configurable: true });
        (panel.element as HTMLElement).scrollTop = 2900;
        await panel.trigger('scroll');

        const loadMore = wrapper.emitted('loadMore');
        const payload = loadMore?.[0]?.[0] as { query: string; total: number; visibleEndIndex: number } | undefined;
        expect(loadMore).toBeTruthy();
        expect(payload).toMatchObject({
            query: '',
            total: 150,
        });
        expect(payload?.visibleEndIndex ?? 0).toBeGreaterThan(0);

        (panel.element as HTMLElement).scrollTop = 2920;
        await panel.trigger('scroll');

        expect(wrapper.emitted('loadMore')).toHaveLength(1);
    });

    it('supports multiple mode with chips and backspace remove', async () => {
        const wrapper = mountAutocomplete({
            multiple: true,
            modelValue: ['us'],
            'onUpdate:modelValue': (value: Array<string | number>) => wrapper.setProps({ modelValue: value }),
        });

        expect(wrapper.findAll('.vf-autocomplete__chip')).toHaveLength(1);

        const input = wrapper.find('input');
        await input.trigger('focus');
        await wrapper.findAll('.vf-autocomplete__option')[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['us', 'de']]);
        expect(wrapper.findAll('.vf-autocomplete__chip')).toHaveLength(2);

        await input.setValue('');
        await input.trigger('keydown', { key: 'Backspace' });
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['us']]);
    });

    it('renders grouped options and filters inside groups', async () => {
        const groupedOptions = [
            {
                label: 'Europe',
                items: [
                    { label: 'Germany', value: 'de' },
                    { label: 'France', value: 'fr' },
                ],
            },
            {
                label: 'Asia',
                items: [{ label: 'Japan', value: 'jp' }],
            },
        ];

        const wrapper = mount(Autocomplete, {
            props: {
                options: groupedOptions,
                grouped: true,
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        const input = wrapper.find('input');
        await input.trigger('focus');
        expect(wrapper.findAll('.vf-autocomplete__group-label')).toHaveLength(2);

        await input.setValue('ger');
        await nextTick();

        expect(wrapper.findAll('.vf-autocomplete__group-label')).toHaveLength(1);
        expect(wrapper.find('.vf-autocomplete__group-label').text()).toBe('Europe');
        expect(wrapper.findAll('.vf-autocomplete__option')).toHaveLength(1);
    });

    it('supports async grouping flow via groupBy after external options update', async () => {
        const wrapper = mount(Autocomplete, {
            props: {
                options: [],
                groupBy: item => String(item.region ?? 'Other'),
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        const input = wrapper.find('input');
        await input.setValue('uni');
        expect(wrapper.emitted('search')?.[0]).toEqual(['uni']);

        await wrapper.setProps({
            options: [
                { label: 'United States', value: 'us', region: 'Americas' },
                { label: 'United Kingdom', value: 'uk', region: 'Europe' },
            ],
        });
        await nextTick();

        const labels = wrapper.findAll('.vf-autocomplete__group-label').map(node => node.text());
        expect(labels).toContain('Americas');
        expect(labels).toContain('Europe');
    });
});
