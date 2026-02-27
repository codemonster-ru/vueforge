/* eslint-disable vue/one-component-per-file */
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import DefaultsProvider from '../defaults-provider.vue';
import { useComponentDefaults } from '@/package/config/defaults-provider';

const Probe = defineComponent({
    props: {
        size: { type: String, default: undefined },
        dense: { type: Boolean, default: undefined },
    },
    setup(props) {
        const resolved = useComponentDefaults('Button', props as unknown as Record<string, unknown>, {
            size: 'md',
            dense: false,
        });

        return {
            resolved,
        };
    },
    template: '<div class="probe" />',
});

describe('DefaultsProvider', () => {
    it('applies scoped defaults and preserves explicit prop priority', () => {
        const Host = defineComponent({
            components: { DefaultsProvider, Probe },
            template: `
                <DefaultsProvider :defaults="{ Button: { size: 'lg', dense: true } }">
                    <Probe />
                </DefaultsProvider>
            `,
        });
        const wrapper = mount(Host);
        const probe = wrapper.findComponent(Probe);
        const resolved = probe.vm.resolved as { size: string; dense: boolean };
        expect(resolved.size).toBe('lg');
        expect(resolved.dense).toBe(true);

        const HostExplicit = defineComponent({
            components: { DefaultsProvider, Probe },
            template: `
                <DefaultsProvider :defaults="{ Button: { size: 'lg' } }">
                    <Probe size="sm" />
                </DefaultsProvider>
            `,
        });
        const explicitWrapper = mount(HostExplicit);
        const explicitProbe = explicitWrapper.findComponent(Probe);
        const explicitResolved = explicitProbe.vm.resolved as { size: string; dense: boolean };
        expect(explicitResolved.size).toBe('sm');
    });

    it('supports nested providers with local override precedence', () => {
        const HostNested = defineComponent({
            components: { DefaultsProvider, Probe },
            template: `
                <DefaultsProvider :defaults="{ Button: { size: 'lg' } }">
                    <DefaultsProvider :defaults="{ Button: { size: 'xs', dense: true } }">
                        <Probe />
                    </DefaultsProvider>
                </DefaultsProvider>
            `,
        });

        const wrapper = mount(HostNested);
        const probe = wrapper.findComponent(Probe);
        const resolved = probe.vm.resolved as { size: string; dense: boolean };
        expect(resolved.size).toBe('xs');
        expect(resolved.dense).toBe(true);
    });
});
