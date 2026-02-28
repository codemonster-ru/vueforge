<template>
    <section v-if="hasPlayground" class="vf-docs-preview" data-testid="vf-docs-live-preview">
        <header class="vf-docs-preview__header">
            <h3>API Playground</h3>
            <p>Interactive preview generated from this page props API section.</p>
        </header>

        <p v-if="resolvedComponentName" class="vf-docs-preview__component">
            Component: <code>{{ resolvedComponentName }}</code>
        </p>

        <div class="vf-docs-preview__layout">
            <aside class="vf-docs-preview__controls">
                <h4>Props</h4>
                <div v-if="!propControls.length" class="vf-docs-preview__empty">
                    No parseable props found in docs page.
                </div>
                <div v-for="control in propControls" :key="control.name" class="vf-docs-preview__control">
                    <label :for="`vf-docs-control-${control.name}`">{{ control.name }}</label>
                    <select
                        v-if="control.kind === 'select'"
                        :id="`vf-docs-control-${control.name}`"
                        :value="getStringValue(control.name)"
                        @change="setStringValue(control.name, ($event.target as HTMLSelectElement).value)"
                    >
                        <option v-for="option in control.options" :key="option" :value="option">{{ option }}</option>
                    </select>
                    <input
                        v-else-if="control.kind === 'boolean'"
                        :id="`vf-docs-control-${control.name}`"
                        :checked="getBooleanValue(control.name)"
                        type="checkbox"
                        @change="setBooleanValue(control.name, ($event.target as HTMLInputElement).checked)"
                    />
                    <input
                        v-else-if="control.kind === 'number'"
                        :id="`vf-docs-control-${control.name}`"
                        :value="getNumberValue(control.name)"
                        type="number"
                        @input="setNumberValue(control.name, ($event.target as HTMLInputElement).value)"
                    />
                    <textarea
                        v-else-if="control.kind === 'json'"
                        :id="`vf-docs-control-${control.name}`"
                        :value="getStringValue(control.name)"
                        rows="3"
                        @input="setStringValue(control.name, ($event.target as HTMLTextAreaElement).value)"
                    />
                    <input
                        v-else
                        :id="`vf-docs-control-${control.name}`"
                        :value="getStringValue(control.name)"
                        type="text"
                        @input="setStringValue(control.name, ($event.target as HTMLInputElement).value)"
                    />
                </div>
            </aside>

            <div class="vf-docs-preview__render">
                <p v-if="isCanvasComponent && !supportsCanvasPreview" class="vf-docs-preview__state">
                    Canvas-based preview disabled in non-canvas environment. Open in browser dev mode.
                </p>
                <component
                    :is="resolvedComponent"
                    v-else-if="resolvedComponent"
                    v-bind="resolvedProps"
                    v-on="resolvedListeners"
                >
                    {{ slotFallbackText }}
                </component>
                <p v-else class="vf-docs-preview__state">No matching component export found for this docs page.</p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

type ControlKind = 'boolean' | 'number' | 'select' | 'json' | 'text';

type PropControl = {
    name: string;
    kind: ControlKind;
    typeText: string;
    isArrayType: boolean;
    options: string[];
    defaultRaw: string | null;
};

const forcedJsonArrayPropPattern = /^(labels|series|datasets|fields|queryBuilderFields|presets)$/i;
const forcedJsonObjectPropPattern = /^(state|pt)$/i;

const isForcedJsonArrayProp = (name: string): boolean => forcedJsonArrayPropPattern.test(name);
const isForcedJsonObjectProp = (name: string): boolean => forcedJsonObjectPropPattern.test(name);
const isForcedJsonProp = (name: string): boolean => isForcedJsonArrayProp(name) || isForcedJsonObjectProp(name);
const isLabelsProp = (name: string): boolean => /^labels$/i.test(name);
const isSeriesProp = (name: string): boolean => /^(series|datasets)$/i.test(name);
const isFieldsLikeProp = (name: string): boolean => /^(fields|presets|queryBuilderFields|items)$/i.test(name);
const isOptionsProp = (name: string): boolean => /^options$/i.test(name);
const isServiceLikeProp = (name: string, typeText: string): boolean =>
    /service/i.test(name) || /Service\b/.test(typeText);
