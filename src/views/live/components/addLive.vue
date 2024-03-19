<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  addLive,
  getFootballScheduleList,
  getBasketballScheduleList
} from "@/api/live/index";
import Pagination from "@/components/Pagination/index.vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
defineOptions({
  name: "AddLiveDialog"
});
const dialogVisible = ref<boolean>(false);
const form = reactive<any>({
  liveName: "", //  直播室名称
  userId: "", //  主播账号
  nickName: "", //  主播昵称
  matchType: "", //  赛事类型
  matchID: "", //   比赛id
  liveUrl: "" // 推流链接
});
const form2 = reactive<any>({
  competitionName: "",
  homeTeamName: "",
  awayTeamName: ""
});
const time = ref<any>([]);
const time2 = ref<any>([]);
const formRef = ref<any>();
const form2Ref = ref<any>();
const loading = ref<boolean>();
const list = ref<any>();
const radio = ref<any>();
const emits = defineEmits(["close"]);
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const columns = ref<any>([
  {
    label: "ID",
    prop: "id"
  },
  // {
  //   label: "状态/类型",
  //   prop: "os"
  // },
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
    label: "联赛名称",
    prop: "competitionName"
  },
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
  liveName: [
    { required: true, message: "请输入直播室名称", trigger: "change" }
  ],
  nickName: [{ required: true, message: "请输入主播昵称", trigger: "change" }],
  matchID: [{ required: true, message: "请选择比赛", trigger: "change" }]
};

const getList = async () => {
  try {
    loading.value = true;
    const params = {
      page: pagination.value.pageNum,
      limit: pagination.value.pageSize,
      sportsType: form.sportsType,
      ...form2
    };
    const res: any =
      form.sportsType == 1
        ? await getFootballScheduleList(params)
        : await getBasketballScheduleList(params);
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

const pageChange = () => {
  getList();
};

const matchTypeChange = () => {
  pagination.value = {
    pageNum: 1,
    pageSize: 10,
    total: 0
  };
  form2Ref.value.resetFields();
  radio.value = "";
  form.matchID = "";
  getList();
};

const search = () => {
  if (!form.sportsType)
    return ElMessage({
      message: "请先选择赛事类型！",
      type: "warning"
    });

  if (form.sportsType) {
    pagination.value = {
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
    radio.value = "";
    form.matchID = "";
    getList();
  }
};

const radioChange = row => {
  form.matchID = row.id;
};

const saveForm = async () => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      const res: any = await addLive({
        ...form
      });
      loading.value = false;
      if (res.code !== 200)
        return ElMessage({
          message: res.data,
          type: "error"
        });

      if (res.code === 200) {
        ElMessage({
          message: "保存成功",
          type: "success"
        });
        emits("close");
      }
      if (res.code === 400) {
        return ElMessage({
          message: res.message,
          type: "error"
        });
      }
      dialogVisible.value = false;
    } else {
      loading.value = false;
      console.log("error submit!", fields);
    }
  });
};

const open = () => {
  dialogVisible.value = true;
  resetAllForm();
};
const resetAllForm = () => {
  form.liveName = "";
  form.userId = "";
  form.nickName = "";
  form.sportsType = "";
  form.matchID = "";
  form.liveUrl = "";
  form2.competitionName = "";
  form2.homeTeamName = "";
  form2.awayTeamName = "";
  list.value = [];
  pagination.value.pageNum = 1;
  pagination.value.pageSize = 10;
  pagination.value.total = 0;
  radio.value = "";
};

defineExpose({
  open
});
</script>

<template>
  <el-dialog v-model="dialogVisible" title="添加直播室" width="60%">
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="直播室名称" prop="liveName">
        <el-input v-model="form.liveName" placeholder="请输入直播室名称" />
      </el-form-item>
      <!-- <el-form-item label="主播账号" prop="userId">
        <el-input v-model="form.userId" placeholder="请输入主播账号" />
      </el-form-item> -->
      <el-form-item label="主播昵称" prop="nickName">
        <el-input v-model="form.nickName" placeholder="请输入主播昵称" />
      </el-form-item>
      <!-- <el-form-item label="推流链接" prop="liveUrl">
        <el-input placeholder="推流链接" v-model="form.liveUrl" />
      </el-form-item> -->
      <!-- <el-form-item label="直播时间">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYYMMDD"
          :default-time="[
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 2, 1, 23, 59, 59)
          ]"
        />
      </el-form-item> -->
      <el-form-item label="赛事类型">
        <el-radio-group v-model="form.sportsType" @change="matchTypeChange">
          <el-radio :label="1">足球</el-radio>
          <el-radio :label="2" :value="2">篮球</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择比赛ID" prop="matchID">
        <span>{{ form.matchID }}</span>
      </el-form-item>
    </el-form>

    <el-form ref="form2Ref" :model="form2" inline>
      <el-form-item prop="competitionName">
        <el-input placeholder="联赛名称" v-model="form2.competitionName" />
      </el-form-item>
      <el-form-item prop="homeTeamName">
        <el-input placeholder="主队名称" v-model="form2.homeTeamName" />
      </el-form-item>
      <el-form-item prop="awayTeamName">
        <el-input placeholder="客队名称" v-model="form2.awayTeamName" />
      </el-form-item>
      <el-form-item prop="matchID">
        <el-input placeholder="比赛ID" v-model="form2.matchID" />
      </el-form-item>
      <el-form-item>
        <el-form-item label="" prop="statusID">
          <el-select v-model="form2.statusID" placeholder="状态选择" clearable>
            <el-option label="未开赛" :value="1" />
            <el-option label="开赛" :value="2" />
            <el-option label="结束" :value="3" />
            <el-option label="其他" :value="4" />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>

    <div>
      <el-scrollbar v-loading="loading">
        <el-table class="table" border :data="list">
          <el-table-column label="选择" align="center" width="65">
            <template #default="scope">
              <el-radio
                :label="scope.$index"
                v-model="radio"
                @change="radioChange(scope.row)"
                ><span
              /></el-radio>
            </template>
          </el-table-column>
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
        </el-table>
      </el-scrollbar>

      <el-row style="margin-top: 20px" justify="end">
        <Pagination v-model:pagination="pagination" @page-change="pageChange" />
      </el-row>
    </div>

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
</template>
