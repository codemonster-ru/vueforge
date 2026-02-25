import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import InfiniteScroll from '../infinite-scroll.vue';

type MockIntersectionEntry = {
    isIntersecting: boolean;
    intersectionRatio?: number;
};

class MockIntersectionObserver {
    public callback: IntersectionObserverCallback;
    public observe = vi.fn();
    public disconnect = vi.fn();
    public unobserve = vi.fn();
    public takeRecords = vi.fn(() => []);
    public root: Element | Document | null;
    public rootMargin: string;
    public thresholds: ReadonlyArray<number>;

    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        this.root = null;
        this.rootMargin = '0px';
        this.thresholds = [0];
    }

    trigger(entries: MockIntersectionEntry[]) {
        this.callback(entries as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
    }
}

describe('InfiniteScroll', () => {
    const originalIntersectionObserver = globalThis.IntersectionObserver;

    afterEach(() => {
        globalThis.IntersectionObserver = originalIntersectionObserver;
        vi.restoreAllMocks();
    });

    it('emits load when sentinel intersects', async () => {
        const instances: MockIntersectionObserver[] = [];
        class TestIntersectionObserver extends MockIntersectionObserver {
            constructor(callback: IntersectionObserverCallback) {
                super(callback);
                instances.push(this);
            }
        }
        globalThis.IntersectionObserver = TestIntersectionObserver as unknown as typeof IntersectionObserver;

        const wrapper = mount(InfiniteScroll, {
            props: {
                debounceMs: 0,
            },
        });

        expect(instances).toHaveLength(1);
        instances[0].trigger([{ isIntersecting: true, intersectionRatio: 1 }]);
        await nextTick();

        expect(wrapper.emitted('load')?.[0]).toEqual([{ trigger: 'intersection' }]);
    });

    it('falls back to scroll listeners when IntersectionObserver is unavailable', async () => {
        globalThis.IntersectionObserver = undefined as unknown as typeof IntersectionObserver;

        const target = document.createElement('div');
        Object.defineProperty(target, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({
                x: 0,
                y: 0,
                top: 0,
                left: 0,
                right: 400,
                bottom: 400,
                width: 400,
                height: 400,
                toJSON: () => ({}),
            }),
        });

        const wrapper = mount(InfiniteScroll, {
            props: {
                scrollTarget: target,
                fallbackOffset: 64,
                debounceMs: 0,
            },
        });

        const sentinel = wrapper.find('.vf-infinite-scroll__sentinel').element as HTMLElement;
        Object.defineProperty(sentinel, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({
                x: 0,
                y: 0,
                top: 430,
                left: 0,
                right: 400,
                bottom: 470,
                width: 400,
                height: 40,
                toJSON: () => ({}),
            }),
        });

        (wrapper.vm as { refresh: () => void }).refresh();
        target.dispatchEvent(new Event('scroll'));
        await nextTick();

        expect(wrapper.emitted('load')?.[0]).toEqual([{ trigger: 'scroll' }]);
    });

    it('supports retry recovery state', async () => {
        const wrapper = mount(InfiniteScroll, {
            props: {
                error: true,
                debounceMs: 0,
            },
        });

        await wrapper.find('.vf-infinite-scroll__retry').trigger('click');

        expect(wrapper.emitted('retry')).toHaveLength(1);
        expect(wrapper.emitted('load')?.[0]).toEqual([{ trigger: 'retry' }]);
    });

    it('shows end state and blocks manual load when no more items', () => {
        const wrapper = mount(InfiniteScroll, {
            props: {
                hasMore: false,
                endText: 'Done',
            },
        });

        expect(wrapper.text()).toContain('Done');
        (wrapper.vm as { loadMore: () => void }).loadMore();
        expect(wrapper.emitted('load')).toBeUndefined();
    });
});
