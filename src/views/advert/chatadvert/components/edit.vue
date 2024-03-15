<script setup lang="ts">
import { reactive } from "vue";
import { ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { getToken } from "@/utils/token";
import Pagination from "@/components/Pagination/index.vue";
import { queryMatch } from "@/api/advert/chatadvert";
import { ElMessage } from "element-plus";
import {
  addChatAdvert,
  getChatAdvert,
  updateChatAdvert
} from "@/api/advert/chatadvert";

defineOptions({
  name: "chatadvertAdd"
});
const emits = defineEmits(["close"]);
const visible = ref(false);
const multipleTableRef = ref<any>();
const title = ref("新增广告");
const loading = ref<boolean>(false);
const dialogMode = ref("add");
const formRef = ref();
const form = ref<any>({
  automatic: 1,
  content: "test1",
  h5DownloadUrl: "test1",
  iosDownloadUrl: "test1",
  matchID: "",
  matchType: 1,
  pcDownloadUrl: "test1",
  pic: "",
  time: 1,
  title: "test1",
  id: undefined
});
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const form2 = reactive({
  matchID: "",
  eventName: "",
  homeTeamName: "",
  awayTeamName: "",
  matchType: 1,
  eventIds: ""
});
const formRef2 = ref<any>();
const list = ref<any>();
const rules = {
  // matchType: [
  //   {
  //     required: true,
  //     message: "请选择比赛类型",
  //     trigger: "change"
  //   }
  // ],
  matchID: [
    {
      required: true,
      message: "请选择比赛",
      trigger: "change"
    }
  ]
};
const columns = ref<any>([
  {
    label: "比赛ID",
    prop: "matchID"
  },
  {
    label: "比赛名称",
    prop: "eventName"
  },
  {
    label: "比赛类型",
    prop: "matchType",
    formatter: row => {
      if (row.sportsType == 1) return "足球";
      if (row.sportsType == 2) return "篮球";
    }
  },
  {
    label: "主队名称",
    prop: "homeTeamName"
  },
  {
    label: "客队名称",
    prop: "awayTeamName"
  }
]);

const open = async ({ mode, row }) => {
  visible.value = true;
  dialogMode.value = mode;
  if (mode == "edit") {
    loading.value = true;
    const res: any = await getChatAdvert({ id: row.id });
    form2.eventIds = res.data.matchID;
    form.value = {
      ...res.data
    };
    loading.value = false;
  }
  if (mode == "add") {
    form2.eventIds = "";
    form.value = {
      automatic: 1,
      content: "",
      h5DownloadUrl: "",
      iosDownloadUrl: "",
      matchID: "",
      matchType: 1,
      pcDownloadUrl: "",
      pic: "",
      time: 1,
      title: "",
      id: undefined
    };
  }

  getList();
};

const handleAvatarSuccess = response => {
  form.value.pic = response.data;
};

const getList = async () => {
  try {
    loading.value = true;
    const params = {
      pageSize: pagination.value.pageSize,
      pageNum: pagination.value.pageNum,
      ...form2,
      _: new Date().getTime()
    };
    const res: any = await queryMatch(params);
    const {
      data: { records, total }
    } = res;
    pagination.value.total = total;
    if (dialogMode.value === "edit") {
      multipleTableRef.value?.toggleAllSelection();
    }
    list.value = records || [];
  } catch (err) {
    console.log("err:", err);
  } finally {
    loading.value = false;
  }
};

const searchTable = () => {
  pagination.value.pageNum = 1;
  getList();
};
const resetTable = () => {
  formRef2.value.resetFields();
  pagination.value.pageNum = 1;
  getList();
};

const dialogOpened = () => {
  if (dialogMode.value == "add") {
    formRef.value.resetFields();
    formRef2.value.resetFields();
  }
};

const saveForm = async () => {
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      const params = {
        ...form.value
      };
      const res: any =
        dialogMode.value == "add"
          ? await addChatAdvert(params)
          : await updateChatAdvert(params);
      if (res.code === 200) {
        ElMessage({
          message: "保存成功",
          type: "success"
        });
        visible.value = false;
        multipleTableRef.value?.clearSelection();
        emits("close");
      }
      if (res.code === 400) {
        ElMessage({
          message: res.message,
          type: "warning"
        });
      }
      loading.value = false;
      // emits("close");
    } else {
      console.log("error submit!", fields);
    }
  });
};
const handleSelectionChange = rows => {
  form.value.matchID = rows.map(item => item.matchID).join(",");
};

