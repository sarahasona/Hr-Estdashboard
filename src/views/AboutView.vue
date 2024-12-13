<template>
  <div class="about border border-x-gray-100 p-5">
    <div class="flex justify-between items-center">
      <h1 class="md:text-3xl sm:text-2xl text-lg lg:text-4xl font-bold">
        من نحن
      </h1>
      <div v-if="!isLoading">
        <AboutModal
          v-if="aboutInfo.description"
          title="تعديل البيانات"
          :info="aboutInfo"
          type="edit"
          @update-info="handleUpdateInfo"
        />
        <AboutModal
          v-else
          title="اضافه البيانات"
          :info="{
            _id: 0,
            image: { secure_url: '' },
            description: '',
          }"
          type="add"
          @update-info="handleUpdateInfo"
        />
      </div>
    </div>

    <div v-if="!isLoading">
      <div
        v-if="aboutInfo.description"
        class="mt-5 flex flex-col w-[70%] shadow-xl rounded pt-10 pb-10"
      >
        <div class="w-full h-[300px]">
          <img
            :src="aboutInfo.image.secure_url"
            alt="about-us-image"
            class="rounded-md h-[100%]"
          />
        </div>

        <div class="ms-10 mt-5">
          <p class="text-gray-500">{{ aboutInfo.description }}</p>
        </div>
      </div>
      <div
        v-else
        class="flex justify-center items-center min-h-[400px] font-bold text-[22px]"
      >
        <p>يرجي ادخال البيانات</p>
      </div>
    </div>

    <div v-else class="flex justify-center items-center min-h-[400px] border">
      <fwb-spinner size="10" color="blue" />
    </div>
  </div>
</template>

<style></style>
<script setup>
import axios from "axios";
import AboutModal from "../components/AboutModal.vue";
import { onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import { FwbSpinner } from "flowbite-vue";
// import { data } from "autoprefixer";
const isLoading = ref(false);
const aboutInfo = ref({
  description: "",
  image: { secure_url: "" },
});
const handleUpdateInfo = (newInfo) => {
  if (newInfo.type == "add") {
    addInfo(newInfo);
  } else {
    editInfo(newInfo);
  }
};
const editInfo = async (info) => {
  try {
    const formData = createFormData(info);
    if (formData) {
      const response = await axios.patch(
        `https://dashboard-omega-three-28.vercel.app/about/${info._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        const data = response.data.data;
        aboutInfo.value = {
          _id: data.id,
          description: info.description,
          image: { secure_url: info.image },
        };
        toast.success("تم التعديل بنجاح");
      } else {
        toast.error("حدث خطأ اثناء التعديل حاول مره اخري");
      }
    }
  } catch (err) {
    toast.error("حدث خطأ اثناء التعديل حاول مره اخري");
  }
};
const createFormData = (info) => {
  const formData = new FormData();
  formData.append("desc", info.description);
  if (info.ImgFile instanceof File) {
    toast.success('image is File')
    formData.append("image", info.ImgFile);
  }
  return formData;
};
const addInfo = async (info) => {
  try {
    const formData = createFormData(info);
    if (formData) {
      const response = await axios.post(
        "https://dashboard-omega-three-28.vercel.app/about",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const savedData = await response.data.data;
        aboutInfo.value = {
          _id: savedData.id,
          image: { secure_url: info.image },
          description: info.description,
        };
        toast.success("تمت الاضافه بنجاح");
      } else {
        toast.error("حدث خطأ اثناء الاضافه");
      }
    }
  } catch (err) {
    toast.error("حدث خطأ اثناء الاضافه");
  }
};

const getAboutData = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(
      `https://dashboard-omega-three-28.vercel.app/about`
    );
    if (response.status === 200) {
      const data = response.data.data[0];
      aboutInfo.value = {
        _id: data._id,
        description: data.desc,
        image: { secure_url: data.image.secure_url },
      };
    } else {
      toast.error("لاتوجد بيانات قم باضافه بيانات ");
    }
    isLoading.value = false;
  } catch (err) {
    isLoading.value = false;
    toast.warning("لا توجد بيانات");
  }
};
onMounted(() => {
  getAboutData();
});
</script>
