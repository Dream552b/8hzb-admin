<script setup lang="ts">
import { ref, reactive } from "vue";
import { getToken } from "@/utils/token";
import { Plus } from "@element-plus/icons-vue";
import { createPlayback, updateAdvertisement } from "@/api/playback";

import { queryMatch } from "@/api/advert/chatadvert";
import ImageUpload from "./ImageUpload/index.vue";

import {
  getFootballScheduleList,
  getBasketballScheduleList
} from "@/api/live/index";

import Pagination from "@/components/Pagination/index.vue";

import { ElMessage, ElMessageBox, dayjs } from "element-plus";

defineOptions({
  name: "EditAdDialog"
});
const title = ref<string>("新增回放");
const visible = ref<boolean>(false);
const loading = ref<boolean>(false);
const dialogMode = ref("add");

const multipleTableRef = ref<any>();
const form = ref<any>({
  sportsType: 1
});

const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const form2 = reactive({
  matchID: ""
});
const formRef2 = ref<any>();
const list = ref<any>();
const openType = ref<any>("");

const columns = ref<any>([
  {
    label: "ID",
    prop: "id"
  },
  // {
  //   label: "状态/类型",
  //   prop: "os"
  // },

  {
    label: "赛事名称",
    prop: "competitionName"
  },
  // {
  //   label: "比赛信息",
  //   prop: "headerImg",
  //   formatter: row => {
  //     if (Array.isArray(row.homeTeamScore)) {
  //       const homeScore = row.homeTeamScore.reduce((pre, cur) => {
  //         return (pre += cur);
  //       }, 0);
  //       const awayScore = row.awayTeamScore.reduce((pre, cur) => {
  //         return (pre += cur);
  //       }, 0);
  //       return `${homeScore} : ${awayScore}`;
  //     }
  //     return `${row.homeTeamScore} : ${row.awayTeamScore}`;
  //   }
  // },
  {
    label: "开赛时间",
    prop: "matchTime",
    formatter: (row, col, val) => {
      return dayjs.unix(val).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  {
    label: "主队名称",
    prop: "homeTeamName"
  },
  {
    label: "主堆LOGO",
    prop: "homeTeamLogo",
    type: "img"
  },
  {
    label: "客队LOGO",
    prop: "awayTeamLogo",
    type: "img"
  },
  {
    label: "客队名称",
    prop: "awayTeamName"
  }
]);

const rules = {
  content: {
    required: true,
    message: "文字内容不能为空",
    trigger: "blur"
  },
  startAt: {
    required: true,
    message: "时间内容不能为空",
    trigger: "blur"
  },
  position: {
    required: true,
    message: "请选择二维码位置",
    trigger: "blur"
  },
  pic: {
    required: true,
    message: "请上传图片",
    trigger: "blur"
  }
};

const time = ref<null>("");

const emits = defineEmits(["close"]);

const handleAvatarSuccess = response => {
  form.value.pic = response.data;
};

const handleAvatarSuccessImg1 = response => {
  form.value.img1 = response.data;
};
const handleAvatarSuccessImg2 = response => {
  form.value.img2 = response.data;
};

const saveForm = async () => {
  loading.value = true;
  let res;

  let params = {
    ...form.value
  };

  params.matchID = +params.matchID;

  if (isNaN(params.matchID)) {
    loading.value = false;
    ElMessage.error("一次只能勾选一个比赛！");
    return;
  }

  console.log("params.matchID", params.matchID);
  if (!params.matchID) {
    loading.value = false;
    ElMessage.error("请先勾选要关联的比赛！");
    return;
  }

  if (dialogMode.value === "add") {
    res = await createPlayback(params);
  }
  if (dialogMode.value === "edit") {
    // res = await updateAdvertisement(params);
  }
  if (res.code == 200) {
    ElMessage({
      message: "保存成功",
      type: "success"
    });
    emits("getList");
  } else {
    ElMessageBox.confirm(res.massage || res.data, "Warning", {
      type: "warning"
    })
      .then(() => {})
      .catch(() => {});
  }
  loading.value = false;
  visible.value = false;
};

const handleClose = () => {
  if (dialogMode.value === "add") {
    emits("close", 1);
  } else {
    emits("close");
  }
};

const open = (row, type) => {
  visible.value = true;
  openType.value = type;

  if (type === "edit" || type === "details") {
    form.value = {
      ...row
    };

    form2.sportsType = row.sportsType;

    dialogMode.value = "edit";
    title.value = "编辑广告";

    time.value = [
      Math.floor(form.value.startAt * 1000),
      Math.floor(form.value.endAt * 1000)
    ];

    if (form.value.sportsType === 1) {
      form2.matchID = row.footballMatchID || "";
    }
  } else {
    form.value = {
      sportsType: 1
    };

    time.value = "";
    form2.matchID = "";
    dialogMode.value = "add";
    title.value = "新增回放";
  }

  setTimeout(() => {
    getList();
  }, 1000);
};

const timeChange = val => {
  form.value.startAt =
    Math.floor((val && dayjs(val[0]).format("x")) / 1000) || "";
  form.value.endAt =
    Math.floor((val && dayjs(val[1]).format("x")) / 1000) || "";
};

// tabls的数据
const getList = async () => {
  try {
    loading.value = true;
    const params = {
      pageSize: pagination.value.pageSize,
      pageNum: pagination.value.pageNum,
      sportsType: form.value.sportsType,
      ...form2,
      _: new Date().getTime()
    };
    // const res: any = await queryMatch(params);

    const res: any =
      form.value.sportsType === 1
        ? await getFootballScheduleList(params)
        : await getBasketballScheduleList(params);

    const {
      data: { records, total }
    } = res;

    pagination.value.total = total;
    if (dialogMode.value === "edit") {
      // multipleTableRef.value?.toggleAllSelection();
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

const matchTypeChange = val => {
  formRef2.value.resetFields();
  pagination.value.pageNum = 1;
  form2.sportsType = val;
  formRef2.value.resetFields();
  getList();
};

const handleSelectionChange = rows => {
  console.log(rows);
  if (!rows.length) {
    form.value.matchID = null;
  }
  if (rows.length > 1) {
    // ElMessage.error("一次只能勾选一个比赛！");
  }
  form.value.matchID = rows.map(item => item.id).join(",");
};

const pageChange = () => {
  getList();
};

defineExpose({
  open
});
</script>

<template>
  <el-dialog v-model="visible" :title="title" @closed="handleClose" width="60%">
    <el-form :model="form" :rules="rules">
      <el-form-item label="赛事类型" prop="sportsType">
        <el-radio-group v-model="form.sportsType" @change="matchTypeChange">
          <el-radio :label="1">足球</el-radio>
          <el-radio :label="2">篮球</el-radio>
        </el-radio-group>
      </el-form-item>

      <div v-if="visible">
        <el-form-item label="选择比赛" prop="matchID">
          <el-card>
            <el-form :model="form2" inline ref="formRef2">
              <el-form-item style="margin-bottom: 12px" prop="matchID">
                <el-input v-model="form2.matchID" placeholder="比赛ID" />
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
              highlight-current-row
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
                <template #default="{ row }" v-if="item.type == 'img'">
                  <el-image
                    style="width: 80px; height: 80px"
                    :src="row[item.prop]"
                    fit="contain"
                  />
                </template>
              </el-table-column>

              <!--
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
                  <el-image
                    :src="row.pic"
                    style="width: 100px; height: 100px"
                  />
                </template>
              </el-table-column> -->
            </el-table>

            <el-row style="margin-top: 20px" justify="end">
              <Pagination
                v-model:pagination="pagination"
                @page-change="pageChange"
              />
            </el-row>
          </el-card>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <div v-if="openType !== 'details'">
          <el-button @click="visible = false" :loading="loading"
            >取消</el-button
          >
          <el-button type="primary" @click="saveForm" :loading="loading">
            确定
          </el-button>
        </div>
      </span>
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

.el-icon.uploader-icon {
  width: 178px;
  height: 178px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
