<template>
  <div class="cooperative-relation-wrapper">
    <div class="cooperative-relation-left">
      <div class="cooperative-unit-list">
        <div class="table-row-info table-header-row">
          <span
            v-for="item in cooperativeUnitHeads"
            :key="item.key"
            :style="{ width: item.flex ? 0 : item.width, flex: item.flex || '' }"
            class="table-row-td"
          >
            {{ item.label }}
          </span>
        </div>
        <div class="cooperative-scroll-content">
          <div v-for="ele in cooperationData" :key="ele.unitName" class="table-row-info">
            <div
              v-for="item in cooperativeUnitHeads"
              :key="item.key"
              :style="{ width: item.flex ? 0 : item.width, flex: item.flex || '' }"
              class="table-row-td"
            >
              <n-ellipsis>
                {{ ele[item.key as ICooperativeRelationKeys] }}
              </n-ellipsis>
            </div>
          </div>
        </div>
        <div v-for="(ele, index) in cooperativeLocalList" :key="ele.unitName" :class="`table-row-info table-row-info-${index}`">
          <div
            v-for="item in cooperativeUnitHeads"
            :key="item.key"
            :style="{ width: item.flex ? 0 : item.width, flex: item.flex || '' }"
            class="table-row-td"
          >
            <n-ellipsis>
              {{ ele[item.key as ICooperativeRelationKeys] }}
            </n-ellipsis>
          </div>
        </div>
      </div>
      <CardContent title="产业分布">
        <BasePieChart :origin-data="industryTrendData" :widthTxt="80" :legendTextSize="10" :labelTextSize="8"></BasePieChart>
      </CardContent>
    </div>
    <div class="cooperative-relation-right">
      <BaseG2ChordChart :chart-data="companyCooperationRelationChartData"></BaseG2ChordChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CardContent } from '@/components/common'
import BasePieChart from '@/components/commonCharts/BasePieChart.vue'
import { cooperationData, industryTrendData, companyCooperationRelationChartData } from './mock'
import { ICooperativeRelationKeys } from './types'
import BaseG2ChordChart from '@/components/commonCharts/BaseG2ChordChart.vue'

const cooperativeUnitHeads = [
  {
    label: '合作单位',
    key: 'unitName',
    flex: 1
  },
  {
    label: '合作项目数',
    key: 'projectNum',
    width: '100px'
  },
  {
    label: '合作项目占比',
    key: 'projectRate',
    width: '100px'
  }
]

const cooperativeLocalList = [
  {
    unitName: '本地合作企业',
    projectNum: 20,
    projectRate: '20%'
  },
  {
    unitName: '本省合作企业',
    projectNum: 38,
    projectRate: '36%'
  }
]
</script>

<style scoped lang="less">
.cooperative-relation-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px 16px;
  border: 1px solid rgba(21, 184, 255, 0.5);
  display: flex;

  .cooperative-relation-left {
    width: 474px;
    height: 100%;
    display: grid;
    grid-template-rows: minmax(0, 1fr) 284px;

    .cooperative-unit-list {
      height: 100%;
      display: flex;
      flex-direction: column;

      .cooperative-scroll-content {
        width: 100%;
        flex: 0 1 auto;
        overflow: auto;
      }
    }
  }

  .cooperative-relation-right {
    width: 0;
    flex: 1;
    height: 100%;
  }

  .table-row-info {
    display: flex;
    align-items: center;
    height: 44px;
    margin-bottom: 4px;
    background-color: rgba(31, 153, 255, 0.2);
    padding: 8px 12px;

    &.table-header-row {
      background: linear-gradient(270deg, rgba(87, 173, 255, 0) 0%, #65d0ff66 100%);
    }
    &.table-row-info-0 {
      background: rgba(56, 229, 140, 0.15);
    }
    &.table-row-info-1 {
      background: rgba(255, 198, 76, 0.2);
    }
  }
}
</style>
