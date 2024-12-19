<template>
  <button
    type="button"
    class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
    @click="handleSubmit"
    :class="isLoading ? 'disabled cursor-not-allowed':''"
  >
    {{ title }}
  </button>
</template>

<script setup>
import { defineEmits } from "vue";
const emit = defineEmits();
const { title, isLoading } = defineProps(["title", "isLoading"]);
const handleSubmit = () => {
  emit("submit");
};
</script>

<style lang="scss" scoped></style>