const matchTypeChange = val => {
  formRef2.value.resetFields();
  pagination.value.pageNum = 1;
  form2.sportsType = val;
  getList();
};
const pageChange = () => {
  getList();
};
defineExpose({
  open
});
</script>
<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="75%"
    style="height: 80%; overflow-y: auto"
    @opened="dialogOpened"
    class="dialog-box"
  >
    <el-form
      v-if="visible"
      v-loading="loading"
      :model="form"
      label-width="110px"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="广告名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入广告名称" />
      </el-form-item>
      <el-form-item label="广告内容" prop="content">
        <el-input
          :rows="3"
          type="textarea"
          v-model="form.content"
          placeholder="请输入广告内容"
        />
      </el-form-item>
      <el-form-item label="广告二维码" prop="pic">
        <div style="display: flex; flex-direction: column">
          <el-upload
            class="videoImg-uploader"
            action="/api/admin/v2/upload/image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="{ 'Access-Token': getToken() }"
          >
            <div v-if="form.pic">
              <el-image
                style="width: 128px; height: 128px"
                :src="form.pic"
                fit="contain"
              />
            </div>
            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div>图片支持JPG、JPEG、PNG格式，大小不超过5M。</div>
        </div>
      </el-form-item>
      <el-form-item label="H5下载地址" prop="h5DownloadUrl">
        <el-input v-model="form.h5DownloadUrl" placeholder="请输入H5下载地址" />
      </el-form-item>
      <el-form-item label="PC下载地址" prop="pcDownloadUrl">
        <el-input v-model="form.pcDownloadUrl" placeholder="请输入PC下载地址" />
      </el-form-item>
      <el-form-item label="IOS下载地址" prop="iosDownloadUrl">
        <el-input
          v-model="form.iosDownloadUrl"
          placeholder="请输入IOS下载地址"
        />
      </el-form-item>
      <el-form-item label="是否自动发送" prop="automatic">
        <el-radio-group v-model="form.automatic">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="定时发送间隔时长(分钟)" prop="time">
        <el-radio-group v-model="form.time">
          <el-radio :label="1">5分钟</el-radio>
          <el-radio :label="2">10分钟</el-radio>
          <el-radio :label="3">20分钟</el-radio>
          <el-radio :label="4">30分钟</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="赛事类型" prop="matchType">
        <el-radio-group v-model="form.sportsType" @change="matchTypeChange">
          <el-radio :label="1">足球</el-radio>
          <el-radio :label="2">篮球</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择比赛" prop="matchID">
        <el-card>
          <el-form :model="form2" inline ref="formRef2">
            <el-form-item style="margin-bottom: 12px" prop="eventIds">
              <el-input v-model="form2.eventIds" placeholder="比赛ID" />
            </el-form-item>
            <el-form-item style="margin-bottom: 12px">
              <el-input
                v-model="form2.competitionName"
                placeholder="比赛名称"
              />
            </el-form-item>
            <el-form-item style="margin-bottom: 12px">
              <el-input v-model="form2.homeTeamName" placeholder="主队名称" />
            </el-form-item>
            <el-form-item style="margin-bottom: 12px">
              <el-input v-model="form2.awayTeamName" placeholder="客队名称" />
            </el-form-item>
            <el-form-item style="margin-bottom: 12px">
              <el-button type="success" @click="searchTable">查询</el-button>
              <el-button type="success" @click="resetTable">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table
            border
            :data="list"
            v-loading="loading"
            row-key="matchID"
            ref="multipleTableRef"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              align="center"
              width="60"
              reserve-selection
            />
            <el-table-column
              :width="item.width"
              v-for="(item, index) in columns"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              align="center"
              :formatter="item.formatter"
            >
              <template #default="{ row }" v-if="item.prop === 'pic'">
                <el-image :src="row.pic" style="width: 100px; height: 100px" />
              </template>
            </el-table-column>
          </el-table>

          <el-row style="margin-top: 20px" justify="end">
            <Pagination
              v-model:pagination="pagination"
              @page-change="pageChange"
            />
          </el-row>
        </el-card>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-affix position="bottom" :offset="60">
        <div class="dialog-footer">
          <el-button @click="visible = false" :loading="loading"
            >取消</el-button
          >
          <el-button type="primary" @click="saveForm" :loading="loading">
            确定
          </el-button>
        </div>
      </el-affix>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.videoImg-uploader {
  :deep(.el-upload) {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    transition: var(--el-transition-duration-fast);
  }
}

.dialog-footer {
  background-color: var(--el-dialog-bg-color);
}

.el-icon.uploader-icon {
  width: 128px;
  height: 128px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

:deep(.el-dialog__footer) {
  padding: 0;
}
</style>
