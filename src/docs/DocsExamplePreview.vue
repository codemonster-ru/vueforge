<template>
    <section class="vf-docs-example" data-testid="vf-docs-example-block">
        <h3 :id="id" class="vf-docs-example__title">{{ title }}</h3>
        <!-- eslint-disable vue/no-v-html -->
        <div v-if="descriptionHtml" class="vf-docs__markdown vf-docs__markdown_example" v-html="descriptionHtml" />
        <!-- eslint-enable vue/no-v-html -->
        <div class="vf-docs-example__frame">
            <div
                v-if="previewComponent || previewError"
                class="vf-docs-example__preview"
                data-testid="vf-docs-example-preview"
            >
                <div v-if="showPreviewReset" class="vf-docs-example__preview-actions">
                    <button
                        type="button"
                        class="vf-docs-example__reset"
                        data-testid="vf-docs-example-reset"
                        @click="handlePreviewAction"
                    >
                        {{ previewActionLabel }}
                    </button>
                </div>
                <component :is="previewComponent" v-if="previewComponent && !previewError" :key="previewRenderKey" />
                <p v-else class="vf-docs-example__state">
                    {{ previewError }}
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
import { vOverlayBadge } from '../../packages/vueforge/src/directives/overlay-badge';

const props = defineProps<{
    id: string;
    title: string;
    descriptionHtml: string;
    code: string;
    language: string;
}>();

const componentModules = import.meta.glob(
    ['../../packages/vueforge/src/components/*.vue', '../../packages/layouts/src/components/*.vue'],
    {
        eager: true,
        import: 'default',
    },
) as Record<string, object>;

const acronymSegments = new Set(['ui', 'id', 'api', 'otp']);
const reservedExpressionIdentifiers = new Set([
    'true',
    'false',
    'null',
    'undefined',
    'NaN',
    'Infinity',
    'Math',
    'Number',
    'String',
    'Boolean',
    'Array',
    'Object',
    'Date',
    'JSON',
    'console',
]);

const toComponentAliases = (value: string): string[] => {
    const parts = value.split(/[-_]+/g).filter(Boolean);

    return Array.from(
        new Set([
            parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(''),
            parts
                .map(part =>
                    acronymSegments.has(part.toLowerCase())
                        ? part.toUpperCase()
                        : part.charAt(0).toUpperCase() + part.slice(1),
                )
                .join(''),
        ]),
    );
};

const exampleComponents = Object.entries(componentModules).reduce<Record<string, object>>((acc, [path, component]) => {
    const fileName =
        path
            .split('/')
            .at(-1)
            ?.replace(/\.vue$/i, '') ?? '';
    for (const alias of toComponentAliases(fileName)) {
        acc[alias] = component;
    }
    return acc;
}, {});

const runtimePreviewError = ref('');
const previewStateKey = 'previewState';

type DemoChartInstance = {
    host: HTMLDivElement | null;
    canvas: HTMLCanvasElement;
};

type DemoChartConfig = {
    type?: string;
    data?: {
        labels?: unknown[];
        datasets?: Array<Record<string, unknown>>;
    };
};

type DemoCodeEditorInstance = {
    host: HTMLTextAreaElement | null;
    root: HTMLElement;
    value: string;
    onInput?: (event: Event) => void;
};

const ensureDemoChartHost = (canvas: HTMLCanvasElement): HTMLDivElement | null => {
    const parent = canvas.parentElement;
    if (!parent || typeof document === 'undefined') {
        return null;
    }

    let host = parent.querySelector<HTMLDivElement>('.vf-docs-demo-chart');
    if (!host) {
        host = document.createElement('div');
        host.className = 'vf-docs-demo-chart';
        parent.append(host);
    }

    canvas.style.display = 'none';
    return host;
};

const renderDemoBubbleChart = (datasets: Array<Record<string, unknown>>) => {
    const allPoints = datasets.flatMap(dataset =>
        Array.isArray(dataset.data)
            ? dataset.data.filter(
                  (point): point is { x: number; y: number; r?: number } =>
                      typeof point === 'object' &&
                      point !== null &&
                      typeof (point as { x?: unknown }).x === 'number' &&
                      typeof (point as { y?: unknown }).y === 'number',
              )
            : [],
    );

    const xValues = allPoints.map(point => point.x);
    const yValues = allPoints.map(point => point.y);
    const minX = Math.min(...xValues, 0);
    const maxX = Math.max(...xValues, 1);
    const minY = Math.min(...yValues, 0);
    const maxY = Math.max(...yValues, 1);
    const xRange = Math.max(1, maxX - minX);
    const yRange = Math.max(1, maxY - minY);
    const radiusValues = allPoints
        .map(point => Number(point.r))
        .filter((value): value is number => Number.isFinite(value) && value > 0);
    const minRadius = radiusValues.length ? Math.min(...radiusValues) : 1;
    const maxRadius = radiusValues.length ? Math.max(...radiusValues) : 1;
    const radiusRange = Math.max(1, maxRadius - minRadius);
    const plotPadding = 8;

    const points = datasets
        .flatMap((dataset, datasetIndex) => {
            const hue = (datasetIndex * 97) % 360;
            const data = Array.isArray(dataset.data) ? dataset.data : [];

            return data
                .filter(
                    (point): point is { x: number; y: number; r?: number } =>
                        typeof point === 'object' &&
                        point !== null &&
                        typeof (point as { x?: unknown }).x === 'number' &&
                        typeof (point as { y?: unknown }).y === 'number',
                )
                .map(point => {
                    const normalizedX = (point.x - minX) / xRange;
                    const normalizedY = (point.y - minY) / yRange;
                    const radius = Number(point.r) > 0 ? Number(point.r) : minRadius;
                    const normalizedRadius = (radius - minRadius) / radiusRange;
                    const left = `${plotPadding + normalizedX * (100 - plotPadding * 2)}%`;
                    const bottom = `${plotPadding + normalizedY * (100 - plotPadding * 2)}%`;
                    const size = `${0.9 + normalizedRadius * 1.8}rem`;
                    return `<span class="vf-docs-demo-chart__bubble" style="left:${left};bottom:${bottom};width:${size};height:${size};--vf-docs-demo-chart-bubble:hsl(${hue} 70% 58% / 0.72)"></span>`;
                });
        })
        .join('');

    const legends = datasets
        .map(
            (dataset, datasetIndex) =>
                `<span class="vf-docs-demo-chart__legend"><span class="vf-docs-demo-chart__legend-dot" style="--vf-docs-demo-chart-bubble:hsl(${(datasetIndex * 97) % 360} 70% 58% / 0.72)"></span>${String(dataset.label ?? `Series ${datasetIndex + 1}`)}</span>`,
        )
        .join('');

    return `
        <div class="vf-docs-demo-chart__surface vf-docs-demo-chart__surface_scatter">
            <div class="vf-docs-demo-chart__scatter">${points}</div>
            <div class="vf-docs-demo-chart__legend-row">${legends}</div>
        </div>
    `;
};

const renderDemoBarChart = (labels: unknown[], datasets: Array<Record<string, unknown>>) => {
    const values = datasets.flatMap(dataset =>
        Array.isArray(dataset.data) ? dataset.data.map(entry => Number(entry) || 0) : [],
    );
    const maxValue = Math.max(1, ...values);

    const rows = labels
        .map((label, index) => {
            const bars = datasets
                .map((dataset, datasetIndex) => {
                    const data = Array.isArray(dataset.data) ? dataset.data : [];
                    const value = Number(data[index] ?? 0) || 0;
                    const hue = (datasetIndex * 97) % 360;
                    const height = `${Math.max(10, (value / maxValue) * 100)}%`;
                    return `<span class="vf-docs-demo-chart__bar" style="height:${height};--vf-docs-demo-chart-bar:hsl(${hue} 70% 58% / 0.75)"></span>`;
                })
                .join('');

            return `<div class="vf-docs-demo-chart__group"><div class="vf-docs-demo-chart__bars">${bars}</div><span class="vf-docs-demo-chart__label">${String(label)}</span></div>`;
        })
        .join('');

    return `
        <div class="vf-docs-demo-chart__surface">
            <div class="vf-docs-demo-chart__plot">${rows}</div>
        </div>
    `;
};

const renderDemoChart = (canvas: HTMLCanvasElement, config: DemoChartConfig) => {
    const host = ensureDemoChartHost(canvas);
    if (!host) {
        return { host: null, canvas } satisfies DemoChartInstance;
    }

    const labels = config.data?.labels ?? [];
    const datasets = config.data?.datasets ?? [];
    host.innerHTML =
        config.type === 'bubble' || config.type === 'scatter'
            ? renderDemoBubbleChart(datasets)
            : renderDemoBarChart(labels, datasets);

    return { host, canvas } satisfies DemoChartInstance;
};

const createDemoChartAdapter = () => ({
    mount(canvas: HTMLCanvasElement, config: DemoChartConfig) {
        return renderDemoChart(canvas, config);
    },
    update(instance: DemoChartInstance, config: DemoChartConfig) {
        renderDemoChart(instance.canvas, config);
    },
    resize() {},
    destroy(instance: DemoChartInstance) {
        instance.host?.remove();
        instance.canvas.style.display = '';
    },
});

const createDemoCodeEditorAdapter = () => ({
    mount(
        container: HTMLElement,
        config: {
            value: string;
            language?: string;
            theme?: string;
            readonly?: boolean;
            onChange?: (value: string) => void;
        },
    ) {
        const host = document.createElement('textarea');
        host.className = 'vf-docs-demo-editor';
        host.dataset.theme = config.theme ?? 'light';
        host.spellcheck = false;
        host.readOnly = Boolean(config.readonly);
        host.value = config.value || `// ${config.language || 'plaintext'} preview`;
        const onInput =
            typeof config.onChange === 'function'
                ? () => {
                      config.onChange?.(host.value);
                  }
                : undefined;
        if (onInput) {
            host.addEventListener('input', onInput);
        }
        container.replaceChildren(host);
        return {
            host,
            root: container,
            value: host.value,
            onInput,
        } satisfies DemoCodeEditorInstance;
    },
    update(instance: DemoCodeEditorInstance, config: { value: string; theme?: string; readonly?: boolean }) {
        instance.value = config.value;
        if (instance.host) {
            if (instance.host.value !== config.value) {
                instance.host.value = config.value;
            }
            instance.host.dataset.theme = config.theme ?? 'light';
            instance.host.readOnly = Boolean(config.readonly);
        }
    },
    setValue(instance: DemoCodeEditorInstance, value: string) {
        instance.value = value;
        if (instance.host) {
            instance.host.value = value;
        }
    },
    setReadonly(instance: DemoCodeEditorInstance, readonly: boolean) {
        if (instance.host) {
            instance.host.readOnly = readonly;
        }
    },
    setTheme(instance: DemoCodeEditorInstance, theme: string) {
        if (instance.host) {
            instance.host.dataset.theme = theme;
        }
    },
    focus(instance: DemoCodeEditorInstance) {
        instance.host?.focus();
    },
    destroy(instance: DemoCodeEditorInstance) {
        if (instance.host && instance.onInput) {
            instance.host.removeEventListener('input', instance.onInput);
        }
        instance.root.replaceChildren();
    },
});

