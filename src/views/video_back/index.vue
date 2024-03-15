<script setup lang="ts">
import { reactive, ref } from "vue";
import { getPlaybackList, delPlayback } from "@/api/playback";
import SetAdDialog from "./components/setAdDialog.vue";
import EditAdDialog from "./components/editAdDialog.vue";
import Pagination from "@/components/Pagination/index.vue";
import dayjs from "dayjs";
import { ElMessageBox, ElMessage } from "element-plus";

defineOptions({
  name: "Liveadvert"
});
const form = reactive({
  matchID: ""
});
const time = ref<any>([]);

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
    label: "序号",
    prop: "id"
  },
  {
    label: "比赛ID",
    prop: "matchID"
  },
  {
    label: "赛事类型",
    prop: "sportsType",
    formatter: (row: any) => {
      const { sportsType } = row;
      if (sportsType === 1) {
        return "足球";
      } else if (sportsType === 2) {
        return "篮球";
      }
    }
  },
  {
    label: "主队名称",
    prop: "homeTeamName"
  },
  {
    label: "客队名称",
    prop: "awayTeamName"
  },
  {
    label: "录制状态",
    prop: "status",
    formatter: (row: any) => {
      const { status } = row;
      if (status === 1) {
        return "录制中";
      } else if (status === 2) {
        return "录制成功";
      } else if (status === 3) {
        return "录制失败";
      }
    }
  },

  {
    label: "创建时间",
    prop: "createdAT",
    formatter: row => {
      return (
        (row.createdAT &&
          dayjs.unix(row.createdAT).format("YYYY-MM-DD HH:mm:ss")) ||
        ""
      );
    }
  }
]);

const setAd = row => {
  SetAdDialogRef.value.open({ matchAdvertId: row.matchAdvertId });
};

const editAd = row => {
  EditAdDialogRef.value.open(row, "edit");
};
const addAd = row => {
  EditAdDialogRef.value.open(row, "add");
};
const detailsAd = row => {
  EditAdDialogRef.value.open(row, "details");
};
const delRow = async row => {
  ElMessageBox.confirm("确定要删除吗？", "信息", {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;
      const res = await delPlayback({ ids: [row.id] });
      console.log(res);
      if (res.code === 200) {
        ElMessage({
          message: "删除成功",
          type: "success"
        });
      }
      loading.value = false;
      getList();
    })
    .catch(() => {});
};

const getList = async () => {
  try {
    loading.value = true;
    const params = {
      page: pagination.value.pageNum,
      limit: pagination.value.pageSize,
      ...form,
      _: new Date().getTime()
    };

    const res: any = await getPlaybackList(params);
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
const pageChange = () => {
  getList();
};

const setAdDialogRefClose = val => {
  console.log("🚀 ~ file: index.vue:135 ~ setAdDialogRefClose ~ val:", val);
  if (val) {
    getList();
  }
};

const multipleSelection = ref<any>([]);
const handleSelectionChange = rows => {
  multipleSelection.value = rows;
};

const batchDel = () => {
  if (multipleSelection.value.length === 0) {
    return ElMessage({
      message: "请勾选数据",
      type: "warning"
    });
  }
  ElMessageBox.confirm("确定要批量删除吗？", "信息", {
    type: "warning"
  })
    .then(async () => {
      const ids = multipleSelection.value.map((item: any) => item.id);
      loading.value = true;
      const res = await delPlayback({ ids: ids });
      if (res.code === 200) {
        ElMessage({
          message: "删除成功",
          type: "success"
        });
      }
      loading.value = false;
      getList();
    })
    .catch(() => {});
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
      <el-form-item label="比赛ID" style="margin-bottom: 12px" prop="matchID">
        <el-input v-model="form.matchID" placeholder="请输入比赛ID" clearable />
      </el-form-item>

      <el-form-item label="主队名称" prop="homeTeamName">
        <el-input
          v-model="form.homeTeamName"
          placeholder="请输入比赛名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="客队名称" prop="awayTeamName">
        <el-input
          v-model="form.awayTeamName"
          placeholder="请输入比赛名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="比赛类型" prop="sportsType">
        <el-select v-model="form.sportsType" clearable>
          <el-option label="足球" :value="1" />
          <el-option label="篮球" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="录制状态" prop="status">
        <el-select v-model="form.status" clearable>
          <el-option label="全部" :value="0" />
          <el-option label="录制中" :value="1" />
          <el-option label="成功" :value="2" />
          <el-option label="失败" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="getList">查询</el-button>
        <el-button type="success" @click="reset">重置</el-button>
        <el-button type="success" @click="addAd">新增</el-button>
      </el-form-item>

      <el-row>
        <el-form-item>
          <el-button type="danger" @click="batchDel">批量删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-scrollbar v-loading="loading">
      <el-table
        style="width: 100%"
        class="table"
        border
        :data="list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column
          :width="item.width"
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="success" link @click="delRow(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>
    <set-ad-dialog
      ref="SetAdDialogRef"
      @close="setAdDialogRefClose"
      @getList="getList"
    />
    <edit-ad-dialog
      ref="EditAdDialogRef"
      @close="setAdDialogRefClose"
      @getList="getList"
    />
  </el-card>
</template>
