<template>
  <div class="layout-wrapper">
    <Header></Header>
    <div class="page-content-body">
      <LeftTabs
        style="margin-top: 24px"
        :menu-list="menuList"
        v-model:activeMenuTab="activeMenuTab"
        @update:activeMenuTab="updateActiveMenuTab"
      ></LeftTabs>
      <div class="page-content-right-wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftTabs from '@/components/leftTabs.vue'
import Header from './Header.vue'

const menuList = ref([
  {
    name: '产业总览',
    key: 'industryOverview'
  },
  {
    name: '经营主体',
    key: 'businessEntity'
  },
  {
    name: '科技创新',
    key: 'techInnovation'
  },
  {
    name: '发展质量',
    key: 'developmentQuality'
  },
  {
    name: '区域对标',
    key: 'regionalBenchmark'
  }
])

const route = useRoute()
const router = useRouter()
const activeMenuTab = ref('')

watch(
  () => route.meta,
  () => {
    activeMenuTab.value = (route.meta?.type as string) ?? undefined
  },
  {
    immediate: true,
    deep: true
  }
)

function updateActiveMenuTab(key: string) {
  router.push(`/${key}`)
}
</script>

<style scoped lang="less">
.layout-wrapper {
  width: 100%;
  height: 100%;
  background: url('/static/images/background/bg.png') no-repeat;
  background-size: 100% 100%;

  position: relative;
  display: flex;
  flex-direction: column;

  .page-content-body {
    width: 100%;
    flex: 1;
    height: 0;
    padding-right: 24px;

    display: flex;

    .page-content-right-wrapper {
      width: 0;
      flex: 1;
      height: 100%;
      padding-left: 16px;
    }
  }
}
</style>
