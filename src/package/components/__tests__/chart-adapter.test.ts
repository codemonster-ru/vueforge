import { describe, expect, it, vi } from 'vitest';
import { createChartJsAdapter, type ChartConfig } from '../chart-adapter';

describe('createChartJsAdapter', () => {
    const createConfig = (): ChartConfig => ({
        type: 'line',
        data: {
            labels: ['Jan', 'Feb'],
            datasets: [{ label: 'Revenue', data: [120, 140] }],
        },
        options: {
            responsive: true,
        },
    });

    it('mounts chart.js-like instance with mapped config', () => {
        const ctorSpy = vi.fn();
        class FakeChart {
            update = vi.fn();
            resize = vi.fn();
            destroy = vi.fn();
            config = createConfig();

            constructor(context: CanvasRenderingContext2D, config: ChartConfig) {
                ctorSpy(context, config);
                this.config = config;
            }
        }

        const adapter = createChartJsAdapter(FakeChart);
        const canvas = {
            getContext: vi.fn(() => ({ fillRect: vi.fn() })),
        } as unknown as HTMLCanvasElement;
        const config = createConfig();

        const mounted = adapter.mount(canvas, config);

        expect(mounted).toBeInstanceOf(FakeChart);
        expect(ctorSpy).toHaveBeenCalledTimes(1);
        expect(ctorSpy).toHaveBeenCalledWith(expect.any(Object), {
            type: 'line',
            data: config.data,
            options: config.options,
        });
    });

    it('throws when 2d canvas context is unavailable', () => {
        const ctorSpy = vi.fn();
        class FakeChart {
            update = vi.fn();
            resize = vi.fn();
            destroy = vi.fn();
            config = createConfig();

            constructor() {
                ctorSpy();
            }
        }

        const adapter = createChartJsAdapter(FakeChart);
        const canvas = {
            getContext: vi.fn(() => null),
        } as unknown as HTMLCanvasElement;

        expect(() => adapter.mount(canvas, createConfig())).toThrow('2D canvas context is not available');
        expect(ctorSpy).not.toHaveBeenCalled();
    });

    it('updates existing chart config then calls update', () => {
        const instance = {
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
            config: createConfig(),
        };
        class FakeChart {
            update = vi.fn();
            resize = vi.fn();
            destroy = vi.fn();
            config = createConfig();

            constructor() {}
        }
        const adapter = createChartJsAdapter(FakeChart);

        adapter.update?.(instance, {
            type: 'bar',
            data: {
                labels: ['Mar'],
                datasets: [{ label: 'Revenue', data: [190] }],
            },
            options: { plugins: { legend: { display: false } } },
        });

        expect(instance.config.type).toBe('bar');
        expect(instance.config.data.labels).toEqual(['Mar']);
        expect(instance.update).toHaveBeenCalledTimes(1);
    });

    it('delegates resize and destroy to chart instance methods', () => {
        const instance = {
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
            config: createConfig(),
        };
        class FakeChart {
            update = vi.fn();
            resize = vi.fn();
            destroy = vi.fn();
            config = createConfig();

            constructor() {}
        }
        const adapter = createChartJsAdapter(FakeChart);

        adapter.resize?.(instance);
        adapter.destroy?.(instance);

        expect(instance.resize).toHaveBeenCalledTimes(1);
        expect(instance.destroy).toHaveBeenCalledTimes(1);
    });

    it('exports png through chart.js toBase64Image when available', () => {
        const instance = {
            update: vi.fn(),
            resize: vi.fn(),
            destroy: vi.fn(),
            toBase64Image: vi.fn(() => 'data:image/png;base64,mock'),
            config: createConfig(),
        };
        class FakeChart {
            update = vi.fn();
            resize = vi.fn();
            destroy = vi.fn();
            toBase64Image = vi.fn(() => 'data:image/png;base64,mock');
            config = createConfig();

            constructor() {}
        }
        const adapter = createChartJsAdapter(FakeChart);

        expect(adapter.exportPng?.(instance, createConfig())).toBe('data:image/png;base64,mock');
    });
});
