import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Image from '../image.vue';

describe('Image', () => {
    it('renders base image and emits load/error events', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/photo.png',
                alt: 'Profile photo',
            },
        });

        const image = wrapper.find('.vf-image__img');
        await image.trigger('load');
        await image.trigger('error');

        expect(image.attributes('src')).toBe('/photo.png');
        expect(wrapper.emitted('load')?.length).toBe(1);
        expect(wrapper.emitted('error')?.length).toBe(1);
    });

    it('opens preview in lightbox mode and emits state updates', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/photo.png',
                preview: true,
            },
            attachTo: document.body,
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await wrapper.find('.vf-image__trigger').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
        expect(wrapper.find('.vf-image__overlay').exists()).toBe(true);
        expect(wrapper.find('.vf-image__dialog').attributes('role')).toBe('dialog');
    });

    it('closes on overlay click when enabled', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/photo.png',
                preview: true,
                modelValue: true,
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();
        await wrapper.find('.vf-image__overlay').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
        expect(wrapper.emitted('close')?.at(-1)).toEqual(['overlay']);
    });

    it('closes on Escape key', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/photo.png',
                preview: true,
                modelValue: true,
            },
            attachTo: document.body,
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await nextTick();

        expect(wrapper.emitted('close')?.at(-1)).toEqual(['esc']);
    });

    it('applies fallback source after error', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/broken.png',
                fallbackSrc: '/fallback.png',
            },
        });

        const image = wrapper.find('.vf-image__img');
        await image.trigger('error');

        expect(wrapper.find('.vf-image__img').attributes('src')).toBe('/fallback.png');
    });

    it('supports pass-through attrs and unstyled mode', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/photo.png',
                unstyled: true,
                pt: {
                    root: { class: 'custom-root', 'data-test': 'image-root' },
                    img: context => ({
                        class: (context as { error: boolean }).error ? 'custom-img-error' : 'custom-img',
                    }),
                },
            },
        });

        expect(wrapper.classes()).toContain('custom-root');
        expect(wrapper.attributes('data-test')).toBe('image-root');
        expect(wrapper.classes()).not.toContain('vf-image');
        expect(wrapper.find('img').classes()).toContain('custom-img');

        await wrapper.find('img').trigger('error');
        expect(wrapper.find('img').classes()).toContain('custom-img-error');
    });

    it('supports preview group navigation with keyboard arrows', async () => {
        const wrapper = mount(Image, {
            props: {
                preview: true,
                modelValue: true,
                previewStartIndex: 1,
                previewGroup: [
                    { src: '/gallery-1.png', alt: 'Gallery one' },
                    { src: '/gallery-2.png', alt: 'Gallery two' },
                    { src: '/gallery-3.png', alt: 'Gallery three' },
                ],
            },
            attachTo: document.body,
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();
        expect(wrapper.find('.vf-image__preview').attributes('src')).toBe('/gallery-2.png');
        expect(wrapper.find('.vf-image__preview').attributes('alt')).toBe('Gallery two');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        await nextTick();
        expect(wrapper.find('.vf-image__preview').attributes('src')).toBe('/gallery-3.png');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        await nextTick();
        expect(wrapper.find('.vf-image__preview').attributes('src')).toBe('/gallery-2.png');

        const events = wrapper.emitted('previewChange');
        expect(events?.length).toBeGreaterThan(0);
    });

    it('applies zoom steps and reset via keyboard shortcuts', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/photo.png',
                preview: true,
                modelValue: true,
                zoomStep: 0.5,
            },
            attachTo: document.body,
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();
        const preview = wrapper.find('.vf-image__preview');
        expect(preview.attributes('style')).toContain('scale(1)');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: '+', bubbles: true }));
        await nextTick();
        expect(wrapper.find('.vf-image__preview').attributes('style')).toContain('scale(1.5)');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: '0', bubbles: true }));
        await nextTick();
        expect(wrapper.find('.vf-image__preview').attributes('style')).toContain('scale(1)');

        const zoomEvents = wrapper.emitted('zoomChange');
        expect(zoomEvents?.length).toBeGreaterThan(0);
    });

    it('renders download action in preview mode', async () => {
        const wrapper = mount(Image, {
            props: {
                preview: true,
                modelValue: true,
                showDownload: true,
                downloadFileName: 'report.png',
                previewGroup: [{ src: '/report.png', alt: 'Quarterly report', downloadName: 'q1-report.png' }],
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();
        const download = wrapper.find('.vf-image__download');
        expect(download.exists()).toBe(true);
        expect(download.attributes('href')).toBe('/report.png');
        expect(download.attributes('download')).toBe('q1-report.png');
    });
});
