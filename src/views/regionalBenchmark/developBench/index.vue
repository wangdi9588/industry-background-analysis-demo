<template>
  <div class="develop-bench-wrapper">
    <div class="bench-mark-item">
      <p class="bench-title">对标项</p>
      <div class="bench-value-items">
        <p v-for="item in benchMarkList" :key="item.key" class="bench-value-item">{{ item.label }}</p>
      </div>
    </div>
    <div class="bench-mark-items">
      <div v-for="ele in cityBenchMarkDatas" :key="ele.benchCityName" class="bench-mark-item">
        <p class="bench-title">{{ ele.benchCityName }}</p>
        <div class="bench-value-items">
          <div v-for="item in benchMarkList" :key="item.key" class="bench-value-item bench-city-value-item">
            <div
              :class="['progress-bar', { 'progress-bar-max': benchKeyMaxInfos[item.key].maxCityName === ele.benchCityName }]"
              :style="{ '--progress-bar-width': `${(ele[item.key] / benchKeyMaxInfos[item.key].maxValue) * 100}%` }"
            ></div>
            <span class="bench-value">{{ ele[item.key] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { benchMarkList, cityBenchMarkDatas, benchKeyMaxInfos } from './mock'
</script>

<style scoped lang="less">
.develop-bench-wrapper {
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

    .bench-title {
      height: 90px;
      line-height: 90px;
      width: 100%;
      color: #fff;
      text-align: center;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      font-size: 26px;
      margin: 0px auto;
      white-space: nowrap;
    }

    .bench-value-items {
      padding-top: 16px;
    }
    .bench-value-item {
      width: 100%;
      height: 64px;
      padding-left: 20px;
      font-size: 22px;
      font-weight: bold;
      color: #cceeff;
      display: flex;
      align-items: center;
      &:nth-child(odd) {
        background: linear-gradient(
          139deg,
          rgba(95, 178, 255, 0.1) 0%,
          rgba(95, 168, 255, 0.16) 61%,
          rgba(95, 204, 255, 0.32) 83%,
          rgba(69, 132, 242, 0.24) 100%
        );
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
  .bench-city-value-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;

    .progress-bar {
      width: 280px;
      height: 14px;
      display: inline-block;
      position: relative;
      &::after {
        content: '';
        display: inline-block;
        height: 100%;
        width: var(--progress-bar-width);
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(90deg, #46a0ff 0%, #4ee2f4 100%);
        border-radius: 6px;
        transition: width 0.3s;
      }

      &.progress-bar-max {
        &::after {
          background: linear-gradient(90deg, #ffc64c 0%, #ffe9a8 100%);
        }
      }
    }

    .bench-value {
      font-size: 22px;
      line-height: 64px;
      font-family: DingTalkSans;
      font-weight: 700;
      color: #14fffe;
    }
  }
}
</style>
