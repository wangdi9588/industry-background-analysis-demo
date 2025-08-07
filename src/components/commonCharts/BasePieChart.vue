<template>
  <div ref="BasePieChartRef" class="base-pie-chart-wrapper"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { GridComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([GridComponent, LegendComponent, PieChart, CanvasRenderer])

defineOptions({
  name: 'BasePieChart'
})

interface Props {
  originData: Array<any>
  widthTxt?: number
}
const props = withDefaults(defineProps<Props>(), {
  originData: () => [],
  widthTxt: 120
})
const timers = ref<any>(null)
const { originData, widthTxt } = toRefs(props)

const BasePieChartRef = ref<null | HTMLElement>(null)

const pieInstance = shallowRef<echarts.ECharts | null>(null)

const currentIndex = ref(0)

const setCharts = () => {
  if (!BasePieChartRef.value) return
  let myChart: any = echarts.getInstanceByDom(BasePieChartRef.value)
  if (!myChart) {
    myChart = echarts.init(BasePieChartRef.value)
  } else {
    myChart.clear()
  }
  myChart.off('mouseover')
  myChart.off('mouseout')
  myChart.off('click')
  const options = {
    tooltip: {
      show: false,
      trigger: 'item',
      className: 'base-pie-tooltip',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      orient: 'vertical',
      top: 'middle',
      right: 20,
      icon: 'circle',
      pageIconColor: '#aaa', // 翻页按钮的颜色
      pageIconInactiveColor: '#2f4554', // 翻页按钮不激活时（即翻页到头时）的颜色
      type: originData.value && originData.value.length > 5 ? 'scroll' : '',
      formatter(name: any) {
        const itemInfor = originData.value.find((item) => item.name === name)
        return `{name|${name}}{value|${itemInfor.value}}`
      },
      textStyle: {
        color: '#91afdf',
        rich: {
          name: {
            fontSize: 16,
            width: props.widthTxt,
            color: '#D0E1FF'
          },
          value: {
            fontSize: 16,
            color: '#91afdf'
          }
        }
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['30%', '50%'],
        padAngle: 2,
        itemStyle: {},
        label: {
          show: true,
          color: '#fff'
          // position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16
            // fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: originData.value
      }
    ]
  }
  options && myChart.setOption(options)
  myChart.currentIndex = -1
  //myChart.setOption(option);
  //console.log(option.series[0].data[0]);
  timers.value = setInterval(function () {
    const dataLen = options.series[0].data.length
    // 取消之前高亮的图形
    myChart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: myChart.currentIndex
    })
    myChart.currentIndex = (myChart.currentIndex + 1) % dataLen
    // 高亮当前图形
    myChart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: myChart.currentIndex
    })
  }, 3000)
  pieInstance.value = myChart
}
onUnmounted(() => {
  // 清理定时器
  if (timers.value) {
    clearInterval(timers.value)
    timers.value = null
  }
})
watch(
  originData,
  () => {
    if (originData.value.length === 0) return
    nextTick(() => {
      setCharts()
    })
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style scoped lang="less">
.base-pie-chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less">
.base-pie-tooltip {
  background-color: unset !important;
  background: linear-gradient(155deg, rgba(80, 169, 237, 0.5) 0%, rgba(39, 130, 195, 0.8) 100%);
  border-radius: 2px !important;
  border: 1px solid rgba(132, 208, 246, 0.2) !important;
  backdrop-filter: blur(4px);
}
</style>
