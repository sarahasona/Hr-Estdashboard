import { createRouter, createWebHistory } from "vue-router";
import DashBoard from "@/views/DashBoard.vue";
import { useAuthStore } from "@/stores/auth";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.token) {
          next("/dashboard");
        } else {
          next("/login");
        }
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/dashboard",
      component: DashBoard,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          redirect: "/dashboard/about",
        },
        {
          path: "about",
          name: "about",
          component: ()=>import("@/views/AboutView.vue"),
        },
        {
          path: "offers",
          name: "offers",
          component: ()=>import("@/views/OffersView.vue"),
        },
        {
          path: "services",
          name: "services",
          component: () => import("@/views/ServicesView.vue"),
        },
        {
          path: "resetPassword",
          name: "resetPassword",
          component: () => import("@/components/login/ResetPassword.vue"),
        },
      ],
    },
  ],
});
// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // Redirect to login if route requires auth and no token
  if (to.meta.requiresAuth && !authStore.token) {
    next("/login");
  } else {
    next();
  }
});
export default router;
