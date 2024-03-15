<script setup lang="ts">
import { ElMessage } from "element-plus";
import { getRoleList } from "../../../../api/sys/role";
import { reactive, ref } from "vue";
import { saveAccount, updateAccount } from "@/api/sys/account";
// interface RuleForm {
//   role: any;
//   menuIds: string;
// }
defineOptions({
  name: "SysAccountDialog"
});
const emits = defineEmits(["close"]);
const form = ref<any>({
  username: "",
  roleId: "",
  password: ""
});
const loading = ref<boolean>(false);
const dialogMode = ref<string>("add");
const dialogVisible = ref<boolean>(false);
const roleOptions = ref<any>();
const rules = reactive<any>({
  username: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
  roleId: [{ required: true, message: "请输入账号角色", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});
const formRef = ref<any>();
const saveForm = async () => {
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      const params = {
        ...form.value
      };
      const res =
        dialogMode.value === "add"
          ? await saveAccount(params)
          : await updateAccount(params);
      if (res.code === 200) {
        ElMessage({
          message: "保存成功",
          type: "success"
        });
      }
      dialogVisible.value = false;
      emits("close");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const open = async ({ mode = "add", row }) => {
  dialogVisible.value = true;
  dialogMode.value = mode;
  loading.value = true;
  const res = await getRoleList({ pageNumber: 1000 });
  const { records } = res.data;
  roleOptions.value = records || [];
  if (mode === "edit") {
    form.value.username = row.username;
    form.value.roleId = Number(row.roleId);
    form.value.userId = row.userId;
  }
  if (mode === "add") {
    form.value.username = "";
    form.value.roleId = "";
    form.value.password = "";
  }
  loading.value = false;
};

defineExpose({
  open
});
</script>
<template>
  <el-dialog
    :title="dialogMode === 'add' ? '新增用户' : '编辑用户'"
    v-model="dialogVisible"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="用户账号" prop="username">
        <el-input placeholder="请输入称" v-model="form.username" />
      </el-form-item>
      <el-form-item label="账号角色" prop="roleId">
        <el-select v-model="form.roleId" placeholder="请选择" filterable>
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="账号密码"
        prop="password"
        v-if="dialogMode === 'add'"
      >
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入账号密码"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" :loading="loading"
          >取消</el-button
        >
        <el-button type="primary" @click="saveForm" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
