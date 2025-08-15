<template>
  <div ref="BaseBarChartRef" class="base-bar-chart-wrapper"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent } from 'echarts/components'
import { BarChart, LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { GridOption, LegendOption } from 'echarts/types/dist/shared'
import { merge } from 'lodash-es'

echarts.use([GridComponent, DataZoomComponent, TooltipComponent, LegendComponent, BarChart, LineChart, CanvasRenderer])

defineOptions({
  name: 'BaseBarLineChart'
})

interface TooltipFormatter {
  (params: any): string
}
interface BaseBarChartProps {
  lineHeight?: number
  originData?: any[]
  showLegend?: boolean
  rotate?: number
  yrotate?: number
  gradientColors?: Array<string[]>
  emphasisColor?: string[]
  formatter?: TooltipFormatter
  stack?: string
  barWidth?: number
  isHorizontalBar?: boolean
  ifClickBar?: boolean
  showLabel?: boolean
  y1AxisUnit?: string
  y2AxisUnit?: string
  x1AxisUnit?: string
  axisLabelWrap?: boolean
  axisLabelSingleNumber?: number
  legend?: LegendOption
  grid?: GridOption
  // 开启滚动时的 数据量界限
  openZoomLimit?: number
  dataZoomEndValue?: number
}
const props = withDefaults(defineProps<BaseBarChartProps>(), {
  lineHeight: 0,
  // 横向展示
  isHorizontalBar: false,
  originData: () => [],
  // 是否显示legend内容
  showLegend: true,
  // x轴数据倾斜角度
  rotate: 0,
  yrotate: 0,
  emphasisColor: () => [],
  gradientColors: () => [
    ['#54B2D4', '#54B2D4'],
    ['#73D13C', '#73D13C'],
    ['#F3C784', '#F3C784']
  ],
  barWidth: 12,
  ifClickBar: false,
  stack: '',
  formatter: undefined,
  offsetBottom: 0,
  showLabel: false,
  y1AxisUnit: '',
  y2AxisUnit: '',

  x1AxisUnit: '',
  axisLabelWrap: false,
  axisLabelSingleNumber: 8,
  legend: () => ({}),
  grid: () => ({}),
  openZoomLimit: 8,
  dataZoomEndValue: 5
})

const emit = defineEmits<{ (e: 'handleClick', value: any): void }>()

const BaseBarChartRef = ref<null | HTMLElement>(null)

const setCharts = () => {
  const originData = props.originData
  if (!BaseBarChartRef.value) return
  let myChart = echarts.getInstanceByDom(BaseBarChartRef.value)
  if (!myChart) {
    myChart = echarts.init(BaseBarChartRef.value)
  } else {
    myChart.clear()
  }

  const series = originData.map((item, index) => {
    const isY2Line = item.yPosition === 'right'
    return {
      type: item.type || 'bar',
      stack: item.type ? null : props.stack,
      yAxisIndex: isY2Line ? 1 : 0,
      barWidth: props.barWidth,
      itemStyle: {
        borderRadius: 0,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: 'rgba(0,225,225,0.24)' },
          // { offset: .24, color: 'rgba(0,225,225,.45)' },

          { offset: 1, color: 'rgba(78,226,214,1)' }
        ])
        // color: {
        //   type: 'linear',
        //   x: 0,
        //   y: 0,
        //   x2: 0,
        //   y2: 1,
        //   colorStops: [
        //     {
        //       offset: 0,
        //       color: props.gradientColors[index][0] // 0% 处的颜色
        //     },
        //     {
        //       offset: 1,
        //       color: props.gradientColors[index][1] ? props.gradientColors[index][1] : props.gradientColors[index][0] // 100% 处的颜色
        //     }
        //   ],
        //   global: false // 缺省为 false
        // }
      },
      barGap: 0.2,
      label: {
        show: props.showLabel,
        position: props.isHorizontalBar ? 'right' : 'top',
        color: '#A7E9FF'
      },
      ...item
    }
  })
  const categoryOption = {
    type: 'category',
    data: originData[0].data.map((item: { name: string }) => item.name),
    axisTick: {
      show: false
    },
    name: props.isHorizontalBar ? props.x1AxisUnit : '',
    nameTextStyle: {
      color: '#80A1B0'
    },
    axisLabel: {
      color: '#CCEEFF',
      interval: 0,
      // lineHeight: props.lineHeight ?? 0,
      fontSize: 16,
      rotate: props.rotate,
      formatter: (value: any) => {
        var ret = '' //拼接加\n返回的类目项
        var max = props.axisLabelSingleNumber //每行显示的文字字数
        var val = value.length //X轴内容的文字字数
        var rowN = Math.ceil(val / max) //需要换的行数
        if (props.axisLabelWrap) {
          //判断 如果字数大于5就换行
          for (var i = 0; i < rowN; i++) {
            var temp = '' //每次截取的字符串
            var start = i * max //开始截取的位置
            var end = start + max //结束截取的位置
            temp = value.substring(start, end) + '\n'
            ret += temp //最终的字符串
          }
          return ret
        } else {
          return value
        }
      }
    },
    axisLine: {
      lineStyle: {
        type: 'solid',
        color: 'rgb(161, 174, 188, 0.16)', // 左边线的颜色
        width: '1' // 坐标线的宽度
      }
    }
  }
  const defaultValueOption = {
    type: 'value',
    name: props.y1AxisUnit,
    axisLabel: {
      // 横着的柱图不显示x轴刻度
      show: !props.isHorizontalBar,
      color: '#80A1B0',
      rotate: props.yrotate
    },

    splitLine: {
      // 横着的柱图不显示分割线
      show: !props.isHorizontalBar,
      lineStyle: {
        type: 'solid',
        width: '1',
        color: 'rgba(65, 71, 88, 1)',
        opacity: 0.35
      }
    },
    nameTextStyle: {
      color: '#80A1B0'
    }
  }
  let valueOption
  const isOwnRightLine = props.originData.some((item) => item.yPosition === 'right')
  if (isOwnRightLine) {
    valueOption = [defaultValueOption, { ...defaultValueOption, name: props.y2AxisUnit || props.y1AxisUnit, alignTicks: true }]
  } else {
    valueOption = defaultValueOption
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: props.formatter,
      className: 'base-bar-line-tooltip ',
      textStyle: {
        color: '#fff'
      }
    },
    dataZoom: props.isHorizontalBar
      ? null
      : [
          {
            type: 'slider',
            realtime: true,
            startValue: 0,
            show: false,
            endValue: props.dataZoomEndValue,
            height: 4,
            fillerColor: 'rgba(17, 100, 210, 0.42)', // 滚动条颜色
            borderColor: 'rgba(17, 100, 210, 0.12)',
            handleSize: 0, // 两边手柄尺寸
            showDetail: false, // 拖拽时是否展示滚动条两侧的文字
            top: '96%',
            rangeMode: ['value', 'value']
            // zoomLock:true, // 是否只平移不缩放
            // moveOnMouseMove:true, //鼠标移动能触发数据窗口平移
            // zoomOnMouseWheel :true, //鼠标移动能触发数据窗口缩放
          },
          {
            type: 'inside', // 支持内部鼠标滚动平移
            show: false,
            startValue: 0,
            endValue: props.dataZoomEndValue,
            zoomOnMouseWheel: false, // 关闭滚轮缩放
            moveOnMouseWheel: false, // 开启滚轮平移
            moveOnMouseMove: false, // 鼠标移动能触发数据窗口平移
            rangeMode: ['value', 'value']
          }
        ],
    legend: merge(
      {
        show: props.showLegend && originData.length > 1,
        data: originData.map((item) => ({
          name: item.name,
          icon:
            item.type === 'line'
              ? 'path://M 120 340 L 220 340 A 50 50 0 1 1 320 340 L 420 340 L 420 420 L 320 420 A 50 50 0 1 1 220 420 L 120 420 L 120 340'
              : 'rect'
        })),
        top: 8,
        right: 8,
        itemWidth: 12,
        itemHeight: 12,
        itemStyle: {},
        textStyle: {
          color: '#A7E9FF'
        }
      },
      props?.legend ?? {}
    ),
    grid: merge(
      {
        left: 15,
        right: 40,
        top: props.y1AxisUnit || props.x1AxisUnit ? '15%' : '5%',
        bottom: '0',
        containLabel: true
      },
      props?.grid ?? {}
    ),
    xAxis: props.isHorizontalBar ? valueOption : categoryOption,
    yAxis: props.isHorizontalBar ? categoryOption : valueOption,
    series
  }
  if (!props.isHorizontalBar) {
    setTimeAutoTranslation(myChart, categoryOption.data, option)
  }
  option && myChart.setOption(option)
}

