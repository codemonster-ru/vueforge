import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import Tour from '../tour.vue';

vi.mock('@codemonster-ru/floater.js', () => ({
    autoUpdate: (_reference: HTMLElement, callback: () => void) => {
        callback();

        return () => undefined;
    },
    computePosition: async () => ({
        x: 100,
        y: 120,
        placement: 'bottom',
    }),
    offset: () => ({ name: 'offset' }),
    flip: () => ({ name: 'flip' }),
    shift: () => ({ name: 'shift' }),
}));

describe('Tour', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('renders first step when opened', async () => {
        const target = document.createElement('button');

        target.id = 'tour-target';
        document.body.appendChild(target);
        const wrapper = mount(Tour, {
            props: {
                modelValue: true,
                steps: [{ target: '#tour-target', title: 'Step 1', content: 'First' }],
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();

        expect(wrapper.find('.vf-tour__title').text()).toBe('Step 1');
        expect(wrapper.find('.vf-tour__content').text()).toBe('First');
        expect(wrapper.find('.vf-tour__progress').text()).toContain('1 / 1');
    });

    it('navigates steps and emits complete on finish', async () => {
        const target = document.createElement('div');

        target.id = 'tour-target-next';
        document.body.appendChild(target);

        const wrapper = mount(Tour, {
            props: {
                modelValue: true,
                steps: [
                    { target: '#tour-target-next', title: 'A', content: 'Alpha' },
                    { target: '#tour-target-next', title: 'B', content: 'Beta' },
                ],
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();
        await wrapper.find('.vf-tour__button_primary').trigger('click');

        expect(wrapper.emitted('stepChange')?.at(-1)?.[0]).toBe(1);

        await wrapper.find('.vf-tour__button_primary').trigger('click');

        expect(wrapper.emitted('complete')?.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('emits skip and closes', async () => {
        const target = document.createElement('div');

        target.id = 'tour-target-skip';
        document.body.appendChild(target);

        const wrapper = mount(Tour, {
            props: {
                modelValue: true,
                steps: [{ target: '#tour-target-skip', title: 'Skip me' }],
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();
        await wrapper.find('.vf-tour__button_secondary').trigger('click');

        expect(wrapper.emitted('skip')?.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('closes on Escape and restores previous focus', async () => {
        const target = document.createElement('div');
        target.id = 'tour-target-esc';
        document.body.appendChild(target);
        const trigger = document.createElement('button');
        document.body.appendChild(trigger);
        trigger.focus();

        const wrapper = mount(Tour, {
            attachTo: document.body,
            props: {
                modelValue: true,
                steps: [{ target: '#tour-target-esc', title: 'Step', content: 'Body' }],
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();
        expect(document.activeElement).toBe(wrapper.find('.vf-tour__panel').element);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await nextTick();
        expect(wrapper.emitted('close')?.at(-1)).toEqual(['esc']);

        await wrapper.setProps({ modelValue: false });
        await nextTick();
        expect(document.activeElement).toBe(trigger);

        wrapper.unmount();
        trigger.remove();
    });

    it('does not close on overlay when closeOnOverlay is false', async () => {
        const target = document.createElement('div');
        target.id = 'tour-target-overlay';
        document.body.appendChild(target);
        const wrapper = mount(Tour, {
            props: {
                modelValue: true,
                closeOnOverlay: false,
                steps: [{ target: '#tour-target-overlay', title: 'Step' }],
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();
        await wrapper.find('.vf-tour__overlay').trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
});
