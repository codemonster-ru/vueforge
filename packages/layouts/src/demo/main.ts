import { createApp, defineComponent, h } from "vue";
import { VfThemeProvider } from "@codemonster-ru/vueforge-core";
import "@codemonster-ru/vueforge-core/styles.css";
import "../styles.css";
import "./demo.css";
import App from "./App.vue";
import VueForgeLayouts from "../index";

const Root = defineComponent({
  name: "DemoRoot",
  setup() {
    return () => h(VfThemeProvider, null, { default: () => h(App) });
  }
});

const app = createApp(Root);

app.use(VueForgeLayouts, {
  defaultTheme: "light"
});

app.mount("#app");
