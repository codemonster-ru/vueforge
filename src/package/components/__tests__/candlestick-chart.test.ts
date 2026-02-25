import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import CandlestickChart from '../candlestick-chart.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('CandlestickChart', () => {
    const createAdapter = () => {
        const instance = { id: 'candlestick-chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds OHLC datasets from points', async () => {
        const { adapter } = createAdapter();
        mount(CandlestickChart, {
            props: {
                adapter,
                lazy: false,
                points: [
                    { label: '2026-01-01', open: 100, high: 108, low: 95, close: 105, volume: 1200 },
                    { label: '2026-01-02', open: 105, high: 110, low: 101, close: 103, volume: 900 },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            data: {
                datasets?: Array<{ label?: string; data?: Array<number | Array<number>>; yAxisID?: string }>;
            };
        };
        expect(config.type).toBe('bar');
        expect(config.data.datasets?.[0]?.label).toBe('Range');
        expect(config.data.datasets?.[0]?.data?.[0]).toEqual([95, 108]);
        expect(config.data.datasets?.[1]?.label).toBe('Body');
        expect(config.data.datasets?.[1]?.data?.[0]).toEqual([100, 105]);
        expect(config.data.datasets?.[0]?.yAxisID).toBe('yPrice');
    });

    it('adds volume overlay dataset when enabled', async () => {
        const { adapter } = createAdapter();
        mount(CandlestickChart, {
            props: {
                adapter,
                lazy: false,
                showVolume: true,
                points: [{ label: '2026-01-01', open: 100, high: 108, low: 95, close: 105, volume: 1200 }],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            data: { datasets?: Array<{ label?: string; yAxisID?: string; data?: Array<number> }> };
            options?: { scales?: { yVolume?: { display?: boolean } } };
        };
        expect(config.data.datasets?.length).toBe(3);
        expect(config.data.datasets?.[2]?.label).toBe('Volume');
        expect(config.data.datasets?.[2]?.yAxisID).toBe('yVolume');
        expect(config.data.datasets?.[2]?.data).toEqual([1200]);
        expect(config.options?.scales?.yVolume?.display).toBe(true);
    });

    it('supports bullish/bearish color mapping and tooltip contract', async () => {
        const { adapter } = createAdapter();
        mount(CandlestickChart, {
            props: {
                adapter,
                lazy: false,
                bullishColor: '#00aa00',
                bearishColor: '#aa0000',
                points: [
                    { label: 'up', open: 10, high: 12, low: 9, close: 11 },
                    { label: 'down', open: 11, high: 11.5, low: 8, close: 9 },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            data: { datasets?: Array<{ backgroundColor?: Array<string> }> };
            options?: {
                plugins?: { tooltip?: { callbacks?: { label?: (ctx: { dataIndex?: number }) => string } } };
            };
        };
        expect(config.data.datasets?.[1]?.backgroundColor).toEqual(['#00aa00', '#aa0000']);
        const tooltip = config.options?.plugins?.tooltip?.callbacks?.label?.({ dataIndex: 1 });
        expect(tooltip).toContain('O 11');
        expect(tooltip).toContain('C 9');
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(CandlestickChart, {
            props: {
                adapter,
                lazy: false,
                points: [{ label: 'x', open: 1, high: 2, low: 0.5, close: 1.5 }],
            },
        });

        await nextTick();

        expect(wrapper.emitted('error')?.[0]).toEqual([error]);

        const vm = wrapper.vm as unknown as ComponentPublicInstance<{ resize: () => void; refresh: () => void }>;
        expect(typeof vm.resize).toBe('function');
        expect(typeof vm.refresh).toBe('function');
    });
});
