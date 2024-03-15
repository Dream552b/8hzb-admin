<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { getRoleInfo, getRoleTreeData, saveRole } from "@/api/sys/role";
// interface RuleForm {
//   role: any;
//   menuIds: string;
// }

function flattenMenu(menu: any, result = []) {
  for (const item of menu) {
    //@ts-ignore
    result.push(item);
    if (item.childMenu && item.childMenu.length > 0) {
      flattenMenu(item.childMenu, result);
    }
  }
  return result;
}
defineOptions({
  name: "SysRoleEditDialog"
});
const emits = defineEmits(["close"]);
const form = ref<any>({
  menuIds: [],
  role: {
    remark: "",
    roleId: "0",
    roleName: ""
  }
});
const dialogMode = ref<string>("add");
const loading = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);
const rules = reactive<any>({
  role: {
    roleName: [{ required: true, message: "请输入称", trigger: "blur" }],
    remark: [{ required: true, message: "请输入角色描述", trigger: "blur" }]
  },
  menuIds: [{ required: true, message: "请选择功能权限", trigger: "blur" }]
});
const defaultProps = {
  children: "childMenu",
  label: "menuName"
};
const defaultCheckedKeys = ref<number[]>([]);
const treeData = ref<any>();
const formRef = ref<any>();
const saveForm = async () => {
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      const params = {
        ...form.value
      };
      const res = await saveRole(params);
      if (res.code === 200) {
        ElMessage({
          message: "保存成功",
          type: "success"
        });
      }
      dialogVisible.value = false;
      emits("close");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const open = async ({ mode = "add", id = "0" }) => {
  dialogMode.value = mode;
  dialogVisible.value = true;
  loading.value = true;
  const roleTreeData = await getRoleTreeData();
  treeData.value = roleTreeData.data;
  form.value.role.roleId = id;
  if (mode === "edit") {
    const toLinearArr = flattenMenu(roleTreeData.data);
    // 获取所有不是叶子节点的id
    const parentIds = toLinearArr
      .filter((item: any) => item.childMenu && item.childMenu.length > 0)
      .map((item: any) => item.menuId);
    const res = await getRoleInfo({ id });
    const { role, menuIds } = res.data;
    form.value.role.roleName = role.roleName;
    form.value.role.remark = role.remark;
    form.value.menuIds = menuIds;
    defaultCheckedKeys.value = menuIds
      .filter((item: any) => !parentIds.includes(item))
      .map((item: any) => item);
  }
  if (mode === "add") {
    defaultCheckedKeys.value = [];
  }
  loading.value = false;
};

const nodeCheck = (nodes, checkedNodes) => {
  const { checkedKeys, halfCheckedKeys } = checkedNodes;
  form.value.menuIds = [...checkedKeys, ...halfCheckedKeys];
};
defineExpose({
  open
});
</script>
<template>
  <el-dialog
    :title="dialogMode === 'add' ? '新增用户' : '编辑用户'"
    v-model="dialogVisible"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="角色名称" prop="role.roleName">
        <el-input placeholder="请输入称" v-model="form.role.roleName" />
      </el-form-item>
      <el-form-item label="描述" prop="role.remark">
        <el-input
          v-model="form.role.remark"
          :rows="4"
          type="textarea"
          placeholder="角色描述"
        />
      </el-form-item>
      <el-form-item label="功能权限" prop="menuIds">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="menuId"
          :default-expanded-keys="['0']"
          :default-checked-keys="defaultCheckedKeys"
          show-checkbox
          @check="nodeCheck"
          style="min-width: 150px"
        />
      </el-form-item>
    </el-form>
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
