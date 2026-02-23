import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import Carousel from '../carousel.vue';

const slides = [
    { id: 1, title: 'Alpha' },
    { id: 2, title: 'Beta' },
    { id: 3, title: 'Gamma' },
];

describe('Carousel', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders slides and indicator controls', () => {
        const wrapper = mount(Carousel, {
            props: {
                items: slides,
                slideKey: 'id',
            },
            slots: {
                item: slotProps => (slotProps.item as { title: string }).title,
            },
        });

        expect(wrapper.findAll('.vf-carousel__slide')).toHaveLength(3);
        expect(wrapper.findAll('.vf-carousel__indicator')).toHaveLength(3);
        expect(wrapper.find('.vf-carousel__slide_active').text()).toContain('Alpha');
    });

    it('changes slide on next/prev controls', async () => {
        const wrapper = mount(Carousel, {
            props: {
                items: slides,
                loop: false,
            },
        });

        await wrapper.find('.vf-carousel__arrow_next').trigger('click');
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
        expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ index: 1, previousIndex: 0, source: 'next' });

        await wrapper.setProps({ modelValue: 1 });
        await wrapper.find('.vf-carousel__arrow_prev').trigger('click');
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0]);
    });

    it('supports keyboard navigation', async () => {
        const wrapper = mount(Carousel, {
            props: {
                items: slides,
                loop: false,
            },
        });

        await wrapper.trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ index: 1, source: 'keyboard' });

        await wrapper.setProps({ modelValue: 1 });
        await wrapper.trigger('keydown', { key: 'End' });
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2]);

        await wrapper.setProps({ modelValue: 2 });
        await wrapper.trigger('keydown', { key: 'Home' });
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0]);
    });

    it('advances automatically when autoplay is enabled', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Carousel, {
            props: {
                items: slides,
                autoplay: true,
                autoplayInterval: 600,
            },
        });

        vi.advanceTimersByTime(650);
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ source: 'autoplay', index: 1 });
    });

    it('supports swipe gestures', async () => {
        const wrapper = mount(Carousel, {
            props: {
                items: slides,
            },
        });

        const viewport = wrapper.find('.vf-carousel__viewport');
        await viewport.trigger('touchstart', { changedTouches: [{ clientX: 240 }] });
        await viewport.trigger('touchend', { changedTouches: [{ clientX: 100 }] });

        expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ source: 'swipe', index: 1 });
    });

    it('exposes ARIA semantics for carousel and slides', () => {
        const wrapper = mount(Carousel, {
            props: {
                items: slides,
                ariaLabel: 'Feature highlights',
            },
        });

        expect(wrapper.attributes('role')).toBe('region');
        expect(wrapper.attributes('aria-roledescription')).toBe('carousel');
        expect(wrapper.attributes('aria-label')).toBe('Feature highlights');
        expect(wrapper.find('.vf-carousel__track').attributes('aria-live')).toBe('polite');
        expect(wrapper.findAll('.vf-carousel__slide')[0].attributes('aria-label')).toBe('1 of 3');
    });

    it('disables interaction when disabled', async () => {
        const wrapper = mount(Carousel, {
            props: {
                items: slides,
                disabled: true,
            },
        });

        await wrapper.find('.vf-carousel__arrow_next').trigger('click');
        await wrapper.trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
});
