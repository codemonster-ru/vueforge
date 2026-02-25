import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import DonutChart from '../donut-chart.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('DonutChart', () => {
    it('uses donut rendering mode and re-emits events', async () => {
        const instance = { id: 'donut-chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        const wrapper = mount(DonutChart, {
            props: {
                adapter,
                lazy: false,
                labels: ['A', 'B'],
                series: [{ data: [40, 60] }],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as { type: string };
        expect(config.type).toBe('doughnut');

        await wrapper.find('.vf-pie-chart__legend-button').trigger('click');
        expect(wrapper.emitted('legendToggle')?.length).toBe(1);
        expect(wrapper.emitted('drilldown')?.length).toBe(1);
    });
});
