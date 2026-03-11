export interface BulkActionBarAction {
    id: string;
    label: string;
    requiresConfirm?: boolean;
    disabled?: boolean;
}

export interface BulkActionBarUndoPayload {
    actionId: string;
    selection: Array<string | number>;
    token?: string;
}
