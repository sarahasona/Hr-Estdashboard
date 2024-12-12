<template>
  <div class="about border border-x-gray-100 p-5">
    <div class="flex justify-between items-center">
      <h1 class="md:text-3xl sm:text-2xl text-lg lg:text-4xl font-bold">
        من نحن
      </h1>
      <AboutModal
        v-if="aboutInfo.title"
        title="تعديل البيانات"
        :info="aboutInfo"
        type="edit"
        @update-info="handleUpdateInfo"
      />
      <AboutModal
        v-else
        title="اضافه البيانات"
        :info="{}"
        type="add"
        @update-info="handleUpdateInfo"
      />
    </div>

    <div
      v-if="aboutInfo.title"
      class="mt-5 flex flex-col w-[70%] shadow-xl rounded pt-10 pb-10"
    >
      <div class="w-full h-[300px]">
        <img
          :src="aboutInfo.image"
          alt="about-us-image"
          class="rounded-md h-[100%]"
        />
      </div>

      <div class="ms-10 mt-5">
        <h2 class="text-xl font-bold">{{ aboutInfo.title }}</h2>
        <p class="text-gray-500">{{ aboutInfo.description }}</p>
      </div>
    </div>
    <div
      v-else
      class="flex justify-center items-center min-h-[400px] font-bold text-[22px]"
    >
      <p>يرجي ادخال البيانات</p>
    </div>
  </div>
</template>

<style></style>
<script setup>
import AboutModal from "../components/AboutModal.vue";
import { ref } from "vue";
const aboutInfo = ref({
  title: "",
  description: "",
  image: "",
});
const handleUpdateInfo = (newInfo) => {
  aboutInfo.value = newInfo;
};
</script>
