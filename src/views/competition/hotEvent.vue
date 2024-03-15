<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  getHotEventList,
  hotEventeUp,
  cancelHotEvent
} from "../../api/competition/hotEvent";
import Pagination from "@/components/Pagination";
import { Delete } from "@element-plus/icons-vue";
import SelectEventDialog from "./components/hotEvent/add.vue";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox } from "element-plus";
import edit from "./components/hotEvent/edit.vue";

defineOptions({
  name: "HotEvent"
});
const editRef = ref<any>(null);
const SelectEventDialogRef = ref<any>();
const multipleSelection = ref([]);
const formRef = ref<any>();
const loading = ref<boolean>(false);
const columns = ref<any>([
  { label: "赛事id", prop: "competitionID" },
  { label: "排序", prop: "sort" },
  {
    label: "联赛名称",
    prop: "shortNameZh"
  },
  {
    label: "联赛类型",
    prop: "sportsType",
    formatter: row => {
      if (row.sportsType === 1) return "足球";
      return "篮球";
    }
  }
  // {
  //   label: "创建时间",
  //   prop: "createTime",
  //   formatter: (row, col, val) => {
  //     return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
  //   }
  // }
]);
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const form = reactive({
  sportsType: 0
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
    const res: any = await getHotEventList(params);

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
  await hotEventeUp({ id: row.id, type });
  loading.value = false;
  getList();
};

const cancelHot = async row => {
  ElMessageBox.confirm("确认取消热门赛事吗？", "信息", {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;
      let { code } = await cancelHotEvent({ ids: [row.id] });
      loading.value = false;
      if (code !== 200) return;
      ElMessage({
        message: "取消成功",
        type: "success"
      });

      getList();
    })
    .catch(() => {});
};

const add = () => {
  SelectEventDialogRef.value.open();
};

const batchCancel = async () => {
  if (multipleSelection.value.length === 0) {
    return ElMessage({
      message: "请勾选数据",
      type: "warning"
    });
  }
  ElMessageBox.confirm("是否批量取消热门赛事，请慎重", "信息", {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;

      let ids = [];
      multipleSelection.value.map(item => {
        ids.push(item.id);
      });

      let { code } = await cancelHotEvent({
        ids: ids
      });
      loading.value = false;
      if (code !== 200) return;
      ElMessage({
        message: "取消成功",
        type: "success"
      });
      getList();
    })
    .catch(() => {});
};

const handleSelectionChange = val => {
  multipleSelection.value = val;
};

const saveRow = ref(null);

const handleSort = row => {
  saveRow.value = row;

  editRef.value.open(row.sort);
};

const updataHot = async sort => {
  let row = saveRow.value;
  loading.value = true;
  const res = await hotEventeUp({
    id: row.id,
    sort: +sort
  });
  if (res.code === 200) {
    row.isHot = 1;
    ElMessage({
      message: "保存成功",
      type: "success"
    });
    getList();
  }

  loading.value = false;
};
</script>

<template>
  <el-card>
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item label="球类" prop="sportsType">
        <el-select v-model="form.sportsType" @change="getList">
          <el-option label="全部" :value="0" />
          <el-option label="足球" :value="1" />
          <el-option label="篮球" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="联赛名称" prop="competitionName">
        <el-input
          v-model="form.competitionName"
          placeholder="请输入"
          clearable
        />
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" @click="add">新增</el-button>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form>
        <el-form-item>
          <el-button :icon="Delete" type="danger" @click="batchCancel">
            批量取消
          </el-button>
        </el-form-item>
      </el-form>
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
            <!-- <el-link
              type="primary"
              :underline="false"
              @click="handleMoveUp(row, 1)"
            >
              上移
            </el-link>

            <el-divider direction="vertical" />
            <el-link
              type="primary"
              :underline="false"
              @click="handleMoveUp(row, 2)"
            >
              下移
            </el-link>
            <el-divider direction="vertical" />
            <el-link
              type="primary"
              :underline="false"
              @click="handleMoveUp(row, 3)"
            >
              置顶
            </el-link>
            <el-divider direction="vertical" />
            <el-link
              type="primary"
              :underline="false"
              @click="handleMoveUp(row, 4)"
            >
              置底
            </el-link>
            <el-divider direction="vertical" /> -->
            <el-link
              type="primary"
              :underline="false"
              @click="handleSort(row, 4)"
            >
              修改排序
            </el-link>
            <el-divider direction="vertical" />
            <el-link type="danger" :underline="false" @click="cancelHot(row)">
              取消热门
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>

    <select-event-dialog ref="SelectEventDialogRef" @close="getList" />

    <edit ref="editRef" @addHot="updataHot" />
  </el-card>
</template>
