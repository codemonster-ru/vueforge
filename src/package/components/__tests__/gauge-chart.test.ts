import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import GaugeChart from '../gauge-chart.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('GaugeChart', () => {
    const createAdapter = () => {
        const instance = { id: 'gauge-chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds doughnut dataset for radial gauge', async () => {
        const { adapter } = createAdapter();
        mount(GaugeChart, {
            props: {
                adapter,
                lazy: false,
                value: 72,
                min: 0,
                max: 100,
                label: 'SLA',
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            data: { datasets?: Array<{ data?: Array<number>; circumference?: number; rotation?: number }> };
        };
        expect(config.type).toBe('doughnut');
        expect(config.data.datasets?.[0]?.data).toEqual([72, 28]);
        expect(config.data.datasets?.[0]?.circumference).toBe(180);
        expect(config.data.datasets?.[0]?.rotation).toBe(270);
    });

    it('clamps value to min/max and renders center summary', async () => {
        const { adapter } = createAdapter();
        const wrapper = mount(GaugeChart, {
            props: {
                adapter,
                lazy: false,
                value: 220,
                min: 10,
                max: 110,
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            data: { datasets?: Array<{ data?: Array<number> }> };
        };
        expect(config.data.datasets?.[0]?.data).toEqual([100, 0]);
        expect(wrapper.find('.vf-gauge-chart__value').text()).toBe('110');
        expect(wrapper.find('.vf-gauge-chart__label').text()).toBe('100%');
    });

    it('supports formatter and tooltip contracts', async () => {
        const formatter = vi.fn((value: number, ratio: number) => `${value}:${Math.round(ratio * 100)}%`);
        const { adapter } = createAdapter();
        mount(GaugeChart, {
            props: {
                adapter,
                lazy: false,
                value: 75,
                formatter,
                label: 'Availability',
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: {
                plugins?: {
                    tooltip?: { callbacks?: { label?: (ctx: { dataIndex?: number; parsed?: number }) => string } };
                };
            };
        };
        const primary = config.options?.plugins?.tooltip?.callbacks?.label?.({ dataIndex: 0, parsed: 75 });
        const secondary = config.options?.plugins?.tooltip?.callbacks?.label?.({ dataIndex: 1, parsed: 25 });
        expect(primary).toContain('Availability');
        expect(secondary).toContain('Remaining');
        expect(formatter).toHaveBeenCalled();
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(GaugeChart, {
            props: {
                adapter,
                lazy: false,
                value: 20,
            },
        });

        await nextTick();

        expect(wrapper.emitted('error')?.[0]).toEqual([error]);

        const vm = wrapper.vm as unknown as ComponentPublicInstance<{ resize: () => void; refresh: () => void }>;
        expect(typeof vm.resize).toBe('function');
        expect(typeof vm.refresh).toBe('function');
    });
});
