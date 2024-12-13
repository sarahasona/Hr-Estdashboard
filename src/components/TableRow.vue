<template>
  <fwb-table-row>
    <fwb-table-cell
      ><div class="flex gap-1 items-center">
        <img
          :src="service?.image?.secure_url"
          class="w-[100px] h-[100px]"
          :alt="service.title"
        />
        <div>
          <p class="font-[18px]">{{ service.title }}</p>
          <p class="text-gray-500 font-[16px]">{{ service.description }}</p>
        </div>
      </div></fwb-table-cell
    >

    <fwb-table-cell>
      <DeleteModal
        :serviceId="service._id"
        title="هل انت متاكد من حذف الخدمه"
        @delete="handleDeleteService"
        type="service"
      />
    </fwb-table-cell>
    <fwb-table-cell>
      <ServiceModal title="تعديل الخدمه  " :serviceObj="service" type="edit" name="service" />
      <!-- <BiPencil
        :serviceId="service.id"
        @click="handleEditService"
        class="cursor-pointer text-orange-500"
      /> -->
    </fwb-table-cell>
  </fwb-table-row>
</template>

<script setup>
const { service } = defineProps(["service"]);
import {
  FwbA,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from "flowbite-vue";
import { BiPencil } from "vue-icons-plus/bi";
import { defineEmits, inject } from "vue";
import DeleteModal from "./DeleteModal.vue";
import ServiceModal from "./ServiceModal.vue";
const emit = defineEmits();
</script>

<style>

</style>
