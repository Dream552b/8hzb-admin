<script setup lang="ts">
import { ref } from "vue";
import { getFootballEventIndexData } from "@/api/competition/football";
import rqTable from "./rqTable.vue";
import EuTable from "./euTable.vue";
import BsTable from "./bsTable.vue";

defineOptions({
  name: "CompetitionEventIndex"
});
const dialogVisible = ref<boolean>(false);
const loading = ref<boolean>(false);
const dataDetail = ref<any>();
const open = async ({ id }) => {
  dialogVisible.value = true;
  getList(id);
};
const getList = async id => {
  loading.value = true;
  const res = await getFootballEventIndexData({ id });
  dataDetail.value = res.data;
  loading.value = false;
};
defineExpose({
  open
});
</script>

<template>
  <el-dialog
    title="赛事指数"
    v-model="dialogVisible"
    destroy-on-close
    width="75%"
  >
    <el-tabs>
      <el-tab-pane label="让球">
        <rq-table :list="dataDetail?.asia" :loading="loading" />
      </el-tab-pane>
      <el-tab-pane label="欧指">
        <eu-table :data="dataDetail?.eu" :loading="loading" />
      </el-tab-pane>
      <el-tab-pane label="进球数">
        <bs-table :list="dataDetail?.bs" :loading="loading" />
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" :loading="loading">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
          :loading="loading"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
@/api/competition/homeTeamRank
