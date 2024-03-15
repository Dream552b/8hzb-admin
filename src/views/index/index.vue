<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getMainInfo } from "@/api/index";
import DataCard from "./components/dataCard.vue";
import StatCard from "./components/statCard.vue";
defineOptions({
  name: "Index"
});
const loading = ref<boolean>(false);
const statData: any = ref([
  [
    { label: "Android", prop: "androidUesTime" },
    { label: "iOS", prop: "iosUesTime" }
  ],
  [
    { label: "今日活跃用户", prop: "totalActiveCount" },
    { label: "Android", prop: "activeAndroidCount" },
    { label: "iOS", prop: "activeIosCount" },
    { label: "PC", prop: "activePcCount" }
  ],
  [
    { label: "昨日活跃用户", prop: "totalActiveCount" },
    { label: "Android", prop: "activeAndroidCount" },
    { label: "iOS", prop: "activeIosCount" },
    { label: "PC", prop: "activePcCount" }
  ],
  [
    { label: "本周活跃总数(去重)", prop: "totalActiveCount" },
    { label: "Android", prop: "activeAndroidCount" },
    { label: "iOS", prop: "activeIosCount" },
    { label: "PC", prop: "activePcCount" }
  ]
]);
const h5WebAppData = ref<any>([
  [
    {
      label: "今日点击量",
      prop: "todayCount",
      unit: "日",
      color: "#ffb800"
    },
    {
      label: "昨日点击量",
      prop: "yestCount",
      unit: "日",
      color: "#ffb800"
    },
    {
      label: "本周点击量",
      prop: "weekCount",
      unit: "周",
      color: "#1E9FFF"
    },
    {
      label: "总计点击量",
      prop: "totalCount",
      unit: "总",
      color: "#2f4056"
    }
  ],
  [
    {
      label: "今日安装量",
      prop: "todayCount",
      unit: "日",
      color: "#ffb800"
    },
    {
      label: "昨日安装量",
      prop: "yestCount",
      unit: "日",
      color: "#ffb800"
    },
    {
      label: "本周安装量",
      prop: "weekCount",
      unit: "周",
      color: "#1E9FFF"
    },
    {
      label: "总计安装量",
      prop: "totalCount",
      unit: "总",
      color: "#2f4056"
    }
  ],
  [
    {
      label: "今日注册量",
      prop: "todayCount",
      unit: "日",
      color: "#ffb800"
    },
    {
      label: "昨日注册量",
      prop: "yestCount",
      unit: "日",
      color: "#ffb800"
    },
    {
      label: "本周注册量",
      prop: "weekCount",
      unit: "周",
      color: "#1E9FFF"
    },
    {
      label: "总计注册量",
      prop: "totalCount",
      unit: "总",
      color: "#2f4056"
    }
  ],
  [
    {
      label: "今日活跃量",
      prop: "todayCount",
      unit: "日",
      color: "#ffb800"
    },
    {
      label: "昨日活跃量",
      prop: "yestCount",
      unit: "日",
      color: "#ffb800"
    },
    {
      label: "本周活跃量",
      prop: "weekCount",
      unit: "周",
      color: "#1E9FFF"
    },
    {
      label: "总计活跃量",
      prop: "totalCount",
      unit: "总",
      color: "#2f4056"
    }
  ]
]);
const registerData = ref<any>([
  { label: "今日", prop: "todayRegisterCount", unit: "日", color: "#ffb800" },
  {
    label: "昨日",
    prop: "yesterdayTimeRegisterCount",
    unit: "日",
    color: "#ffb800"
  },
  { label: "本周", prop: "curWeekRegisterCount", unit: "周", color: "#1E9FFF" },
  {
    label: "上周",
    prop: "lastWeekRegisterCount",
    unit: "周",
    color: "#1E9FFF"
  },
  {
    label: "本月",
    prop: "curMonthRegisterCount",
    unit: "月",
    color: "#009688"
  },
  { label: "统计", prop: "totalRegisterCount", unit: "总", color: "#2f4056" }
]);
const liveOnlineUserCount = ref<number>(0);
const downloadStatData = ref<any>([
  {
    label: "今日下载总量(去重)",
    prop: "totalDownloadCount"
  },
  {
    label: "Android",
    prop: "androidDownloadCount"
  },
  {
    label: "iOS",
    prop: "iosDownloadCount"
  },
  {
    label: "昨日",
    prop: "totalYesterdayDownloadCount"
  },
  {
    label: "本月",
    prop: "totalMonthDownloadCount"
  }
]);

