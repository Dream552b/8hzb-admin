<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { saveModifyPassword } from "@/api/sys/account";

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入新密码"));
  } else if (value !== form.value.newPassword) {
    callback(new Error("两次密码出入不一致"));
  } else {
    callback();
  }
};
defineOptions({
  name: "SysAccountModifyPasswd"
});
const loading = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);
const formRef = ref<any>();
const rules = reactive<any>({
  oldPassword: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入账号角色", trigger: "blur" }],
  truePassword: [
    {
      required: true,
      validator: validatePass,
      trigger: "blur"
    }
  ]
});
const form = ref({
  oldPassword: "",
  newPassword: "",
  truePassword: "",
  userId: ""
});

const saveForm = async () => {
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      const params = {
        ...form.value
      };
      const res = await saveModifyPassword(params);
      if (res.code === 200) {
        ElMessage({
          message: "保存成功",
          type: "success"
        });
      }
      if (res.code === 400) {
        ElMessage({
          message: res.message,
          type: "warning"
        });
      }
      dialogVisible.value = false;
      loading.value = false;
      // emits("close");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const open = async ({ row }) => {
  dialogVisible.value = true;
  form.value.userId = row.userId;
};

const dialogClosed = () => {
  formRef.value.resetFields();
};

defineExpose({
  open
});
</script>

<template>
  <el-dialog
    title="修改密码"
    v-model="dialogVisible"
    destroy-on-close
    width="35%"
    @close="dialogClosed"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          v-model="form.oldPassword"
          placeholder="请输入原密码"
          clearable
          type="password"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          placeholder="请输入新密码"
          clearable
          type="password"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="truePassword">
        <el-input
          v-model="form.truePassword"
          placeholder="请再次输入新密码"
          clearable
          type="password"
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
