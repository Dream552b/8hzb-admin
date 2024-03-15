<script setup lang="ts">
import { computed } from "vue";

defineOptions({
  name: "EUTable"
});
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const textMap = {
  0: "max",
  1: "min",
  2: "avg"
};

const list = computed(() => {
  if (!props.data) return [];
  const arr = ["最高值", "最低值", "平均值"].flatMap((item, index) => {
    return Object.entries(props.data[textMap[index]])
      .reverse()
      .map(item2 => {
        const [key, value] = item2;
        return {
          name: item,
          plateName: key === "first" ? "初盘" : "即盘",
          firstValue: value[0],
          secValue: value[1],
          thirdValue: value[2]
        };
      });
  });
  return arr;
});

const list2 = computed(() => {
  if (!props.data) return [];
  return props.data.company;
});

const objectSpanMethod = ({ rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  }
};
</script>

<template>
  <el-table
    border
    :data="list || []"
    :header-cell-style="{ background: '#c9c8c8', color: '#606266' }"
    :span-method="objectSpanMethod"
    :show-header="false"
    v-loading="loading"
  >
    <el-table-column align="center" prop="name" />
    <el-table-column label="初盘" align="center" prop="plateName" />
    <el-table-column label="即盘" align="center" prop="firstValue" />
    <el-table-column label="即盘" align="center" prop="secValue" />
    <el-table-column
      label="即盘"
      align="center"
      prop="thirdValue"
      v-if="props.data?.avg?.first?.length >= 3"
    />
  </el-table>

  <el-table
    style="margin-top: 40px"
    border
    :data="list2 || []"
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
