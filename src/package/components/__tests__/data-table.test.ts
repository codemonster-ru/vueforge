import { mount } from '@vue/test-utils';
import DataTable from '../data-table.vue';

describe('DataTable', () => {
    const columns = [
        { field: 'name', header: 'Name' },
        { field: 'role', header: 'Role' },
        { field: 'age', header: 'Age', sortable: true },
    ];
    const rows = [
        { id: 1, name: 'Alice', role: 'Dev', age: 29 },
        { id: 2, name: 'Bob', role: 'Design', age: 34 },
        { id: 3, name: 'Chen', role: 'Product', age: 31 },
    ];

    it('emits sort updates and sorts rows when header is clicked', async () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                rows,
                sortable: true,
            },
        });

        const headerButtons = wrapper.findAll('.vf-datatable__sort-button');
        const ageHeader = headerButtons.find(button => button.text().includes('Age'));

        expect(ageHeader).toBeDefined();

        await ageHeader?.trigger('click');

        expect(wrapper.emitted('update:sortField')?.[0]).toEqual(['age']);
        expect(wrapper.emitted('update:sortOrder')?.[0]).toEqual(['asc']);

        const bodyRows = wrapper.findAll('tbody .vf-datatable__row');
        const firstRowCells = bodyRows[0].findAll('td');

        expect(firstRowCells[2].text()).toBe('29');
    });

    it('renders empty state when there are no rows', () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                rows: [],
                emptyText: 'No data',
            },
        });

        expect(wrapper.text()).toContain('No data');
    });
});
