<script setup lang="ts">
import { reactive, ref } from "vue";
import { getSmsList } from "../../../api/userManage/smsRecord";
import Pagination from "@/components/Pagination";
import dayjs from "dayjs";
defineOptions({
  name: "UserSmsRecord"
});
const formRef = ref<any>();
const loading = ref<boolean>(false);
const columns = ref<any>([
  { label: "发送时间", prop: "createTime" },
  { label: "用户昵称", prop: "nickname" },
  { label: "手机号码", prop: "phone" },
  { label: "短信内容", prop: "messageContent" },
  { label: "验证码", prop: "verificationCode" },
  { label: "请求ip", prop: "ip" },
  { label: "备注", prop: "remark" }
]);
const time = ref<any>([
  dayjs().format("YYYY-MM-DD 00:00:00"),
  dayjs().format("YYYY-MM-DD 23:59:59")
]);
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const form = reactive({
  nickname: "",
  phone: "",
  remark: "",
  createTimeFrom: "",
  createTimeTo: ""
});

const list = ref<any>();
const pageChange = () => {
  getList();
};
const getList = async () => {
  try {
    loading.value = true;
    if (time.value) {
      form.createTimeFrom = time.value[0];
      form.createTimeTo = time.value[1];
    }
    const params = {
      ...pagination.value,
      ...form
    };
    const res: any = await getSmsList(params);
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
  time.value = [
    dayjs().format("YYYY-MM-DD 00:00:00"),
    dayjs().format("YYYY-MM-DD 23:59:59")
  ];
  getList();
};
</script>

<template>
  <el-card>
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item label="用户昵称" prop="nickname">
        <el-input
          v-model="form.nickname"
          placeholder="请输入用户昵称"
          clearable
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号码" clearable />
      </el-form-item>
      <el-form-item label="发送时间">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 2, 1, 23, 59, 59)
          ]"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="">
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
      </el-table>
    </el-scrollbar>
    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>
  </el-card>
</template>
