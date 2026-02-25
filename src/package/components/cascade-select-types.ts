import type { TreeValue } from './tree.vue';

export interface CascadeSelectItem {
    key: TreeValue;
    label: string;
    disabled?: boolean;
    hasChildren?: boolean;
    children?: Array<CascadeSelectItem>;
}