const DocsPreviewBottomSheet = markRaw({
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '',
        },
        overlay: {
            type: Boolean,
            default: true,
        },
        closeOnOverlay: {
            type: Boolean,
            default: true,
        },
        showClose: {
            type: Boolean,
            default: true,
        },
        size: {
            type: String,
            default: 'md',
        },
    },
    emits: ['update:modelValue', 'open', 'close'],
    setup(
        props: {
            modelValue: boolean;
            title: string;
            overlay: boolean;
            closeOnOverlay: boolean;
            showClose: boolean;
            size: string;
        },
        {
            emit,
            slots,
        }: {
            emit: (event: 'update:modelValue' | 'close', value?: boolean) => void;
            slots: VueRuntime.SetupContext['slots'];
        },
    ) {
        const close = () => {
            emit('update:modelValue', false);
            emit('close');
        };

        return () =>
            props.modelValue
                ? VueRuntime.h('div', { class: 'vf-bottom-sheet vf-bottom-sheet_preview', role: 'presentation' }, [
                      props.overlay
                          ? VueRuntime.h('div', {
                                class: 'vf-bottom-sheet__overlay',
                                onClick: () => {
                                    if (props.closeOnOverlay) {
                                        close();
                                    }
                                },
                            })
                          : null,
                      VueRuntime.h(
                          'div',
                          {
                              class: ['vf-bottom-sheet__panel', `vf-bottom-sheet__panel_${props.size || 'md'}`],
                              role: 'dialog',
                              'aria-modal': 'true',
                          },
                          [
                              VueRuntime.h('div', { class: 'vf-bottom-sheet__handle', 'aria-hidden': 'true' }),
                              props.title || slots.header || props.showClose
                                  ? VueRuntime.h('div', { class: 'vf-bottom-sheet__header' }, [
                                        VueRuntime.h(
                                            'div',
                                            { class: 'vf-bottom-sheet__header-content' },
                                            slots.header?.() ??
                                                (props.title
                                                    ? [
                                                          VueRuntime.h(
                                                              'h3',
                                                              { class: 'vf-bottom-sheet__title' },
                                                              props.title,
                                                          ),
                                                      ]
                                                    : []),
                                        ),
                                        props.showClose
                                            ? VueRuntime.h(
                                                  'button',
                                                  {
                                                      type: 'button',
                                                      class: 'vf-bottom-sheet__close',
                                                      'aria-label': 'Close',
                                                      onClick: close,
                                                  },
                                                  'x',
                                              )
                                            : null,
                                    ])
                                  : null,
                              slots.body || slots.default
                                  ? VueRuntime.h(
                                        'div',
                                        { class: 'vf-bottom-sheet__body' },
                                        slots.body?.() ?? slots.default?.(),
                                    )
                                  : null,
                              slots.footer
                                  ? VueRuntime.h('div', { class: 'vf-bottom-sheet__footer' }, slots.footer())
                                  : null,
                          ],
                      ),
                  ])
                : null;
    },
});

const DocsPreviewModal = markRaw({
    props: {
        modelValue: { type: Boolean, default: false },
        title: { type: String, default: '' },
        closeOnOverlay: { type: Boolean, default: true },
        showClose: { type: Boolean, default: true },
        size: { type: String, default: 'md' },
    },
    emits: ['update:modelValue', 'close'],
    setup(
        props: { modelValue: boolean; title: string; closeOnOverlay: boolean; showClose: boolean; size: string },
        {
            emit,
            slots,
        }: {
            emit: (event: 'update:modelValue' | 'close', value?: boolean) => void;
            slots: VueRuntime.SetupContext['slots'];
        },
    ) {
        const close = () => {
            emit('update:modelValue', false);
            emit('close');
        };

        return () =>
            props.modelValue
                ? VueRuntime.h(
                      'div',
                      {
                          class: [
                              'vf-modal',
                              props.size !== 'md' ? `vf-modal_${props.size}` : null,
                              'vf-modal_preview',
                          ],
                      },
                      [
                          VueRuntime.h('div', {
                              class: 'vf-modal__overlay',
                              onClick: () => {
                                  if (props.closeOnOverlay) close();
                              },
                          }),
                          VueRuntime.h('div', { class: 'vf-modal__panel', role: 'dialog', 'aria-modal': 'true' }, [
                              props.title || slots.header
                                  ? VueRuntime.h('div', { class: 'vf-modal__header' }, [
                                        VueRuntime.h(
                                            'div',
                                            { class: 'vf-modal__header-content' },
                                            slots.header?.() ??
                                                (props.title
                                                    ? [VueRuntime.h('h3', { class: 'vf-modal__title' }, props.title)]
                                                    : []),
                                        ),
                                    ])
                                  : null,
                              props.showClose
                                  ? VueRuntime.h(
                                        'button',
                                        {
                                            type: 'button',
                                            class: 'vf-modal__close',
                                            'aria-label': 'Close',
                                            onClick: close,
                                        },
                                        'x',
                                    )
                                  : null,
                              slots.body || slots.default
                                  ? VueRuntime.h(
                                        'div',
                                        { class: 'vf-modal__body' },
                                        slots.body?.() ?? slots.default?.(),
                                    )
                                  : null,
                              slots.footer ? VueRuntime.h('div', { class: 'vf-modal__footer' }, slots.footer()) : null,
                          ]),
                      ],
                  )
                : null;
    },
});

const DocsPreviewDrawer = markRaw({
    props: {
        modelValue: { type: Boolean, default: false },
        title: { type: String, default: '' },
        position: { type: String, default: 'right' },
        overlay: { type: Boolean, default: true },
        closeOnOverlay: { type: Boolean, default: true },
        showClose: { type: Boolean, default: true },
        size: { type: String, default: 'md' },
    },
    emits: ['update:modelValue', 'close'],
    setup(
        props: {
            modelValue: boolean;
            title: string;
            position: string;
            overlay: boolean;
            closeOnOverlay: boolean;
            showClose: boolean;
            size: string;
        },
        {
            emit,
            slots,
        }: {
            emit: (event: 'update:modelValue' | 'close', value?: boolean) => void;
            slots: VueRuntime.SetupContext['slots'];
        },
    ) {
        const close = () => {
            emit('update:modelValue', false);
            emit('close');
        };

        return () =>
            props.modelValue
                ? VueRuntime.h(
                      'div',
                      {
                          class: [
                              'vf-drawer',
                              `vf-drawer_${props.position || 'right'}`,
                              props.size !== 'md' ? `vf-drawer_${props.size}` : null,
                              'vf-drawer_preview',
                          ],
                      },
                      [
                          props.overlay
                              ? VueRuntime.h('div', {
                                    class: 'vf-drawer__overlay',
                                    onClick: () => {
                                        if (props.closeOnOverlay) close();
                                    },
                                })
                              : null,
                          VueRuntime.h('div', { class: 'vf-drawer__panel', role: 'dialog', 'aria-modal': 'true' }, [
                              props.title || slots.header
                                  ? VueRuntime.h('div', { class: 'vf-drawer__header' }, [
                                        VueRuntime.h(
                                            'div',
                                            { class: 'vf-drawer__header-content' },
                                            slots.header?.() ??
                                                (props.title
                                                    ? [VueRuntime.h('h3', { class: 'vf-drawer__title' }, props.title)]
                                                    : []),
                                        ),
                                    ])
                                  : null,
                              props.showClose
                                  ? VueRuntime.h(
                                        'button',
                                        {
                                            type: 'button',
                                            class: 'vf-drawer__close',
                                            'aria-label': 'Close',
                                            onClick: close,
                                        },
                                        'x',
                                    )
                                  : null,
                              slots.body || slots.default
                                  ? VueRuntime.h(
                                        'div',
                                        { class: 'vf-drawer__body' },
                                        slots.body?.() ?? slots.default?.(),
                                    )
                                  : null,
                              slots.footer ? VueRuntime.h('div', { class: 'vf-drawer__footer' }, slots.footer()) : null,
                          ]),
                      ],
                  )
                : null;
    },
});

const DocsPreviewConfirmDialog = markRaw({
    props: {
        modelValue: { type: Boolean, default: false },
        title: { type: String, default: 'Confirm action' },
        message: { type: String, default: '' },
        confirmLabel: { type: String, default: 'Confirm' },
        cancelLabel: { type: String, default: 'Cancel' },
        confirmSeverity: { type: String, default: 'danger' },
        loading: { type: Boolean, default: false },
        closeOnConfirm: { type: Boolean, default: true },
        closeOnOverlay: { type: Boolean, default: true },
        showClose: { type: Boolean, default: true },
        size: { type: String, default: 'sm' },
    },
    emits: ['update:modelValue', 'confirm', 'cancel', 'close'],
    setup(
        props: {
            modelValue: boolean;
            title: string;
            message: string;
            confirmLabel: string;
            cancelLabel: string;
            confirmSeverity: string;
            loading: boolean;
            closeOnConfirm: boolean;
            closeOnOverlay: boolean;
            showClose: boolean;
            size: string;
        },
        {
            emit,
            slots,
        }: {
            emit: (event: 'update:modelValue' | 'confirm' | 'cancel' | 'close', value?: boolean) => void;
            slots: VueRuntime.SetupContext['slots'];
        },
    ) {
        const close = (reason: 'cancel' | 'confirm') => {
            emit('update:modelValue', false);
            emit('close');
            emit(reason);
        };

        const confirm = () => {
            if (props.loading) {
                return;
            }

            emit('confirm');

            if (props.closeOnConfirm) {
                close('confirm');
            }
        };

        const cancel = () => {
            close('cancel');
        };

        return () =>
            props.modelValue
                ? VueRuntime.h(
                      DocsPreviewModal,
                      {
                          modelValue: props.modelValue,
                          title: props.title,
                          size: props.size,
                          closeOnOverlay: props.closeOnOverlay,
                          showClose: props.showClose,
                          class: 'vf-confirm-dialog',
                          'onUpdate:modelValue': (value: boolean) => emit('update:modelValue', value),
                          onClose: () => emit('close'),
                      },
                      {
                          body: () =>
                              VueRuntime.h(
                                  'div',
                                  { class: 'vf-confirm-dialog__message' },
                                  slots.default?.() ?? props.message,
                              ),
                          footer: () =>
                              VueRuntime.h('div', { class: 'vf-confirm-dialog__actions' }, [
                                  slots.actions?.({ confirm, cancel }) ?? [
                                      VueRuntime.h(exampleComponents.Button ?? 'button', {
                                          class: 'vf-confirm-dialog__cancel',
                                          label: props.cancelLabel,
                                          variant: 'outlined',
                                          severity: 'secondary',
                                          disabled: props.loading,
                                          onClick: cancel,
                                      }),
                                      VueRuntime.h(exampleComponents.Button ?? 'button', {
                                          class: 'vf-confirm-dialog__confirm',
                                          label: props.confirmLabel,
                                          severity: props.confirmSeverity,
                                          loading: props.loading,
                                          onClick: confirm,
                                      }),
                                  ],
                              ]),
                      },
                  )
                : null;
    },
});

const DocsPreviewConfirmPopup = markRaw({
    props: {
        modelValue: { type: Boolean, default: undefined },
        title: { type: String, default: '' },
        message: { type: String, default: '' },
        confirmLabel: { type: String, default: 'Confirm' },
        cancelLabel: { type: String, default: 'Cancel' },
        confirmSeverity: { type: String, default: 'danger' },
        placement: { type: String, default: 'bottom' },
        disabled: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        closeOnConfirm: { type: Boolean, default: true },
        closeOnCancel: { type: Boolean, default: true },
    },
    emits: ['update:modelValue', 'confirm', 'accept', 'cancel', 'reject', 'show', 'hide', 'onShow', 'onHide'],
    setup(
        props: {
            modelValue?: boolean;
            title: string;
            message: string;
            confirmLabel: string;
            cancelLabel: string;
            confirmSeverity: string;
            placement: string;
            disabled: boolean;
            loading: boolean;
            closeOnConfirm: boolean;
            closeOnCancel: boolean;
        },
        {
            emit,
            slots,
        }: {
            emit: (
                event:
                    | 'update:modelValue'
                    | 'confirm'
                    | 'accept'
                    | 'cancel'
                    | 'reject'
                    | 'show'
                    | 'hide'
                    | 'onShow'
                    | 'onHide',
                value?: boolean,
            ) => void;
            slots: VueRuntime.SetupContext['slots'];
        },
    ) {
        const internalOpen = VueRuntime.ref(Boolean(props.modelValue));
        const isControlled = VueRuntime.computed(() => props.modelValue !== undefined);
        const isOpen = VueRuntime.computed(() => (isControlled.value ? Boolean(props.modelValue) : internalOpen.value));
        const isTopPlacement = VueRuntime.computed(() => /^top/i.test(props.placement));
        const isEndPlacement = VueRuntime.computed(() => /-end$/i.test(props.placement));

        VueRuntime.watch(
            () => props.modelValue,
            value => {
                if (value !== undefined) {
                    internalOpen.value = Boolean(value);
                }
            },
        );

        const setOpen = (value: boolean) => {
            if (props.disabled) {
                return;
            }

            if (!isControlled.value) {
                internalOpen.value = value;
            }

            emit('update:modelValue', value);
            emit(value ? 'show' : 'hide');
            emit(value ? 'onShow' : 'onHide');
        };

        const toggle = () => setOpen(!isOpen.value);

        const confirm = () => {
            if (props.disabled || props.loading) {
                return;
            }

            emit('confirm');
            emit('accept');

            if (props.closeOnConfirm) {
                setOpen(false);
            }
        };

        const cancel = () => {
            if (props.disabled) {
                return;
            }

            emit('cancel');
            emit('reject');

            if (props.closeOnCancel) {
                setOpen(false);
            }
        };

        return () =>
            VueRuntime.h(
                'div',
                {
                    class: [
                        'vf-popover',
                        'vf-confirm-popup',
                        'vf-confirm-popup_preview',
                        {
                            'vf-popover_disabled': props.disabled,
                            'is-open': isOpen.value,
                            'is-top': isTopPlacement.value,
                            'is-end': isEndPlacement.value,
                        },
                    ],
                },
                [
                    VueRuntime.h(
                        'div',
                        {
                            class: 'vf-popover__button',
                            role: 'button',
                            tabindex: props.disabled ? -1 : 0,
                            'aria-haspopup': 'dialog',
                            'aria-expanded': String(isOpen.value),
                            onClick: toggle,
                        },
                        slots.trigger?.() ?? [
                            VueRuntime.h(exampleComponents.Button ?? 'button', {
                                label: props.title || 'Open confirmation',
                                severity: props.confirmSeverity,
                            }),
                        ],
                    ),
                    isOpen.value
                        ? VueRuntime.h('div', { class: 'vf-confirm-popup__inline' }, [
                              VueRuntime.h(
                                  'div',
                                  { class: 'vf-popover__wrapper', role: 'dialog', 'data-placement': props.placement },
                                  [
                                      VueRuntime.h('div', { class: 'vf-confirm-popup__body' }, [
                                          slots.default?.() ?? [
                                              props.title
                                                  ? VueRuntime.h(
                                                        'div',
                                                        { class: 'vf-confirm-popup__title' },
                                                        props.title,
                                                    )
                                                  : null,
                                              VueRuntime.h(
                                                  'div',
                                                  { class: 'vf-confirm-popup__message' },
                                                  props.message,
                                              ),
                                          ],
                                      ]),
                                      VueRuntime.h('div', { class: 'vf-confirm-popup__actions' }, [
                                          slots.actions?.({ confirm, cancel }) ?? [
                                              VueRuntime.h(exampleComponents.Button ?? 'button', {
                                                  class: 'vf-confirm-popup__cancel',
                                                  label: props.cancelLabel,
                                                  variant: 'outlined',
                                                  severity: 'secondary',
                                                  disabled: props.disabled || props.loading,
                                                  onClick: cancel,
                                              }),
                                              VueRuntime.h(exampleComponents.Button ?? 'button', {
                                                  class: 'vf-confirm-popup__confirm',
                                                  label: props.confirmLabel,
                                                  severity: props.confirmSeverity,
                                                  loading: props.loading,
                                                  disabled: props.disabled,
                                                  onClick: confirm,
                                              }),
                                          ],
                                      ]),
                                      VueRuntime.h('div', { class: 'vf-popover__arrow', 'aria-hidden': 'true' }),
                                  ],
                              ),
                          ])
                        : null,
                ],
            );
    },
});

