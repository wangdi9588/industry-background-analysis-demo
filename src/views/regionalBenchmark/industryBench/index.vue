<template>
  <div class="industry-bench-wrapper">
    <div class="bench-mark-items">
      <div v-for="ele in industryCityBenchData" :key="ele.city" class="bench-mark-item">
        <div class="bench-title-group">
          <p class="bench-title">{{ ele.city }}</p>
          <span>全国市场占有率</span>
        </div>
        <div class="bench-value-items">
          <div v-for="item in ele.industries" :key="item.label" :class="['bench-value-item', { 'bench-value-item-strong': item.value > 50 }]">
            <span class="bench-value-item-label">{{ item.label }}</span>
            <span class="bench-value-item-value">{{ item.value }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { industryCityBenchData } from './mock'
</script>

<style scoped lang="less">
.industry-bench-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  display: flex;
  gap: 8px;
  .bench-mark-item {
    width: 438px;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.2);

    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    .bench-title-group {
      height: 90px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .bench-title {
        color: #fff;
        text-align: center;
        font-weight: 600;
        font-size: 26px;
      }
    }

    .bench-value-items {
      padding-top: 16px;
      width: 100%;
      height: 0;
      flex: 1;
      overflow-y: auto;
    }
    .bench-value-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px 12px;
      margin-bottom: 10px;
      height: 90px;
      padding-left: 20px;
      font-size: 22px;
      font-weight: bold;
      color: #cceeff;
      background: linear-gradient(
        139deg,
        rgba(95, 178, 255, 0.1) 0%,
        rgba(95, 168, 255, 0.16) 61%,
        rgba(95, 204, 255, 0.32) 83%,
        rgba(69, 132, 242, 0.24) 100%
      );

      &.bench-value-item-strong {
        background: linear-gradient(135deg, rgba(141, 237, 255, 0.5), rgba(31, 178, 224, 0.5) 100%);
      }
      .bench-value-item-label {
        color: #fff;
      }
      .bench-value-item-value {
        font-size: 22px;
        line-height: 64px;
        font-family: DingTalkSans;
        font-weight: 700;
        color: #14fffe;
      }
    }
  }

  .bench-mark-items {
    width: 0;
    flex: 1;
    height: 100%;
    display: flex;
    gap: 8px;
    overflow: auto;
  }
}
</style>
