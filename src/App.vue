<script setup lang="ts">
import { GlobalThemeOverrides, zhCN, dateZhCN, darkTheme } from 'naive-ui'
import { LoadingContent, MessageContent } from '@/components'
import { useSystemScaleHook } from '@/hooks/useGXResizeEventHooks'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#fff',
    primaryColorHover: '#fff',
    primaryColorPressed: '#fff',
    heightMedium: '32px'
  },
  Spin: {
    color: '#bce2ff',
    textColor: '#bce2ff'
  },

  Input: {
    color: 'rgba(62, 165, 255,0.4 )',
    colorFocus: 'rgba(62, 165, 255,0.4 )',
    textColor: '#bce2ff',
    border: 'none',
    borderFocus: 'none',
    caretColor: '#bce2ff'
  },
  Popover: {
    color: '#333',
    textColor: '#fff'
  },

  InternalSelectMenu: {
    optionTextColor: '#bce2ff',
    optionColorPending: 'rgba(25, 75, 141, 1)'
  },

  Pagination: {
    itemColor: 'rgba(25, 75, 141, 0.6)',
    itemColorDisabled: 'rgba(25, 75, 141, 0.4)',
    itemColorHover: 'rgba(25, 75, 141, 0.6)',
    itemColorPressed: 'rgba(25, 75, 141, 1)',
    itemColorActive: '#278ad6',
    itemColorActiveHover: '#278ad6',
    itemTextColor: '#bce2ff',
    itemTextColorHover: '#bce2ff',
    itemTextColorActive: '#fff',
    itemTextColorDisabled: '#ccc',
    itemBorderDisabled: 'transparent',
    itemBorder: 'transparent',
    buttonBorder: 'transparent',
    buttonBorderHover: 'transparent',
    buttonColor: 'rgba(25, 75, 141, 0.6)',
    buttonColorHover: 'rgba(25, 75, 141, 0.6)',
    buttonIconColor: '#bce2ff',
    buttonIconColorHover: '#fff'
  },
  DataTable: {
    thColor: 'rgba(25, 75, 141, 0.8)',
    thColorHover: 'rgba(25, 75, 141, 0.8)',
    thTextColor: '#bce2ff',
    tdColor: 'rgba(55, 107, 174, 0.16)',
    tdColorStriped: 'rgba(25, 75, 141, 0.8)',
    tdColorHover: 'rgba(25, 75, 141, 0.7)',
    borderColor: 'rgba(55, 107, 174, 0.25)',
    tdTextColor: '#bce2ff'
  }
}
useSystemScaleHook()
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="darkTheme" :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <!-- 头部加载效果 注册 -->
      <LoadingContent with-spin>
        <template #description>加载中</template>
        <n-modal-provider>
          <n-message-provider>
            <!-- 全局消息提示 注册 -->
            <MessageContent />
            <router-view></router-view>
          </n-message-provider>
        </n-modal-provider>
      </LoadingContent>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style lang="less">
html,
body {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  width: 100%;
  height: 100%;
  transform-origin: 0% 0%;
  position: relative;

  .n-config-provider {
    width: 100%;
    height: 100%;
  }
  .n-spin-container {
    width: 100%;
    height: 100%;
  }
}
</style>
