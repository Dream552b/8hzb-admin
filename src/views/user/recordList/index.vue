<script setup lang="ts">
import router from "@/router";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { isEmpty } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import LoginRecord from "./components/loginRecord.vue";
import authRecord from "./components/authRecord.vue";
defineOptions({
  name: "RecordList"
});
const route = useRoute();
const form = ref<any>({});
const tabsArr = ref<any[]>([
  {
    title: "登录记录",
    component: LoginRecord
  }

  // {
  //   title: "金块流水",
  //   component: ""
  // },
  // {
  //   title: "经验流水",
  //   component: ""
  // },
  // {
  //   title: "认证记录",
  //   component: authRecord
  // },
  // {
  //   title: "禁言记录",
  //   component: ""
  // },
  // {
  //   title: "禁图记录",
  //   component: ""
  // },
  // {
  //   title: "预言活动流水",
  //   component: ""
  // }
]);
const initDetail = () => {
  if (isEmpty(route.query)) {
    return;
  }
  const { id, nickname } = route.query;
  useMultiTagsStoreHook().handleTags("push", {
    path: `/user/user-list/record-list`,
    name: "UserRecordList",
    query: { id, nickname },
    meta: {
      title: `记录列表: ${nickname}`,
      keepAlive: true
    }
  });
  router.push({ name: "UserRecordList", query: { id, nickname } });
};
initDetail();
onMounted(() => {
  const { id, nickname } = route.query;
  form.value.id = id;
  form.value.nickname = nickname;
});
</script>

<template>
  <el-card>
    <el-form inline>
      <el-form-item label="用户ID">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="form.nickname" disabled
      /></el-form-item>
    </el-form>

    <el-tabs type="border-card">
      <el-tab-pane
        :label="item.title"
        v-for="(item, index) in tabsArr"
        :key="index"
        ><component :is="item.component" v-if="item.component"
      /></el-tab-pane>
    </el-tabs>
  </el-card>
</template>
