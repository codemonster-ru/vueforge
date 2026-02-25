import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import BarChart from '../bar-chart.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('BarChart', () => {
    const createAdapter = () => {
        const instance = { id: 'bar-chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds bar datasets from labels and series', async () => {
        const { adapter } = createAdapter();
        mount(BarChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['Jan', 'Feb'],
                series: [{ label: 'Revenue', data: [120, 180] }],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            data: { labels?: Array<string>; datasets?: Array<{ grouped?: boolean }> };
        };
        expect(config.type).toBe('bar');
        expect(config.data.labels).toEqual(['Jan', 'Feb']);
        expect(config.data.datasets?.[0]?.grouped).toBe(true);
    });

    it('supports stacked horizontal mode', async () => {
        const { adapter } = createAdapter();
        mount(BarChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['A', 'B'],
                stacked: true,
                horizontal: true,
                series: [
                    { label: 'North', data: [12, 24], stack: 'sales' },
                    { label: 'South', data: [8, 18], stack: 'sales' },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: {
                indexAxis?: string;
                scales?: { x?: { stacked?: boolean }; y?: { stacked?: boolean } };
            };
        };
        expect(config.options?.indexAxis).toBe('y');
        expect(config.options?.scales?.x?.stacked).toBe(true);
        expect(config.options?.scales?.y?.stacked).toBe(true);
    });

    it('allows overriding base options', async () => {
        const { adapter } = createAdapter();
        mount(BarChart, {
            props: {
                adapter,
                lazy: false,
                horizontal: true,
                labels: ['Q1'],
                series: [{ label: 'Revenue', data: [10] }],
                options: {
                    indexAxis: 'x',
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
                indexAxis?: string;
                scales?: { x?: { stacked?: boolean }; y?: { stacked?: boolean } };
            };
        };
        expect(config.options?.indexAxis).toBe('x');
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

        const wrapper = mount(BarChart, {
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
