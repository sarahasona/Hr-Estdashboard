<template>
  <div class="services border border-x-gray-100 p-5">
    <div class="flex justify-between items-center">
      <h1 class="md:text-3xl sm:text-2xl text-lg lg:text-4xl font-bold mb-5">
        اداره الخدمات
      </h1>
      <ServiceModal
        title="اضافه خدمه جديده"
        :serviceObj="editServiceObj"
        @addNewService="handleAddService"
        type="add"
        name="service"
      />
    </div>
    <div class="" v-if="!isLoading">
      <!-- Service table -->
      <ServiceTable
        v-if="serviceList.length > 0"
        :services="serviceList"
        :headers="headers"
        @deleteAll="handleDeleteAll"
        @editService="handleEditService"
      />
      <div
        v-else
        class="flex justify-center items-center min-h-[400px] font-bold text-[22px]"
      >
        <p>قم باضافه خدمات</p>
      </div>
    </div>
    <div v-else class="flex justify-center items-center min-h-[400px] border">
      <fwb-spinner size="10" color="blue" />
    </div>
  </div>
</template>

<style></style>
<script setup>
import { ref, provide, onMounted } from "vue";
import { FwbSpinner } from "flowbite-vue";
import ServiceTable from "@/components/ServiceTable.vue";
import ServiceModal from "@/components/ServiceModal.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
const serviceList = ref([]);
const isLoading = ref(false);
const editServiceObj = ref({
  title: "",
  description: "",
  image: { secure_url: "" },
});
const headers = ["الخدمه", "Remove", "تعديل"];
const createFormData = (service) => {
  const formData = new FormData();
  formData.append("name", service.title);
  formData.append("desc", service.description);
  if (service.ImgFile && service.ImgFile instanceof File) {
    formData.append("image", service.ImgFile);
  }
  return formData;
};
const handleAddService = async (service) => {
  try {
    isLoading.value = true;
    const formData = createFormData(service);
    if (formData) {
      const response = await axios.post(
        `https://dashboard-omega-three-28.vercel.app/Service`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const data = response.data.data;
        toast.success("تمت الاضافة بنجاح");
        const newService = {
          _id: data.id,
          image: { secure_url: service.image },
          description: service.description,
          title: service.title,
        };
        serviceList.value.push(newService);
      } else {
        toast.warning("يرجي المحاوله مره اخري");
      }
    }
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    toast.error("حدث خطأ ما, حاول مرة أخرى");
  }
};
const handleDeleteAll = async () => {
  try {
    isLoading.value = true;
    const response = await axios.delete(
      `https://dashboard-omega-three-28.vercel.app/Service/all`
    );
    if (response.status === 200) {
      toast.success("تم حذف الكل بنجاح");
      serviceList.value = [];
    } else {
      toast.warning("يرجي المحاوله مره اخري");
    }
    isLoading.value = false;
  } catch (err) {
    toast.error("حدث خطأ ما, حاول مرة أخرى");
    isLoading.value = false;
  }
};
const handleEditService = async (service) => {
  try {
    isLoading.value = true;
    const formData = createFormData(service);
    if (formData) {
      const response = await axios.patch(
        `https://dashboard-omega-three-28.vercel.app/Service/${service._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const data = response.data.data;

        toast.success("تم التعديل بنجاح");
        const target = serviceList.value.find((ele) => ele._id === service._id);
        if (target) {
          Object.assign(target, {
            _id: service._id,
            title: service.title,
            description: service.description,
            image: { secure_url: data.secure_url },
          });
        }
      } else {
        toast.warning("يرجي المحاوله مره اخري");
      }
      isLoading.value = false;
    }
  } catch (error) {
    isLoading.value = false;
  }
};
const handleDeleteService = async (serviceId) => {
  try {
    const response = await axios.delete(
      `https://dashboard-omega-three-28.vercel.app/Service/${serviceId}`
    );
    if (response.status == 200) {
      toast.warning("تم حذف الخدمه بنجاح");
      const index = serviceList.value.findIndex((ele) => ele._id === serviceId);
      if (index > -1) {
        serviceList.value.splice(index, 1);
      }
    }
  } catch (error) {
    toast.error("حدث خطأ ما, حاول مرة أخرى");
    isLoading.value = false;
  }
};
provide("servicesApi", {
  editService: handleEditService,
  deleteService: handleDeleteService,
  deleteAllServices: handleDeleteAll,
});
const getAllServices = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(
      "https://dashboard-omega-three-28.vercel.app/Service/all"
    );
    if (response.status === 200) {
      const data = response.data.data;
      serviceList.value = data.map((ele) => {
        return {
          _id: ele._id,
          title: ele.name,
          description: ele.desc,
          image: { secure_url: ele.image.secure_url },
        };
      });
      isLoading.value = false;
    } else {
      isLoading.value = false;
      throw new Error("لايوجد خدمات قم باضافه خدمات");
    }
  } catch (error) {
    isLoading.value = false;
  }
};
onMounted(() => {
  getAllServices();
});
</script>
