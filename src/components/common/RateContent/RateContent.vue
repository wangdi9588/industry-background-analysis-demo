<template>
  <div class="rate-group-wrapper">
    <div :class="[{ 'rate-red': rateValue > 0, 'rate-green': rateValue < 0 }]">{{ tip }} {{ symbalRateValue }}{{ unit }}</div>
    <img v-if="rateValue && showIcon" :src="rateValue ? up_png : down_png" alt="" class="rate-icon" />
  </div>
</template>

<script setup lang="ts">
import up_png from './image/up.png'
import down_png from './image/down.png'
import { getNumSymbol } from '@/utils/tools'
import { IRateContentProps } from './types'

const props = withDefaults(defineProps<IRateContentProps>(), {
  value: 0,
  showIcon: false,
  tip: '同比',
  unit: '%',
  precision: 2
})

const rateValue = computed(() => {
  return Number(props.value)
})

const symbalRateValue = computed(() => {
  if (rateValue.value) {
    return getNumSymbol(rateValue.value, props.precision)
  } else {
    return '-'
  }
})
</script>

<style scoped lang="less">
.rate-group-wrapper {
  font-size: 14px;
  line-height: 16px;
  display: flex;

  color: #c0daf6;
  .rate-green {
    color: #38e58c;
  }
  .rate-red {
    color: #ff4a33;
  }
  .rate-icon {
    width: 16px;
    height: 16px;
    margin-left: 4px;
  }
}
</style>
