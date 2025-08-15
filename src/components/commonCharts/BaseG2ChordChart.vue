<template>
  <div class="base-g2-chord-chart-wrapper" :id="domId"></div>
</template>

<script setup lang="ts">
import { Chart } from '@antv/g2'
import { schemeTableau10 } from 'd3-scale-chromatic'

const props = withDefaults(defineProps<{ chartData: any[] }>(), {
  chartData: () => []
})

// 生成 8 位随机 36 进制 ID（示例："3a7f9z2b"）
const randomId = Math.random().toString(36).slice(2, 10)

const domId = `chord_${randomId}`

const chartInstance = shallowRef()

function drawChart() {
  const containerEl = document.getElementById(domId)

  const minSize = Math.min(containerEl?.offsetHeight ?? 0, containerEl?.offsetWidth ?? 0)
  if (!chartInstance.value) {
    chartInstance.value = new Chart({
      container: domId,
      padding: 20,
      autoFit: true,
      clip: false,
      inset: minSize * 0.1
    })
  }

  chartInstance.value.clear()

  if (!props.chartData || props.chartData.length === 0) return

  chartInstance.value
    .chord()
    .data({
      value: { links: props.chartData }
    })
    .layout({
      nodeWidthRatio: 0.1
    })
    .scale('color', { range: schemeTableau10 })
    .style('labelFontSize', 15)
    .style('linkFillOpacity', 0.6)
    .style('labelFill', '#fff')

  chartInstance.value.render()
}

onMounted(() => {
  drawChart()
})

watch(
  () => props.chartData,
  () => {
    drawChart()
  },
  {
    deep: true
  }
)
</script>

<style scoped lang="less">
.base-g2-chord-chart-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
