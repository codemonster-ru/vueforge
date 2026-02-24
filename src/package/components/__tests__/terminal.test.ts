import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import Terminal from '../terminal.vue';

describe('Terminal', () => {
    it('renders log entries with role and severity markers', () => {
        const wrapper = mount(Terminal, {
            props: {
                entries: [
                    {
                        id: '1',
                        timestamp: '10:00:00',
                        command: 'npm test',
                        output: 'All tests passed',
                        severity: 'success',
                    },
                ],
                ariaLabel: 'Build log',
            },
        });

        const body = wrapper.find('.vf-terminal__body');
        expect(body.attributes('role')).toBe('log');
        expect(body.attributes('aria-label')).toBe('Build log');
        expect(wrapper.find('.vf-terminal__entry').attributes('data-severity')).toBe('success');
        expect(wrapper.find('.vf-terminal__prompt').text()).toBe('$');
        expect(wrapper.text()).toContain('npm test');
        expect(wrapper.text()).toContain('All tests passed');
    });

    it('emits clear, copy, and entryClick events', async () => {
        const clipboardWrite = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', {
            value: { writeText: clipboardWrite },
            configurable: true,
        });

        const wrapper = mount(Terminal, {
            props: {
                entries: [{ timestamp: '10:02:00', command: 'pwd', output: '/workspace' }],
                clearable: true,
                copyable: true,
            },
        });

        const actions = wrapper.findAll('.vf-terminal__action');
        await actions[0].trigger('click');
        await actions[1].trigger('click');
        await wrapper.find('.vf-terminal__entry').trigger('click');

        expect(clipboardWrite).toHaveBeenCalledTimes(1);
        expect(clipboardWrite).toHaveBeenCalledWith('10:02:00\n$ pwd\n/workspace');
        expect(wrapper.emitted('copy')?.[0]).toEqual([{ text: '10:02:00\n$ pwd\n/workspace' }]);
        expect(wrapper.emitted('clear')?.length).toBe(1);
        expect(wrapper.emitted('entryClick')?.length).toBe(1);
    });

    it('respects disabled state for action buttons', async () => {
        const wrapper = mount(Terminal, {
            props: {
                entries: [{ command: 'echo test', output: 'test' }],
                clearable: true,
                copyable: true,
                disabled: true,
            },
        });

        const actions = wrapper.findAll('.vf-terminal__action');
        await actions[0].trigger('click');
        await actions[1].trigger('click');

        expect(wrapper.classes()).toContain('vf-terminal_disabled');
        expect(wrapper.emitted('copy')).toBeUndefined();
        expect(wrapper.emitted('clear')).toBeUndefined();
    });

    it('shows empty state text and supports custom empty slot', () => {
        const defaultWrapper = mount(Terminal, {
            props: {
                entries: [],
                emptyText: 'No logs yet',
            },
        });
        expect(defaultWrapper.find('.vf-terminal__empty').text()).toContain('No logs yet');

        const slotWrapper = mount(Terminal, {
            props: { entries: [] },
            slots: {
                empty: '<span class="custom-empty">Nothing here</span>',
            },
        });
        expect(slotWrapper.find('.custom-empty').exists()).toBe(true);
    });

    it('auto-scrolls to the bottom when entries change', async () => {
        const wrapper = mount(Terminal, {
            props: {
                entries: [{ id: 1, command: 'ls', output: 'file-a' }],
                autoScroll: true,
            },
            attachTo: document.body,
        });

        const body = wrapper.find('.vf-terminal__body').element as HTMLElement;
        Object.defineProperty(body, 'scrollHeight', { value: 240, configurable: true });
        body.scrollTop = 0;

        await wrapper.setProps({
            entries: [
                { id: 1, command: 'ls', output: 'file-a' },
                { id: 2, command: 'pwd', output: '/workspace' },
            ],
        });
        await nextTick();

        expect(body.scrollTop).toBe(240);
    });
});
