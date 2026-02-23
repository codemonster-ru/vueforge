import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Wizard from '../wizard.vue';
import WizardStep from '../wizard-step.vue';

const createWrapper = (options: Parameters<typeof mount>[1] = {}) => {
    return mount(
        {
            components: { Wizard, WizardStep },
            template: `
                <Wizard v-model="step" :steps="steps" :linear="linear" :validate-step="validateStep" @complete="onComplete">
                    <WizardStep value="account">Account content</WizardStep>
                    <WizardStep value="plan">Plan content</WizardStep>
                    <WizardStep value="confirm">Confirm content</WizardStep>
                </Wizard>
            `,
            data() {
                return {
                    step: 'account',
                    steps: [
                        { value: 'account', title: 'Account' },
                        { value: 'plan', title: 'Plan' },
                        { value: 'confirm', title: 'Confirm' },
                    ],
                    linear: true,
                    validateStep: undefined as ((...args: Array<unknown>) => boolean) | undefined,
                };
            },
            methods: {
                onComplete() {
                    return undefined;
                },
            },
        },
        options,
    );
};

describe('Wizard', () => {
    it('moves to next step with Next button', async () => {
        const wrapper = createWrapper();

        await nextTick();
        await wrapper.find('.vf-wizard__button_primary').trigger('click');

        expect((wrapper.vm as unknown as { step: string }).step).toBe('plan');
        expect(wrapper.find('.vf-wizard__item.is-active .vf-wizard__title').text()).toContain('Plan');
    });

    it('emits invalidStep when step validation fails', async () => {
        const wrapper = createWrapper();
        const wizard = wrapper.findComponent(Wizard);

        (wrapper.vm as unknown as { validateStep: (...args: Array<unknown>) => boolean }).validateStep = () => false;
        await nextTick();
        await wrapper.find('.vf-wizard__button_primary').trigger('click');

        expect(wizard.emitted('invalidStep')).toBeTruthy();
        expect((wrapper.vm as unknown as { step: string }).step).toBe('account');
    });

    it('emits complete on the last step', async () => {
        const wrapper = createWrapper({
            data() {
                return {
                    step: 'confirm',
                    steps: [
                        { value: 'account', title: 'Account' },
                        { value: 'plan', title: 'Plan' },
                        { value: 'confirm', title: 'Confirm' },
                    ],
                    linear: true,
                    validateStep: undefined,
                };
            },
        });

        await nextTick();
        await wrapper.find('.vf-wizard__button_primary').trigger('click');

        expect(wrapper.findComponent(Wizard).emitted('complete')?.length).toBe(1);
    });

    it('supports keyboard navigation across step tabs', async () => {
        const wrapper = createWrapper({
            attachTo: document.body,
            data() {
                return {
                    step: 'account',
                    steps: [
                        { value: 'account', title: 'Account' },
                        { value: 'plan', title: 'Plan' },
                        { value: 'confirm', title: 'Confirm' },
                    ],
                    linear: false,
                    validateStep: undefined,
                };
            },
        });

        const tablist = wrapper.find('.vf-wizard__list[role="tablist"]');
        const tabs = wrapper.findAll('.vf-wizard__step[role="tab"]');

        (tabs[0].element as HTMLButtonElement).focus();
        await tablist.trigger('keydown', { key: 'ArrowRight' });
        await nextTick();
        expect((wrapper.vm as unknown as { step: string }).step).toBe('plan');

        await tablist.trigger('keydown', { key: 'End' });
        await nextTick();
        expect((wrapper.vm as unknown as { step: string }).step).toBe('confirm');

        wrapper.unmount();
    });

    it('wires step tab/panel semantics and toggles aria-hidden for WizardStep', async () => {
        const wrapper = createWrapper({
            data() {
                return {
                    step: 'account',
                    steps: [
                        { value: 'account', title: 'Account' },
                        { value: 'plan', title: 'Plan' },
                        { value: 'confirm', title: 'Confirm' },
                    ],
                    linear: false,
                    validateStep: undefined,
                };
            },
        });

        const tabs = wrapper.findAll('.vf-wizard__step[role="tab"]');
        const panels = wrapper.findAll('.vf-wizard-step[role="tabpanel"]');

        expect(tabs).toHaveLength(3);
        expect(panels).toHaveLength(3);
        expect(tabs[0].attributes('aria-controls')).toBe(panels[0].attributes('id'));
        expect(panels[0].attributes('aria-labelledby')).toBe(tabs[0].attributes('id'));
        expect(panels[0].attributes('aria-hidden')).toBe('false');
        expect(panels[1].attributes('aria-hidden')).toBe('true');

        await tabs[1].trigger('click');
        await nextTick();

        expect(panels[0].attributes('aria-hidden')).toBe('true');
        expect(panels[1].attributes('aria-hidden')).toBe('false');
    });
});
