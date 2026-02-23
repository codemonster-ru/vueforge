import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import SplitButton from '../split-button.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

const items = [{ label: 'Rename' }, { label: 'Delete' }];

const mountSplitButton = (options: Parameters<typeof mount>[1] = {}) => {
    return mount(SplitButton, {
        props: {
            label: 'Save',
            items,
        },
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
                Link: {
                    template: '<a class="vf-menu__link"><slot /></a>',
                },
            },
        },
        ...options,
    });
};

describe('SplitButton', () => {
    it('emits click when primary button is pressed', async () => {
        const wrapper = mountSplitButton();

        await wrapper.find('.vf-splitbutton__main').trigger('click');

        expect(wrapper.emitted('click')?.length).toBe(1);

        wrapper.unmount();
    });

    it('opens menu when toggle is clicked', async () => {
        const wrapper = mountSplitButton();

        await wrapper.find('.vf-dropdown__trigger').trigger('click');
        await nextTick();

        expect(wrapper.find('.vf-dropdown__panel').isVisible()).toBe(true);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);

        wrapper.unmount();
    });

    it('closes on item select by default', async () => {
        const wrapper = mountSplitButton({
            slots: {
                menu: '<button class="close-item" data-dropdown-close>Close</button>',
            },
        });

        await wrapper.find('.vf-dropdown__trigger').trigger('click');
        await nextTick();
        await wrapper.find('.close-item').trigger('click');
        await nextTick();

        expect(wrapper.emitted('select')?.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false]);

        wrapper.unmount();
    });

    it('renders custom menu slot', async () => {
        const wrapper = mountSplitButton({
            slots: {
                menu: '<button class="custom-menu-item" data-dropdown-close>Custom</button>',
            },
        });

        await wrapper.find('.vf-dropdown__trigger').trigger('click');
        await nextTick();

        expect(wrapper.find('.custom-menu-item').exists()).toBe(true);

        wrapper.unmount();
    });

    it('applies toggle aria label and group label', () => {
        const wrapper = mountSplitButton({
            props: {
                toggleAriaLabel: 'Open save actions',
                ariaLabel: 'Save actions',
            },
        });

        expect(wrapper.attributes('role')).toBe('group');
        expect(wrapper.attributes('aria-label')).toBe('Save actions');
        expect(wrapper.find('.vf-splitbutton__toggle').attributes('aria-label')).toBe('Open save actions');

        wrapper.unmount();
    });

    it('does not emit primary click when disabled or loading', async () => {
        const disabledWrapper = mountSplitButton({
            props: {
                disabled: true,
            },
        });

        await disabledWrapper.find('.vf-splitbutton__main').trigger('click');
        expect(disabledWrapper.emitted('click')).toBeUndefined();
        disabledWrapper.unmount();

        const loadingWrapper = mountSplitButton({
            props: {
                loading: true,
            },
        });

        await loadingWrapper.find('.vf-splitbutton__main').trigger('click');
        expect(loadingWrapper.emitted('click')).toBeUndefined();
        loadingWrapper.unmount();
    });
});
