<script setup lang="ts">
import { ref } from "vue";
import AddLive from "./components/addLive.vue";
import EditLive from "./components/editLive.vue";
import Pagination from "@/components/Pagination/index.vue";
import {
  getLiveList,
  postStartLive,
  postEndLive,
  delLive,
  editLive
} from "@/api/live";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox } from "element-plus";
import { CopyDocument } from "@element-plus/icons-vue";

defineOptions({
  name: "LiveIndex"
});
const form = ref<any>({
  sportsType: 0,
  liveStatus: 0,
  liveName: "",
  nickName: "",
  matchID: ""
});
const loading = ref<boolean>();
const addLiveRef = ref<any>();
const editLiveRef = ref<any>();
const formRef = ref<any>();
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const time = ref<any>([]);
const list = ref<any>([]);
const columns = ref<any>([
  {
    label: "直播室ID",
    prop: "id"
  },
  {
    label: "比赛ID",
    prop: "matchID"
  },
  {
    label: "比赛类型",
    prop: "sportsType",
    formatter: row => {
      if (row.sportsType === 1) return "足球";
      if (row.sportsType === 2) return "篮球";
    }
  },
  {
    label: "开赛时间",
    prop: "matchTime",
    formatter: (row, col, val) => {
      if (!val) return "";
      return dayjs.unix(val).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  {
    label: "直播室名称",
    prop: "liveName"
  },
  {
    label: "主播昵称",
    prop: "nickName"
  },
  {
    label: "状态",
    prop: "liveStatus",
    formatter: row => {
      console.log("liveStatus", row.liveStatus);
      if (row.liveStatus === 1) return "未开始";
      if (row.liveStatus === 2) return "直播中";
      if (row.liveStatus === 3) return "已结束";
    }
  },
  {
    label: "推流信息",
    prop: "pushUrl",
    showOverflowTooltip: true
  }
]);

function disTime(val) {
  if (!val) return "";
  // 将日期字符串转换为日期对象
  var dateObject = new Date(val);
  // 获取日期对象的时间戳（毫秒为单位）
  var timestamp = Math.floor(dateObject.getTime() / 1000);
  return timestamp;
}

const getList = async () => {
  try {
    loading.value = true;
    const params = {
      page: pagination.value.pageNum,
      limit: pagination.value.pageSize,
      ...form.value,
      matchID: +form.value.matchID || "",
      startTime: disTime(time.value && time.value[0]) || "",
      endTime: disTime(time.value && time.value[1]) || ""
    };
    const res: any = await getLiveList(params);
    loading.value = true;
    const {
      data: { records, total }
    } = res;
    // pagination.value.pageNum = current;
    // pagination.value.pageSize = size;
    pagination.value.total = total;
    list.value = records || [];
  } catch (err) {
    console.log("err:", err);
  } finally {
    loading.value = false;
  }
};

getList();

const pageChange = () => {
  getList();
};

const search = () => {
  getList();
};

const add = () => {
  addLiveRef.value.open();
};

const refresh = () => {
  formRef.value.resetFields();
  pagination.value.pageNum = 1;
  getList();
};

const startLive = async row => {
  loading.value = true;
  const res = await postStartLive({ matchID: row.matchID });
  if (res.code === 200) {
    ElMessage({
      message: "直播开始",
      type: "success"
    });
    getList();
  }
  loading.value = false;
};
const endLive = async row => {
  loading.value = true;
  const res = await postEndLive({ matchID: row.matchID });
  if (res.code === 200) {
    ElMessage({
      message: "直播结束",
      type: "success"
    });
    getList();
  }
  loading.value = false;
};

const delRow = async row => {
  ElMessageBox.confirm("确定删除吗?", "信息", {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;
      const res = await delLive({ ids: [row.id] });
      if (res.code === 200) {
        ElMessage({
          message: "删除成功",
          type: "success"
        });
        getList();
      }
      loading.value = false;
    })
    .catch(() => {});
};

const copyUrl = row => {
  // 创建一个input元素
  const inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("value", row.pushUrl);

  // 将input元素添加到页面中
  document.body.appendChild(inputElement);

  // 选择文本框中的文本
  inputElement.select();

  // 复制选中的文本到剪贴板
  document.execCommand("copy");

  // 移除这个input元素（可选）
  document.body.removeChild(inputElement);
  ElMessage({
    message: "复制成功",
    type: "success"
  });
};

const editRow = row => {
  editLiveRef.value.open({ row });
};

const onStartLive = async row => {
  let title = row.liveStatus === 1 ? "确定要开播吗?" : "确定要结束直播吗";
  ElMessageBox.confirm(title, {
    type: "warning"
  })
    .then(async () => {
      const res = await editLive({
        ...form,
        matchLiveID: row.id,
        liveName: row.liveName,
        nickName: row.nickName,
        liveStatus: row.liveStatus === 1 ? 2 : 1
      });
      if (res.code === 200) {
        ElMessage({
          message: "保存成功",
          type: "success"
        });
        getList();
      }
    })
    .catch(() => {});
};
</script>

<template>
  <div>
    <el-card shadow="never">
      <el-form ref="formRef" :model="form">
        <el-form-item label="类型">
          <el-radio-group v-model="form.sportsType" @change="getList">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button :label="1">足球</el-radio-button>
            <el-radio-button :label="2">篮球</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="直播状态">
          <el-radio-group v-model="form.liveStatus" @change="getList">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button :label="1">未开始</el-radio-button>
            <el-radio-button :label="2">直播中</el-radio-button>
            <el-radio-button :label="3">已结束</el-radio-button>
            <!-- <el-radio-button label="已暂停" />
            <el-radio-button label="已结束" /> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="高级搜索">
          <el-form-item style="margin-right: 12px">
            <el-input placeholder="比赛ID" v-model="form.matchID" clearable />
          </el-form-item>

          <el-form-item style="margin-right: 12px">
            <el-input
              placeholder="直播间名称"
              v-model="form.liveName"
              clearable
            />
          </el-form-item>

          <el-form-item style="margin-right: 12px">
            <el-input
              placeholder="主播用户名"
              v-model="form.nickName"
              clearable
            />
          </el-form-item>

          <el-form-item label="" style="margin-right: 12px">
            <el-date-picker
              v-model="time"
              type="daterange"
              start-placeholder="开赛时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
              :default-time="[
                new Date(2000, 1, 1, 0, 0, 0),
                new Date(2000, 2, 1, 23, 59, 59)
              ]"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button @click="refresh">刷新</el-button>
          <el-button @click="add">添加直播室</el-button>
        </el-form-item>
      </el-form>
      <el-scrollbar v-loading="loading">
        <el-table class="table" border :data="list">
          <el-table-column
            :width="item.width"
            v-for="(item, index) in columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            align="center"
            :formatter="item.formatter"
            :show-overflow-tooltip="item.showOverflowTooltip"
          >
            <template #default="{ row }" v-if="item.prop == 'pushUrl'">
              <div
                @click="copyUrl(row)"
                style="display: flex; align-items: center"
              >
                <el-icon style="margin-right: 5px; cursor: pointer"
                  ><CopyDocument color="#009688" /></el-icon
                ><span id="pushUrl">{{ row[item.prop] }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" align="center">
            <template #default="{ row }">
              <el-button
                v-if="row.liveStatus !== 3"
                :type="row.liveStatus === 1 ? 'primary' : 'danger'"
                size="small"
                @click="onStartLive(row)"
              >
                {{ row.liveStatus === 1 ? "开始直播" : "结束直播" }}
              </el-button>
              <el-button v-else type="info" size="small" disabled>
                已结束
              </el-button>
              <el-button type="primary" size="small" @click="editRow(row)"
                >编辑
              </el-button>
              <el-button type="danger" size="small" @click="delRow(row)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>

      <el-row style="margin-top: 20px" justify="end">
        <Pagination v-model:pagination="pagination" @page-change="pageChange" />
      </el-row>
    </el-card>

    <add-live ref="addLiveRef" @close="refresh" />
    <edit-live ref="editLiveRef" @close="refresh" />
  </div>
</template>
