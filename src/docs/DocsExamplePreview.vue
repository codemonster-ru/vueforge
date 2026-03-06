<template>
    <section class="vf-docs-example" data-testid="vf-docs-example-block">
        <h3 :id="id" class="vf-docs-example__title">{{ title }}</h3>
        <!-- eslint-disable vue/no-v-html -->
        <div v-if="descriptionHtml" class="vf-docs__markdown vf-docs__markdown_example" v-html="descriptionHtml" />
        <!-- eslint-enable vue/no-v-html -->
        <div class="vf-docs-example__frame">
            <div class="vf-docs-example__preview" data-testid="vf-docs-example-preview">
                <component :is="previewComponent" v-if="previewComponent && !previewError" />
                <p v-else class="vf-docs-example__state">
                    {{ previewError || 'Live preview is not available for this example yet.' }}
                </p>
            </div>
            <div class="vf-docs-example__code-shell">
                <VueCodeBlock
                    class="vf-docs-example__code"
                    :language="normalizedLanguage"
                    :code="props.code"
                    :show-header="false"
                    :copyable="false"
                    :wrap="true"
                    theme="inherit"
                    aria-label="Example code"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { compile } from '@vue/compiler-dom';
import { CodeBlock as VueCodeBlock } from '@codemonster-ru/vue-codeblock';
import * as VueRuntime from 'vue';
import { computed, markRaw, onErrorCaptured, ref, watch } from 'vue';

const props = defineProps<{
    id: string;
    title: string;
    descriptionHtml: string;
    code: string;
    language: string;
}>();

const componentModules = import.meta.glob('../package/components/*.vue', {
    eager: true,
    import: 'default',
}) as Record<string, object>;

const toPascalCase = (value: string): string =>
    value
        .split(/[-_]+/g)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

const exampleComponents = Object.entries(componentModules).reduce<Record<string, object>>((acc, [path, component]) => {
    const fileName =
        path
            .split('/')
            .at(-1)
            ?.replace(/\.vue$/i, '') ?? '';
    acc[toPascalCase(fileName)] = component;
    return acc;
}, {});

const runtimePreviewError = ref('');
const previewStateKey = 'previewState';

const clonePreviewValue = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        return value.map(item => clonePreviewValue(item));
    }

    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
                key,
                clonePreviewValue(nestedValue),
            ]),
        );
    }

    return value;
};

const isNumberPropDefinition = (definition: unknown): boolean => {
    if (definition === Number) {
        return true;
    }

    if (Array.isArray(definition)) {
        return definition.includes(Number);
    }

    if (definition && typeof definition === 'object' && 'type' in (definition as Record<string, unknown>)) {
        const typeDefinition = (definition as { type?: unknown }).type;
        return typeDefinition === Number || (Array.isArray(typeDefinition) && typeDefinition.includes(Number));
    }

    return false;
};

const getComponentNumberProps = (tagName: string): Set<string> => {
    const component = exampleComponents[tagName] as { props?: Record<string, unknown> } | undefined;
    const propsDefinition = component?.props;

    if (!propsDefinition || Array.isArray(propsDefinition)) {
        return new Set();
    }

    return new Set(
        Object.entries(propsDefinition)
            .filter(([, definition]) => isNumberPropDefinition(definition))
            .map(([propName]) => propName),
    );
};

const rewritePreviewStateReferences = (template: string, identifiers: string[]): string => {
    let normalizedTemplate = template;

    for (const identifier of identifiers) {
        const escapedIdentifier = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        normalizedTemplate = normalizedTemplate.replace(
            new RegExp(`v-model(?::([\\w-]+))?="\\s*${escapedIdentifier}\\s*"`, 'g'),
            (_match, argument?: string) => {
                const modelProp = argument ? `:${argument}` : ':model-value';
                const modelEvent = argument ? `@update:${argument}` : '@update:modelValue';
                return `${modelProp}="${previewStateKey}.${identifier}" ${modelEvent}="${previewStateKey}.${identifier} = $event"`;
            },
        );

        normalizedTemplate = normalizedTemplate.replace(
            new RegExp(`((?:[:@]|v-[\\w-]+(?::[\\w-]+)?)=)"\\s*${escapedIdentifier}\\s*"`, 'g'),
            `$1"${previewStateKey}.${identifier}"`,
        );

        normalizedTemplate = normalizedTemplate.replace(
            new RegExp(`{{\\s*${escapedIdentifier}\\s*}}`, 'g'),
            `{{ ${previewStateKey}.${identifier} }}`,
        );
    }

    return normalizedTemplate;
};

