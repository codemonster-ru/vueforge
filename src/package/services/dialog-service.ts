import { computed, readonly, shallowReactive } from 'vue';
import type { ComputedRef } from 'vue';

export interface DialogServiceOpenOptions<TPayload = unknown> {
    title?: string;
    message?: string;
    payload?: TPayload;
}

export interface DialogServiceEntry<TPayload = unknown> {
    id: string;
    createdAt: number;
    options: DialogServiceOpenOptions<TPayload>;
}

export interface DialogServiceHandle<TResult = unknown> {
    id: string;
    promise: Promise<TResult | undefined>;
    close: (result?: TResult) => boolean;
    dismiss: () => boolean;
}

export interface DialogService {
    dialogs: ReadonlyArray<DialogServiceEntry>;
    currentDialog: ComputedRef<DialogServiceEntry | null>;
    open: <TResult = unknown, TPayload = unknown>(
        options?: DialogServiceOpenOptions<TPayload>,
    ) => DialogServiceHandle<TResult>;
    close: <TResult = unknown>(id: string, result?: TResult) => boolean;
    dismiss: (id: string) => boolean;
    closeCurrent: <TResult = unknown>(result?: TResult) => boolean;
    dismissCurrent: () => boolean;
    clear: () => void;
}

const createDialogId = (() => {
    let seed = 0;

    return () => {
        seed += 1;

        return `vf-dialog-${seed}`;
    };
})();

export const createDialogService = (): DialogService => {
    const dialogs = shallowReactive<DialogServiceEntry[]>([]);
    const pending = new Map<string, (result: unknown) => void>();

    const currentDialog = computed(() => dialogs.at(-1) ?? null);

    const settle = (id: string, result: unknown, removeOnly = false): boolean => {
        const dialogIndex = dialogs.findIndex(dialog => dialog.id === id);

        if (dialogIndex === -1) {
            return false;
        }

        dialogs.splice(dialogIndex, 1);

        if (removeOnly) {
            return true;
        }

        const resolve = pending.get(id);

        if (resolve) {
            pending.delete(id);
            resolve(result);
        }

        return true;
    };

    const open = <TResult = unknown, TPayload = unknown>(
        options: DialogServiceOpenOptions<TPayload> = {},
    ): DialogServiceHandle<TResult> => {
        const id = createDialogId();

        dialogs.push({
            id,
            createdAt: Date.now(),
            options,
        });

        const promise = new Promise<TResult | undefined>(resolve => {
            pending.set(id, resolve as (result: unknown) => void);
        });

        return {
            id,
            promise,
            close: (result?: TResult) => settle(id, result),
            dismiss: () => settle(id, undefined),
        };
    };

    const close = <TResult = unknown>(id: string, result?: TResult) => settle(id, result);

    const dismiss = (id: string) => settle(id, undefined);

    const closeCurrent = <TResult = unknown>(result?: TResult) => {
        const activeDialog = currentDialog.value;

        if (!activeDialog) {
            return false;
        }

        return close(activeDialog.id, result);
    };

    const dismissCurrent = () => {
        const activeDialog = currentDialog.value;

        if (!activeDialog) {
            return false;
        }

        return dismiss(activeDialog.id);
    };

    const clear = () => {
        const ids = dialogs.map(dialog => dialog.id);

        ids.forEach(id => {
            settle(id, undefined);
        });
    };

    return {
        dialogs: readonly(dialogs),
        currentDialog,
        open,
        close,
        dismiss,
        closeCurrent,
        dismissCurrent,
        clear,
    };
};

export const dialogService = createDialogService();
