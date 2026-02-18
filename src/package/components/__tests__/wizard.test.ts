import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Wizard from '../wizard.vue';
import WizardStep from '../wizard-step.vue';

const createWrapper = (options: Parameters<typeof mount>[1] = {}) => {
    return mount(
        {
            components: { Wizard, WizardStep },
            template: `
                <Wizard v-model="step" :steps="steps" :validate-step="validateStep" @complete="onComplete">
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
                    validateStep: undefined,
                };
            },
        });

        await nextTick();
        await wrapper.find('.vf-wizard__button_primary').trigger('click');

        expect(wrapper.findComponent(Wizard).emitted('complete')?.length).toBe(1);
    });
});