const normalizePreviewTemplate = (template: string): string =>
    template.replace(
        /<([A-Z][\w-]*)([\s\S]*?)(\/?)>/g,
        (fullMatch, tagName: string, attributes: string, selfClosing: string) => {
            const numberProps = getComponentNumberProps(tagName);
            if (!numberProps.size) {
                return fullMatch;
            }

            const normalizedAttributes = attributes.replace(
                /(^|\s)([A-Za-z_][\w-]*)(\s*=\s*)("(\d+)"|'(\d+)')/g,
                (
                    attributeMatch,
                    whitespace: string,
                    attributeName: string,
                    equals: string,
                    quotedValue: string,
                    doubleQuotedNumber?: string,
                    singleQuotedNumber?: string,
                ) => {
                    if (
                        attributeName.startsWith(':') ||
                        attributeName.startsWith('@') ||
                        attributeName.startsWith('#') ||
                        attributeName.startsWith('v-')
                    ) {
                        return attributeMatch;
                    }

                    if (!numberProps.has(attributeName)) {
                        return attributeMatch;
                    }

                    const numericValue = doubleQuotedNumber ?? singleQuotedNumber;
                    return `${whitespace}:${attributeName}${equals}${numericValue}`;
                },
            );

            return `<${tagName}${normalizedAttributes}${selfClosing}>`;
        },
    );

const extractTemplate = (code: string): string => {
    const trimmed = code.trim();
    const templateMatch = trimmed.match(/<template>([\s\S]*?)<\/template>/i);
    return (templateMatch?.[1] ?? trimmed).trim();
};

const extractDirectiveIdentifiers = (template: string): string[] => {
    const matches = template.matchAll(/(?:[:@]|v-model(?::[\w-]+)?=)"\s*([A-Za-z_$][\w$]*)\s*"/g);
    return [...matches].map(match => match[1]);
};

const extractInterpolationIdentifiers = (template: string): string[] => {
    const matches = template.matchAll(/{{\s*([A-Za-z_$][\w$]*)\s*}}/g);
    return [...matches].map(match => match[1]);
};

const inferAccordionModelValue = (template: string, identifier: string): string | string[] | undefined => {
    const accordionMatch = template.match(
        new RegExp(`<Accordion[^>]*v-model="${identifier}"[^>]*?(\\smultiple(?:\\s|>|=)|>|/>)`, 'i'),
    );
    if (!accordionMatch) {
        return undefined;
    }

    const firstItemValueMatch = template.match(/<AccordionItem[^>]*value=(?:"([^"]+)"|'([^']+)')/i);
    const firstItemValue = firstItemValueMatch?.[1] ?? firstItemValueMatch?.[2];
    if (!firstItemValue) {
        return accordionMatch[1].includes('multiple') ? [] : '';
    }

    return accordionMatch[1].includes('multiple') ? [firstItemValue] : firstItemValue;
};

const inferModelValue = (template: string, identifier: string): unknown => {
    const accordionValue = inferAccordionModelValue(template, identifier);
    if (accordionValue !== undefined) {
        return accordionValue;
    }

    if (
        /(^|[A-Z_])(open|opened|visible|show|shown|loading|saving|editing|pinned|agreed|collapsed|disabled)$/i.test(
            identifier,
        )
    ) {
        return true;
    }

    if (/(page|step|index|count|score|volume|quantity)$/i.test(identifier)) {
        return 1;
    }

    if (/(date|time|email|password|query|search|name|title|phone|bio|message|value)$/i.test(identifier)) {
        return '';
    }

    return '';
};

const hasUnsupportedScript = computed(() => /<script(?:\s+setup)?[\s\S]*?<\/script>/i.test(props.code));
const hasUnsupportedStyle = computed(() => /<style[\s\S]*?<\/style>/i.test(props.code));
const previewTemplate = computed(() => extractTemplate(props.code));
const allExternalIdentifiers = computed(() =>
    Array.from(
        new Set([
            ...extractDirectiveIdentifiers(previewTemplate.value),
            ...extractInterpolationIdentifiers(previewTemplate.value),
        ]),
    ),
);
const modelIdentifiers = computed(() =>
    Array.from(
        new Set(
            [...previewTemplate.value.matchAll(/v-model(?::[\w-]+)?="\s*([A-Za-z_$][\w$]*)\s*"/g)].map(
                match => match[1],
            ),
        ),
    ),
);
const hasUnsupportedExternalBindings = computed(() =>
    allExternalIdentifiers.value.some(identifier => !modelIdentifiers.value.includes(identifier)),
);
const inferredModelState = computed<Record<string, unknown>>(() =>
    Object.fromEntries(
        modelIdentifiers.value.map(identifier => [identifier, inferModelValue(previewTemplate.value, identifier)]),
    ),
);
const normalizedPreviewTemplate = computed(() =>
    normalizePreviewTemplate(rewritePreviewStateReferences(previewTemplate.value, modelIdentifiers.value)),
);

