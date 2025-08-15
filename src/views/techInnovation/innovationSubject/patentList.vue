<template>
  <div v-for="(item, index) in listData" :key="index" class="list-item-card">
    <div class="list-item-title">{{ item.name }}</div>
    <BaseNaiveTagEllipsis :originData="item.type"></BaseNaiveTagEllipsis>
    <div class="list-item-base-info-items">
      <template v-for="ele in baseInfoKeys" :key="ele.key">
        <span>{{ ele.label }}：</span>
        <div class="list-item-base-info-item-value">
          <n-ellipsis>{{ item[ele.key as keyof IPatentInfoItem] }}</n-ellipsis>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseNaiveTagEllipsis } from '@/components/BaseNaiveTagEllipsis'
import { IPatentInfoItem } from './types'

withDefaults(defineProps<{ listData: IPatentInfoItem[] }>(), {
  listData: () => []
})

const baseInfoKeys = [
  {
    label: '申请（专利权）人',
    key: 'applicant',
    span: 1
  },
  {
    label: '申请号',
    key: 'applicationNumber',
    span: 1
  },

  {
    label: '公开日',
    key: 'publicationDate',
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
