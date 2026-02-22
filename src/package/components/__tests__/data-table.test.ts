import { mount } from '@vue/test-utils';
import DataTable from '../data-table.vue';
import { setLocaleText } from '@/package/config/locale-text';

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

    afterEach(() => {
        setLocaleText();
        document.documentElement.removeAttribute('dir');
    });

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

    it('uses global locale text defaults when state labels are not provided', () => {
        setLocaleText({
            dataTable: {
                loadingText: 'Cargando...',
                emptyText: 'Sin datos',
                selectAllAriaLabel: 'Seleccionar todas las filas',
                selectRowAriaLabel: 'Seleccionar fila',
            },
        });

        const loadingWrapper = mount(DataTable, {
            props: {
                columns,
                rows,
                selectionMode: 'multiple',
                loading: true,
            },
        });

        expect(loadingWrapper.text()).toContain('Cargando...');
        expect(loadingWrapper.find('.vf-datatable__selection-control').attributes('aria-label')).toBe(
            'Seleccionar todas las filas',
        );

        const emptyWrapper = mount(DataTable, {
            props: {
                columns,
                rows: [],
            },
        });

        expect(emptyWrapper.text()).toContain('Sin datos');
    });

    it('does not perform local sorting in server mode and emits request payload', async () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                rows,
                sortable: true,
                server: true,
                page: 2,
                pageSize: 20,
                filters: { role: 'Dev' },
            },
        });

        const beforeSortFirstAge = wrapper.findAll('tbody .vf-datatable__row')[0].findAll('td')[2].text();
        expect(beforeSortFirstAge).toBe('29');

        const ageHeader = wrapper.findAll('.vf-datatable__sort-button').find(button => button.text().includes('Age'));
        await ageHeader?.trigger('click');

        const afterSortFirstAge = wrapper.findAll('tbody .vf-datatable__row')[0].findAll('td')[2].text();
        expect(afterSortFirstAge).toBe('29');

        expect(wrapper.emitted('request')?.[0]?.[0]).toEqual({
            sortField: 'age',
            sortOrder: 'asc',
            page: 2,
            pageSize: 20,
            filters: { role: 'Dev' },
        });
    });

    it('exposes server handoff methods for page, page size and filters', async () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                rows,
                server: true,
            },
        });

        const exposed = wrapper.vm as unknown as {
            setPage: (value: number) => void;
            setPageSize: (value: number) => void;
            setFilters: (value: Record<string, unknown>) => void;
            clearFilters: () => void;
            getQuery: () => Record<string, unknown>;
        };

        exposed.setPage(3);
        exposed.setPageSize(50);
        exposed.setFilters({ search: 'alice' });
        exposed.clearFilters();

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('update:page')?.[0]).toEqual([3]);
        expect(wrapper.emitted('update:pageSize')?.[0]).toEqual([50]);
        expect(wrapper.emitted('update:filters')?.[0]).toEqual([{ search: 'alice' }]);
        expect(wrapper.emitted('update:filters')?.[1]).toEqual([{}]);
        expect(wrapper.emitted('request')?.length).toBe(4);
        expect(exposed.getQuery()).toEqual({
            sortField: null,
            sortOrder: null,
            page: 3,
            pageSize: 50,
            filters: {},
        });
    });

    it('supports single row selection and emits selection updates', async () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                rows,
                selectionMode: 'single',
            },
        });

        const controls = wrapper.findAll('.vf-datatable__selection-control');
        await controls[0].trigger('change');

        expect(wrapper.emitted('update:selection')?.[0]).toEqual([1]);
        expect(wrapper.emitted('selectionChange')?.[0]?.[0]).toBe(1);
    });

    it('supports multiple selection and bulk action hook', async () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                rows,
                selectionMode: 'multiple',
                bulkActions: [{ label: 'Archive', value: 'archive' }],
            },
        });

        const controls = wrapper.findAll('.vf-datatable__selection-control');
        await controls[0].setValue(true);

        expect(wrapper.emitted('update:selection')?.[0]).toEqual([[1, 2, 3]]);

        const bulkButton = wrapper.find('.vf-datatable__bulk-action');
        await bulkButton.trigger('click');

        expect(wrapper.emitted('bulkAction')?.[0]?.[0]).toBe('archive');
        expect(wrapper.emitted('bulkAction')?.[0]?.[1]).toEqual([1, 2, 3]);
    });

    it('applies sticky header and sticky column styles', () => {
        const wrapper = mount(DataTable, {
            props: {
                rows,
                stickyHeader: true,
                columns: [
                    { field: 'name', header: 'Name', sticky: 'left', width: '120px' },
                    { field: 'role', header: 'Role' },
                    { field: 'age', header: 'Age', sticky: 'right', width: '80px' },
                ],
            },
        });

        expect(wrapper.classes()).toContain('vf-datatable_sticky-header');

        const headers = wrapper.findAll('.vf-datatable__header');
        expect(headers[0].attributes('style')).toContain('position: sticky;');
        expect(headers[0].attributes('style')).toContain('left: 0px;');
        expect(headers[2].attributes('style')).toContain('right: 0px;');
    });

    it('keeps keyboard focus on interactive controls in table state', async () => {
        const wrapper = mount(DataTable, {
            attachTo: document.body,
            props: {
                columns,
                rows,
                sortable: true,
                selectionMode: 'multiple',
            },
        });

        const sortButton = wrapper.find('.vf-datatable__sort-button').element as HTMLButtonElement;
        sortButton.focus();
        expect(document.activeElement).toBe(sortButton);

        const selectionControl = wrapper.find('.vf-datatable__selection-control').element as HTMLInputElement;
        selectionControl.focus();
        expect(document.activeElement).toBe(selectionControl);

        wrapper.unmount();
    });

    it('resizes column width with drag handle and emits resize payload', async () => {
        const wrapper = mount(DataTable, {
            props: {
                rows,
                columnResize: true,
                columns: [
                    { field: 'name', header: 'Name', width: '140px' },
                    { field: 'role', header: 'Role' },
                ],
            },
        });

        const firstHandle = wrapper.findAll('.vf-datatable__resize-handle')[0];
        await firstHandle.trigger('mousedown', { button: 0, clientX: 100 });
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: 130 }));
        window.dispatchEvent(new MouseEvent('mouseup', { clientX: 130 }));
        await wrapper.vm.$nextTick();

        const firstHeader = wrapper.findAll('.vf-datatable__header')[0];
        expect(firstHeader.attributes('style')).toContain('width: 170px;');
        expect(wrapper.emitted('columnResize')?.[0]?.[0]).toEqual({
            field: 'name',
            width: '170px',
            widthPx: 170,
        });
    });

    it('reorders columns with drag and drop and emits updated order', async () => {
        const wrapper = mount(DataTable, {
            props: {
                rows,
                columnReorder: true,
                columns,
            },
        });

        const handles = wrapper.findAll('.vf-datatable__reorder-handle');
        const headers = wrapper.findAll('.vf-datatable__header');

        await handles[2].trigger('dragstart');
        await headers[0].trigger('drop');
        await wrapper.vm.$nextTick();

        const firstRowCells = wrapper.findAll('tbody .vf-datatable__row')[0].findAll('td');
        expect(firstRowCells[0].text()).toBe('29');
        expect(firstRowCells[1].text()).toBe('Alice');
        expect(firstRowCells[2].text()).toBe('Dev');

        expect(wrapper.emitted('update:columnOrder')?.[0]).toEqual([['age', 'name', 'role']]);
        expect(wrapper.emitted('columnReorder')?.[0]?.[0]).toEqual({
            fromField: 'age',
            toField: 'name',
            order: ['age', 'name', 'role'],
        });
    });

    it('keeps sorting and selection behavior in RTL document direction', async () => {
        document.documentElement.setAttribute('dir', 'rtl');

        const wrapper = mount(DataTable, {
            props: {
                columns,
                rows,
                sortable: true,
                selectionMode: 'single',
            },
        });

        const ageHeader = wrapper.findAll('.vf-datatable__sort-button').find(button => button.text().includes('Age'));
        await ageHeader?.trigger('click');
        await wrapper.find('.vf-datatable__selection-control').trigger('change');

        expect(wrapper.emitted('update:sortField')?.[0]).toEqual(['age']);
        expect(wrapper.emitted('update:selection')?.[0]).toEqual([1]);
    });
});
