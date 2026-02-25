import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import CodeEditor from '../code-editor.vue';
import type { CodeEditorAdapter } from '../code-editor-adapter';

describe('CodeEditor', () => {
    const originalIntersectionObserver = globalThis.IntersectionObserver;

    afterEach(() => {
        globalThis.IntersectionObserver = originalIntersectionObserver;
    });

    const createAdapter = (emitChangeOnMount = true) => {
        const instance = { id: 'editor-instance' };
        const adapter: CodeEditorAdapter = {
            mount: vi.fn((_container, config) => {
                if (emitChangeOnMount) {
                    config.onChange?.('changed');
                }
                return instance;
            }),
            update: vi.fn(),
            setValue: vi.fn(),
            setReadonly: vi.fn(),
            setTheme: vi.fn(),
            getValue: vi.fn(() => 'value-from-adapter'),
            focus: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('mounts editor and emits ready/update on adapter change callback', async () => {
        const { adapter, instance } = createAdapter();
        const wrapper = mount(CodeEditor, {
            props: {
                adapter,
                modelValue: 'initial',
                lazy: false,
            },
        });

        await nextTick();

        expect(adapter.mount).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('ready')?.[0]).toEqual([instance]);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['changed']);
    });

    it('updates adapter value/theme/readonly on prop changes', async () => {
        const { adapter } = createAdapter(false);
        const wrapper = mount(CodeEditor, {
            props: {
                adapter,
                modelValue: 'one',
                lazy: false,
            },
        });

        await nextTick();
        await wrapper.setProps({ modelValue: 'two' });
        await wrapper.setProps({ theme: 'dark' });
        await wrapper.setProps({ readonly: true });

        expect(adapter.setValue).toHaveBeenCalledWith(expect.anything(), 'two');
        expect(adapter.setTheme).toHaveBeenCalledWith(expect.anything(), 'dark');
        expect(adapter.setReadonly).toHaveBeenCalledWith(expect.anything(), true);
    });

    it('defers mount until visible in lazy mode', async () => {
        let intersectionCallback: (
            entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>,
        ) => void = () => undefined;
        globalThis.IntersectionObserver = class {
            constructor(callback: (entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>) => void) {
                intersectionCallback = callback;
            }

            observe() {}

            disconnect() {}
        } as unknown as typeof IntersectionObserver;

        const { adapter } = createAdapter();
        mount(CodeEditor, {
            props: {
                adapter,
                lazy: true,
            },
        });

        expect(adapter.mount).not.toHaveBeenCalled();
        intersectionCallback([{ isIntersecting: true, intersectionRatio: 1 }]);
        await nextTick();
        expect(adapter.mount).toHaveBeenCalledTimes(1);
    });

    it('shows no-adapter state and avoids mount', () => {
        const wrapper = mount(CodeEditor, {
            props: {
                adapter: undefined,
                noAdapterText: 'Missing adapter',
            },
        });

        expect(wrapper.text()).toContain('Missing adapter');
    });
});
