<script setup lang="ts">
import { ref } from "vue";
import { getAuthLogs } from "../../../../api/userManage/list";
import Pagination from "@/components/Pagination";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
defineOptions({
  name: "UserAuthRecord"
});
const route = useRoute();
const loading = ref<boolean>(false);
const columns = ref<any>([
  { label: "登录时间", prop: "createTime" },
  { label: "姓名", prop: "realName" },
  { label: "身份证号", prop: "idNo" },
  { label: "正面照片", prop: "frontPhoto", type: "img" },
  { label: "背面照片", prop: "versoPhoto", type: "img" },
  { label: "手持照片", prop: "handPhoto", type: "img" },
  {
    label: "审核状态",
    prop: "authStatus",
    formatter: (row, col, val) => {
      const statusMap = {
        0: "未认证",
        1: "待审核",
        2: "审核成功",
        3: "审核驳回"
      };
      return statusMap[val];
    }
  }
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
      userId: id
    };
    const res: any = await getAuthLogs(params);
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
        >
          <template #default="{ row }" v-if="item.type === 'img'">
            <el-image :src="row[item.prop]">
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>
  </div>
</template>