const DocsPreviewContextMenu = markRaw({
    props: {
        modelValue: { type: Boolean, default: undefined },
        items: { type: Array, default: () => [] },
        disabled: { type: Boolean, default: false },
        closeOnSelect: { type: Boolean, default: true },
        closeOnEsc: { type: Boolean, default: true },
    },
    emits: ['update:modelValue', 'open', 'close', 'select', 'contextmenu'],
    setup(
        props: {
            modelValue?: boolean;
            items: Array<Record<string, unknown>>;
            disabled: boolean;
            closeOnSelect: boolean;
            closeOnEsc: boolean;
        },
        {
            emit,
            slots,
        }: {
            emit: (event: 'update:modelValue' | 'open' | 'close' | 'select' | 'contextmenu', value?: unknown) => void;
            slots: VueRuntime.SetupContext['slots'];
        },
    ) {
        const internalOpen = VueRuntime.ref(Boolean(props.modelValue));
        const isControlled = VueRuntime.computed(() => props.modelValue !== undefined);
        const isOpen = VueRuntime.computed(() => (isControlled.value ? Boolean(props.modelValue) : internalOpen.value));

        VueRuntime.watch(
            () => props.modelValue,
            value => {
                if (value !== undefined) {
                    internalOpen.value = Boolean(value);
                }
            },
        );

        const setOpen = (value: boolean) => {
            if (props.disabled) {
                return;
            }

            if (!isControlled.value) {
                internalOpen.value = value;
            }

            emit('update:modelValue', value);
            emit(value ? 'open' : 'close');
        };

        const openMenu = (event?: MouseEvent | KeyboardEvent) => {
            if (props.disabled) {
                return;
            }

            if (event instanceof MouseEvent) {
                event.preventDefault();
            }

            emit('contextmenu', event);
            setOpen(true);
        };

        const closeMenu = () => {
            setOpen(false);
        };

        const onTriggerKeydown = (event: KeyboardEvent) => {
            if (props.disabled) {
                return;
            }

            if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
                event.preventDefault();
                openMenu(event);
                return;
            }

            if (event.key === 'Escape' && props.closeOnEsc && isOpen.value) {
                event.preventDefault();
                closeMenu();
            }
        };

        const onPanelClick = (event: MouseEvent) => {
            emit('select', event);

            if (!props.closeOnSelect) {
                return;
            }

            const target = event.target as HTMLElement | null;
            if (!target) {
                return;
            }

            if (target.closest('.vf-menu__parent')) {
                return;
            }

            if (target.closest('.vf-menu__link') || target.closest('[data-context-menu-close]')) {
                closeMenu();
            }
        };

        return () =>
            VueRuntime.h(
                'div',
                {
                    class: [
                        'vf-context-menu',
                        'vf-context-menu_preview',
                        { 'vf-context-menu_disabled': props.disabled },
                    ],
                    tabindex: props.disabled ? -1 : 0,
                    onContextmenu: openMenu,
                    onKeydown: onTriggerKeydown,
                },
                [
                    slots.default?.(),
                    isOpen.value
                        ? VueRuntime.h(
                              'div',
                              {
                                  class: 'vf-context-menu__panel',
                                  role: 'menu',
                                  onClick: onPanelClick,
                              },
                              slots.menu?.() ?? [
                                  props.items.length
                                      ? VueRuntime.h(exampleComponents.Menu ?? 'div', {
                                            items: props.items,
                                        })
                                      : null,
                              ],
                          )
                        : null,
                ],
            );
    },
});

const DocsPreviewNotificationCenter = markRaw({
    props: {
        modelValue: { type: Boolean, default: false },
        items: { type: Array, default: () => [] },
        title: { type: String, default: 'Notifications' },
        showFilters: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'update:items', 'close'],
    setup(
        props: { modelValue: boolean; items: Array<Record<string, unknown>>; title: string; showFilters: boolean },
        {
            emit,
            slots,
        }: {
            emit: (
                event: 'update:modelValue' | 'update:items' | 'close',
                value?: boolean | Array<Record<string, unknown>>,
            ) => void;
            slots: VueRuntime.SetupContext['slots'];
        },
    ) {
        const close = () => {
            emit('update:modelValue', false);
            emit('close');
        };
        const toggleRead = (id: string | number) => {
            emit(
                'update:items',
                props.items.map(item => (item.id === id ? { ...item, read: !item.read } : item)),
            );
        };

        return () =>
            props.modelValue
                ? VueRuntime.h('div', { class: 'vf-notification-center vf-notification-center_preview' }, [
                      VueRuntime.h('div', { class: 'vf-notification-center__overlay' }),
                      VueRuntime.h(
                          'section',
                          { class: 'vf-notification-center__panel', role: 'dialog', 'aria-modal': 'true' },
                          [
                              VueRuntime.h('header', { class: 'vf-notification-center__header' }, [
                                  VueRuntime.h('div', { class: 'vf-notification-center__title-wrap' }, [
                                      VueRuntime.h('h3', { class: 'vf-notification-center__title' }, props.title),
                                  ]),
                                  VueRuntime.h('div', { class: 'vf-notification-center__header-actions' }, [
                                      VueRuntime.h(
                                          'button',
                                          { type: 'button', class: 'vf-notification-center__close', onClick: close },
                                          'x',
                                      ),
                                  ]),
                              ]),
                              VueRuntime.h('div', { class: 'vf-notification-center__body' }, [
                                  props.showFilters
                                      ? VueRuntime.h(
                                            'div',
                                            { class: 'vf-notification-center__filters', role: 'tablist' },
                                            [
                                                VueRuntime.h(
                                                    'button',
                                                    {
                                                        type: 'button',
                                                        class: ['vf-notification-center__filter', 'is-active'],
                                                    },
                                                    'All',
                                                ),
                                                VueRuntime.h(
                                                    'button',
                                                    { type: 'button', class: 'vf-notification-center__filter' },
                                                    'Unread',
                                                ),
                                                VueRuntime.h(
                                                    'button',
                                                    { type: 'button', class: 'vf-notification-center__filter' },
                                                    'Read',
                                                ),
                                            ],
                                        )
                                      : null,
                                  props.items.length
                                      ? VueRuntime.h(
                                            'ul',
                                            { class: 'vf-notification-center__list' },
                                            props.items.map((item, index) =>
                                                VueRuntime.h(
                                                    'li',
                                                    {
                                                        key: String(item.id ?? index),
                                                        class: [
                                                            'vf-notification-center__item',
                                                            { 'is-unread': !item.read },
                                                        ],
                                                    },
                                                    [
                                                        slots.item
                                                            ? slots.item({
                                                                  item,
                                                                  index,
                                                                  toggleRead: () =>
                                                                      toggleRead(item.id as string | number),
                                                              })
                                                            : [
                                                                  VueRuntime.h(
                                                                      'button',
                                                                      {
                                                                          type: 'button',
                                                                          class: 'vf-notification-center__item-main',
                                                                      },
                                                                      [
                                                                          VueRuntime.h(
                                                                              'span',
                                                                              {
                                                                                  class: 'vf-notification-center__avatar',
                                                                                  'aria-hidden': 'true',
                                                                              },
                                                                              String(item.title ?? '?').slice(0, 1),
                                                                          ),
                                                                          VueRuntime.h(
                                                                              'span',
                                                                              {
                                                                                  class: 'vf-notification-center__content',
                                                                              },
                                                                              [
                                                                                  VueRuntime.h(
                                                                                      'span',
                                                                                      {
                                                                                          class: 'vf-notification-center__item-title',
                                                                                      },
                                                                                      String(
                                                                                          item.title ?? 'Notification',
                                                                                      ),
                                                                                  ),
                                                                                  item.message
                                                                                      ? VueRuntime.h(
                                                                                            'span',
                                                                                            {
                                                                                                class: 'vf-notification-center__item-message',
                                                                                            },
                                                                                            String(item.message),
                                                                                        )
                                                                                      : null,
                                                                              ],
                                                                          ),
                                                                      ],
                                                                  ),
                                                              ],
                                                        VueRuntime.h(
                                                            'button',
                                                            {
                                                                type: 'button',
                                                                class: 'vf-notification-center__toggle',
                                                                onClick: () => toggleRead(item.id as string | number),
                                                            },
                                                            item.read ? 'Unread' : 'Read',
                                                        ),
                                                    ],
                                                ),
                                            ),
                                        )
                                      : VueRuntime.h(
                                            'p',
                                            { class: 'vf-notification-center__empty' },
                                            'No notifications',
                                        ),
                              ]),
                          ],
                      ),
                  ])
                : null;
    },
});

const DocsPreviewTour = markRaw({
    props: {
        modelValue: { type: Boolean, default: false },
        steps: { type: Array, default: () => [] },
        showSkip: { type: Boolean, default: true },
        showProgress: { type: Boolean, default: true },
        ariaLabel: { type: String, default: 'Tour' },
    },
    emits: ['update:modelValue', 'close'],
    setup(
        props: {
            modelValue: boolean;
            steps: Array<Record<string, unknown>>;
            showSkip: boolean;
            showProgress: boolean;
            ariaLabel: string;
        },
        { slots }: { slots: VueRuntime.SetupContext['slots'] },
    ) {
        const activeIndex = 0;
        const step = props.steps[activeIndex];

        return () =>
            props.modelValue
                ? VueRuntime.h('div', { class: 'vf-tour vf-tour_preview' }, [
                      VueRuntime.h('div', { class: 'vf-tour__overlay' }),
                      VueRuntime.h(
                          'div',
                          {
                              class: 'vf-tour__panel',
                              role: 'dialog',
                              'aria-modal': 'true',
                              'aria-label': props.ariaLabel,
                          },
                          [
                              step?.title || slots.title
                                  ? VueRuntime.h(
                                        'div',
                                        { class: 'vf-tour__title' },
                                        slots.title?.({ step, index: activeIndex }) ?? String(step?.title ?? 'Step'),
                                    )
                                  : null,
                              step?.content || slots.default
                                  ? VueRuntime.h(
                                        'div',
                                        { class: 'vf-tour__content' },
                                        slots.default?.({ step, index: activeIndex }) ?? String(step?.content ?? ''),
                                    )
                                  : null,
                              props.showProgress
                                  ? VueRuntime.h(
                                        'div',
                                        { class: 'vf-tour__progress' },
                                        `1 / ${Math.max(1, props.steps.length)}`,
                                    )
                                  : null,
                              VueRuntime.h(
                                  'div',
                                  { class: 'vf-tour__actions' },
                                  slots.actions?.({
                                      step,
                                      index: activeIndex,
                                      isFirst: true,
                                      isLast: props.steps.length <= 1,
                                      prev: () => {},
                                      next: () => {},
                                      skip: () => {},
                                  }) ?? [
                                      props.showSkip
                                          ? VueRuntime.h(
                                                'button',
                                                {
                                                    type: 'button',
                                                    class: ['vf-tour__button', 'vf-tour__button_secondary'],
                                                },
                                                'Skip',
                                            )
                                          : null,
                                      VueRuntime.h(
                                          'button',
                                          {
                                              type: 'button',
                                              class: ['vf-tour__button', 'vf-tour__button_secondary'],
                                              disabled: true,
                                          },
                                          'Back',
                                      ),
                                      VueRuntime.h(
                                          'button',
                                          { type: 'button', class: ['vf-tour__button', 'vf-tour__button_primary'] },
                                          props.steps.length <= 1 ? 'Finish' : 'Next',
                                      ),
                                  ],
                              ),
                          ],
                      ),
                  ])
                : null;
    },
});

