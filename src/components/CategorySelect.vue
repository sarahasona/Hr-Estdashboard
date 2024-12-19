<template>
  <div v-if="!isLoading">
    <div class="relative">
      <div
        class="border border-gray-200 shadow p-2 cursor-pointer flex items-center"
      >
        <p
          class="w-[95%] text-start flex justify-between items-center"
          @click="toggleDropdown"
          :readonly="type == 'edit'"
        >
          {{ selectedCategoryTitle || "Select a category" }}
        </p>
        <BiPlus
          v-if="type != 'edit'"
          class="text-green-500 cursor-pointer rounded-full shadow-lg"
          @click="addNewCategory"
        />
      </div>
      <div
        v-if="isDropdownOpen"
        class="absolute z-10 bg-white border border-gray-200 mt-1 w-full shadow-lg max-h-[200px] overflow-y-scroll"
      >
        <div
          v-for="category in categoryList"
          :key="category._id"
          class="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
        >
          <!--  -->
          <p @click="selectCategory(category._id)" class="w-[90%]">
            {{ category.name }}
          </p>
          <div class="flex items-center">
            <BiPencil
              @click="startEditing(category)"
              class="text-blue-500 cursor-pointer"
            />
            <DeleteModal
              :categoryId="category._id"
              title="هل انت متاكد من حذف الفئه"
              @delete="handleDeleteOffer"
              type="offerCategory"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- edit category -->
    <!-- Editable input field -->
    <div v-if="isEditingCategory" class="relative">
      <input
        v-model="editedCategoryTitle"
        class="border border-gray-200 w-full shadow p-2 outline-none mb-5"
        placeholder="Add category title"
      />
      <div
        class="flex justify-center items-center absolute left-1 gap-1 top-[50%] translate-y-[-100%]"
      >
        <BiCheck
          @click="saveCategory"
          class="text-green-500 cursor-pointer rounded-full shadow-lg"
        />
        <BiX
          @click="cancelCategoryEditing"
          class="text-red-500 cursor-pointer rounded-full shadow-lg"
        />
      </div>
      <p v-if="categoryError" class="text-red-500">{{ categoryError }}</p>
    </div>
  </div>
  <div v-else class="flex justify-center items-center min-h-[400px] border">
    <fwb-spinner size="10" color="blue" />
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, provide, computed } from "vue";
import { FwbSpinner } from "flowbite-vue";

import {
  BiPencil,
  BiX,
  BiCheck,
  BiPlus,
  BiChevronDown,
} from "vue-icons-plus/bi";
import DeleteModal from "./DeleteModal.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
const emit = defineEmits();
const { categoryList, selected, currentCategory, name, type } = defineProps([
  "categoryList",
  "selected",
  "currentCategory",
  "name",
  "type",
]);
const isLoading = ref(false);
const selectedCategory = ref(selected || (categoryList?.[0]?._id ?? null));
if (name == "offer") {
  selectedCategory.value = currentCategory;
}
emit("update", selectedCategory.value);
// Reactive title based on selectedCategory
const selectedCategoryTitle = computed(() => {
  const category = categoryList?.find(
    (cat) => cat._id === selectedCategory.value
  );
  return category?.name || "Select a category";
});

// Example watcher (optional)
watch(selectedCategory, (newValue) => {
  if (name == "offer") {
    emit("updateOfferList", newValue);
  }
});

// select edit
const isDropdownOpen = ref(false);
const editedCategoryTitle = ref("");
const isEditingCategory = ref(false);

// Toggle dropdown visibility
const toggleDropdown = () => {
  if (type != "edit") {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

// Select a category
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  emit("update", selectedCategory.value);
  const selectedCategoryObj = categoryList.find(
    (cat) => cat._id === categoryId
  );
  selectedCategoryTitle.value = selectedCategoryObj.name;
  isDropdownOpen.value = false;
};

// Start editing a category
const startEditing = (category) => {
  categoryError.value = "";
  edit.value = true;
  editedCategoryTitle.value = category.name;
  selectCategory(category._id);
  selectedCategory.value = category._id; // This will automatically update the title
  isEditingCategory.value = true;
};
const categoryError = ref("");
// Save edited category
const saveCategory = async () => {
  categoryError.value = "";
  try {
    if (editedCategoryTitle.value) {
      if (edit.value == true) {
        editCategory();
      } else {
        addCategory();
      }
    } else {
      categoryError.value = "لا يمكن أن يكون العنوان فارغ��ا";
      toast.warning("يجب ادخال اسم الفئه");
    }
  } catch (error) {
    categoryError.value = "حدث خطأ يرجي اعاده المحاوله";
  }
};
const addCategory = async () => {
  isLoading.value = true;
  const response = await axios.post(
    `https://dashboard-omega-three-28.vercel.app/Category`,
    { name: editedCategoryTitle.value }
  );
  if (response.status === 200) {
    const newCategory = {
      _id: response.data.data,
      name: editedCategoryTitle.value,
    };
    categoryList.push(newCategory);
    isEditingCategory.value = false;
    edit.value = false;
    selectedCategoryTitle.value = editedCategoryTitle.value;
    categoryError.value = "";
    isLoading.value = false;
  } else {
    categoryError.value = "حدث خطأ يرجي اعاده المحاوله";
    isLoading.value = false;
  }
};
const editCategory = async () => {
  isLoading.value = true;
  categoryError.value = "";
  const response = await axios.patch(
    `https://dashboard-omega-three-28.vercel.app/Category/${selectedCategory.value}`,
    { name: editedCategoryTitle.value }
  );
  if (response.status == 200) {
    categoryError.value = "";
    const categoryIndex = categoryList.findIndex(
      (cat) => cat._id === selectedCategory.value
    );
    selectedCategoryTitle.value = editedCategoryTitle.value;
    if (categoryIndex !== -1) {
      categoryList[categoryIndex].name = editedCategoryTitle.value;
      isEditingCategory.value = false;
    }
    isLoading.value = false;
  } else {
    categoryError.value = "حدث خطأ يرجي اعاده المحاوله";
    isLoading.value = false;
  }
};
const cancelCategoryEditing = () => {
  isEditingCategory.value = false;
  edit.value = false;
  categoryError.value = "";
};
const resetFields = () => {
  categoryError.value = "";
  selectedCategory.value = categoryList[0]?._id || null;
  emit("update", selectedCategory.value);
  const selectedCategoryObj = categoryList.find(
    (cat) => cat._id === selectedCategory.value
  );
  selectedCategoryTitle.value = selectedCategoryObj?.name || "Add New Category";
  isDropdownOpen.value = false;
};
const resetSelectCategory = async (catId) => {
  try {
    await deletCategory(catId);
    resetFields();
  } catch (error) {}
};
const deletCategory = async (catId) => {
  try {
    const response = await axios.delete(
      `https://dashboard-omega-three-28.vercel.app/Category/${catId}`
    );
    if (response.status === 200) {
      toast.success("تم حذف الفئه بنجاح");
      const index = categoryList.findIndex((ele) => ele._id === catId);
      if (index > -1) {
        categoryList.splice(index, 1);
      }
    }
  } catch (error) {
    toast.error("حدث خطأ يرجي اعاده المحاوله");
    return;
  }
};
const edit = ref(false);
const addNewCategory = () => {
  categoryError.value = "";
  editedCategoryTitle.value = "";
  edit.value = false;
  isEditingCategory.value = true;
  isDropdownOpen.value = false;
};
provide("removeCategory", resetSelectCategory);
</script>

<style lang="scss" scoped></style>
