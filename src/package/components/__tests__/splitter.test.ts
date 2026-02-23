import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Splitter from '../splitter.vue';
import SplitterPanel from '../splitter-panel.vue';

const createRect = (width: number, height: number): DOMRect =>
    ({
        x: 0,
        y: 0,
        width,
        height,
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        toJSON: () => ({}),
    }) as DOMRect;

describe('Splitter', () => {
    it('resizes panels with mouse drag and updates v-model', async () => {
        const wrapper = mount({
            components: { Splitter, SplitterPanel },
            template: `
                <Splitter v-model="sizes">
                    <SplitterPanel>Left</SplitterPanel>
                    <SplitterPanel>Right</SplitterPanel>
                </Splitter>
            `,
            data() {
                return {
                    sizes: [50, 50],
                };
            },
        });
        await nextTick();

        const splitterComponent = wrapper.findComponent(Splitter);
        const splitter = wrapper.find('.vf-splitter');

        Object.defineProperty(splitter.element, 'getBoundingClientRect', {
            value: () => createRect(1000, 400),
        });

        await wrapper.find('.vf-splitter__gutter').trigger('mousedown', {
            clientX: 500,
            clientY: 200,
        });

        window.dispatchEvent(new MouseEvent('mousemove', { clientX: 620, clientY: 200 }));
        window.dispatchEvent(new MouseEvent('mouseup'));
        await nextTick();

        const emitted = splitterComponent.emitted('update:modelValue');
        const updated = emitted?.at(-1)?.[0] as Array<number>;

        expect(updated[0]).toBeGreaterThan(50);
        expect(updated[1]).toBeLessThan(50);
    });

    it('resizes with keyboard on separator', async () => {
        const wrapper = mount({
            components: { Splitter, SplitterPanel },
            template: `
                <Splitter v-model="sizes">
                    <SplitterPanel>One</SplitterPanel>
                    <SplitterPanel>Two</SplitterPanel>
                </Splitter>
            `,
            data() {
                return {
                    sizes: [50, 50],
                };
            },
        });
        await nextTick();

        const splitterComponent = wrapper.findComponent(Splitter);
        const gutter = wrapper.find('.vf-splitter__gutter');

        await gutter.trigger('keydown', { key: 'ArrowRight' });

        const emitted = splitterComponent.emitted('update:modelValue');
        const updated = emitted?.at(-1)?.[0] as Array<number>;

        expect(updated[0]).toBeGreaterThan(50);
    });

    it('renders multiple separators for multiple panels', async () => {
        const wrapper = mount({
            components: { Splitter, SplitterPanel },
            template: `
                <Splitter direction="vertical">
                    <SplitterPanel>One</SplitterPanel>
                    <SplitterPanel>Two</SplitterPanel>
                    <SplitterPanel>Three</SplitterPanel>
                </Splitter>
            `,
        });
        await nextTick();

        expect(wrapper.find('.vf-splitter').classes()).toContain('vf-splitter_vertical');
        expect(wrapper.findAll('.vf-splitter__gutter')).toHaveLength(2);
    });

    it('applies panel size/minSize styles and disabled class via SplitterPanel context', async () => {
        const wrapper = mount({
            components: { Splitter, SplitterPanel },
            template: `
                <Splitter :model-value="[40, 60]" :min-sizes="[20, 20]" disabled direction="vertical">
                    <SplitterPanel :size="40" :min-size="20">Top</SplitterPanel>
                    <SplitterPanel :size="60" :min-size="20">Bottom</SplitterPanel>
                </Splitter>
            `,
        });
        await nextTick();

        const panels = wrapper.findAll('.vf-splitter__panel');
        const firstStyle = panels[0].attributes('style');

        expect(panels[0].classes()).toContain('vf-splitter__panel_vertical');
        expect(panels[0].classes()).toContain('vf-splitter__panel_disabled');
        expect(firstStyle).toContain('flex: 0 0 40%;');
        expect(firstStyle).toContain('min-height: 20%;');
    });
});
