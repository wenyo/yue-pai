import { createApp } from "vue";
import "./assets/scss/basic.scss";
import "./assets/scss/reset.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(router).mount("#app");
