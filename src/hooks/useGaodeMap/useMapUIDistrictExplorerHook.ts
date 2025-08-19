import { shallowRef, ShallowRef } from 'vue'

export interface DistrictExplorerFeatureStyle {
  cursor?: string
  bubble: boolean
  strokeColor: string // 线颜色
  strokeOpacity: number // 线透明度
  strokeWeight: number // 线宽
  fillColor: string // 填充色
  fillOpacity: number // 填充透明度
}

export interface MapUIDistrictExplorerOptions {
  parentFeatureStyle?: Partial<DistrictExplorerFeatureStyle>
  childFeatureStyle?: Partial<DistrictExplorerFeatureStyle>
  _customChildFillColorFn?: (properties, index: number) => string
  _renderMapLabel?: (map: AMap.Map | null, subFeaturesInfos: { name: string; lngLat: [number, number] }[]) => void
}
/**
 * @description: 通过AMapUI组件库的DistrictExplorer-行政区划浏览，对区划面进行绘制
 * @params map   ShallowRef<AMap.Map> 响应式map实例
 * @params options
 * @params options.parentFeatureStyle 父级区域区划style
 * @params options.childFeatureStyle  子级区域区划style
 * @params options._customChildFillColorFn  自定义子级区划填充色 (properties, index: number) => string
 * @params options._renderMapLabel 自定义区划label标签 marker点
 *
 * @return {*}
 */
export function useMapUIDistrictExplorerHook(map: ShallowRef<AMap.Map | null>, options: Partial<MapUIDistrictExplorerOptions>) {
  const districtExplorer = shallowRef(null)

  // 根据行政区划代码adcode 获取 areaNode数据
  const _loadAreaNode = (adcode: string | number): Promise<AMap.AreaNode> => {
    return new Promise((resolve, reject) => {
      districtExplorer.value?.loadAreaNode(adcode, (error: any, areaNode: AMap.AreaNode) => {
        if (error) {
          return reject(error)
        }
        return resolve(areaNode)
      })
    })
  }

  /**
   * @description: 根据areaNode数据
   * @return {*}
   */
  const _renderAreaNode = async (areaNode: AMap.AreaNode) => {
    const _districtExplorer = districtExplorer.value

    // 清除已经有的地图
    _districtExplorer?.clearFeaturePolygons()

    // 行政区域 子级信息
    const subFeaturesInfos: { name: string; lngLat: [number, number] }[] = []
    // 行政区域 子级区域模块渲染
    _districtExplorer?.renderSubFeatures(areaNode, (feature: any, i) => {
      const { name, centroid, center } = feature.properties
      subFeaturesInfos.push({ name, lngLat: centroid || center })
      // 子级区块的填充色
      let { fillColor } = options?.childFeatureStyle ?? {}

      /**  业务上可能会涉及 根据不同地图的 特类数量 展示不同的填充颜色，
       *   通过函数形式 传入区块属性数据 ，业务开发自行设计逻辑，抛出对应子区域填充色
       */
      if (options?._customChildFillColorFn) {
        fillColor = options._customChildFillColorFn(feature.properties, i)
      }
      return {
        cursor: 'pointer',
        bubble: true,
        strokeColor: '#55DBFF', // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 1.5, // 线宽
        fillOpacity: .9, // 填充透明度
        ...options.childFeatureStyle,
        fillColor
      }
    })

    // render 子级区域标签（地标名）
    if (options?._renderMapLabel) {
      options._renderMapLabel(map.value, subFeaturesInfos)
    }

    // 绘制父级区划
    _districtExplorer?.renderParentFeature(areaNode, { // 地图线颜色
      cursor: 'pointer',
      bubble: true,
      strokeColor: 'grba(188,208,239,1)', // 线颜色
      fillColor: null,
      strokeWeight: 4.5, // 线宽
      ...options.parentFeatureStyle
    })
  }

  /**
   * @description: 加载 DistrictExplorer 插件
   * @return {*}
   */
  function initDistrictExplorer() {
    return new Promise((resolve, reject) => {
      // 创建高德ui组件，引入 geo/DistrictExplorer
      try {
        AMapUI.loadUI(['geo/DistrictExplorer'], (_DistrictExplorer: any) => {
          districtExplorer.value = new _DistrictExplorer({
            eventSupport: true,
            map: map.value
          })
          resolve(true)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    _loadAreaNode,
    _renderAreaNode,
    initDistrictExplorer,
    districtExplorer
  }
}
