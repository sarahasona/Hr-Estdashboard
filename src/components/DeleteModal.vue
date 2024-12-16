<template>
  <div>
    <button @click="showModal">
      <BiTrash class="text-red-600 cursor-pointer" />
    </button>
    <fwb-modal v-if="isShowModal" @close="closeModal">
      <template #body>
        <div class="p-4 md:p-5 text-center">
          <svg
            class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {{ title }}
          </h3>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between">
          <fwb-button
            @click="closeModal"
            color="alternative"
            :disabled="isDeleteLoading"
          >
            Cancle
          </fwb-button>
          <fwb-button
            @click="handleDelete"
            color="red"
            :disabled="isDeleteLoading"
          >
            Delete
          </fwb-button>
        </div>
      </template>
    </fwb-modal>
  </div>
</template>

<script setup>
import { ref, defineEmits, inject } from "vue";
import { BiTrash } from "vue-icons-plus/bi";
import { FwbButton, FwbModal } from "flowbite-vue";
const { serviceId, title, categoryId, type, offerId } = defineProps([
  "serviceId",
  "title",
  "categoryId",
  "type",
  "offerId",
]);
const isShowModal = ref(false);
const isDeleteLoading = ref(false);
const emit = defineEmits();
function closeModal() {
  isShowModal.value = false;
}
function showModal() {
  isShowModal.value = true;
}

const servicesApi = inject("servicesApi");
const offerApi = inject("offerApi");
const categoryApi = inject("removeCategory");
const handleDelete = async () => {
  isDeleteLoading.value = true;
  if (type === "service") {
    servicesApi.deleteService(serviceId);
  } else if (type === "offerCategory") {
    // offerApi.deleteCategory(categoryId);
    categoryApi(categoryId);
  } else if (type == "offer") {
    offerApi.deleteOffer(offerId);
  } else if (type == "serviceAll") {
    console.log('service All')
    servicesApi.deleteAllServices();
  }
  isDeleteLoading.value = false;
  closeModal();
};
</script>

<style lang="scss" scoped></style>
