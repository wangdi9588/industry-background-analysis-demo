<template>
  <div class="company-list-pagination-group-wrapper">
    <div class="company-list-scroll-content">
      <div class="company-info-item" v-for="item in companyList" :key="item.id" :style="{ '--company-icon-bg-color': generateColor() }">
        <div class="company-short-name-icon">{{ item.shortName }}</div>
        <div class="company-info-right-content">
          <div class="company-name-group">
            <p class="company-name">{{ item.companyName }}</p>
            <div class="ellipsis-tags">
              <BaseNaiveTagEllipsis
                :origin-data="item.companyTag"
                :colorList="{ default: ['rgba(20,255,254,1)', 'rgba(20, 255, 254, 0.1)'] }"
              ></BaseNaiveTagEllipsis>
            </div>
          </div>
          <div class="company-info-basic-items">
            <div v-for="ele in baseInfoKeys" :key="ele.key" class="company-info-basic-item" :style="{ '--basic-column-span': ele.span }">
              <span class="company-info-basic-item-label">{{ ele.label }}：</span>
              <div class="company-info-basic-item-value">
                {{ item[ele.key as keyof typeof item] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <n-pagination class="common-page"></n-pagination>
  </div>
</template>

<script setup lang="ts">
import { BaseNaiveTagEllipsis } from '@/components/BaseNaiveTagEllipsis'
import { companyList } from '../mock'

const baseInfoKeys = [
  {
    label: '法人',
    key: 'legalPerson',
    span: 1
  },
  {
    label: '注册资本',
    key: 'registeredCapital',
    span: 1
  },

  {
    label: '成立日期',
    key: 'establishmentDate',
    span: 1
  },
  {
    label: '地址',
    key: 'address',
    span: 3
  }
]

const colorList = [
  '#2E86AB', // 深蓝
  '#A23B72', // 紫红
  '#3B1F2B', // 棕黑
  '#1E555C', // 墨绿
  '#4B1D3F', // 绛紫
  '#0E4D64', // 深海蓝
  '#5C0029', // 酒红
  '#3C1518', // 深褐
  '#1D4E89', // 海军蓝
  '#5D2A42', // 暗紫
  '#264653', // 炭蓝
  '#6B2737', // 深玫红
  '#2A3D45', // 石板灰
  '#8D5A97', // 深丁香
  '#3E5C76', // 钢蓝
  '#4C061D', // 黑醋栗
  '#3A405A', // 深靛蓝
  '#7D387D', // 深兰花紫
  '#2D545E', // 孔雀石
  '#5F0F40' // 深梅子
]

function generateColor() {
  const length = colorList.length

  const randomIndex = Math.floor(Math.random() * length)

  return colorList[randomIndex]
}
</script>

<style scoped lang="less">
.company-list-pagination-group-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .company-list-scroll-content {
    width: 100%;
    height: 0;
    flex: 1;
    overflow-y: auto;
    margin-top: 8px;

    .company-info-item {
      padding: 24px;
      background-color: rgba(31, 153, 255, 0.2);
      margin-bottom: 8px;
      display: flex;
      gap: 16px;

      .company-short-name-icon {
        width: 64px;
        height: 64px;

        margin-top: 8px;
        color: #fff;
        font-size: 16px;
        padding: 8px 15px;
        border-radius: 2px;
        text-align: center;
        background-color: var(--company-icon-bg-color);
      }

      .company-info-right-content {
        width: 0;
        flex: 1;

        .company-name-group {
          display: flex;
          align-items: center;
          gap: 16px;
          .company-name {
            font-size: 18px;
            font-weight: 700;
          }
          .ellipsis-tags {
            width: 0;
            flex: 1;
          }
        }
      }
      .company-info-basic-items {
        margin-top: 16px;
        display: grid;
        grid-template-columns: repeat(4, minmax(max-content, 1fr));
        gap: 8px 48px;
        .company-info-basic-item {
          grid-column-start: span var(--basic-column-span);
          display: flex;

          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          .company-info-basic-item-label {
            color: #ccc;
          }

          .company-info-basic-item-value {
            width: 0;
            flex: 1;
            color: #fff;
          }
        }
      }
    }
  }

  .common-page {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }
}
</style>
