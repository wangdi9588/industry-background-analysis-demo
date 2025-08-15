<template>
  <div class="common-card-wrapper" v-bind="$attrs">
    <Title v-bind="props">
      <template #titleRight>
        <slot name="titleRight"></slot>
        <!-- 使用具名插槽传递内容 -->
      </template>
    </Title>
    <!-- 为什么加这个属性，我不太想说话 -->
    <div class="card-content" :style="{ padding }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import Title from './Title.vue'
import { ICardContentProps } from './types'

const props = withDefaults(defineProps<ICardContentProps>(), {
  title: '自定义标题',
  padding: 0
})
</script>

<style scoped lang="less">
.common-card-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  background: rgba(31, 153, 255, 0.2);
  overflow: hidden;

  .card-content {
    height: 0;
    flex: 1;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}
</style>
