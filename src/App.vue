<script setup>
import { watch } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import SideBar from "./components/SideBar.vue";
import { useAuthStore } from "./stores/auth";
const authStore = useAuthStore();
const router = useRouter();
// Watch token changes
watch(
  () => authStore.token,
  (newToken) => {
    if (!newToken) {
      // Redirect to login if the token is removed
      router.push("/login");
    }
  }
);
</script>

<template>
  <div class="container mx-auto mt-10 flex">
    <RouterView dir="rtl" class="md:w-[90%] w-full md:me-auto" />
  </div>
</template>

<style scoped></style>
