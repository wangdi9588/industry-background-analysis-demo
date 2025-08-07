<template>
  <n-tabs type="line" v-bind="$attrs" :theme-overrides="themeOverrides">
    <n-tab v-for="item in tabOptions" :key="item.value" :name="item.value">{{ item.label }}</n-tab>
  </n-tabs>
</template>

<script setup lang="ts">
import { BaseTabsOption } from './types'

defineOptions({
  name: 'BaseTabs'
})

withDefaults(
  defineProps<{
    tabOptions?: BaseTabsOption[]
  }>(),
  {
    tabOptions: () => [
      {
        label: '寂寞围绕着电视',
        value: '幸福'
      },
      {
        label: '垂死坚持',
        value: '的'
      },
      {
        label: '在两点半消失',
        value: '旁边'
      }
    ]
  }
)

const themeOverrides = {
  tabFontWeightActive: 700,
  tabFontSizeMedium: '16px',
  tabPaddingMediumLine: '8px 0',
  tabTextColorLine: '#fff',
  tabTextColorHoverLine: '#14FFFE',
  tabTextColorActiveLine: '#14FFFE',
  barColor: '#14FFFE'
}
</script>

<style scoped lang="less"></style>
