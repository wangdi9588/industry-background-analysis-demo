<template>
  <div class="industry-overview-wrapper">
    <div class="industry-overview-left">
      <Title title="上市企业总市值"></Title>
      <div class="total-market-value-group">
        <span class="total-market-value">2039.12</span>
        <span class="total-market-unit">亿元</span>
      </div>
      <Title title="上市企业总市值环节对比"></Title>
      <BaseBarLineChart
        class="enterprise-field-chart-box"
        :isHorizontalBar="true"
        y1-axis-unit="亿元"
        show-label
        :origin-data="companyFieldDistributeChartData"
        :grid="{
          bottom: '10%',
          top: '10%'
        }"
      ></BaseBarLineChart>
    </div>
    <div></div>
    <div class="industry-overview-right">
      <div v-for="ele in overviewTypeDatas" :key="ele.title" class="overview-card-item">
        <p class="overview-card-title">{{ ele.title }}</p>
        <div class="indicator-items">
          <div v-for="item in ele.children" :key="ele.title" class="indicator-item">
            <div class="indicator-item-title-group">
              <div class="indicator-item-title">
                <n-ellipsis>{{ item.title }}</n-ellipsis>
              </div>
            </div>
            <span class="indicator-item-sub-title">{{ `更新至${item.year}年` }}</span>

            <div class="indicator-item-value-group">
              <div class="main-value-unit-group">
                <span class="indicator-main-value">{{ item.value }}</span>
                <span class="indicator-main-unit">{{ item.unit }}</span>
              </div>
              <RateContent tip="" :value="item.tbValue" :unit="item.tbUnit" show-icon></RateContent>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="industry-overview-bottom">
      <CardContent title="动态统计">
        <template #titleRight>
          <span>数据更新至2025年</span>
        </template>
        <BasePieChart :origin-data="dynamicTypePieData" :widthTxt="180" unit="条"></BasePieChart>
      </CardContent>
      <CardContent title="最新动态">
        <Vue3SeamlessScroll :list="dynimicList" hover>
          <template v-slot="{ data }">
            <div class="dynamic-row-item">
              <img src="@/assets/images/left_trigger.png" class="dynamic-icon" alt="" />
              <span class="dynamic-date">{{ data.date }}</span>
              <div class="dynamic-title">
                <n-ellipsis>{{ data.title }}</n-ellipsis>
              </div>
            </div>
          </template>
        </Vue3SeamlessScroll>
      </CardContent>
      <CardContent title="产业营收年度变化趋势">
        <template #titleRight>
          <span>单位：亿元</span>
        </template>
        <BaseBarLineChart
          y1-axis-unit="亿元"
          y2-axis-unit="%"
          :origin-data="industryYearTreadChartData"
          :grid="{
            bottom: 5
          }"
          :legend="{
            top: 10,
            right: 'center'
          }"
        ></BaseBarLineChart>
      </CardContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import Title from '@/components/common/CardContent/Title.vue'
import BaseBarLineChart from '@/components/commonCharts/BaseBarLineChart.vue'
import BasePieChart from '@/components/commonCharts/BasePieChart.vue'
import RateContent from '@/components/common/RateContent/RateContent.vue'
import {
  companyFieldDistributeValueData,
  dynamicTypePieData,
  industrialRevenueBarData,
  industrialRevenueGrowthRateLineData,
  multiCompanyNews
} from './mock'
import { CardContent } from '@/components/common'
import { NEllipsis } from 'naive-ui'
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'

const dynimicList = ref<any[]>(multiCompanyNews)

const companyFieldDistributeChartData = ref([
  {
    name: '企业市值',
    type: 'bar',
    data: companyFieldDistributeValueData,
    barWidth: 16
  }
])

