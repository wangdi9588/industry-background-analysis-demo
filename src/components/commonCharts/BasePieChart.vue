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
  legendTextSize?: number
  labelTextSize?: number
  unit?: string
}
const props = withDefaults(defineProps<Props>(), {
  originData: () => [],
  widthTxt: 120,
  legendTextSize: 16,
  labelTextSize: 16,
  unit: ''
})
const timers = ref<any>(null)
const { originData } = toRefs(props)

const BasePieChartRef = ref<null | HTMLElement>(null)

const myChartInstance = shallowRef()

const setCharts = () => {
  if (!BasePieChartRef.value) return
  myChartInstance.value = echarts.getInstanceByDom(BasePieChartRef.value)
  if (!myChartInstance.value) {
    myChartInstance.value = echarts.init(BasePieChartRef.value)
  } else {
    myChartInstance.value.clear()
  }
  myChartInstance.value.off('mouseover')
  myChartInstance.value.off('mouseout')
  myChartInstance.value.off('click')
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
        return `{name|${name}}{value|${itemInfor.value}}{value|${props.unit}}`
      },
      textStyle: {
        color: '#91afdf',
        overflow: 'truncate',
        rich: {
          name: {
            fontSize: props.legendTextSize,
            width: props.widthTxt,
            color: '#D0E1FF'
          },
          value: {
            fontSize: props.legendTextSize,
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
          show: false,
          color: '#fff',
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: props.labelTextSize,
            formatter(row: any) {
              return `{name|${row.name}}\n{value|${row.value}}{value|${props.unit}}`
            },
            rich: {
              name: {
                fontSize: props.legendTextSize,
                width: props.widthTxt,
                color: '#D0E1FF'
              },
              value: {
                fontSize: props.legendTextSize,
                color: '#91afdf'
              }
            }

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
  options && myChartInstance.value.setOption(options)
  myChartInstance.value.on('mouseover', handleMouseover)
  myChartInstance.value.on('mouseout', handleMouseout)
  myChartInstance.value.currentIndex = -1
  startCarousel()
}
function handleMouseover(e) {
  const index = originData.value.findIndex((ele) => ele.name === e.name)
  stopCarousel()
  myChartInstance.value.currentIndex = index
  // 高亮当前图形
  handleHighlight()
}
function handleMouseout(e) {
  // 取消之前高亮的图形
  handleDownplay()
  const dataLen = originData.value.length
  const index = originData.value.findIndex((ele) => ele.name === e.name)
  myChartInstance.value.currentIndex = index % dataLen
  startCarousel()
}

function handleHighlight() {
  // 高亮当前图形
  myChartInstance.value.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: myChartInstance.value.currentIndex
  })
}

function handleDownplay() {
  // 取消之前高亮的图形
  myChartInstance.value.dispatchAction({
    type: 'downplay',
    seriesIndex: 0,
    dataIndex: myChartInstance.value.currentIndex
  })
}

function startCarousel() {
  const options = myChartInstance.value.getOption()
  timers.value = setInterval(function () {
    const dataLen = options.series[0].data.length
    // 取消之前高亮的图形
    handleDownplay()
    myChartInstance.value.currentIndex = (myChartInstance.value.currentIndex + 1) % dataLen
    // 高亮当前图形
    handleHighlight()
  }, 3000)
}

function stopCarousel() {
  // 取消之前高亮的图形
  myChartInstance.value &&
    myChartInstance.value.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: myChartInstance.value.currentIndex
    })
  if (timers.value) {
    clearInterval(timers.value)
    timers.value = null
  }
}

onUnmounted(() => {
  // 清理定时器
  stopCarousel()
})
watch(
  originData,
  () => {
    if (originData.value.length === 0) return
    nextTick(() => {
      stopCarousel()
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
