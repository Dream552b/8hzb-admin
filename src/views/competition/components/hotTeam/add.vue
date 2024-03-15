<script setup lang="ts">
import { reactive, ref } from "vue";
import { getHotTeamList, addHotTeam } from "@/api/competition/hotTeam";
import Pagination from "@/components/Pagination";
import { ElMessage } from "element-plus";

defineOptions({
  name: "AddHotTeam"
});
const emits = defineEmits(["close"]);
const formRef = ref();
const form = reactive({
  eventType: "1",
  teamName: "",
  matchEventName: "",
  authStatus: 1
});
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const list = ref<any>();
const loading = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);

const columns = ref<any>([
  { label: "联赛", prop: "id" },
  { label: "联赛名称", prop: "matchEventName" },
  {
    label: "队伍名称",
    prop: "name_zh"
  },
  {
    label: "队伍简称",
    prop: "short_name_zh"
  },
  {
    label: "是否热门",
    prop: "isHot"
  }
]);

const getList = async () => {
  loading.value = true;
  const params = {
    ...pagination.value,
    ...form
  };
  const res = await getHotTeamList(params);
  if (res.data) {
    list.value = res.data.records;
    pagination.value.total = res.data.total;
  } else {
    list.value = [];
    pagination.value.total = 0;
  }

  loading.value = false;
};

const open = () => {
  dialogVisible.value = true;
  form.eventType = "1";
  form.teamName = "";
  form.matchEventName = "";
  getList();
};

const addHot = async row => {
  loading.value = true;
  const res = await addHotTeam({
    isHot: 1,
    eventId: row.competition_id,
    nameZh: row.short_name_zh || row.name_zh,
    eventType: form.eventType,
    teamId: row?.id,
    logo: row.logo
  });
  if (res.code === 200) {
    row.isHot = 1;
    ElMessage({
      message: "设置成功",
      type: "success"
    });
  }
  loading.value = false;
};

const dialogClosed = () => {
  emits("close");
};

const eventTypeChange = () => {
  form.teamName = "";
  form.matchEventName = "";
  getList();
};

defineExpose({ open });
</script>

<template>
  <el-dialog
    title="新增热门球队"
    v-model="dialogVisible"
    width="75%"
    @closed="dialogClosed"
  >
    <el-form ref="formRef" inline :model="form" v-if="dialogVisible">
      <el-form-item label="球类" prop="eventType">
        <el-select v-model="form.eventType" @change="eventTypeChange">
          <el-option label="足球" value="1" />
          <el-option label="篮球" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="队伍名称" prop="teamName">
        <el-input
          v-model="form.teamName"
          placeholder="请输入队伍名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="联赛名称" prop="matchEventName">
        <el-input
          v-model="form.matchEventName"
          placeholder="请输入联赛名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="list" v-loading="loading">
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

      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-link v-if="row.isHot == 1" size="small" :underline="false">
            已设置热门
          </el-link>
          <el-button v-else type="primary" size="small" @click="addHot(row)"
            >设置热门</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="getList" />
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
  </el-dialog>
</template>
