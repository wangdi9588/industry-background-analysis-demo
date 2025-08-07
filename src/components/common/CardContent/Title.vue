<template>
  <div class="card-head-line" v-bind="$attrs" :style="{ width }">
    <div class="title">{{ title }}</div>
    <div class="title-right">
      <slot name="titleRight"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ITitleProps } from './types'

withDefaults(defineProps<ITitleProps>(), {
  title: '自定义标题',
  width: '100%'
})
</script>
<style lang="less" scoped>
.card-head-line {
  position: relative;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 16px;
  font-size: 16px;
  color: #ebf9ff;
  line-height: 16px;

  background: linear-gradient(270deg, rgba(87, 173, 255, 0) 0%, #65d0ff66 100%);

  .title {
    position: relative;
    z-index: 1;
    font-style: italic;
    font-weight: bold;
    color: #0000;
    // 背景色
    background: linear-gradient(#fff 34%, #78c5fc 86%);
    // 背景绘制在（剪辑到）前景文本内
    background-clip: text;
    -webkit-background-clip: text;
    font-size: 20px;
    font-weight: 700;
    line-height: 25px;
    // 阴影
    filter: drop-shadow(1px 2px 0 rgba(0, 0, 0, 0.6));
  }
  .title-right {
    width: 0;
    flex: 1;
    text-align: right;
  }
}
</style>
