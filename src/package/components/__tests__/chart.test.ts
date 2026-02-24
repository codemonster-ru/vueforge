import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import Chart from '../chart.vue';
import type { ChartAdapter } from '../chart-adapter';

const data = {
    labels: ['Jan', 'Feb'],
    datasets: [{ label: 'Revenue', data: [120, 180] }],
};

describe('Chart', () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    const originalIntersectionObserver = globalThis.IntersectionObserver;

    afterEach(() => {
        globalThis.ResizeObserver = originalResizeObserver;
        globalThis.IntersectionObserver = originalIntersectionObserver;
    });

    const createAdapter = () => {
        const instance = { id: 'chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('mounts chart through adapter and emits ready', async () => {
        const { adapter, instance } = createAdapter();
        const wrapper = mount(Chart, {
            props: {
                adapter,
                data,
            },
        });

        await nextTick();

        expect(adapter.mount).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('ready')?.[0]).toEqual([instance]);
    });

    it('updates adapter when data changes', async () => {
        const { adapter } = createAdapter();
        const wrapper = mount(Chart, {
            props: {
                adapter,
                data,
            },
        });

        await wrapper.setProps({
            data: {
                ...data,
                datasets: [{ label: 'Revenue', data: [140, 190] }],
            },
        });

        expect(adapter.update).toHaveBeenCalled();
    });

    it('shows loading and empty states without mounting chart', async () => {
        const { adapter } = createAdapter();
        const wrapper = mount(Chart, {
            props: {
                adapter,
                data: { labels: [], datasets: [] },
                loading: true,
            },
        });

        expect(wrapper.text()).toContain('Loading chart...');
        expect(adapter.mount).not.toHaveBeenCalled();

        await wrapper.setProps({ loading: false });
        expect(wrapper.text()).toContain('No chart data');
        expect(adapter.mount).not.toHaveBeenCalled();
    });

    it('destroys adapter instance on unmount', () => {
        const { adapter } = createAdapter();
        const wrapper = mount(Chart, {
            props: {
                adapter,
                data,
            },
        });

        wrapper.unmount();
        expect(adapter.destroy).toHaveBeenCalledTimes(1);
    });

    it('exposes aria semantics on canvas', () => {
        const { adapter } = createAdapter();
        const wrapper = mount(Chart, {
            props: {
                adapter,
                data,
                ariaLabel: 'Revenue by month',
            },
        });

        const canvas = wrapper.find('canvas');
        expect(canvas.attributes('role')).toBe('img');
        expect(canvas.attributes('aria-label')).toBe('Revenue by month');
    });

    it('defers adapter mount until visible when lazy mode is enabled', async () => {
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
        mount(Chart, {
            props: {
                adapter,
                data,
                lazy: true,
            },
        });

        expect(adapter.mount).not.toHaveBeenCalled();

        intersectionCallback([{ isIntersecting: true, intersectionRatio: 1 }]);
        await nextTick();

        expect(adapter.mount).toHaveBeenCalledTimes(1);
    });

    it('uses resize observer and window resize fallback for adapter resize', async () => {
        let resizeCallback: () => void = () => undefined;
        globalThis.ResizeObserver = class {
            constructor(callback: () => void) {
                resizeCallback = callback;
            }

            observe() {}

            disconnect() {}
        } as unknown as typeof ResizeObserver;

        const { adapter } = createAdapter();
        mount(Chart, {
            props: {
                adapter,
                data,
                lazy: false,
            },
        });

        resizeCallback();
        window.dispatchEvent(new Event('resize'));
        await nextTick();

        expect(adapter.resize).toHaveBeenCalled();
    });
});
