import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import Lazy from '../lazy.vue';

describe('Lazy', () => {
    const originalIntersectionObserver = globalThis.IntersectionObserver;

    afterEach(() => {
        globalThis.IntersectionObserver = originalIntersectionObserver;
        vi.useRealTimers();
    });

    it('renders content immediately in eager mode', async () => {
        const wrapper = mount(Lazy, {
            props: {
                eager: true,
            },
            slots: {
                default: '<span class="payload">Ready</span>',
            },
        });

        await nextTick();
        expect(wrapper.find('.payload').exists()).toBe(true);
    });

    it('defers rendering until intersection', async () => {
        let intersectionCallback: (
            entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>,
        ) => void = () => undefined;

        globalThis.IntersectionObserver = class {
            constructor(callback: (entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>) => void) {
                intersectionCallback = callback;
            }

            observe() {}

            disconnect() {}
        } as unknown as typeof IntersectionObserver;

        const wrapper = mount(Lazy, {
            props: {
                eager: false,
                once: true,
            },
            slots: {
                default: '<span class="payload">Visible</span>',
                placeholder: '<span class="placeholder">Loading</span>',
            },
        });

        expect(wrapper.find('.payload').exists()).toBe(false);
        expect(wrapper.find('.placeholder').exists()).toBe(true);

        intersectionCallback([{ isIntersecting: true, intersectionRatio: 1 }]);
        await nextTick();

        expect(wrapper.find('.payload').exists()).toBe(true);
        expect(wrapper.emitted('enter')?.length).toBe(1);
    });

    it('supports repeat mount/unmount when once=false', async () => {
        let intersectionCallback: (
            entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>,
        ) => void = () => undefined;

        globalThis.IntersectionObserver = class {
            constructor(callback: (entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>) => void) {
                intersectionCallback = callback;
            }

            observe() {}

            disconnect() {}
        } as unknown as typeof IntersectionObserver;

        const wrapper = mount(Lazy, {
            props: {
                once: false,
            },
            slots: {
                default: '<span class="payload">Cycle</span>',
            },
        });

        intersectionCallback([{ isIntersecting: true, intersectionRatio: 1 }]);
        await nextTick();
        expect(wrapper.find('.payload').exists()).toBe(true);

        intersectionCallback([{ isIntersecting: false, intersectionRatio: 0 }]);
        await nextTick();
        expect(wrapper.find('.payload').exists()).toBe(false);
        expect(wrapper.emitted('leave')?.length).toBe(1);
    });

    it('applies delay before mounting content', async () => {
        vi.useFakeTimers();
        let intersectionCallback: (
            entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>,
        ) => void = () => undefined;

        globalThis.IntersectionObserver = class {
            constructor(callback: (entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>) => void) {
                intersectionCallback = callback;
            }

            observe() {}

            disconnect() {}
        } as unknown as typeof IntersectionObserver;

        const wrapper = mount(Lazy, {
            props: {
                once: true,
                delay: 40,
            },
            slots: {
                default: '<span class="payload">Delayed</span>',
            },
        });

        intersectionCallback([{ isIntersecting: true, intersectionRatio: 1 }]);
        await nextTick();
        expect(wrapper.find('.payload').exists()).toBe(false);

        await vi.advanceTimersByTimeAsync(40);
        await nextTick();
        expect(wrapper.find('.payload').exists()).toBe(true);
    });
});
