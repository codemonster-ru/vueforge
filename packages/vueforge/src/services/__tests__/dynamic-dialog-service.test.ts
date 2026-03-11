import { createDynamicDialogService } from '../dynamic-dialog-service';

describe('DynamicDialogService', () => {
    it('opens a dynamic dialog and stores options', () => {
        const service = createDynamicDialogService();
        const handle = service.open<string>({
            title: 'Edit member',
            message: 'Update role',
            componentProps: { memberId: 7 },
        });

        expect(service.dialogs).toHaveLength(1);
        expect(service.currentDialog.value?.id).toBe(handle.id);
        expect(service.currentDialog.value?.options.title).toBe('Edit member');
        expect(service.currentDialog.value?.options.componentProps).toEqual({ memberId: 7 });
    });

    it('closes dialog by id and resolves result', async () => {
        const service = createDynamicDialogService();
        const handle = service.open<{ saved: boolean }>();

        const closed = service.close(handle.id, { saved: true });
        const result = await handle.promise;

        expect(closed).toBe(true);
        expect(result).toEqual({ saved: true });
        expect(service.dialogs).toHaveLength(0);
    });

    it('dismisses current dialog and resolves undefined', async () => {
        const service = createDynamicDialogService();
        const handle = service.open();

        const dismissed = service.dismissCurrent();
        const result = await handle.promise;

        expect(dismissed).toBe(true);
        expect(result).toBeUndefined();
    });

    it('keeps stack order for closeCurrent', async () => {
        const service = createDynamicDialogService();
        const first = service.open<string>();
        const second = service.open<string>();

        expect(service.currentDialog.value?.id).toBe(second.id);

        service.closeCurrent('second');

        await expect(second.promise).resolves.toBe('second');
        expect(service.currentDialog.value?.id).toBe(first.id);
    });

    it('clears all dialogs and resolves pending promises', async () => {
        const service = createDynamicDialogService();
        const first = service.open();
        const second = service.open();

        service.clear();

        await expect(first.promise).resolves.toBeUndefined();
        await expect(second.promise).resolves.toBeUndefined();
        expect(service.dialogs).toHaveLength(0);
    });
});
