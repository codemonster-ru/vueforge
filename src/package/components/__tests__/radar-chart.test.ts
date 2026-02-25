import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import RadarChart from '../radar-chart.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('RadarChart', () => {
    const createAdapter = () => {
        const instance = { id: 'radar-chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds radar datasets from labels and series', async () => {
        const { adapter } = createAdapter();
        mount(RadarChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['Speed', 'Reliability', 'Cost'],
                series: [{ label: 'Team A', data: [70, 90, 60] }],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            data: { labels?: Array<string>; datasets?: Array<{ label?: string; fill?: boolean }> };
        };
        expect(config.type).toBe('radar');
        expect(config.data.labels).toEqual(['Speed', 'Reliability', 'Cost']);
        expect(config.data.datasets?.[0]?.label).toBe('Team A');
        expect(config.data.datasets?.[0]?.fill).toBe(true);
    });

    it('supports multi-series comparison and scale options', async () => {
        const { adapter } = createAdapter();
        mount(RadarChart, {
            props: {
                adapter,
                lazy: false,
                beginAtZero: false,
                suggestedMin: 40,
                suggestedMax: 100,
                labels: ['A', 'B', 'C'],
                series: [
                    { label: 'Team A', data: [70, 90, 60] },
                    { label: 'Team B', data: [60, 80, 75], fill: false },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: {
                scales?: {
                    r?: { beginAtZero?: boolean; suggestedMin?: number; suggestedMax?: number };
                };
            };
            data: { datasets?: Array<{ fill?: boolean }> };
        };
        expect(config.data.datasets?.length).toBe(2);
        expect(config.data.datasets?.[1]?.fill).toBe(false);
        expect(config.options?.scales?.r?.beginAtZero).toBe(false);
        expect(config.options?.scales?.r?.suggestedMin).toBe(40);
        expect(config.options?.scales?.r?.suggestedMax).toBe(100);
    });

    it('allows overriding base options', async () => {
        const { adapter } = createAdapter();
        mount(RadarChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['A'],
                series: [{ label: 'Team', data: [10] }],
                options: {
                    scales: {
                        r: {
                            beginAtZero: true,
                            suggestedMin: 0,
                            suggestedMax: 120,
                        },
                    },
                },
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: {
                scales?: {
                    r?: { beginAtZero?: boolean; suggestedMin?: number; suggestedMax?: number };
                };
            };
        };
        expect(config.options?.scales?.r?.beginAtZero).toBe(true);
        expect(config.options?.scales?.r?.suggestedMin).toBe(0);
        expect(config.options?.scales?.r?.suggestedMax).toBe(120);
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(RadarChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['A'],
                series: [{ label: 'Team', data: [10] }],
            },
        });

        await nextTick();

        expect(wrapper.emitted('error')?.[0]).toEqual([error]);

        const vm = wrapper.vm as unknown as ComponentPublicInstance<{ resize: () => void; refresh: () => void }>;
        expect(typeof vm.resize).toBe('function');
        expect(typeof vm.refresh).toBe('function');
    });
});
