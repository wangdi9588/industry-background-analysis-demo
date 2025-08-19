<template>
  <div ref="baseScatterLineChartRef" class="base-scatter-line-chart-wrapper"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { GridComponent, LegendComponent } from 'echarts/components'
import { LineChart, ScatterChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([GridComponent, LegendComponent, LineChart, ScatterChart, CanvasRenderer])

defineOptions({
  name: 'BaseScatterChart'
})

interface Props {
  originData: Array<any>
  scatterColorMap: {
    [key: string]: string
  }
}
const props = withDefaults(defineProps<Props>(), {
  originData: () => [],
  scatterColorMap: () => ({
    high: '#74e4d9',
    medium: '#46A0FF',
    low: '#f5a588',
    no: '#808080'
  })
})

const { originData } = toRefs(props)

const baseScatterLineChartRef = shallowRef()

const myChartInstance = shallowRef()

function generateSeries(_originData: any[]) {
  return _originData.reduce((arr, ele) => {
    const name = ele.tecLinkName // 获取每个元素的名称（此处示意）

    const dataList = ele.dtoList.map((item) => {
      return [item.x, item.y, item]
    })

    arr.push(
      {
        name,
        type: 'line',
        z: 1,
        data: dataList,
        // 是否显示 symbol
        showSymbol: false
        // 是否平滑曲线
        // smooth: false,
      },
      {
        type: 'scatter',
        label: {
          show: true,
          offset: [30, 50],
          fontSize: 14,
          color: '#EAF5FF',
          formatter: function (params: any) {
            return params.data[2].chainName
          },
          minMargin: 10,
          position: 'top'
        },
        data: dataList,
        symbolSize: function (data: any) {
          return 20
        },
        itemStyle: {
          color: function (params: any) {
            return scatterColor(params.data[2])
          }
        }
      }
    )

    return arr
  }, [])
}

function scatterColor(row) {
  let type = 'no'
  const randomValue = Math.random() * 120

  if (randomValue > 100) {
    type = 'high'
  } else if (randomValue > 10) {
    type = 'medium'
  } else if (randomValue > 0) {
    type = 'low'
  }

  return props.scatterColorMap[type]
}

function setCharts() {
  if (!baseScatterLineChartRef.value) return
  myChartInstance.value = echarts.getInstanceByDom(baseScatterLineChartRef.value)
  if (!myChartInstance.value) {
    myChartInstance.value = echarts.init(baseScatterLineChartRef.value)
  } else {
    myChartInstance.value.clear()
  }

  const series = generateSeries(originData.value)
  console.log('🚀 ~ setCharts ~ series:', series)

  const options = {
    tooltip: {
      show: false
    },
    xAxis: {
      type: 'value',
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series
  }

  myChartInstance.value && myChartInstance.value.setOption(options)
}

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
.base-scatter-line-chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>
