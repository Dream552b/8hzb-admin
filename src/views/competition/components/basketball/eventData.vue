<script setup lang="ts">
import { ref } from "vue";
import { updateVideoSource } from "@/api/competition/basketball";
import { ElInput, ElMessage, ElMessageBox } from "element-plus";
import { any } from "vue-types";

defineOptions({
  name: "CompetitionBasketballEventData"
});

const emits = defineEmits(["getList"]);

const dialogVisible = ref<boolean>();
const table1Data = ref<any>();
const table2Data = ref<any>();
const loading = ref<boolean>(false);
const matchVideoSource1 = ref(false);
const matchVideoSource2 = ref(false);
const matchVideoSource3 = ref(false);

let rowData = null;

const open = ({ row }) => {
  dialogVisible.value = true;
  rowData = row;
  matchVideoSource1.value = row.matchVideoSource[0] ? false : true;
  matchVideoSource2.value = row.matchVideoSource[1] ? false : true;
  matchVideoSource3.value = row.matchVideoSource[2] ? false : true;
};

const onUpdate = async () => {
  const params = {
    matchID: rowData.id,
    sportsType: rowData.sportsType,
    matchVideoSource: [
      matchVideoSource1.value ? 0 : 1,
      matchVideoSource2.value ? 0 : 1,
      matchVideoSource3.value ? 0 : 1
    ]
  };
  loading.value = true;
  let { code, data } = await updateVideoSource(params);
  loading.value = false;
  if (code !== 200)
    return ElMessage({
      message: data,
      type: "error"
    });
  ElMessage({
    message: "保存成功",
    type: "success"
  });
  dialogVisible.value = false;
  emits("getList");
};
defineExpose({ open });
</script>

<template>
  <el-dialog
    title="视频源设置"
    v-model="dialogVisible"
    destroy-on-close
    width="40%"
  >
    <el-form ref="formRef" :inline="true">
      <el-row>
        <el-form-item label="高清" prop="competitionName">
          <el-switch
            v-model="matchVideoSource1"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="中文蓝光" prop="competitionName">
          <el-switch
            v-model="matchVideoSource2"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="英文蓝光" prop="competitionName">
          <el-switch
            v-model="matchVideoSource3"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" :loading="loading"
          >取消</el-button
        >
        <el-button type="primary" @click="onUpdate" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
