import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ResizableSidebar from '../resizable-sidebar.vue';

describe('ResizableSidebar', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('renders content and toggles collapsed state', async () => {
        const wrapper = mount(ResizableSidebar, {
            props: {
                modelValue: 300,
                collapsed: false,
            },
            slots: {
                default: 'Sidebar content',
            },
        });

        expect(wrapper.text()).toContain('Sidebar content');
        await wrapper.find('.vf-resizable-sidebar__toggle').trigger('click');
        expect(wrapper.emitted('update:collapsed')?.[0]?.[0]).toBe(true);
    });

    it('resizes with drag and emits updated width', async () => {
        const wrapper = mount(ResizableSidebar, {
            props: {
                modelValue: 280,
                minWidth: 200,
                maxWidth: 400,
                side: 'left',
            },
        });
        await nextTick();

        await wrapper.find('.vf-resizable-sidebar__resizer').trigger('mousedown', { clientX: 300 });
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: 360 }));
        window.dispatchEvent(new MouseEvent('mouseup'));
        await nextTick();

        const emitted = wrapper.emitted('update:modelValue');
        const next = emitted?.at(-1)?.[0] as number;
        expect(next).toBeGreaterThan(280);
        expect(wrapper.emitted('resize-end')?.length).toBeGreaterThan(0);
    });

    it('restores persisted width and collapsed state', async () => {
        const key = 'docs-sidebar';

        const firstMount = mount(ResizableSidebar, {
            props: {
                modelValue: 280,
                persistence: 'local',
                persistenceKey: key,
            },
        });
        await nextTick();

        await firstMount.find('.vf-resizable-sidebar__resizer').trigger('mousedown', { clientX: 280 });
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: 330 }));
        window.dispatchEvent(new MouseEvent('mouseup'));
        await firstMount.find('.vf-resizable-sidebar__toggle').trigger('click');
        firstMount.unmount();

        const secondMount = mount(ResizableSidebar, {
            props: {
                modelValue: 280,
                persistence: 'local',
                persistenceKey: key,
            },
        });
        await nextTick();

        expect(secondMount.classes()).toContain('vf-resizable-sidebar_collapsed');
        expect(secondMount.attributes('style')).not.toContain('--vf-resizable-sidebar-width-prop: 280px;');
    });
});
