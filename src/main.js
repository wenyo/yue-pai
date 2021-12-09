import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/scss/basic.scss";
import "./assets/scss/reset.css";

createApp(App).use(store).use(router).mount("#app");
