export interface SavedViewItem {
    id: string;
    name: string;
    state?: unknown;
    shared?: boolean;
    isDefault?: boolean;
    updatedAt?: string;
}
