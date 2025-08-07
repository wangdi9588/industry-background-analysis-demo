<template>
  <div class="business-entity-wrapper">
    <div class="business-entity-left-content">
      <div class="indicator-card-box">
        <Title title="产业一">
          <template #titleRight>
            <div class="industry-title-right">
              <div>
                <span>1200</span>
                <span>家</span>
              </div>
              <RateContent show-icon tip="" :value="20" unit="家"></RateContent>
            </div>
          </template>
        </Title>
        <div class="industry-indicator-items">
          <div v-for="item in industryCardInfoList" :key="item.title" class="industry-indicator-item">
            <div class="industry-indicator-item-title-group">
              <p class="industry-indicator-item-title">
                <n-ellipsis>{{ item.title }}</n-ellipsis>
              </p>
              <span class="sub-year-title">{{ `${item.year}年` }}</span>
            </div>
            <div class="industry-indicator-item-value-group">
              <div class="main-value-unit-group">
                <span class="indicator-main-value">{{ item.value }}</span>
                <span class="indicator-main-unit">{{ item.unit }}</span>
              </div>
              <RateContent :show-icon="false" :value="item.tbValue" :unit="item.tbUnit"></RateContent>
            </div>
          </div>
        </div>
      </div>
      <CardContent title="产业一年度变化">
        <template #titleRight>单位：家</template>
        <BaseBarLineChart
          y1-axis-unit="家"
          y2-axis-unit="%"
          :origin-data="industryYearTreadChartData"
          :legend="{
            top: 0,
            right: 'center'
          }"
        ></BaseBarLineChart>
      </CardContent>
      <CardContent title="产业一区域分布">
        <template #titleRight>单位：家</template>
        <BaseBarLineChart
          :origin-data="districtDistributeTrendChartData"
          axis-label-wrap
          :axis-label-single-number="4"
          :openZoomLimit="8"
          :dataZoomEndValue="4"
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
    <div class="business-entity-right-content">
      <div class="search-title-group">
        <span class="company-search-title">企业列表</span>
        <InputWithBtn></InputWithBtn>
      </div>
      <BaseTabs v-model:value="activeTab" :tab-options="tabOptions"></BaseTabs>
      <div style="height: 0; flex: 1; width: 100%">
        <CompanyList></CompanyList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CardContent } from '@/components/common'
import { Title } from '@/components/common'
import RateContent from '@/components/common/RateContent/RateContent.vue'
import { districtDistributeTrendData, industryCardInfoList, industryYearTreadRateData, industryYearTreadValueData } from './mock'
import BaseBarLineChart from '@/components/commonCharts/BaseBarLineChart.vue'
import InputWithBtn from '@/components/common/inputWithBtn/inputWithBtn.vue'
import { BaseTabs } from '@/components/BaseTabs'
import CompanyList from './components/companyList.vue'

const industryYearTreadChartData = ref([
  {
    name: '企业数量',
    data: industryYearTreadValueData,
    type: 'bar'
  },
  {
    name: '增长率',
    data: industryYearTreadRateData,
    type: 'line',
    yPosition: 'right'
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

const tabOptions = ref([
  {
    label: '全部企业',
    value: 'all'
  },
  {
    label: '专精特新企业',
    value: '专精特新企业'
  },
  {
    label: '专精特新小巨人企业',
    value: '专精特新小巨人企业'
  },
  {
    label: '上市企业',
    value: '上市企业'
  },
  {
    label: '规上企业',
    value: '规上企业'
  },
  {
    label: '超亿元企业',
    value: '超亿元企业'
  }
])

const activeTab = ref('all')
</script>

<style scoped lang="less">
.business-entity-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  display: flex;
  gap: 24px;

  .business-entity-left-content {
    width: 460px;
    height: 100%;
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    gap: 8px;

    .indicator-card-box {
      // background-color: rgba(31, 153, 255, 0.2);
      display: flex;
      flex-direction: column;
      gap: 12px;
      .industry-title-right {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      .industry-indicator-items {
        height: 0;
        flex: 1;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px 8px;
        padding-bottom: 18px;

        .industry-indicator-item {
          background-color: rgba(31, 153, 255, 0.2);
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          cursor: pointer;

          &:hover {
            background-color: rgba(31, 153, 255, 0.6);
          }

          .industry-indicator-item-title-group {
            display: flex;
            align-items: flex-end;
            gap: 4px;
            .industry-indicator-item-title {
              width: 0;
              flex: 1;
              font-size: 16px;
              color: #fff;
            }
            .sub-year-title {
              font-size: 14px;
              color: #ccc;
            }
          }

          .industry-indicator-item-value-group {
            display: flex;
            align-items: baseline;
            justify-content: space-between;

            .main-value-unit-group {
              display: flex;
              align-items: baseline;
              gap: 8px;

              .indicator-main-value {
                font-size: 24px;
                font-weight: bold;
                font-family: DingTalkSans;
                color: #14fffe;
              }
              .indicator-main-unit {
                font-size: 14px;
                color: #14fffe;
              }
            }
          }
        }
      }
    }
  }
  .business-entity-right-content {
    width: 0;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    // background-color: rgba(31, 153, 255, 0.2);

    .search-title-group {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;

      .company-search-title {
        font-size: 24px;
        color: #fff;
        font-weight: 600;
      }
    }
  }
}
</style>
