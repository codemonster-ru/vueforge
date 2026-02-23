import { computed, readonly, shallowReactive } from 'vue';
import type { ComputedRef } from 'vue';

type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
type DialogSize = 'sm' | 'md' | 'lg';

export interface ConfirmServiceOptions {
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmSeverity?: ButtonSeverity;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showClose?: boolean;
    lockScroll?: boolean;
    size?: DialogSize;
}

export interface ConfirmServiceEntry {
    id: string;
    createdAt: number;
    options: Required<ConfirmServiceOptions>;
}

export interface ConfirmServiceHandle {
    id: string;
    promise: Promise<boolean>;
    confirm: () => boolean;
    cancel: () => boolean;
    close: () => boolean;
}

export interface ConfirmService {
    queue: ReadonlyArray<ConfirmServiceEntry>;
    current: ComputedRef<ConfirmServiceEntry | null>;
    open: (options?: ConfirmServiceOptions) => ConfirmServiceHandle;
    confirm: (options?: ConfirmServiceOptions) => Promise<boolean>;
    resolve: (id: string, confirmed: boolean) => boolean;
    confirmById: (id: string) => boolean;
    cancelById: (id: string) => boolean;
    resolveCurrent: (confirmed: boolean) => boolean;
    confirmCurrent: () => boolean;
    cancelCurrent: () => boolean;
    clear: () => void;
}

const DEFAULT_CONFIRM_OPTIONS: Required<ConfirmServiceOptions> = {
    title: 'Confirm action',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    confirmSeverity: 'danger',
    closeOnOverlay: true,
    closeOnEsc: true,
    showClose: true,
    lockScroll: true,
    size: 'sm',
};

const createConfirmId = (() => {
    let seed = 0;

    return () => {
        seed += 1;

        return `vf-confirm-${seed}`;
    };
})();

export const createConfirmService = (): ConfirmService => {
    const queue = shallowReactive<ConfirmServiceEntry[]>([]);
    const pending = new Map<string, (confirmed: boolean) => void>();

    const current = computed(() => queue[0] ?? null);

    const resolve = (id: string, confirmed: boolean): boolean => {
        const entryIndex = queue.findIndex(entry => entry.id === id);

        if (entryIndex === -1) {
            return false;
        }

        queue.splice(entryIndex, 1);

        const callback = pending.get(id);

        if (callback) {
            pending.delete(id);
            callback(confirmed);
        }

        return true;
    };

    const open = (options: ConfirmServiceOptions = {}): ConfirmServiceHandle => {
        const id = createConfirmId();

        queue.push({
            id,
            createdAt: Date.now(),
            options: {
                ...DEFAULT_CONFIRM_OPTIONS,
                ...options,
            },
        });

        const promise = new Promise<boolean>(resolvePromise => {
            pending.set(id, resolvePromise);
        });

        return {
            id,
            promise,
            confirm: () => resolve(id, true),
            cancel: () => resolve(id, false),
            close: () => resolve(id, false),
        };
    };

    const confirm = (options: ConfirmServiceOptions = {}): Promise<boolean> => {
        const handle = open(options);

        return handle.promise;
    };

    const resolveCurrent = (confirmed: boolean) => {
        const activeConfirm = current.value;

        if (!activeConfirm) {
            return false;
        }

        return resolve(activeConfirm.id, confirmed);
    };

    const confirmCurrent = () => resolveCurrent(true);

    const cancelCurrent = () => resolveCurrent(false);

    const clear = () => {
        const ids = queue.map(entry => entry.id);

        ids.forEach(id => {
            resolve(id, false);
        });
    };

    return {
        queue: readonly(queue),
        current,
        open,
        confirm,
        resolve,
        confirmById: id => resolve(id, true),
        cancelById: id => resolve(id, false),
        resolveCurrent,
        confirmCurrent,
        cancelCurrent,
        clear,
    };
};

export const confirmService = createConfirmService();
