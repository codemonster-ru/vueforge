import { computed, readonly, shallowReactive } from 'vue';
import type { ComputedRef } from 'vue';

export interface DynamicDialogModalOptions {
    size?: 'sm' | 'md' | 'lg';
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showClose?: boolean;
    lockScroll?: boolean;
}

export type DynamicDialogListeners = Record<string, (...args: Array<unknown>) => void>;

export interface DynamicDialogOpenOptions<
    TPayload = unknown,
    TComponentProps extends Record<string, unknown> = Record<string, unknown>,
> {
    title?: string;
    message?: string;
    component?: unknown;
    componentProps?: TComponentProps;
    listeners?: DynamicDialogListeners;
    payload?: TPayload;
    modal?: DynamicDialogModalOptions;
}

export interface DynamicDialogEntry<
    TPayload = unknown,
    TComponentProps extends Record<string, unknown> = Record<string, unknown>,
> {
    id: string;
    createdAt: number;
    options: DynamicDialogOpenOptions<TPayload, TComponentProps>;
}

export interface DynamicDialogHandle<TResult = unknown> {
    id: string;
    promise: Promise<TResult | undefined>;
    close: (result?: TResult) => boolean;
    dismiss: () => boolean;
}

export interface DynamicDialogService {
    dialogs: ReadonlyArray<DynamicDialogEntry>;
    currentDialog: ComputedRef<DynamicDialogEntry | null>;
    open: <
        TResult = unknown,
        TPayload = unknown,
        TComponentProps extends Record<string, unknown> = Record<string, unknown>,
    >(
        options?: DynamicDialogOpenOptions<TPayload, TComponentProps>,
    ) => DynamicDialogHandle<TResult>;
    close: <TResult = unknown>(id: string, result?: TResult) => boolean;
    dismiss: (id: string) => boolean;
    closeCurrent: <TResult = unknown>(result?: TResult) => boolean;
    dismissCurrent: () => boolean;
    clear: () => void;
}

const createDynamicDialogId = (() => {
    let seed = 0;

    return () => {
        seed += 1;

        return `vf-dynamic-dialog-${seed}`;
    };
})();

export const createDynamicDialogService = (): DynamicDialogService => {
    const dialogs = shallowReactive<DynamicDialogEntry[]>([]);
    const pending = new Map<string, (result: unknown) => void>();

    const currentDialog = computed(() => dialogs.at(-1) ?? null);

    const settle = (id: string, result: unknown): boolean => {
        const dialogIndex = dialogs.findIndex(dialog => dialog.id === id);

        if (dialogIndex === -1) {
            return false;
        }

        dialogs.splice(dialogIndex, 1);

        const resolve = pending.get(id);

        if (resolve) {
            pending.delete(id);
            resolve(result);
        }

        return true;
    };

    const open = <
        TResult = unknown,
        TPayload = unknown,
        TComponentProps extends Record<string, unknown> = Record<string, unknown>,
    >(
        options: DynamicDialogOpenOptions<TPayload, TComponentProps> = {},
    ): DynamicDialogHandle<TResult> => {
        const id = createDynamicDialogId();

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

export const dynamicDialogService = createDynamicDialogService();