const isPreviewable = computed(() => {
    if (hasUnsupportedScript.value || hasUnsupportedStyle.value) {
        return false;
    }

    if (!previewTemplate.value.startsWith('<')) {
        return false;
    }

    if (hasUnsupportedExternalBindings.value) {
        return false;
    }

    return ['vue', 'html', ''].includes(props.language);
});

const compiledPreview = computed<{ render: (() => unknown) | null; error: string }>(() => {
    if (!isPreviewable.value) {
        return { render: null, error: '' };
    }

    try {
        const { code } = compile(normalizedPreviewTemplate.value, {
            mode: 'function',
            hoistStatic: false,
            prefixIdentifiers: true,
        });
        return {
            render: new Function('Vue', `${code}`)(VueRuntime) as () => unknown,
            error: '',
        };
    } catch (error) {
        return {
            render: null,
            error: error instanceof Error ? error.message : String(error),
        };
    }
});

const compiledRender = computed(() => compiledPreview.value.render);
const previewError = computed(() => runtimePreviewError.value || compiledPreview.value.error);

const previewComponent = computed(() => {
    if (!isPreviewable.value || !compiledRender.value) {
        return null;
    }

    return markRaw({
        components: exampleComponents,
        data() {
            const previewState = Object.fromEntries(
                Object.entries(inferredModelState.value).map(([key, value]) => [key, clonePreviewValue(value)]),
            );

            return {
                [previewStateKey]: previewState,
                ...Object.fromEntries(
                    Object.entries(previewState).map(([key, value]) => [key, clonePreviewValue(value)]),
                ),
            };
        },
        render: compiledRender.value,
    });
});

const normalizedLanguage = computed(() => props.language || 'plaintext');

watch(
    () => props.code,
    () => {
        runtimePreviewError.value = '';
    },
    { immediate: true },
);

onErrorCaptured(error => {
    runtimePreviewError.value = error instanceof Error ? error.message : String(error);
    return false;
});
</script>

<style scoped lang="scss">
.vf-docs-example + .vf-docs-example {
    margin-top: 2.25rem;
}

.vf-docs-example__title {
    margin: 0;
    font-size: 1.5rem;
}

.vf-docs__markdown_example {
    margin-top: 0.55rem;
}

.vf-docs-example__frame {
    margin-top: 0.95rem;
    display: grid;
    gap: 0.7rem;
    min-width: 0;
    width: 100%;
}

.vf-docs-example__preview {
    min-width: 0;
    width: 100%;
    min-height: 6.5rem;
    padding: 1rem;
    border-radius: 0.45rem;
    border: 1px solid var(--vf-docs-panel-border);
    background: var(--vf-docs-panel-bg);
    box-shadow: none;
    overflow: hidden;

    --vf-bg-color: var(--vf-docs-surface);
    --vf-bg-soft-color: var(--vf-docs-surface-muted);
    --vf-text-color: var(--vf-docs-text);
    --vf-secondary-text-color: var(--vf-docs-secondary-text);
    --vf-border-color: var(--vf-docs-border-strong);
    --vf-divider-color: var(--vf-docs-border-strong);
    --vf-accordion-background-color: color-mix(in srgb, var(--vf-docs-surface) 92%, transparent);
    --vf-accordion-header-background-color: color-mix(
        in srgb,
        var(--vf-docs-surface) 88%,
        var(--vf-docs-surface-muted)
    );
    --vf-accordion-header-hover-background-color: color-mix(
        in srgb,
        var(--vf-docs-surface) 78%,
        var(--vf-docs-link-hover-bg)
    );
    --vf-accordion-header-active-background-color: color-mix(
        in srgb,
        var(--vf-docs-surface) 72%,
        var(--vf-docs-link-hover-bg)
    );
    --vf-accordion-content-background-color: color-mix(in srgb, var(--vf-docs-surface) 96%, transparent);
    --vf-accordion-border-color: var(--vf-docs-border-strong);
    --vf-accordion-divider-color: var(--vf-docs-border-strong);
    --vf-accordion-header-text-color: var(--vf-docs-text);
    --vf-accordion-content-text-color: var(--vf-docs-text);
    --vf-accordion-icon-color: var(--vf-docs-secondary-text);
    color: var(--vf-docs-text);
    overflow-x: auto;
}

