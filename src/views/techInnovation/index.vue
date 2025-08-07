<template>
  <div class="technology-innovation-wrapper">
    <BaseTabs v-model:value="activeTab" :tab-options="tabOptions"></BaseTabs>
    <div class="technology-component-content">
      <component :is="activeComponent" :component-key="activeTab"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseTabs } from '@/components/BaseTabs'
import SummaryComponent from './summaryComponent.vue'
import InnovationOverview from './innovationOverview/index.vue'

const tabOptions = [
  {
    label: '创新总览',
    value: 'innovationOverview'
  },
  {
    label: '创新主体',
    value: 'innovationSubject'
  },
  {
    label: '技术地图',
    value: 'technicalMap'
  },
  {
    label: '合作关系',
    value: 'cooperativeRelation'
  }
]

const activeTab = ref('innovationOverview')

const activeComponent = computed(() => {
  if (activeTab.value === 'innovationOverview') {
    return InnovationOverview
  }
  return SummaryComponent
})
</script>

<style scoped lang="less">
.technology-innovation-wrapper {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  .technology-component-content {
    width: 100%;
    height: 0;
    flex: 1;
    padding: 10px 0;
  }
}
</style>