const overviewTypeDatas = ref([
  {
    title: '经济效益',
    children: [
      {
        title: '产业营收',
        year: '2025',
        value: 0,
        unit: '亿元',
        tbValue: 0,
        tbUnit: '%'
      },
      {
        title: '规上企业营收',
        year: '2025',
        value: 0,
        unit: '亿元',
        tbValue: 0,
        tbUnit: '%'
      }
    ]
  },
  {
    title: '经营主体',
    children: [
      {
        title: '产业企业总数',
        year: '2025',
        value: 0,
        unit: '家',
        tbValue: 0,
        tbUnit: '%'
      },
      {
        title: '规上企业',
        year: '2025',
        value: 0,
        unit: '家',
        tbValue: 0,
        tbUnit: '%'
      }
    ]
  },
  {
    title: '科技创新',
    children: [
      {
        title: '年度新增发明专利',
        year: '2025',
        value: 0,
        unit: '件',
        tbValue: 0,
        tbUnit: '%'
      },
      {
        title: '年度新增高新技术产业',
        year: '2025',
        value: 0,
        unit: '家',
        tbValue: 0,
        tbUnit: '%'
      },
      {
        title: '国家重点实验室',
        year: '2025',
        value: 0,
        unit: '家',
        tbValue: 0,
        tbUnit: '%'
      }
    ]
  },
  {
    title: '发展质量',
    children: [
      {
        title: '负债总额',
        year: '2025',
        value: 0,
        unit: '亿元',
        tbValue: 0,
        tbUnit: '%'
      },
      {
        title: '上市企业总市值',
        year: '2025',
        value: 0,
        unit: '亿元',
        tbValue: 0,
        tbUnit: '%'
      },
      {
        title: '园区企业数量',
        year: '2025',
        value: 0,
        unit: '家',
        tbValue: 0,
        tbUnit: '%'
      }
    ]
  }
])

const industryYearTreadChartData = ref([
  {
    name: '产业营收',
    data: industrialRevenueBarData,
    type: 'bar'
  },
  {
    name: '增长率',
    data: industrialRevenueGrowthRateLineData,
    type: 'line',
    yPosition: 'right'
  }
])
</script>

<style scoped lang="less">
.industry-overview-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  display: grid;
  grid-template-columns: 460px 1fr 460px;
  grid-template-rows: 1fr 364px;
  gap: 12px;

  .industry-overview-left {
    width: 387px;
    height: 100%;

    .total-market-value-group {
      padding: 40px 0;
      display: flex;
      justify-content: center;
      align-items: baseline;
      gap: 8px;

      .total-market-value {
        font-size: 66px;
        font-family: DINMedium;
        font-weight: 500;
        color: #e6ffff;
        line-height: 66px;
        margin-right: 10px;
        text-shadow: 0px 0px 16px rgba(119, 202, 255, 0.9);
      }
      .total-market-unit {
        font-size: 20px;
        color: #e6ffff;
      }
    }

    .enterprise-field-chart-box {
      height: 360px;
      width: 100%;
    }
  }
  .industry-overview-right {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;

    .overview-card-item {
      display: flex;
      flex-direction: column;
    }

    .overview-card-title {
      margin-bottom: 4px;
      font-size: 16px;
      color: #fff;
    }
    .indicator-items {
      width: 100%;
      height: 0;
      flex: 1;

      display: flex;
      flex-direction: column;
      gap: 8px;

      .indicator-item {
        // height: 116px;
        background-color: rgba(31, 153, 255, 0.2);

        padding: 10px;

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
            font-size: 16px;
            font-weight: 700;
            color: #fff;
          }
        }

        .indicator-item-sub-title {
          font-size: 14px;
          color: #ccc;
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

  .industry-overview-bottom {
    grid-column-start: span 3;
    display: grid;
    grid-template-columns: 1fr 1fr 460px;
    gap: 16px;
  }

  .dynamic-row-item {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0 12px;
    gap: 6px;

    .dynamic-icon {
      width: 24px;
    }

    .dynamic-date {
      color: #14fffe;
    }
    .dynamic-title {
      width: 0;
      flex: 1;
    }
  }
}
</style>
