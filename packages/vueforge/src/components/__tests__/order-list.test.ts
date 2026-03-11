import { mount } from '@vue/test-utils';
import OrderList from '../order-list.vue';

describe('OrderList', () => {
    const items = [
        { id: 1, label: 'One' },
        { id: 2, label: 'Two' },
        { id: 3, label: 'Three' },
    ];

    it('reorders items with up/down controls', async () => {
        const wrapper = mount(OrderList, {
            props: {
                modelValue: items,
            },
        });

        const listItems = wrapper.findAll('.vf-orderlist__item');
        await listItems[1].trigger('click');
        await wrapper.find('.vf-orderlist__btn').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([
            { id: 2, label: 'Two' },
            { id: 1, label: 'One' },
            { id: 3, label: 'Three' },
        ]);
    });

    it('supports keyboard reorder with ctrl+arrow keys', async () => {
        const wrapper = mount(OrderList, {
            props: {
                modelValue: items,
            },
        });

        const listItems = wrapper.findAll('.vf-orderlist__item');
        await listItems[0].trigger('click');
        await listItems[0].trigger('keydown', { key: 'ArrowDown', ctrlKey: true });

        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([
            { id: 2, label: 'Two' },
            { id: 1, label: 'One' },
            { id: 3, label: 'Three' },
        ]);
    });

    it('supports drag and drop reorder', async () => {
        const wrapper = mount(OrderList, {
            props: {
                modelValue: items,
            },
        });

        const listItems = wrapper.findAll('.vf-orderlist__item');
        await listItems[2].trigger('dragstart');
        await listItems[0].trigger('drop');

        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([
            { id: 3, label: 'Three' },
            { id: 1, label: 'One' },
            { id: 2, label: 'Two' },
        ]);
    });
});
