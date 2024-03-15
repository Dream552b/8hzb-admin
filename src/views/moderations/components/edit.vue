<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  createSensitiveWord,
  updateSensitiveWord
} from "../../../api/moderations";
import { ElMessage } from "element-plus";
defineOptions({
  name: "ModerationsEdit"
});
const emits = defineEmits(["close"]);
const dialogMode = ref<string>("add");
const visible = ref<boolean>(false);
const loading = ref<boolean>(false);
const formRef = ref<any>();
const editRow = ref<any>();
const form = reactive({
  sensitiveWord: "",
  sensitiveWordPinyin: "",
  pinyinStatus: 0
});

const open = ({ mode, row }) => {
  visible.value = true;
  dialogMode.value = mode;
  if (mode === "add") {
    form.sensitiveWord = "";
    form.sensitiveWordPinyin = "";
    form.pinyinStatus = 0;
  }
  if (mode === "edit") {
    editRow.value = row;
    form.sensitiveWord = row.sensitiveWord;
    form.sensitiveWordPinyin = row.sensitiveWordPinyin;
    form.pinyinStatus = row.pinyinStatus;
  }
};

const saveForm = async () => {
  try {
    loading.value = true;
    const res =
      dialogMode.value === "add"
        ? await createSensitiveWord(form)
        : await updateSensitiveWord({
            ...form,
            id: editRow.value.id
          });
    if (res.code === 200) {
      ElMessage({
        message: "保存成功",
        type: "success"
      });
      visible.value = false;
      emits("close");
    }
  } catch (err) {
    console.log("保存数据出错:", err);
  } finally {
    loading.value = false;
  }
};

defineExpose({
  open
});
</script>

<template>
  <el-dialog
    :title="(dialogMode === 'add' && '添加') || '编辑'"
    v-model="visible"
  >
    <el-form :model="form" ref="formRef" label-width="100px">
      <el-form-item label="敏感词" prop="sensitiveWord">
        <el-input placeholder="请输入敏感词" v-model="form.sensitiveWord" />
      </el-form-item>
      <el-form-item label="敏感词拼音" prop="sensitiveWordPinyin">
        <el-input
          placeholder="请输入敏感词拼音"
          v-model="form.sensitiveWordPinyin"
        />
      </el-form-item>
      <el-form-item label="拼音敏感词">
        <el-switch
          v-model="form.pinyinStatus"
          :active-value="1"
          :inactive-value="0"
        />
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