const DocsPreviewCommandPalette = markRaw({
    props: {
        modelValue: { type: Boolean, default: false },
        items: { type: Array, default: () => [] },
        scope: { type: String, default: 'all' },
        scopes: { type: Array, default: () => [] },
        placeholder: { type: String, default: 'Search commands' },
        emptyText: { type: String, default: 'No commands found' },
        showScopeTabs: { type: Boolean, default: true },
    },
    setup(props: {
        modelValue: boolean;
        items: Array<Record<string, unknown>>;
        scope: string;
        scopes: Array<Record<string, unknown>>;
        placeholder: string;
        emptyText: string;
        showScopeTabs: boolean;
    }) {
        const scopeOptions = [{ id: 'all', label: 'All' }, ...props.scopes];
        const groups = Array.from(
            props.items.reduce((map, item) => {
                const groupName = String(item.group ?? '');
                if (!map.has(groupName)) {
                    map.set(groupName, []);
                }
                map.get(groupName)?.push(item);
                return map;
            }, new Map<string, Array<Record<string, unknown>>>()),
        );

        return () =>
            props.modelValue
                ? VueRuntime.h('div', { class: 'vf-command-palette vf-command-palette_preview' }, [
                      VueRuntime.h('div', { class: 'vf-command-palette__overlay' }),
                      VueRuntime.h(
                          'div',
                          { class: 'vf-command-palette__panel', role: 'dialog', 'aria-modal': 'true' },
                          [
                              VueRuntime.h('div', { class: 'vf-command-palette__header' }, [
                                  VueRuntime.h('input', {
                                      class: 'vf-command-palette__input',
                                      type: 'text',
                                      value: '',
                                      placeholder: props.placeholder,
                                  }),
                                  props.showScopeTabs && scopeOptions.length > 1
                                      ? VueRuntime.h(
                                            'div',
                                            { class: 'vf-command-palette__scopes', role: 'tablist' },
                                            scopeOptions.map(scopeOption =>
                                                VueRuntime.h(
                                                    'button',
                                                    {
                                                        type: 'button',
                                                        class: [
                                                            'vf-command-palette__scope',
                                                            { 'is-active': scopeOption.id === props.scope },
                                                        ],
                                                    },
                                                    String(scopeOption.label ?? scopeOption.id),
                                                ),
                                            ),
                                        )
                                      : null,
                              ]),
                              VueRuntime.h(
                                  'div',
                                  { class: 'vf-command-palette__list', role: 'listbox' },
                                  groups.length
                                      ? groups.flatMap(([name, items], groupIndex) => [
                                            name
                                                ? VueRuntime.h(
                                                      'div',
                                                      {
                                                          key: `label-${groupIndex}`,
                                                          class: 'vf-command-palette__group-label',
                                                      },
                                                      name,
                                                  )
                                                : null,
                                            ...items.map((item, itemIndex) =>
                                                VueRuntime.h(
                                                    'button',
                                                    {
                                                        key: `${groupIndex}-${itemIndex}`,
                                                        type: 'button',
                                                        class: [
                                                            'vf-command-palette__item',
                                                            { 'is-active': itemIndex === 0 && groupIndex === 0 },
                                                        ],
                                                    },
                                                    [
                                                        VueRuntime.h(
                                                            'div',
                                                            { class: 'vf-command-palette__item-main' },
                                                            [
                                                                VueRuntime.h(
                                                                    'span',
                                                                    { class: 'vf-command-palette__item-label' },
                                                                    String(item.label ?? 'Command'),
                                                                ),
                                                                item.shortcut
                                                                    ? VueRuntime.h(
                                                                          'span',
                                                                          {
                                                                              class: 'vf-command-palette__item-shortcut',
                                                                          },
                                                                          String(item.shortcut),
                                                                      )
                                                                    : null,
                                                            ],
                                                        ),
                                                        item.description
                                                            ? VueRuntime.h(
                                                                  'span',
                                                                  { class: 'vf-command-palette__item-description' },
                                                                  String(item.description),
                                                              )
                                                            : null,
                                                        item.entityType
                                                            ? VueRuntime.h(
                                                                  'span',
                                                                  { class: 'vf-command-palette__item-entity' },
                                                                  String(item.entityType),
                                                              )
                                                            : null,
                                                    ],
                                                ),
                                            ),
                                        ])
                                      : [VueRuntime.h('div', { class: 'vf-command-palette__empty' }, props.emptyText)],
                              ),
                          ],
                      ),
                  ])
                : null;
    },
});

const htmlTagNames = new Set([
    'a',
    'article',
    'aside',
    'button',
    'code',
    'div',
    'em',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'img',
    'input',
    'label',
    'li',
    'main',
    'nav',
    'ol',
    'option',
    'p',
    'pre',
    'section',
    'select',
    'small',
    'span',
    'strong',
    'table',
    'tbody',
    'td',
    'template',
    'textarea',
    'th',
    'thead',
    'time',
    'tr',
    'ul',
]);

const createDocsStubComponent = (name: string) =>
    markRaw({
        props: {
            step: {
                type: [String, Number],
                default: '',
            },
        },
        template: `
            <div class="vf-docs-demo-stub" :data-component="name">
                <strong class="vf-docs-demo-stub__title">{{ label }}</strong>
                <span v-if="step" class="vf-docs-demo-stub__meta">{{ step }}</span>
                <slot />
            </div>
        `,
        setup(props: { step: string | number }) {
            return {
                name,
                label: name.replace(/([a-z0-9])([A-Z])/g, '$1 $2'),
                step: props.step,
            };
        },
    });

const createUnknownExampleComponents = (template: string): Record<string, object> =>
    Object.fromEntries(
        Array.from(
            new Set(
                [...template.matchAll(/<\/?([A-Z][A-Za-z0-9]*)\b/g)]
                    .map(match => match[1])
                    .filter(tagName => !exampleComponents[tagName] && !htmlTagNames.has(tagName.toLowerCase())),
            ),
        ).map(tagName => [tagName, createDocsStubComponent(tagName)]),
    );

const previewScriptHelpers = {
    ref: VueRuntime.ref,
    computed: VueRuntime.computed,
    reactive: VueRuntime.reactive,
    createChartJsAdapter: () => createDemoChartAdapter(),
    createMonacoAdapter: () => createDemoCodeEditorAdapter(),
    createCodeMirrorAdapter: () => createDemoCodeEditorAdapter(),
    ChartJs: {},
    monaco: {},
    console,
};

const kebabToCamelCase = (value: string): string =>
    value.replace(/-([a-z])/g, (_, character: string) => character.toUpperCase());

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

const definitionContainsType = (definition: unknown, targetType: unknown): boolean => {
    if (definition === targetType) {
        return true;
    }

    if (Array.isArray(definition)) {
        return definition.includes(targetType);
    }

    if (definition && typeof definition === 'object' && 'type' in (definition as Record<string, unknown>)) {
        const typeDefinition = (definition as { type?: unknown }).type;
        return typeDefinition === targetType || (Array.isArray(typeDefinition) && typeDefinition.includes(targetType));
    }

    return false;
};

const getPreviewSpecificComponents = (): Record<string, object> => ({
    BottomSheet: DocsPreviewBottomSheet,
    Modal: DocsPreviewModal,
    Drawer: DocsPreviewDrawer,
    ConfirmDialog: DocsPreviewConfirmDialog,
    ConfirmPopup: DocsPreviewConfirmPopup,
    ContextMenu: DocsPreviewContextMenu,
    NotificationCenter: DocsPreviewNotificationCenter,
    Tour: DocsPreviewTour,
    CommandPalette: DocsPreviewCommandPalette,
});

const getPreviewComponentDefinition = (tagName: string): { props?: Record<string, unknown> } | undefined =>
    (getPreviewSpecificComponents()[tagName] ?? exampleComponents[tagName]) as
        | { props?: Record<string, unknown> }
        | undefined;

