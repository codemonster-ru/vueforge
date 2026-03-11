import { mount } from '@vue/test-utils';
import InlineEdit from '../inline-edit.vue';

describe('InlineEdit', () => {
    it('starts edit mode and saves new value', async () => {
        const wrapper = mount(InlineEdit, {
            props: {
                modelValue: 'Alice',
                editLabel: 'Edit',
            },
        });

        await wrapper.find('.vf-inline-edit__action').trigger('click');
        await wrapper.find('.vf-inline-edit__input').setValue('Bob');
        await wrapper.find('.vf-inline-edit__action_save').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Bob']);
        expect(wrapper.emitted('save')?.[0]).toEqual(['Bob']);
    });

    it('cancels edit on Escape', async () => {
        const wrapper = mount(InlineEdit, {
            props: {
                modelValue: 'Alice',
            },
        });

        await wrapper.find('.vf-inline-edit__action').trigger('click');
        await wrapper.find('.vf-inline-edit__input').setValue('Bob');
        await wrapper.find('.vf-inline-edit__input').trigger('keydown', { key: 'Escape' });

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('cancel')?.length).toBe(1);
    });

    it('saves on Enter key', async () => {
        const wrapper = mount(InlineEdit, {
            props: {
                modelValue: 'Alice',
            },
        });

        await wrapper.find('.vf-inline-edit__action').trigger('click');
        await wrapper.find('.vf-inline-edit__input').setValue('Carol');
        await wrapper.find('.vf-inline-edit__input').trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Carol']);
    });

    it('emits numeric value in number mode', async () => {
        const wrapper = mount(InlineEdit, {
            props: {
                modelValue: 10,
                type: 'number',
            },
        });

        await wrapper.find('.vf-inline-edit__action').trigger('click');
        await wrapper.find('.vf-inline-edit__input').setValue('42');
        await wrapper.find('.vf-inline-edit__action_save').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42]);
    });

    it('does not start editing when readonly', async () => {
        const wrapper = mount(InlineEdit, {
            props: {
                modelValue: 'Alice',
                readonly: true,
            },
        });

        expect(wrapper.find('.vf-inline-edit__action').exists()).toBe(false);
        expect(wrapper.find('.vf-inline-edit__input').exists()).toBe(false);
    });

    it('emits null in number mode for empty value', async () => {
        const wrapper = mount(InlineEdit, {
            props: {
                modelValue: 10,
                type: 'number',
            },
        });

        await wrapper.find('.vf-inline-edit__action').trigger('click');
        await wrapper.find('.vf-inline-edit__input').setValue('');
        await wrapper.find('.vf-inline-edit__action_save').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null]);
        expect(wrapper.emitted('save')?.[0]).toEqual([null]);
    });

    it('emits start/end and focus/blur during edit lifecycle', async () => {
        const wrapper = mount(InlineEdit, {
            props: {
                modelValue: 'Alice',
            },
            attachTo: document.body,
        });

        await wrapper.find('.vf-inline-edit__action').trigger('click');
        const input = wrapper.get('.vf-inline-edit__input');

        await input.trigger('focus');
        await input.trigger('blur');
        await wrapper.find('.vf-inline-edit__action_cancel').trigger('click');

        expect(wrapper.emitted('start')?.length).toBe(1);
        expect(wrapper.emitted('end')?.length).toBe(1);
        expect((wrapper.emitted('focus')?.length ?? 0) >= 1).toBe(true);
        expect(wrapper.emitted('blur')?.length).toBe(1);
        expect(wrapper.emitted('cancel')?.length).toBe(1);

        wrapper.unmount();
    });
});
