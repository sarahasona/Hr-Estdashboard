import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token"));
  const BASE_URL = "https://dashboard-omega-three-28.vercel.app/user/";
  const userLogin = async (userName, password) => {
    try {
      const response = await axios.post(`${BASE_URL}signIn/`, {
        userName,
        password,
      });
      if (response.status === 200) {
        token.value = response.data.token;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("sessionId", response.data.sessionId);
        return true;
      } else {
        toast.error("Invalid credentials!");
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  const resetPassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(
        `${BASE_URL}resetPassword/`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            token: `dashApp ${token.value}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("تم تغيير الباسوورد بنجاح");
        return true;
      } else {
        return false;
      }
    } catch (err) {
      toast.error("حدث خطأ في تغيير الباسوورد");
      return false;
    }
  };
  const forgetPassword = async (email, otp, newPassword) => {
    try {
      const response = await axios.post(`${BASE_URL}forgetPassword/`, {
        email,
        otp,
        newPassword,
      });
      if (response.status === 200) {
        toast.success("تم تعديل الباسوورد بنجاح");
        return true;
      } else {
        toast.error("فشل في تعديل الباسوورد!");
        return false;
      }
    } catch (err) {
      toast.error("فشل في تعديل الباسوورد!");
      return false;
    }
  };
  const sendOtpPassword = async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}otpPassword/`, {
        email,
      });
      if (response.status === 200) {
        toast.success("OTP sent successfully!");
        return true;
      }
    } catch (err) {
      toast.error("Failed to send OTP!");
      return false;
    }
  };
  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post(`${BASE_URL}verifyOtp/`, {
        email,
        otp,
      });
      if (response.status == 200) {
        toast.success("OTP verified successfully!");
        return true;
      } else {
        toast.error("Failed to verify OTP!");
        return false;
      }
    } catch (err) {
      toast.error("Failed to verify OTP!");
      return false;
    }
  };
  const userLogOut = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      try {
        const response = await axios.delete(`${BASE_URL}logout/`, {
          sessionId: sessionId,
        });
        if (response.status == 200) {
          localStorage.removeItem("token");
          localStorage.removeItem("sessionId");
          user.value = null;
          token.value = null;
        }
      } catch (err) {
        toast.error("Failed to log out!");
      }
    }
  };

  return {
    user,
    userLogin,
    token,
    userLogOut,
    resetPassword,
    forgetPassword,
    sendOtpPassword,
    verifyOtp,
  };
});
