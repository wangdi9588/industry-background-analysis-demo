<template>
  <div class="regional-benchmark-wrapper">
    <BaseTabs v-model:value="activeTab" :tab-options="tabOptions"></BaseTabs>
    <div class="regional-component-content">
      <component :is="activeComponent"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseTabs } from '@/components/BaseTabs'
import DevelopBench from './developBench/index.vue'
import IndustryBench from './industryBench/index.vue'
import PolicyBench from './policyBench/index.vue'

const tabOptions = [
  {
    label: '发展对标',
    value: 'developBench'
  },
  {
    label: '产业对标',
    value: 'industryBench'
  },
  {
    label: '政策对标',
    value: 'policyBench'
  }
]

const activeTab = ref('developBench')

const activeComponent = computed(() => {
  if (activeTab.value === 'developBench') {
    return DevelopBench
  } else if (activeTab.value === 'industryBench') {
    return IndustryBench
  }
  return PolicyBench
})
</script>

<style scoped lang="less">
.regional-benchmark-wrapper {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  .regional-component-content {
    width: 100%;
    height: 0;
    flex: 1;
  }
}
</style>
