<script setup lang="ts">
import { useLoadingStore } from '@/stores'
import { useLoadingBar } from 'naive-ui'
import { storeToRefs } from 'pinia'

withDefaults(
  defineProps<{
    withSpin?: boolean
  }>(),
  {
    withSpin: false
  }
)

const loadingBar = useLoadingBar()
const loadingStore = useLoadingStore()
loadingStore.updateLoadingBar(loadingBar)

const { isShowSpin } = storeToRefs(loadingStore)
window.$loading = loadingBar
</script>
<template>
  <template v-if="withSpin">
    <n-spin :show="isShowSpin" style="width: 100%; height: 100%">
      <template v-for="(item, key) in $slots" #[key]>
        <slot :name="key"></slot>
      </template>
    </n-spin>
  </template>

  <template v-else>
    <slot></slot>
  </template>
</template>

<style lang="less">
.n-spin-content {
  width: 100%;
  height: 100%;
}
</style>
