<template>
  <div class="innovation-subject-wrapper">
    <div class="flex-item flex-item-left">
      <span class="year-tips">数据更新至2025年</span>
      <BaseBtnTabs v-model:value="activeBtnTab" :tab-options="tabOptions"></BaseBtnTabs>
      <BaseTabs v-model:value="activeTabValue1" :tab-options="activeTabOptions"></BaseTabs>
      <span class="sub-title">研究领域分布</span>
      <BaseBarLineChart
        class="chart-box"
        :isHorizontalBar="true"
        :y1-axis-unit="unifyUnit"
        show-label
        :origin-data="researchFieldDistributeChartData"
        :grid="{
          bottom: '15%',
          top: 0
        }"
      ></BaseBarLineChart>
      <span class="sub-title">近5年申请发表数量</span>
      <BaseBarLineChart
        class="chart-box"
        show-label
        :y1-axis-unit="unifyUnit"
        :origin-data="inventionApplicationsYearTreadChartData"
      ></BaseBarLineChart>
    </div>
    <div class="flex-item">
      <TitleWithInput title="动态列表" placeholder="请输入关键词"></TitleWithInput>
      <div class="tab-box">
        <BaseTabs v-model:value="activeTabValue2" :tab-options="activeTabOptions"></BaseTabs>
      </div>
      <div class="dynamic-list-content">
        <component :is="activeListComponentDataGroup.component" :list-data="activeListComponentDataGroup.data"></component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseBtnTabs from '@/components/BaseTabs/BaseBtnTabs.vue'
import TitleWithInput from '@/components/common/CardContent/TitleWithInput.vue'
import { BaseTabs } from '@/components/BaseTabs'
import BaseBarLineChart from '@/components/commonCharts/BaseBarLineChart.vue'
import {
  industryAcademicProjects,
  innovativeProjects,
  inventionApplicationsYearTreadValueData,
  journalData,
  patentData,
  researchFieldDistributeValueData
} from './mock'
import PatentList from './patentList.vue'
import JournalList from './journalList.vue'
import IndustryAcademicProjectList from './industryAcademicProjectList.vue'
import { IIndustryAcademicProjectInfoItem, IJournalInfoItem, IPatentInfoItem } from './types'
import InnovativeProjectList from './innovativeProjectList.vue'
import { DefineComponent } from 'vue'

const listComponentMap = {
  fmzl: PatentList,
  wxqk: JournalList,
  cxy_project: IndustryAcademicProjectList,
  innovation_project: InnovativeProjectList
}

const mockDataMap = {
  fmzl: patentData,
  wxqk: journalData,
  cxy_project: industryAcademicProjects,
  innovation_project: innovativeProjects
}

const tabOptions = ref([
  { label: '科创成果', value: 'kccg' },
  { label: '创新项目', value: 'cxxm' }
])

const activeBtnTab = ref('kccg')

const activeTabOptions = computed(() => {
  switch (activeBtnTab.value) {
    case 'kccg':
      return [
        {
          label: '发明专利',
          value: 'fmzl'
        },
        {
          label: '文献期刊',
          value: 'wxqk'
        }
      ]
    case 'cxxm':
      return [
        {
          label: '产学研项目',
          value: 'cxy_project'
        },
        {
          label: '创新型项目',
          value: 'innovation_project'
        }
      ]
    default:
      return []
  }
})

const activeTabValue1 = ref('fmzl')
const activeTabValue2 = ref('fmzl')

watch(activeBtnTab, (val) => {
  const type = val === 'kccg' ? 'fmzl' : 'cxy_project'
  nextTick(() => {
    activeTabValue1.value = type
    activeTabValue2.value = type
  })
})

const activeListComponentDataGroup = computed<{
  component: DefineComponent
  data: Array<Partial<IPatentInfoItem & IJournalInfoItem & IIndustryAcademicProjectInfoItem>>
}>(() => {
  return {
    component: listComponentMap[activeTabValue2.value as keyof typeof listComponentMap],
    data: mockDataMap[activeTabValue2.value as keyof typeof mockDataMap]
  }
})

const researchFieldDistributeChartData = ref([
  {
    name: '',
    type: 'bar',
    data: researchFieldDistributeValueData,
    barWidth: 20
  }
])

const inventionApplicationsYearTreadChartData = computed(() => {
  const name = activeBtnTab.value === 'kccg' ? '申请发表数量' : '项目数量'
  return [
    {
      name,
      data: inventionApplicationsYearTreadValueData,
      type: 'bar',
      backgroundStyle: {
        color: 'rgba(255,255,255,0.1)'
      },
      barWidth: 20
    }
  ]
})

const unifyUnit = computed(() => {
  return activeBtnTab.value === 'kccg' ? '件' : '个'
})
</script>

<style scoped lang="less">
.innovation-subject-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 16px;

  .flex-item {
    width: 0;
    flex: 1;
    height: 100%;
    border: 1px solid rgba(21, 184, 255, 0.5);
    padding: 10px 0;
    display: flex;
    flex-direction: column;

    &.flex-item-left {
      padding: 10px 16px;
      gap: 12px;
      position: relative;
      .year-tips {
        color: #23e5ff;
        right: 16px;
        top: 66px;
        position: absolute;
      }

      .sub-title {
        color: #cceeff;
        font-size: 20px;
        font-weight: 700;
      }

      .chart-box {
        height: 0;
        flex: 1;
        width: 100%;
      }
    }

    .tab-box {
      padding: 8px 16px;
    }

    .dynamic-list-content {
      height: 0;
      flex: 1;
      width: 100%;
      overflow-y: auto;
    }
  }
}
</style>
