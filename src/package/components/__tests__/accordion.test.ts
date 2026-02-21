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
});
