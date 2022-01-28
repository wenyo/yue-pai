import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import StepOne from "../views/StepOne.vue";
import StepTwo from "../views/StepTwo.vue";
import StepThree from "../views/StepThree.vue";
import PrintContest from "../views/PrintContest.vue";

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
  {
    path: "/step_two",
    name: "StepTwo",
    component: StepTwo,
  },
  {
    path: "/step_three",
    name: "StepThree",
    component: StepThree,
  },
  {
    path: "/print_contest",
    name: "PrintContest",
    component: PrintContest,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
