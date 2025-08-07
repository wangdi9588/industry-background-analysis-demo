<template>
  <n-ellipsis v-bind="$attrs">
    <span v-for="item in changedData" :key="getValue(item)" class="tag-item" :style="getCustomStyle(item)">{{ getValue(item) }}</span>
    <template #tooltip>
      <div class="tag-items">
        <span v-for="item in changedData" :key="getValue(item)" class="tag-item" :style="getCustomStyle(item)">{{ getValue(item) }}</span>
      </div>
    </template>
  </n-ellipsis>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BaseNaiveTagEllipsisProps } from './types'

defineOptions({
  name: 'BaseNaiveTagEllipsis'
})

const props = withDefaults(defineProps<BaseNaiveTagEllipsisProps>(), {
  originData: () => [],
  separator: ';',
  labelKey: 'label',
  colorKey: 'status',
  colorList: () => ({
    default: ['rgba(108, 202, 255, 1)', 'rgba(108, 202, 255, 0.1)']
  })
})

const changedData = computed(() => {
  if (typeof props.originData === 'string') {
    return props.originData.split(props.separator)
  }
  return props.originData
})
const getValue = (item: string | { [key: string]: string }) => {
  if (!item) return ''
  if (typeof item === 'object') {
    return item[props.labelKey]
  } else {
    return item
  }
}

const getCustomStyle = (item: string | { [key: string]: string }) => {
  const key = typeof item === 'string' ? 'default' : item[props.colorKey]
  const [textColor, bgColor] = props.colorList[key || 'default']
  return {
    '--text-color': textColor,
    '--bg-color': bgColor
  }
}
</script>

<style scoped lang="less">
.tag-item {
  border-radius: 2px;
  font-size: 14px;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 14px;
  padding: 5px 8px;
  display: inline-block;
  margin-right: 8px;
}
.tag-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  .tag-item {
    margin-right: unset;
  }
}
</style>
