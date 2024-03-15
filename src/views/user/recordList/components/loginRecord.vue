<script setup lang="ts">
import { ref } from "vue";
import { getLoginLogs } from "../../../../api/userManage/list";
import Pagination from "@/components/Pagination";
import { useRoute } from "vue-router";
defineOptions({
  name: "LoginRecord"
});
const route = useRoute();
const loading = ref<boolean>(false);
const columns = ref<any>([
  { label: "登录时间", prop: "createdAt" },
  { label: "登录IP", prop: "ip" }
  // { label: "登录端", prop: "ssystem" },
  // { label: "登录IMEI", prop: "imei" }
]);
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});

const list = ref<any>();
const pageChange = () => {
  getList();
};
const getList = async () => {
  const { id } = route.query;
  try {
    loading.value = true;
    const params = {
      ...pagination.value,
      userID: id
    };
    const res: any = await getLoginLogs(params);
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
</script>

<template>
  <div>
    <el-scrollbar v-loading="loading">
      <el-table ref="tableRef" class="table" border :data="list">
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :formatter="item.formatter"
        />
      </el-table>
    </el-scrollbar>
    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>
  </div>
</template>
