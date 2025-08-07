<template>
  <div class="header-content">
    <div class="header-left-box">
      <div class="system-title">产业本底分析</div>
      <div class="industry-select" ref="industryPopRef">
        <n-popselect class="pop-box" v-model:value="activeIndustry" :to="industryPopRef" :options="industryOptions" trigger="click">
          <div class="pop-select-box">
            <n-ellipsis class="active-industry-name" style="max-width: 220px">{{ activeIndustry }}</n-ellipsis>
            <img class="selectIcon" src="/static/images/header/selectIcon.png" />
          </div>
        </n-popselect>
      </div>
    </div>

    <div class="header-right-box">
      <div class="header-timer-box">
        <p class="timer_time">{{ timeData.time_info }}</p>
        <p class="timer_date">{{ timeData.date_info }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimeHook } from '@/hooks/useTimeHook'
import { NPopselect, NEllipsis } from 'naive-ui'

const { timeData } = useTimeHook()
const industryPopRef = shallowRef()

const industryOptions = ref([
  {
    label: '产业一',
    value: '产业一'
  },
  {
    label: '产业二',
    value: '产业二'
  },
  {
    label: '产业三',
    value: '产业三'
  },
  {
    label: '产业四',
    value: '产业四'
  }
])

const activeIndustry = ref('产业一')
</script>

<style scoped lang="less">
.header-content {
  width: 100%;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px 0;
  background: url('/static/images/header/header_bg.png') no-repeat center / cover;

  .header-left-box {
    display: flex;
    align-items: center;
  }

  .system-title {
    font-family: DouyinSans, DouyinSans;
    font-weight: bold;
    font-style: italic;
    font-size: 36px;

    color: #0000;
    // 背景色
    background: linear-gradient(#fff 34%, #78c5fc 86%);
    // 背景绘制在（剪辑到）前景文本内
    background-clip: text;
    -webkit-background-clip: text;
    // 阴影
    filter: drop-shadow(1px 2px 0 rgba(0, 0, 0, 0.6));
  }

  .industry-select {
    width: 285px;
    display: flex;
    justify-content: flex-end;
    .pop-select-box {
      display: flex;
      align-items: center;
      cursor: pointer;

      :deep(.active-industry-name) {
        font-size: 20px;
        font-weight: bold;
        margin-right: 10px;
        color: #fff;
      }

      .selectIcon {
        width: 33px;
        height: 32px;
        margin-top: 2px;
      }
    }
  }

  .header-right-box {
    .header-timer-box {
      display: flex;
      align-items: center;
      font-family: 'DINMedium';
      gap: 8px;

      .timer_time {
        font-size: 19px;
        font-weight: 500;
        color: #bfe8ff;
      }
      .timer_date {
        font-size: 14px;
        font-weight: 500;
        color: #bfe8ff;
      }
    }
  }
}
</style>
