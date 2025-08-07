<template>
  <n-input class="input-with-btn-wrapper" :theme-overrides="inputThemeOverrides" v-bind="$attrs">
    <template #suffix>
      <n-button class="search-btn" text type="primary">
        <n-icon size="24">
          <Search />
        </n-icon>
      </n-button>
    </template>
  </n-input>
</template>

<script setup lang="ts">
import { NInput, NButton, NIcon } from 'naive-ui'
import { Search } from '@vicons/ionicons5'

const inputThemeOverrides = {
  heightMedium: '36px'
}
</script>

<style scoped lang="less">
.input-with-btn-wrapper {
  width: 604px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 4px 4px 4px 4px;

  .search-btn {
    width: 32px;
    height: 32px;
    border-radius: 4px 4px 4px 4px;
    padding: unset;
  }
}
</style>
