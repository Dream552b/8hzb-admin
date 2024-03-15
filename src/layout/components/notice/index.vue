<script setup lang="ts">
import { ref } from "vue";
import { noticesData } from "./data";
import Bell from "@iconify-icons/ep/bell";
import router from "@/router";

const noticesNum = ref(0);
const notices = ref(noticesData);
const showDot = ref(true);

notices.value.map(v => (noticesNum.value += v.list.length));
const goSysMessagePage = () => {
  showDot.value = false;
  router.push({ name: "SysMessage", query: { type: "msg" } });
};
</script>

<template>
  <span
    class="dropdown-badge navbar-bg-hover select-none"
    @click="goSysMessagePage"
  >
    <el-badge :is-dot="showDot">
      <span class="header-notice-icon">
        <IconifyIconOffline :icon="Bell" />
      </span>
    </el-badge>
  </span>
  <!-- <el-dropdown trigger="click" placement="bottom-end"> -->

  <!-- <template #dropdown>
      <el-dropdown-menu>
        <el-tabs
          :stretch="true"
          v-model="activeKey"
          class="dropdown-tabs"
          :style="{ width: notices.length === 0 ? '200px' : '330px' }"
        >
          <el-empty
            v-if="notices.length === 0"
            description="暂无消息"
            :image-size="60"
          />
          <span v-else>
            <template v-for="item in notices" :key="item.key">
              <el-tab-pane
                :label="`${item.name}(${item.list.length})`"
                :name="`${item.key}`"
              >
                <el-scrollbar max-height="330px">
                  <div class="noticeList-container">
                    <NoticeList :list="item.list" />
                  </div>
                </el-scrollbar>
              </el-tab-pane>
            </template>
          </span>
        </el-tabs>
      </el-dropdown-menu>
    </template> -->
  <!-- </el-dropdown> -->
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  margin-right: 10px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  .noticeList-container {
    padding: 15px 24px 0;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 36px;
  }
}
</style>
