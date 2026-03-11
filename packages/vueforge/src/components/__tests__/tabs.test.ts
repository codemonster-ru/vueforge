import { mount } from '@vue/test-utils';
import Tabs from '../tabs.vue';
import Tab from '../tab.vue';
import TabPanel from '../tab-panel.vue';

describe('Tabs', () => {
    it('updates modelValue when a tab is clicked', async () => {
        const wrapper = mount({
            components: { Tabs, Tab, TabPanel },
            template: `
                <Tabs v-model="value">
                    <template #tabs>
                        <Tab value="a">A</Tab>
                        <Tab value="b">B</Tab>
                    </template>
                    <template #panels>
                        <TabPanel value="a">A panel</TabPanel>
                        <TabPanel value="b">B panel</TabPanel>
                    </template>
                </Tabs>
            `,
            data() {
                return { value: 'a' };
            },
        });

        const tabs = wrapper.findAll('button[role="tab"]');

        await tabs[1].trigger('click');

        expect(wrapper.vm.value).toBe('b');
    });

    it('disables tabs when Tabs is disabled', () => {
        const wrapper = mount({
            components: { Tabs, Tab },
            template: `
                <Tabs v-model="value" disabled>
                    <template #tabs>
                        <Tab value="a">A</Tab>
                    </template>
                </Tabs>
            `,
            data() {
                return { value: 'a' };
            },
        });

        const tab = wrapper.find('button[role="tab"]');

        expect(tab.attributes('disabled')).toBeDefined();
    });

    it('moves selection with arrow keys', async () => {
        const wrapper = mount({
            components: { Tabs, Tab, TabPanel },
            template: `
                <Tabs v-model="value">
                    <template #tabs>
                        <Tab value="a">A</Tab>
                        <Tab value="b">B</Tab>
                    </template>
                    <template #panels>
                        <TabPanel value="a">A panel</TabPanel>
                        <TabPanel value="b">B panel</TabPanel>
                    </template>
                </Tabs>
            `,
            data() {
                return { value: 'a' };
            },
        });

        const list = wrapper.find('[role="tablist"]');

        await list.trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.vm.value).toBe('b');
    });

    it('supports vertical keyboard navigation and Home/End', async () => {
        const wrapper = mount({
            components: { Tabs, Tab, TabPanel },
            template: `
                <Tabs v-model="value" orientation="vertical">
                    <template #tabs>
                        <Tab value="a">A</Tab>
                        <Tab value="b">B</Tab>
                        <Tab value="c">C</Tab>
                    </template>
                    <template #panels>
                        <TabPanel value="a">A panel</TabPanel>
                        <TabPanel value="b">B panel</TabPanel>
                        <TabPanel value="c">C panel</TabPanel>
                    </template>
                </Tabs>
            `,
            data() {
                return { value: 'b' };
            },
        });

        const list = wrapper.find('[role="tablist"]');
        await list.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.vm.value).toBe('c');

        await list.trigger('keydown', { key: 'Home' });
        expect(wrapper.vm.value).toBe('a');

        await list.trigger('keydown', { key: 'End' });
        expect(wrapper.vm.value).toBe('c');
    });

    it('wires tab and tabpanel semantics and hides inactive panel', () => {
        const wrapper = mount({
            components: { Tabs, Tab, TabPanel },
            template: `
                <Tabs v-model="value">
                    <template #tabs>
                        <Tab value="a">A</Tab>
                        <Tab value="b">B</Tab>
                    </template>
                    <template #panels>
                        <TabPanel value="a">A panel</TabPanel>
                        <TabPanel value="b">B panel</TabPanel>
                    </template>
                </Tabs>
            `,
            data() {
                return { value: 'a' };
            },
        });

        const tabs = wrapper.findAll('[role="tab"]');
        const panels = wrapper.findAll('[role="tabpanel"]');

        expect(tabs).toHaveLength(2);
        expect(panels).toHaveLength(2);
        expect(tabs[0].attributes('aria-controls')).toBe(panels[0].attributes('id'));
        expect(panels[0].attributes('aria-labelledby')).toBe(tabs[0].attributes('id'));
        expect(panels[0].attributes('tabindex')).toBe('0');
        expect(panels[0].isVisible()).toBe(true);
        expect(panels[1].isVisible()).toBe(false);
    });
});
