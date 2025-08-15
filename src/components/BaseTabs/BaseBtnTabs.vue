<template>
  <div class="base-btn-tab-items">
    <div
      v-for="(item, index) in tabOptions"
      :key="item.value || index"
      :class="['base-btn-tab-item', { 'base-btn-tab-item-active': value === item.value }]"
      @click="handleSwitchTab(item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseTabsOption } from './types'

defineOptions({
  name: 'BaseBtnTabs'
})

withDefaults(
  defineProps<{
    tabOptions?: BaseTabsOption[]
    value: string
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
    ],
    value: ''
  }
)

const emits = defineEmits<{ (e: 'update:value', value: string | number): void }>()

function handleSwitchTab(item: BaseTabsOption) {
  emits('update:value', item.value)
}

// const themeOverrides = {
//   tabFontWeightActive: 700,
//   tabFontSizeMedium: '16px',
//   tabPaddingMediumLine: '8px 0',
//   tabTextColorLine: '#fff',
//   tabTextColorHoverLine: '#14FFFE',
//   tabTextColorActiveLine: '#14FFFE',
//   barColor: '#14FFFE'
// }
</script>

<style scoped lang="less">
.base-btn-tab-items {
  display: flex;

  .base-btn-tab-item {
    min-width: 114px;
    height: 34px;
    border: 1px solid #374f64;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    &.base-btn-tab-item-active {
      background: rgba(35, 229, 255, 0.1);
      border: 1px solid #23e5ff;
      font-weight: 700;
      color: #23e5ff;
    }
  }
}
</style>
