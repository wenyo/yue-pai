import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import StepOne from "../views/StepOne.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/step_one",
    name: "StepOne",
    component: StepOne,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
