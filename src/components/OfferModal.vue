<template>
  <div id="app">
    <transition name="fade">
      <div v-if="showModal" class="fixed z-50 inset-0 overflow-y-auto">
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div class="fixed inset-0 transition-opacity">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
          ></span
          >&#8203;
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3
                class="text-lg leading-6 font-medium text-gray-900 text-justify mb-10"
                id="modal-headline"
              >
                {{ title }}
              </h3>
              <div class="mt-3 sm:mt-0 sm:ml-4">
                <div class="mt-2 w-full">
                  <div>
                    <div>
                      <!-- <fwb-select
                        v-model="selected"
                        :options="categoryList"
                        label="اختار الفئه"
                      /> -->
                      <select
                        v-model="selectedCategory"
                        class="w-full mb-5 outline-none border border-gray-100 shadow"
                      >
                        <option
                          v-for="category in categoryList"
                          :key="category.id"
                          :value="category.id"
                        >
                          {{ category.title }}
                          <DeleteModal
                            :categoryId="category.id"
                            title="هل انت متاكد من حذف العرض"
                            @delete="handleDeleteOffer"
                            type="offerCategory"
                          />
                          <AddEditModal
                            title="تعديل الفئه"
                            :categoryId="category.id"
                            :categoryTitle="category.title"
                            @update="handleUpdateOfferCategory"
                          >
                           
                          </AddEditModal>

                        </option>
                      </select>
                    </div>
                    <div class="flex justify-start">
                      <input
                        type="file"
                        multiple="true"
                        v-modal="offerObj.image"
                        @change="handleImageUpload"
                      />
                    </div>
                    <div
                      class="grid grid-cols-2 gap-5"
                      v-if="previewImage.length > 0"
                    >
                      <div v-for="image in previewImage" :key="image">
                        <img
                          :src="image"
                          alt="Offer Image"
                          class="h-[200px] w-[200px] mt-4 rounded-md"
                        />
                        <button
                          type="button"
                          class="absolute top-0 right-0 mt-2 mr-2 text-sm text-gray-600 hover:text-gray-900"
                          @click="removeImage(image)"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
            >
              <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <button
                  type="button"
                  class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                  @click="addEditData"
                >
                  حفظ
                </button>
              </span>
              <span
                class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto"
              >
                <button
                  type="button"
                  class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                  @click="closeModal"
                >
                  الغاء
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <BiPencil
      v-if="type == 'edit'"
      @click="showModal = true"
      class="text-orange-400 cursor-pointer"
    />
    <button
      v-else
      @click="showModal = true"
      type="button"
      class="rounded-md bg-blue-500 hover:bg-blue-700 text-white py-2 px-4"
    >
      {{ title }}
    </button>
  </div>
</template>

<script setup>
// import AddEditModal from "./AddEditModal.vue";
import ServiceModal from "./ServiceModal.vue";
import { ref, defineEmits, inject } from "vue";
import { BiPencil, BiTrash } from "vue-icons-plus/bi";
import { FwbSelect } from "flowbite-vue";
const localDescription = ref("");
const selected = ref("");
const showModal = ref(false);
const emit = defineEmits();
const { title, offerObj, type, categoryList } = defineProps([
  "title",
  "offerObj",
  "type",
  "categoryList",
]);
const selectedCategory = ref(categoryList[0]?.id || null);

const previewImage = ref(offerObj.imageList || []);
const handleImageUpload = (e) => {
  const files = e.target.files;
  previewImage.value = [];
  for (let i = 0; i < files.length; i++) {
    const Img = files[i];
    const imageUrl = URL.createObjectURL(Img);
    previewImage.value.push(imageUrl);
  }
};
const closeModal = () => {
  showModal.value = false;
  if (type === "add") {
    resetFields();
  }
};
const resetFields = () => {
  previewImage.value = [];
};
const servicesApi = inject("servicesApi");
const addEditData = () => {
  if (!previewImage.value) {
    alert("All fields are required!");
    return;
  }
  const payload = {
    id: type === "add" ? new Date().valueOf() : offerObj.id,
    image: previewImage.value,
  };

  // emit(type === "add" ? "addNewService" : "editService", payload);
  if (type === "add") {
    emit("addNewService", payload);
    resetFields();
  } else {
    servicesApi.editService(payload);
  }
  showModal.value = false;
};
</script>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transition: ease 0.2s;
}

.fade-leave-from,
.fade-enter-to {
  opacity: 1;
  transition: ease 0.2s;
}
</style>
