import {
    inject,
    provide,
    readonly,
    reactive,
    unref,
    watchEffect,
    type ComputedRef,
    type InjectionKey,
    type Ref,
} from 'vue';

export type LocaleTextSchema = {
    common: {
        loadingText: string;
        emptyText: string;
    };
    dataTable: {
        loadingText: string;
        emptyText: string;
        selectedSuffix: string;
        clearSelectionLabel: string;
        selectAllAriaLabel: string;
        selectRowAriaLabel: string;
    };
    autocomplete: {
        loadingText: string;
        emptyText: string;
    };
    combobox: {
        loadingText: string;
        emptyText: string;
        clearValueAriaLabel: string;
    };
    multiSelect: {
        loadingText: string;
        emptyText: string;
        searchPlaceholder: string;
        clearSelectionAriaLabel: string;
        removeItemAriaLabel: string;
    };
    tagInput: {
        loadingText: string;
        emptyText: string;
        clearTagsAriaLabel: string;
        removeTagAriaLabelPrefix: string;
    };
    treeSelect: {
        loadingText: string;
        emptyText: string;
        searchPlaceholder: string;
        clearSelectionAriaLabel: string;
    };
    mentionInput: {
        loadingText: string;
        emptyText: string;
    };
    commandPalette: {
        placeholder: string;
        emptyText: string;
        ariaLabel: string;
        scopeAllLabel: string;
        recentLabel: string;
    };
    notificationCenter: {
        title: string;
        emptyText: string;
        markAllLabel: string;
        clearLabel: string;
        closeLabel: string;
        readLabel: string;
        unreadLabel: string;
        filterAllLabel: string;
        filterUnreadLabel: string;
        filterReadLabel: string;
    };
    virtualScroller: {
        ariaLabel: string;
        emptyText: string;
    };
    filterChips: {
        clearText: string;
        clearLabel: string;
    };
    chip: {
        closeLabel: string;
    };
};

type Primitive = string | number | boolean | null | undefined;
type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends Primitive ? T[K] : DeepPartial<T[K]>;
};

export type LocaleTextOptions = DeepPartial<LocaleTextSchema>;

const DEFAULT_LOCALE_TEXT: LocaleTextSchema = {
    common: {
        loadingText: 'Loading...',
        emptyText: 'No results',
    },
    dataTable: {
        loadingText: 'Loading...',
        emptyText: 'No data',
        selectedSuffix: 'selected',
        clearSelectionLabel: 'Clear',
        selectAllAriaLabel: 'Select all rows',
        selectRowAriaLabel: 'Select row',
    },
    autocomplete: {
        loadingText: 'Loading...',
        emptyText: 'No results',
    },
    combobox: {
        loadingText: 'Loading...',
        emptyText: 'No results',
        clearValueAriaLabel: 'Clear value',
    },
    multiSelect: {
        loadingText: 'Loading...',
        emptyText: 'No results',
        searchPlaceholder: 'Search...',
        clearSelectionAriaLabel: 'Clear selection',
        removeItemAriaLabel: 'Remove item',
    },
    tagInput: {
        loadingText: 'Loading...',
        emptyText: 'No results',
        clearTagsAriaLabel: 'Clear tags',
        removeTagAriaLabelPrefix: 'Remove',
    },
    treeSelect: {
        loadingText: 'Loading...',
        emptyText: 'No results',
        searchPlaceholder: 'Search...',
        clearSelectionAriaLabel: 'Clear selection',
    },
    mentionInput: {
        loadingText: 'Loading...',
        emptyText: 'No matches',
    },
    commandPalette: {
        placeholder: 'Type a command or search...',
        emptyText: 'No commands found',
        ariaLabel: 'Command palette',
        scopeAllLabel: 'All',
        recentLabel: 'Recent',
    },
    notificationCenter: {
        title: 'Notifications',
        emptyText: 'No notifications',
        markAllLabel: 'Mark all as read',
        clearLabel: 'Clear',
        closeLabel: 'Close notifications',
        readLabel: 'Mark as read',
        unreadLabel: 'Mark as unread',
        filterAllLabel: 'All',
        filterUnreadLabel: 'Unread',
        filterReadLabel: 'Read',
    },
    virtualScroller: {
        ariaLabel: 'Virtual list',
        emptyText: 'No items',
    },
    filterChips: {
        clearText: 'Clear',
        clearLabel: 'Clear filters',
    },
    chip: {
        closeLabel: 'Remove',
    },
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return !!value && typeof value === 'object' && !Array.isArray(value);
};

const cloneDeep = <T>(value: T): T => {
    if (!isPlainObject(value)) {
        return value;
    }

    const next: Record<string, unknown> = {};

    for (const key in value) {
        next[key] = cloneDeep(value[key]);
    }

    return next as T;
};

const mergeDeep = <T extends Record<string, unknown>>(base: T, patch?: DeepPartial<T>): T => {
    if (!patch) {
        return cloneDeep(base);
    }

    const next: Record<string, unknown> = { ...base };

    for (const key in patch) {
        const patchValue = patch[key];
        const baseValue = base[key];

        if (patchValue === undefined) {
            continue;
        }

        if (isPlainObject(baseValue) && isPlainObject(patchValue)) {
            next[key] = mergeDeep(baseValue, patchValue as DeepPartial<typeof baseValue>);
        } else {
            next[key] = patchValue;
        }
    }

    return next as T;
};

const state = reactive<LocaleTextSchema>(cloneDeep(DEFAULT_LOCALE_TEXT));
const localeTextScopeKey: InjectionKey<LocaleTextSchema> = Symbol('vueforge-locale-text-scope');

export const setLocaleText = (options: LocaleTextOptions = {}) => {
    const merged = mergeDeep(DEFAULT_LOCALE_TEXT, options);
    Object.assign(state, merged);
};

export const updateLocaleText = (partial: LocaleTextOptions = {}) => {
    const next = mergeDeep(
        getLocaleText() as unknown as Record<string, unknown>,
        partial as DeepPartial<Record<string, unknown>>,
    ) as LocaleTextSchema;
    Object.assign(state, next);
};

export const getLocaleText = (): LocaleTextSchema => {
    return mergeDeep(DEFAULT_LOCALE_TEXT, state as unknown as LocaleTextOptions);
};

export const provideLocaleTextScope = (
    options?: LocaleTextOptions | Ref<LocaleTextOptions | undefined> | ComputedRef<LocaleTextOptions | undefined>,
) => {
    const parent = inject(localeTextScopeKey, null);
    const scoped = reactive<LocaleTextSchema>(cloneDeep(parent ?? getLocaleText()));

    watchEffect(() => {
        const inherited = parent ? cloneDeep(parent) : getLocaleText();
        const local = unref(options) ?? {};
        const merged = mergeDeep(inherited, local);

        Object.assign(scoped, merged);
    });

    provide(localeTextScopeKey, scoped);

    return readonly(scoped);
};

export const useLocaleText = () => {
    const scoped = inject(localeTextScopeKey, null);

    return readonly(scoped ?? state);
};
