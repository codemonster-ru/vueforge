import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DataTable from '../data-table.vue';

describe('A11y Table Flows', () => {
    it('exposes table label and sortable aria state', async () => {
        const wrapper = mount(DataTable, {
            props: {
                ariaLabel: 'Users table',
                sortable: true,
                columns: [
                    { field: 'name', header: 'Name', sortable: true },
                    { field: 'age', header: 'Age' },
                ],
                rows: [{ id: 1, name: 'Alice', age: 29 }],
            },
        });

        expect(wrapper.find('table').attributes('aria-label')).toBe('Users table');
        expect(wrapper.findAll('th')[0].attributes('aria-sort')).toBe('none');

        await wrapper.find('.vf-datatable__sort-button').trigger('click');
        await nextTick();

        expect(wrapper.findAll('th')[0].attributes('aria-sort')).toBe('ascending');
    });

    it('provides accessible labels for row selection controls', () => {
        const wrapper = mount(DataTable, {
            props: {
                selectionMode: 'multiple',
                columns: [{ field: 'name', header: 'Name' }],
                rows: [{ id: 10, name: 'Alice' }],
                selectAllAriaLabel: 'Select all users',
                selectRowAriaLabel: 'Select user',
            },
        });

        expect(wrapper.find('thead .vf-datatable__selection-control').attributes('aria-label')).toBe(
            'Select all users',
        );
        expect(wrapper.find('tbody .vf-datatable__selection-control').attributes('aria-label')).toContain(
            'Select user',
        );
    });
});
