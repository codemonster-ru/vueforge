import { mount } from '@vue/test-utils';
import Toolbar from '../toolbar.vue';

describe('Toolbar', () => {
    it('renders toolbar role and default grouped controls', () => {
        const wrapper = mount(Toolbar, {
            props: {
                ariaLabel: 'Page toolbar',
            },
            slots: {
                default: '<button type="button" class="toolbar-btn">Action</button>',
            },
        });

        expect(wrapper.attributes('role')).toBe('toolbar');
        expect(wrapper.attributes('aria-label')).toBe('Page toolbar');
        expect(wrapper.find('.vf-toolbar__section_default').attributes('role')).toBe('group');
        expect(wrapper.find('.toolbar-btn').exists()).toBe(true);
    });

    it('renders start/center/end groups and orientation classes', () => {
        const wrapper = mount(Toolbar, {
            props: {
                orientation: 'vertical',
                wrap: false,
                dense: true,
            },
            slots: {
                start: '<button type="button" class="start-btn">Start</button>',
                center: '<button type="button" class="center-btn">Center</button>',
                end: '<button type="button" class="end-btn">End</button>',
            },
        });

        expect(wrapper.classes()).toContain('vf-toolbar_vertical');
        expect(wrapper.classes()).not.toContain('vf-toolbar_wrap');
        expect(wrapper.classes()).toContain('vf-toolbar_dense');
        expect(wrapper.find('.vf-toolbar__section_start').exists()).toBe(true);
        expect(wrapper.find('.vf-toolbar__section_center').exists()).toBe(true);
        expect(wrapper.find('.vf-toolbar__section_end').exists()).toBe(true);
    });
});
