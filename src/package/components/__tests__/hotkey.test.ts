import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import Hotkey from '../hotkey.vue';
import { useHotkey } from '../use-hotkey';

describe('Hotkey', () => {
    it('triggers only inside scope by default', async () => {
        const wrapper = mount(Hotkey, {
            props: {
                combo: 'mod+k',
            },
            slots: {
                default: '<button type="button" class="inside">Inside</button>',
            },
            attachTo: document.body,
        });

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
        await nextTick();
        expect(wrapper.emitted('trigger')).toBeUndefined();

        (wrapper.get('.inside').element as HTMLButtonElement).focus();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
        await nextTick();
        expect(wrapper.emitted('trigger')?.length).toBe(1);

        wrapper.unmount();
    });

    it('supports global mode when scoped=false', async () => {
        const wrapper = mount(Hotkey, {
            props: {
                combo: 'mod+k',
                scoped: false,
            },
            slots: {
                default: '<span>Global</span>',
            },
        });

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
        await nextTick();

        expect(wrapper.emitted('trigger')?.length).toBe(1);
    });

    it('ignores shortcuts in editable targets by default', async () => {
        const wrapper = mount(Hotkey, {
            props: {
                combo: 'mod+k',
                scoped: false,
            },
            slots: {
                default: '<input class="editor" />',
            },
            attachTo: document.body,
        });

        const input = wrapper.get('.editor').element as HTMLInputElement;
        input.focus();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
        await nextTick();

        expect(wrapper.emitted('trigger')).toBeUndefined();

        wrapper.unmount();
    });
});

describe('useHotkey', () => {
    it('binds shortcut listener via composable', async () => {
        const demo = defineComponent({
            setup() {
                const count = ref(0);

                useHotkey({
                    combo: 'shift+x',
                    handler: () => {
                        count.value += 1;
                    },
                    ignoreInputs: true,
                    exact: true,
                });

                return {
                    count,
                };
            },
            template: '<div class="count">{{ count }}</div>',
        });

        const wrapper = mount(demo);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', shiftKey: true, bubbles: true }));
        await nextTick();

        expect(wrapper.find('.count').text()).toBe('1');
    });
});
