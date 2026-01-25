<template>
    <div class="vf-home">
        <h1>Examples</h1>
        <section class="vf-home__section">
            <h2>Theming</h2>
            <div class="vf-home__actions">
                <Button label="Apply Blue Theme" @click="applyBlueTheme" />
                <Button label="Reset Theme" severity="secondary" @click="resetTheme" />
                <Button label="Toggle Dark" severity="info" @click="toggleDark" />
            </div>
            <div class="vf-home__preview">
                <p class="vf-home__text">Theme preview block (uses color scheme tokens).</p>
                <p class="vf-home__muted">Toggle dark to see background and text change.</p>
            </div>
        </section>
        <h2>Layouts</h2>
        <ul>
            <li>
                <router-link to="/layouts/default">Default</router-link>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Button, DefaultTheme, setTheme, updateTheme } from '@/index';

const applyBlueTheme = () => {
    updateTheme({
        overrides: {
            colors: {
                blue: '#2b6cb0',
            },
        },
    });
};
const resetTheme = () => {
    setTheme({ preset: DefaultTheme });
};
const toggleDark = () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
};
</script>

<style>
.vf-home {
    padding-right: 1rem;
    padding-left: 1rem;
}

.vf-home__section {
    margin-bottom: 1.5rem;
}

.vf-home__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.vf-home__preview {
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid var(--vf-border-color);
    background-color: var(--vf-bg-color);
    color: var(--vf-text-color);
}

.vf-home__text {
    margin: 0 0 0.5rem;
}

.vf-home__muted {
    margin: 0;
    color: var(--vf-secondary-text-color);
}
</style>
