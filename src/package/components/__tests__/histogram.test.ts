import { mount } from '@vue/test-utils';
import { nextTick, type ComponentPublicInstance } from 'vue';
import { vi } from 'vitest';
import Histogram from '../histogram.vue';
import type { ChartAdapter } from '../chart-adapter';

describe('Histogram', () => {
    const createAdapter = () => {
        const instance = { id: 'histogram-instance' };
        const adapter: ChartAdapter = {
            mount: vi.fn(() => instance),
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
        };

        return { adapter, instance };
    };

    it('builds bins and count dataset from values', async () => {
        const { adapter } = createAdapter();
        mount(Histogram, {
            props: {
                adapter,
                lazy: false,
                values: [1, 2, 2, 3, 4, 5, 5, 6],
                binStrategy: 'sturges',
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            type: string;
            data: { datasets?: Array<{ label?: string; data?: Array<number> }> };
        };
        expect(config.type).toBe('bar');
        expect(config.data.datasets?.[0]?.label).toBe('Frequency');
        const total = config.data.datasets?.[0]?.data?.reduce((sum, value) => sum + value, 0);
        expect(total).toBe(8);
    });

    it('supports fixed bin strategy via binSize', async () => {
        const { adapter } = createAdapter();
        mount(Histogram, {
            props: {
                adapter,
                lazy: false,
                values: [0, 1, 2, 3, 4, 5],
                binStrategy: 'fixed',
                binSize: 2,
                min: 0,
                max: 6,
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            data: { labels?: Array<string> };
        };
        expect(config.data.labels?.length).toBe(3);
    });

    it('adds density overlay dataset when enabled', async () => {
        const { adapter } = createAdapter();
        mount(Histogram, {
            props: {
                adapter,
                lazy: false,
                densityOverlay: true,
                values: [1, 2, 3, 4, 5, 6],
            },
        });

        await nextTick();

        const config = (adapter.mount as ReturnType<typeof vi.fn>).mock.calls[0][1] as {
            data: { datasets?: Array<{ label?: string; yAxisID?: string }> };
            options?: { scales?: { yDensity?: { display?: boolean } } };
        };
        expect(config.data.datasets?.length).toBe(2);
        expect(config.data.datasets?.[1]?.label).toBe('Density');
        expect(config.data.datasets?.[1]?.yAxisID).toBe('yDensity');
        expect(config.options?.scales?.yDensity?.display).toBe(true);
    });

    it('forwards adapter errors and exposes methods', async () => {
        const error = new Error('adapter failed');
        const adapter: ChartAdapter = {
            mount: vi.fn(() => {
                throw error;
            }),
        };

        const wrapper = mount(Histogram, {
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
