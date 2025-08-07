<template>
  <div class="innovation-overview-wrapper">
    <div class="indicator-card">
      <Title title="指标数据"></Title>
      <div class="indicator-items">
        <div v-for="item in developIndicatorCardInfoList" :key="item.title" class="indicator-item">
          <div class="indicator-item-title-group">
            <div class="indicator-item-title">
              <n-ellipsis>{{ item.title }}</n-ellipsis>
            </div>
            <span class="indicator-item-sub-title">{{ `更新至${item.year}年` }}</span>
          </div>
          <div class="indicator-item-value-group">
            <div class="main-value-unit-group">
              <span class="indicator-main-value">{{ item.value }}</span>
              <span class="indicator-main-unit">{{ item.unit }}</span>
            </div>
            <RateContent :value="item.tbValue" :unit="item.tbUnit" show-icon></RateContent>
            <div class="detail-btn">
              <span>详情</span>
              <img src="@/assets/images/dot_3x.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <CardContent title="产业分布">
      <template #titleRight>单位：家</template>
      <BasePieChart :origin-data="industryTrendChartData" :widthTxt="180"></BasePieChart>
    </CardContent>
    <CardContent title="年度变化趋势">
      <template #titleRight>单位：家</template>
      <BaseBarLineChart
        :origin-data="annualTreadChartData"
        axis-label-wrap
        :axis-label-single-number="8"
        :gradientColors="[['rgba(78, 226, 214, 1)', 'rgba(0, 225, 255, 0.24)']]"
        :legend="{
          top: 0,
          right: '30%'
        }"
        :grid="{
          bottom: 0
        }"
      ></BaseBarLineChart>
    </CardContent>
    <CardContent title="区县分布">
      <template #titleRight>单位：家</template>
      <BaseBarLineChart
        :origin-data="districtDistributeTrendChartData"
        axis-label-wrap
        :axis-label-single-number="4"
        :openZoomLimit="10"
        :dataZoomEndValue="8"
        :gradientColors="[['rgba(78, 226, 214, 1)', 'rgba(0, 225, 255, 0.24)']]"
        :legend="{
          top: 0,
          right: '30%'
        }"
        :grid="{
          bottom: 0
        }"
      ></BaseBarLineChart>
    </CardContent>
  </div>
</template>

<script setup lang="ts">
import { CardContent } from '@/components/common'
import BaseBarLineChart from '@/components/commonCharts/BaseBarLineChart.vue'
import { parkInnerCompanyCountYearData } from './mock/annualChangeTrendMockData'
import { districtDistributeTrendData } from './mock/districtDistributeMockData'
import { developIndicatorCardInfoList } from './mock'
import BasePieChart from '@/components/commonCharts/BasePieChart.vue'
import { industryTrendData } from './mock/industryTrendMockData'
import { Title } from '@/components/common'
import RateContent from '@/components/common/RateContent/RateContent.vue'
const industryTrendChartData = ref(industryTrendData)

const annualTreadChartData = ref([
  {
    name: '产业一',
    data: parkInnerCompanyCountYearData,
    type: 'bar',
    backgroundStyle: {
      color: 'rgba(255,255,255,0.1)'
    },
    barWidth: 20,
    label: {
      show: true,
      position: 'top',
      color: '#CCEEFF',
      fontSize: 14,
      valueAnimation: true
    },
    showBackground: true
  }
])

const districtDistributeTrendChartData = ref([
  {
    name: '产业一',
    type: 'bar',
    data: districtDistributeTrendData,
    backgroundStyle: {
      color: 'rgba(255,255,255,0.1)'
    },
    barWidth: 20,
    label: {
      show: true,
      position: 'top',
      color: '#CCEEFF',
      fontSize: 14,
      valueAnimation: true
    },
    showBackground: true
  }
])
</script>

<style scoped lang="less">
.innovation-overview-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;

  .indicator-card {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;

    .indicator-items {
      width: 100%;
      height: 0;
      flex: 1;

      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px 8px;
      padding: 16px 0;

      .indicator-item {
        // height: 116px;
        background-color: rgba(31, 153, 255, 0.2);

        padding: 24px 10px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        cursor: pointer;

        &:hover {
          background-color: rgba(31, 153, 255, 0.6);
        }

        .indicator-item-title-group {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 4px;

          .indicator-item-title {
            width: 0;
            flex: 1;
            font-size: 20px;
            font-weight: 700;
            color: #fff;
          }
          .indicator-item-sub-title {
            font-size: 14px;
            color: #ccc;
          }
        }

        .indicator-item-value-group {
          display: flex;
          align-items: baseline;
          justify-content: space-between;

          .main-value-unit-group {
            display: flex;
            align-items: baseline;
            gap: 8px;

            .indicator-main-value {
              font-size: 32px;
              font-weight: bold;
              font-family: DingTalkSans;
              color: #14fffe;
            }
            .indicator-main-unit {
              font-size: 16px;
              color: #14fffe;
            }
          }
        }

        .detail-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background-color: rgba(136, 136, 136, 0.6);
          border-radius: 8px;
          padding: 2px 4px;
          cursor: pointer;
          img {
            width: 18px;
          }
        }
      }
    }
  }
}
</style>
