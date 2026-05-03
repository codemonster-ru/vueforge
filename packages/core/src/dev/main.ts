import { createApp } from "vue";
import "./demo.css";
import App from "./App.vue";
import { VueForgeCore } from "@/index";

const app = createApp(App);

app.use(VueForgeCore);

app.mount("#app");
