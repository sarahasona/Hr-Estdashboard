<template>
  <div class="max-w-md mx-auto p-8 bg-white shadow-md rounded-lg mt-[50px]">
    <h2 class="text-2xl font-bold mb-6 text-center">تغيير الباسوورد</h2>
    <form>
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium mb-2">
          كلمه المرور
        </label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="Enter your password"
          class="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-100"
          required
        />
      </div>
      <div class="mb-4">
        <label for="password2" class="block text-sm font-medium mb-2">
          كلمه المرور الجديده</label
        >
        <input
          v-model="NewPassword"
          type="password"
          id="password2"
          placeholder="Enter your password"
          class="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-100"
          required
        />
      </div>
      <div class="flex gap-2 items-center justify-between">
        <ButtonComp
          title="حفظ "
          @submit="handleResetPassword"
          :isLoading="isLoading"
        />

        <button
          @click="reset"
          class="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          :class="isLoading ? 'cursor-not-allowed disabled' : ''"
        >
          الغاء
        </button>
      </div>
    </form>

    <div v-if="errorMessage" class="mt-4 text-red-500 text-sm">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import ButtonComp from "./ButtonComp.vue";
import { toast } from "vue3-toastify";
const authStore = useAuthStore();
const router = useRouter();

const resetPass = ref(false);
const password = ref("");
const errorMessage = ref("");
const NewPassword = ref("");
const isLoading = ref(false);

const handleResetPassword = async () => {
  try {
    if (!NewPassword.value || !password.value) {
      errorMessage.value = "يجب ادخال جميع الحقول";
      return false;
    }
    if (!validatePassword(NewPassword.value)) {
      errorMessage.value =
        "الباسوورد يجب ان لايقل عن 8 حروف （a-z）（A-Z）（0-9）（@#$&*)";
      return false;
    }
    errorMessage.value = "";
    isLoading.value = true;
    const response = await authStore.resetPassword(
      password.value,
      NewPassword.value
    );
    if (!response) {
      errorMessage.value = "برجاء ادخال كلمه المرور صحيحه";
      return;
    }
    resetFields();
    setTimeout(() => authStore.userLogOut(), 1000);
  } catch (error) {
    isLoading.value = false;
    errorMessage.value = "برجاء ادخال كلمه المرور صحيحه";
  }
};
const resetFields = () => {
  password.value = "";
  errorMessage.value = "";
  NewPassword.value = "";
  isLoading.value = false;
};

function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  return passwordRegex.test(password);
}
</script>

<style scoped></style>
