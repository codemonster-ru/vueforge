import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import BubbleChart from '../bubble-chart.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('BubbleChart', () => {
    const createAdapter = () => {
        const instance = { id: 'bubble-chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds bubble datasets and keeps explicit radius', async () => {
        const { adapter } = createAdapter();
        mount(BubbleChart, {
            props: {
                adapter,
                lazy: false,
                series: [{ label: 'Revenue', data: [{ x: 1, y: 10, r: 8 }] }],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            data: { datasets?: Array<{ data?: Array<{ r?: number }> }> };
        };
        expect(config.type).toBe('bubble');
        expect(config.data.datasets?.[0]?.data?.[0]?.r).toBe(8);
    });

    it('encodes radius from size value range', async () => {
        const { adapter } = createAdapter();
        mount(BubbleChart, {
            props: {
                adapter,
                lazy: false,
                minRadius: 5,
                maxRadius: 15,
                series: [
                    {
                        label: 'Segments',
                        data: [
                            { x: 1, y: 10, size: 10 },
                            { x: 2, y: 12, size: 20 },
                            { x: 3, y: 15, size: 30 },
                        ],
                    },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            data: { datasets?: Array<{ data?: Array<{ r?: number }> }> };
        };
        const radii = config.data.datasets?.[0]?.data?.map(point => point.r);
        expect(radii).toEqual([5, 10, 15]);
    });

    it('supports tooltip formatter contract', async () => {
        const tooltipFormatter = vi.fn(
            ({ label, x, y, r }: { label: string; x: number; y: number; r: number }) => `${label}:${x}-${y}-${r}`,
        );

        const { adapter } = createAdapter();
        mount(BubbleChart, {
            props: {
                adapter,
                lazy: false,
                tooltipFormatter,
                series: [{ label: 'North', data: [{ x: 2, y: 3, r: 9 }] }],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: {
                plugins?: {
                    tooltip?: {
                        callbacks?: {
                            label?: (ctx: {
                                dataset?: { label?: string };
                                raw?: { x?: number; y?: number; r?: number };
                            }) => string;
                        };
                    };
                };
            };
        };
        const tooltipLabel = config.options?.plugins?.tooltip?.callbacks?.label;
        const value = tooltipLabel?.({
            dataset: { label: 'North' },
            raw: { x: 2, y: 3, r: 9 },
        });
        expect(value).toBe('North:2-3-9');
        expect(tooltipFormatter).toHaveBeenCalled();
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(BubbleChart, {
            props: {
                adapter,
                lazy: false,
                series: [{ label: 'Bubble', data: [{ x: 1, y: 1 }] }],
            },
        });

        await nextTick();

        expect(wrapper.emitted('error')?.[0]).toEqual([error]);

        const vm = wrapper.vm as unknown as ComponentPublicInstance<{ resize: () => void; refresh: () => void }>;
        expect(typeof vm.resize).toBe('function');
        expect(typeof vm.refresh).toBe('function');
    });
});