.vf-docs-example__preview :deep(.vf-accordion),
.vf-docs-example__preview :deep(.vf-accordion-item:last-child) {
    margin-bottom: 0;
}

.vf-docs-example__state {
    margin: 0;
    color: var(--vf-docs-secondary-text);
    font-size: 0.95rem;
    line-height: 1.6;
}

.vf-docs-example__code-shell {
    min-width: 0;
    width: 100%;
}

.vf-docs-example__code {
    min-width: 0;
    width: 100%;
    margin: 0;
    --vcb-gap: 0;
    --vcb-padding: 1rem;
    --vcb-font-size: 0.875rem;
    --vcb-line-height: 1.55;
    --vcb-border-radius: 0.45rem;
    --vcb-border-color: var(--vf-docs-panel-inset-border);
    --vcb-dark-border-color: var(--vf-docs-panel-border);
    --vcb-background-color: var(--vf-docs-panel-bg);
    --vcb-dark-background-color: var(--vf-docs-panel-bg);
    --vcb-text-color: color-mix(in srgb, var(--vf-docs-code-block-text) 88%, var(--vf-docs-secondary-text));
    --vcb-dark-text-color: color-mix(in srgb, var(--vf-docs-code-block-text) 88%, var(--vf-docs-secondary-text));
    --vcb-font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.vf-docs-example__code :deep(.vcb) {
    box-shadow: none;
}

.vf-docs-example__code :deep(.vcb__token_tag),
.vf-docs__markdown :deep(.vcb__token_tag) {
    color: var(--vf-docs-token-tag);
}

.vf-docs-example__code :deep(.vcb__token_selector),
.vf-docs__markdown :deep(.vcb__token_selector) {
    color: var(--vf-docs-token-selector);
}

.vf-docs-example__code :deep(.vcb__token_keyword),
.vf-docs__markdown :deep(.vcb__token_keyword) {
    color: var(--vf-docs-token-keyword);
}

.vf-docs-example__code :deep(.vcb__token_string),
.vf-docs__markdown :deep(.vcb__token_string) {
    color: var(--vf-docs-token-string);
}

.vf-docs-example__code :deep(.vcb__token_number),
.vf-docs__markdown :deep(.vcb__token_number) {
    color: var(--vf-docs-token-number);
}

.vf-docs-example__code :deep(.vcb__token_comment),
.vf-docs__markdown :deep(.vcb__token_comment) {
    color: var(--vf-docs-token-comment);
}

.vf-docs-example__code :deep(.vcb__token_variable),
.vf-docs__markdown :deep(.vcb__token_variable) {
    color: var(--vf-docs-token-variable);
}

.vf-docs-example__code :deep(.vcb__token_component),
.vf-docs__markdown :deep(.vcb__token_component) {
    color: var(--vf-docs-token-component);
}

.vf-docs-example__code :deep(.vcb__token_attribute),
.vf-docs__markdown :deep(.vcb__token_attribute) {
    color: var(--vf-docs-token-attribute);
}

.vf-docs-example__code :deep(.vcb__token_directive),
.vf-docs__markdown :deep(.vcb__token_directive) {
    color: var(--vf-docs-token-directive);
}

.vf-docs-example__code :deep(.vcb__token_identifier),
.vf-docs__markdown :deep(.vcb__token_identifier) {
    color: var(--vf-docs-token-identifier);
}

.vf-docs-example__code :deep(.vcb__token_function),
.vf-docs__markdown :deep(.vcb__token_function) {
    color: var(--vf-docs-token-function);
}

.vf-docs-example__code :deep(.vcb__token_property),
.vf-docs__markdown :deep(.vcb__token_property) {
    color: var(--vf-docs-token-property);
}

.vf-docs-example__code :deep(.vcb__token_operator),
.vf-docs__markdown :deep(.vcb__token_operator) {
    color: var(--vf-docs-token-operator);
}
</style>
