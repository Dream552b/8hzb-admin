<script setup lang="ts">
import { ref } from "vue";
import { Delete, CirclePlus } from "@element-plus/icons-vue";
import {
  getPlaybackList,
  postVideoBackEditState,
  saveForeverVideo,
  delVideoBack
} from "@/api/video/playback";
import Pagination from "@/components/Pagination";
// import { Image } from "antd-mobile/2x";
import dayjs from "dayjs";
import { ElMessageBox } from "element-plus";
import EditVideoBackDialog from "./components/editVideoBackDialog.vue";
defineOptions({
  name: "Playback"
});
const formRef = ref();
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const form = ref({
  videoType: "-1",
  videStatus: "",
  videoName: "",
  authStatus: 1
});
const loading = ref<boolean>(false);
const columns = ref<any>([
  { label: "视频id", prop: "id" },
  { label: "视频标题", prop: "videoName" },
  {
    label: "视频封面",
    prop: "videoImg",
    type: "image"
  },
  {
    label: "观看次数",
    prop: "visits"
  },
  {
    label: "视频类型",
    prop: "videoType",
    formatter: (row, col, val) => {
      return val == 0 ? "足球" : "篮球";
    }
  },
  {
    label: "关联场次",
    prop: "matchName"
  },
  {
    label: "创建时间",
    prop: "createTime",
    formatter: (row, col, val) => {
      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  {
    label: "状态",
    prop: "videStatus",
    formatter: (row, col, val) => {
      const s = row.startTime;
      const e = row.endTime;
      const start = dayjs(s, "YYYY-MM-DD HH:mm:ss").valueOf();
      const end = dayjs(e, "YYYY-MM-DD HH:mm:ss").valueOf();
      const currentTime = new Date().getTime();
      if (currentTime < start) return "未开始";
      if (currentTime > start && currentTime < end) {
        if (val == 0) return "已发布";
        if (val == 1) return "已下架";
      }
      if (currentTime > end) return "已过期";
    }
  },
  {
    label: "创建人",
    prop: "operatorName"
  }
]);
const list = ref<any>([]);
const time = ref<any>([]);
const multipleSelection = ref<any>();
const editVideoBackDialogRef = ref(null);

const getList = async () => {
  try {
    loading.value = true;
    const params = {
      ...pagination.value,
      ...form.value,
      createTimeFrom: time.value[0] || "",
      createTimeTo: time.value[1] || ""
    };
    const res: any = await getPlaybackList(params);
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
  time.value = [];
  getList();
};

// 上下架
const handleUpDown = async row => {
  loading.value = true;
  await postVideoBackEditState(row.id);
  getList();
  loading.value = false;
};

// 查看详情
const lookDetail = async row => {
  console.log("🚀 ~ file: playback.vue:128 ~ lookDetail ~ row:", row);
  editVideoBackDialogRef.value.open(row);
};

// 永存
const handleAchieve = async row => {
  ElMessageBox.confirm(
    row.isKeep == 0 ? "永久保存该视频?" : "取消永久保存?",
    "信息",
    {
      type: "warning"
    }
  )
    .then(async () => {
      loading.value = true;
      await saveForeverVideo({ id: row.id, state: row.isKeep == 0 ? 1 : 0 });
      loading.value = false;
      getList();
    })
    .catch(() => {});
};

// 添加视频回放
const add = () => {
  console.log("editVideoBackDialogRef:", editVideoBackDialogRef);
  editVideoBackDialogRef.value.open();
};

// 删除
const delRow = async () => {
  if (multipleSelection.value && multipleSelection.value.length > 0) {
    ElMessageBox.confirm("删除后不可恢复,请慎重?", "信息", {
      type: "warning"
    })
      .then(async () => {
        loading.value = true;
        const ids = multipleSelection.value.map(item => item.id);
        await delVideoBack(ids.join(","));
        loading.value = false;
        getList();
      })
      .catch(() => {});
  }
};

const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};

const videoEditDialgClose = () => {
  pagination.value.pageNum = 1;
  getList();
};
</script>

<template>
  <el-card>
    <el-form ref="formRef" :model="form" inline>
      <el-form-item label="视频标题" prop="videoName">
        <el-input
          v-model="form.videoName"
          placeholder="请输入视频标题"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态" prop="videStatus">
        <el-select v-model="form.videStatus" placeholder="请选择">
          <el-option label="全部" value="" />
          <el-option label="已发布" value="0" />
          <el-option label="已下架" value="1" />
          <el-option label="已过期" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="视频类型" prop="videoType">
        <el-select v-model="form.videoType" placeholder="请选择">
          <el-option label="全部" value="-1" />
          <el-option label="足球" value="0" />
          <el-option label="篮球" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
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
      <el-form-item label="">
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button :icon="CirclePlus" type="primary" @click="add">
          创建
        </el-button>
        <el-button :icon="Delete" type="danger" @click="delRow">删除</el-button>
      </el-form-item>
    </el-form>

    <el-scrollbar v-loading="loading">
      <el-table
        ref="tableRef"
        class="table"
        border
        :data="list || []"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :formatter="item.formatter"
          :show-overflow-tooltip="item['show-overflow-tooltip']"
        >
          <template #default="{ row }" v-if="item.type === 'image'">
            <!-- <Image :src="val" /> -->
            <el-image style="height: 35px" :src="row[item.prop]" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280px">
          <template #default="{ row }">
            <el-link
              :underline="false"
              @click="handleUpDown(row)"
              :type="row.videStatus == 0 ? 'danger' : 'success'"
            >
              <span v-if="row.videStatus == 0">下架</span>
              <span v-else>上架</span>
            </el-link>
            <el-divider direction="vertical" />
            <el-link type="success" :underline="false" @click="lookDetail(row)">
              查看详情
            </el-link>
            <el-divider direction="vertical" />
            <el-link
              :type="row.isKeep == 0 ? 'danger' : 'success'"
              :underline="false"
              @click="handleAchieve(row)"
            >
              <span v-if="row.isKeep == 0"> 未永存</span>
              <span v-else> 已永存</span>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="getList" />
    </el-row>

    <edit-video-back-dialog
      ref="editVideoBackDialogRef"
      @close="videoEditDialgClose"
    />
  </el-card>
</template>
