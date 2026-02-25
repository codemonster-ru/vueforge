import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import LineChart from '../line-chart.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('LineChart', () => {
    const createAdapter = () => {
        const instance = { id: 'line-chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds line datasets from labels and series', async () => {
        const { adapter } = createAdapter();
        mount(LineChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['Jan', 'Feb', 'Mar'],
                series: [{ label: 'Revenue', data: [120, null, 180] }],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            data: { datasets?: Array<{ data?: Array<number | null>; spanGaps?: boolean }> };
        };
        expect(config.type).toBe('line');
        expect(config.data.datasets?.[0]?.data).toEqual([120, null, 180]);
        expect(config.data.datasets?.[0]?.spanGaps).toBe(false);
    });

    it('adds threshold overlay datasets and spanGaps settings', async () => {
        const { adapter } = createAdapter();
        mount(LineChart, {
            props: {
                adapter,
                lazy: false,
                spanGaps: true,
                labels: ['Q1', 'Q2'],
                series: [{ label: 'MRR', data: [100, 130] }],
                thresholds: [{ value: 120, label: 'Target', color: '#10b981' }],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: { spanGaps?: boolean };
            data: { datasets?: Array<{ label?: string; data?: Array<number | null> }> };
        };
        expect(config.options?.spanGaps).toBe(true);
        expect(config.data.datasets?.length).toBe(2);
        expect(config.data.datasets?.[1]?.label).toBe('Target');
        expect(config.data.datasets?.[1]?.data).toEqual([120, 120]);
    });

    it('allows overriding base options', async () => {
        const { adapter } = createAdapter();
        mount(LineChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['Q1'],
                series: [{ label: 'Revenue', data: [10] }],
                curve: 'smooth',
                options: {
                    spanGaps: false,
                    elements: {
                        line: {
                            tension: 0.9,
                        },
                    },
                },
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: {
                spanGaps?: boolean;
                elements?: { line?: { tension?: number } };
            };
        };
        expect(config.options?.spanGaps).toBe(false);
        expect(config.options?.elements?.line?.tension).toBe(0.9);
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(LineChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['Q1'],
                series: [{ label: 'Revenue', data: [10] }],
            },
        });

        await nextTick();

        expect(wrapper.emitted('error')?.[0]).toEqual([error]);

        const vm = wrapper.vm as unknown as ComponentPublicInstance<{ resize: () => void; refresh: () => void }>;
        expect(typeof vm.resize).toBe('function');
        expect(typeof vm.refresh).toBe('function');
    });
});
