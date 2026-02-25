import { mount } from '@vue/test-utils';
import FileManager from '../file-manager.vue';

const items = [
    { id: 'f-1', name: 'Quarterly report.pdf', kind: 'file' as const, size: 1200, updatedAt: '2026-02-20' },
    { id: 'f-2', name: 'Brand assets', kind: 'folder' as const, updatedAt: '2026-02-21' },
    { id: 'f-3', name: 'Dashboard.png', kind: 'file' as const, size: 2048, thumbnail: '/demo/dashboard.png' },
];

describe('FileManager', () => {
    it('switches view and emits update:view', async () => {
        const wrapper = mount(FileManager, {
            props: {
                items,
                view: 'list',
            },
        });

        await wrapper.findAll('.vf-file-manager__view-btn')[1].trigger('click');
        expect(wrapper.emitted('update:view')?.[0]).toEqual(['grid']);
    });

    it('supports selection and select-all in multi mode', async () => {
        const wrapper = mount(FileManager, {
            props: {
                items,
                modelValue: [],
            },
        });

        await wrapper.find('.vf-file-manager__select-all input').setValue(true);

        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['f-1', 'f-2', 'f-3']);
    });

    it('emits bulkAction with selected items', async () => {
        const wrapper = mount(FileManager, {
            props: {
                items,
                modelValue: ['f-1', 'f-3'],
                bulkActions: [{ id: 'delete', label: 'Delete' }],
            },
        });

        await wrapper.find('.vf-file-manager__bulk-btn').trigger('click');

        expect(wrapper.emitted('bulkAction')?.[0]?.[0]).toEqual({
            actionId: 'delete',
            ids: ['f-1', 'f-3'],
            items: [items[0], items[2]],
        });
    });

    it('opens and closes preview overlay', async () => {
        const wrapper = mount(FileManager, {
            props: {
                items,
                previewable: true,
            },
        });

        await wrapper.find('.vf-file-manager__preview-btn').trigger('click');

        expect(wrapper.find('.vf-file-manager__preview-overlay').exists()).toBe(true);
        expect(wrapper.emitted('preview')?.[0]?.[0]).toEqual(items[2]);

        await wrapper.find('.vf-file-manager__preview-close').trigger('click');
        expect(wrapper.find('.vf-file-manager__preview-overlay').exists()).toBe(false);
    });
});
