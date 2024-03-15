<script setup lang="ts">
import { ElMessage, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { addUser } from "@/api/userManage/list";
interface RuleForm {
  nickname: string;
  sex: number;
  phone: string;
  password: string;
}
defineOptions({
  name: "AddUserDialog"
});
const emits = defineEmits(["close"]);
const form = ref<any>({
  sex: 0,
  nickname: "",
  phone: "",
  password: ""
});
const formRef = ref<any>();
const loading = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);
const rules = reactive<FormRules<RuleForm>>({
  nickname: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
  password: [{ required: true, message: "请输入账号密码", trigger: "blur" }]
});
const saveForm = async () => {
  try {
    loading.value = true;

    console.log("form.value.sex", typeof form.value.sex);

    const params = {
      ...form.value
    };
    const res = await addUser(params);
    if (res.code === 200) {
      ElMessage({
        message: "保存成功",
        type: "success"
      });
    }
    dialogVisible.value = false;
    emits("close");
  } catch (err) {
    console.log("err:", err);
  } finally {
    loading.value = false;
  }
};

const opended = () => {
  // console.log("jinl");
  // form.value = {
  //   sex: 0
  // };
};

const open = () => {
  dialogVisible.value = true;
  form.value = {
    sex: 0,
    nickname: "",
    phone: "",
    password: ""
  };
};
defineExpose({
  open
});
</script>
<template>
  <el-dialog
    title="新增用户"
    v-model="dialogVisible"
    destroy-on-close
    @opened="opended"
  >
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-form-item label="用户昵称" prop="nickname">
        <el-input placeholder="请输入用户昵称" v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
          <el-radio :label="2">未知</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input placeholder="请输入用户昵称" v-model="form.phone" />
      </el-form-item>
      <el-form-item label="账号密码" prop="password">
        <el-input
          type="password"
          placeholder="请输入用户昵称"
          v-model="form.password"
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
