export interface CodeEditorConfig {
    value: string;
    language?: string;
    theme?: string;
    readonly?: boolean;
    options?: Record<string, unknown>;
    onChange?: (value: string) => void;
}

export interface CodeEditorAdapterInstance {
    [key: string]: unknown;
}

export interface CodeEditorAdapter {
    mount: (container: HTMLElement, config: CodeEditorConfig) => CodeEditorAdapterInstance;
    update?: (instance: CodeEditorAdapterInstance, config: CodeEditorConfig) => void;
    setValue?: (instance: CodeEditorAdapterInstance, value: string) => void;
    getValue?: (instance: CodeEditorAdapterInstance) => string;
    setReadonly?: (instance: CodeEditorAdapterInstance, readonly: boolean) => void;
    setTheme?: (instance: CodeEditorAdapterInstance, theme: string) => void;
    focus?: (instance: CodeEditorAdapterInstance) => void;
    destroy?: (instance: CodeEditorAdapterInstance) => void;
}

type MonacoLikeModel = {
    getValue: () => string;
    setValue: (value: string) => void;
    dispose?: () => void;
};

type MonacoLikeEditorInstance = {
    getValue: () => string;
    setValue: (value: string) => void;
    updateOptions: (options: Record<string, unknown>) => void;
    onDidChangeModelContent: (callback: () => void) => { dispose: () => void };
    dispose: () => void;
};

type MonacoLikeNamespace = {
    editor: {
        create: (container: HTMLElement, options: Record<string, unknown>) => MonacoLikeEditorInstance;
        setTheme?: (theme: string) => void;
        createModel?: (value: string, language?: string) => MonacoLikeModel;
    };
};

type MonacoWrappedInstance = {
    editor: MonacoLikeEditorInstance;
    changeSubscription?: { dispose: () => void };
    model?: MonacoLikeModel;
};

export const createMonacoAdapter = (monaco: MonacoLikeNamespace): CodeEditorAdapter => ({
    mount(container, config) {
        const model = monaco.editor.createModel ? monaco.editor.createModel(config.value, config.language) : undefined;
        if (config.theme && monaco.editor.setTheme) {
            monaco.editor.setTheme(config.theme);
        }

        const editor = monaco.editor.create(container, {
            value: config.value,
            language: config.language,
            theme: config.theme,
            readOnly: config.readonly,
            model,
            automaticLayout: true,
            ...(config.options ?? {}),
        });

        let changeSubscription: { dispose: () => void } | undefined;
        if (config.onChange) {
            changeSubscription = editor.onDidChangeModelContent(() => {
                config.onChange?.(editor.getValue());
            });
        }

        return {
            editor,
            changeSubscription,
            model,
        } satisfies MonacoWrappedInstance;
    },
    update(instance, config) {
        const wrapped = instance as MonacoWrappedInstance;

        wrapped.editor.updateOptions({
            readOnly: config.readonly,
            ...(config.options ?? {}),
        });
    },
    setValue(instance, value) {
        const wrapped = instance as MonacoWrappedInstance;
        wrapped.editor.setValue(value);
    },
    getValue(instance) {
        const wrapped = instance as MonacoWrappedInstance;
        return wrapped.editor.getValue();
    },
    setReadonly(instance, readonly) {
        const wrapped = instance as MonacoWrappedInstance;
        wrapped.editor.updateOptions({ readOnly: readonly });
    },
    setTheme(_instance, theme) {
        if (monaco.editor.setTheme) {
            monaco.editor.setTheme(theme);
        }
    },
    focus(instance) {
        const wrapped = instance as MonacoWrappedInstance & { editor: { focus?: () => void } };
        wrapped.editor.focus?.();
    },
    destroy(instance) {
        const wrapped = instance as MonacoWrappedInstance;
        wrapped.changeSubscription?.dispose();
        wrapped.editor.dispose();
        wrapped.model?.dispose?.();
    },
});

type CodeMirrorLikeView = {
    destroy: () => void;
    dispatch?: (value: unknown) => void;
    focus?: () => void;
    state?: { doc?: { toString?: () => string } };
};

type CodeMirrorFactory = (container: HTMLElement, config: CodeEditorConfig) => CodeMirrorLikeView;

export const createCodeMirrorAdapter = (factory: CodeMirrorFactory): CodeEditorAdapter => ({
    mount(container, config) {
        return factory(container, config);
    },
    getValue(instance) {
        const view = instance as CodeMirrorLikeView;
        return view.state?.doc?.toString?.() ?? '';
    },
    focus(instance) {
        const view = instance as CodeMirrorLikeView;
        view.focus?.();
    },
    destroy(instance) {
        const view = instance as CodeMirrorLikeView;
        view.destroy();
    },
});