const isDomTargetLikeType = (typeText: string): boolean => /\b(HTMLElement|Element|Window|Document)\b/.test(typeText);
const decodeStringLiteralDefault = (value: string): string => {
    const match = value.match(/^(['"])([\s\S]*)\1$/);
    return match ? match[2] : value;
};

const props = defineProps<{
    routePath: string;
    pageTitle: string;
    markdown: string;
}>();

const supportsCanvasPreview =
    typeof window !== 'undefined' && typeof navigator !== 'undefined' && !/jsdom/i.test(navigator.userAgent || '');

const normalizeKey = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const componentModules = import.meta.glob('../package/components/*.vue', {
    eager: true,
    import: 'default',
}) as Record<string, unknown>;

const componentEntries = Object.entries(componentModules).filter(([, value]) => {
    const type = typeof value;
    return type === 'object' || type === 'function';
});

const componentByNormalizedKey = componentEntries.reduce<Record<string, unknown>>((acc, [path, component]) => {
    const fileName =
        path
            .split('/')
            .at(-1)
            ?.replace(/\.vue$/i, '') ?? '';
    acc[normalizeKey(fileName)] = component;
    return acc;
}, {});

const tokenizeCandidates = (value: string): string[] =>
    value
        .split(/[/,()|]+/g)
        .map(token => token.trim())
        .filter(Boolean);

const routeSlugToken = computed(() => {
    const segment = props.routePath.split('/').filter(Boolean).at(-1) ?? '';
    return segment
        .split(/[-_]+/g)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
});

const resolvedComponentName = computed(() => {
    if (!props.routePath.startsWith('/docs/components/')) {
        return null;
    }

    const tokens = [...tokenizeCandidates(props.pageTitle), routeSlugToken.value];
    for (const token of tokens) {
        const normalized = normalizeKey(token);
        const match = componentByNormalizedKey[normalized];
        if (match) {
            return token;
        }
    }

    return null;
});

const resolvedComponent = computed(() => {
    if (!props.routePath.startsWith('/docs/components/')) {
        return null;
    }

    const tokens = [...tokenizeCandidates(props.pageTitle), routeSlugToken.value];
    for (const token of tokens) {
        const normalized = normalizeKey(token);
        const component = componentByNormalizedKey[normalized];
        if (component) {
            return component;
        }
    }

    return null;
});

const isCanvasComponent = computed(() =>
    /(Chart|Sparkline|Gauge|Heatmap|Histogram)/.test(resolvedComponentName.value ?? ''),
);

const parsePropsSection = (markdown: string): PropControl[] => {
    const sectionMatch = markdown.match(/^##\s+Props\s*([\s\S]*?)(?:^##\s+|(?![\s\S]))/m);
    if (!sectionMatch) {
        return [];
    }

    const lines = sectionMatch[1].split(/\r?\n/);
    const controls: PropControl[] = [];
    const seen = new Set<string>();

    for (const line of lines) {
        const trimmed = line.trim();
        if (/^###\s+/.test(line)) {
            break;
        }
        if (trimmed === '') {
            continue;
        }
        if (!trimmed.startsWith('-')) {
            if (controls.length > 0) {
                break;
            }
            continue;
        }

        const match = line.match(/^-+\s+`([^`]+)`(?:\s+\(default\s+`([^`]+)`\))?/);
        if (!match) {
            continue;
        }

        const signature = match[1].trim();
        const defaultRaw = match[2]?.trim() ?? null;
        const firstColonIndex = signature.indexOf(':');
        const left = (firstColonIndex >= 0 ? signature.slice(0, firstColonIndex) : signature).trim();
        const right = (firstColonIndex >= 0 ? signature.slice(firstColonIndex + 1) : 'unknown').trim();
        const propName = left.replace(/\?$/, '').trim();
        const typeText = right;

        if (!propName || seen.has(propName)) {
            continue;
        }
        seen.add(propName);

        const enumOptions = [...typeText.matchAll(/'([^']+)'/g)].map(entry => entry[1]);
        const normalizedType = typeText.replace(/\s+/g, ' ');
        const isTupleType = /^\s*\[[^\]]*]\s*(?:\|\s*(?:null|undefined))?\s*$/i.test(normalizedType);
        const isArrayType = /Array\s*<|(?:^|\s)\w+\[\]/i.test(typeText) || isTupleType;
        const hasFunctionType = /=>|\bFunction\b/.test(typeText);
        const isLiteralUnionType = /^\s*'[^']+'\s*(?:\|\s*'[^']+'\s*)+(?:\|\s*(?:null|undefined)\s*)?$/i.test(
            normalizedType,
        );
        const primitiveUnionTokens = normalizedType.split('|').map(token => token.trim().toLowerCase());
        const isPrimitiveOnly =
            primitiveUnionTokens.length > 0 &&
            primitiveUnionTokens.every(token =>
                ['string', 'number', 'boolean', 'null', 'undefined', '(string)', '(number)', '(boolean)'].includes(
                    token,
                ),
            );
        const isStructuredTypeHint =
            /Record|Array|object|unknown|\[\]|<\s*{|\{\s*[^}]*\}|State\b|Config\b|Options\b|Payload\b|Value\b/i.test(
                typeText,
            );
        const isNullableStructuredType = /\|\s*null\b/i.test(typeText) && !isPrimitiveOnly;

        let kind: ControlKind = 'text';
        if (enumOptions.length >= 2 && isLiteralUnionType) {
            kind = 'select';
        } else if (hasFunctionType) {
            kind = 'text';
        } else if (isArrayType || isStructuredTypeHint || isNullableStructuredType) {
            kind = 'json';
        } else if (/boolean/.test(typeText)) {
            kind = 'boolean';
        } else if (/number/.test(typeText)) {
            kind = 'number';
        }

        if (isForcedJsonProp(propName)) {
            kind = 'json';
        }

        controls.push({
            name: propName,
            kind,
            typeText,
            isArrayType,
            options: enumOptions,
            defaultRaw,
        });
    }

    return controls;
};

