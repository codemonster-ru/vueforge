import { mount } from '@vue/test-utils';
import BulkActionBar from '../bulk-action-bar.vue';

describe('BulkActionBar', () => {
    it('disables actions when selection is empty', () => {
        const wrapper = mount(BulkActionBar, {
            props: {
                selection: [],
                actions: [{ id: 'archive', label: 'Archive' }],
            },
        });

        expect(wrapper.find('.vf-bulk-action-bar__button').attributes('disabled')).toBeDefined();
    });

    it('emits action payload for non-confirm action', async () => {
        const wrapper = mount(BulkActionBar, {
            props: {
                selection: [1, 2],
                actions: [{ id: 'archive', label: 'Archive' }],
            },
        });

        await wrapper.find('.vf-bulk-action-bar__actions .vf-bulk-action-bar__button').trigger('click');

        expect(wrapper.emitted('action')?.at(-1)?.[0]).toEqual({
            actionId: 'archive',
            selection: [1, 2],
        });
    });

    it('emits confirm payload for confirm-required action', async () => {
        const wrapper = mount(BulkActionBar, {
            props: {
                selection: ['a-1'],
                confirmMessage: 'Confirm bulk delete',
                actions: [{ id: 'delete', label: 'Delete', requiresConfirm: true }],
            },
        });

        await wrapper.find('.vf-bulk-action-bar__actions .vf-bulk-action-bar__button').trigger('click');

        expect(wrapper.emitted('confirm')?.at(-1)?.[0]).toEqual({
            actionId: 'delete',
            selection: ['a-1'],
            message: 'Confirm bulk delete',
        });
        expect(wrapper.emitted('action')).toBeUndefined();
    });

    it('emits undo hook with token for last action', async () => {
        const wrapper = mount(BulkActionBar, {
            props: {
                selection: [10, 11],
                actions: [{ id: 'archive', label: 'Archive' }],
                lastActionId: 'archive',
                undoToken: 'undo-ctx-1',
            },
        });

        const buttons = wrapper.findAll('.vf-bulk-action-bar__button');
        await buttons[1].trigger('click');

        expect(wrapper.emitted('undo')?.at(-1)?.[0]).toEqual({
            actionId: 'archive',
            selection: [10, 11],
            token: 'undo-ctx-1',
        });
    });
});
