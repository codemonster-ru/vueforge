import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TagInput from '../tag-input.vue';

const options = [
    { label: 'Vue', value: 'vue' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Vitest', value: 'vitest' },
];

const mountTagInput = (props: Record<string, unknown> = {}) => {
    return mount(TagInput, {
        props: { options, ...props },
        global: {
            stubs: {
                teleport: true,
            },
        },
    });
};

describe('TagInput', () => {
    it('adds tag from option click', async () => {
        const wrapper = mountTagInput({ modelValue: [] });
        const input = wrapper.find('.vf-tag-input__control');

        await input.trigger('focus');
        await nextTick();
        await wrapper.findAll('.vf-tag-input__option')[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['ts']]);
        expect(wrapper.emitted('add')?.[0]).toEqual([{ value: 'ts', source: 'option' }]);
    });

    it('adds custom tag with enter and emits search', async () => {
        const wrapper = mountTagInput({ modelValue: [], allowCustom: true });
        const input = wrapper.find('.vf-tag-input__control');

        await input.setValue('custom-tag');
        await input.trigger('keydown.enter');

        expect(wrapper.emitted('search')?.[0]).toEqual(['custom-tag']);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['custom-tag']]);
        expect(wrapper.emitted('add')?.[0]).toEqual([{ value: 'custom-tag', source: 'custom' }]);
    });

    it('removes last tag on backspace when query is empty', async () => {
        const wrapper = mountTagInput({ modelValue: ['vue', 'ts'] });
        const input = wrapper.find('.vf-tag-input__control');

        await input.trigger('keydown.backspace');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['vue']]);
        expect(wrapper.emitted('remove')?.[0]).toEqual(['ts']);
    });

    it('emits reject for duplicate and max tags', async () => {
        const wrapper = mountTagInput({ modelValue: ['vue'], allowCustom: true, maxTags: 1 });
        const input = wrapper.find('.vf-tag-input__control');

        await input.setValue('vue');
        await input.trigger('keydown.enter');
        await input.setValue('new');
        await input.trigger('keydown.enter');

        expect(wrapper.emitted('reject')?.[0]).toEqual([{ reason: 'duplicate', value: 'vue' }]);
        expect(wrapper.emitted('reject')?.[1]).toEqual([{ reason: 'maxTags', value: 'new' }]);
    });

    it('adds custom tag with comma key', async () => {
        const wrapper = mountTagInput({ modelValue: [], allowCustom: true });
        const input = wrapper.find('.vf-tag-input__control');

        await input.setValue('vite');
        await input.trigger('keydown', { key: ',' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['vite']]);
        expect(wrapper.emitted('add')?.[0]).toEqual([{ value: 'vite', source: 'custom' }]);
    });

    it('removes tag by chip remove button and supports clearable', async () => {
        const wrapper = mountTagInput({ modelValue: ['vue', 'ts'], clearable: true });

        await wrapper.findAll('.vf-tag-input__tag-remove')[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['ts']]);
        expect(wrapper.emitted('remove')?.[0]).toEqual(['vue']);

        await wrapper.find('.vf-tag-input__clear').trigger('click');
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[]]);
    });

    it('does not search or open panel in readonly mode', async () => {
        const wrapper = mountTagInput({ modelValue: ['vue'], readonly: true });
        const input = wrapper.find('.vf-tag-input__control');

        await input.setValue('new');
        await input.trigger('focus');
        await input.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.emitted('search')).toBeFalsy();
        expect(wrapper.find('.vf-tag-input').classes()).not.toContain('vf-tag-input_open');
        expect(wrapper.find('.vf-tag-input__chevron').attributes('disabled')).toBeDefined();
    });
});
