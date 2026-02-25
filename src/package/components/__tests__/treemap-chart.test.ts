import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import TreemapChart from '../treemap-chart.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('TreemapChart', () => {
    const createAdapter = () => {
        const instance = { id: 'treemap-chart-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds leaf tiles from hierarchical nodes', async () => {
        const { adapter } = createAdapter();
        mount(TreemapChart, {
            props: {
                adapter,
                lazy: false,
                nodes: [
                    {
                        id: 'root',
                        label: 'Root',
                        children: [
                            { id: 'a', label: 'A', value: 60 },
                            { id: 'b', label: 'B', value: 40 },
                        ],
                    },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            data: { datasets?: Array<{ data?: Array<{ tile?: { id: string; value: number } }> }> };
        };
        expect(config.type).toBe('bubble');
        const tiles = config.data.datasets?.[0]?.data ?? [];
        expect(tiles).toHaveLength(2);
        expect(tiles[0]?.tile?.id).toBe('a');
        expect(tiles[1]?.tile?.id).toBe('b');
    });

    it('supports parentId-based flat hierarchy', async () => {
        const { adapter } = createAdapter();
        mount(TreemapChart, {
            props: {
                adapter,
                lazy: false,
                nodes: [
                    { id: 'root', label: 'Root', value: 100 },
                    { id: 'x', label: 'X', value: 70, parentId: 'root' },
                    { id: 'y', label: 'Y', value: 30, parentId: 'root' },
                ],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            data: { datasets?: Array<{ data?: Array<{ tile?: { id: string } }> }> };
        };
        const tileIds = (config.data.datasets?.[0]?.data ?? []).map(item => item.tile?.id);
        expect(tileIds).toEqual(['x', 'y']);
    });

    it('supports tooltip and axis tick contracts', async () => {
        const { adapter } = createAdapter();
        mount(TreemapChart, {
            props: {
                adapter,
                lazy: false,
                nodes: [{ id: 'a', label: 'A', value: 50 }],
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
                            label?: (ctx: { raw?: { tile?: { label?: string; value?: number } } }) => string;
                        };
                    };
                };
            };
        };
        expect(config.options?.scales?.x?.ticks?.callback?.(55)).toBe('55%');
        expect(config.options?.scales?.y?.ticks?.callback?.(40)).toBe('40%');
        expect(config.options?.plugins?.tooltip?.callbacks?.label?.({ raw: { tile: { label: 'A', value: 50 } } })).toBe(
            'A: 50',
        );
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(TreemapChart, {
            props: {
                adapter,
                lazy: false,
                nodes: [{ id: 'a', label: 'A', value: 10 }],
            },
        });

        await nextTick();

        expect(wrapper.emitted('error')?.[0]).toEqual([error]);

        const vm = wrapper.vm as unknown as ComponentPublicInstance<{ resize: () => void; refresh: () => void }>;
        expect(typeof vm.resize).toBe('function');
        expect(typeof vm.refresh).toBe('function');
    });
});
