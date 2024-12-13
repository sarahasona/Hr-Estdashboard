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
                    <textarea
                      placeholder="يرجي ادخال الوصف"
                      class="border border-gray-200 w-full shadow p-2 outline-none mb-2"
                      v-model="localDescription"
                      cols="10"
                      rows="4"
                      minlength="10"
                      maxlength="600"
                      required
                    />
                    <div
                      class="text-red-500 text-xs sm:text-sm text-start mb-2"
                      v-if="descriptionError"
                    >
                      {{ descriptionError }}
                    </div>
                    <div class="flex justify-start">
                      <input
                        type="file"
                        v-modal="info.image"
                        @change="handleImageUpload"
                      />
                    </div>
                    <div>
                      <img
                        v-if="previewImage"
                        :src="previewImage"
                        alt="Selected Image Preview"
                        class="mt-4 rounded-md h-[200px] w-[200px]"
                      />
                      <img
                        :src="info.image"
                        ref="fileInput"
                        v-if="!previewImage"
                        class="h-[200px] w-[200px]"
                      />
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
    <button
      @click="showModal = true"
      type="button"
      class="rounded-md bg-blue-500 hover:bg-blue-700 text-white py-2 px-4"
    >
      {{ title }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const { title, info, type } = defineProps(["title", "info", "type"]);
const showModal = ref(false);
const previewImage = ref(info.image.secure_url || "");
const localDescription = ref(info.description || "");
const emit = defineEmits();
const file = ref(null);
const fileInput = ref(null);
const ImgAsFile = ref(null);
const handleImageUpload = (e) => {
  const Img = e.target.files[0];
  if (Img) {
    file.value = Img;
  }
  previewImage.value = URL.createObjectURL(file.value);
  ImgAsFile.value = Img;
};
const closeModal = () => {
  showModal.value = false;
  if (type == "add") {
    resetFields();
  }
};
const resetFields = () => {
  previewImage.value = null;
  localDescription.value = "";
  file.value = null;
  descriptionError.value = "";
};
const descriptionError = ref("");
const addEditData = () => {
  if (
    localDescription.value.length < 10 ||
    localDescription.value.length > 600
  ) {
    descriptionError.value =
      "يجب أن تكون الوصف مكون من 10 حروف على الأقل و 600 حروف على الأكثر";
    return;
  }
  if (previewImage.value) {
    descriptionError.value = "";
    const aboutData = {
      _id: info._id,
      description: localDescription.value,
      image: previewImage.value,
      type: type === "add" ? "add" : "edit",
      ImgFile: ImgAsFile.value,
    };
    emit("update-info", aboutData);
    type == "add" ? resetFields() : "";
    showModal.value = false;
  }
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
