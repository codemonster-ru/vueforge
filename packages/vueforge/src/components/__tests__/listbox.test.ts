import { mount } from '@vue/test-utils';
import Listbox from '../listbox.vue';

describe('Listbox', () => {
    const options = [
        { label: 'Alpha', value: 'alpha' },
        { label: 'Beta', value: 'beta' },
        { label: 'Gamma', value: 'gamma', disabled: true },
    ];

    it('updates modelValue in single mode on click', async () => {
        const wrapper = mount({
            components: { Listbox },
            template: '<Listbox v-model="value" :options="options" />',
            data() {
                return {
                    value: undefined,
                    options,
                };
            },
        });

        const optionButtons = wrapper.findAll('.vf-listbox__option');
        await optionButtons[1].trigger('click');

        expect(wrapper.vm.value).toBe('beta');
    });

    it('supports multi selection mode', async () => {
        const wrapper = mount({
            components: { Listbox },
            template: '<Listbox v-model="value" :options="options" multiple />',
            data() {
                return {
                    value: ['alpha'],
                    options,
                };
            },
        });

        const optionButtons = wrapper.findAll('.vf-listbox__option');
        await optionButtons[1].trigger('click');
        expect(wrapper.vm.value).toEqual(['alpha', 'beta']);

        await optionButtons[0].trigger('click');
        expect(wrapper.vm.value).toEqual(['beta']);
    });

    it('supports grouped options rendering', () => {
        const wrapper = mount(Listbox, {
            props: {
                options: [
                    {
                        label: 'Group A',
                        options: [
                            { label: 'A1', value: 'a1' },
                            { label: 'A2', value: 'a2' },
                        ],
                    },
                    {
                        label: 'Group B',
                        options: [{ label: 'B1', value: 'b1' }],
                    },
                ],
            },
        });

        expect(wrapper.findAll('.vf-listbox__group-label')).toHaveLength(2);
        expect(wrapper.findAll('.vf-listbox__option')).toHaveLength(3);
    });

    it('supports keyboard-first navigation and selection', async () => {
        const wrapper = mount(Listbox, {
            attachTo: document.body,
            props: {
                options,
            },
        });

        const root = wrapper.find('[role="listbox"]');
        await root.trigger('focus');
        await root.trigger('keydown', { key: 'ArrowDown' });
        await root.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beta']);

        wrapper.unmount();
    });

    it('skips disabled options during keyboard navigation', async () => {
        const wrapper = mount(Listbox, {
            props: {
                options,
            },
        });

        const root = wrapper.find('[role="listbox"]');
        await root.trigger('focus');
        await root.trigger('keydown', { key: 'End' });
        await root.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beta']);
    });

    it('provides listbox + option aria contracts', () => {
        const wrapper = mount(Listbox, {
            props: {
                options,
                modelValue: 'alpha',
            },
        });

        expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
        const optionNode = wrapper.findAll('[role="option"]')[0];
        expect(optionNode.attributes('aria-selected')).toBe('true');
    });
});
