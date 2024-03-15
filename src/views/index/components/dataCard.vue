<script setup lang="ts">
defineOptions({
  name: "dataCard"
});

defineProps({
  label: {
    type: String,
    defualt: ""
  },
  color: {
    type: String,
    defualt: ""
  },
  unit: {
    type: String,
    defualt: ""
  },
  value: {
    type: [String, Number],
    defualt: ""
  }
});
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="header-wrap">
          <span style="margin-right: 12px">{{ label }}</span>
          <el-tag :color="color" :hit="false" style="color: #fff">
            {{ unit }}
          </el-tag>
        </div>
      </template>
      <span class="text"> {{ value }} </span>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.header-wrap {
  display: flex;
  justify-content: space-between;
}

.text {
  font-size: 36px;
  color: #666;
}
</style>
