import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Show from '../show.vue';
import Hide from '../hide.vue';

describe('Show/Hide', () => {
    it('renders Show only when viewport matches from/to rules', async () => {
        const previousWidth = window.innerWidth;
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 800,
        });

        const show = mount(Show, {
            props: {
                from: 'md',
                to: 'xl',
            },
            slots: {
                default: 'Visible content',
            },
        });
        await nextTick();
        expect(show.text()).toContain('Visible content');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 1400,
        });
        window.dispatchEvent(new Event('resize'));
        await nextTick();
        expect(show.text()).toBe('');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });

    it('hides content with Hide from breakpoint and supports custom tag', async () => {
        const previousWidth = window.innerWidth;
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 900,
        });

        const hide = mount(Hide, {
            props: {
                as: 'section',
                from: 'md',
            },
            slots: {
                default: 'Hidden on md+',
            },
        });
        await nextTick();
        expect(hide.text()).toBe('');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 700,
        });
        window.dispatchEvent(new Event('resize'));
        await nextTick();
        expect(hide.element.tagName).toBe('SECTION');
        expect(hide.text()).toContain('Hidden on md+');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });

    it('respects explicit when=false for both helpers', async () => {
        const show = mount(Show, {
            props: { when: false },
            slots: { default: 'X' },
        });
        const hide = mount(Hide, {
            props: { when: false },
            slots: { default: 'Y' },
        });

        await nextTick();
        expect(show.text()).toBe('');
        expect(hide.text()).toBe('');
    });
});
