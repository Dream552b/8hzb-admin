<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import {
  getVideoCateList,
  addVideoBack,
  editVideoBack,
  getVideoBackEventList,
  getMatchList,
  getSign
} from "@/api/video/playback";
import { getToken } from "@/utils/token";
import { Plus } from "@element-plus/icons-vue";
import { UploadProps, UploadRawFile, dayjs } from "element-plus";
import { genFileId } from "element-plus";
defineOptions({
  name: "EditVideoBackDialog"
});

const title = ref("新增视频回放");
const visible = ref<boolean>(false);
const selectableMatch = ref(true);
const selectableRelativeMatch = ref(true);
const formRef = ref();
const typeOptions = ref<any>([]);
const matchOptions = ref<any>([]);
const relativeMatchOptions = ref<any>([]);
const matchLoading = ref(false);
const relativeMatchLoading = ref(false);
const form = reactive<any>({
  matchID: "",
  matchTime: "",
  lookNum: "",
  videStatus: "",
  matchName: "",
  videoName: "",
  id: "",
  backTime: "",
  videoType: "",
  typeId: "",
  leagueName: "",
  startTime: "",
  endTime: "",
  videoImg: "",
  file: "",
  videoSrc: ""
});
const loading = ref<boolean>(false);
const time = ref<any>([]);
const videoUpload = ref<any>();
const uploadVideoParams = ref({});
const videoFileName = ref<string>("");
const videoUploadPath = ref<string>("");
const videoFullPath = ref<string>("");
const videoUploadloading = ref<boolean>(false);
const leagueNameItem = ref<any>();
const matchNameItem = ref<any>();
const dialogMode = ref<string>("add");
const rules = {
  videoName: [{ required: true, message: "请输入视频标题", trigger: "change" }],
  backTime: [{ required: true, message: "请选择赛事时间", trigger: "change" }],
  videoType: [{ required: true, message: "请选择视频分类", trigger: "change" }],
  leagueName: [{ required: true, message: "请选择联赛", trigger: "change" }],
  matchName: [{ required: true, message: "请选择关联联赛", trigger: "change" }],
  startTime: [{ required: true, message: "请选择有效时间", trigger: "change" }],
  videoSrc: [{ required: true, message: "请上传视频", trigger: "change" }]
};
const emits = defineEmits(["close"]);

const open = row => {
  if (row) {
    dialogMode.value = "edit";
    Object.keys(row).forEach(key => {
      if (form[key] !== undefined) {
        form[key] = row[key];
      }
    });
    time.value = [row.startTime, row.endTime];
  } else {
    resetForm();
    dialogMode.value = "add";
  }
  visible.value = true;
};
const eventChange = async () => {
  if (form.backTime && form.videoType) {
    form.leagueName = "";
    matchLoading.value = true;
    const res = await getVideoBackEventList({
      type: parseInt(form.videoType) + 1,
      date: form.backTime,
      _: +new Date()
    });
    selectableMatch.value = false;
    matchLoading.value = false;
    matchOptions.value = res.data;
  }
};

const leagueChange = async val => {
  form.leagueName = val.name_zh;
  leagueNameItem.value = val;
  relativeMatchLoading.value = true;
  const res = await getMatchList({
    type: parseInt(form.videoType) + 1,
    date: form.backTime,
    eventId: val.id,
    _: +new Date()
  });
  relativeMatchOptions.value = res.data;
  relativeMatchLoading.value = false;
  selectableRelativeMatch.value = false;
};

const disabledDate = (time: Date) => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return time.getTime() > Date.now() || time.getTime() < sevenDaysAgo;
};

const handleAvatarSuccess = response => {
  form.videoImg = response.data;
};
const handleExceed: UploadProps["onExceed"] = files => {
  videoUpload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  videoUpload.value!.handleStart(file);
};

