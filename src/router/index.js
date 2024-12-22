import { createRouter, createWebHistory } from "vue-router";
import DashBoard from "@/views/DashBoard.vue";
import { useAuthStore } from "@/stores/auth";
import LoginView from "@/views/LoginView.vue";
import { ref, watch } from "vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: (to) => {
        const authStore = useAuthStore();
        return authStore.token ? "/dashboard" : "/login";
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
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
          component: () => import("@/views/AboutView.vue"),
        },
        {
          path: "offers",
          name: "offers",
          component: () => import("@/views/OffersView.vue"),
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
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  // Redirect to login if route requires auth and no token
  if (to.meta.requiresAuth && !authStore.token) {
    return next("/login");
  }
  const isValidToken = await authStore.valideToken();
  if (to.meta.requiresAuth && !isValidToken) {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
    authStore.token = null;
    return next("/login");
  }

  if ((to.path === "/" || to.path === "/login") && authStore.token) {
    return next("/dashboard");
  }
  return next();
});
export default router;
