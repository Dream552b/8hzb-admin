<script setup lang="ts">
import { reactive, ref } from "vue";
import { getEventList, addHotEvent } from "@/api/competition/hotEvent";
import Pagination from "@/components/Pagination";
import { ElMessage } from "element-plus";
import edit from "./edit.vue";

defineOptions({
  name: "AddHotEvent"
});
const emits = defineEmits(["close"]);
const editRef = ref(null);
const form = reactive({
  sportsType: 1,
  competitionName: ""
});
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const list = ref<any>();
const list2 = ref<any>();
const loading = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);

const columns = ref<any>([
  { label: "联赛", prop: "id" },
  { label: "赛事全称", prop: "nameZh" },
  {
    label: "赛事简称",
    prop: "shortNameZh"
  },
  {
    label: "是否热门",
    prop: "isHot"
  }
]);

const getList = async () => {
  loading.value = true;
  const params = {
    page: pagination.value.pageNum,
    limit: pagination.value.pageSize,
    ...form
  };
  const res: any = await getEventList(params);

  const {
    data: { records, total }
  } = res;
  list2.value = records || [];

  pagination.value.total = total;

  loading.value = false;
  // manualPage();
};

const manualPage = () => {
  const page = pagination.value.pageNum;
  const size = pagination.value.pageSize;
  // list2.value = list.value.slice((page - 1) * size, page * size);
  // list2.value = list.value;
  getList();
};

const open = () => {
  dialogVisible.value = true;
  getList();
};

const search = () => {
  pagination.value.pageNum = 1;
  const page = 1;
  const size = pagination.value.pageSize;
  const keyword = form.competitionName;

  getList();
  return;
  if (list.value.length) {
    const filterArr = list.value.filter(
      item =>
        item.nameZh.indexOf(keyword) > -1 ||
        item.shortNameZh.indexOf(keyword) > -1
    );
    list2.value = filterArr.slice((page - 1) * size, page * size);
    pagination.value.total = filterArr.length;
  }
};

const pageChange = () => {
  manualPage();
};

const saveRow = ref(null);
const setHot = row => {
  saveRow.value = row;
  editRef.value.open();
};

const addHot = async sort => {
  let row = saveRow.value;
  loading.value = true;
  const res = await addHotEvent({
    sportsType: row.sportsType,
    competitionID: row.id,
    sort: +sort
  });
  if (res.code === 200) {
    row.isHot = 1;
    ElMessage({
      message: "保存成功",
      type: "success"
    });
  }

  loading.value = false;
};

const dialogClosed = () => {
  emits("close");
};

defineExpose({ open });
</script>

<template>
  <el-dialog
    title="新增直播"
    v-model="dialogVisible"
    width="75%"
    @closed="dialogClosed"
  >
    <el-form inline :model="form">
      <el-form-item label="比赛类型">
        <el-select v-model="form.sportsType" @change="getList">
          <el-option label="足球" :value="1" />
          <el-option label="篮球" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="赛事名称">
        <el-input
          v-model="form.competitionName"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="list2" v-loading="loading">
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        align="center"
        :formatter="item.formatter"
        :show-overflow-tooltip="item['show-overflow-tooltip']"
      >
        <template #default="{ row }" v-if="item.prop === 'isHot'">
          <span v-if="row.isHot == 1" style="color: red">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="280px">
        <template #default="{ row }">
          <el-link v-if="row.isHot == 1" size="small" :underline="false">
            已设置热门
          </el-link>
          <el-button v-else type="primary" size="small" @click="setHot(row)"
            >设置热门</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogVisible = false"
          :loading="loading"
          >关闭</el-button
        >
      </span>
    </template>

    <edit ref="editRef" @addHot="addHot" />
  </el-dialog>
</template>
