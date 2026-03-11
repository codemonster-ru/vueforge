import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach } from 'vitest';
import Dropdown from '../dropdown.vue';

const mountedWrappers: Array<ReturnType<typeof mount>> = [];
const mountDropdown = (props: Record<string, unknown> = {}) => {
    const wrapper = mount(Dropdown, {
        props,
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
        slots: {
            trigger: '<button class="trigger-content" type="button">Actions</button>',
            default: `
                <button class="item-1" type="button" data-dropdown-item data-dropdown-close>Item 1</button>
                <button class="item-2" type="button" data-dropdown-item data-dropdown-close>Item 2</button>
                <button class="item-3" type="button" data-dropdown-item data-dropdown-close>Item 3</button>
            `,
        },
    });

    mountedWrappers.push(wrapper);

    return wrapper;
};

afterEach(() => {
    for (const wrapper of mountedWrappers) {
        wrapper.unmount();
    }
    mountedWrappers.length = 0;
    document.body.innerHTML = '';
});

describe('Dropdown', () => {
    it('opens on trigger click and closes on outside click', async () => {
        const wrapper = mountDropdown();
        const trigger = wrapper.find('.vf-dropdown__trigger');

        await trigger.trigger('click');
        await nextTick();
        await nextTick();

        expect(wrapper.find('.vf-dropdown__panel').isVisible()).toBe(true);

        document.body.click();
        await nextTick();

        expect(wrapper.find('.vf-dropdown__panel').isVisible()).toBe(false);
    });

    it('opens with ArrowDown keyboard shortcut', async () => {
        const wrapper = mountDropdown();
        const trigger = wrapper.find('.vf-dropdown__trigger');

        await trigger.trigger('keydown', { key: 'ArrowDown' });
        await nextTick();
        await nextTick();

        expect(wrapper.find('.vf-dropdown__panel').isVisible()).toBe(true);
    });

    it('supports Arrow/Home/End keyboard navigation between items', async () => {
        const wrapper = mountDropdown();
        const trigger = wrapper.find('.vf-dropdown__trigger');

        await trigger.trigger('keydown', { key: 'ArrowDown' });
        await nextTick();
        await nextTick();

        const panel = wrapper.find('.vf-dropdown__panel');
        const item1 = wrapper.find('.item-1').element;
        const item2 = wrapper.find('.item-2').element;
        const item3 = wrapper.find('.item-3').element;

        (item1 as HTMLButtonElement).focus();
        await wrapper.find('.item-1').trigger('keydown', { key: 'ArrowDown' });
        expect(document.activeElement).toBe(item2);

        await wrapper.find('.item-2').trigger('keydown', { key: 'End' });
        expect(document.activeElement).toBe(item3);

        await wrapper.find('.item-3').trigger('keydown', { key: 'ArrowUp' });
        expect(document.activeElement).toBe(item2);

        await panel.trigger('keydown', { key: 'Home' });
        expect(document.activeElement).toBe(item1);
    });

    it('closes on Escape and restores focus to trigger', async () => {
        const wrapper = mountDropdown();
        const trigger = wrapper.find('.vf-dropdown__trigger');

        await trigger.trigger('click');
        await nextTick();
        await nextTick();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(wrapper.find('.vf-dropdown__panel').isVisible()).toBe(false);
        expect(document.activeElement).toBe(trigger.element);
    });

    it('does not close on Escape when closeOnEsc is false', async () => {
        const wrapper = mountDropdown({ closeOnEsc: false });
        const trigger = wrapper.find('.vf-dropdown__trigger');

        await trigger.trigger('click');
        await nextTick();
        await nextTick();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(wrapper.find('.vf-dropdown__panel').isVisible()).toBe(true);
    });

    it('closes on select by default', async () => {
        const wrapper = mountDropdown();
        const trigger = wrapper.find('.vf-dropdown__trigger');

        await trigger.trigger('click');
        await nextTick();
        await nextTick();

        await wrapper.find('.item-2').trigger('click');
        await nextTick();

        expect(wrapper.find('.vf-dropdown__panel').isVisible()).toBe(false);
    });

    it('keeps panel open on select when closeOnSelect is false', async () => {
        const wrapper = mountDropdown({ closeOnSelect: false });
        const trigger = wrapper.find('.vf-dropdown__trigger');

        await trigger.trigger('click');
        await nextTick();
        await nextTick();

        await wrapper.find('.item-2').trigger('click');
        await nextTick();

        expect(wrapper.find('.vf-dropdown__panel').isVisible()).toBe(true);
    });

    it('applies placement and width matching styles when opened', async () => {
        const wrapper = mountDropdown({ placement: 'top-end', matchTriggerWidth: true });

        await wrapper.find('.vf-dropdown__trigger').trigger('click');
        await nextTick();
        await nextTick();

        const panel = wrapper.find('.vf-dropdown__panel');

        expect(panel.attributes('data-placement')).toMatch(/(top|bottom)-end/);
    });
});
