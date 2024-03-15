<script setup lang="ts">
import { reactive, ref } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { getListChatAdvert, delChatAdvert } from "@/api/advert/chatadvert";
import Edit from "./components/edit.vue";
import { ElMessageBox } from "element-plus";

defineOptions({
  name: "Chatadvert"
});
const formRef = ref();
const editRef = ref();
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const form = reactive({
  matchID: "",
  matchType: 0
});
const timeMap = {
  1: "5分钟",
  2: "10分钟",
  3: "20分钟",
  4: "30分钟"
};
const list = ref<any>();
const columns = ref<any>([
  {
    label: "广告标题",
    prop: "title"
  },
  {
    label: "广告内容",
    prop: "content",
    width: 220
  },
  {
    label: "广告二维码",
    prop: "pic",
    width: 180
  },
  {
    label: "H5下载地址",
    prop: "h5DownloadUrl",
    width: 200
  },
  {
    label: "PC下载地址",
    prop: "pcDownloadUrl",
    width: 200
  },
  {
    label: "iOS下载地址",
    prop: "iosDownloadUrl",
    width: 200
  },
  {
    label: "定时发送间隔时间",
    prop: "time",
    formatter: row => {
      return timeMap[row.time];
    }
  },
  {
    label: "赛事类型",
    prop: "matchType",
    formatter: row => {
      if (row.sportsType == 1) return "足球";
      if (row.sportsType == 2) return "篮球";
    }
  },
  {
    label: "比赛ID",
    prop: "matchID"
  },
  {
    label: "是否自动发送",
    prop: "automatic",
    formatter: row => {
      if (row.automatic == 1) return "自动";
      if (row.automatic == 2) return "不自动";
    }
  }
]);
const loading = ref<boolean>(false);
const getList = async () => {
  try {
    loading.value = true;
    const params = {
      pageSize: pagination.value.pageSize,
      pageNum: pagination.value.pageNum,
      ...form,
      _: new Date().getTime()
    };
    const res: any = await getListChatAdvert(params);
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

const search = () => {
  pagination.value.pageNum = 1;
  getList();
};

const reset = () => {
  formRef.value.resetFields();
  pagination.value.pageNum = 1;
  getList();
};

const editRow = row => {
  editRef.value.open({ mode: "edit", row });
};

const delRow = row => {
  ElMessageBox.confirm("确定要删除吗？", "信息", {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;
      await delChatAdvert({ id: row.id });
      loading.value = false;
      getList();
    })
    .catch(() => {});
};

const editClose = () => {
  reset();
};

const addContent = () => {
  editRef.value.open({ mode: "add" });
};
</script>

<template>
  <el-card shadow="never">
    <el-form ref="formRef" :model="form" inline>
      <el-form-item label="比赛ID" prop="matchID">
        <el-input v-model="form.matchID" placeholder="请输入比赛ID" />
      </el-form-item>
      <el-form-item label="赛事类型" prop="matchType">
        <el-select v-model="form.sportsType">
          <el-option label="全部" :value="0" />
          <el-option label="足球" :value="1" />
          <el-option label="篮球" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="search">查询</el-button>
        <el-button type="success" @click="reset">重置</el-button>
        <el-button type="success" @click="addContent">新增</el-button>
      </el-form-item>
    </el-form>

    <el-scrollbar v-loading="loading">
      <el-table style="width: 100%" border :data="list">
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column
          :width="item.width || 120"
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :formatter="item.formatter"
        >
          <template #default="{ row }" v-if="item.prop === 'pic'">
            <el-image :src="row.pic" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column
          label="设置"
          align="center"
          min-width="120"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button type="success" link @click="editRow(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="delRow(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>

    <edit ref="editRef" @close="editClose" />
  </el-card>
</template>
