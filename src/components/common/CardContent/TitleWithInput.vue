<template>
  <Title v-bind="props">
    <template #titleRight>
      <n-input v-bind="$attrs">
        <template #suffix>
          <n-icon :component="Search" />
        </template>
      </n-input>
    </template>
  </Title>
</template>

<script setup lang="ts">
import { NInput, NIcon } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import Title from './Title.vue'
import { ITitleProps } from './types'

const props = withDefaults(defineProps<ITitleProps>(), {
  title: '自定义标题',
  width: '100%'
})
</script>

<style scoped lang="less"></style>
