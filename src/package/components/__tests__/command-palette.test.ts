import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import CommandPalette from '../command-palette.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

const items = [
    { label: 'Open docs', value: 'docs', group: 'Navigation' },
    { label: 'Save draft', value: 'draft', group: 'Actions', description: 'Save without publishing' },
    { label: 'Publish', value: 'publish', group: 'Actions' },
];

const mountCommandPalette = (options: Parameters<typeof mount>[1] = {}) => {
    return mount(CommandPalette, {
        props: {
            items,
        },
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
        ...options,
    });
};

describe('CommandPalette', () => {
    it('opens with Ctrl/Cmd+K shortcut', async () => {
        const wrapper = mountCommandPalette();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));

        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
        expect(wrapper.find('.vf-command-palette__panel').isVisible()).toBe(true);

        wrapper.unmount();
    });

    it('emits search and filters items', async () => {
        const wrapper = mountCommandPalette({
            props: {
                modelValue: true,
                items,
            },
        });

        await nextTick();
        await wrapper.find('.vf-command-palette__input').setValue('draft');

        expect(wrapper.emitted('search')?.[0]).toEqual(['draft']);
        expect(wrapper.findAll('.vf-command-palette__item').length).toBe(1);
        expect(wrapper.find('.vf-command-palette__item-label').text()).toContain('Save draft');

        wrapper.unmount();
    });

    it('selects active item by Enter and closes by default', async () => {
        const command = vi.fn();
        const wrapper = mountCommandPalette({
            props: {
                items: [{ label: 'Publish', value: 'publish', command }],
            },
        });

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));

        await nextTick();
        await wrapper.find('.vf-command-palette__panel').trigger('keydown', { key: 'Enter' });

        expect(command).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('select')?.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false]);

        wrapper.unmount();
    });

    it('does not open from shortcut when target is an input', async () => {
        const wrapper = mountCommandPalette();
        const input = document.createElement('input');

        document.body.appendChild(input);

        input.focus();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));

        await nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        input.remove();
        wrapper.unmount();
    });
});
