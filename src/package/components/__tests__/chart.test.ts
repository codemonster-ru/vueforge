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
        expect(canvas.attributes('tabindex')).toBe('0');
    });

    it('exposes screen-reader summary and keyboard hint through aria-describedby', () => {
        const { adapter } = createAdapter();
        const wrapper = mount(Chart, {
            props: {
                adapter,
                data,
                a11ySummary: 'Quarterly revenue trend for FY2026.',
                a11yKeyboardHint: 'Use the table toggle button to inspect exact values.',
            },
        });

        const canvas = wrapper.find('canvas');
        const descriptionId = canvas.attributes('aria-describedby');
        expect(descriptionId).toBeTruthy();
        const description = wrapper.find(`#${descriptionId}`);
        expect(description.exists()).toBe(true);
        expect(description.text()).toContain('Quarterly revenue trend for FY2026.');
        expect(description.text()).toContain('Use the table toggle button to inspect exact values.');
    });

    it('renders keyboard-accessible data table fallback when enabled', async () => {
        const { adapter } = createAdapter();
        const wrapper = mount(Chart, {
            props: {
                adapter,
                data: {
                    labels: ['Q1', 'Q2'],
                    datasets: [
                        { label: 'Revenue', data: [120, 180] },
                        { label: 'Cost', data: [80, 90] },
                    ],
                },
                a11yTableFallback: true,
                tableCaption: 'Revenue and cost by quarter',
                showTableText: 'Open table',
                hideTableText: 'Close table',
            },
        });

        const toggle = wrapper.find('.vf-chart__table-toggle');
        expect(toggle.exists()).toBe(true);
        expect(toggle.attributes('aria-expanded')).toBe('false');
        expect(wrapper.find('.vf-chart__table').exists()).toBe(false);

        await toggle.trigger('click');

        expect(toggle.attributes('aria-expanded')).toBe('true');
        expect(wrapper.find('.vf-chart__table caption').text()).toBe('Revenue and cost by quarter');
        const rows = wrapper.findAll('.vf-chart__table tbody tr');
        expect(rows).toHaveLength(2);
        expect(rows[0]?.text()).toContain('Q1');
        expect(rows[0]?.text()).toContain('120');
        expect(rows[0]?.text()).toContain('80');
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

    it('injects high-density decimation options for large datasets', async () => {
        const { adapter } = createAdapter();
        mount(Chart, {
            props: {
                adapter,
                data: {
                    labels: Array.from({ length: 1200 }, (_, index) => `P${index + 1}`),
                    datasets: [{ label: 'Load', data: Array.from({ length: 1200 }, (_, index) => index) }],
                },
                highDensity: true,
                highDensityPointThreshold: 1000,
                highDensityDecimationAlgorithm: 'min-max',
                highDensitySamples: 240,
                lazy: false,
            },
        });

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: Record<string, unknown>;
        };
        const plugins = config.options?.plugins as { decimation?: Record<string, unknown> } | undefined;
        expect(plugins?.decimation).toMatchObject({
            enabled: true,
            algorithm: 'min-max',
            threshold: 1000,
            samples: 240,
        });
    });

    it('supports export contracts and csv fallback', async () => {
        const { adapter, instance } = createAdapter();
        adapter.exportPng = vi.fn(() => 'data:image/png;base64,test');
        adapter.exportSvg = vi.fn(() => '<svg />');
        adapter.exportCsv = vi.fn(() => 'Label,Revenue\nQ1,120');

        const wrapper = mount(Chart, {
            props: {
                adapter,
                data,
                lazy: false,
            },
        });
        await nextTick();
        const exposed = wrapper.vm as unknown as {
            exportAsPng: () => string;
            exportAsSvg: () => string;
            exportAsCsv: () => string;
        };

        expect(exposed.exportAsPng()).toBe('data:image/png;base64,test');
        expect(exposed.exportAsSvg()).toBe('<svg />');
        expect(exposed.exportAsCsv()).toBe('Label,Revenue\nQ1,120');
        expect(adapter.exportPng).toHaveBeenCalledWith(instance, expect.any(Object));
        expect(adapter.exportSvg).toHaveBeenCalledWith(instance, expect.any(Object));
        expect(adapter.exportCsv).toHaveBeenCalledWith(instance, expect.any(Object));

        await wrapper.setProps({
            adapter: {
                mount: vi.fn(() => instance),
                destroy: vi.fn(),
            },
            data: {
                labels: ['Q1'],
                datasets: [{ label: 'Revenue', data: [120] }],
            },
        });

        expect(exposed.exportAsCsv()).toBe('Label,Revenue\nQ1,120');
    });

    it('applies print mode through class and adapter hook', async () => {
        const { adapter } = createAdapter();
        adapter.setPrintMode = vi.fn();
        const wrapper = mount(Chart, {
            props: {
                adapter,
                data,
                printMode: false,
                lazy: false,
            },
        });

        expect(wrapper.classes()).not.toContain('vf-chart_print');
        expect(adapter.setPrintMode).toHaveBeenCalledWith(expect.any(Object), false);

        await wrapper.setProps({ printMode: true });
        expect(wrapper.classes()).toContain('vf-chart_print');
        expect(adapter.setPrintMode).toHaveBeenCalledWith(expect.any(Object), true);
    });
});
