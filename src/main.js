import { createApp } from "vue";
import "./assets/scss/style.scss";
import "./assets/scss/reset.css";
import "./assets/style.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(router).mount("#app");
