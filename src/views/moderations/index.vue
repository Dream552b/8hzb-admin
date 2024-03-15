<script setup lang="ts">
import { reactive, ref } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { getSensitiveWordList, delSensitiveWord } from "@/api/moderations";
import dayjs from "dayjs";
import Edit from "./components/edit.vue";
import { ElMessageBox, ElMessage } from "element-plus";
defineOptions({
  name: "ModerationsIndex"
});
const formRef = ref<any>();
const EditRef = ref<any>();
const form = reactive({
  // sensitiveWord: "",
  // sensitiveWordPinyin: "",
  // pinyinStatus: 0
  sensitiveWord: ""
});
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
});
const list = ref<any>([]);
const loading = ref<boolean>(false);
const multipleSelection = ref<any>([]);
const columns = ref<any>([
  {
    label: "ID",
    prop: "id"
  },
  {
    label: "敏感词",
    prop: "sensitiveWord"
  },
  {
    label: "敏感词拼音",
    prop: "sensitiveWordPinyin"
  },
  {
    label: "是否拼音敏感词",
    prop: "pinyinStatus",
    formatter: (row, col, val) => {
      return val == 1 ? "是" : "否";
    }
  },
  {
    label: "添加人",
    prop: "adminUserName"
  },
  {
    label: "添加时间",
    prop: "createdAT",
    formatter: (row, col, val) => {
      return dayjs.unix(val).format("YYYY-MM-DD HH:mm:ss");
    }
  }
]);
const getList = async () => {
  loading.value = true;
  const parmas = {
    ...form,
    page: pagination.value.pageNum,
    limit: pagination.value.pageSize
  };
  const res = await getSensitiveWordList(parmas);
  loading.value = false;
  if (res.code === 200) {
    const { records, total } = res.data;
    list.value = records || [];
    pagination.value.total = total;
  }
};

getList();

const search = () => {
  getList();
};

const reset = () => {
  formRef.value.resetFields();
  getList();
};

const add = () => {
  EditRef.value.open({ mode: "add" });
};
const edit = row => {
  EditRef.value.open({ mode: "edit", row });
};

const handleSelectionChange = rows => {
  multipleSelection.value = rows;
};

const delRow = async row => {
  ElMessageBox.confirm("确定要删除吗？", "信息", {
    type: "warning"
  })
    .then(async () => {
      loading.value = true;
      const res = await delSensitiveWord({ ids: [row.id] });
      if (res.code === 200) {
        ElMessage({
          message: "删除成功",
          type: "success"
        });
      }
      loading.value = false;
      getList();
    })
    .catch(() => {});
};

const batchDel = () => {
  if (multipleSelection.value.length === 0) {
    return ElMessage({
      message: "请勾选数据",
      type: "warning"
    });
  }
  ElMessageBox.confirm("确定要批量删除吗？", "信息", {
    type: "warning"
  })
    .then(async () => {
      const ids = multipleSelection.value.map((item: any) => item.id);
      loading.value = true;
      const res = await delSensitiveWord({ ids });
      if (res.code === 200) {
        ElMessage({
          message: "删除成功",
          type: "success"
        });
      }
      loading.value = false;
      getList();
    })
    .catch(() => {});
};

const pageChange = () => {
  getList();
};
</script>

<template>
  <el-card shadow="never">
    <el-form :model="form" ref="formRef" inline>
      <el-form-item label="敏感词" prop="sensitiveWord">
        <el-input placeholder="请输入敏感词" v-model="form.sensitiveWord" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="reset">刷新</el-button>
        <el-button type="primary" @click="add">添加</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button type="danger" @click="batchDel">批量删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-scrollbar v-loading="loading">
      <el-table
        class="table"
        border
        :data="list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
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
          <!-- <template #default="{ row }" v-if="item.prop == 'pushUrl'">
            <div
              @click="copyUrl(row)"
              style="display: flex; align-items: center"
            >
              <el-icon style="margin-right: 5px; cursor: pointer"
                ><CopyDocument color="#009688" /></el-icon
              ><span id="pushUrl">{{ row[item.prop] }}</span>
            </div>
          </template> -->
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="delRow(row)"
              >删除
            </el-button>
            <el-button type="primary" size="small" @click="edit(row)"
              >编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-row style="margin-top: 20px" justify="end">
      <Pagination v-model:pagination="pagination" @page-change="pageChange" />
    </el-row>

    <Edit ref="EditRef" @close="getList" />
  </el-card>
</template>
