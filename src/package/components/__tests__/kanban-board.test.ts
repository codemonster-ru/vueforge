import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import KanbanBoard from '../kanban-board.vue';

const columns = [
    { id: 'todo', title: 'To do' },
    { id: 'doing', title: 'In progress' },
];

const items = [
    { id: 1, columnId: 'todo', title: 'Write docs', priority: 'medium' as const },
    { id: 2, columnId: 'todo', title: 'Fix tests', priority: 'high' as const },
];

const createDataTransfer = () => {
    let value = '';

    return {
        setData: (_format: string, nextValue: string) => {
            value = nextValue;
        },
        getData: () => value,
        effectAllowed: 'move',
    };
};

describe('KanbanBoard', () => {
    it('renders columns and cards', async () => {
        const wrapper = mount(KanbanBoard, {
            props: {
                columns,
                items,
            },
        });

        await nextTick();

        expect(wrapper.findAll('.vf-kanban-board__column')).toHaveLength(2);
        expect(wrapper.findAll('.vf-kanban-board__item')).toHaveLength(2);
    });

    it('moves item between columns on drop', async () => {
        const wrapper = mount(KanbanBoard, {
            props: {
                columns,
                items,
            },
        });
        const transfer = createDataTransfer();

        await nextTick();
        await wrapper.find('.vf-kanban-board__item').trigger('dragstart', { dataTransfer: transfer });
        await wrapper.findAll('.vf-kanban-board__list')[1].trigger('drop', { dataTransfer: transfer });

        const emitted = wrapper.emitted('update:items');
        const latest = emitted?.at(-1)?.[0] as Array<{ id: string | number; columnId: string | number }>;
        const moved = latest.find(item => String(item.id) === '1');

        expect(moved?.columnId).toBe('doing');
        expect(wrapper.emitted('move')).toBeTruthy();
    });

    it('emits click on card click', async () => {
        const wrapper = mount(KanbanBoard, {
            props: {
                columns,
                items,
            },
        });

        await nextTick();
        await wrapper.find('.vf-kanban-board__item').trigger('click');

        expect(wrapper.emitted('click')?.length).toBe(1);
    });
});
