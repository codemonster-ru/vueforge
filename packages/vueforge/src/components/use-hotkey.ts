import { computed, onBeforeUnmount, onMounted, unref, watch, type Ref } from 'vue';

type HotkeyEventType = 'keydown' | 'keyup';
type HotkeyTarget = Window | Document | HTMLElement;

type MaybeRef<T> = T | Ref<T>;

export interface UseHotkeyOptions {
    combo: string | Array<string>;
    handler: (event: KeyboardEvent, matchedCombo: string) => void;
    enabled?: MaybeRef<boolean>;
    event?: HotkeyEventType;
    preventDefault?: boolean;
    stopPropagation?: boolean;
    ignoreInputs?: boolean;
    allowInInputs?: boolean;
    exact?: boolean;
    target?: MaybeRef<HotkeyTarget | null | undefined>;
    scopeRef?: Ref<HTMLElement | null>;
}

type ParsedCombo = {
    raw: string;
    key: string;
    ctrl: boolean;
    meta: boolean;
    mod: boolean;
    alt: boolean;
    shift: boolean;
    hasExplicitModifier: boolean;
};

const normalizeKey = (key: string) => {
    const normalized = key.toLowerCase();

    if (normalized === ' ') {
        return 'space';
    }

    return normalized;
};

const isEditableTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) {
        return false;
    }

    const tagName = target.tagName;

    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
        return true;
    }

    return !!target.closest('[contenteditable="true"]');
};

const parseCombo = (combo: string): ParsedCombo => {
    const tokens = combo
        .split('+')
        .map(token => token.trim().toLowerCase())
        .filter(Boolean);
    const modifierSet = new Set(tokens);
    const keyToken =
        tokens.find(token => !['ctrl', 'control', 'meta', 'cmd', 'command', 'alt', 'shift', 'mod'].includes(token)) ??
        '';

    return {
        raw: combo,
        key: normalizeKey(keyToken),
        ctrl: modifierSet.has('ctrl') || modifierSet.has('control'),
        meta: modifierSet.has('meta') || modifierSet.has('cmd') || modifierSet.has('command'),
        mod: modifierSet.has('mod'),
        alt: modifierSet.has('alt'),
        shift: modifierSet.has('shift'),
        hasExplicitModifier:
            modifierSet.has('ctrl') ||
            modifierSet.has('control') ||
            modifierSet.has('meta') ||
            modifierSet.has('cmd') ||
            modifierSet.has('command') ||
            modifierSet.has('alt') ||
            modifierSet.has('shift') ||
            modifierSet.has('mod'),
    };
};

const matchesCombo = (event: KeyboardEvent, combo: ParsedCombo, exact: boolean) => {
    const eventKey = normalizeKey(event.key);

    if (combo.key && eventKey !== combo.key) {
        return false;
    }

    if (combo.mod && !event.ctrlKey && !event.metaKey) {
        return false;
    }

    if (!combo.mod && event.ctrlKey !== combo.ctrl && (exact || combo.ctrl || combo.hasExplicitModifier)) {
        return false;
    }

    if (!combo.mod && event.metaKey !== combo.meta && (exact || combo.meta || combo.hasExplicitModifier)) {
        return false;
    }

    if (event.altKey !== combo.alt && (exact || combo.alt || combo.hasExplicitModifier)) {
        return false;
    }

    if (event.shiftKey !== combo.shift && (exact || combo.shift || combo.hasExplicitModifier)) {
        return false;
    }

    return true;
};

const resolveTarget = (target: UseHotkeyOptions['target']) => {
    const resolved = target === undefined ? document : unref(target);

    return resolved ?? document;
};

export const useHotkey = (options: UseHotkeyOptions) => {
    const enabled = computed(() => options.enabled === undefined || !!unref(options.enabled));
    const eventType = computed<HotkeyEventType>(() => options.event ?? 'keydown');
    const parsedCombos = computed(() => {
        const source = Array.isArray(options.combo) ? options.combo : [options.combo];

        return source.map(parseCombo);
    });

    const onHotkeyEvent = (event: KeyboardEvent) => {
        if (!enabled.value) {
            return;
        }

        const scopeRoot = options.scopeRef?.value ?? null;

        if (scopeRoot) {
            const targetNode = event.target as Node | null;
            const activeNode = (document.activeElement as Node | null) ?? null;
            const targetInside = !!targetNode && scopeRoot.contains(targetNode);
            const activeInside = !!activeNode && scopeRoot.contains(activeNode);

            if (!targetInside && !activeInside) {
                return;
            }
        }

        const ignoreInputs = options.ignoreInputs ?? true;
        const allowInInputs = options.allowInInputs ?? false;

        if (ignoreInputs && !allowInInputs && isEditableTarget(event.target)) {
            return;
        }

        const exact = options.exact ?? true;

        for (const combo of parsedCombos.value) {
            if (!matchesCombo(event, combo, exact)) {
                continue;
            }

            if (options.preventDefault ?? true) {
                event.preventDefault();
            }

            if (options.stopPropagation ?? false) {
                event.stopPropagation();
            }

            options.handler(event, combo.raw);

            return;
        }
    };

    let teardown: (() => void) | null = null;

    const detach = () => {
        if (teardown) {
            teardown();
            teardown = null;
        }
    };

    const attach = () => {
        detach();

        const target = resolveTarget(options.target);
        const handler = (event: Event) => {
            onHotkeyEvent(event as KeyboardEvent);
        };

        target.addEventListener(eventType.value, handler);
        teardown = () => {
            target.removeEventListener(eventType.value, handler);
        };
    };

    watch([eventType, () => unref(options.target)], attach, { immediate: false });

    onMounted(() => {
        attach();
    });

    onBeforeUnmount(() => {
        detach();
    });

    return {
        trigger: (event: KeyboardEvent, matchedCombo: string) => options.handler(event, matchedCombo),
    };
};
