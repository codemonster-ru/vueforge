import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MemberPicker from '../member-picker.vue';

const options = [
    {
        id: 'u1',
        name: 'Alice Doe',
        email: 'alice@example.com',
        roleHint: 'Owner',
    },
    {
        id: 'u2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        roleHint: 'Editor',
    },
    {
        id: 'u3',
        name: 'Org Bot',
        email: 'bot@example.com',
        roleHint: 'Automation',
        disabled: true,
    },
];

const mountPicker = (props: Record<string, unknown> = {}) =>
    mount(MemberPicker, {
        props: {
            options,
            ...props,
        },
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
    });

describe('MemberPicker', () => {
    it('renders role hints and option metadata', async () => {
        const wrapper = mountPicker();

        await wrapper.find('.vf-member-picker__input').trigger('focus');
        await nextTick();

        expect(wrapper.findAll('.vf-member-picker__option')).toHaveLength(3);
        expect(wrapper.text()).toContain('alice@example.com');
        expect(wrapper.text()).toContain('Owner');
    });

    it('emits search on input for async loading flows', async () => {
        const wrapper = mountPicker({
            filterLocal: false,
        });

        const input = wrapper.find('.vf-member-picker__input');
        await input.setValue('ali');

        expect(wrapper.emitted('search')?.[0]).toEqual(['ali']);
    });

    it('selects member and emits update/change/select', async () => {
        const wrapper = mountPicker({
            modelValue: [],
            'onUpdate:modelValue': (value: Array<string | number>) => wrapper.setProps({ modelValue: value }),
        });

        await wrapper.find('.vf-member-picker__input').trigger('focus');
        await nextTick();
        await wrapper.findAll('.vf-member-picker__option')[0].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['u1']]);
        expect(wrapper.emitted('change')?.[0]).toEqual([['u1']]);
        expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ id: 'u1', name: 'Alice Doe' });
    });

    it('removes selected member from chips', async () => {
        const wrapper = mountPicker({
            modelValue: ['u1', 'u2'],
            'onUpdate:modelValue': (value: Array<string | number>) => wrapper.setProps({ modelValue: value }),
        });

        expect(wrapper.findAll('.vf-member-picker__chip')).toHaveLength(2);

        await wrapper.find('.vf-member-picker__chip-remove').trigger('click');

        expect(wrapper.emitted('remove')?.[0]?.[0]).toMatchObject({ id: 'u1' });
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['u2']]);
    });

    it('supports custom role-hint slot', async () => {
        const wrapper = mount(MemberPicker, {
            props: { options },
            attachTo: document.body,
            global: {
                stubs: {
                    teleport: true,
                },
            },
            slots: {
                'role-hint': '<span class="custom-role">Custom role</span>',
            },
        });

        await wrapper.find('.vf-member-picker__input').trigger('focus');
        await nextTick();

        expect(wrapper.find('.custom-role').text()).toContain('Custom role');

        wrapper.unmount();
    });
});
