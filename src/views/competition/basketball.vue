<script setup lang="ts">
import { reactive, ref } from "vue";
import { getBasketballScheduleList } from "../../api/competition/basketball";
import { updateTopStatus, updateIsClose } from "../../api/competition/football";
import Pagination from "@/components/Pagination";
import MatchDataDialog from "./components/basketball/eventData.vue";
import LiveDataDialog from "./components/basketball/liveData.vue";
import EventIndexDialog from "./components/basketball/eventIndex.vue";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "Basketball"
});
const LiveDataDialogRef = ref<any>();
const MatchDataDialogRef = ref<any>();
const EventIndexDialogRef = ref<any>();
const formRef = ref<any>();
const loading = ref<boolean>(false);
const columns = ref<any>([
  { label: "ID", prop: "id" },
  { label: "比赛名称", prop: "competitionName" },
  {
    label: "比赛状态",
    prop: "status",
    formatter: (row, col, val) => {
      if (val == 1) return "未开赛";
      if (val == 10) return "已结束";
      if (val > 10) return "其他";
      if (val > 1 || val <= 9) return "进行中";
    }
  },
  {
    label: "比赛时间",
    prop: "matchTime",
    formatter: (row, col, val) => {
      return dayjs.unix(val).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  { label: "主队名称", prop: "homeTeamName" },
  { label: "客队名称", prop: "awayTeamName" },
  {
    label: "比分",
    prop: "homeTeamRank",
    formatter: row => {
      return `${row.homeScores} : ${row.awayScores}`;
    }
  }
  // { label: "视频地址", prop: "liveUrl", "show-overflow-tooltip": true }
]);
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const form = reactive({
  sportsType: 2,
  competitionName: "",
  homeTeamName: "",
  awayTeamName: ""
  // type: "",
  // isGuess: ""
  // authStatus: 1
});

const list = ref<any>();
const pageChange = () => {
  getList();
};
const getList = async () => {
  try {
    loading.value = true;
    const params = {
      page: pagination.value.pageNum,
      limit: pagination.value.pageSize,
      ...form
    };
    const res: any = await getBasketballScheduleList(params);
    const {
      data: { records, total }
    } = res;

    console.log("data", records);

    pagination.value.total = total;
    list.value = records || [];
  } catch (err) {
    console.log("err:", err);
  } finally {
    loading.value = false;
  }
};
getList();

const resetQuery = () => {
  formRef.value.resetFields();
  getList();
};

const openMatchDataDialog = row => {
  MatchDataDialogRef.value.open({ row });
};

const openLiveDataDialog = row => {
  LiveDataDialogRef.value.open({ id: row.id, row });
};

const openEventIndexDialog = async row => {
  EventIndexDialogRef.value.open({ id: row.id, row });
};

const onTop = async row => {
  let title =
    row.topStatus === 1 ? "确认置顶这条比赛吗？" : "确认取消置顶比赛吗？";
  ElMessageBox.confirm(title, {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;
      let { code } = await updateTopStatus({
        matchID: row.id,
        sportsType: row.sportsType,
        topStatus: row.topStatus ? 0 : 1 //0取消置顶1置顶
      });
      loading.value = false;
      if (code !== 200) return;
      ElMessage({
        message: "操作成功",
        type: "success"
      });

      getList();
    })
    .catch(() => {});
};

const handleClose = async row => {
  let title = row.isClose ? "确认开启吗？" : "确认关闭吗？";
  ElMessageBox.confirm(title, {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;
      let { code } = await updateIsClose({
        sportsType: row.sportsType,
        matchID: row.id,
        isClose: row.isClose ? 0 : 1
      });
      loading.value = false;

      if (code !== 200) return;
      ElMessage({
        message: "操作成功",
        type: "success"
      });

      getList();
    })
    .catch(() => {});
};
</script>

<template>
  <el-card>
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item label="赛事状态" prop="statusID">
        <el-select v-model="form.statusID">
          <el-option label="未开赛" :value="1" />
          <el-option label="开赛" :value="2" />
          <el-option label="结束" :value="3" />
          <el-option label="其他" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="比赛ID" prop="matchID">
        <el-input v-model="form.matchID" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="比赛名称" prop="competitionName">
        <el-input
          v-model="form.competitionName"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="主队名称 " prop="homeTeamName">
        <el-input v-model="form.homeTeamName" placeholder="请输入" clearable />
      </el-form-item>
      <!-- <el-form-item label="客队名称" prop="awayTeamName">
        <el-input v-model="form.awayTeamName" placeholder="请输入" clearable />
      </el-form-item> -->

      <el-form-item label="">
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-scrollbar v-loading="loading">
      <el-table ref="tableRef" class="table" border :data="list">
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :formatter="item.formatter"
          :show-overflow-tooltip="item['show-overflow-tooltip']"
        />
        <el-table-column label="操作" align="center" width="240px">
          <template #default="{ row }">
            <el-link
              v-if="row.topStatus === 0"
              type="primary"
              :underline="false"
              @click="onTop(row)"
            >
              置顶比赛
            </el-link>

            <el-link
              v-if="row.topStatus === 1"
              type="danger"
              :underline="false"
              @click="onTop(row)"
            >
              取消置顶
            </el-link>
            <el-divider direction="vertical" />
            <el-link
              type="danger"
              :underline="false"
              @click="handleClose(row, 1)"
              v-if="row.isClose === 0"
            >
              关闭比赛
            </el-link>
            <el-link
              v-else
              type="primary"
              :underline="false"
              @click="handleClose(row, 1)"
            >
              开启比赛
            </el-link>
            <el-divider direction="vertical" />
            <el-link
              type="primary"
              :underline="false"
              @click="openMatchDataDialog(row)"
            >
              视频源
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>

    <match-data-dialog ref="MatchDataDialogRef" @getList="getList" />
    <live-data-dialog ref="LiveDataDialogRef" />
    <event-index-dialog ref="EventIndexDialogRef" />
  </el-card>
</template>
