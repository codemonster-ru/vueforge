import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import Heatmap from '../heatmap.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('Heatmap', () => {
    const createAdapter = () => {
        const instance = { id: 'heatmap-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds heatmap dataset from cells and labels', async () => {
        const { adapter } = createAdapter();
        mount(Heatmap, {
            props: {
                adapter,
                lazy: false,
                xLabels: ['Mon', 'Tue'],
                yLabels: ['A', 'B'],
                cells: [
                    { x: 'Mon', y: 'A', value: 12 },
                    { x: 'Tue', y: 'B', value: 30 },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            data: { datasets?: Array<{ data?: Array<{ x: number; y: number; value: number }> }> };
        };
        expect(config.type).toBe('bubble');
        expect(config.data.datasets?.[0]?.data?.[0]).toMatchObject({ x: 0, y: 0, value: 12 });
        expect(config.data.datasets?.[0]?.data?.[1]).toMatchObject({ x: 1, y: 1, value: 30 });
    });

    it('renders range legend items when enabled', async () => {
        const { adapter } = createAdapter();
        const wrapper = mount(Heatmap, {
            props: {
                adapter,
                lazy: false,
                colorRange: ['#111111', '#222222', '#333333'],
                cells: [
                    { x: 'x1', y: 'y1', value: 1 },
                    { x: 'x2', y: 'y2', value: 9 },
                ],
            },
        });

        await nextTick();

        expect(wrapper.findAll('.vf-heatmap__legend-item')).toHaveLength(3);
    });

    it('supports axis label callbacks and tooltip contract', async () => {
        const { adapter } = createAdapter();
        mount(Heatmap, {
            props: {
                adapter,
                lazy: false,
                xLabels: ['Mon', 'Tue'],
                yLabels: ['A', 'B'],
                cells: [{ x: 'Tue', y: 'A', value: 7 }],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: {
                scales?: {
                    x?: { ticks?: { callback?: (value: number) => string } };
                    y?: { ticks?: { callback?: (value: number) => string } };
                };
                plugins?: {
                    tooltip?: {
                        callbacks?: {
                            label?: (ctx: {
                                raw?: { value?: number; rawXLabel?: string; rawYLabel?: string };
                            }) => string;
                        };
                    };
                };
            };
        };
        expect(config.options?.scales?.x?.ticks?.callback?.(1)).toBe('Tue');
        expect(config.options?.scales?.y?.ticks?.callback?.(0)).toBe('A');
        expect(
            config.options?.plugins?.tooltip?.callbacks?.label?.({
                raw: { value: 7, rawXLabel: 'Tue', rawYLabel: 'A' },
            }),
        ).toBe('Tue / A: 7');
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(Heatmap, {
            props: {
                adapter,
                lazy: false,
                cells: [{ x: 'Mon', y: 'A', value: 10 }],
            },
        });

        await nextTick();

        expect(wrapper.emitted('error')?.[0]).toEqual([error]);

        const vm = wrapper.vm as unknown as ComponentPublicInstance<{ resize: () => void; refresh: () => void }>;
        expect(typeof vm.resize).toBe('function');
        expect(typeof vm.refresh).toBe('function');
    });
});
