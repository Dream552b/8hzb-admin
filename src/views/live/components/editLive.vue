<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { editLive } from "@/api/live/index";

defineOptions({
  name: "editLiveDialog"
});
const emits = defineEmits(["close"]);
const visible = ref<boolean>(false);
const formRef = ref();
const time = ref<any>([]);
const loading = ref<boolean>(false);
const form = reactive({
  liveName: "",
  nickName: "",
  sportsType: "",
  matchID: "",
  matchLiveID: "",
  liveStatus: ""
});

const saveForm = async () => {
  try {
    loading.value = true;
    const res: any = await editLive({
      ...form
      // startTime: time.value[0] || "",
      // endTime: time.value[1] || ""
    });
    loading.value = false;
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
    visible.value = false;
  } catch (error) {
    return ElMessage({
      message: error.message,
      type: "error"
    });
  } finally {
    loading.value = false;
  }
};

const open = ({ row }) => {
  visible.value = true;
  form.liveName = row.liveName;
  form.nickName = row.nickName;
  form.sportsType = row.sportsType;
  form.matchID = row.matchID;
  form.matchLiveID = row.id;
  form.liveStatus = row.liveStatus;
};

defineExpose({
  open
});
</script>

<template>
  <el-dialog title="编辑" v-model="visible">
    <el-form :model="form" ref="formRef" label-width="110px">
      <el-form-item label="直播室名称" prop="liveName">
        <el-input v-model="form.liveName" placeholder="请输入直播室名称" />
      </el-form-item>
      <el-form-item label="主播昵称" prop="nickName">
        <el-input v-model="form.nickName" placeholder="请输入主播昵称" />
      </el-form-item>
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
        <el-radio-group v-model="form.sportsType" disabled>
          <el-radio :label="1">足球</el-radio>
          <el-radio :label="2" :value="2">篮球</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="比赛ID" prop="matchID">
        <span>{{ form.matchID }}</span>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" :loading="loading">取消</el-button>
        <el-button type="primary" @click="saveForm" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
