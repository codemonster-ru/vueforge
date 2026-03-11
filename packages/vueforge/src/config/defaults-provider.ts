import { computed, inject, provide, unref, type ComputedRef, type InjectionKey, type Ref } from 'vue';

export type ComponentDefaultsMap = Record<string, Record<string, unknown>>;

export const defaultsProviderKey: InjectionKey<ComputedRef<ComponentDefaultsMap>> =
    Symbol('vueforge-defaults-provider');

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const withDefinedValues = (value: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));

const mergeDefaults = (parent: ComponentDefaultsMap, local?: ComponentDefaultsMap): ComponentDefaultsMap => {
    if (!local) {
        return parent;
    }

    const merged: ComponentDefaultsMap = { ...parent };
    for (const [componentName, componentDefaults] of Object.entries(local)) {
        const previous = merged[componentName];
        if (isRecord(previous) && isRecord(componentDefaults)) {
            merged[componentName] = {
                ...previous,
                ...withDefinedValues(componentDefaults),
            };
            continue;
        }

        merged[componentName] = withDefinedValues(componentDefaults);
    }

    return merged;
};

export const provideComponentDefaults = (
    local?:
        | ComponentDefaultsMap
        | Ref<ComponentDefaultsMap | undefined>
        | ComputedRef<ComponentDefaultsMap | undefined>,
): ComputedRef<ComponentDefaultsMap> => {
    const parent = inject(
        defaultsProviderKey,
        computed(() => ({})),
    );
    const merged = computed(() => mergeDefaults(parent.value, unref(local)));

    provide(defaultsProviderKey, merged);

    return merged;
};

export const useComponentDefaults = <T extends Record<string, unknown>>(
    componentName: string,
    explicitProps: T,
    baseDefaults: Partial<T> = {},
): ComputedRef<T> => {
    const defaultsMap = inject(
        defaultsProviderKey,
        computed<ComponentDefaultsMap>(() => ({})),
    );

    return computed(() => {
        const componentDefaults = defaultsMap.value[componentName] ?? {};

        return {
            ...withDefinedValues(baseDefaults as Record<string, unknown>),
            ...withDefinedValues(componentDefaults),
            ...withDefinedValues(explicitProps),
        } as T;
    });
};
