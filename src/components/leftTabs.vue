<template>
  <div class="tab-menu-items">
    <div
      v-for="item in menuList"
      :key="item.key"
      :class="['tab-menu-item', { 'tab-menu-item-active': activeMenuTab === item.key }]"
      @click="handleTabClick(item.key)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface ITabsMenuItem {
  key: string
  name: string
}
interface ILeftTabsProp {
  menuList: ITabsMenuItem[]
  activeMenuTab: string
}
const props = withDefaults(defineProps<ILeftTabsProp>(), {
  menuList: () => [],
  activeMenuTab: ''
})

const emits = defineEmits<{ (e: 'update:activeMenuTab', value: string): void }>()

function handleTabClick(key: string) {
  if (key === props.activeMenuTab) return
  emits('update:activeMenuTab', key)
}
</script>

<style scoped lang="less">
.tab-menu-items {
  // width: 40px;
  position: relative;
  z-index: 10;
  background: url('@/assets/images/enter/letBar.png') no-repeat;
  border-right: 1px solid #5f6e7b;
  .tab-menu-item {
    cursor: pointer;
    width: 56px;
    height: 158px;
    background: url('@/assets/images/enter/tab_default.png') no-repeat;
    background-size: 100% 100%;
    font-size: 20px;
    font-weight: 600;
    color: #bce2ff;
    padding: 24px 17px;
    margin-top: -12px !important;
    &:first-child {
      margin-top: 0;
    }
    &.tab-menu-item-active {
      background: url('@/assets/images/enter/tab_active.png') no-repeat;
      background-size: 100% 100%;
      color: #28ffdb;
      margin-top: -12px !important;
    }
  }
}
</style>
