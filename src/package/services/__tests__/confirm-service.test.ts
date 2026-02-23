import { createConfirmService } from '../confirm-service';

describe('ConfirmService', () => {
    it('opens confirm entry with default options', () => {
        const service = createConfirmService();
        const handle = service.open();

        expect(service.queue).toHaveLength(1);
        expect(service.current.value?.id).toBe(handle.id);
        expect(service.current.value?.options.title).toBe('Confirm action');
        expect(service.current.value?.options.confirmSeverity).toBe('danger');
    });

    it('resolves promise as true on confirm', async () => {
        const service = createConfirmService();
        const promise = service.confirm({
            title: 'Publish changes?',
        });

        expect(service.current.value?.options.title).toBe('Publish changes?');

        const confirmed = service.confirmCurrent();
        const result = await promise;

        expect(confirmed).toBe(true);
        expect(result).toBe(true);
        expect(service.queue).toHaveLength(0);
    });

    it('resolves as false on cancel', async () => {
        const service = createConfirmService();
        const handle = service.open();

        const cancelled = handle.cancel();
        const result = await handle.promise;

        expect(cancelled).toBe(true);
        expect(result).toBe(false);
    });

    it('processes queue in FIFO order', async () => {
        const service = createConfirmService();
        const first = service.open({ title: 'First' });
        const second = service.open({ title: 'Second' });

        expect(service.current.value?.id).toBe(first.id);

        service.confirmCurrent();
        await expect(first.promise).resolves.toBe(true);
        expect(service.current.value?.id).toBe(second.id);

        service.cancelCurrent();
        await expect(second.promise).resolves.toBe(false);
        expect(service.current.value).toBeNull();
    });

    it('clears queue and resolves all entries as false', async () => {
        const service = createConfirmService();
        const first = service.open();
        const second = service.open();

        service.clear();

        await expect(first.promise).resolves.toBe(false);
        await expect(second.promise).resolves.toBe(false);
        expect(service.queue).toHaveLength(0);
    });
});
