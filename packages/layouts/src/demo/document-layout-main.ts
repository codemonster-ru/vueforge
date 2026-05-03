import { createApp, defineComponent, h } from "vue";
import { VfThemeProvider } from "@codemonster-ru/vueforge-core";
import "@codemonster-ru/vueforge-core/styles.css";
import "../styles.css";
import "./pages/pages.css";
import DocumentLayoutPage from "./pages/DocumentLayoutPage.vue";
import VueForgeLayouts from "../index";

const Root = defineComponent({
  name: "DocumentLayoutDemoRoot",
  setup() {
    return () =>
      h(VfThemeProvider, null, {
        default: () => h(DocumentLayoutPage)
      });
  }
});

const app = createApp(Root);

app.use(VueForgeLayouts, {
  defaultTheme: "light"
});

app.mount("#app");
