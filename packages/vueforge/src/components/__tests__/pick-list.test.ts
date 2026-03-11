import { mount } from '@vue/test-utils';
import PickList from '../pick-list.vue';

describe('PickList', () => {
    const source = [
        { id: 1, label: 'One' },
        { id: 2, label: 'Two' },
        { id: 3, label: 'Three' },
    ];
    const target = [{ id: 4, label: 'Four' }];

    it('transfers selected source items to target', async () => {
        const wrapper = mount(PickList, {
            props: {
                source,
                target,
            },
        });

        const sourceItems = wrapper.findAll('.vf-picklist__column')[0].findAll('.vf-picklist__item');
        await sourceItems[0].trigger('click');

        const transferButton = wrapper.findAll('.vf-picklist__transfer .vf-picklist__btn')[0];
        await transferButton.trigger('click');

        expect(wrapper.emitted('update:source')?.[0]?.[0]).toEqual([
            { id: 2, label: 'Two' },
            { id: 3, label: 'Three' },
        ]);
        expect(wrapper.emitted('update:target')?.[0]?.[0]).toEqual([
            { id: 4, label: 'Four' },
            { id: 1, label: 'One' },
        ]);
        expect((wrapper.emitted('transfer')?.[0]?.[0] as { direction: string }).direction).toBe('toTarget');
    });

    it('reorders target items with keyboard ctrl+arrow', async () => {
        const wrapper = mount(PickList, {
            props: {
                source,
                target: [
                    { id: 4, label: 'Four' },
                    { id: 5, label: 'Five' },
                ],
            },
        });

        const targetItems = wrapper.findAll('.vf-picklist__column')[1].findAll('.vf-picklist__item');
        await targetItems[1].trigger('click');
        await targetItems[1].trigger('keydown', { key: 'ArrowUp', ctrlKey: true });

        expect(wrapper.emitted('reorder')?.[0]?.[0]).toEqual({
            list: 'target',
            items: [
                { id: 5, label: 'Five' },
                { id: 4, label: 'Four' },
            ],
        });
    });

    it('supports drag and drop transfer between lists', async () => {
        const wrapper = mount(PickList, {
            props: {
                source,
                target,
            },
        });

        const sourceFirst = wrapper.findAll('.vf-picklist__column')[0].findAll('.vf-picklist__item')[0];
        const targetFirst = wrapper.findAll('.vf-picklist__column')[1].findAll('.vf-picklist__item')[0];

        await sourceFirst.trigger('dragstart');
        await targetFirst.trigger('drop');

        expect(wrapper.emitted('update:source')?.[0]?.[0]).toEqual([
            { id: 2, label: 'Two' },
            { id: 3, label: 'Three' },
        ]);
        expect(wrapper.emitted('update:target')?.[0]?.[0]).toEqual([
            { id: 1, label: 'One' },
            { id: 4, label: 'Four' },
        ]);
    });
});
