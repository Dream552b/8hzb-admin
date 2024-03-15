<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getUserList, updateUserNickname } from "../../../api/userManage/list";
import { Edit } from "@element-plus/icons-vue";
import defaultUserImg from "@/assets/user/default_user_image.png";
import { nextTick } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import DetailDialog from "./components/detailDialog.vue";
import AddDialog from "./components/addDialog.vue";
import router from "@/router";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { ElInput, ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "UserList"
});
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const detailDialogRef = ref();
const addDialogRef = ref();
const tableRef = ref();
const loading = ref<boolean>(false);
const list = ref<any>([]);
const columns = ref<any>([
  {
    label: "用户ID",
    title: "用户ID",
    prop: "id"
  },
  {
    label: "上次登录端",
    title: "上次登录端",
    prop: "os"
  },
  {
    label: "用户头像",
    prop: "headerImg",
    avatar: true
  },
  {
    label: "用户昵称",
    prop: "nickname"
  },
  {
    label: "账号类型",
    prop: "roleID",
    formatter: (row, col, value) => {
      if (value === 1) return "游客";
      if (value === 8) return "普通用户";
      if (value === 16) return "超管用户";
    }
  },
  {
    label: "手机号码",
    prop: "phone"
    // formatter: (row, col, value) => {
    //   return value.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    // }
  },
  {
    label: "兑换记录",
    prop: "sex"
  },
  {
    label: "注册时间",
    prop: "createTime"
  },

  {
    label: "用户状态",
    prop: "userStatus",
    formatter: (row, col, value) => {
      if (value === 1) {
        return "主播禁言";
      }
      if (value === 2) {
        return "平台禁言";
      }
      return "正常";
    }
  }
]);
const form: any = ref({
  phone: "",
  userStatus: -1
});

const getList = async () => {
  try {
    loading.value = true;
    const params = {
      page: pagination.value.pageNum,
      limit: pagination.value.pageSize,
      userStatus:
        (form.value.userStatus + "").length == 0 ? -1 : form.value.userStatus,
      phone: form.value.phone,
      nickname: form.value.nickname
    };
    const res: any = await getUserList(params);
    const {
      data: { records, total }
    } = res;
    // pagination.value.pageNum = current;
    // pagination.value.pageSize = size;
    pagination.value.total = total;
    list.value = records || [];
    nextTick(() => {
      tableRef.value.doLayout();
    });
  } catch (err) {
    console.log("err:", err);
  } finally {
    loading.value = false;
  }
};

const pageChange = () => {
  getList();
};

const openDetail = row => {
  detailDialogRef.value.open(row);
};

const detailDialogClose = () => {
  getList();
};

const goRecordList = row => {
  // router.push("/user/record-list");
  const parameter = {
    id: row.id.toString(),
    nickname: row.nickname
  };
  useMultiTagsStoreHook().handleTags("push", {
    path: `/user/user-list/record-list`,
    name: "UserRecordList",
    query: parameter,
    meta: {
      title: `记录列表: ${parameter.nickname}`,
      keepAlive: true
    }
  });
  router.push({ name: "UserRecordList", query: parameter });
};

const modifyNickname = row => {
  ElMessageBox.prompt("用户昵称", "用户昵称", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /.+/,
    inputValue: row.nickname,
    inputErrorMessage: "请输入用户昵称"
  })
    .then(async ({ value }) => {
      loading.value;
      const res: any = await updateUserNickname({
        userID: +row.id,
        nickname: value
      });
      loading.value;

      if (res.code !== 200)
        return ElMessage({
          message: res.message,
          type: "error"
        });

      if (res.code === 200) {
        ElMessage({
          message: "修改成功",
          type: "success"
        });
      }

      getList();
    })
    .catch(() => {});
};

const resetQuery = () => {
  form.value = {
    userStatus: -1
  };
  pagination.value.pageNum = 1;
  pagination.value.pageSize = 10;
  pagination.value.total = 0;
  getList();
};

const addUser = () => {
  addDialogRef.value.open();
};

onMounted(() => {
  getList();
});
</script>

<template>
  <el-card shadow="never">
    <el-form :inline="true">
      <el-form-item label="用户名称">
        <el-input v-model="form.nickname" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.phone" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="用户状态" prop="userStatus">
        <el-select v-model="form.userStatus" clearable>
          <el-option label="全部" :value="-1" />
          <el-option label="禁言" :value="1" />
          <el-option label="正常" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="账户类型" prop="roleID">
        <el-select v-model="form.roleID" clearable>
          <el-option label="游客" :value="1" />
          <el-option label="普通用户" :value="8" />
          <el-option label="超管用户" :value="16" />
        </el-select>
      </el-form-item>

      <el-form-item label="">
        <el-button @click="addUser">新增用户</el-button>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-scrollbar v-loading="loading">
      <el-table ref="tableRef" class="table" border :data="list">
        <el-table-column
          :width="item.width || 'auto'"
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :formatter="item.formatter"
        >
          <template #default="{ row }" v-if="item.avatar">
            <el-avatar :src="row.headerImg || defaultUserImg">
              <el-avatar :src="defaultUserImg" />
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template #default="{ row }">
            <el-button
              :icon="Edit"
              color="#0580ff"
              size="small"
              @click="openDetail(row)"
              >详情
            </el-button>
            <el-button
              :icon="Edit"
              color="#0580ff"
              size="small"
              @click="goRecordList(row)"
              >记录
            </el-button>
            <!--             
            <el-button
              :icon="Edit"
              color="#0580ff"
              size="small"
              @click="modifyNickname(row)"
              >修改昵称
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>

    <detail-dialog ref="detailDialogRef" @close="detailDialogClose" />

    <add-dialog ref="addDialogRef" @close="detailDialogClose" />
  </el-card>
</template>

<style lang="scss" scoped>
.table {
  :deep(th.el-table__cell) {
    background-color: #dbd8d8 !important;
  }
}

.scrollbar {
  &::-webkit-scrollbar {
    width: 60px; /* 滚动条宽度 */
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* 滚动条轨道背景色 */
  }
}
</style>
