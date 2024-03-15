<script setup lang="ts">
import { ref } from "vue";
import { getFootballMatchData } from "@/api/competition/football";

defineOptions({
  name: "CompetitionEventData"
});

const dialogVisible = ref<boolean>();
const table1Data = ref<any>();
const table2Data = ref<any>();
const loading = ref<boolean>(false);
const open = ({ id }) => {
  dialogVisible.value = true;
  getList(id);
};

const getList = async id => {
  loading.value = true;
  const res = await getFootballMatchData({ id });
  table1Data.value = res.data.goalDistribution;
  table2Data.value = res.data.historyMatch;
  loading.value = false;
};

defineExpose({ open });
</script>

<template>
  <el-dialog title="赛事数据" v-model="dialogVisible" destroy-on-close>
    <el-row>进球分布</el-row>
    <el-table style="margin-top: 10px" :data="table1Data" border>
      <el-table-column prop="footballTeam" align="center" />
      <el-table-column prop="scored[0]" label="00'" align="center" />
      <el-table-column prop="scored[1]" label="15'" align="center" />
      <el-table-column prop="scored[2]" label="30'" align="center" />
      <el-table-column prop="scored[3]" label="45'" align="center" />
      <el-table-column prop="scored[4]" label="60'" align="center" />
      <el-table-column prop="scored[5]" label="75'" align="center" />
      <el-table-column prop="totalScore" label="90'" align="center" />
    </el-table>

    <el-row style="margin-top: 20px">历史交锋</el-row>
    <el-table style="margin-top: 10px" :data="table2Data" border>
      <el-table-column prop="date" label="日期" align="center" />
      <el-table-column prop="eventName" label="赛事" align="center" />
      <el-table-column prop="homeTeamName" label="主队" align="center" />
      <el-table-column label="比分" align="center">
        <template #default="{ row }">
          <span>{{ `${row.homeTeamScore} : ${row.awayTeamScore}` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="awayTeamName" label="客队" align="center" />
      <el-table-column prop="rate" label="盘路" align="center" />
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" :loading="loading"
          >取消</el-button
        >
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
