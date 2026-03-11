export type PassThroughAttrs = Record<string, unknown>;
export type PassThroughResolverContext = Record<string, unknown>;
export type PassThroughEntry<Context extends PassThroughResolverContext = PassThroughResolverContext> =
    | PassThroughAttrs
    | ((context: Context) => PassThroughAttrs | undefined | null);
export type PassThroughOptions<Context extends PassThroughResolverContext = PassThroughResolverContext> = Record<
    string,
    PassThroughEntry<Context> | undefined
>;

export const resolvePassThrough = <Context extends PassThroughResolverContext>(
    options: PassThroughOptions<Context> | undefined,
    part: string,
    context: Context,
): PassThroughAttrs => {
    if (!options) {
        return {};
    }

    const entry = options[part];

    if (!entry) {
        return {};
    }

    if (typeof entry === 'function') {
        const resolved = entry(context);

        return resolved ?? {};
    }

    return entry;
};

export const withPartClass = (
    attrs: PassThroughAttrs,
    baseClass: string | null,
    unstyled: boolean,
): PassThroughAttrs => {
    const next: PassThroughAttrs = { ...attrs };
    const externalClass = next.class as unknown;

    if (unstyled) {
        if (externalClass == null) {
            delete next.class;
        }

        return next;
    }

    next.class = [baseClass, externalClass].filter(Boolean);

    return next;
};