const getTime = time => {
  // 转换为式分秒
  let h: number | string = parseInt((time / 60 / 60) % 24);
  h = h < 10 ? "0" + h : h;
  let m: number | string = parseInt((time / 60) % 60);
  m = m < 10 ? "0" + m : m;
  let s: number | string = parseInt(time % 60);
  s = s < 10 ? "0" + s : s;
  // 作为返回值返回
  return [h, m, s];
};

const getData = async () => {
  try {
    loading.value = true;
    const res = await getMainInfo();
    const data: any = res.data;
    statData.value = statData.value.map((item, index) => {
      return item.map(item2 => {
        if (index === 0) {
          return {
            ...item2,
            value: getTime(data[item2.prop]).join(":")
          };
        }
        return {
          ...item2,
          value: data.activeList[index - 1][item2.prop]
        };
      });
    });
    h5WebAppData.value = h5WebAppData.value.map((item, index) => {
      return item.map(item2 => {
        return {
          ...item2,
          value: data["iosSetList"][index][item2.prop]
        };
      });
    });
    registerData.value = registerData.value.map(item => {
      return {
        ...item,
        value: data[item.prop]
      };
    });
    liveOnlineUserCount.value = data.liveOnlineUserCount || 0;
    downloadStatData.value = downloadStatData.value.map(item => {
      return {
        ...item,
        value: data[item.prop]
      };
    });
  } catch (err) {
    throw new Error("获取数据失败");
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  // getData();
});
</script>

<template>
  <el-card shadow="never" v-loading="loading">
    <div class="tip">
      在线观看人数:
      <el-tag effect="dark" color="#009688" :hit="false">
        {{ liveOnlineUserCount }}
      </el-tag>
    </div>
    <!-- 统计数据 -->
    <el-card shadow="never">
      <div class="row-wrap">
        <el-row
          :style="index !== statData.length - 1 && 'margin-bottom: 30px'"
          :gutter="24"
          v-for="(item, index) in statData"
          :key="index"
        >
          <el-col :span="6" v-for="(item2, index2) in item" :key="index2">
            <stat-card :label="item2.label" :value="item2.value" />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- h5 webapp 数据面板 -->
    <el-card
      style="margin-top: 20px"
      header="H5 WEBAPP"
      shadow="never"
      class="card-header-style"
    >
      <el-row
        :style="index !== h5WebAppData.length - 1 && 'margin-bottom: 20px'"
        :gutter="20"
        v-for="(item, index) in h5WebAppData"
        :key="index"
      >
        <el-col :span="6" v-for="(item2, index2) in item" :key="index2">
          <data-card
            :label="item2.label"
            :color="item2.color"
            :unit="item2.unit"
            :value="item2.value"
          />
        </el-col>
      </el-row>
    </el-card>
    <!-- 注册用户 -->
    <el-card
      style="margin-top: 20px"
      header="注册用户"
      shadow="never"
      class="card-header-style"
    >
      <el-row :gutter="20">
        <el-col :span="4" v-for="(item, index) in registerData" :key="index">
          <data-card
            :label="item.label"
            :color="item.color"
            :unit="item.unit"
            :value="item.value"
          />
        </el-col>
      </el-row>
    </el-card>
    <!-- 下载统计 -->
    <el-card
      style="margin-top: 20px"
      header="下载统计"
      shadow="never"
      class="card-header-style"
    >
      <el-row :gutter="24">
        <el-col
          :span="4"
          v-for="(item, index) in downloadStatData"
          :key="index"
        >
          <stat-card :label="item.label" :value="item.value" />
        </el-col>
      </el-row>
    </el-card>
  </el-card>
</template>

<style lang="scss" scoped>
.tip {
  padding: 8px 16px;
  margin: 0 0 12px;
  background-color: #f7f4f4;
  border-left: 5px solid #009688;
  border-radius: 4px;

  :deep(.el-tag) {
    border-color: #009688;
  }
}

// .row-wrap {
// .col-wrap {
//   background-color: #f8f8f8;
//   padding: 10px 15px;
//   margin-top: 15px;
//   margin-bottom: 15px;
//   .title {
//     font-size: 12px;
//     color: #999999;
//   }
//   .desc {
//     font-size: 30px;
//     color: #009688;
//   }
// }
// }

.card-header-style {
  :deep(.el-card__header) {
    padding: 10px 20px;
  }
}
</style>
