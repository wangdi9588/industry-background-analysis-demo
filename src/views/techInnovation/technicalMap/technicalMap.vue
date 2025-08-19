<template>
  <div class="technical-map-wrapper">
    <CardContent title="技术路线图">
      <template #titleRight>
        <div class="legend-option-items">
          <div v-for="item in legentOptions" :key="item.label" class="legend-option-item" :style="{ '--hqb-legeng-color': item.color }">
            <span>{{ item.label }}</span>
          </div>
        </div>
      </template>
      <BaseScatterChart :origin-data="scatterChartValueData"></BaseScatterChart>
    </CardContent>
  </div>
</template>

<script setup lang="ts">
import { CardContent } from '@/components/common'
import BaseScatterChart from '@/components/commonCharts/BaseScatterChart.vue'
import { scatterChartValueData } from './mock'

const legentOptions = [
  {
    label: '成果数量>100',
    color: '#74e4d9'
  },
  {
    label: '成果数量10-100',
    color: '#46A0FF'
  },
  {
    label: '成果数量<10',
    color: '#f5a588'
  },
  {
    label: '未布局',
    color: '#808080'
  }
]
</script>

<style scoped lang="less">
.technical-map-wrapper {
  width: 100%;
  height: 100%;
  padding-top: 10px;

  border: 1px solid rgba(21, 184, 255, 0.5);
}

.legend-option-items {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  .legend-option-item {
    padding-left: 24px;
    position: relative;
    color: #a9d7ff;
    font-size: 14px;

    &::before {
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      position: absolute;
      background-color: var(--hqb-legeng-color);
      border-radius: 50%;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}
</style>
