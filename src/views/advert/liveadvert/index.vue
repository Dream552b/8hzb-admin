<script setup lang="ts">
import { reactive, ref } from "vue";
import { getAdvertList, queryAdvertList } from "@/api/advert/liveadvert";
import SetAdDialog from "./components/setAdDialog.vue";
import EditAdDialog from "./components/editAdDialog.vue";
import Pagination from "@/components/Pagination/index.vue";
import dayjs from "dayjs";

defineOptions({
  name: "Liveadvert"
});
const form = reactive({
  homeTeamName: "",
  awayTeamName: "",
  eventName: "",
  matchType: 1,
  type: 0
});

const loading = ref<boolean>(false);
const formRef = ref<any>();
const SetAdDialogRef = ref<any>();
const EditAdDialogRef = ref<any>();
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const list = ref<any>([]);
const columns = ref<any>([
  {
    label: "广告ID",
    prop: "matchAdvertId"
  },
  {
    label: "比赛ID",
    prop: "matchID"
  },
  {
    label: "比赛名称",
    prop: "eventName"
  },
  {
    label: "比赛状态",
    prop: "matchStatus",
    formatter: (row: any) => {
      const { matchType, status } = row;
      if (matchType == 1) {
        if (status == 1) {
          return "未开赛";
        } else if (status == 8) {
          return "已结束";
        } else if (status < 1 || status >= 9) {
          return "其他";
        } else {
          return "进行中";
        }
      }
      if (matchType == 2) {
        if (status == 1) {
          return "未开赛";
        } else if (status == 10) {
          return "已结束";
        } else if (status > 10) {
          return "其他";
        }
        return "进行中";
      }
    }
  },
  {
    label: "比赛时间",
    prop: "matchTime",
    formatter: row => {
      return (
        (row.matchTime &&
          dayjs.unix(row.matchTime).format("YYYY-MM-DD HH:mm:ss")) ||
        ""
      );
    }
  },
  {
    label: "主队名称",
    prop: "homeTeamName"
  },
  {
    label: "客队名称",
    prop: "awayTeamName"
  }
]);

const setAd = row => {
  SetAdDialogRef.value.open({ matchAdvertId: row.matchAdvertId });
};
const addAd = row => {
  EditAdDialogRef.value.open(row, "add");
};
const getList = async () => {
  try {
    loading.value = true;
    const params = {
      pageSize: pagination.value.pageSize,
      pageNum: pagination.value.pageNum,
      ...form,
      _: new Date().getTime()
    };
    const isChange =
      form.homeTeamName !== "" ||
      form.awayTeamName !== "" ||
      form.eventName !== "" ||
      form.sportsType !== 1 ||
      form.type !== 0;
    const res: any = isChange
      ? await queryAdvertList(params)
      : await getAdvertList(params);
    const {
      data: { records, total }
    } = res;
    // pagination.value.pageNum = current;
    // pagination.value.pageSize = size;
    pagination.value.total = total;
    list.value = records || [];
  } catch (err) {
    console.log("err:", err);
  } finally {
    loading.value = false;
  }
};
getList();
const pageChange = () => {
  getList();
};

const setAdDialogRefClose = val => {
  console.log("🚀 ~ file: index.vue:135 ~ setAdDialogRefClose ~ val:", val);
  if (val) {
    getList();
  }
};

const reset = () => {
  formRef.value.resetFields();
  pagination.value.pageNum = 1;
  pagination.value.pageSize = 10;
  pagination.value.total = 0;
  getList();
};
</script>

<template>
  <el-card shadow="never">
    <el-form ref="formRef" :model="form" inline>
      <el-form-item label="比赛名称" prop="eventName">
        <el-input v-model="form.eventName" placeholder="请输入比赛名称" />
      </el-form-item>
      <el-form-item label="主队名称" prop="homeTeamName">
        <el-input v-model="form.homeTeamName" placeholder="请输入比赛名称" />
      </el-form-item>
      <el-form-item label="客队名称" prop="awayTeamName">
        <el-input v-model="form.awayTeamName" placeholder="请输入比赛名称" />
      </el-form-item>
      <el-form-item label="比赛类型" prop="matchType">
        <el-select v-model="form.sportsType">
          <el-option label="足球" :value="1" />
          <el-option label="篮球" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="比赛状态" prop="type">
        <el-select v-model="form.type">
          <el-option label="全部" :value="0" />
          <el-option label="进行中" :value="1" />
          <el-option label="未开赛" :value="2" />
          <el-option label="已结束" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="getList">查询</el-button>
        <el-button type="success" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-scrollbar v-loading="loading">
      <el-table style="width: 100%" class="table" border :data="list">
        <el-table-column
          :width="item.width"
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :formatter="item.formatter"
        />
        <el-table-column label="设置" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.matchAdvertId"
              type="success"
              link
              @click="setAd(row)"
            >
              设置广告
            </el-button>
            <el-button v-else type="success" link @click="addAd(row)">
              新增广告
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>
    <set-ad-dialog ref="SetAdDialogRef" @close="setAdDialogRefClose" />
    <edit-ad-dialog ref="EditAdDialogRef" @close="setAdDialogRefClose" />
  </el-card>
</template>
