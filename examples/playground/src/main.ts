import { createApp } from 'vue';
import VueForgeLayouts from '@codemonster-ru/vueforge-layouts';
import { VuePlaygroundPlugin } from '@codemonster-ru/vueforge-playground';

import '@codemonster-ru/vueforge-core/styles.css';
import '@codemonster-ru/vueforge-layouts/styles.css';
import '@codemonster-ru/vueforge-playground/style.css';
import '@codemonster-ru/vueforge-codeblock/style.css';

import App from './App.vue';

createApp(App)
  .use(VueForgeLayouts, {
    defaultTheme: 'system',
    themeStorageKey: 'codemonster-playground-theme'
  })
  .use(VuePlaygroundPlugin)
  .mount('#app');
