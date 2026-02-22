import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import DataTable from '../data-table.vue';
import MultiSelect from '../multi-select.vue';
import TagInput from '../tag-input.vue';
import CommandPalette from '../command-palette.vue';
import NotificationCenter from '../notification-center.vue';
import VirtualScroller from '../virtual-scroller.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

describe('RTL regression coverage', () => {
    beforeEach(() => {
        document.documentElement.setAttribute('dir', 'rtl');
    });

    afterEach(() => {
        document.documentElement.removeAttribute('dir');
    });

    it('keeps DataTable sorting and row selection stable', async () => {
        const wrapper = mount(DataTable, {
            props: {
                sortable: true,
                selectionMode: 'single',
                columns: [
                    { field: 'name', header: 'Name' },
                    { field: 'age', header: 'Age', sortable: true },
                ],
                rows: [
                    { id: 1, name: 'Alice', age: 30 },
                    { id: 2, name: 'Bob', age: 28 },
                ],
            },
        });

        const ageHeader = wrapper.findAll('.vf-datatable__sort-button').find(button => button.text().includes('Age'));
        await ageHeader?.trigger('click');
        await wrapper.find('.vf-datatable__selection-control').trigger('change');

        expect(wrapper.emitted('update:sortField')?.[0]).toEqual(['age']);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('update:selection')?.[0]).toEqual([2]);
    });

    it('keeps MultiSelect open/search/select flow stable', async () => {
        const wrapper = mount(MultiSelect, {
            props: {
                options: [
                    { label: 'United States', value: 'us' },
                    { label: 'Germany', value: 'de' },
                ],
                modelValue: [],
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await wrapper.find('.vf-multiselect__control').trigger('click');
        await nextTick();
        await wrapper.find('.vf-multiselect__search-control').setValue('ger');
        await wrapper.find('.vf-multiselect__option').trigger('click');

        expect(wrapper.emitted('search')?.[0]).toEqual(['ger']);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['de']]);
    });

    it('keeps TagInput add/remove behavior stable', async () => {
        const wrapper = mount(TagInput, {
            props: {
                modelValue: [],
                allowCustom: true,
                options: [
                    { label: 'Vue', value: 'vue' },
                    { label: 'TypeScript', value: 'ts' },
                ],
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        const input = wrapper.find('.vf-tag-input__control');
        await input.setValue('custom');
        await input.trigger('keydown.enter');
        await wrapper.setProps({ modelValue: ['custom', 'ts'] });
        await wrapper.findAll('.vf-tag-input__tag-remove')[0].trigger('click');

        expect(wrapper.emitted('add')?.[0]).toEqual([{ value: 'custom', source: 'custom' }]);
        expect(wrapper.emitted('remove')?.[0]).toEqual(['custom']);
    });

    it('keeps CommandPalette keyboard shortcut and select flow stable', async () => {
        const command = vi.fn();
        const wrapper = mount(CommandPalette, {
            props: {
                items: [{ label: 'Publish', value: 'publish', command }],
            },
            attachTo: document.body,
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
        await nextTick();
        await wrapper.find('.vf-command-palette__panel').trigger('keydown', { key: 'Enter' });

        expect(command).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('select')?.length).toBe(1);
        wrapper.unmount();
    });

    it('keeps NotificationCenter close behavior stable', async () => {
        const wrapper = mount(NotificationCenter, {
            props: {
                modelValue: true,
                items: [{ id: 1, title: 'Build completed', message: 'CI passed', read: false }],
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('keeps VirtualScroller range and end events stable', async () => {
        const wrapper = mount(VirtualScroller, {
            props: {
                items: Array.from({ length: 20 }, (_, index) => index),
                itemHeight: 20,
                height: '100px',
                overscan: 0,
            },
        });

        const viewport = wrapper.find('.vf-virtual-scroller');
        const element = viewport.element as HTMLElement;

        element.scrollTop = 10000;
        await viewport.trigger('scroll');

        expect(wrapper.emitted('rangeChange')).toBeTruthy();
        expect(wrapper.emitted('reachEnd')).toBeTruthy();
    });
});
