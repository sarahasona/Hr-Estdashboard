<template>
  <div class="h-[200px] w-[200px] rounded shadow-md group relative">
    <img :src="image" alt="image" class="w-[100%] h-[100%] rounded" />
    <div
      class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"
    >
      <ServiceModal
        title="تعديل العرض"
        :offerObj="{
          _id: offerId,
          image: { secure_url: image },
          categoryId: categoryId,
        }"
        type="edit"
        name="offer"
        :categoryList="categoryList"
      />

      <DeleteModal
        :offerId="offerId"
        title="هل انت متاكد من حذف العرض"
        type="offer"
      />
    </div>
  </div>
</template>

<script setup>
import { FwbCard } from "flowbite-vue";
import DeleteModal from "./DeleteModal.vue";
import ServiceModal from "./ServiceModal.vue";
const { image, categoryId, offerId, categoryList } = defineProps([
  "image",
  "categoryId",
  "offerId",
  "categoryList",
]);
</script>
