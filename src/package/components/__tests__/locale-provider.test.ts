/* eslint-disable vue/one-component-per-file */
import { computed, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import LocaleProvider from '../locale-provider.vue';
import { setLocaleText, useLocaleText } from '@/package/config/locale-text';

const Probe = defineComponent({
    setup() {
        const locale = useLocaleText();
        const commandPlaceholder = computed(() => locale.commandPalette.placeholder);
        const commonEmpty = computed(() => locale.common.emptyText);

        return {
            commandPlaceholder,
            commonEmpty,
        };
    },
    template: '<div class="probe" />',
});

describe('LocaleProvider', () => {
    afterEach(() => {
        setLocaleText();
    });

    it('applies scoped locale overrides without mutating global runtime locale', () => {
        setLocaleText({
            commandPalette: {
                placeholder: 'Global command placeholder',
            },
            common: {
                emptyText: 'Global empty',
            },
        });

        const Host = defineComponent({
            components: { LocaleProvider, Probe },
            template: `
                <LocaleProvider
                    :locale-text="{
                        commandPalette: { placeholder: 'Scoped command placeholder' },
                        common: { emptyText: 'Scoped empty' },
                    }"
                >
                    <Probe />
                </LocaleProvider>
            `,
        });

        const wrapper = mount(Host);
        const probe = wrapper.findComponent(Probe);
        expect(probe.vm.commandPlaceholder as string).toBe('Scoped command placeholder');
        expect(probe.vm.commonEmpty as string).toBe('Scoped empty');
    });

    it('supports nested providers with nearest scope precedence', () => {
        const HostNested = defineComponent({
            components: { LocaleProvider, Probe },
            template: `
                <LocaleProvider :locale-text="{ common: { emptyText: 'Outer empty' } }">
                    <LocaleProvider :locale-text="{ common: { emptyText: 'Inner empty' } }">
                        <Probe />
                    </LocaleProvider>
                </LocaleProvider>
            `,
        });

        const wrapper = mount(HostNested);
        const probe = wrapper.findComponent(Probe);
        expect(probe.vm.commonEmpty as string).toBe('Inner empty');
    });
});
