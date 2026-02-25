import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import ScatterChart from '../scatter-chart.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('ScatterChart', () => {
    const createAdapter = () => {
        const instance = { id: 'scatter-chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds scatter datasets from series points', async () => {
        const { adapter } = createAdapter();
        mount(ScatterChart, {
            props: {
                adapter,
                lazy: false,
                series: [{ label: 'Latency', data: [{ x: 1, y: 120 }] }],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            data: { datasets?: Array<{ label?: string; data?: Array<{ x: number; y: number }> }> };
        };
        expect(config.type).toBe('scatter');
        expect(config.data.datasets?.[0]?.label).toBe('Latency');
        expect(config.data.datasets?.[0]?.data).toEqual([{ x: 1, y: 120 }]);
    });

    it('adds regression line dataset when enabled', async () => {
        const { adapter } = createAdapter();
        mount(ScatterChart, {
            props: {
                adapter,
                lazy: false,
                regressionLine: true,
                series: [
                    {
                        label: 'Conversion',
                        data: [
                            { x: 1, y: 2 },
                            { x: 2, y: 4 },
                            { x: 3, y: 6 },
                        ],
                    },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            data: { datasets?: Array<{ label?: string; showLine?: boolean; pointRadius?: number }> };
        };
        expect(config.data.datasets?.length).toBe(2);
        expect(config.data.datasets?.[1]?.label).toContain('Regression');
        expect(config.data.datasets?.[1]?.showLine).toBe(true);
        expect(config.data.datasets?.[1]?.pointRadius).toBe(0);
    });

    it('supports cluster splitting and palette', async () => {
        const { adapter } = createAdapter();
        mount(ScatterChart, {
            props: {
                adapter,
                lazy: false,
                clusterOptions: {
                    enabled: true,
                    palette: ['#111111', '#222222'],
                },
                series: [
                    {
                        label: 'Segments',
                        data: [
                            { x: 1, y: 3, cluster: 'A' },
                            { x: 2, y: 4, cluster: 'B' },
                            { x: 3, y: 5, cluster: 'A' },
                        ],
                    },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            data: { datasets?: Array<{ label?: string; pointBackgroundColor?: string; data?: Array<unknown> }> };
        };
        expect(config.data.datasets?.length).toBe(2);
        expect(config.data.datasets?.[0]?.label).toContain('(A)');
        expect(config.data.datasets?.[0]?.pointBackgroundColor).toBe('#111111');
        expect(config.data.datasets?.[1]?.label).toContain('(B)');
        expect(config.data.datasets?.[1]?.pointBackgroundColor).toBe('#222222');
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(ScatterChart, {
            props: {
                adapter,
                lazy: false,
                series: [{ label: 'Scatter', data: [{ x: 1, y: 1 }] }],
            },
        });

        await nextTick();

        expect(wrapper.emitted('error')?.[0]).toEqual([error]);

        const vm = wrapper.vm as unknown as ComponentPublicInstance<{ resize: () => void; refresh: () => void }>;
        expect(typeof vm.resize).toBe('function');
        expect(typeof vm.refresh).toBe('function');
    });
});
