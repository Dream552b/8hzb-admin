<script setup lang="ts">
import { reactive, ref } from "vue";
import { getRoleList, delRole } from "../../../api/sys/role";
import Pagination from "@/components/Pagination";
import { Edit, Delete, CirclePlus } from "@element-plus/icons-vue";
import SysRoleEdit from "./components/edit.vue";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "SysRole"
});
const SysRoleEditRef = ref<any>();
const formRef = ref<any>();
const loading = ref<boolean>(false);
const columns = ref<any>([
  { label: "序号", prop: "roleId" },
  { label: "角色名称", prop: "roleName" },
  { label: "角色描述", prop: "remark" },
  { label: "创建时间", prop: "createTime" }
]);
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const form = reactive({
  roleName: ""
});

const list = ref<any>();
const pageChange = () => {
  getList();
};
const getList = async () => {
  try {
    loading.value = true;
    const params = {
      ...pagination.value,
      ...form
    };
    const res: any = await getRoleList(params);
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

const handleAdd = () => {
  SysRoleEditRef.value.open({ mode: "add", id: "0" });
};

const handleEdit = row => {
  SysRoleEditRef.value.open({ mode: "edit", id: row.roleId });
};

const handleDelete = async row => {
  ElMessageBox.confirm("删除后不可恢复，请慎重？", "信息", {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;
      const res = await delRole([row.roleId]);
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
</script>

<template>
  <el-card>
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="">
        <el-button :icon="CirclePlus" type="primary" @click="handleAdd">
          新增角色
        </el-button>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

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
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button
              :icon="Edit"
              color="#0580ff"
              size="small"
              @click="handleEdit(row)"
            >
              权限
            </el-button>
            <el-button
              :icon="Delete"
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>

    <sys-role-edit ref="SysRoleEditRef" @close="getList" />
  </el-card>
</template>
