<script setup lang="ts">
import { ref } from "vue";
import { getToken } from "@/utils/token";
import { Plus } from "@element-plus/icons-vue";
import { updateMatchAdvert, addMatchAdvert } from "@/api/advert/liveadvert";
import { ElMessage, ElMessageBox } from "element-plus";

defineOptions({
  name: "EditAdDialog"
});
const title = ref<string>("新增广告");
const visible = ref<boolean>(false);
const loading = ref<boolean>(false);
const dialogMode = ref("add");
const form = ref<any>({
  headAdvert: "",
  bottomAdvert: "",
  pic: "",
  position: ""
});

const rules = {
  headAdvert: {
    required: true,
    message: "请输入头部广告",
    trigger: "blur"
  },
  bottomAdvert: {
    required: true,
    message: "请输入底部广告",
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

const emits = defineEmits(["close"]);

const handleAvatarSuccess = response => {
  form.value.pic = response.data;
};

const saveForm = async () => {
  loading.value = true;
  let res;
  if (dialogMode.value === "add") {
    res = await addMatchAdvert({
      ...form.value
    });
  }
  if (dialogMode.value === "edit") {
    res = await updateMatchAdvert({ ...form.value });
  }
  if (res.code == 200) {
    ElMessage({
      message: "保存成功",
      type: "success"
    });
  } else {
    ElMessageBox.confirm(res.massage, "Warning", {
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
  if (type === "edit") {
    form.value = {
      ...row
    };
    dialogMode.value = "edit";
    title.value = "编辑广告";
  } else {
    form.value = {
      headAdvert: "",
      bottomAdvert: "",
      pic: "",
      position: "",
      matchID: row.matchID,
      matchType: row.sportsType
    };
    dialogMode.value = "add";
    title.value = "新增广告";
  }
};

defineExpose({
  open
});
</script>

<template>
  <el-dialog v-model="visible" :title="title" @closed="handleClose">
    <el-form :model="form" :rules="rules">
      <el-form-item label="头部广告语" prop="headAdvert">
        <el-input
          v-model="form.headAdvert"
          type="textarea"
          :rows="3"
          placeholder="请输入头部广告语"
        />
      </el-form-item>
      <el-form-item label="底部广告语" prop="bottomAdvert">
        <el-input
          v-model="form.bottomAdvert"
          type="textarea"
          :rows="3"
          placeholder="请输入头部广告语"
        />
      </el-form-item>
      <el-form-item label="二维码位置" prop="position">
        <el-select v-model="form.position">
          <el-option label="左上角" :value="1" />
          <el-option label="左下角" :value="2" />
          <el-option label="右上角" :value="3" />
          <el-option label="右下角" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="二维码图片" prop="pic">
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
                style="width: 178px; height: 178px"
                :src="form.pic"
                fit="contain"
              />
            </div>
            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div>图片支持JPG、JPEG、PNG格式，大小不超过5M。</div>
        </div>
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
