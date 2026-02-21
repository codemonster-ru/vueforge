import { mount } from '@vue/test-utils';
import Tabs from '../tabs.vue';
import Tab from '../tab.vue';
import TabPanel from '../tab-panel.vue';

describe('A11y Navigation Flows', () => {
    it('wires tabs and tabpanels with ARIA ids', () => {
        const wrapper = mount({
            components: { Tabs, Tab, TabPanel },
            template: `
                <Tabs v-model="value" aria-label="Sections">
                    <template #tabs>
                        <Tab value="overview">Overview</Tab>
                        <Tab value="details">Details</Tab>
                    </template>
                    <template #panels>
                        <TabPanel value="overview">Overview panel</TabPanel>
                        <TabPanel value="details">Details panel</TabPanel>
                    </template>
                </Tabs>
            `,
            data() {
                return { value: 'overview' };
            },
        });

        const tablist = wrapper.find('[role="tablist"]');
        const tabs = wrapper.findAll('[role="tab"]');
        const activePanel = wrapper.find('[role="tabpanel"]');

        expect(tablist.attributes('aria-label')).toBe('Sections');
        expect(tabs[0].attributes('aria-controls')).toBeTruthy();
        expect(activePanel.attributes('aria-labelledby')).toBe(tabs[0].attributes('id'));
    });

    it('supports keyboard arrow navigation across tabs', async () => {
        const wrapper = mount({
            components: { Tabs, Tab, TabPanel },
            template: `
                <Tabs v-model="value">
                    <template #tabs>
                        <Tab value="overview">Overview</Tab>
                        <Tab value="details">Details</Tab>
                    </template>
                    <template #panels>
                        <TabPanel value="overview">Overview panel</TabPanel>
                        <TabPanel value="details">Details panel</TabPanel>
                    </template>
                </Tabs>
            `,
            data() {
                return { value: 'overview' };
            },
        });

        await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' });

        const tabs = wrapper.findAll('[role="tab"]');

        expect(tabs[1].attributes('aria-selected')).toBe('true');
    });
});
