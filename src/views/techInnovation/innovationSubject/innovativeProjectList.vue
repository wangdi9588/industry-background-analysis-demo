<template>
  <div v-for="(item, index) in listData" :key="index" class="list-item-card">
    <div class="list-item-title">{{ item.name }}</div>
    <BaseNaiveTagEllipsis :originData="item.type"></BaseNaiveTagEllipsis>
    <div class="list-item-base-info-items">
      <template v-for="ele in baseInfoKeys" :key="ele.key">
        <span>{{ ele.label }}：</span>
        <div class="list-item-base-info-item-value">
          <n-ellipsis>
            <template v-if="ele.render">
              {{ ele.render(item) }}
            </template>
            <template v-else>{{ item[ele.key as keyof IInnovativeProjectInfoItem] }}</template>
          </n-ellipsis>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseNaiveTagEllipsis } from '@/components/BaseNaiveTagEllipsis'
import { IInnovativeProjectInfoItem } from './types'

withDefaults(defineProps<{ listData: IInnovativeProjectInfoItem[] }>(), {
  listData: () => []
})

const baseInfoKeys = [
  {
    label: '合作单位',
    key: 'partners',
    span: 1,
    render(row: IInnovativeProjectInfoItem) {
      return row.partners.join(',')
    }
  },
  {
    label: '项目预算',
    key: 'budget',
    span: 1
  },
  {
    label: '项目关键词',
    key: 'budget',
    span: 1,
    render(row: IInnovativeProjectInfoItem) {
      return row.keywords.join(',')
    }
  },
  {
    label: '项目持续时间',
    key: 'duration',
    span: 1
  }
]
</script>

<style scoped lang="less">
.list-item-card {
  background: rgba(31, 153, 255, 0.2);
  margin: 8px;
  padding: 20px;
  .list-item-title {
    font-size: 16px;
    margin-bottom: 6px;
    color: #fff;
  }

  .list-item-base-info-items {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    margin-top: 6px;
    gap: 4px 0;
    color: #a9d7ff;
  }
}
</style>
