<template>
  <div class="flex otp" dir="ltr">
    <v-otp-input
      ref="otpInput"
      input-classes="w-[40px] h-[40px] font-[20px] rounded"
      :conditionalClass="['one', 'two', 'three', 'four']"
      separator="-"
      inputType="letter-numeric"
      :num-inputs="4"
      v-model:value="bindValue"
      :should-auto-focus="true"
      :should-focus-order="true"
      @on-change="handleOnChange"
      @on-complete="handleOnComplete"
      :placeholder="['*', '*', '*', '*']"
    />
  </div>
  <button @click="clearInput()">ازاله</button>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import VOtpInput from "vue3-otp-input";
const emit = defineEmits();
const otpInput = ref(null);
const bindModal = ref("");

const handleOnComplete = (value) => {
  emit("otpComplete", value);
};
const clearInput = () => {
  otpInput.value?.clearInput();
};
</script>

<style scoped>
.otp .otp-input.is-complete {
  background-color: #e4e4e4;
}
.otp .otp-input::-webkit-inner-spin-button,
.otp .otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.otp input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
</style>
