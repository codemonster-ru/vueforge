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

    it('supports keyboard drag and drop between columns', async () => {
        const wrapper = mount(KanbanBoard, {
            props: {
                columns,
                items,
            },
        });

        await nextTick();
        const firstCard = wrapper.find('.vf-kanban-board__item');

        await firstCard.trigger('keydown', { key: ' ' });
        expect(firstCard.attributes('aria-grabbed')).toBe('true');

        await firstCard.trigger('keydown', { key: 'ArrowRight' });
        await nextTick();

        const emitted = wrapper.emitted('update:items');
        const latest = emitted?.at(-1)?.[0] as Array<{ id: string | number; columnId: string | number }>;
        const moved = latest.find(item => String(item.id) === '1');

        expect(moved?.columnId).toBe('doing');
        expect(wrapper.emitted('move')?.length).toBeGreaterThan(0);

        const movedCard = wrapper.find('[data-column-id="doing"][data-item-id="1"]');
        await movedCard.trigger('keydown', { key: 'Enter' });

        expect(movedCard.attributes('aria-grabbed')).toBe('false');
    });

    it('virtualizes lane cards when enabled', async () => {
        const largeDataset = Array.from({ length: 100 }, (_, index) => ({
            id: `todo-${index + 1}`,
            columnId: 'todo',
            title: `Task ${index + 1}`,
        }));

        const wrapper = mount(KanbanBoard, {
            props: {
                columns: [{ id: 'todo', title: 'To do' }],
                items: largeDataset,
                virtualization: true,
                virtualizationThreshold: 1,
                itemHeight: 40,
                swimlaneHeight: 120,
                overscan: 0,
            },
        });

        await nextTick();
        expect(wrapper.findAll('.vf-kanban-board__item')).toHaveLength(3);

        const lane = wrapper.find('.vf-kanban-board__list');
        (lane.element as HTMLElement).scrollTop = 160;
        await lane.trigger('scroll');
        await nextTick();

        const cardTitles = wrapper.findAll('.vf-kanban-board__card-title').map(node => node.text());

        expect(cardTitles[0]).toBe('Task 5');
        expect(wrapper.findAll('.vf-kanban-board__spacer').length).toBeGreaterThan(0);
    });
});
