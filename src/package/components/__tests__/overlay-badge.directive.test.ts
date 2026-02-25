import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { vOverlayBadge } from '@/package/directives/overlay-badge';

const DirectiveHost = defineComponent({
    directives: {
        overlayBadge: vOverlayBadge,
    },
    props: {
        binding: {
            type: [String, Number, Object, null],
            default: null,
        },
    },
    template: '<button v-overlay-badge="binding" type="button">Target</button>',
});

describe('vOverlayBadge', () => {
    it('renders overlay badge on host element', () => {
        const wrapper = mount(DirectiveHost, {
            props: {
                binding: 7,
            },
        });

        const badge = wrapper.find('[data-vf-overlay-badge="true"]');

        expect(badge.exists()).toBe(true);
        expect(badge.text()).toBe('7');
    });

    it('updates on reactive binding changes', async () => {
        const wrapper = mount(DirectiveHost, {
            props: {
                binding: 4,
            },
        });

        expect(wrapper.find('[data-vf-overlay-badge="true"]').text()).toBe('4');
        await wrapper.setProps({ binding: 11 });
        expect(wrapper.find('[data-vf-overlay-badge="true"]').text()).toBe('11');

        await wrapper.setProps({ binding: null });
        expect(wrapper.find('[data-vf-overlay-badge="true"]').exists()).toBe(false);
    });

    it('supports options object with dot and position', () => {
        const wrapper = mount(DirectiveHost, {
            props: {
                binding: {
                    dot: true,
                    position: 'bottom-left',
                    severity: 'success',
                },
            },
        });

        const badge = wrapper.find('[data-vf-overlay-badge="true"]');

        expect(badge.attributes('data-dot')).toBe('true');
        expect(badge.attributes('data-position')).toBe('bottom-left');
        expect(badge.attributes('data-severity')).toBe('success');
    });
});
