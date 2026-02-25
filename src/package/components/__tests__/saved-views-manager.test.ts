import { mount } from '@vue/test-utils';
import SavedViewsManager from '../saved-views-manager.vue';

const baseItems = [
    { id: 'v1', name: 'My Open Issues', state: { status: 'open' }, isDefault: true, shared: false },
    { id: 'v2', name: 'Urgent', state: { priority: 'high' }, isDefault: false, shared: true },
];

describe('SavedViewsManager', () => {
    it('saves a new view from draft name', async () => {
        const wrapper = mount(SavedViewsManager, {
            props: {
                items: [],
                currentState: { status: 'open' },
            },
        });

        await wrapper.find('.vf-saved-views-manager__input').setValue('Today');
        await wrapper.findAll('.vf-saved-views-manager__button')[0].trigger('click');

        expect(wrapper.emitted('save')).toBeTruthy();
        const itemsPayload = wrapper.emitted('update:items')?.at(-1)?.[0] as Array<{ name: string }>;
        expect(itemsPayload[0].name).toBe('Today');
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toBeTruthy();
    });

    it('renames selected view and toggles share state', async () => {
        const wrapper = mount(SavedViewsManager, {
            props: {
                items: baseItems,
                modelValue: 'v2',
            },
        });

        await wrapper.find('.vf-saved-views-manager__input').setValue('Critical');
        await wrapper.findAll('.vf-saved-views-manager__button')[1].trigger('click');
        await wrapper.findAll('.vf-saved-views-manager__button')[3].trigger('click');

        expect(wrapper.emitted('rename')).toBeTruthy();
        const renamed = wrapper.emitted('rename')?.at(-1)?.[0] as { name: string };
        expect(renamed.name).toBe('Critical');

        expect(wrapper.emitted('share')).toBeTruthy();
        const sharePayload = wrapper.emitted('share')?.at(-1) as Array<unknown>;
        expect(sharePayload[1]).toBe(false);
    });

    it('sets default and deletes selected view', async () => {
        const wrapper = mount(SavedViewsManager, {
            props: {
                items: baseItems,
                modelValue: 'v2',
            },
        });

        await wrapper.findAll('.vf-saved-views-manager__button')[2].trigger('click');
        expect(wrapper.emitted('setDefault')).toBeTruthy();
        const itemsAfterDefault = wrapper.emitted('update:items')?.at(-1)?.[0] as Array<{
            id: string;
            isDefault?: boolean;
        }>;
        const defaultIds = itemsAfterDefault.filter(item => item.isDefault).map(item => item.id);
        expect(defaultIds).toEqual(['v2']);

        await wrapper.findAll('.vf-saved-views-manager__button')[4].trigger('click');
        expect(wrapper.emitted('delete')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null]);
    });
});
