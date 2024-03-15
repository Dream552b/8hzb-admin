<script setup lang="ts">
defineOptions({
  name: "EUTable"
});
defineProps({
  list: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <el-table
    border
    :data="list || []"
    :header-cell-style="{ background: '#c9c8c8', color: '#606266' }"
    v-loading="loading"
  >
    <el-table-column label="公司" align="center" prop="company" />
    <el-table-column label="初盘" align="center" prop="first">
      <template #default="{ row }">
        <span>{{
          row.first.join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="即盘" align="center" prop="last">
      <template #default="{ row }">
        <span>{{ row.last.join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;") }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
