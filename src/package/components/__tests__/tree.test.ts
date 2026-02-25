import { mount } from '@vue/test-utils';
import Tree from '../tree.vue';

describe('Tree', () => {
    const items = [
        {
            key: 'docs',
            label: 'Docs',
            children: [
                { key: 'getting-started', label: 'Getting started' },
                { key: 'api', label: 'API' },
            ],
        },
        { key: 'blog', label: 'Blog' },
    ];

    it('updates modelValue in single mode', async () => {
        const wrapper = mount({
            components: { Tree },
            template: '<Tree v-model="value" :items="items" />',
            data() {
                return {
                    value: undefined,
                    items,
                };
            },
        });

        const rows = wrapper.findAll('[role="treeitem"]');

        await rows[1].trigger('click');

        expect(wrapper.vm.value).toBe('blog');
    });

    it('supports multi selection mode', async () => {
        const wrapper = mount({
            components: { Tree },
            template: '<Tree v-model="value" :items="items" multiple />',
            data() {
                return {
                    value: ['blog'],
                    items,
                };
            },
        });

        const rows = wrapper.findAll('[role="treeitem"]');

        await rows[0].trigger('click');

        expect(wrapper.vm.value).toEqual(['blog', 'docs']);

        await rows[1].trigger('click');

        expect(wrapper.vm.value).toEqual(['docs']);
    });

    it('supports explicit selectionMode="none"', async () => {
        const wrapper = mount(Tree, {
            props: {
                items,
                selectionMode: 'none',
            },
        });

        await wrapper.findAll('[role="treeitem"]')[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('updates expandedKeys when toggled', async () => {
        const wrapper = mount({
            components: { Tree },
            template: '<Tree v-model:expandedKeys="expanded" :items="items" />',
            data() {
                return {
                    expanded: [],
                    items,
                };
            },
        });

        const toggle = wrapper.find('.vf-tree__toggle');

        await toggle.trigger('click');

        expect(wrapper.vm.expanded).toEqual(['docs']);
    });

    it('does not update modelValue when disabled', async () => {
        const wrapper = mount({
            components: { Tree },
            template: '<Tree v-model="value" :items="items" disabled />',
            data() {
                return {
                    value: undefined,
                    items,
                };
            },
        });

        const row = wrapper.find('[role="treeitem"]');

        await row.trigger('click');

        expect(wrapper.vm.value).toBeUndefined();
        expect(wrapper.find('.vf-tree').classes()).toContain('vf-tree_disabled');
    });

    it('skips disabled nodes during arrow navigation', async () => {
        const wrapper = mount(Tree, {
            attachTo: document.body,
            props: {
                items: [
                    { key: 'a', label: 'A' },
                    { key: 'b', label: 'B', disabled: true },
                    { key: 'c', label: 'C' },
                ],
            },
        });

        const rows = wrapper.findAll('[role="treeitem"]');
        const first = rows[0].element as HTMLElement;
        const third = rows[2].element as HTMLElement;

        first.focus();
        await rows[0].trigger('keydown', { key: 'ArrowDown' });

        expect(document.activeElement).toBe(third);

        wrapper.unmount();
    });

    it('handles large expanded tree datasets with keyboard navigation', async () => {
        const largeItems = Array.from({ length: 30 }, (_, groupIndex) => ({
            key: `group-${groupIndex}`,
            label: `Group ${groupIndex}`,
            children: Array.from({ length: 10 }, (_, childIndex) => ({
                key: `node-${groupIndex}-${childIndex}`,
                label: `Node ${groupIndex}-${childIndex}`,
            })),
        }));
        const expandedKeys = largeItems.map(item => item.key);

        const wrapper = mount(Tree, {
            attachTo: document.body,
            props: {
                items: largeItems,
                expandedKeys,
            },
        });

        const rows = wrapper.findAll('[role="treeitem"]');
        expect(rows.length).toBe(330);

        const first = rows[0];
        const last = rows[rows.length - 1].element as HTMLElement;
        (first.element as HTMLElement).focus();
        await first.trigger('keydown', { key: 'End' });

        expect(document.activeElement).toBe(last);
        wrapper.unmount();
    });

    it('supports virtualized rendering for large expanded datasets', async () => {
        const largeItems = Array.from({ length: 50 }, (_, groupIndex) => ({
            key: `group-${groupIndex}`,
            label: `Group ${groupIndex}`,
            children: Array.from({ length: 30 }, (_, childIndex) => ({
                key: `node-${groupIndex}-${childIndex}`,
                label: `Node ${groupIndex}-${childIndex}`,
            })),
        }));
        const expandedKeys = largeItems.map(item => item.key);

        const wrapper = mount(Tree, {
            props: {
                items: largeItems,
                expandedKeys,
                virtualized: true,
                virtualizationThreshold: 100,
                itemHeight: 28,
                virtualHeight: 224,
                overscan: 2,
            },
        });

        expect(wrapper.find('.vf-tree__virtual').exists()).toBe(true);
        expect(wrapper.findAll('[role="treeitem"]').length).toBeLessThan(200);
    });

    it('emits loadChildren and exposes async branch state on expand', async () => {
        const wrapper = mount(Tree, {
            props: {
                items: [{ key: 'remote', label: 'Remote', hasChildren: true }],
                expandedKeys: [],
                loadOnExpand: true,
                loadingKeys: [],
            },
        });

        await wrapper.find('.vf-tree__toggle').trigger('click');
        await wrapper.setProps({ loadingKeys: ['remote'] });

        expect(wrapper.emitted('loadChildren')?.[0]?.[0]).toBe('remote');
        expect(wrapper.find('[role="treeitem"]').attributes('aria-busy')).toBe('true');
    });

    it('keeps expand/select behavior in rtl mode', async () => {
        const wrapper = mount(Tree, {
            attrs: {
                dir: 'rtl',
            },
            props: {
                items,
                expandedKeys: [],
            },
        });

        const first = wrapper.findAll('[role="treeitem"]')[0];
        await first.trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['docs']]);

        await wrapper.setProps({ expandedKeys: ['docs'] });
        await wrapper.findAll('[role="treeitem"]')[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['getting-started']);
    });
});