const timeTaskSwitch = ref(true)
const timer = ref<null | number>(null)
const setTimeAutoTranslation = (myChart: echarts.ECharts, xAxisList: any[], option: any) => {
  if (timer.value) clearTimeout(timer.value)
  function setTime() {
    timer.value = setTimeout(() => {
      // 每次向后滚动一个，最后一个从头开始
      if (option.dataZoom[0].endValue === xAxisList.length) {
        option.dataZoom[0].startValue = 0 // 数据窗口范围的起始数值
        option.dataZoom[0].endValue = props.dataZoomEndValue // 数据窗口范围的结束数值
      } else {
        option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1 // 数据窗口范围的起始数值
        option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1 // 数据窗口范围的结束数值
      }
      myChart.setOption(option)
      if (timeTaskSwitch.value) {
        setTime()
      }
    }, 2000)
  }

  if (xAxisList && xAxisList.length && xAxisList.length >= props.openZoomLimit) {
    setTime()
  }
}

watch(
  () => props.originData,
  () => {
    if (props.originData.length === 0) return
    nextTick(() => {
      setCharts()
    })
  },
  {
    deep: true,
    immediate: true
  }
)

onBeforeUnmount(() => {
  timer.value = null
  timeTaskSwitch.value = false
})
</script>

<style scoped lang="less">
.base-bar-chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less">
.base-bar-line-tooltip {
  background-color: unset !important;
  background: linear-gradient(155deg, rgba(80, 169, 237, 0.5) 0%, rgba(39, 130, 195, 0.8) 100%);
  border-radius: 2px !important;
  border: 1px solid rgba(132, 208, 246, 0.2) !important;
  backdrop-filter: blur(4px);
}
</style>
