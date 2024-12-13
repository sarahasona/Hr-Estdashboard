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
                  <!-- Service Content Body -->
                  <div v-if="name === 'service' || name == 'serviceAll'">
                    <input
                      placeholder="يرجي ادخال عنوان الخدمه"
                      type="text"
                      class="border border-gray-200 w-full shadow p-2 outline-none mb-5"
                      v-model="localTitle"
                      required
                    />
                    <div
                      class="text-red-500 text-xs sm:text-sm text-start mb-2"
                      v-if="titleError"
                    >
                      {{ titleError }}
                    </div>
                    <textarea
                      type="text"
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
                  </div>
                  <!-- Offer Content Body -->
                  <div v-if="name === 'offer'">
                    <categorySelect
                      :categoryList="categoryList"
                      @update="handleCategoryChange"
                      :selected="selectedCat"
                    />
                  </div>
                  <div class="flex justify-start mt-5">
                    <input type="file" @change="handleImageUpload" />
                  </div>
                  <div class="flex justify-center">
                    <img
                      v-if="
                        previewImage != '' ||
                        previewImage != null ||
                        previewImage != undefined
                      "
                      :src="previewImage"
                      alt="Selected Image Preview"
                      class="h-[200px] mt-4 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-5"
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
import { ref, defineEmits, inject, watch, provide } from "vue";
import {
  BiPencil,
  BiX,
  BiCheck,
  BiPlus,
  BiChevronDown,
} from "vue-icons-plus/bi";
import DeleteModal from "./DeleteModal.vue";
import CategorySelect from "./CategorySelect.vue";
import { toast } from "vue3-toastify";
const showModal = ref(false);
const emit = defineEmits();
const { title, serviceObj, type, name, offerObj, categoryList } = defineProps([
  "title",
  "serviceObj",
  "type",
  "name",
  "offerObj",
  "categoryList",
]);
const descriptionError = ref("");
const titleError = ref("");
const localTitle = ref("");
const localDescription = ref("");
const previewImage = ref("");
const selectedCat = ref("");

if (name === "service") {
  console.log('helllo')
  console.log(serviceObj)
  localTitle.value = serviceObj.title || "";
  localDescription.value = serviceObj.description || "";
  console.log(localDescription.value)
  previewImage.value = serviceObj.image.secure_url || "";
}
console.log("name", name);
// if (name == "offer") {
//   console.log('offer')
//   previewImage.value = offerObj.image.secure_url || "";
//   selectedCat.value = offerObj.categoryId
//   console.log(offerObj.categoryId)
// }
// Watch modal open state
watch(showModal, (newVal) => {
  if (newVal) {
    // Executes when modal opens
    if (name === "offer") {
      console.log("offer");
      previewImage.value = offerObj.image.secure_url || "";
      selectedCat.value = offerObj.categoryId;
      console.log(offerObj.categoryId);
    }
    if (name === "service") {
      previewImage.value = serviceObj.image.secure_url || "";
      localDescription.value = serviceObj.description;
      console.log(localDescription.value)
      localTitle.value = serviceObj.title;
    }
  }
});

const imageAsFile = ref(null);
const handleImageUpload = (e) => {
  const Img = e.target.files[0];
  if (Img) {
    previewImage.value = URL.createObjectURL(Img);
    imageAsFile.value = Img; //save image as file
  }
};
const handleCategoryChange = (category) => {
  selectedCat.value = category;
};
const closeModal = () => {
  showModal.value = false;
  if (type === "add") {
    resetFields();
  }
};
const resetFields = () => {
  previewImage.value = null;
  localTitle.value = "";
  localDescription.value = "";
  descriptionError.value = "";
  titleError.value = "";
};
const servicesApi = inject("servicesApi");
const offerApi = inject("offerApi");

const addEditData = () => {
  if (name == "service") {
    if (!localTitle.value || !localDescription.value || !previewImage.value) {
      if (localTitle.value.length < 2 || localTitle.value.length > 15) {
        titleError.value = "العنوان يجب أن يكون بين 2 و 15 حروف";
        return;
      }
      if (
        localDescription.value.length < 10 ||
        localDescription.value.length > 600
      ) {
        descriptionError.value = "الوصف يجب أن يكون بين 10 و 600 حروف";
        return;
      }
    }
    titleError.value = "";
    descriptionError.value = "";
    addService();
  } else if (name == "offer") {
    if (!previewImage.value || !selectedCat.value) {
      toast.warning("يجب ادخال البيانات");
      return;
    }
    addOffer();
  }

  showModal.value = false;
};
const addService = () => {
  const payload = {
    _id: type === "add" ? new Date().valueOf() : serviceObj._id,
    title: localTitle.value,
    description: localDescription.value,
    image: previewImage.value,
    ImgFile: imageAsFile.value,
  };

  // emit(type === "add" ? "addNewService" : "editService", payload);
  if (type === "add") {
    emit("addNewService", payload);
    resetFields();
  } else {
    servicesApi.editService(payload);
  }
};
const addOffer = () => {
  if (type == "add") {
    offerApi.addOffer({
      image: previewImage.value,
      categoryId: selectedCat.value,
      ImgFile: imageAsFile.value,
    });
  } else {
    offerApi.editOffer({
      _id: offerObj._id,
      image: previewImage.value,
      categoryId: selectedCat.value,
      ImgFile: imageAsFile.value,
    });
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
