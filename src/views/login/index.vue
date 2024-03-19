<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, illustration, logo } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import SafetyOutlined from "@iconify-icons/ant-design/safety-outlined";

import { getCaptchaImage } from "@/api/index";

defineOptions({
  name: "Login"
});
const router = useRouter();
const loading = ref(false);
const codeImg = ref("");
const loadingImg = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();
const { title } = useNav();

const ruleForm = reactive({
  username: "admin",
  password: "123456",
  code: "",
  requestID: ""
});

const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      useUserStoreHook()
        .loginByUsername({
          username: ruleForm.username,
          password: ruleForm.password,
          code: ruleForm.code,
          requestID: ruleForm.requestID
        })
        .then((res: any) => {
          if (res.code === 200) {
            // 获取后端路由
            router.push("/");
            initRouter().then(() => {
              //   router.push(getTopMenu(true).path);
              message("登录成功", { type: "success" });
            });
          } else {
            message(res.data, { type: "error" });
            loading.value = false;
            generateCodeImg();
          }
        })
        .catch(err => {
          console.log("err:", err);
          message(err.data, { type: "error" });
          loading.value = false;
          generateCodeImg();
        });
    } else {
      loading.value = false;
      return fields;
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(ruleFormRef.value);
  }
}

const generateCodeImg = async () => {
  loadingImg.value = true;
  // const img = `/api/verifyCode?${parseInt(Math.random() * 100000000)}`;
  // const img = `/admin/v2/adminUser/captchaImage?${parseInt(
  // Math.random() * 100000000;
  // )}`;

  let res: { data: any; code: number } = await getCaptchaImage({});
  if (res.code !== 200) return;
  loadingImg.value = false;

  codeImg.value = res.data.base64;
  ruleForm.requestID = res.data.requestID;
};

const imgLoaded = () => {
  loadingImg.value = false;
};

onMounted(() => {
  generateCodeImg();
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <!-- <avatar class="avatar" /> -->
          <div style="display: flex; justify-content: center">
            <img :src="logo" class="logo" />
          </div>
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  clearable
                  v-model="ruleForm.username"
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  clearable
                  show-password
                  v-model="ruleForm.password"
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="code">
                <el-input
                  clearable
                  v-model="ruleForm.code"
                  placeholder="验证码"
                  :prefix-icon="useRenderIcon(SafetyOutlined)"
                  @keydown.enter="onLogin(ruleFormRef)"
                >
                  <template #append>
                    <div
                      style="display: flex; align-items: center; padding: 0 5px"
                      v-loading="loadingImg"
                    >
                      <el-image
                        style="width: 120px; height: 30px"
                        :src="codeImg"
                        @click="generateCodeImg"
                        @load="imgLoaded"
                      />
                    </div>
                  </template>
                </el-input>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

:deep(.el-loading-spinner .circular) {
  height: 30px;
}

:deep(.el-loading-spinner) {
  margin-top: calc((0px - 32px) / 2);
}

:deep(.el-loading-mask) {
  margin: 0 6px;
}
</style>
