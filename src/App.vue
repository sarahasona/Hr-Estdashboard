<script setup>
import { RouterLink, RouterView } from "vue-router";
import SideBar from "./components/SideBar.vue";
</script>

<template>
  <div class="container mx-auto mt-10 flex">
    <SideBar />

    <keep-alive>
      <RouterView dir="rtl" class="md:w-[90%] w-full md:me-auto" />
    </keep-alive>
  </div>
</template>

<style scoped></style>
