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

    it('supports hierarchy keyboard navigation and selection', async () => {
        const wrapper = mountTreeSelect({
            modelValue: undefined,
            expandedKeys: [],
            filter: false,
        });
        const trigger = wrapper.find('.vf-treeselect__control');

        await trigger.trigger('keydown', { key: 'ArrowDown' });
        await nextTick();

        const rowsBeforeExpand = wrapper.findAll('[role="treeitem"]');
        await rowsBeforeExpand[0].trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['docs']]);

        await wrapper.setProps({ expandedKeys: ['docs'] });
        await nextTick();

        const rowsAfterExpand = wrapper.findAll('[role="treeitem"]');
        await rowsAfterExpand[0].trigger('keydown', { key: 'ArrowDown' });
        await rowsAfterExpand[1].trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['guides']);
    });

    it('does not open or search in readonly mode', async () => {
        const wrapper = mountTreeSelect({ readonly: true });
        const trigger = wrapper.find('.vf-treeselect__control');

        await trigger.trigger('click');
        await trigger.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.find('.vf-treeselect').classes()).not.toContain('vf-treeselect_open');
        expect(trigger.attributes('aria-expanded')).toBe('false');
    });

    it('moves focus to first tree node when opened from keyboard without filter', async () => {
        const wrapper = mount(TreeSelect, {
            attachTo: document.body,
            props: {
                items,
                filter: false,
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });
        const trigger = wrapper.find('.vf-treeselect__control');

        await trigger.trigger('keydown', { key: 'ArrowDown' });
        await nextTick();

        const firstRow = wrapper.findAll('[role="treeitem"]')[0].element as HTMLElement;
        expect(document.activeElement).toBe(firstRow);
        wrapper.unmount();
    });

    it('moves focus from search input to tree on ArrowDown', async () => {
        const wrapper = mount(TreeSelect, {
            attachTo: document.body,
            props: {
                items,
                filter: true,
                expandedKeys: ['docs'],
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });
        const trigger = wrapper.find('.vf-treeselect__control');

        await trigger.trigger('keydown', { key: 'ArrowDown' });
        await nextTick();

        const search = wrapper.find('.vf-treeselect__search-control');
        await search.trigger('keydown', { key: 'ArrowDown' });
        await nextTick();

        const firstRow = wrapper.findAll('[role="treeitem"]')[0].element as HTMLElement;
        expect(document.activeElement).toBe(firstRow);
        wrapper.unmount();
    });

    it('filters correctly on large tree datasets', async () => {
        const largeItems = Array.from({ length: 20 }, (_, groupIndex) => ({
            key: `group-${groupIndex}`,
            label: `Group ${groupIndex}`,
            children: Array.from({ length: 10 }, (_, childIndex) => ({
                key: `leaf-${groupIndex}-${childIndex}`,
                label: `Leaf ${groupIndex}-${childIndex}`,
            })),
        }));

        const wrapper = mount(TreeSelect, {
            props: {
                items: largeItems,
                expandedKeys: largeItems.map(item => item.key),
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await wrapper.find('.vf-treeselect__control').trigger('click');
        await nextTick();
        await wrapper.find('.vf-treeselect__search-control').setValue('Leaf 19-9');
        await nextTick();

        const labels = wrapper.findAll('[role="treeitem"]').map(row => row.text());
        expect(labels.some(label => label.includes('Group 19'))).toBe(true);
        expect(labels.some(label => label.includes('Leaf 19-9'))).toBe(true);
        expect(labels.some(label => label.includes('Leaf 0-0'))).toBe(false);
    });

    it('keeps open/select behavior in rtl mode', async () => {
        const wrapper = mount(TreeSelect, {
            attrs: {
                dir: 'rtl',
            },
            props: {
                items,
                modelValue: undefined,
                expandedKeys: ['docs'],
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        const trigger = wrapper.find('.vf-treeselect__control');
        await trigger.trigger('keydown', { key: 'ArrowDown' });
        await nextTick();

        await wrapper.findAll('[role="treeitem"]')[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['guides']);
    });
});
