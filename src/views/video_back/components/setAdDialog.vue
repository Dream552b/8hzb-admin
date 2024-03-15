<script setup lang="ts">
import { ref } from "vue";
import { getMatchAdvert, delMatchAdvert } from "@/api/advert/liveadvert";
import EditAdDialog from "./editAdDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";

defineOptions({
  name: "SetAdDialog"
});
const emits = defineEmits(["close"]);
const EditAdDialogRef = ref<any>();
const visible = ref(false);
const loading = ref(false);
const list = ref<any>([]);
const open = ({ matchAdvertId }) => {
  visible.value = true;
  getInfo({ matchAdvertId });
};
const getInfo = async ({ matchAdvertId }) => {
  loading.value = true;
  const res = await getMatchAdvert({ matchAdvertId });
  list.value = [res.data];
  loading.value = false;
};
const handleEdit = (row: any) => {
  EditAdDialogRef.value.open(row, "edit");
};
const handleDelete = async row => {
  ElMessageBox.confirm("确认要删除吗？", "信息", {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;
      const res = await delMatchAdvert({ id: row.id });
      if (res.code == 200) {
        ElMessage({
          message: "删除成功",
          type: "success"
        });
      }
      loading.value = false;
      close(1);
    })
    .catch(() => {});
};

const handleClose = () => {};

const close = type => {
  visible.value = false;
  emits("close", type);
};
defineExpose({ open });
</script>

<template>
  <el-dialog title="设置广告" v-model="visible" @closed="handleClose">
    <el-table border :data="list" v-loading="loading">
      <el-table-column label="头部广告语" prop="headAdvert" align="center" />
      <el-table-column label="底部广告语" prop="bottomAdvert" align="center" />
      <el-table-column prop="url" label="二维码" align="center">
        <template #default="{ row }">
          <el-image style="width: 100px; height: 100px" :src="row.pic" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button link type="danger" @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <edit-Ad-dialog ref="EditAdDialogRef" @close="close(1)" />
</template>
