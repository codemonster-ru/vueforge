import { createDialogService } from '../dialog-service';

describe('DialogService', () => {
    it('opens a dialog and tracks it as current', () => {
        const service = createDialogService();
        const handle = service.open<string>({
            title: 'Delete',
            message: 'Delete item?',
        });

        expect(service.dialogs).toHaveLength(1);
        expect(service.currentDialog.value?.id).toBe(handle.id);
        expect(service.currentDialog.value?.options.title).toBe('Delete');
    });

    it('closes a dialog by id and resolves promise with payload', async () => {
        const service = createDialogService();
        const handle = service.open<{ deleted: boolean }>();

        const closed = service.close(handle.id, { deleted: true });
        const result = await handle.promise;

        expect(closed).toBe(true);
        expect(result).toEqual({ deleted: true });
        expect(service.dialogs).toHaveLength(0);
        expect(service.currentDialog.value).toBeNull();
    });

    it('dismisses current dialog and resolves promise with undefined', async () => {
        const service = createDialogService();
        const handle = service.open<string>();

        const dismissed = service.dismissCurrent();
        const result = await handle.promise;

        expect(dismissed).toBe(true);
        expect(result).toBeUndefined();
    });

    it('uses stack behavior for closeCurrent', async () => {
        const service = createDialogService();
        const first = service.open<string>();
        const second = service.open<string>();

        expect(service.currentDialog.value?.id).toBe(second.id);

        service.closeCurrent('second');
        const secondResult = await second.promise;

        expect(secondResult).toBe('second');
        expect(service.currentDialog.value?.id).toBe(first.id);
    });

    it('clears all dialogs and resolves pending promises', async () => {
        const service = createDialogService();
        const first = service.open<string>();
        const second = service.open<number>();

        service.clear();

        await expect(first.promise).resolves.toBeUndefined();
        await expect(second.promise).resolves.toBeUndefined();
        expect(service.dialogs).toHaveLength(0);
    });
});