const getComponentNumberProps = (tagName: string): Set<string> => {
    const component = getPreviewComponentDefinition(tagName);
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

const normalizePreviewTemplate = (template: string): string =>
    template.replace(
        /<([A-Z][\w-]*)([\s\S]*?)(\/?)>/g,
        (fullMatch, tagName: string, attributes: string, selfClosing: string) => {
            const numberProps = getComponentNumberProps(tagName);
            let normalizedAttributes = attributes;

            if (numberProps.size) {
                normalizedAttributes = normalizedAttributes.replace(
                    /(^|\s)([A-Za-z_][\w-]*)(\s*=\s*)("(-?(?:\d*\.\d+|\d+))"|'(-?(?:\d*\.\d+|\d+))')/g,
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
            }

            // In docs preview, fullscreen overlays must stay inside the preview card.
            if (tagName === 'BlockUI') {
                normalizedAttributes = normalizedAttributes
                    .replace(/\sfull-screen(?=(\s|>|\/))/gi, ' :full-screen="false"')
                    .replace(/\s:full-screen="\s*true\s*"/gi, ' :full-screen="false"')
                    .replace(/\sfullScreen(?=(\s|>|\/))/gi, ' :full-screen="false"')
                    .replace(/\s:fullScreen="\s*true\s*"/gi, ' :full-screen="false"');
            }

            if (tagName === 'BottomNavigation') {
                normalizedAttributes = normalizedAttributes
                    .replace(/\sfixed(?=(\s|>|\/))/gi, ' :fixed="false"')
                    .replace(/\s:fixed="\s*true\s*"/gi, ' :fixed="false"')
                    .replace(/\smobile-only(?=(\s|>|\/))/gi, ' :mobile-only="false"')
                    .replace(/\s:mobile-only="\s*true\s*"/gi, ' :mobile-only="false"')
                    .replace(/\smobileOnly(?=(\s|>|\/))/gi, ' :mobile-only="false"')
                    .replace(/\s:mobileOnly="\s*true\s*"/gi, ' :mobile-only="false"');

                if (!/\s(?::)?fixed(?=(\s*=|\s|>|\/))/i.test(normalizedAttributes)) {
                    normalizedAttributes += ' :fixed="false"';
                }

                if (!/\s(?::)?mobile(?:-only|Only)(?=(\s*=|\s|>|\/))/i.test(normalizedAttributes)) {
                    normalizedAttributes += ' :mobile-only="false"';
                }
            }

            if (
                /^(Chart|AreaChart|BarChart|BubbleChart|CandlestickChart|DonutChart|FunnelChart|GaugeChart|Heatmap|Histogram|LineChart|PieChart|RadarChart|ScatterChart|Sparkline|TreemapChart)$/.test(
                    tagName,
                )
            ) {
                if (!/\s(?::)?adapter(?=(\s*=|\s|>|\/))/i.test(normalizedAttributes)) {
                    normalizedAttributes += ' :adapter="adapter"';
                }

                normalizedAttributes = normalizedAttributes
                    .replace(/\slazy(?=(\s|>|\/))/gi, ' :lazy="false"')
                    .replace(/\s:lazy="\s*true\s*"/gi, ' :lazy="false"');

                if (!/\s(?::)?lazy(?=(\s*=|\s|>|\/))/i.test(normalizedAttributes)) {
                    normalizedAttributes += ' :lazy="false"';
                }
            }

            return `<${tagName}${normalizedAttributes}${selfClosing}>`;
        },
    );

const extractTemplate = (code: string): string => {
    const trimmed = code.trim();
    const templateMatch = trimmed.match(/<template>([\s\S]*)<\/template>\s*$/i);

    if (templateMatch) {
        return templateMatch[1].trim();
    }

    return trimmed;
};

const extractScriptSetup = (code: string): string => {
    const scriptMatch = code.match(/<script(?:\s+setup)?[^>]*>([\s\S]*?)<\/script>/i);
    return scriptMatch?.[1]?.trim() ?? '';
};

const sanitizePreviewScript = (script: string): string =>
    script
        .replace(/^\s*import[^\n]*\n/gm, '')
        .replace(/\b(ref|computed|reactive)\s*<[\s\S]*?>\s*\(/g, '$1(')
        .trim();

const extractScriptBindingIdentifiers = (script: string): string[] =>
    Array.from(
        new Set(
            [...sanitizePreviewScript(script).matchAll(/\b(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/g)].map(
                match => match[1],
            ),
        ),
    );

const createPreviewScriptBindings = (script: string): Record<string, unknown> => {
    const sanitizedScript = sanitizePreviewScript(script);
    const identifiers = extractScriptBindingIdentifiers(sanitizedScript);

    if (!sanitizedScript || !identifiers.length) {
        return {};
    }

    const bindingsFactory = new Function(
        'helpers',
        `
            const {
                ref,
                computed,
                reactive,
                createChartJsAdapter,
                createMonacoAdapter,
                createCodeMirrorAdapter,
                ChartJs,
                monaco,
                console
            } = helpers;
            ${sanitizedScript}
            return { ${identifiers.join(', ')} };
        `,
    ) as (helpers: typeof previewScriptHelpers) => Record<string, unknown>;

    return bindingsFactory(previewScriptHelpers);
};

const createImplicitPreviewBindings = (template: string): Record<string, unknown> => {
    const bindings: Record<string, unknown> = {};
    const isChartPreview =
        /<(Chart|AreaChart|BarChart|BubbleChart|CandlestickChart|DonutChart|FunnelChart|GaugeChart|Heatmap|Histogram|LineChart|PieChart|RadarChart|ScatterChart|Sparkline|TreemapChart)\b/i.test(
            template,
        );

    if (/<CodeEditor\b/i.test(template)) {
        bindings.adapter = createDemoCodeEditorAdapter();
        return bindings;
    }

    if (isChartPreview) {
        bindings.adapter = createDemoChartAdapter();
        return bindings;
    }

    if (!/\badapter\b/.test(template)) {
        return bindings;
    }

    return bindings;
};

const createTreeItems = () => [
    {
        key: 'workspace',
        label: 'Workspace',
        children: [
            { key: 'overview', label: 'Overview' },
            { key: 'billing', label: 'Billing' },
            { key: 'settings', label: 'Settings' },
        ],
    },
    {
        key: 'reports',
        label: 'Reports',
        children: [{ key: 'revenue', label: 'Revenue' }],
    },
];

const createTreeTableRows = () => [
    {
        key: 'workspace',
        data: { name: 'Workspace', type: 'Folder' },
        children: [
            { key: 'brief', data: { name: 'Brief.pdf', type: 'File' } },
            { key: 'assets', data: { name: 'Assets', type: 'Folder' } },
        ],
    },
];

const createDataTableColumns = () => [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'role', header: 'Role' },
    { field: 'team', header: 'Team' },
    { field: 'age', header: 'Age', align: 'right', sortable: true },
];

const createDataTableRows = () => [
    { id: 1, name: 'Alice', role: 'Developer', team: 'Platform', age: 29 },
    { id: 2, name: 'Bob', role: 'Designer', team: 'Design', age: 34 },
    { id: 3, name: 'Carol', role: 'QA Engineer', team: 'Platform', age: 31 },
];

const createDataViewItems = () => [
    { id: 1, name: 'Starter kit', category: 'Templates', price: '$19' },
    { id: 2, name: 'Admin dashboard', category: 'Layouts', price: '$29' },
    { id: 3, name: 'Analytics pack', category: 'Reports', price: '$39' },
];

const createSchedulerResources = () => [
    { id: 'room-a', label: 'Room A' },
    { id: 'room-b', label: 'Room B' },
];

const createSchedulerEvents = () => [
    {
        id: 'booking-1',
        resourceId: 'room-a',
        title: 'Sprint planning',
        start: '2026-03-07T09:00:00Z',
        end: '2026-03-07T10:00:00Z',
    },
];

const createGenericItemsCollection = () => [
    {
        id: 'item-1',
        key: 'item-1',
        label: 'Overview',
        value: 'overview',
        name: 'Overview',
        title: 'Created',
        description: 'Initial item',
        date: '2026-03-07',
        status: 'info',
        icon: 'house',
        to: '/overview',
    },
    {
        id: 'item-2',
        key: 'item-2',
        label: 'Billing',
        value: 'billing',
        name: 'Billing',
        title: 'In progress',
        description: 'Follow-up item',
        date: '2026-03-08',
        status: 'warn',
        icon: 'magnifyingGlass',
        to: '/billing',
    },
    {
        id: 'item-3',
        key: 'item-3',
        label: 'Settings',
        value: 'settings',
        name: 'Settings',
        title: 'Done',
        description: 'Completed item',
        date: '2026-03-09',
        status: 'success',
        icon: 'gear',
        to: '/settings',
    },
];

const createNavigationItemsCollection = () => [
    { key: 'home', label: 'Home', icon: 'house', to: '/home' },
    { key: 'search', label: 'Search', icon: 'magnifyingGlass', to: '/search' },
    { key: 'alerts', label: 'Alerts', icon: 'bell', badge: 3, to: '/alerts' },
    { key: 'profile', label: 'Profile', icon: 'user', to: '/profile' },
];

const createRailItemsCollection = () => [
    { key: 'overview', label: 'Overview', icon: 'house' },
    { key: 'deployments', label: 'Deployments', icon: 'rocket' },
    { key: 'logs', label: 'Logs', icon: 'list' },
    { key: 'settings', label: 'Settings', icon: 'gear' },
];

const createMeterItemsCollection = () => [
    { id: 'cpu', label: 'CPU', value: 58 },
    { id: 'memory', label: 'Memory', value: 74 },
    { id: 'network', label: 'Network', value: 32 },
];

const createServiceLevelsCollection = () => [
    {
        id: 'api',
        label: 'API latency',
        value: 82,
        thresholds: { warn: 70, danger: 90 },
    },
    {
        id: 'queue',
        label: 'Queue backlog',
        value: 41,
        thresholds: { warn: 60, danger: 80 },
    },
];

const createTerminalLogsCollection = () => [
    {
        id: 'log-1',
        command: 'npm run build',
        output: 'Build completed successfully.',
        timestamp: '2026-03-07T09:00:00Z',
        severity: 'success',
    },
];

const createOptionItemsCollection = () => [
    { label: 'Starter', value: 'starter' },
    { label: 'Pro', value: 'pro' },
    { label: 'Enterprise', value: 'enterprise' },
];

const createCarouselSlidesCollection = () => [
    {
        title: 'Launch faster',
        description: 'Ship internal tools with shared UI primitives.',
        kicker: 'Release',
        meta: '3 teams onboarded',
    },
    {
        title: 'Scale safely',
        description: 'Keep design and implementation aligned as products grow.',
        kicker: 'Adoption',
        meta: '92% component reuse',
    },
    {
        title: 'Stay consistent',
        description: 'Reuse one component language across admin surfaces and portals.',
        kicker: 'System',
        meta: '28 shared patterns',
    },
];

const createHeroSlidesCollection = () => [
    {
        title: 'Operations workspace',
        description: 'Monitor releases, incidents, and approvals from one shell.',
    },
    {
        title: 'Cross-team design system',
        description: 'Keep product and engineering moving on the same primitives.',
    },
    {
        title: 'Faster delivery',
        description: 'Replace ad hoc admin UI with composable, documented building blocks.',
    },
];

const createChartLabelsCollection = () => ['Q1', 'Q2', 'Q3', 'Q4'];

const createCartesianSeriesCollection = () => [
    { label: 'Revenue', data: [120, 180, 160, 220] },
    { label: 'Costs', data: [80, 110, 105, 130] },
];

const createBubbleSeriesCollection = () => [
    {
        label: 'Accounts',
        data: [
            { x: 1, y: 12, size: 10 },
            { x: 2, y: 18, size: 20 },
            { x: 3, y: 15, size: 30 },
        ],
    },
];

const createScatterSeriesCollection = () => [
    {
        label: 'Latency',
        data: [
            { x: 1, y: 120 },
            { x: 2, y: 96 },
            { x: 3, y: 132 },
        ],
    },
];

const createPieSeriesCollection = () => [{ data: [44, 31, 25] }];

const createHeatmapCellsCollection = () => [
    { x: 'Mon', y: 'API', value: 32 },
    { x: 'Tue', y: 'API', value: 48 },
    { x: 'Wed', y: 'API', value: 28 },
    { x: 'Mon', y: 'Queue', value: 18 },
    { x: 'Tue', y: 'Queue', value: 26 },
    { x: 'Wed', y: 'Queue', value: 12 },
];

const createHistogramValuesCollection = () => [8, 12, 14, 18, 21, 24, 29, 31, 35, 42];

const createComponentSpecificBindings = (template: string): Record<string, unknown> => {
    const noop = () => {};
    const resolvedDate = '2026-03-07';
    const bindings: Record<string, unknown> = {};

    if (/<BulkActionBar\b/i.test(template)) {
        bindings.selectedRowIds = ['ord-1024', 'ord-1025'];
        bindings.actions = [
            { id: 'archive', label: 'Archive' },
            { id: 'delete', label: 'Delete', requiresConfirm: true },
        ];
        bindings.lastBulkActionId = 'archive';
        bindings.lastUndoToken = 'undo-archive';
    }

    if (/<(?:CascadeSelect|TreeSelect|Tree)\b/i.test(template)) {
        bindings.rootNodes = createTreeItems();
        bindings.treeItems = createTreeItems();
        bindings.items = createTreeItems();
        bindings.largeTreeItems = createTreeItems();
        bindings.expanded = ['workspace'];
        bindings.expandedKeys = ['workspace'];
        bindings.loadingKeys = [];
        bindings.selectedNode = 'overview';
        bindings.selectedMany = ['overview', 'billing'];
        bindings.value = 'overview';
        bindings.loadBranch = async () => [];
        bindings.onLoadChildren = noop;
    }

    if (/<OrgChart\b/i.test(template)) {
        bindings.orgItems = [
            {
                key: 'ceo',
                label: 'CEO',
                children: [
                    { key: 'ops', label: 'Operations' },
                    { key: 'design', label: 'Design' },
                ],
            },
        ];
        bindings.expandedKeys = ['ceo'];
        bindings.selectedNode = 'ceo';
        bindings.selectedNodes = ['ops'];
    }

    if (/<CommandPalette\b/i.test(template)) {
        bindings.open = true;
        bindings.scope = 'project';
        bindings.items = [
            { label: 'Open docs', value: 'docs', group: 'Navigation', scope: 'project' },
            { label: 'Save draft', value: 'save', group: 'Actions', scope: 'project', shortcut: 'Ctrl+S' },
        ];
        bindings.entityResults = [
            { label: 'Marketing site', value: 'site-1', group: 'Entities', entityType: 'Project' },
        ];
    }

    if (/<CommentThread\b/i.test(template)) {
        bindings.comments = [
            {
                id: 1,
                author: { id: 'anna', name: 'Anna', meta: 'Content designer' },
                body: 'Please update the copy.',
                createdAt: `${resolvedDate}T09:15:00Z`,
                resolved: false,
            },
            {
                id: 2,
                parentId: 1,
                author: { id: 'max', name: 'Max', meta: 'Frontend engineer' },
                body: 'Updated in the latest commit.',
                createdAt: `${resolvedDate}T09:42:00Z`,
                resolved: false,
            },
        ];
    }

    if (/<CodeEditor\b/i.test(template)) {
        bindings.source = [
            "export const releaseChannels = ['stable', 'beta'];",
            '',
            'export function getChannelLabel(channel: string) {',
            "    return channel === 'stable' ? 'Stable release' : 'Beta preview';",
            '}',
        ].join('\n');
        bindings.generatedConfig = JSON.stringify(
            {
                retries: 3,
                timeoutMs: 5000,
                environment: 'staging',
            },
            null,
            2,
        );
        bindings.loading = false;
    }

    if (/<NotificationCenter\b/i.test(template)) {
        bindings.open = true;
        bindings.notifications = [
            {
                id: 1,
                title: 'Build finished',
                message: 'Production deployment succeeded.',
                read: false,
                severity: 'success',
            },
            {
                id: 2,
                title: 'Review requested',
                message: 'Anna mentioned you in API changes.',
                read: false,
                severity: 'info',
            },
        ];
    }

    if (/<Tour\b/i.test(template)) {
        bindings.tourOpen = true;
        bindings.steps = [
            { title: 'Start', content: 'Launch onboarding here.' },
            { title: 'Search', content: 'Find projects quickly.' },
        ];
    }

    if (/<DataTableToolbar\b/i.test(template)) {
        bindings.search = 'billing';
        bindings.activeFiltersCount = 2;
        bindings.showFilters = false;
        bindings.columnPresetOptions = [
            { id: 'default', label: 'Default' },
            { id: 'finance', label: 'Finance' },
        ];
    }

    if (/<FileManager\b/i.test(template)) {
        bindings.selectedIds = ['asset-1'];
        bindings.assets = [
            { id: 'asset-1', name: 'Roadmap.pdf', kind: 'file', size: 420000, updatedAt: `${resolvedDate}T09:00:00Z` },
            { id: 'asset-2', name: 'Brand', kind: 'folder', updatedAt: `${resolvedDate}T10:00:00Z` },
        ];
    }

    if (/<AvatarGroup\b/i.test(template)) {
        bindings.members = [
            { key: 1, name: 'Ada Lovelace', status: 'online' },
            { key: 2, name: 'Alan Turing', status: 'busy' },
            { key: 3, name: 'Grace Hopper', status: 'away' },
        ];
    }

    if (/<BottomNavigation\b/i.test(template)) {
        bindings.active = 'home';
        bindings.items = createNavigationItemsCollection();
    }

    if (/<Carousel\b/i.test(template)) {
        bindings.activeSlide = 0;
        bindings.slides = createCarouselSlidesCollection();
        bindings.heroSlides = createHeroSlidesCollection();
    }

    if (/<Dock\b/i.test(template)) {
        bindings.activeKey = 'home';
        bindings.items = createNavigationItemsCollection().map(item => ({
            key: item.key,
            label: item.label,
            icon: item.icon,
            to: item.to,
        }));
    }

    if (/<NavigationRail\b/i.test(template)) {
        bindings.activeKey = 'overview';
        bindings.collapsed = false;
        bindings.railItems = createRailItemsCollection();
    }

    if (/<(?:AreaChart|BarChart|LineChart|RadarChart)\b/i.test(template)) {
        bindings.labels = createChartLabelsCollection();
        bindings.series = createCartesianSeriesCollection();
    }

    if (/<Chart\b/i.test(template)) {
        bindings.data = {
            labels: createChartLabelsCollection(),
            datasets: [{ label: 'Revenue', data: [120, 180, 150, 220] }],
        };
    }

    if (/<DataTable\b/i.test(template)) {
        bindings.columns = createDataTableColumns();
        bindings.rows = createDataTableRows();
        bindings.sortField = 'name';
        bindings.sortOrder = 'asc';
        bindings.page = 1;
        bindings.pageSize = 10;
        bindings.filters = { team: 'Platform' };
        bindings.selection = [1, 3];
        bindings.expandedRows = [1];
        bindings.columnOrder = ['name', 'role', 'team', 'age'];
        bindings.visibleColumns = ['name', 'role', 'team', 'age'];
        bindings.onRequest = noop;
        bindings.onBulkAction = noop;
    }

    if (/<DataView\b/i.test(template)) {
        bindings.products = createDataViewItems();
        bindings.serverItems = createDataViewItems();
        bindings.total = createDataViewItems().length;
        bindings.query = {
            page: 1,
            pageSize: 12,
            sortField: 'name',
            sortOrder: 'asc',
        };
        bindings.onRequest = noop;
    }

    if (/<BubbleChart\b/i.test(template)) {
        bindings.series = createBubbleSeriesCollection();
    }

    if (/<ScatterChart\b/i.test(template)) {
        bindings.series = createScatterSeriesCollection();
    }

    if (/<(?:PieChart|DonutChart)\b/i.test(template)) {
        bindings.labels = ['North', 'South', 'West'];
        bindings.series = createPieSeriesCollection();
    }

    if (/<Heatmap\b/i.test(template)) {
        bindings.cells = createHeatmapCellsCollection();
        bindings.xLabels = ['Mon', 'Tue', 'Wed'];
        bindings.yLabels = ['API', 'Queue'];
    }

    if (/<Histogram\b/i.test(template)) {
        bindings.values = createHistogramValuesCollection();
    }

    if (/<Form\b/i.test(template)) {
        bindings.values = { email: 'ops@vueforge.dev' };
        bindings.initialValues = { email: 'ops@vueforge.dev' };
        bindings.validateForm = () => ({});
        bindings.send = noop;
        bindings.submitForm = async () => ({ ok: true });
        bindings.mapSubmitError = () => ({});
        bindings.onSubmitSuccess = noop;
    }

    if (/<InfiniteScroll\b/i.test(template)) {
        bindings.loading = false;
        bindings.error = false;
        bindings.hasMore = true;
        bindings.items = [
            { id: 'evt-1', title: 'Project created' },
            { id: 'evt-2', title: 'Invoice approved' },
        ];
        bindings.infiniteRef = null;
    }

    if (/<KanbanBoard\b/i.test(template)) {
        bindings.columns = [
            { key: 'todo', label: 'Todo' },
            { key: 'doing', label: 'Doing' },
            { key: 'done', label: 'Done' },
        ];
        bindings.items = [
            { id: 'task-1', column: 'todo', title: 'Prepare brief', priority: 'info' },
            { id: 'task-2', column: 'doing', title: 'QA pass', priority: 'warn' },
        ];
    }

    if (/<MemberPicker\b/i.test(template)) {
        bindings.owner = 'anna';
        bindings.assignees = ['anna', 'max'];
        bindings.loadingMembers = false;
        bindings.memberOptions = [
            { label: 'Anna Smirnova', value: 'anna', roleHint: 'Owner' },
            { label: 'Max Petrov', value: 'max', roleHint: 'Reviewer' },
        ];
    }

    if (/<PermissionMatrix\b/i.test(template)) {
        bindings.roles = [
            { id: 'admin', label: 'Admin' },
            { id: 'editor', label: 'Editor' },
        ];
        bindings.capabilities = [
            { id: 'deploy', label: 'Deploy' },
            { id: 'billing', label: 'Billing' },
        ];
        bindings.permissionMap = {
            admin: { deploy: true, billing: true },
            editor: { deploy: false, billing: false },
        };
    }

    if (/<PickList\b/i.test(template)) {
        bindings.availableUsers = [
            { id: 'anna', label: 'Anna Smirnova' },
            { id: 'max', label: 'Max Petrov' },
        ];
        bindings.assignedUsers = [{ id: 'olga', label: 'Olga Ivanova' }];
    }

    if (/<SavedViewsManager\b/i.test(template)) {
        bindings.activeViewId = 'open';
        bindings.savedViews = [
            { id: 'open', label: 'Open issues' },
            { id: 'assigned', label: 'Assigned to me' },
        ];
        bindings.currentFilters = { status: 'open', assignee: 'me' };
    }

    if (/<Scheduler\b/i.test(template)) {
        bindings.selectedEventId = 'booking-1';
        bindings.rooms = createSchedulerResources();
        bindings.bookings = createSchedulerEvents();
    }

    if (/<SlideGroup\b/i.test(template)) {
        bindings.filter = 'all';
        bindings.filters = [
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Archived', value: 'archived' },
        ];
    }

    if (/<Terminal\b/i.test(template)) {
        bindings.logs = [
            {
                id: 'log-1',
                command: 'npm run build',
                output: 'Build completed successfully.',
                timestamp: `${resolvedDate}T09:00:00Z`,
                severity: 'success',
            },
        ];
    }

    if (/<TreeTable\b/i.test(template)) {
        bindings.selected = 'workspace';
        bindings.selectedMany = ['workspace'];
        bindings.expanded = ['workspace'];
        bindings.rows = createTreeTableRows();
        bindings.serverTree = createTreeTableRows();
        bindings.loadingKeys = [];
        bindings.columns = [
            { field: 'name', header: 'Name' },
            { field: 'type', header: 'Type' },
        ];
        bindings.columnOrder = ['name', 'type'];
    }

    if (/<VirtualScroller\b/i.test(template)) {
        bindings.users = [
            { id: 'user-1', name: 'Anna Smirnova' },
            { id: 'user-2', name: 'Max Petrov' },
        ];
        bindings.activity = [
            { id: 'activity-1', message: 'Invoice approved' },
            { id: 'activity-2', message: 'New comment posted' },
        ];
        bindings.smallList = [{ label: 'Alpha' }, { label: 'Beta' }];
    }

    if (/<Wizard\b/i.test(template)) {
        bindings.wizardStep = 'account';
        bindings.step = 'account';
        bindings.email = 'ops@vueforge.dev';
        bindings.plan = 'pro';
        bindings.plans = [
            { label: 'Starter', value: 'starter' },
            { label: 'Pro', value: 'pro' },
        ];
        bindings.wizardSteps = [
            { value: 'account', title: 'Account' },
            { value: 'plan', title: 'Plan' },
            { value: 'confirm', title: 'Confirm' },
        ];
        bindings.steps = [
            { value: 'account', title: 'Account' },
            { value: 'plan', title: 'Plan' },
            { value: 'confirm', title: 'Confirm' },
        ];
    }

    return bindings;
};

const extractDirectiveIdentifiers = (template: string): string[] => {
    const matches = template.matchAll(
        /(?:[:@][\w-]+|v-[\w-]+(?::[\w-]+)?)="\s*([A-Za-z_$][\w$]*)(?:\s*(?:[.[(]|$)[^"]*)?"/g,
    );
    return [...matches].map(match => match[1]);
};

const extractBoundExpressionIdentifiers = (template: string): string[] => {
    const expressionMatches = template.matchAll(/(?:[:@][\w-]+|v-[\w-]+(?::[\w-]+)?)="\s*([^"]+)\s*"/g);

    return [...expressionMatches].flatMap(([, expression]) =>
        Array.from(expression.matchAll(/\b([A-Za-z_$][\w$]*)\b(?!\s*:)/g))
            .map(match => match[1])
            .filter(identifier => !reservedExpressionIdentifiers.has(identifier)),
    );
};

