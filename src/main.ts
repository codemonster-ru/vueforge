import { router } from '@/router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { CmConfig, CmDefaultTheme } from './lib';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(CmConfig, {
    theme: {
        preset: CmDefaultTheme,
    },
});
app.mount('#app');