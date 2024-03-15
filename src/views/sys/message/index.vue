<script setup lang="ts">
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
// import router from "@/router";
import { reactive } from "vue";
defineOptions({
  name: "ttSysMessage2"
});
const form = reactive({});
const initDetail = () => {
  useMultiTagsStoreHook().handleTags("push", {
    path: `/sys/message/msg`,
    name: "SysMessage",
    query: { type: "msg" },
    meta: {
      title: `消息中心`
    }
  });
};
initDetail();
const getList = () => {};
const resetQuery = () => {};
</script>

<template>
  <el-card shadow="never">
    <el-form :inline="true">
      <el-form-item label="消息内容">
        <el-input v-model="form.phone" placeholder="输入消息内容" clearable />
      </el-form-item>
      <el-form-item label="消息类型">
        <el-input v-model="form.phone" placeholder="输入消息内容" clearable />
      </el-form-item>
      <el-form-item label="消息状态">
        <el-input v-model="form.phone" placeholder="输入消息内容" clearable />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-row>
        <el-form-item label="">
          <el-button type="primary" @click="getList">创建</el-button>
          <el-button @click="resetQuery">删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-card>
</template>