const extractInterpolationIdentifiers = (template: string): string[] => {
    const matches = template.matchAll(/{{\s*([A-Za-z_$][\w$]*)(?:\s*(?:[.[(]|}})[\s\S]*?)?}}/g);
    return [...matches].map(match => match[1]);
};

type ModelBinding = {
    identifier: string;
    tagName: string;
    propName: string;
};

type PropBinding = {
    identifier: string;
    tagName: string;
    propName: string;
};

const extractModelBindings = (template: string): ModelBinding[] =>
    [...template.matchAll(/<([A-Z][\w-]*)[^>]*\bv-model(?::([\w-]+))?="\s*([A-Za-z_$][\w$]*)\s*"/g)].map(
        ([, tagName, argument, identifier]) => ({
            identifier,
            tagName,
            propName: argument ? kebabToCamelCase(argument) : 'modelValue',
        }),
    );

const extractPropBindings = (template: string): PropBinding[] =>
    [...template.matchAll(/<([A-Z][\w-]*)[^>]*\s(?::|v-bind:)([\w-]+)="\s*([A-Za-z_$][\w$]*)\s*"/g)].map(
        ([, tagName, propName, identifier]) => ({
            identifier,
            tagName,
            propName: kebabToCamelCase(propName),
        }),
    );

const isSupportedLiteralIdentifier = (identifier: string): boolean =>
    ['true', 'false', 'null', 'undefined'].includes(identifier);

const extractObjectBindingIdentifiers = (expression: string): string[] =>
    expression
        .replace(/[{}]/g, '')
        .split(',')
        .map(part => part.trim())
        .filter(Boolean)
        .flatMap(part => {
            const normalizedPart = part.replace(/^\.\.\./, '').trim();
            const aliasMatch = normalizedPart.match(/^[A-Za-z_$][\w$]*\s*:\s*([A-Za-z_$][\w$]*)/);
            const assignmentMatch = normalizedPart.match(/^([A-Za-z_$][\w$]*)\s*=/);

            if (aliasMatch) {
                return [aliasMatch[1]];
            }

            if (assignmentMatch) {
                return [assignmentMatch[1]];
            }

            return /^[A-Za-z_$][\w$]*$/.test(normalizedPart) ? [normalizedPart] : [];
        });

