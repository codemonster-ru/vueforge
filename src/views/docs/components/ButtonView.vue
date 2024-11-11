<template>
    <h1>Button</h1>
    <p>Button is an extension to standard input element with icons.</p>
    <h2>Import</h2>
    <cm-code-block>
        <span>import CmButton from @codemonster-ru/ui</span>
    </cm-code-block>
    <h2>Basic</h2>
    <p>Text to display on a button is defined with the label property.</p>
    <cm-demo>
        <cm-button label='Submit' />
    </cm-demo>
    <cm-code-block>
        <span>
            <span><</span>
            <span>cm-button label='Submit' /></span>
        </span>
    </cm-code-block>
    <h2>Icons</h2>
    <p>Icon of a button is specified with icon property and position is configured using iconPos attribute.</p>
    <cm-demo class='cm-demo-buttons'>
        <div class='cm-demo-buttons_flex'>
            <cm-button icon='house' />
            <cm-button icon='user' label='Profile' />
            <cm-button icon='check' label='Save' icon-pos='right' />
        </div>
        <div class='cm-demo-buttons_flex'>
            <cm-button icon='magnifyingGlass' label='Search' icon-pos='top' />
            <cm-button icon='rotateRight' label='Update' icon-pos='bottom' />
        </div>
    </cm-demo>
    <cm-code-block>
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
    </cm-code-block>
    <h2>Loading</h2>
    <p>Busy state is controlled with the loading property.</p>
    <cm-demo>
        <cm-button icon='check' label='Search' :loading='loading' @click='load' />
    </cm-demo>
    <cm-code-block>
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
    </cm-code-block>
    <h2>Type</h2>
    <p>The button element can be displayed as a link, for this you need to specify the appropriate type.</p>
    <cm-demo class='cm-demo-buttons_flex'>
        <cm-button label='External' type='a' href='/' />
        <cm-button label='Router' type='router-link' to='/' />
    </cm-demo>
    <cm-code-block>
        <span>
            <span><</span>
            <span>cm-button label='External' type='a' href='/' /></span>
        </span>
        <span>
            <span><</span>
            <span>cm-button label='Router' type='router-link' to='/' /></span>
        </span>
    </cm-code-block>
    <h2>Severity</h2>
    <p>The button option is defined by the corresponding property.</p>
    <cm-demo class='cm-demo-buttons_flex'>
        <cm-button label='Primary' />
        <cm-button label='Secondary' severity='secondary' />
        <cm-button label='Success' severity='success' />
        <cm-button label='Info' severity='info' />
        <cm-button label='Warning' severity='warning' />
        <cm-button label='Danger' severity='danger' />
    </cm-demo>
    <cm-code-block>
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
    </cm-code-block>
    <h2>Disabled</h2>
    <p>To prohibit the use of an element, you must pass the corresponding property.</p>
    <cm-demo>
        <cm-button label='Submit' disabled />
    </cm-demo>
    <cm-code-block>
        <span>
            <span><</span>
            <span>cm-button label='Submit' disabled /></span>
        </span>
    </cm-code-block>
    <h2>Rounded</h2>
    <p>Rounded buttons have a circular border radius.</p>
    <cm-demo class='cm-demo-buttons_flex'>
        <cm-button label='Primary' rounded />
        <cm-button label='Secondary' severity='secondary' rounded />
        <cm-button label='Success' severity='success' rounded />
        <cm-button label='Info' severity='info' rounded />
        <cm-button label='Warning' severity='warning' rounded />
        <cm-button label='Danger' severity='danger' rounded />
    </cm-demo>
    <cm-code-block>
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
    </cm-code-block>
    <h2>Text</h2>
    <p>Text buttons are displayed as textual elements.</p>
    <cm-demo class='cm-demo-buttons_flex'>
        <cm-button label='Primary' variant='text' />
        <cm-button label='Secondary' severity='secondary' variant='text' />
        <cm-button label='Success' severity='success' variant='text' />
        <cm-button label='Info' severity='info' variant='text' />
        <cm-button label='Warning' severity='warning' variant='text' />
        <cm-button label='Danger' severity='danger' variant='text' />
    </cm-demo>
    <cm-code-block>
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
    </cm-code-block>
    <h2>Outlined</h2>
    <p>Outlined buttons display a border without a transparent background.</p>
    <cm-demo class='cm-demo-buttons_flex'>
        <cm-button label='Primary' variant='outlined' />
        <cm-button label='Secondary' severity='secondary' variant='outlined' />
        <cm-button label='Success' severity='success' variant='outlined' />
        <cm-button label='Info' severity='info' variant='outlined' />
        <cm-button label='Warning' severity='warning' variant='outlined' />
        <cm-button label='Danger' severity='danger' variant='outlined' />
    </cm-demo>
    <cm-code-block>
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
    </cm-code-block>
    <h2>Icon only</h2>
    <p>Buttons can have icons without labels.</p>
    <cm-demo class='cm-demo-buttons'>
        <div class='cm-demo-buttons_flex'>
            <cm-button icon='house' />
            <cm-button icon='user' severity='secondary' />
            <cm-button icon='check' severity='success' />
            <cm-button icon='magnifyingGlass' severity='info' />
            <cm-button icon='rotateRight' severity='warning' />
            <cm-button icon='moon' severity='danger' />
        </div>
        <div class='cm-demo-buttons_flex'>
            <cm-button icon='house' rounded />
            <cm-button icon='user' severity='secondary' rounded />
            <cm-button icon='check' severity='success' rounded />
            <cm-button icon='magnifyingGlass' severity='info' rounded />
            <cm-button icon='rotateRight' severity='warning' rounded />
            <cm-button icon='moon' severity='danger' rounded />
        </div>
        <div class='cm-demo-buttons_flex'>
            <cm-button icon='house' variant='text' />
            <cm-button icon='user' severity='secondary' variant='text' />
            <cm-button icon='check' severity='success' variant='text' />
            <cm-button icon='magnifyingGlass' severity='info' variant='text' />
            <cm-button icon='rotateRight' severity='warning' variant='text' />
            <cm-button icon='moon' severity='danger' variant='text' />
        </div>
        <div class='cm-demo-buttons_flex'>
            <cm-button icon='house' variant='outlined' />
            <cm-button icon='user' severity='secondary' variant='outlined' />
            <cm-button icon='check' severity='success' variant='outlined' />
            <cm-button icon='magnifyingGlass' severity='info' variant='outlined' />
            <cm-button icon='rotateRight' severity='warning' variant='outlined' />
            <cm-button icon='moon' severity='danger' variant='outlined' />
        </div>
    </cm-demo>
    <cm-code-block>
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
    </cm-code-block>
    <h2>Sizes</h2>
    <p>Button provides small and large sizes as alternatives to the base.</p>
    <cm-demo class='cm-demo-buttons_flex'>
        <cm-button icon='check' label='Small' size='small' />
        <cm-button icon='check' label='Normal' />
        <cm-button icon='check' label='Large' size='large' />
    </cm-demo>
    <cm-code-block>
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
    </cm-code-block>
</template>

<script setup lang='ts'>
import { CmDemo, CmButton, CmCodeBlock } from '@/lib';
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