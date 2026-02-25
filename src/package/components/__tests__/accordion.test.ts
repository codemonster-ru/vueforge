import { mount } from '@vue/test-utils';
import Accordion from '../accordion.vue';
import AccordionItem from '../accordion-item.vue';

describe('Accordion', () => {
    it('updates modelValue when an item is toggled', async () => {
        const wrapper = mount({
            components: { Accordion, AccordionItem },
            template: `
                <Accordion v-model="value">
                    <AccordionItem value="a" title="A">A body</AccordionItem>
                    <AccordionItem value="b" title="B">B body</AccordionItem>
                </Accordion>
            `,
            data() {
                return { value: 'a' };
            },
        });

        const headers = wrapper.findAll('button');

        await headers[1].trigger('click');

        expect(wrapper.vm.value).toBe('b');

        await headers[1].trigger('click');

        expect(wrapper.vm.value).toBeUndefined();
    });

    it('supports multiple open items', async () => {
        const wrapper = mount({
            components: { Accordion, AccordionItem },
            template: `
                <Accordion v-model="value" multiple>
                    <AccordionItem value="a" title="A">A body</AccordionItem>
                    <AccordionItem value="b" title="B">B body</AccordionItem>
                </Accordion>
            `,
            data() {
                return { value: ['a'] };
            },
        });

        const headers = wrapper.findAll('button');

        await headers[1].trigger('click');

        expect(wrapper.vm.value).toEqual(['a', 'b']);

        await headers[0].trigger('click');

        expect(wrapper.vm.value).toEqual(['b']);
    });

    it('ignores toggles when disabled', async () => {
        const wrapper = mount({
            components: { Accordion, AccordionItem },
            template: `
                <Accordion v-model="value" disabled>
                    <AccordionItem value="a" title="A">A body</AccordionItem>
                    <AccordionItem value="b" title="B">B body</AccordionItem>
                </Accordion>
            `,
            data() {
                return { value: 'a' };
            },
        });

        const headers = wrapper.findAll('button');

        await headers[1].trigger('click');

        expect(wrapper.vm.value).toBe('a');
    });

    it('moves header focus with arrow keys', async () => {
        const wrapper = mount(
            {
                components: { Accordion, AccordionItem },
                template: `
                    <Accordion v-model="value">
                        <AccordionItem value="a" title="A">A body</AccordionItem>
                        <AccordionItem value="b" title="B">B body</AccordionItem>
                        <AccordionItem value="c" title="C">C body</AccordionItem>
                    </Accordion>
                `,
                data() {
                    return { value: 'a' };
                },
            },
            { attachTo: document.body },
        );

        const headers = wrapper.findAll('.vf-accordion__header');
        const first = headers[0].element as HTMLButtonElement;
        const second = headers[1].element as HTMLButtonElement;

        first.focus();
        await headers[0].trigger('keydown', { key: 'ArrowDown' });
        expect(document.activeElement).toBe(second);

        await headers[1].trigger('keydown', { key: 'Home' });
        expect(document.activeElement).toBe(first);

        wrapper.unmount();
    });

    it('wires aria attributes between header and panel', () => {
        const wrapper = mount({
            components: { Accordion, AccordionItem },
            template: `
                <Accordion v-model="value">
                    <AccordionItem value="profile" title="Profile">Profile body</AccordionItem>
                </Accordion>
            `,
            data() {
                return { value: 'profile' };
            },
        });

        const header = wrapper.get('.vf-accordion__header');
        const panel = wrapper.get('.vf-accordion__panel');
        const headerId = header.attributes('id');
        const panelId = panel.attributes('id');

        expect(header.attributes('aria-controls')).toBe(panelId);
        expect(panel.attributes('aria-labelledby')).toBe(headerId);
    });

    it('does not render closed panel content when unmount is enabled', async () => {
        const wrapper = mount({
            components: { Accordion, AccordionItem },
            template: `
                <Accordion v-model="value">
                    <AccordionItem value="one" title="One" unmount>One body</AccordionItem>
                    <AccordionItem value="two" title="Two" unmount>Two body</AccordionItem>
                </Accordion>
            `,
            data() {
                return { value: 'one' };
            },
        });

        expect(wrapper.html()).toContain('One body');
        expect(wrapper.html()).not.toContain('Two body');

        const headers = wrapper.findAll('.vf-accordion__header');
        await headers[1].trigger('click');

        expect(wrapper.html()).not.toContain('One body');
        expect(wrapper.html()).toContain('Two body');
    });

    it('prevents toggling for item-level disabled state', async () => {
        const wrapper = mount({
            components: { Accordion, AccordionItem },
            template: `
                <Accordion v-model="value">
                    <AccordionItem value="a" title="A">A body</AccordionItem>
                    <AccordionItem value="b" title="B" disabled>B body</AccordionItem>
                </Accordion>
            `,
            data() {
                return { value: 'a' };
            },
        });

        const headers = wrapper.findAll('.vf-accordion__header');
        expect(headers[1].attributes('disabled')).toBeDefined();

        await headers[1].trigger('click');

        expect(wrapper.vm.value).toBe('a');
    });

    it('applies dense and grouped classes with group header/actions pattern', () => {
        const wrapper = mount({
            components: { Accordion, AccordionItem },
            template: `
                <Accordion v-model="value" dense grouped group-title="Notifications" group-description="Rules">
                    <template #group-actions>
                        <button type="button" class="group-action">Manage</button>
                    </template>
                    <AccordionItem value="a" title="A">A body</AccordionItem>
                    <AccordionItem value="b" title="B">B body</AccordionItem>
                </Accordion>
            `,
            data() {
                return { value: 'a' };
            },
        });

        expect(wrapper.find('.vf-accordion').classes()).toContain('vf-accordion_dense');
        expect(wrapper.find('.vf-accordion').classes()).toContain('vf-accordion_grouped');
        expect(wrapper.find('.vf-accordion__group-title').text()).toBe('Notifications');
        expect(wrapper.find('.group-action').exists()).toBe(true);
    });

    it('emits analytics hooks for expand and collapse', async () => {
        const wrapper = mount({
            components: { Accordion, AccordionItem },
            template: `
                <Accordion v-model="value" analytics analytics-context="settings-audit">
                    <AccordionItem value="a" title="A">A body</AccordionItem>
                    <AccordionItem value="b" title="B">B body</AccordionItem>
                </Accordion>
            `,
            data() {
                return { value: undefined };
            },
        });

        const headers = wrapper.findAll('.vf-accordion__header');
        await headers[0].trigger('click');
        await headers[0].trigger('click');

        expect(wrapper.findComponent(Accordion).emitted('itemExpand')?.length).toBe(1);
        expect(wrapper.findComponent(Accordion).emitted('itemCollapse')?.length).toBe(1);
        const analytics = wrapper.findComponent(Accordion).emitted('analytics');
        expect(analytics?.length).toBe(2);
        expect((analytics?.[0]?.[0] as { context?: string }).context).toBe('settings-audit');
    });
});
