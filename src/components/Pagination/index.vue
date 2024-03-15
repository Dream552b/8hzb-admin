<script setup lang="ts">
import { computed } from "vue";
defineOptions({
  name: "Pagination"
});
const emits = defineEmits(["pageChange", "update:pagination"]);
const props = defineProps({
  pagination: {
    type: Object,
    defalut: () => {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0
      };
    }
  }
});

const currentPagination = computed({
  get() {
    return props.pagination;
  },
  set(val) {
    emits("update:pagination", val);
  }
});

const pageChange = val => {
  currentPagination.value.pageNum = val;
  emits("pageChange", {
    pageNum: val,
    pageSize: currentPagination.value.pageSize,
    total: currentPagination.value.total
  });
};

const sizeChange = val => {
  currentPagination.value.pageSize = val;
  emits("pageChange", {
    pageNum: currentPagination.value.pageNum,
    pageSize: val,
    total: currentPagination.value.total
  });
};
</script>

<template>
  <el-pagination
    @size-change="sizeChange"
    @current-change="pageChange"
    background
    :current-page="currentPagination?.pageNum"
    :page-sizes="[10, 20, 50, 100]"
    :page-size="currentPagination?.pageSize"
    layout="prev, pager, next, jumper,total,sizes"
    :total="currentPagination?.total"
  />
</template>
