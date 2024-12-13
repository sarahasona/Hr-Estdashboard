<template>
  <div class="table-sorting mt-5">
    <fwb-table striped>
      <fwb-table-head>
        <fwb-table-head-cell v-for="(head, index) in headers" :key="index">
          <span v-if="head === 'Remove' || head == 'Edit'">
            <DeleteModal
              v-if="head == 'Remove'"
              title="هل انت متاكد من حذف جميع الخدمات"
              @delete="handleDelete"
              type="serviceAll"
            />
          </span>
          <h3 v-else dir="rlt" class="font-bold text-[20px]">{{ head }}</h3></fwb-table-head-cell
        >
      </fwb-table-head>
      <fwb-table-body>
        <TableRow v-for="(item, ind) in services" :key="ind" :service="item" />
      </fwb-table-body>
    </fwb-table>
  </div>
</template>

<script setup>
import TableRow from "./TableRow.vue";
import {
  FwbA,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from "flowbite-vue";
import { BiTrash, BiPencil } from "vue-icons-plus/bi";
import DeleteModal from "./DeleteModal.vue";
import { defineEmits } from "vue";
const emit = defineEmits();
const { headers, services } = defineProps(["headers", "services"]);
const handleDelete = () => {
  emit('deleteAll')
};
</script>
<style lang="scss">
.table-sorting {
  th,
  td {
    padding:3px!important;
    text-align: right !important;
    padding-left: 10px !important;
  }
}
</style>
