<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { getRoleList } from "../../../api/sys/role";
import {
  getAccountList,
  delAccount,
  updateAccount
} from "../../../api/sys/account";
import Pagination from "@/components/Pagination";
import { Edit, Delete, CirclePlus } from "@element-plus/icons-vue";
import SysAccountEdit from "./components/edit.vue";
import ModifyPasswd from "./components/modifyPasswd.vue";
import { ElMessage, ElMessageBox } from "element-plus";

defineOptions({
  name: "SysAccount"
});
const SyAccountEditRef = ref<any>();
const ModifyPasswdRef = ref<any>();
const formRef = ref<any>();
const loading = ref<boolean>(false);
const columns = ref<any>([
  { label: "账号", prop: "username" },
  { label: "注册时间", prop: "createTime" },
  { label: "账号角色", prop: "roleName" },
  { label: "最近登录时间", prop: "lastLoginTime" }
]);
const roleOptions = ref<any>();
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const form = reactive({
  roleId: "",
  username: ""
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
    const res: any = await getAccountList(params);
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
  SyAccountEditRef.value.open({ mode: "add" });
};

const handleEdit = row => {
  SyAccountEditRef.value.open({ mode: "edit", row });
};

const handleDelete = async row => {
  ElMessageBox.confirm("确认删除该账号？", "信息", {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;
      const res = await delAccount({ userId: row.userId });
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

const handleModify = async row => {
  ModifyPasswdRef.value.open({ row });
};

const handleResetPassword = async row => {
  ElMessageBox.confirm("是否将用户密码重置为123456?", "信息", {
    type: "warning"
  })
    .then(async () => {
      const res = await updateAccount({ userId: row.userId, password: 123456 });
      if (res.code === 200) {
        ElMessage({
          message: "重置成功",
          type: "success"
        });
      }
    })
    .catch(() => {});

  // getList();
};

onMounted(async () => {
  const res = await getRoleList({ pageNumber: 1000 });
  const { records } = res.data;
  roleOptions.value = records || [];
});
</script>

<template>
  <el-card shadow="never">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="form.roleId" placeholder="请选择" filterable>
          <el-option label="全部" value="" />
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button :icon="CirclePlus" type="primary" @click="handleAdd">
          新增账号
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
          :width="item.width"
        />
        <el-table-column label="操作" align="center" width="400px">
          <template #default="{ row }">
            <el-button
              :icon="Edit"
              color="#0580ff"
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              :icon="Delete"
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
            <el-button
              :icon="Edit"
              color="#0580ff"
              size="small"
              @click="handleModify(row)"
            >
              修改密码
            </el-button>
            <el-button
              :icon="Edit"
              color="#0580ff"
              size="small"
              @click="handleResetPassword(row)"
            >
              重置密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>

    <!-- <sys-account-edit ref="SyAccountEditRef" @close="getList" /> -->
    <sys-account-edit ref="SyAccountEditRef" @close="getList" />
    <ModifyPasswd ref="ModifyPasswdRef" />
  </el-card>
</template>
