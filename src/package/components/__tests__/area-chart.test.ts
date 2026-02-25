import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import AreaChart from '../area-chart.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('AreaChart', () => {
    const createAdapter = () => {
        const instance = { id: 'area-chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds area datasets from labels and series with default fill', async () => {
        const { adapter } = createAdapter();
        mount(AreaChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['Jan', 'Feb', 'Mar'],
                series: [{ label: 'MRR', data: [120, 140, 180] }],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            data: { datasets?: Array<{ fill?: boolean }> };
        };
        expect(config.data.datasets?.[0]?.fill).toBe(true);
    });

    it('supports stacked and normalized variants', async () => {
        const { adapter } = createAdapter();
        mount(AreaChart, {
            props: {
                adapter,
                lazy: false,
                stacked: true,
                normalized: true,
                labels: ['Q1', 'Q2'],
                series: [
                    { label: 'North', data: [30, 40] },
                    { label: 'South', data: [20, 25] },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: {
                normalized?: boolean;
                scales?: { x?: { stacked?: boolean }; y?: { stacked?: boolean } };
            };
            data: { datasets?: Array<{ stack?: string }> };
        };
        expect(config.options?.normalized).toBe(true);
        expect(config.options?.scales?.x?.stacked).toBe(true);
        expect(config.options?.scales?.y?.stacked).toBe(true);
        expect(config.data.datasets?.[0]?.stack).toBe('area');
    });

    it('allows overriding base options', async () => {
        const { adapter } = createAdapter();
        mount(AreaChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['Q1'],
                series: [{ label: 'Revenue', data: [10] }],
                options: {
                    normalized: false,
                    scales: {
                        x: { stacked: false },
                        y: { stacked: false },
                    },
                },
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: {
                normalized?: boolean;
                scales?: { x?: { stacked?: boolean }; y?: { stacked?: boolean } };
            };
        };
        expect(config.options?.normalized).toBe(false);
        expect(config.options?.scales?.x?.stacked).toBe(false);
        expect(config.options?.scales?.y?.stacked).toBe(false);
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(AreaChart, {
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
