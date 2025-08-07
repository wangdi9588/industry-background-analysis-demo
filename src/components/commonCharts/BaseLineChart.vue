<template>
  <div ref="BaseLineChartRef" class="base-line-chart-wrapper"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([GridComponent, TooltipComponent, LegendComponent, LineChart, CanvasRenderer])

defineOptions({
  name: 'BaseLineChart'
})

interface TooltipFormatter {
  (params: any): string
}
interface BaseBarChartProps {
  originData?: any[]
  showLegend?: boolean
  rotate?: number
  yrotate?: number
  gradientColors?: Array<string[]>
  emphasisColor?: string[]
  formatter?: TooltipFormatter
  showLabel?: boolean
  y1AxisUnit?: string
  axisLabelWrap?: boolean
  axisLabelSingleNumber?: number
}
const props = withDefaults(defineProps<BaseBarChartProps>(), {
  originData: () => [],
  // 是否显示legend内容
  showLegend: true,
  // x轴数据倾斜角度
  rotate: 0,
  yrotate: 0,
  emphasisColor: () => [],
  gradientColors: () => [
    ['rgba(255, 198, 76, 1)', 'rgba(255, 198, 76, 0.10)', 'rgba(255, 198, 76, .5)'],
    ['rgba(36, 106, 255, 1)', 'rgba(36, 106, 255, 0)', 'rgba(36, 106, 255, .5)'],
    ['rgba(10, 169, 255, 1)', 'rgba(10, 169, 255, 0)', 'rgba(10, 169, 255, .5)'],
    ['rgba(10, 251, 255, 1)', 'rgba(10, 251, 255, 0)', 'rgba(10, 251, 255, .5)'],
    ['rgba(237, 161, 5, 1)', 'rgba(237, 161, 5, 0)', 'rgba(237, 161, 5, .5)'],
    ['rgba(255, 77, 80, 1)', 'rgba(255, 77, 80, 0)', 'rgba(255, 77, 80, .5)'],
    ['rgba(82, 196, 28, 1)', 'rgba(82, 196, 28, 0)', 'rgba(82, 196, 28, .5)'],
    ['rgba(36, 106, 255, 1)', 'rgba(36, 106, 255, 0)', 'rgba(36, 106, 255, .5)'],
    ['rgba(10, 169, 255, 1)', 'rgba(10, 169, 255, 0)', 'rgba(10, 169, 255, .5)']
  ],
  formatter: undefined,
  offsetBottom: 0,
  showLabel: false,
  y1AxisUnit: '',
  axisLabelWrap: false,
  axisLabelSingleNumber: 8
})

const BaseLineChartRef = ref<null | HTMLElement>(null)

const setCharts = () => {
  const originData = props.originData
  if (!BaseLineChartRef.value) return
  let myChart = echarts.getInstanceByDom(BaseLineChartRef.value)
  if (!myChart) {
    myChart = echarts.init(BaseLineChartRef.value)
  } else {
    myChart.clear()
  }
  const series = originData.map((item, index) => {
    const isY2Line = item.yPosition === 'right'
    return {
      type: 'line',
      // symbol: "path://M512 47.886637C255.677147 47.886637 47.886637 255.677147 47.886637 512S255.677147 976.113363 512 976.113363s464.113363-207.79051 464.113363-464.113363S768.322853 47.886637 512 47.886637zM512 746.102782c-128.160915 0-232.057193-103.895255-232.057193-232.057193s103.895255-232.057193 232.057193-232.057193 232.057193 103.895255 232.057193 232.057193S640.161938 746.102782 512 746.102782z",
      // symbolKeepAspect: true, // 如果 symbol 是 path:// 的形式，是否在缩放时保持该图形的长宽比。
      symbol: 'circle',
      color: '#000',
      symbolSize: 7,
      smooth: true,
      yAxisIndex: isY2Line ? 1 : 0,
      itemStyle: {
        borderRadius: 0,
        color: props.gradientColors[index][0]
      },
      areaStyle: item.areaStyle
        ? {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: props.gradientColors[index][2] // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: props.gradientColors[index][1] ? props.gradientColors[index][1] : props.gradientColors[index][0] // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }
        : null,
      barGap: 0.2,
      label: {
        show: props.showLabel,
        color: '#A9D7FF'
      },
      ...item,

    }
  })
  const categoryOption = {
    type: 'category',
    data: originData[0].data.map((item: { name: string }) => item.name),
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#A9D7FF',
      interval: 0,
      lineHeight: 18,
      fontSize: 14,
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
        color: '#1E578D',
        // opacity: 0.2,
        width: '1' // 坐标线的宽度
      }
    }
  }
  const defaultValueOption = {
    type: 'value',
    name: props.y1AxisUnit,
    axisLabel: {
      color: '#A9D7FF',
      rotate: props.yrotate
    },
    splitLine: {
      lineStyle: {
        type: [6, 12], // 自 v5.0.0 开始，也可以是 number 或者 number 数组，用以指定线条的 dash array，配合 dashOffset 可实现更灵活的虚线效果。
        dashOffset: 0, // 用于设置虚线的偏移量，可搭配 type 指定 dash array 实现灵活的虚线效果。
        width: '1',
        color: '#8F9FBF',
        opacity: 0.2
      }
    },
    nameTextStyle: {
      color: '#80A1B0'
    }
  }
  let valueOption
  const isOwnRightLine = props.originData.some((item) => item.yPosition === 'right')
  if (isOwnRightLine) {
    valueOption = [defaultValueOption, { ...defaultValueOption, name: props.y1AxisUnit, alignTicks: true }]
  } else {
    valueOption = defaultValueOption
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: props.formatter,
      className: 'base-line-tooltip ',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      show: props.showLegend && originData.length > 1,
      data: originData.map((item) => ({
        name: item.name,
        icon: 'path://M 120 340 L 220 340 A 50 50 0 1 1 320 340 L 420 340 L 420 420 L 320 420 A 50 50 0 1 1 220 420 L 120 420 L 120 340'
      })),
      bottom: 4,
      itemWidth: 12,
      itemHeight: 6, //图例小方框的高度
      itemStyle: {},
      textStyle: {
        color: '#A9D7FF'
      }
    },
    grid: {
      left: 15,
      right: 20,
      top: props.y1AxisUnit ? '15%' : '5%',
      bottom: 20,
      // bottom: '0',
      containLabel: true
    },
    xAxis: categoryOption,
    yAxis: valueOption,
    series
  }
  option && myChart.setOption(option)
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
</script>

<style scoped lang="less">
.base-line-chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less">
.base-line-tooltip {
  background-color: unset !important;
  background: linear-gradient(155deg, rgba(80, 169, 237, 0.5) 0%, rgba(39, 130, 195, 0.8) 100%);
  border-radius: 2px !important;
  border: 1px solid rgba(132, 208, 246, 0.2) !important;
  backdrop-filter: blur(4px);
}
</style>
