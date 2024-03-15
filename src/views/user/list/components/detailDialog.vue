<script setup lang="ts">
import { Plus, Edit } from "@element-plus/icons-vue";
import defaultUserImg from "@/assets/user/default_user_image.png";
import { getToken } from "@/utils/token";
import ImageUpload from "@/components/ImageUpload/index.vue";

import {
  getUserById,
  setUserAccountStatus,
  resetPassword,
  updateUserInfo
} from "@/api/userManage/list";
import { defineOptions, defineEmits, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { nextTick } from "vue";
defineOptions({
  name: "UserDetailDialog"
});
const loading = ref(false);
const emits = defineEmits(["close"]);
// const props = defineProps({
//   userInfo: {
//     type: Object
//   },
//   show: {
//     type: Boolean
//   }
// });
const dialogVisible = ref(false);
const dialogVisible2 = ref(false);
// watch(
//   () => props.userInfo,
//   val => {
//     form.value = val;
//   }
// );
// const dialogVisible = computed({
//   get() {
//     return props.show;
//   },
//   set(val) {
//     emits("update:show", val);
//   }
// });
const form = ref<any>({
  username: "admin"
});

const form2 = ref<any>({
  userStatus: 1,
  remark: ""
});

const open = async row => {
  dialogVisible.value = true;
  getUserInfo(row.id);
};

const getUserInfo = async id => {
  loading.value = true;
  const res: any = await getUserById({ userID: id });
  const data = res.data;

  console.log("data", data);

  form.value = {
    ...data

    // bannedMeme: data.bannedMeme,
    // bannedPost: data.bannedPost,
    // userStatusText:
    //   (new Date(data?.tAppUser?.bannedTime)?.getTime() || 0) >
    //   new Date().getTime()
    //     ? "封号"
    //     : "正常"
  };
  loading.value = false;
};

const handleAvatarSuccess = response => {
  form.value.headerImg = response.data;
};

const handleSwitch = (): Promise<boolean> => {
  const isTrue = form.value.isExpert === 1;
  return new Promise(resolve => {
    ElMessageBox.confirm(
      `${isTrue ? "是否取消专家身份?" : "是否设置为专家?"}`,
      "信息",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
      .then(() => {
        console.log("确认了");
        resolve(true);
      })
      .catch(() => {
        console.log("取消了");
        resolve(false);
      });
  });
};

const editUserStatus = () => {
  dialogVisible2.value = true;
  nextTick(() => {
    const status = form.value.userStatus == 1 ? 0 : 1;
    form2.value.userStatus = status;
    form2.value.remark = "";
  });
};

const resetPassWd = async () => {
  ElMessageBox.confirm("是否将用户密码重置为123456?", "信息", {
    type: "warning"
  })
    .then(async () => {
      const res = await resetPassword(JSON.stringify(form.value.id));
      if (res.code === 200) {
        ElMessage({
          message: "修改成功",
          type: "success"
        });
      }
    })
    .catch(() => {});
};

const saveForm = async () => {
  loading.value = true;
  const params = {
    headerImg: form.value.headerImg,
    nickname: form.value.nickname,
    sex: form.value.sex,
    authenStatus: form.value.authenStatus,
    roleID: form.value.roleID,
    userStatus: form.value.userStatus,
    userID: form.value.id || undefined
  };
  const res = await updateUserInfo(params);
  if (res.code === 200) {
    ElMessage({
      message: "保存成功",
      type: "success"
    });
  }
  loading.value = false;
  dialogVisible.value = false;
  emits("close");
};

const saveForm2 = async () => {
  loading.value = true;
  const params = {
    ...form2.value,
    id: form.value.id
  };
  const res = await setUserAccountStatus(params);
  if (res.code === 200) {
    ElMessage({
      message: "修改成功",
      type: "success"
    });
  }
  loading.value = false;
  dialogVisible2.value = false;
  getUserInfo(form.value.id);
};

defineExpose({
  open
});
</script>

<template>
  <el-dialog
    class="user-detail-dialog"
    v-model="dialogVisible"
    title="用户详情"
  >
    <el-form :model="form" label-width="100px" v-loading="loading">
      <el-form-item label="用户ID" prop="id">
        <el-input
          v-model="form.id"
          placeholder="请输入用户名"
          disabled
          style="width: 200px"
        />
      </el-form-item>

      <el-form-item label="用户头像" prop="headerImg">
        <div>
          <ImageUpload v-model="form.headerImg" :limit="1" />
        </div>
      </el-form-item>

      <el-form-item label="用户昵称" prop="nickname">
        <el-input
          v-model="form.nickname"
          placeholder="请输入用户名"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="用户性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
          <el-radio :label="2">未知</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入用户名"
          disabled
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="账号密码" prop="resetPwd">
        <el-button type="primary" @click="resetPassWd">重置密码</el-button>
      </el-form-item>

      <el-form-item label="账户类型" prop="roleID">
        <el-select v-model="form.roleID">
          <el-option label="游客" :value="1" />
          <el-option label="普通用户" :value="8" />
          <el-option label="超管用户" :value="16" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态" prop="userStatus">
        <el-select v-model="form.userStatus">
          <el-option label="禁言" :value="1" />
          <el-option label="正常" :value="0" />
        </el-select>
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

  <el-dialog title="用户状态" v-model="dialogVisible2" width="40%">
    <el-form
      ref="Form2"
      :model="form2"
      label-width="100px"
      v-if="dialogVisible2"
    >
      <el-form-item label="操作类型" prop="userStatus">
        <el-radio-group v-model="form2.userStatus">
          <el-radio v-if="form.userStatus === 1" :label="0">解封</el-radio>
          <el-radio v-if="form.userStatus === 0" :label="1">封号</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="理由">
        <el-input
          v-model="form2.remark"
          :rows="4"
          type="textarea"
          placeholder="请输入理由"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible2 = false" :loading="loading"
          >取消</el-button
        >
        <el-button type="primary" @click="saveForm2" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.user-detail-dialog {
  color: #fff;
}
</style>
