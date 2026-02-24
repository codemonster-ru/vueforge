import { mount } from '@vue/test-utils';
import Carousel from '../carousel.vue';
import Chart from '../chart.vue';
import Image from '../image.vue';
import SpeedDial from '../speed-dial.vue';
import OverlayPanel from '../overlay-panel.vue';

describe('Headless parity matrix', () => {
    it('supports Carousel item slot props and pt/unstyled part overrides', () => {
        const wrapper = mount(Carousel, {
            props: {
                items: [{ id: 1, title: 'Alpha' }],
                unstyled: true,
                pt: {
                    root: { class: 'custom-carousel-root' },
                    viewport: { class: 'custom-carousel-viewport' },
                    slide: ({ slideIndex }) => ({ class: `custom-carousel-slide-${String(slideIndex)}` }),
                },
            },
            slots: {
                item: ({ item, index, active }) =>
                    `${(item as { title: string }).title}:${String(index)}:${String(active)}`,
            },
        });

        expect(wrapper.classes()).toContain('custom-carousel-root');
        expect(wrapper.classes()).not.toContain('vf-carousel');
        expect(wrapper.find('.custom-carousel-viewport').exists()).toBe(true);
        expect(wrapper.find('.custom-carousel-slide-0').exists()).toBe(true);
        expect(wrapper.text()).toContain('Alpha:0:true');
    });

    it('supports Chart pt/unstyled part overrides', () => {
        const wrapper = mount(Chart, {
            props: {
                loading: true,
                unstyled: true,
                pt: {
                    root: { class: 'custom-chart-root' },
                    state: { class: 'custom-chart-state' },
                },
            },
        });

        expect(wrapper.classes()).toContain('custom-chart-root');
        expect(wrapper.classes()).not.toContain('vf-chart');
        expect(wrapper.find('.custom-chart-state').exists()).toBe(true);
    });

    it('supports SpeedDial trigger/action slots and pt/unstyled part overrides', () => {
        const wrapper = mount(SpeedDial, {
            props: {
                modelValue: true,
                unstyled: true,
                actions: [{ label: 'Create', value: 'create' }],
                pt: {
                    root: { class: 'custom-speed-root' },
                    trigger: { class: 'custom-speed-trigger' },
                    actions: { class: 'custom-speed-actions' },
                    action: ({ index }) => ({ class: `custom-speed-action-${String(index)}` }),
                },
            },
            slots: {
                trigger: ({ open }) => `Trigger:${String(open)}`,
                action: ({ action, index }) => `${(action as { label: string }).label}:${String(index)}`,
            },
        });

        expect(wrapper.classes()).toContain('custom-speed-root');
        expect(wrapper.classes()).not.toContain('vf-speed-dial');
        expect(wrapper.find('.custom-speed-trigger').text()).toContain('Trigger:true');
        expect(wrapper.find('.custom-speed-actions').exists()).toBe(true);
        expect(wrapper.find('.custom-speed-action-0').text()).toContain('Create:0');
    });

    it('supports Image pt/unstyled parts in preview mode', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/cover.png',
                preview: true,
                modelValue: true,
                showDownload: true,
                downloadFileName: 'cover.png',
                unstyled: true,
                pt: {
                    root: { class: 'custom-image-root' },
                    img: { class: 'custom-image-img' },
                    overlay: { class: 'custom-image-overlay' },
                    preview: { class: 'custom-image-preview' },
                    toolbarButton: { class: 'custom-image-toolbar-btn' },
                    close: { class: 'custom-image-close' },
                    download: { class: 'custom-image-download' },
                },
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        expect(wrapper.classes()).toContain('custom-image-root');
        expect(wrapper.classes()).not.toContain('vf-image');
        expect(wrapper.find('.custom-image-img').exists()).toBe(true);
        expect(wrapper.find('.custom-image-overlay').exists()).toBe(true);
        expect(wrapper.find('.custom-image-preview').exists()).toBe(true);
        expect(wrapper.find('.custom-image-close').exists()).toBe(true);
        expect(wrapper.find('.custom-image-download').exists()).toBe(true);
        expect(wrapper.findAll('.custom-image-toolbar-btn').length).toBeGreaterThan(0);
    });

    it('supports OverlayPanel part overrides with unstyled mode', async () => {
        const wrapper = mount(OverlayPanel, {
            props: {
                modelValue: true,
                showCloseIcon: true,
                unstyled: true,
                pt: {
                    root: { class: 'custom-overlay-root' },
                    header: { class: 'custom-overlay-header' },
                    close: { class: 'custom-overlay-close' },
                },
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
            slots: {
                trigger: '<button type="button">Open</button>',
                header: 'Header',
                default: 'Body',
            },
        });

        expect(wrapper.classes()).toContain('custom-overlay-root');
        expect(wrapper.classes()).not.toContain('vf-overlaypanel');
        expect(wrapper.find('.custom-overlay-header').exists()).toBe(true);
        expect(wrapper.find('.custom-overlay-close').exists()).toBe(true);
    });
});
