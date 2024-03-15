<script setup lang="ts">
defineOptions({
  name: "StatCard"
});
defineProps({
  label: {
    type: String,
    value: ""
  },
  value: {
    type: [Number, String],
    value: 0
  }
});
</script>
<template>
  <div class="wrap">
    <div class="title">{{ label }}</div>
    <div class="desc">{{ value }}</div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  padding: 10px 15px;
  background-color: #f8f8f8;

  .title {
    font-size: 12px;
    color: #999;
  }

  .desc {
    font-size: 30px;
    color: #009688;
  }
}
</style>
