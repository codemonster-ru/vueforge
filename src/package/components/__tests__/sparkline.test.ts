import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import Sparkline from '../sparkline.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('Sparkline', () => {
    const createAdapter = () => {
        const instance = { id: 'sparkline-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds compact line dataset from values', async () => {
        const { adapter } = createAdapter();
        mount(Sparkline, {
            props: {
                adapter,
                lazy: false,
                values: [2, 4, 3, 5],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            data: { labels?: Array<number>; datasets?: Array<{ data?: Array<number>; fill?: boolean }> };
        };
        expect(config.type).toBe('line');
        expect(config.data.labels).toEqual([1, 2, 3, 4]);
        expect(config.data.datasets?.[0]?.data).toEqual([2, 4, 3, 5]);
        expect(config.data.datasets?.[0]?.fill).toBe(false);
    });

    it('supports area mode and point visibility', async () => {
        const { adapter } = createAdapter();
        mount(Sparkline, {
            props: {
                adapter,
                lazy: false,
                area: true,
                showPoints: true,
                pointRadius: 3,
                values: [1, 2, 3],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            data: {
                datasets?: Array<{
                    fill?: boolean;
                    pointRadius?: number;
                    pointHoverRadius?: number;
                    backgroundColor?: string;
                }>;
            };
        };
        expect(config.data.datasets?.[0]?.fill).toBe(true);
        expect(config.data.datasets?.[0]?.pointRadius).toBe(3);
        expect(config.data.datasets?.[0]?.pointHoverRadius).toBe(4);
        expect(config.data.datasets?.[0]?.backgroundColor).toContain('rgba');
    });

    it('hides axes for inline usage and allows overriding options', async () => {
        const { adapter } = createAdapter();
        mount(Sparkline, {
            props: {
                adapter,
                lazy: false,
                smooth: false,
                values: [5, 4, 3],
                options: {
                    scales: {
                        y: {
                            display: true,
                        },
                    },
                },
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            options?: {
                scales?: {
                    x?: { display?: boolean };
                    y?: { display?: boolean };
                };
                elements?: { line?: { tension?: number } };
            };
        };
        expect(config.options?.scales?.x?.display).toBe(false);
        expect(config.options?.scales?.y?.display).toBe(true);
        expect(config.options?.elements?.line?.tension).toBe(0);
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(Sparkline, {
            props: {
                adapter,
                lazy: false,
                values: [1, 2],
            },
        });

        await nextTick();

        expect(wrapper.emitted('error')?.[0]).toEqual([error]);

        const vm = wrapper.vm as unknown as ComponentPublicInstance<{ resize: () => void; refresh: () => void }>;
        expect(typeof vm.resize).toBe('function');
        expect(typeof vm.refresh).toBe('function');
    });
});
