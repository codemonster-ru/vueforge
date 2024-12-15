<template>
    <h1>Styled mode</h1>
    <p>Use a standard theme or create your own.</p>
    <h2>Configuration API</h2>
    <h3>Theme</h3>
    <p>The theme property is used to customize the initial theme.</p>
    <CodeBlock>
        <span>import { Config, DefaultTheme } from './lib';</span>
        <br>
        <span>const app = createApp(App);</span>
        <br>
        <span>app.use(Config, {</span>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;theme: {</span>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;preset: DefaultTheme,</span>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;},</span>
        <span>});</span>
    </CodeBlock>
</template>

<script setup lang='ts'>
import { CodeBlock } from '@/lib';
</script>