<template>
    <h1>Button</h1>
    <p>Button is an extension to standard input element with icons.</p>
    <h2>Import</h2>
    <CodeBlock>
        <span>import CmButton from @codemonster-ru/ui</span>
    </CodeBlock>
    <h2>Basic</h2>
    <p>Text to display on a button is defined with the label property.</p>
    <Demo>
        <Button label='Submit' />
    </Demo>
    <CodeBlock>
        <span>
            <span><</span>
            <span>cm-button label='Submit' /></span>
        </span>
    </CodeBlock>
    <h2>Icons</h2>
    <p>Icon of a button is specified with icon property and position is configured using iconPos attribute.</p>
    <Demo class='cm-demo-buttons'>
        <div class='cm-demo-buttons_flex'>
            <Button icon='house' />
            <Button icon='user' label='Profile' />
            <Button icon='check' label='Save' icon-pos='right' />
        </div>
        <div class='cm-demo-buttons_flex'>
            <Button icon='magnifyingGlass' label='Search' icon-pos='top' />
            <Button icon='rotateRight' label='Update' icon-pos='bottom' />
        </div>
    </Demo>
    <CodeBlock>
        <span>
            <span><</span>
            <span>cm-button icon='house' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='user' label='Profile' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='check' label='Save' icon-pos='right' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='magnifyingGlass' label='Search' icon-pos='top' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='rotateRight' label='Update' icon-pos='bottom' /></span>
        </span>
    </CodeBlock>
    <h2>Loading</h2>
    <p>Busy state is controlled with the loading property.</p>
    <Demo>
        <Button icon='check' label='Search' :loading='loading' @click='load' />
    </Demo>
    <CodeBlock>
        <span>
            <span><</span>
            <span>cm-button icon='check' label='Search' :loading='loading' @click='load' /></span>
        </span>
        <br>
        <span>
            <span><</span>
            <span>script setup></span>
        </span>
        <span>
            <span>import { ref } from 'vue';</span>
        </span>
        <br>
        <span>
            <span>const loading = ref(false);</span>
        </span>
        <span>
            <span>const load = () => {</span>
        </span>
        <span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;loading.value = true;</span>
        </span>
        <span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;setTimeout(() => loading.value = false, 2000);</span>
        </span>
        <span>
            <span>};</span>
        </span>
        <span>
            <span><</span>
            <span>/script></span>
        </span>
    </CodeBlock>
    <h2>Type</h2>
    <p>The button element can be displayed as a link, for this you need to specify the appropriate type.</p>
    <Demo class='cm-demo-buttons_flex'>
        <Button label='External' type='a' href='/' />
        <Button label='Router' type='router-link' to='/' />
    </Demo>
    <CodeBlock>
        <span>
            <span><</span>
            <span>cm-button label='External' type='a' href='/' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Router' type='router-link' to='/' /></span>
        </span>
    </CodeBlock>
    <h2>Severity</h2>
    <p>The button option is defined by the corresponding property.</p>
    <Demo class='cm-demo-buttons_flex'>
        <Button label='Primary' />
        <Button label='Secondary' severity='secondary' />
        <Button label='Success' severity='success' />
        <Button label='Info' severity='info' />
        <Button label='Warning' severity='warning' />
        <Button label='Danger' severity='danger' />
    </Demo>
    <CodeBlock>
        <span>
            <span><</span>
            <span>cm-button label='Primary' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Secondary' severity='secondary' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Success' severity='success' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Info' severity='info' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Warning' severity='warning' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Danger' severity='danger' /></span>
        </span>
    </CodeBlock>
    <h2>Disabled</h2>
    <p>To prohibit the use of an element, you must pass the corresponding property.</p>
    <Demo>
        <Button label='Submit' disabled />
    </Demo>
    <CodeBlock>
        <span>
            <span><</span>
            <span>cm-button label='Submit' disabled /></span>
        </span>
    </CodeBlock>
    <h2>Rounded</h2>
    <p>Rounded buttons have a circular border radius.</p>
    <Demo class='cm-demo-buttons_flex'>
        <Button label='Primary' rounded />
        <Button label='Secondary' severity='secondary' rounded />
        <Button label='Success' severity='success' rounded />
        <Button label='Info' severity='info' rounded />
        <Button label='Warning' severity='warning' rounded />
        <Button label='Danger' severity='danger' rounded />
    </Demo>
    <CodeBlock>
        <span>
            <span><</span>
            <span>cm-button label='Primary' rounded /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Secondary' severity='secondary' rounded /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Success' severity='success' rounded /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Info' severity='info' rounded /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Warning' severity='warning' rounded /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Danger' severity='danger' rounded /></span>
        </span>
    </CodeBlock>
    <h2>Text</h2>
    <p>Text buttons are displayed as textual elements.</p>
    <Demo class='cm-demo-buttons_flex'>
        <Button label='Primary' variant='text' />
        <Button label='Secondary' severity='secondary' variant='text' />
        <Button label='Success' severity='success' variant='text' />
        <Button label='Info' severity='info' variant='text' />
        <Button label='Warning' severity='warning' variant='text' />
        <Button label='Danger' severity='danger' variant='text' />
    </Demo>
    <CodeBlock>
        <span>
            <span><</span>
            <span>cm-button label='Primary' variant='text' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Secondary' severity='secondary' variant='text' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Success' severity='success' variant='text' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Info' severity='info' variant='text' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Warning' severity='warning' variant='text' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Danger' severity='danger' variant='text' /></span>
        </span>
    </CodeBlock>
    <h2>Outlined</h2>
    <p>Outlined buttons display a border without a transparent background.</p>
    <Demo class='cm-demo-buttons_flex'>
        <Button label='Primary' variant='outlined' />
        <Button label='Secondary' severity='secondary' variant='outlined' />
        <Button label='Success' severity='success' variant='outlined' />
        <Button label='Info' severity='info' variant='outlined' />
        <Button label='Warning' severity='warning' variant='outlined' />
        <Button label='Danger' severity='danger' variant='outlined' />
    </Demo>
    <CodeBlock>
        <span>
            <span><</span>
            <span>cm-button label='Primary' variant='outlined' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Secondary' severity='secondary' variant='outlined' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Success' severity='success' variant='outlined' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Info' severity='info' variant='outlined' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Warning' severity='warning' variant='outlined' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Danger' severity='danger' variant='outlined' /></span>
        </span>
    </CodeBlock>
    <h2>Icon only</h2>
    <p>Buttons can have icons without labels.</p>
    <Demo class='cm-demo-buttons'>
        <div class='cm-demo-buttons_flex'>
            <Button icon='house' />
            <Button icon='user' severity='secondary' />
            <Button icon='check' severity='success' />
            <Button icon='magnifyingGlass' severity='info' />
            <Button icon='rotateRight' severity='warning' />
            <Button icon='moon' severity='danger' />
        </div>
        <div class='cm-demo-buttons_flex'>
            <Button icon='house' rounded />
            <Button icon='user' severity='secondary' rounded />
            <Button icon='check' severity='success' rounded />
            <Button icon='magnifyingGlass' severity='info' rounded />
            <Button icon='rotateRight' severity='warning' rounded />
            <Button icon='moon' severity='danger' rounded />
        </div>
        <div class='cm-demo-buttons_flex'>
            <Button icon='house' variant='text' />
            <Button icon='user' severity='secondary' variant='text' />
            <Button icon='check' severity='success' variant='text' />
            <Button icon='magnifyingGlass' severity='info' variant='text' />
            <Button icon='rotateRight' severity='warning' variant='text' />
            <Button icon='moon' severity='danger' variant='text' />
        </div>
        <div class='cm-demo-buttons_flex'>
            <Button icon='house' variant='outlined' />
            <Button icon='user' severity='secondary' variant='outlined' />
            <Button icon='check' severity='success' variant='outlined' />
            <Button icon='magnifyingGlass' severity='info' variant='outlined' />
            <Button icon='rotateRight' severity='warning' variant='outlined' />
            <Button icon='moon' severity='danger' variant='outlined' />
        </div>
    </Demo>
    <CodeBlock>
        <span>
            <span><</span>
            <span>cm-button icon='house' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='user' severity='secondary' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='check' severity='success' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='magnifyingGlass' severity='info' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='rotateRight' severity='warning' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='moon' severity='danger' /></span>
        </span>

        <br>

        <span>
            <span><</span>
            <span>cm-button icon='house' rounded /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='user' severity='secondary' rounded /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='check' severity='success' rounded /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='magnifyingGlass' severity='info' rounded /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='rotateRight' severity='warning' rounded /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='moon' severity='danger' rounded /></span>
        </span>

        <br>

        <span>
            <span><</span>
            <span>cm-button icon='house' variant='text' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='user' severity='secondary' variant='text' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='check' severity='success' variant='text' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='magnifyingGlass' severity='info' variant='text' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='rotateRight' severity='warning' variant='text' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='moon' severity='danger' variant='text' /></span>
        </span>

        <br>

        <span>
            <span><</span>
            <span>cm-button icon='house' variant='outlined' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='user' severity='secondary' variant='outlined' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='check' severity='success' variant='outlined' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='magnifyingGlass' severity='info' variant='outlined' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='rotateRight' severity='warning' variant='outlined' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='moon' severity='danger' variant='outlined' /></span>
        </span>
    </CodeBlock>
    <h2>Sizes</h2>
    <p>Button provides small and large sizes as alternatives to the base.</p>
    <Demo class='cm-demo-buttons_flex'>
        <Button icon='check' label='Small' size='small' />
        <Button icon='check' label='Normal' />
        <Button icon='check' label='Large' size='large' />
    </Demo>
    <CodeBlock>
        <span>
            <span><</span>
            <span>cm-button icon='check' label='Small' size='small' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='check' label='Normal' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button icon='check' label='Large' size='large' /></span>
        </span>
    </CodeBlock>
</template>

<script setup lang='ts'>
import { Demo, Button, CodeBlock } from '@/lib';
import { ref } from 'vue';

const loading = ref(false);
const load = () => {
    loading.value = true;

    setTimeout(() => loading.value = false, 2000);
};
</script>

<style lang='scss'>
.cm-demo-buttons {
    display: flex;
    flex-direction: column;
}

.cm-demo-buttons_flex {
    display: flex;
}

.cm-demo-buttons_flex:not(:first-child) {
    margin-top: 12px;
}

.cm-demo-buttons_flex > *:not(:first-child) {
    margin-left: 12px;
}
</style>