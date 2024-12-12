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
    <div class="">
      <!-- Service table -->
      <ServiceTable
        v-if="serviceList.length > 0"
        :services="serviceList"
        :headers="headers"
        @deleteAll="handleDeleteAll"
        @editService="handleEditService"
      />
      <div v-else class="flex justify-center items-center min-h-[400px] font-bold text-[22px]">
        <p>قم باضامه خدمات</p>
      </div>
    </div>
  </div>
</template>

<style></style>
<script setup>
import { ref, provide } from "vue";
import ServiceTable from "@/components/ServiceTable.vue";
import ServiceModal from "@/components/ServiceModal.vue";
const serviceList = ref([]);
const editServiceObj = ref({ title: "", description: "", image: "" });
const headers = ["الخدمه", "Remove", "تعديل"];
const handleAddService = (service) => {
  serviceList.value.push(service);
  console.log(service);
};
const handleDeleteAll = () => {
  serviceList.value = [];
};
const handleEditService = (service) => {
  console.log(service);
  const target = serviceList.value.find((ele) => ele.id === service.id);
  console.log(target);
  if (target) {
    Object.assign(target, {
      title: service.title,
      description: service.description,
      image: service.image,
    });
  }
};
const handleDeleteService = (serviceId) => {
  const index = serviceList.value.findIndex((ele) => ele.id === serviceId);
  if (index > -1) {
    serviceList.value.splice(index, 1);
  }
};
provide("servicesApi", {
  editService: handleEditService,
  deleteService: handleDeleteService,
});
</script>
