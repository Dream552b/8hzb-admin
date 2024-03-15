<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  getTeamList,
  hotTeamMove,
  cancelHotTeam
} from "../../api/competition/hotTeam";
import Pagination from "@/components/Pagination";
import { Delete } from "@element-plus/icons-vue";
import SelectEventDialog from "./components/hotTeam/add.vue";
import dayjs from "dayjs";

import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "HotTeam"
});
const SelectEventDialogRef = ref<any>();
const formRef = ref<any>();
const loading = ref<boolean>(false);
const multipleSelection = ref([]);
const columns = ref<any>([
  {
    label: "比赛名称",
    prop: "competitionName"
  },
  // {
  //   label: "赛事类型",
  //   prop: "sportsType",
  //   formatter: (row, col, val) => {
  //     if (val == 1) return "足球";
  //     if (val == 2) return "篮球";
  //   }
  // },
  {
    label: "是否关闭",
    prop: "isClose",
    formatter: (row, col, val) => {
      if (val == 1) return "已关闭";
      if (val == 0) return "未关闭";
    }
  },
  {
    label: "创建时间",
    prop: "createTime",
    formatter: (row, col, val) => {
      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
    }
  }
]);
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const form = reactive({
  sportsType: 1,
  isClose: -1
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
    const res: any = await getTeamList(params);
    const {
      data: { records, total }
    } = res;
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

const handleMoveUp = async (row, type) => {
  loading.value = true;
  await hotTeamMove({ id: row.id, type });
  loading.value = false;
  getList();
};

const handleClose = async row => {
  let title = row.isClose ? "确认开启吗？" : "确认关闭吗？";
  ElMessageBox.confirm(title, {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;
      await cancelHotTeam({
        sportsType: row.sportsType,
        competitionID: row.id,
        isClose: row.isClose ? 0 : 1
      });
      loading.value = false;
      getList();
    })
    .catch(() => {});
};

const add = () => {
  SelectEventDialogRef.value.open();
};

const handleSelectionChange = val => {
  multipleSelection.value = val;
};

const batchCancel = async () => {
  if (multipleSelection.value.length === 0) {
    return ElMessage({
      message: "请勾选数据",
      type: "warning"
    });
  }
  ElMessageBox.confirm("是否批量取消热门球队，请慎重", "信息", {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;
      await cancelHotTeam({
        id: multipleSelection.value.map(item => item.id).join(",")
      });
      loading.value = false;
      getList();
    })
    .catch(() => {});
};
</script>

<template>
  <el-card>
    <el-form ref="formRef" :inline="true" :model="form">
      <!-- <el-form-item label="球类" prop="sportsType">
        <el-select v-model="form.sportsType" @change="getList">
          <el-option label="足球" value="1" />
          <el-option label="篮球" value="2" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="比赛名称" prop="competitionName">
        <el-input
          v-model="form.competitionName"
          placeholder="请输入"
          clearable
        />
      </el-form-item>

      <el-form-item label="赛事类型" prop="sportsType">
        <el-select v-model="form.sportsType" placeholder="请选择">
          <el-option label="足球" :value="1" />
          <el-option label="篮球" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否关闭" prop="isClose">
        <el-select v-model="form.isClose">
          <el-option label="全部" :value="-1" />
          <el-option label="否" :value="0" />
          <el-option label="是" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="">
        <!-- <el-button type="primary" @click="add">新增</el-button> -->
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-scrollbar v-loading="loading">
      <el-table
        ref="tableRef"
        class="table"
        border
        :data="list"
        row-key="eventId"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :formatter="item.formatter"
          :show-overflow-tooltip="item['show-overflow-tooltip']"
        />
        <el-table-column label="操作" align="center" width="280px">
          <template #default="{ row }">
            <el-link
              type="danger"
              :underline="false"
              @click="handleClose(row, 1)"
              v-if="row.isClose === 0"
            >
              关闭
            </el-link>
            <el-link
              v-else
              type="primary"
              :underline="false"
              @click="handleClose(row, 1)"
            >
              开启
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>

    <select-event-dialog ref="SelectEventDialogRef" @close="getList" />
  </el-card>
</template>