const random_string = num => {
  const len = num || 32;
  const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  const maxPos = chars.length;
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

const resetForm = () => {
  Object.keys(form).forEach(key => {
    form[key] = "";
  });
  leagueNameItem.value = {};
  matchNameItem.value = {};
  time.value = [];
};

function get_suffix(filename) {
  const pos = filename.lastIndexOf(".");
  let suffix = "";
  if (pos != -1) {
    suffix = filename.substring(pos);
  }
  return suffix;
}

const fileBeforeUpload = file => {
  if (file.status === "ready") {
    const suffixType = get_suffix(file.name);
    const fileName = `${random_string(10)}${suffixType}`;
    videoFileName.value = fileName;
  }
};

const submitUpload = async () => {
  videoUploadloading.value = true;
  const res = await getSign();
  const { dir, host, accessid, expire, ...other } = res;
  console.log("expire:", expire);
  uploadVideoParams.value = {
    ...other,
    name: videoFileName.value,
    key: `${dir}${videoFileName.value}`,
    OSSAccessKeyId: accessid,
    success_action_status: 200
  };
  videoUploadPath.value = host;
  videoUpload.value!.submit();
  videoFullPath.value = `${videoUploadPath.value}/${dir}${videoFileName.value}`;
};

const videoUoloadSuccess = () => {
  form.videoSrc = videoFullPath.value;
  form.videoImg = `${videoFullPath.value}?x-oss-process=video/snapshot,t_200000,f_jpg,m_fast,w_0,h_0,ar_auto`;
  videoUploadloading.value = false;
};

const matchNameChange = val => {
  matchNameItem.value = val;
  form.matchName = val.eventName;
  form.matchID = val.id;
  form.matchTime = dayjs.unix(val.matchTime).format("YYYY-MM-DD HH:mm:ss");
};

const timeChange = val => {
  form.startTime = (val && dayjs(val[0]).format("YYYY-MM-DD 00:00:00")) || "";
  form.endTime = (val && dayjs(val[1]).format("YYYY-MM-DD 23:59:59")) || "";
};

const saveForm = async () => {
  formRef.value.validate(async valid => {
    if (valid) {
      loading.value = true;
      const res =
        dialogMode.value == "add"
          ? await addVideoBack(form)
          : await editVideoBack(form);
      console.log("res:", res);
      loading.value = false;
      if (res.code == 200) {
        visible.value = false;
        emits("close");
      }
    }
  });
};

onMounted(async () => {
  const { data } = await getVideoCateList();
  typeOptions.value = data;
});
defineExpose({
  open
});
</script>

<template>
  <el-dialog :title="title" v-model="visible">
    <el-form
      ref="formRef"
      :model="form"
      label-width="90px"
      :rules="rules"
      v-if="visible"
    >
      <el-form-item label="视频标题" prop="videoName">
        <el-input v-model="form.videoName" />
      </el-form-item>
      <el-form-item label="赛事时间" prop="backTime" v-if="dialogMode == 'add'">
        <el-date-picker
          v-model="form.backTime"
          type="date"
          placeholder="请选择赛事时间"
          :disabled-date="disabledDate"
          @change="eventChange"
          value-format="YYYYMMDD"
        />
      </el-form-item>
      <el-form-item label="视频分类" prop="videoType">
        <el-select
          v-model="form.videoType"
          placeholder="请选择"
          @change="eventChange"
          :disabled="dialogMode == 'edit'"
        >
          <el-option label="足球" value="0" />
          <el-option label="篮球" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="typeId">
        <el-select v-model="form.typeId" placeholder="请选择" filterable>
          <el-option
            :label="item.typeName"
            :value="item.id"
            v-for="(item, index) in typeOptions"
            :key="index"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联赛选择" prop="leagueName">
        <el-select
          style="width: 100%"
          :loading="matchLoading"
          :disabled="selectableMatch"
          v-model="leagueNameItem"
          :placeholder="
            selectableMatch
              ? '!请先选择赛事时间和视频分类,请选择联赛名称'
              : '请选择'
          "
          filterable
          @change="leagueChange"
          value-key="id"
          v-if="dialogMode == 'add'"
        >
          <el-option
            :label="item.name_zh"
            :value="item"
            v-for="(item, index) in matchOptions"
            :key="index"
          />
        </el-select>
        <el-input
          v-model="form.leagueName"
          v-if="dialogMode == 'edit'"
          disabled
        />
      </el-form-item>
      <el-form-item label="关联比赛" prop="matchName">
        <el-select
          v-if="dialogMode == 'add'"
          style="width: 100%"
          :loading="relativeMatchLoading"
          :disabled="selectableRelativeMatch"
          v-model="matchNameItem"
          :placeholder="
            selectableRelativeMatch
              ? '!请先选择赛事时间、视频分类和联赛名称'
              : '请选择'
          "
          filterable
          value-key="id"
          @change="matchNameChange"
        >
          <el-option
            :label="`${item.eventName}(${item.homeTeamName} - ${item.awayTeamName})`"
            v-for="(item, index) in relativeMatchOptions"
            :key="index"
            :value="item"
          />
        </el-select>
        <el-input
          v-model="form.matchName"
          v-if="dialogMode == 'edit'"
          disabled
        />
      </el-form-item>
      <el-form-item label="有效时间" prop="startTime">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="[
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 2, 1, 23, 59, 59)
          ]"
          @change="timeChange"
        />
      </el-form-item>
      <el-form-item label="封面图片" prop="videoImg">
        <el-upload
          class="videoImg-uploader"
          action="/api/admin/v2/upload/image"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="{ 'Access-Token': getToken() }"
        >
          <div v-if="form.videoImg">
            <el-image
              style="width: 178px; height: 178px"
              :src="form.videoImg"
              fit="contain"
            />
            <div>
              <el-button type="success" v-if="form.videoImg"
                >上传上传(小于1M)</el-button
              >
            </div>
          </div>
          <el-icon v-else class="uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="视频浏览">
        <video
          v-if="form.videoSrc"
          controls
          id="videoplay"
          :src="form.videoSrc"
          style="width: 200px; height: 260px"
        />
      </el-form-item>
      <el-form-item label="视频上传" prop="videoSrc">
        <el-upload
          :on-change="fileBeforeUpload"
          ref="videoUpload"
          class="upload-demo"
          :action="videoUploadPath"
          :limit="1"
          :on-exceed="handleExceed"
          :auto-upload="false"
          :data="uploadVideoParams"
          :on-success="videoUoloadSuccess"
        >
          <template #trigger>
            <el-button type="primary" :loading="videoUploadloading"
              >选择文件</el-button
            >
          </template>
          <el-button
            class="ml-3"
            type="success"
            @click="submitUpload"
            :loading="videoUploadloading"
          >
            开始上传
          </el-button>
        </el-upload>
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