const parseEventsSection = (markdown: string): Set<string> => {
    const events = new Set<string>();
    const sectionMatch = markdown.match(/^##\s+Events\s*([\s\S]*?)(?:^##\s+|(?![\s\S]))/m);
    if (!sectionMatch) {
        return events;
    }

    const lines = sectionMatch[1].split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('-')) {
            continue;
        }

        const withCode = trimmed.match(/^-+\s+`([^`]+)`/);
        if (withCode) {
            events.add(withCode[1].trim());
            continue;
        }

        const plain = trimmed.match(/^-+\s+([^(-][^(\n]*?)(?:\s*\(|$)/);
        if (plain) {
            const eventName = plain[1].trim();
            if (eventName && !/^This component does not emit/i.test(eventName)) {
                events.add(eventName);
            }
        }
    }

    return events;
};

const propControls = computed(() => parsePropsSection(props.markdown));
const declaredEvents = computed(() => parseEventsSection(props.markdown));
const controlValues = reactive<Record<string, string | boolean | number>>({});

const buildDefaultValue = (control: PropControl): string | boolean | number => {
    const defaultRaw = control.defaultRaw;
    const normalizedDefaultRaw = defaultRaw ? decodeStringLiteralDefault(defaultRaw) : null;

    if (control.kind === 'boolean') {
        return normalizedDefaultRaw === 'true';
    }

    if (control.kind === 'number') {
        const parsed = Number(normalizedDefaultRaw ?? '0');
        return Number.isFinite(parsed) ? parsed : 0;
    }

    if (control.kind === 'select') {
        return normalizedDefaultRaw && control.options.includes(normalizedDefaultRaw)
            ? normalizedDefaultRaw
            : (control.options[0] ?? '');
    }

    if (control.kind === 'json') {
        if (isDomTargetLikeType(control.typeText)) {
            return '';
        }

        if (normalizedDefaultRaw === '{}' || normalizedDefaultRaw === '[]') {
            return normalizedDefaultRaw;
        }

        if (isForcedJsonArrayProp(control.name)) {
            if (isLabelsProp(control.name)) {
                return JSON.stringify(['Q1', 'Q2', 'Q3', 'Q4'], null, 2);
            }
            if (isSeriesProp(control.name)) {
                return JSON.stringify(
                    [
                        { label: 'Series A', data: [10, 20, 18, 24] },
                        { label: 'Series B', data: [6, 12, 14, 19] },
                    ],
                    null,
                    2,
                );
            }
            if (isFieldsLikeProp(control.name)) {
                return JSON.stringify(
                    [
                        { label: 'Option A', value: 'a' },
                        { label: 'Option B', value: 'b' },
                    ],
                    null,
                    2,
                );
            }
            if (isOptionsProp(control.name)) {
                if (control.isArrayType || /\bArray\s*</i.test(control.typeText)) {
                    return JSON.stringify(
                        [
                            { label: 'Option A', value: 'a' },
                            { label: 'Option B', value: 'b' },
                        ],
                        null,
                        2,
                    );
                }
                return '{}';
            }
            return '[]';
        }

        if (isForcedJsonObjectProp(control.name)) {
            return '{}';
        }

        if (isLabelsProp(control.name)) {
            return JSON.stringify(['Q1', 'Q2', 'Q3', 'Q4'], null, 2);
        }

        if (isSeriesProp(control.name)) {
            return JSON.stringify(
                [
                    { label: 'Series A', data: [10, 20, 18, 24] },
                    { label: 'Series B', data: [6, 12, 14, 19] },
                ],
                null,
                2,
            );
        }

        if (isFieldsLikeProp(control.name)) {
            return JSON.stringify(
                [
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' },
                ],
                null,
                2,
            );
        }

        if (isOptionsProp(control.name)) {
            if (control.isArrayType || /\bArray\s*</i.test(control.typeText)) {
                return JSON.stringify(
                    [
                        { label: 'Option A', value: 'a' },
                        { label: 'Option B', value: 'b' },
                    ],
                    null,
                    2,
                );
            }
            return '{}';
        }

        if (/rows/i.test(control.name)) {
            return JSON.stringify(
                [
                    { id: 1, name: 'Alpha', status: 'Active' },
                    { id: 2, name: 'Beta', status: 'Paused' },
                ],
                null,
                2,
            );
        }

        if (/columns/i.test(control.name)) {
            return JSON.stringify(
                [
                    { field: 'name', header: 'Name' },
                    { field: 'status', header: 'Status' },
                ],
                null,
                2,
            );
        }

        if (
            /^\s*\[[^\]]*]\s*(?:\|\s*(?:null|undefined))?\s*$/i.test(control.typeText.replace(/\s+/g, ' ')) &&
            control.name === 'modelValue'
        ) {
            return '[null, null]';
        }

        if (control.isArrayType) {
            return '[]';
        }

        return normalizedDefaultRaw ?? (/\bArray\s*</i.test(control.typeText) ? '[]' : '{}');
    }

    if (normalizedDefaultRaw !== null) {
        if (isServiceLikeProp(control.name, control.typeText)) {
            return '';
        }

        if (/^icon$/i.test(control.name) && normalizedDefaultRaw === '') {
            return 'check';
        }

        return normalizedDefaultRaw;
    }

    if (control.name === 'label') {
        return 'Demo label';
    }

    if (/placeholder/i.test(control.name)) {
        return 'Type value';
    }

    if (/^icon$/i.test(control.name)) {
        return 'check';
    }

    if (control.name === 'modelValue') {
        return 'Demo value';
    }

    return '';
};

watch(
    [resolvedComponentName, propControls],
    () => {
        const nextValues: Record<string, string | boolean | number> = {};
        for (const control of propControls.value) {
            nextValues[control.name] = buildDefaultValue(control);
        }

        Object.keys(controlValues).forEach(key => {
            delete controlValues[key];
        });

        Object.assign(controlValues, nextValues);
    },
    { immediate: true },
);

const parseJson = (value: string): unknown => {
    try {
        return JSON.parse(value);
    } catch {
        return undefined;
    }
};

const getStringValue = (name: string): string => String(controlValues[name] ?? '');
const setStringValue = (name: string, value: string): void => {
    controlValues[name] = value;
};
const getBooleanValue = (name: string): boolean => Boolean(controlValues[name]);
const setBooleanValue = (name: string, value: boolean): void => {
    controlValues[name] = value;
};
const getNumberValue = (name: string): number => {
    const parsed = Number(controlValues[name]);
    return Number.isFinite(parsed) ? parsed : 0;
};
const setNumberValue = (name: string, value: string): void => {
    const parsed = Number(value);
    controlValues[name] = Number.isFinite(parsed) ? parsed : 0;
};

const resolvedProps = computed(() => {
    const output: Record<string, unknown> = {};

    for (const control of propControls.value) {
        const raw = controlValues[control.name];

        if (control.kind === 'boolean') {
            output[control.name] = Boolean(raw);
            continue;
        }

        if (control.kind === 'number') {
            const parsed = Number(raw);
            output[control.name] = Number.isFinite(parsed) ? parsed : 0;
            continue;
        }

        if (control.kind === 'json') {
            const parsed = parseJson(String(raw ?? ''));
            if (parsed !== undefined) {
                if (isForcedJsonArrayProp(control.name)) {
                    output[control.name] = Array.isArray(parsed) ? parsed : [];
                } else if (isForcedJsonObjectProp(control.name)) {
                    output[control.name] = parsed && typeof parsed === 'object' ? parsed : {};
                } else {
                    output[control.name] = parsed;
                }
            } else if (isForcedJsonArrayProp(control.name)) {
                output[control.name] = [];
            } else if (isForcedJsonObjectProp(control.name)) {
                output[control.name] = {};
            }
            continue;
        }

        if (control.kind === 'select') {
            output[control.name] = String(raw ?? '');
            continue;
        }

        const text = String(raw ?? '').trim();
        if (text !== '') {
            output[control.name] = text;
        }
    }

    if ('rowKey' in output && typeof output.rowKey !== 'string') {
        output.rowKey = 'id';
    }

    return output;
});

const resolvedListeners = computed<Record<string, (...args: unknown[]) => void>>(() => {
    const listeners: Record<string, (...args: unknown[]) => void> = {};
    if ('modelValue' in resolvedProps.value && declaredEvents.value.has('update:modelValue')) {
        listeners['update:modelValue'] = value => {
            const modelValueControl = propControls.value.find(control => control.name === 'modelValue');
            if (modelValueControl?.kind === 'json') {
                try {
                    controlValues.modelValue = JSON.stringify(value ?? null, null, 2);
                } catch {
                    controlValues.modelValue = '{}';
                }
                return;
            }

            controlValues.modelValue = String(value ?? '');
        };
    }
    return listeners;
});

const slotFallbackText = computed(() => {
    if (!resolvedComponentName.value) {
        return '';
    }
    return `${resolvedComponentName.value} preview`;
});

const hasPlayground = computed(() => props.routePath.startsWith('/docs/components/'));
</script>

<style scoped lang="scss">
.vf-docs-preview {
    margin-top: 1.25rem;
    padding: 1rem;
    border: 1px solid #bfdbfe;
    border-radius: 0.75rem;
    background: linear-gradient(150deg, rgba(224, 242, 254, 0.75), rgba(236, 253, 245, 0.7));
}

.vf-docs-preview__header h3 {
    margin: 0;
    font-size: 1rem;
}

.vf-docs-preview__header p {
    margin: 0.35rem 0 0;
    color: #334155;
    font-size: 0.85rem;
}

.vf-docs-preview__component {
    margin: 0.65rem 0 0;
    color: #475569;
    font-size: 0.82rem;
}

.vf-docs-preview__layout {
    margin-top: 0.9rem;
    display: grid;
    gap: 0.9rem;
    grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
}

.vf-docs-preview__controls {
    border: 1px solid #cbd5e1;
    border-radius: 0.6rem;
    padding: 0.7rem;
    background-color: rgba(255, 255, 255, 0.85);
}

.vf-docs-preview__controls h4 {
    margin: 0 0 0.55rem;
    font-size: 0.82rem;
    color: #334155;
}

.vf-docs-preview__empty {
    font-size: 0.8rem;
    color: #64748b;
}

.vf-docs-preview__control + .vf-docs-preview__control {
    margin-top: 0.5rem;
}

.vf-docs-preview__control label {
    display: block;
    margin: 0 0 0.22rem;
    font-size: 0.75rem;
    color: #475569;
}

.vf-docs-preview__control input[type='text'],
.vf-docs-preview__control input[type='number'],
.vf-docs-preview__control select,
.vf-docs-preview__control textarea {
    width: 100%;
    border: 1px solid #cbd5e1;
    border-radius: 0.45rem;
    padding: 0.4rem 0.5rem;
    font-size: 0.8rem;
}

.vf-docs-preview__control textarea {
    min-height: 4.2rem;
    resize: vertical;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.vf-docs-preview__render {
    border: 1px dashed #94a3b8;
    border-radius: 0.7rem;
    padding: 0.9rem;
    background-color: rgba(255, 255, 255, 0.75);
}

.vf-docs-preview__state {
    margin: 0;
    font-size: 0.85rem;
    color: #475569;
}

@media (max-width: 900px) {
    .vf-docs-preview__layout {
        grid-template-columns: 1fr;
    }
}
</style>
