import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import CommandPalette from '../command-palette.vue';
import { setLocaleText } from '@/package/config/locale-text';

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
    afterEach(() => {
        setLocaleText();
        document.documentElement.removeAttribute('dir');
    });

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

    it('focuses input on open and restores trigger focus on close', async () => {
        const trigger = document.createElement('button');
        document.body.appendChild(trigger);
        trigger.focus();
        const wrapper = mountCommandPalette({
            props: {
                modelValue: false,
                items,
            },
        });

        await wrapper.setProps({ modelValue: true });
        await nextTick();
        const input = wrapper.find('.vf-command-palette__input').element as HTMLInputElement;
        expect(document.activeElement).toBe(input);

        await wrapper.find('.vf-command-palette__panel').trigger('keydown', { key: 'Escape' });
        await nextTick();
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
        await wrapper.setProps({ modelValue: false });
        await nextTick();
        expect(document.activeElement).toBe(trigger);

        wrapper.unmount();
        trigger.remove();
    });

    it('navigates active option with arrow keys and selects by Enter', async () => {
        const wrapper = mountCommandPalette({
            props: {
                modelValue: true,
                items: [
                    { label: 'Disabled', value: 'disabled', disabled: true },
                    { label: 'Open docs', value: 'docs' },
                    { label: 'Publish', value: 'publish' },
                ],
            },
        });

        await nextTick();
        const panel = wrapper.find('.vf-command-palette__panel');
        await panel.trigger('keydown', { key: 'ArrowDown' });
        await nextTick();
        await panel.trigger('keydown', { key: 'ArrowDown' });
        await nextTick();
        await panel.trigger('keydown', { key: 'Enter' });

        const selected = wrapper.emitted('select')?.[0]?.[0] as { value?: string } | undefined;
        expect(selected?.value).toBe('publish');
    });

    it('uses global locale strings for placeholder and empty state by default', async () => {
        setLocaleText({
            commandPalette: {
                placeholder: 'Tapez une commande...',
                emptyText: 'Aucune commande',
                ariaLabel: 'Palette de commandes',
            },
        });

        const wrapper = mountCommandPalette({
            props: {
                modelValue: true,
                items: [],
            },
        });

        await nextTick();
        expect(wrapper.find('.vf-command-palette__input').attributes('placeholder')).toBe('Tapez une commande...');
        expect(wrapper.find('.vf-command-palette__empty').text()).toContain('Aucune commande');
        expect(wrapper.find('.vf-command-palette__panel').attributes('aria-label')).toBe('Palette de commandes');
    });

    it('keeps keyboard open/select flow in RTL document direction', async () => {
        document.documentElement.setAttribute('dir', 'rtl');
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
    });
});
