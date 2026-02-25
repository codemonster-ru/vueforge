import { mount } from '@vue/test-utils';
import DataTableToolbar from '../data-table-toolbar.vue';

describe('DataTableToolbar', () => {
    it('emits search updates when typing in search input', async () => {
        const wrapper = mount(DataTableToolbar);

        await wrapper.find('.vf-data-table-toolbar__input').setValue('alice');

        expect(wrapper.emitted('update:search')?.at(-1)).toEqual(['alice']);
        expect(wrapper.emitted('search')?.at(-1)).toEqual(['alice']);
    });

    it('emits filter click and shows active filter badge', async () => {
        const wrapper = mount(DataTableToolbar, {
            props: {
                filterCount: 3,
            },
        });

        await wrapper.find('.vf-data-table-toolbar__button').trigger('click');

        expect(wrapper.find('.vf-data-table-toolbar__badge').text()).toBe('3');
        expect(wrapper.emitted('filtersClick')).toBeTruthy();
    });

    it('emits column preset and density updates', async () => {
        const wrapper = mount(DataTableToolbar, {
            props: {
                columnPresets: [
                    { id: 'compact-columns', label: 'Compact Columns' },
                    { id: 'wide-columns', label: 'Wide Columns' },
                ],
                density: 'comfortable',
            },
        });

        const selects = wrapper.findAll('.vf-data-table-toolbar__select');
        await selects[0].setValue('wide-columns');
        await selects[1].setValue('compact');

        expect(wrapper.emitted('update:columnPreset')?.at(-1)).toEqual(['wide-columns']);
        expect(wrapper.emitted('columnPresetChange')?.at(-1)).toEqual(['wide-columns']);
        expect(wrapper.emitted('update:density')?.at(-1)).toEqual(['compact']);
        expect(wrapper.emitted('densityChange')?.at(-1)).toEqual(['compact']);
    });

    it('emits export entry point selection', async () => {
        const wrapper = mount(DataTableToolbar, {
            props: {
                exportOptions: [
                    { id: 'csv', label: 'CSV' },
                    { id: 'xlsx', label: 'Excel' },
                ],
            },
        });

        const exportSelect = wrapper.findAll('.vf-data-table-toolbar__select')[2];
        await exportSelect.setValue('csv');

        expect(wrapper.emitted('export')?.at(-1)).toEqual(['csv']);
    });
});
