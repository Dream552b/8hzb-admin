<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  getAdvertisementList,
  createAdvertisement,
  updateAdvertisement,
  delAdvertisement
} from "@/api/publicize";
import SetAdDialog from "./components/setAdDialog.vue";
import EditAdDialog from "./components/editAdDialog.vue";
import Pagination from "@/components/Pagination/index.vue";
import dayjs from "dayjs";
import { ElMessageBox, ElMessage } from "element-plus";

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
    label: "广告ID",
    prop: "id"
  },
  {
    label: "广告类型",
    prop: "advertisementType",
    formatter: (row: any) => {
      const { advertisementType } = row;
      if (advertisementType === 1) {
        return "文字滚动";
      } else if (advertisementType === 2) {
        return "宣传图";
      } else if (advertisementType === 3) {
        return "二维码";
      } else {
        return "未知";
      }
    }
  },
  {
    label: "赛事名称",
    prop: "eventName"
  },
  {
    label: "中场显示",
    prop: "midfieldDisplay",
    formatter: (row: any) => {
      const { midfieldDisplay, advertisementType } = row;
      if (advertisementType === 2) {
        if (midfieldDisplay === 0) {
          return "否";
        } else if (midfieldDisplay === 1) {
          return "是";
        }
      } else {
        return "";
      }
    }
  },
  {
    label: "状态显示",
    prop: "status",
    formatter: (row: any) => {
      const { status } = row;
      if (status === 0) {
        return "不显示";
      } else if (status === 1) {
        return "显示";
      }
    }
  },
  {
    label: "位置",
    prop: "position",
    formatter: (row: any) => {
      const { position } = row;
      if (position === 1) {
        return "左下角";
      } else if (position === 2) {
        return "右下角";
      } else {
        return "默认";
      }
    }
  },
  {
    label: "比赛ID",
    prop: "basketballMatchID",
    formatter: (row: any) => {
      const { basketballMatchID, footballMatchID } = row;

      if (basketballMatchID.length && footballMatchID.length) {
        return basketballMatchID + "," + footballMatchID;
      }
      if (basketballMatchID.length) {
        return basketballMatchID;
      }
      if (footballMatchID.length) {
        return footballMatchID;
      }
    }
  },
  {
    label: "开始时间",
    prop: "startAt",
    formatter: row => {
      return (
        (row.startAt &&
          dayjs.unix(row.startAt).format("YYYY-MM-DD HH:mm:ss")) ||
        ""
      );
    }
  },
  {
    label: "结束时间",
    prop: "endAt",
    formatter: row => {
      return (
        (row.endAt && dayjs.unix(row.endAt).format("YYYY-MM-DD HH:mm:ss")) || ""
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
      const res = await delAdvertisement({ ids: [row.id] });
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
    const isChange =
      form.homeTeamName !== "" ||
      form.awayTeamName !== "" ||
      form.eventName !== "" ||
      form.sportsType !== 1 ||
      form.type !== 0;

    const res: any = await getAdvertisementList(params);
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
      const res = await delAdvertisement({ ids: ids });
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
      <el-form-item label="广告推送类型" prop="advertisementType">
        <el-select v-model="form.advertisementType" clearable>
          <el-option label="文字滚动" :value="1" />
          <el-option label="宣传图" :value="2" />
          <el-option label="二维码" :value="3" />
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
            <el-button type="success" link @click="detailsAd(row)">
              查看详情
            </el-button>
            <el-button type="success" link @click="editAd(row)">
              编辑
            </el-button>
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
