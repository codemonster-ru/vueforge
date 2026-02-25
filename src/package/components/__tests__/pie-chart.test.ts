import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import PieChart from '../pie-chart.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('PieChart', () => {
    const createAdapter = () => {
        const instance = { id: 'pie-chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('renders legend and builds pie chart config', async () => {
        const { adapter } = createAdapter();
        const wrapper = mount(PieChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['A', 'B'],
                series: [{ data: [30, 70], backgroundColor: ['#111111', '#222222'] }],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as { type: string };
        expect(config.type).toBe('pie');
        expect(wrapper.findAll('.vf-pie-chart__legend-item')).toHaveLength(2);
    });

    it('supports legend interaction and drilldown hooks', async () => {
        const { adapter } = createAdapter();
        const wrapper = mount(PieChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['Alpha', 'Beta'],
                series: [{ data: [10, 20] }],
            },
        });

        await wrapper.findAll('.vf-pie-chart__legend-button')[1]?.trigger('click');
        await nextTick();

        expect(wrapper.emitted('legendToggle')?.[0]?.[0]).toEqual({
            index: 1,
            label: 'Beta',
            hidden: true,
        });
        expect(wrapper.emitted('drilldown')?.[0]?.[0]).toMatchObject({
            source: 'legend',
            index: 1,
            label: 'Beta',
        });
        expect(adapter.update).toHaveBeenCalled();
    });

    it('supports donut variant and slice click hooks', async () => {
        const userOnClick = vi.fn();
        const { adapter } = createAdapter();
        const wrapper = mount(PieChart, {
            props: {
                adapter,
                lazy: false,
                variant: 'donut',
                labels: ['North', 'South'],
                series: [{ data: [55, 45] }],
                options: { onClick: userOnClick },
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            options?: {
                cutout?: string;
                onClick?: (event: unknown, elements: Array<{ index: number; datasetIndex: number }>) => void;
            };
        };
        expect(config.type).toBe('doughnut');
        expect(config.options?.cutout).toBe('60%');

        config.options?.onClick?.({}, [{ index: 0, datasetIndex: 0 }]);
        expect(wrapper.emitted('sliceClick')?.[0]?.[0]).toEqual({
            datasetIndex: 0,
            index: 0,
            label: 'North',
            value: 55,
        });
        expect(wrapper.emitted('drilldown')?.[0]?.[0]).toMatchObject({
            source: 'slice',
            index: 0,
            label: 'North',
            value: 55,
        });
        expect(userOnClick).toHaveBeenCalled();
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(PieChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['Q1'],
                series: [{ data: [10] }],
            },
        });

        await nextTick();

        expect(wrapper.emitted('error')?.[0]).toEqual([error]);

        const vm = wrapper.vm as unknown as ComponentPublicInstance<{ resize: () => void; refresh: () => void }>;
        expect(typeof vm.resize).toBe('function');
        expect(typeof vm.refresh).toBe('function');
    });
});
