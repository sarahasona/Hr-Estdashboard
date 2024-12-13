<template>
  <div>
    <!-- BiMenu Icon (Visible only on small screens) -->
    <BiMenuAltLeft
      @click="toggleSidebar"
      class="fixed top-4 left-1 z-40 text-blue-500 w-8 h-8 cursor-pointer lg:hidden"
    />

    <!-- Backdrop -->
    <div
      v-if="sideBarOpen && isMobile"
      @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed top-0 left-0 h-screen bg-gray-100 border-r z-30 transition-transform duration-300',
        sideBarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0', // Always visible on medium and larger screens
      ]"
      id="main-nav"
      :aria-hidden="!sideBarOpen"
      tabindex="0"
    >
      <!-- Sidebar Content -->
      <div
        class="w-full h-20 border-b flex px-4 items-center mb-8 text-center justify-center"
      >
        <img src="/logo.png" alt="Logo" class="md:w-[50px] w-[20px]" />
      </div>
      <div class="mb-4 px-4" dir="rtl">
        <router-link to="about">
          <div
            class="w-full gap-2 flex items-center text-blue-400 h-10 pl-4 hover:bg-gray-200 rounded-lg cursor-pointer"
            :class="route.path === '/about' ? 'bg-gray-200 font-bold' : ''"
          >
            <svg class="h-6 w-6 fill-current mr-2" viewBox="0 0 20 20">
              <path
                d="M18.121,9.88l-7.832-7.836c-0.155-0.158-0.428-0.155-0.584,0L1.842,9.913c-0.262,0.263-0.073,0.705,0.292,0.705h2.069v7.042c0,0.227,0.187,0.414,0.414,0.414h3.725c0.228,0,0.414-0.188,0.414-0.414v-3.313h2.483v3.313c0,0.227,0.187,0.414,0.413,0.414h3.726c0.229,0,0.414-0.188,0.414-0.414v-7.042h2.068h0.004C18.331,10.617,18.389,10.146,18.121,9.88 M14.963,17.245h-2.896v-3.313c0-0.229-0.186-0.415-0.414-0.415H8.342c-0.228,0-0.414,0.187-0.414,0.415v3.313H5.032v-6.628h9.931V17.245z M3.133,9.79l6.864-6.868l6.867,6.868H3.133z"
              ></path>
            </svg>
            <span class="text-gray-700">من نحن</span>
          </div>
        </router-link>
        <router-link to="offers">
          <div
            class="w-full gap-2 flex items-center text-blue-400 h-10 pl-4 hover:bg-gray-200 rounded-lg cursor-pointer"
            :class="route.path === '/offers' ? 'bg-gray-200 font-bold' : ''"
          >
            <svg
              fill="#000000"
              viewBox="0 0 24 24"
              version="1.2"
              baseProfile="tiny"
              class="h-6 w-6 fill-current mr-2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M16.5 11c1.93 0 3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5-3.5 1.57-3.5 3.5v1.5h-2v-1.5c0-1.93-1.57-3.5-3.5-3.5s-3.5 1.57-3.5 3.5 1.57 3.5 3.5 3.5h1.5v2h-1.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5v-1.5h2v1.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5h-1.5v-2h1.5zm-1.5-3.5c0-.828.673-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .826-.673 1.5-1.5 1.5h-1.5v-1.5zm-6 9c0 .826-.673 1.5-1.5 1.5s-1.5-.674-1.5-1.5c0-.828.673-1.5 1.5-1.5h1.5v1.5zm0-7.5h-1.5c-.827 0-1.5-.674-1.5-1.5 0-.828.673-1.5 1.5-1.5s1.5.672 1.5 1.5v1.5zm4 4h-2v-2h2v2zm3.5 2c.827 0 1.5.672 1.5 1.5 0 .826-.673 1.5-1.5 1.5s-1.5-.674-1.5-1.5v-1.5h1.5z"
                ></path>
              </g>
            </svg>
            <span class="text-gray-700">العروض</span>
          </div>
        </router-link>
        <router-link to="services">
          <div
            class="w-full gap-2 flex items-center text-blue-400 h-10 pl-4 hover:bg-gray-200 rounded-lg cursor-pointer"
            :class="route.path === '/services' ? 'bg-gray-200 font-bold' : ''"
          >
            <svg class="h-6 w-6 fill-current mr-2" viewBox="0 0 20 20">
              <path
                d="M17.283,5.549h-5.26V4.335c0-0.222-0.183-0.404-0.404-0.404H8.381c-0.222,0-0.404,0.182-0.404,0.404v1.214h-5.26c-0.223,0-0.405,0.182-0.405,0.405v9.71c0,0.223,0.182,0.405,0.405,0.405h14.566c0.223,0,0.404-0.183,0.404-0.405v-9.71C17.688,5.731,17.506,5.549,17.283,5.549 M8.786,4.74h2.428v0.809H8.786V4.74z M16.879,15.26H3.122v-4.046h5.665v1.201c0,0.223,0.182,0.404,0.405,0.404h1.618c0.222,0,0.405-0.182,0.405-0.404v-1.201h5.665V15.26z M9.595,9.583h0.81v2.428h-0.81V9.583zM16.879,10.405h-5.665V9.19c0-0.222-0.183-0.405-0.405-0.405H9.191c-0.223,0-0.405,0.183-0.405,0.405v1.215H3.122V6.358h13.757V10.405z"
              ></path>
            </svg>
            <span class="text-gray-700">الخدمات</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { BiMenuAltLeft } from "vue-icons-plus/bi";

const route = useRoute();

// Control sidebar visibility
const sideBarOpen = ref(false);
const closeSidebar = () => {
  sideBarOpen.value = false;
};
// Function to toggle the sidebar
const toggleSidebar = () => {
  sideBarOpen.value = !sideBarOpen.value;
};
watch(() => route.path, closeSidebar);
</script>

<style scoped>
/* Smooth sidebar transition */
.transition-transform {
  transition: transform 0.3s ease-in-out;
}

/* Optional: Adjust sidebar styles */
#main-nav {
  transition: transform 0.3s ease-in-out;
}
</style>
