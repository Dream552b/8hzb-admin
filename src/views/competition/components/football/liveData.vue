<script setup lang="ts">
import { ref } from "vue";
import { getFootballLiveData } from "@/api/competition/football";

defineOptions({
  name: "FootballLiveData"
});
const dialogVisible = ref<boolean>(false);
const loading = ref<boolean>(false);
const info = ref<any>();
const rowData = ref<any>();

const open = ({ id, row }) => {
  dialogVisible.value = true;
  rowData.value = row;
  getInfo(id);
};

const getInfo = async id => {
  loading.value = true;
  const res = await getFootballLiveData({ id });
  info.value = res.data;
  loading.value = false;
};

const getInfoByType = (stats, type, identify) => {
  if (Array.isArray(stats)) {
    const obj = stats.find(item => item.type == type);
    return (obj && obj[identify]) || 0;
  }
};

defineExpose({
  open
});
</script>

<template>
  <el-dialog
    width="75%"
    title="直播数据"
    v-model="dialogVisible"
    destroy-on-close
  >
    <el-row align="middle" v-loading="loading">
      <el-card style="flex: 1">
        <template #header>
          <el-row justify="space-between">
            <div>主队: {{ info?.home_team?.name_zh }}</div>
            <div>比分: {{ info?.home_team?.score || 0 }}</div>
          </el-row>
        </template>
        <el-space direction="vertical" fill style="width: 100%">
          <el-row justify="space-between">
            <span>进球数</span>
            <span>半场进球数</span>
          </el-row>
          <el-row justify="space-between">
            <span>{{
              getInfoByType(info?.results?.stats, 1, "home") || 0
            }}</span>
            <span>{{ 0 }}</span>
          </el-row>
          <el-row justify="space-between">
            <span>红牌</span>
            <span>黄牌</span>
            <span>角球</span>
          </el-row>
          <el-row justify="space-between">
            <span>{{
              getInfoByType(info?.results?.stats, 4, "home") || 0
            }}</span>
            <span>{{
              getInfoByType(info?.results?.stats, 3, "home") || 0
            }}</span>
            <span>{{
              getInfoByType(info?.results?.stats, 2, "home") || 0
            }}</span>
          </el-row>
          <el-row justify="space-between">
            <span>比赛得分</span>
            <span>联赛排名</span>
          </el-row>
          <el-row justify="space-between">
            <span>0</span>
            <span>{{ rowData?.homeTeamRank || "" }}</span>
          </el-row>
        </el-space>
      </el-card>
      <span style="padding: 0 20px; font-size: 28px; color: #666">VS</span>
      <el-card style="flex: 1">
        <template #header>
          <el-row justify="space-between">
            <div>客队: {{ info?.away_team?.name_zh }}</div>
            <div>比分: {{ 0 }}</div>
          </el-row>
        </template>
        <el-space direction="vertical" fill style="width: 100%">
          <el-row justify="space-between">
            <span>进球数</span>
            <span>半场进球数</span>
          </el-row>
          <el-row justify="space-between">
            <span>{{
              getInfoByType(info?.results?.stats, 1, "away") || 0
            }}</span>
            <span>{{ 0 }}</span>
          </el-row>
          <el-row justify="space-between">
            <span>红牌</span>
            <span>黄牌</span>
            <span>角球</span>
          </el-row>
          <el-row justify="space-between">
            <span>{{
              getInfoByType(info?.results?.stats, 4, "away") || 0
            }}</span>
            <span>{{
              getInfoByType(info?.results?.stats, 3, "away") || 0
            }}</span>
            <span>{{
              getInfoByType(info?.results?.stats, 2, "away") || 0
            }}</span>
          </el-row>
          <el-row justify="space-between">
            <span>比赛得分</span>
            <span>联赛排名</span>
          </el-row>
          <el-row justify="space-between">
            <span>0</span>
            <span>{{ rowData?.awayTeamRank || "" }}</span>
          </el-row>
        </el-space>
      </el-card>
    </el-row>

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
