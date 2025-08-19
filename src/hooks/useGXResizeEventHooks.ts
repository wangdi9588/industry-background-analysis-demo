import { onUnmounted, provide, reactive, ref } from 'vue'

export interface ISystemScaleConfig {
  nAuot_width: number
  nAuot_height: number
}

const scaleConfig = reactive<ISystemScaleConfig>({
  nAuot_width: 1,
  nAuot_height: 1
})

/**
 * @description: 系统缩放适配
 * @param {*} nDefault_width   默认系统宽度
 * @param {*} nDefault_height  默认系统高度
 * @return {*}
 */

export function useSystemScaleHook(nDefault_width = 1920, nDefault_height = 1080) {
  // 创建一个 AbortController 实例
  const controller = new AbortController()
  const signal = controller.signal

  provide('scaleObj', scaleConfig)

  const _GXResizeEvent = () => {
    const nClient_width = document.documentElement.clientWidth
    const nClient_height = document.documentElement.clientHeight
    const nAuot_width = nClient_width / nDefault_width
    const nAuot_height = nClient_height / nDefault_height
    const jNodeBody = document.getElementById('app') as HTMLElement
    jNodeBody.style.transformOrigin = `0% 0% 0`
    jNodeBody.style.transform = `scale(${nAuot_width},${nAuot_height})`
    jNodeBody.style.width = `${nDefault_width}px`
    jNodeBody.style.height = `${nDefault_height}px`

    scaleConfig.nAuot_width = nAuot_width
    scaleConfig.nAuot_height = nAuot_height
  }

  window.addEventListener('resize', _GXResizeEvent, { signal })

  _GXResizeEvent()

  onUnmounted(() => {
    controller.abort()
  })
}

/**
 * @description: 当系统缩放的时候，高德地图容器需要反向缩放 (系统放大- 地图容器缩小)
 * @param {string} domId
 * @return {*}
 */
export function useElementInverseCalcHook(domId?: string) {
  watchEffect(() => {
    if (!domId) {
      return
    }
    const Ele = document.getElementById(domId) as null | HTMLElement
    if (!Ele) {
      return
    }
    const { nAuot_width, nAuot_height } = scaleConfig

    Ele.style.width = `${nAuot_width * 100}%`
    Ele.style.height = `${nAuot_height * 100}%`

    Ele.style.transform = 'scale(' + (1 / nAuot_width).toFixed(2) + ',' + (1 / nAuot_height).toFixed(2) + ')'
    Ele.style.transformOrigin = 'center'
    Ele.style.msTransform = 'scale(' + (1 / nAuot_width).toFixed(2) + ',' + (1 / nAuot_height).toFixed(2) + ')'
    Ele.style.mozTransform = 'scale(' + (1 / nAuot_width).toFixed(2) + ',' + (1 / nAuot_height).toFixed(2) + ')'
    Ele.style.webkitTransform = 'scale(' + (1 / nAuot_width).toFixed(2) + ',' + (1 / nAuot_height).toFixed(2) + ')'
  })
}
