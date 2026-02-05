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
});
