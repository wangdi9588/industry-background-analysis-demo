<template>
  <div v-for="(item, index) in listData" :key="index" class="list-item-card">
    <div class="list-item-title">{{ item.name }}</div>
    <div class="list-item-base-info-items">
      <template v-for="ele in baseInfoKeys" :key="ele.key">
        <span>{{ ele.label }}：</span>
        <div class="list-item-base-info-item-value">
          <n-ellipsis>
            <template v-if="ele.render">
              {{ ele.render(item) }}
            </template>
            <template v-else>{{ item[ele.key as keyof IIndustryAcademicProjectInfoItem] }}</template>
          </n-ellipsis>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseNaiveTagEllipsis } from '@/components/BaseNaiveTagEllipsis'
import { IIndustryAcademicProjectInfoItem } from './types'

withDefaults(defineProps<{ listData: IIndustryAcademicProjectInfoItem[] }>(), {
  listData: () => []
})

const baseInfoKeys = [
  {
    label: '合作单位',
    key: 'partners',
    span: 1,
    render(row: IIndustryAcademicProjectInfoItem) {
      return row.partners.join(',')
    }
  },
  {
    label: '项目进度',
    key: 'progress',
    span: 1
  },
  {
    label: '项目规模',
    key: 'scale',
    span: 1
  },
  {
    label: '项目时间',
    key: 'time',
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
