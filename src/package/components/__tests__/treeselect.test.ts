import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TreeSelect from '../tree-select.vue';

const items = [
    {
        key: 'docs',
        label: 'Documentation',
        children: [
            { key: 'guides', label: 'Guides' },
            { key: 'api', label: 'API Reference' },
        ],
    },
    { key: 'blog', label: 'Blog' },
];

const mountTreeSelect = (props: Record<string, unknown> = {}) => {
    return mount(TreeSelect, {
        props: {
            items,
            ...props,
        },
        global: {
            stubs: {
                teleport: true,
            },
        },
    });
};

describe('TreeSelect', () => {
    it('emits selected value in single mode', async () => {
        const wrapper = mountTreeSelect({ modelValue: undefined, expandedKeys: ['docs'] });

        await wrapper.find('.vf-treeselect__control').trigger('click');
        await nextTick();

        const rows = wrapper.findAll('[role="treeitem"]');

        await rows[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['guides']);
        expect(wrapper.emitted('change')?.[0]?.[0]).toBe('guides');
    });

    it('filters tree nodes and keeps parent path', async () => {
        const wrapper = mountTreeSelect({ expandedKeys: ['docs'] });

        await wrapper.find('.vf-treeselect__control').trigger('click');
        await nextTick();
        await wrapper.find('.vf-treeselect__search-control').setValue('api');
        await nextTick();

        const rows = wrapper.findAll('[role="treeitem"]');
        const labels = rows.map(row => row.text());

        expect(labels.some(label => label.includes('Documentation'))).toBe(true);
        expect(labels.some(label => label.includes('API Reference'))).toBe(true);
        expect(labels.some(label => label.includes('Guides'))).toBe(false);
    });

    it('clears selected values', async () => {
        const wrapper = mountTreeSelect({
            modelValue: ['guides', 'api'],
            multiple: true,
            clearable: true,
        });

        await wrapper.find('.vf-treeselect__clear').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]]);
        expect(wrapper.emitted('change')?.[0]).toEqual([[]]);
    });

    it('emits expanded keys updates', async () => {
        const wrapper = mountTreeSelect({ expandedKeys: [] });

        await wrapper.find('.vf-treeselect__control').trigger('click');
        await nextTick();

        await wrapper.find('.vf-tree__toggle').trigger('click');

        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['docs']]);
    });
});
