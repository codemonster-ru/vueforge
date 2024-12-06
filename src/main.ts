import { router } from '@/router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { Config, DefaultTheme } from './lib';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Config, {
    theme: {
        preset: DefaultTheme,
    },
});
app.mount('#app');