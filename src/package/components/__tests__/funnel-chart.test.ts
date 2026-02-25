import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import FunnelChart from '../funnel-chart.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('FunnelChart', () => {
    const createAdapter = () => {
        const instance = { id: 'funnel-chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds horizontal funnel dataset from stages', async () => {
        const { adapter } = createAdapter();
        mount(FunnelChart, {
            props: {
                adapter,
                lazy: false,
                stages: [
                    { label: 'Visitors', value: 1000 },
                    { label: 'Signups', value: 300 },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            options?: { indexAxis?: string };
            data: { labels?: Array<string>; datasets?: Array<{ data?: Array<number> }> };
        };
        expect(config.type).toBe('bar');
        expect(config.options?.indexAxis).toBe('y');
        expect(config.data.labels?.[0]).toContain('Visitors');
        expect(config.data.datasets?.[0]?.data).toEqual([1000, 300]);
    });

    it('supports conversion labels and stage sorting', async () => {
        const { adapter } = createAdapter();
        mount(FunnelChart, {
            props: {
                adapter,
                lazy: false,
                descending: true,
                showConversionLabels: true,
                stages: [
                    { label: 'Purchase', value: 80 },
                    { label: 'Visitors', value: 1000 },
                    { label: 'Signups', value: 300 },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            data: { labels?: Array<string> };
        };
        expect(config.data.labels?.[0]).toContain('Visitors');
        expect(config.data.labels?.[1]).toContain('30.0%');
        expect(config.data.labels?.[2]).toContain('8.0%');
    });

    it('supports tooltip contract with conversion and drop-off', async () => {
        const { adapter } = createAdapter();
        mount(FunnelChart, {
            props: {
                adapter,
                lazy: false,
                stages: [
                    { label: 'Visitors', value: 1000 },
                    { label: 'Signups', value: 300 },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: {
                plugins?: {
                    tooltip?: {
                        callbacks?: {
                            label?: (ctx: { dataIndex?: number; parsed?: { x?: number } }) => string;
                        };
                    };
                };
            };
        };
        const text = config.options?.plugins?.tooltip?.callbacks?.label?.({
            dataIndex: 1,
            parsed: { x: 300 },
        });
        expect(text).toContain('conv 30.0%');
        expect(text).toContain('drop 70.0%');
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(FunnelChart, {
            props: {
                adapter,
                lazy: false,
                stages: [{ label: 'Visitors', value: 100 }],
            },
        });

        await nextTick();

        expect(wrapper.emitted('error')?.[0]).toEqual([error]);

        const vm = wrapper.vm as unknown as ComponentPublicInstance<{ resize: () => void; refresh: () => void }>;
        expect(typeof vm.resize).toBe('function');
        expect(typeof vm.refresh).toBe('function');
    });
});
