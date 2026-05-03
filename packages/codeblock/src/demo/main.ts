import { createApp, h } from "vue";
import VueForgeCore, { VfThemeProvider } from "@codemonster-ru/vueforge-core";
import "@codemonster-ru/vueforge-core/styles.css";
import "@codemonster-ru/vueforge-layouts/styles.css";
import App from "./App.vue";

createApp({
  render: () => h(VfThemeProvider, null, { default: () => h(App) }),
})
  .use(VueForgeCore, {
    defaultTheme: "system",
    themeStorageKey: "vcb-demo-theme",
  })
  .mount("#app");
