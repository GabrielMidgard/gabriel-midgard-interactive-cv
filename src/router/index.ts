import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "experience",
      component: () => import("@/views/ExperienceView.vue"),
    },
    {
      path: "/test/modals",
      name: "modal-lab",
      component: () => import("@/views/ModalLabView.vue"),
    },
    {
      path: "/test/damage",
      name: "damage-lab",
      component: () => import("@/views/DamageLabView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});
