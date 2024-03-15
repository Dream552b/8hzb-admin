<script setup>
import { reactive, ref } from "vue";
const loading = ref(false);
const dialogVisible = ref(false);

const emits = defineEmits(["addHot"]);

const form = reactive({
  sportsType: 1,
  sort: 0
});

const open = sort => {
  form.sort = sort || 0;
  dialogVisible.value = true;
};
const submit = () => {
  emits("addHot", form.sort);
  dialogVisible.value = false;
};
defineExpose({
  open
});
</script>

<template>
  <el-dialog
    title="设置热门排序"
    v-model="dialogVisible"
    width="25%"
    @closed="dialogClosed"
  >
    <el-form inline :model="form">
      <el-form-item label="热门排序">
        <el-input
          v-model="form.sort"
          placeholder="请输入"
          type="number"
          clearable
        />
      </el-form-item>
      <div style="margin-top: -14px; color: #666">
        提示：排序号越大越靠前；0为默认排序
      </div>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