const extractSlotScopeIdentifiers = (template: string): string[] => {
    const matches = template.matchAll(/(?:#[\w-]+|v-slot(?::[\w-]+)?)\s*=\s*"(\{[\s\S]*?\}|[A-Za-z_$][\w$]*)"/g);

    return [...matches].flatMap(([, expression]) => {
        const normalizedExpression = expression.trim();

        if (normalizedExpression.startsWith('{')) {
            return extractObjectBindingIdentifiers(normalizedExpression);
        }

        return [normalizedExpression];
    });
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

const inferAdvancedFilterPanelModelValue = (template: string, identifier: string): null | undefined => {
    const advancedFilterPanelMatch = template.match(
        new RegExp(`<AdvancedFilterPanel[^>]*v-model="${identifier}"[^>]*?(>|/>)`, 'i'),
    );

    if (!advancedFilterPanelMatch) {
        return undefined;
    }

    return null;
};

const inferCodeEditorModelValue = (template: string, identifier: string): string | undefined => {
    if (!new RegExp(`<CodeEditor[^>]*v-model="${identifier}"[^>]*?(>|/>)`, 'i').test(template)) {
        return undefined;
    }

    if (identifier === 'source') {
        return [
            "export const releaseChannels = ['stable', 'beta'];",
            '',
            'export function getChannelLabel(channel: string) {',
            "    return channel === 'stable' ? 'Stable release' : 'Beta preview';",
            '}',
        ].join('\n');
    }

    if (identifier === 'generatedConfig') {
        return JSON.stringify(
            {
                retries: 3,
                timeoutMs: 5000,
                environment: 'staging',
            },
            null,
            2,
        );
    }

    return '// Edit configuration here';
};

const inferAnchoredPopupModelValue = (template: string, identifier: string): boolean | undefined => {
    if (
        !new RegExp(`<(?:ConfirmPopup|Popover|OverlayPanel)[^>]*v-model="${identifier}"[^>]*?(>|/>)`, 'i').test(
            template,
        )
    ) {
        return undefined;
    }

    return false;
};

const inferModelValue = (template: string, identifier: string): unknown => {
    const matchingBinding = extractModelBindings(template).find(binding => binding.identifier === identifier);
    const propDefinition = matchingBinding
        ? getPreviewComponentDefinition(matchingBinding.tagName)?.props?.[matchingBinding.propName]
        : undefined;

    const accordionValue = inferAccordionModelValue(template, identifier);
    if (accordionValue !== undefined) {
        return accordionValue;
    }

    const advancedFilterPanelValue = inferAdvancedFilterPanelModelValue(template, identifier);
    if (advancedFilterPanelValue !== undefined) {
        return advancedFilterPanelValue;
    }

    const codeEditorValue = inferCodeEditorModelValue(template, identifier);
    if (codeEditorValue !== undefined) {
        return codeEditorValue;
    }

    const anchoredPopupValue = inferAnchoredPopupModelValue(template, identifier);
    if (anchoredPopupValue !== undefined) {
        return anchoredPopupValue;
    }

    if (
        /(^|[A-Z_])(open|opened|visible|show|shown|loading|saving|editing|pinned|agreed|collapsed|disabled)$/i.test(
            identifier,
        )
    ) {
        return true;
    }

    if (/(sidebarWidth|panelWidth|drawerWidth)$/i.test(identifier)) {
        return 280;
    }

    if (definitionContainsType(propDefinition, Array)) {
        return [];
    }

    if (definitionContainsType(propDefinition, Object)) {
        return {};
    }

    if (definitionContainsType(propDefinition, Boolean)) {
        return false;
    }

    if (definitionContainsType(propDefinition, Number)) {
        return /(page|step|index|count|score|volume|quantity|width|height|size|precision)$/i.test(identifier) ? 1 : 0;
    }

    if (definitionContainsType(propDefinition, String)) {
        return '';
    }

    if (/(page|step|index|count|score|volume|quantity)$/i.test(identifier)) {
        return 1;
    }

    if (/(date|time|email|password|query|search|name|title|phone|bio|message|value)$/i.test(identifier)) {
        return '';
    }

    return '';
};

const inferExternalBindingValue = (template: string, identifier: string): unknown => {
    const componentBindings = createComponentSpecificBindings(template);
    if (Object.prototype.hasOwnProperty.call(componentBindings, identifier)) {
        return clonePreviewValue(componentBindings[identifier]);
    }

    const matchingBinding = extractPropBindings(template).find(binding => binding.identifier === identifier);
    const propDefinition = matchingBinding
        ? getPreviewComponentDefinition(matchingBinding.tagName)?.props?.[matchingBinding.propName]
        : undefined;

    if (definitionContainsType(propDefinition, Array)) {
        return [];
    }

    if (definitionContainsType(propDefinition, Object)) {
        return {};
    }

    if (definitionContainsType(propDefinition, Boolean)) {
        return false;
    }

    if (definitionContainsType(propDefinition, Number)) {
        return /(page|step|index|count|score|volume|quantity|width|height|size|precision)$/i.test(identifier) ? 1 : 0;
    }

    if (definitionContainsType(propDefinition, String)) {
        return '';
    }

    if (identifier === 'dashboardTheme') {
        return {
            colors: { primary: '#1d4ed8' },
            components: { button: { backgroundColor: '#1d4ed8' } },
        };
    }

    if (/^(media|productImages|campaignMedia)$/i.test(identifier)) {
        return [
            {
                src: '/gallery/1.jpg',
                thumbnailSrc: '/gallery/thumbs/1.jpg',
                alt: 'Item one',
                caption: 'Intro scene',
            },
            {
                src: '/gallery/2.jpg',
                thumbnailSrc: '/gallery/thumbs/2.jpg',
                alt: 'Item two',
                caption: 'Detail view',
            },
        ];
    }

    if (identifier === 'noop') {
        return () => {};
    }

    if (/^(members|avatars)$/i.test(identifier)) {
        return [
            { key: 1, name: 'Ada Lovelace', status: 'online' },
            { key: 2, name: 'Alan Turing', status: 'busy' },
            { key: 3, name: 'Grace Hopper', status: 'away' },
        ];
    }

    if (/^(usage)$/i.test(identifier)) {
        return createMeterItemsCollection();
    }

    if (/^(serviceLevels)$/i.test(identifier)) {
        return createServiceLevelsCollection();
    }

    if (/^(events|timelineItems)$/i.test(identifier)) {
        return createGenericItemsCollection().map(item => ({
            title: item.title,
            description: item.description,
            date: item.date,
            status: item.status,
        }));
    }

    if (/^(logs)$/i.test(identifier)) {
        return createTerminalLogsCollection();
    }

    if (/^(plans|options)$/i.test(identifier)) {
        return createOptionItemsCollection();
    }

    if (/^(views|steps|wizardSteps)$/i.test(identifier)) {
        return [
            { value: 'account', label: 'Account', title: 'Account' },
            { value: 'plan', label: 'Plan', title: 'Plan' },
            { value: 'confirm', label: 'Confirm', title: 'Confirm' },
        ];
    }

    if (/^(skills|tags)$/i.test(identifier)) {
        return ['vue', 'typescript', 'vitest'];
    }

    if (/^(actions)$/i.test(identifier)) {
        return [
            { id: 'create', label: 'Create' },
            { id: 'share', label: 'Share' },
            { id: 'archive', label: 'Archive' },
        ];
    }

    if (
        /(items|options|views|steps|logs|events|rows|columns|filters|roles|capabilities|users|members|assets)$/i.test(
            identifier,
        )
    ) {
        return createGenericItemsCollection();
    }

    if (/(ids|keys|selection|selected|expanded|loadingKeys)$/i.test(identifier)) {
        return [];
    }

    if (/(map|state|values|query|filters)$/i.test(identifier)) {
        return {};
    }

    if (/(count|page|step|index|width|height|size|total)$/i.test(identifier)) {
        return /width/i.test(identifier) ? 280 : 1;
    }

    if (/(loading|error|disabled|visible|open|collapsed|show|hasMore)$/i.test(identifier)) {
        return false;
    }

    if (
        /^(on|handle|open|close|toggle|load|save|send|submit|run|start|track|show|mark|undo|retry|confirm|cancel)/i.test(
            identifier,
        )
    ) {
        return () => {};
    }

    return '';
};

const previewScript = computed(() => extractScriptSetup(props.code));
const hasUnsupportedStyle = computed(() => /<style[\s\S]*?<\/style>/i.test(props.code));
const previewTemplate = computed(() => extractTemplate(props.code));
const scriptBindingIdentifiers = computed(() => extractScriptBindingIdentifiers(previewScript.value));
const implicitBindingIdentifiers = computed(() => Object.keys(createImplicitPreviewBindings(previewTemplate.value)));
const previewScriptError = computed(() => {
    if (!previewScript.value) {
        return '';
    }

    try {
        createPreviewScriptBindings(previewScript.value);
        return '';
    } catch (error) {
        return error instanceof Error ? error.message : String(error);
    }
});
const allExternalIdentifiers = computed(() =>
    Array.from(
        new Set([
            ...extractDirectiveIdentifiers(previewTemplate.value),
            ...extractBoundExpressionIdentifiers(previewTemplate.value),
            ...extractInterpolationIdentifiers(previewTemplate.value),
        ]),
    ).filter(identifier => !isSupportedLiteralIdentifier(identifier)),
);
const slotScopeIdentifiers = computed(() => Array.from(new Set(extractSlotScopeIdentifiers(previewTemplate.value))));
const modelIdentifiers = computed(() =>
    Array.from(
        new Set(
            [...previewTemplate.value.matchAll(/v-model(?::[\w-]+)?="\s*([A-Za-z_$][\w$]*)\s*"/g)].map(
                match => match[1],
            ),
        ),
    ),
);
const inferredExternalBindings = computed<Record<string, unknown>>(() =>
    Object.fromEntries(
        allExternalIdentifiers.value
            .filter(
                identifier =>
                    !modelIdentifiers.value.includes(identifier) &&
                    !slotScopeIdentifiers.value.includes(identifier) &&
                    !scriptBindingIdentifiers.value.includes(identifier) &&
                    !implicitBindingIdentifiers.value.includes(identifier),
            )
            .map(identifier => [identifier, inferExternalBindingValue(previewTemplate.value, identifier)]),
    ),
);
const inferredModelState = computed<Record<string, unknown>>(() =>
    Object.fromEntries(
        modelIdentifiers.value.map(identifier => [identifier, inferModelValue(previewTemplate.value, identifier)]),
    ),
);
const unknownExampleComponents = computed(() => createUnknownExampleComponents(previewTemplate.value));
const normalizedPreviewTemplate = computed(() => normalizePreviewTemplate(previewTemplate.value));

const isPreviewable = computed(() => {
    if (hasUnsupportedStyle.value) {
        return false;
    }

    if (!previewTemplate.value.startsWith('<')) {
        return false;
    }

    if (previewScriptError.value) {
        return false;
    }

    return ['vue', 'html', ''].includes(props.language);
});

const compilePreviewRender = (template: string): (() => unknown) => {
    try {
        const { code } = compile(template, {
            mode: 'function',
            hoistStatic: false,
            prefixIdentifiers: true,
        });
        return new Function('Vue', `${code}`)(VueRuntime) as () => unknown;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        if (!message.includes('"prefixIdentifiers" option is not supported in this build of compiler.')) {
            throw error;
        }

        const { code } = compile(template, {
            mode: 'function',
            hoistStatic: false,
        });

        return new Function('Vue', `${code}`)(VueRuntime) as () => unknown;
    }
};

const compiledPreview = computed<{ render: (() => unknown) | null; error: string }>(() => {
    if (!isPreviewable.value) {
        return { render: null, error: '' };
    }

    try {
        return {
            render: compilePreviewRender(normalizedPreviewTemplate.value),
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
const previewRenderKey = ref(0);
const previewState = VueRuntime.reactive<Record<string, unknown>>({});
const showPreviewReset = computed(
    () => Boolean(previewComponent.value) && modelIdentifiers.value.length > 0 && hasPreviewStateChanges.value,
);
const initialPreviewState = computed<Record<string, unknown>>(() =>
    Object.fromEntries(Object.entries(inferredModelState.value).map(([key, value]) => [key, clonePreviewValue(value)])),
);

const replacePreviewState = (nextState: Record<string, unknown>) => {
    for (const key of Object.keys(previewState)) {
        if (!Object.prototype.hasOwnProperty.call(nextState, key)) {
            delete previewState[key];
        }
    }

    for (const [key, value] of Object.entries(nextState)) {
        previewState[key] = clonePreviewValue(value);
    }
};

const arePreviewValuesEqual = (left: unknown, right: unknown): boolean =>
    JSON.stringify(left) === JSON.stringify(right);
const hasPreviewStateChanges = computed(() =>
    Array.from(new Set([...Object.keys(initialPreviewState.value), ...Object.keys(previewState)])).some(
        key => !arePreviewValuesEqual(previewState[key], initialPreviewState.value[key]),
    ),
);
const canOpenPreview = computed(() =>
    Object.entries(initialPreviewState.value).some(
        ([key, value]) => typeof value === 'boolean' && value && previewState[key] === false,
    ),
);
const previewActionLabel = computed(() => (canOpenPreview.value ? 'Open preview' : 'Reset preview'));

const resetPreview = (remount = false) => {
    runtimePreviewError.value = '';
    replacePreviewState(initialPreviewState.value);
    if (remount) {
        previewRenderKey.value += 1;
    }
};

const handlePreviewAction = () => {
    resetPreview(!canOpenPreview.value);
};

const previewComponent = computed(() => {
    if (!isPreviewable.value || !compiledRender.value) {
        return null;
    }

    return markRaw({
        components: {
            ...exampleComponents,
            ...unknownExampleComponents.value,
            ...getPreviewSpecificComponents(),
        },
        directives: {
            overlayBadge: vOverlayBadge,
        },
        setup() {
            const implicitBindings = createImplicitPreviewBindings(previewTemplate.value);
            const externalBindings = inferredExternalBindings.value;
            const scriptBindings = createPreviewScriptBindings(previewScript.value);
            const modelBindings = Object.fromEntries(
                modelIdentifiers.value.map(identifier => [identifier, VueRuntime.toRef(previewState, identifier)]),
            );

            return {
                ...implicitBindings,
                ...externalBindings,
                ...scriptBindings,
                ...modelBindings,
                [previewStateKey]: previewState,
            };
        },
        render: compiledRender.value,
    });
});

const normalizedLanguage = computed(() => props.language || 'plaintext');

watch(
    initialPreviewState,
    state => {
        replacePreviewState(state);
    },
    { immediate: true },
);

watch(
    () => props.code,
    () => {
        runtimePreviewError.value = '';
        previewRenderKey.value = 0;
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
    transform: translateZ(0);

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
    --vf-menu-link-hover-color: var(--vf-docs-text);
    --vf-menu-parent-hover-color: var(--vf-docs-text);
    --vf-menu-separator-color: var(--vf-docs-border-strong);
    --vf-link-hover-color: var(--vf-docs-text);
    --vf-link-active-color: var(--vf-docs-text);
    --vf-context-menu-panel-background-color: color-mix(in srgb, var(--vf-docs-surface) 96%, transparent);
    --vf-context-menu-panel-border-color: var(--vf-docs-border-strong);
    color: var(--vf-docs-text);
    overflow-x: auto;
}

.vf-docs-example__preview-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.75rem;
}

.vf-docs-example__reset {
    padding: 0.35rem 0.6rem;
    border: 1px solid color-mix(in srgb, var(--vf-docs-border-strong) 88%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--vf-docs-surface) 90%, transparent);
    color: var(--vf-docs-secondary-text);
    font: inherit;
    font-size: 0.8rem;
    line-height: 1.2;
    cursor: pointer;
}

.vf-docs-example__reset:hover {
    background: color-mix(in srgb, var(--vf-docs-surface-muted) 80%, transparent);
    color: var(--vf-docs-text);
}

.vf-docs-example__preview :deep(.vf-accordion),
.vf-docs-example__preview :deep(.vf-accordion-item:last-child) {
    margin-bottom: 0;
}

.vf-docs-example__preview :deep(.vf-app-bar_fixed) {
    position: static;
}

.vf-docs-example__preview :deep(.vf-carousel) {
    --vf-carousel-slide-padding: 1.5rem 4.5rem 1.5rem;
}

.vf-docs-example__preview :deep(.vf-bottom-sheet_preview) {
    position: relative;
    inset: auto;
    min-height: 16rem;
    align-items: end;
}

.vf-docs-example__preview :deep(.vf-bottom-sheet_preview .vf-bottom-sheet__overlay) {
    position: absolute;
}

.vf-docs-example__preview :deep(.vf-bottom-sheet_preview .vf-bottom-sheet__panel) {
    width: min(100%, 34rem);
    max-height: min(24rem, 100%);
}

.vf-docs-example__preview :deep(.vf-context-menu__panel) {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    width: max-content;
    min-width: min(100%, 14rem);
    max-width: min(20rem, calc(100vw - 4rem));
    color: var(--vf-docs-text);
}

.vf-docs-example__preview :deep(.vf-context-menu__panel .vf-menu__link) {
    color: inherit;
}

.vf-docs-example__preview :deep(.vf-context-menu_preview) {
    position: relative;
    display: inline-grid;
    width: fit-content;
    justify-items: start;
    margin-bottom: 15rem;
}

.vf-docs-example__preview :deep(.vf-context-menu__panel .vf-link),
.vf-docs-example__preview :deep(.vf-context-menu__panel .vf-menu__parent) {
    color: var(--vf-docs-text);
}

.vf-docs-example__preview :deep(.vf-confirm-popup_preview) {
    display: inline-grid;
    gap: 0.65rem;
    min-width: min(100%, 20rem);
}

.vf-docs-example__preview :deep(.vf-confirm-popup_preview.is-end) {
    justify-items: end;
}

.vf-docs-example__preview :deep(.vf-confirm-popup_preview.is-top .vf-confirm-popup__inline) {
    order: -1;
}

.vf-docs-example__preview :deep(.vf-confirm-popup_preview .vf-confirm-popup__inline) {
    display: grid;
}

.vf-docs-example__preview :deep(.vf-confirm-popup_preview .vf-popover__wrapper) {
    position: static;
    width: min(100%, 20rem);
}

.vf-docs-example__preview :deep(.vf-confirm-popup_preview .vf-confirm-popup__body) {
    padding: 1rem 1rem 0.75rem;
}

.vf-docs-example__preview :deep(.vf-confirm-popup_preview .vf-confirm-popup__actions) {
    padding: 0 1rem 1rem;
}

.vf-docs-example__preview :deep(.vf-modal_preview),
.vf-docs-example__preview :deep(.vf-command-palette_preview),
.vf-docs-example__preview :deep(.vf-notification-center_preview),
.vf-docs-example__preview :deep(.vf-tour_preview) {
    position: relative;
    inset: auto;
    min-height: 16rem;
}

.vf-docs-example__preview :deep(.vf-drawer_preview) {
    position: relative;
    inset: auto;
    min-height: 18rem;
}

.vf-docs-example__preview :deep(.vf-modal_preview .vf-modal__overlay),
.vf-docs-example__preview :deep(.vf-drawer_preview .vf-drawer__overlay),
.vf-docs-example__preview :deep(.vf-command-palette_preview .vf-command-palette__overlay),
.vf-docs-example__preview :deep(.vf-notification-center_preview .vf-notification-center__overlay),
.vf-docs-example__preview :deep(.vf-tour_preview .vf-tour__overlay) {
    position: absolute;
}

.vf-docs-example__preview :deep(.vf-modal_preview .vf-modal__panel) {
    position: relative;
    width: min(100%, 34rem);
    max-height: min(24rem, 100%);
    margin: auto;
}

.vf-docs-example__preview :deep(.vf-drawer_preview .vf-drawer__panel) {
    position: absolute;
}

.vf-docs-example__preview :deep(.vf-notification-center_preview .vf-notification-center__panel) {
    position: relative;
    inset: auto;
    top: auto;
    right: auto;
    width: min(100%, 28rem);
    max-width: 100%;
    max-height: min(24rem, 100%);
    margin-left: auto;
}

.vf-docs-example__preview :deep(.vf-tour_preview .vf-tour__panel) {
    position: relative;
    inset: auto;
    width: min(100%, 28rem);
    max-width: 100%;
    margin: 1rem auto;
}

.vf-docs-example__preview :deep(.vf-command-palette_preview .vf-command-palette__panel) {
    position: relative;
    inset: auto;
    width: min(100%, 38rem);
    max-width: 100%;
    margin: 1rem auto;
}

.vf-docs-example__preview :deep(.vf-command-palette_preview .vf-command-palette__list) {
    max-height: 16rem;
}

.vf-docs-example__preview :deep(.vf-docs-demo-chart__surface) {
    min-height: 16rem;
    padding: 1rem 0.75rem 0.5rem;
    display: flex;
    align-items: stretch;
    border-radius: 0.5rem;
    border: 1px solid var(--vf-docs-border-strong);
    background:
        linear-gradient(to top, color-mix(in srgb, var(--vf-docs-surface-muted) 35%, transparent) 1px, transparent 1px)
            0 0 / 100% 25%,
        color-mix(in srgb, var(--vf-docs-surface) 94%, transparent);
}

.vf-docs-example__preview :deep(.vf-docs-demo-chart__surface_scatter) {
    display: grid;
    gap: 0.75rem;
    align-items: stretch;
}

.vf-docs-example__preview :deep(.vf-docs-demo-chart__scatter) {
    position: relative;
    min-height: 12rem;
    border-radius: 0.5rem;
    background:
        linear-gradient(
                to right,
                color-mix(in srgb, var(--vf-docs-border-strong) 18%, transparent) 1px,
                transparent 1px
            )
            0 0 / 25% 100%,
        linear-gradient(to top, color-mix(in srgb, var(--vf-docs-border-strong) 18%, transparent) 1px, transparent 1px)
            0 0 / 100% 25%;
}

.vf-docs-example__preview :deep(.vf-docs-demo-chart__bubble) {
    position: absolute;
    transform: translate(-50%, 50%);
    border-radius: 999px;
    background: var(--vf-docs-demo-chart-bubble);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, white 35%, transparent);
}

.vf-docs-example__preview :deep(.vf-docs-demo-chart__legend-row) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    color: var(--vf-docs-secondary-text);
    font-size: 0.82rem;
}

.vf-docs-example__preview :deep(.vf-docs-demo-chart__legend) {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
}

.vf-docs-example__preview :deep(.vf-docs-demo-chart__legend-dot) {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 999px;
    background: var(--vf-docs-demo-chart-bubble);
}

.vf-docs-example__preview :deep(.vf-docs-demo-chart__plot) {
    width: 100%;
    display: grid;
    grid-auto-flow: column;
    align-items: end;
    gap: 0.75rem;
}

.vf-docs-example__preview :deep(.vf-docs-demo-chart__group) {
    min-width: 0;
    display: grid;
    gap: 0.4rem;
    justify-items: center;
}

.vf-docs-example__preview :deep(.vf-docs-demo-chart__bars) {
    width: 100%;
    min-height: 12rem;
    display: flex;
    align-items: end;
    justify-content: center;
    gap: 0.3rem;
}

.vf-docs-example__preview :deep(.vf-docs-demo-chart__bar) {
    width: min(2rem, 100%);
    border-radius: 999px 999px 0 0;
    background: var(--vf-docs-demo-chart-bar);
}

.vf-docs-example__preview :deep(.vf-docs-demo-chart__label) {
    font-size: 0.8rem;
    color: var(--vf-docs-secondary-text);
}

.vf-docs-example__preview :deep(.vf-docs-demo-editor) {
    display: block;
    width: 100%;
    min-height: 16rem;
    margin: 0;
    padding: 1rem;
    overflow: auto;
    border: 0;
    background: transparent;
    color: inherit;
    font:
        0.9rem/1.6 'SFMono-Regular',
        Consolas,
        'Liberation Mono',
        Menlo,
        monospace;
    white-space: pre;
    resize: none;
    outline: none;
    box-sizing: border-box;
}

.vf-docs-example__preview :deep(.vf-docs-demo-editor[readonly]) {
    cursor: default;
}

.vf-docs-example__preview :deep(.vf-docs-demo-stub) {
    display: grid;
    gap: 0.3rem;
    align-items: start;
    min-height: 4.5rem;
    padding: 0.9rem 1rem;
    border: 1px dashed color-mix(in srgb, var(--vf-docs-border-strong) 80%, transparent);
    border-radius: 0.5rem;
    background: color-mix(in srgb, var(--vf-docs-surface-muted) 60%, transparent);
    color: var(--vf-docs-text);
}

.vf-docs-example__preview :deep(.vf-docs-demo-stub__title) {
    font-size: 0.95rem;
}

.vf-docs-example__preview :deep(.vf-docs-demo-stub__meta) {
    color: var(--vf-docs-secondary-text);
    font-size: 0.82rem;
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
