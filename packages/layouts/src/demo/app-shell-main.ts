import { createApp, defineComponent, h } from "vue";
import { VfThemeProvider } from "@codemonster-ru/vueforge-core";
import "@codemonster-ru/vueforge-core/styles.css";
import "../styles.css";
import "./pages/pages.css";
import AppShellPage from "./pages/AppShellPage.vue";
import VueForgeLayouts from "../index";

const Root = defineComponent({
  name: "AppShellDemoRoot",
  setup() {
    return () =>
      h(VfThemeProvider, null, {
        default: () => h(AppShellPage)
      });
  }
});

const app = createApp(Root);

app.use(VueForgeLayouts, {
  defaultTheme: "light"
});

app.mount("#app");
