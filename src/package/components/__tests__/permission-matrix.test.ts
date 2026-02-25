import { mount } from '@vue/test-utils';
import PermissionMatrix from '../permission-matrix.vue';

const roles = [
    { id: 'owner', label: 'Owner', description: 'Full access' },
    { id: 'editor', label: 'Editor' },
];

const capabilities = [
    { id: 'users.read', label: 'Read users' },
    { id: 'users.manage', label: 'Manage users' },
];

describe('PermissionMatrix', () => {
    it('renders role/capability matrix', () => {
        const wrapper = mount(PermissionMatrix, {
            props: {
                roles,
                capabilities,
            },
        });

        expect(wrapper.findAll('.vf-permission-matrix__row').length).toBe(3);
        expect(wrapper.text()).toContain('Owner');
        expect(wrapper.text()).toContain('Read users');
    });

    it('cycles tri-state values and emits updates', async () => {
        const wrapper = mount(PermissionMatrix, {
            props: {
                roles,
                capabilities,
                modelValue: {},
            },
        });

        const button = wrapper.find('.vf-permission-matrix__toggle');

        expect(button.text()).toBe('Inherit');

        await button.trigger('click');
        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({
            owner: { 'users.read': 'allow' },
        });
        expect(wrapper.emitted('cellChange')?.[0]?.[0]).toMatchObject({
            state: 'allow',
            previousState: 'inherit',
        });

        await wrapper.setProps({ modelValue: { owner: { 'users.read': 'allow' } } });
        await button.trigger('click');
        expect(wrapper.emitted('update:modelValue')?.[1]?.[0]).toMatchObject({
            owner: { 'users.read': 'deny' },
        });

        await wrapper.setProps({ modelValue: { owner: { 'users.read': 'deny' } } });
        await button.trigger('click');
        expect(wrapper.emitted('update:modelValue')?.[2]?.[0]).toMatchObject({
            owner: { 'users.read': 'inherit' },
        });
    });

    it('respects initial model value and aria labels', () => {
        const wrapper = mount(PermissionMatrix, {
            props: {
                roles,
                capabilities,
                modelValue: {
                    owner: { 'users.read': 'allow' },
                },
            },
        });

        const button = wrapper.find('.vf-permission-matrix__toggle');

        expect(button.text()).toBe('Allow');
        expect(button.attributes('aria-label')).toContain('Owner Read users: Allow');
    });

    it('does not toggle when disabled', async () => {
        const wrapper = mount(PermissionMatrix, {
            props: {
                roles,
                capabilities,
                modelValue: {},
                disabled: true,
            },
        });

        await wrapper.find('.vf-permission-matrix__toggle').trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.find('.vf-permission-matrix__toggle').attributes('disabled')).toBeDefined();
    });
});
