<template>
  <div class="max-w-md mx-auto p-8 bg-white shadow-md rounded-lg mt-[50px]">
    <h2 class="text-2xl font-bold mb-6 text-center">تسجيل دخول</h2>
    <form>
      <div class="mb-4" v-if="login">
        <label for="userName" class="block text-sm font-medium mb-2"
          >اسم المستخدم</label
        >
        <input
          v-model="userName"
          type="text"
          id="userName"
          placeholder="Enter your userName"
          class="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-100"
          required
        />
      </div>
      <div class="mb-4" v-if="!login">
        <label for="email" class="block text-sm font-medium mb-2">
          الايميل</label
        >
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="Enter your Email"
          class="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-100"
          required
        />
      </div>
      <div
        class="mb-4 flex gap-2 items-center justify-between"
        v-if="fillOtp && !correctOtp && !otpLoading"
      >
        <OtpComp @otpComplete="handleOtpComplete"></OtpComp>
      </div>
      <div v-if="otpLoading" class="flex justify-center mt-5">
        <FwbSpinner size="10" color="blue" />
      </div>

      <div class="mb-4" v-if="login || (forgetPass && correctOtp)">
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
      <div class="mb-4 flex gap-5 items-center justify-center" v-if="login">
        <button
          type="button"
          @click="ForgotPassword"
          class="text-sm text-blue-500 hover:underline"
        >
          نسيان الباسوورد
        </button>
      </div>
      <div class="flex gap-2 items-center justify-between">
        <ButtonComp title="Login" @submit="handleLogin" v-if="login" />
        <ButtonComp
          title="تغيير الباسوورد"
          @submit="handleResetPassword"
          v-if="resetPass"
          :isLoading="isLoading"
        />
        <ButtonComp
          title="ارسال otp"
          @submit="getOtp"
          v-if="forgetPass && !fillOtp"
          :isLoading="isLoading"
        />
        <ButtonComp
          title="حفظ"
          @submit="handleForgetPassword"
          v-if="forgetPass && correctOtp"
          :isLoading="isLoading"
        />
        <button
          v-if="!login"
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
import OtpComp from "../components/login/OtpComp.vue";
import { ref } from "vue";
import ButtonComp from "../components/login/ButtonComp.vue";
import { toast } from "vue3-toastify";
import { FwbSpinner } from "flowbite-vue";
const authStore = useAuthStore();
const router = useRouter();
const login = ref(true);
const forgetPass = ref(false);
const resetPass = ref(false);
const userName = ref("");
const password = ref("");
const errorMessage = ref("");
const NewPassword = ref("");
const isLoading = ref(false);
const email = ref("");
const handleLogin = async () => {
  try {
    isLoading.value = true;
    const response = await authStore.userLogin(userName.value, password.value);
    if (response) {
      router.push("/dashboard");
    } else {
      errorMessage.value = "برجاء ادخال اسم مستخدم صحيح وكلمه المرور";
      return;
    }
  } catch (error) {
    isLoading.value = false;
    errorMessage.value = "برجاء ادخال اسم مستخدم صحيح وكلمه المرور";
  }
};
const ForgotPassword = () => {
  resetFields();
  login.value = false;
  forgetPass.value = true;
  resetPass.value = false;
};
const ResetPassword = () => {
  resetFields();
  login.value = false;
  forgetPass.value = false;
  resetPass.value = true;
};
const fillOtp = ref(false);
const getOtp = async () => {
  if (!email.value) {
    errorMessage.value = "يجب ادخال الايميل";
    return false;
  }
  errorMessage.value = "";
  isLoading.value = true;
  const response = await authStore.sendOtpPassword(email.value);
  isLoading.value = false;
  if (response) {
    fillOtp.value = true;
  } else {
    errorMessage.value = "برجاء ادخال ايميل صحيح";
  }
};
const resetPage = () => {
  login.value = true;
  forgetPass.value = false;
  resetPass.value = false;
};
const handleResetPassword = async () => {
  try {
    if (!NewPassword.value || !password.value || !email.value) {
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
      email.value,
      password.value,
      NewPassword.value
    );
    if (!response) {
      errorMessage.value = "برجاء ادخال كلمه المرور صحيحه";
      return;
    }
    resetFields();
    resetPage();
  } catch (error) {
    isLoading.value = false;
    errorMessage.value = "برجاء ادخال كلمه المرور صحيحه";
  }
};
const resetFields = () => {
  userName.value = "";
  password.value = "";
  errorMessage.value = "";
  NewPassword.value = "";
  email.value = "";
  isLoading.value = false;
  fillOtp.value = false;
  correctOtp.value = false;
  otpLoading.value = false;
};
const reset = () => {
  resetFields();
  resetPage();
};
function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  return passwordRegex.test(password);
}
const otp = ref("");
const otpLoading = ref(false);
const correctOtp = ref(false);
const handleOtpComplete = async (value) => {
  otp.value = value;
  otpLoading.value = true;
  const response = await authStore.verifyOtp(email.value, otp.value);
  otpLoading.value = false;
  if (response) {
    correctOtp.value = true;
    return;
  } else {
    correctOtp.value = false;
    return;
  }
};
const handleForgetPassword = async () => {
  try {
    if (!email.value) {
      errorMessage.value = "يجب ادخال الايميل";
      return false;
    }
    if (!otp.value) {
      errorMessage.value = "يجب ادخال otp";
      return false;
    }
    if (!password.value) {
      errorMessage.value = "يجب ادخال كلمه المرور";
      return false;
    }
    errorMessage.value = "";
    isLoading.value = true;
    const response = await authStore.forgetPassword(
      email.value,
      otp.value,
      password.value
    );
    isLoading.value = false;
    if (response) {
      toast.success("تم تغير الباسورد بنجاح");
      resetPage();
      resetFields();
    } else {
      errorMessage.value = "حدث خطأ ما برجاء المحاوله مره اخري";
    }
  } catch (error) {
    isLoading.value = false;
    errorMessage.value = "حدث خطأ ما برجاء المحاوله مره اخري";
  }
};
</script>

<style scoped></style>
