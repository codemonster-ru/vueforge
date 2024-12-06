<template>
    <h1>Quick start</h1>
    <p>Installation guides for popular development environments.</p>
    <h2>Using NPM</h2>
    <p>Package is available for download on npm registry.</p>
    <CodeBlock>
        <span># Using npm</span>
        <span>npm install @codemonster-ru/ui</span>
        <br>
        <span># Using yarn</span>
        <span>yarn add @codemonster-ru/ui</span>
        <br>
        <span># Using pnpm</span>
        <span>pnpm add @codemonster-ru/ui</span>
    </CodeBlock>
    <h2>Using from CDN</h2>
    <p>In development.</p>
    <h2>Usage</h2>
    <p>Each component can be imported and registered individually so that you only bundle what you use. Import path is
        available in the documentation of the corresponding component.</p>
    <CodeBlock>
        <span>import CmButton from '@codemonster-ru/ui';</span>
        <br>
        <span>const app = createApp(App);</span>
        <span>app.component('CmButton', CmButton);</span>
    </CodeBlock>
</template>

<script setup lang='ts'>
import { CodeBlock } from '@/lib';
</script>