import { mount } from '@vue/test-utils';
import { vi } from 'vitest';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<i />',
    },
}));

import Chip from '../chip.vue';

describe('Chip', () => {
    it('renders label text', () => {
        const wrapper = mount(Chip, { props: { label: 'New' } });

        expect(wrapper.text()).toContain('New');
    });

    it('emits close when closable', async () => {
        const wrapper = mount(Chip, { props: { closable: true } });

        await wrapper.find('button').trigger('click');

        expect(wrapper.emitted('close')?.length).toBe(1);
    });

    it('does not emit close when disabled', async () => {
        const wrapper = mount(Chip, { props: { closable: true, disabled: true } });

        await wrapper.find('button').trigger('click');

        expect(wrapper.emitted('close')).toBeUndefined();
        expect(wrapper.classes()).toContain('vf-chip_disabled');
    });
});
