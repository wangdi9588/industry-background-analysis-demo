import { HeatmapOptions } from './types/plugins/Heatmap.d'
import { onUnmounted, ref, Ref, ShallowRef, shallowRef } from 'vue'
import { remove, debounce } from 'lodash-es'
import { AMap } from './useMapLoaderHook'

/**
 * @description: 生成标注图层，并添加到地图实例上
 * @return {*}
 */
function _renderLabelsLayer(map: AMap.Map | null, opts: AMap.LabelsLayerOptions): AMap.LabelsLayer {
  const labelsLayer = new AMap.LabelsLayer({
    opacity: 1,
    collision: true,
    allowCollision: true,
    ...opts
  })
  map?.add(labelsLayer)
  return labelsLayer
}

function _renderLabelMarker(opts: AMap.LabelMarkerOptions) {
  return new AMap.LabelMarker({
    ...opts
  })
}

/**
 * @description: 海量点标注
 * @return {*}
 */
export function useMapLabelsMarkersHook(map: Ref<AMap.Map | null>, labelsLayerOpt: AMap.LabelsLayerOptions) {
  // labelMarkers集合--- 标注 海量点
  const labelMarkers = ref<AMap.LabelMarker[]>([])

  const controller = new AbortController()

  //  标注图层
  const labelsLayer = shallowRef<AMap.LabelsLayer | null>(null)

  /**
   * @description: 生成 labelsMarker点 并加在 labelsLayer 图层上。可以看作是初始化增加
   * @param {*} originData
   * @param {*} callback
   * @return {*}
   */
  function generalLabelMarkers(originData, callback) {
    if (!labelsLayer.value) {
      labelsLayer.value = _renderLabelsLayer(map.value, labelsLayerOpt)
    }
    clearLabelMarkers()
    const markers = originData.map((ele) => {
      return callback(ele, _renderLabelMarker)
    })

    labelMarkers.value = markers

    labelsLayer.value.add(labelMarkers.value)
  }

  /**
   * @description: 在初始化labelMarkers的基础上又加了 额外的 labelMarkers 针对大批量数据  批次加载
   * @param {*} originData
   * @param {*} callback
   * @return {*}
   */
  function addLabelMarkers(originData: any[], callback: (ele: any, fn: (opts: AMap.LabelMarkerOptions) => AMap.LabelMarker) => AMap.LabelMarker) {
    const markers = originData.map((ele) => {
      return callback(ele, _renderLabelMarker)
    })
    labelMarkers.value.push(...markers)
    labelsLayer.value?.add(labelMarkers.value)
  }

  /**
   * @description: 移除部分labelMarkers标记点
   * @param {*} callback
   * @return {*}
   */
  function removeLabelMarkers(callback: (ele: AMap.LabelMarker) => boolean) {
    const findMarkers = remove(labelMarkers.value, (ele: AMap.LabelMarker) => callback(ele))
    labelsLayer.value?.remove(findMarkers)
  }

  /**
   * @description:清空 labelsLayer图层上的标注点
   * @return {*}
   */
  function clearLabelMarkers() {
    labelsLayer.value?.clear()
  }

  /**
   * @description: 添加鼠标移入labelsLayer图层事件
   * @param {*} callback
   * @return {*}
   */
  function addMouseOverLabelsLayerEvent(callback) {
    labelsLayer.value?.on('mouseover', callback, { signal: controller.signal })
  }
  /**
   * @description: 添加鼠标移出labelsLayer图层事件
   * @param {*} callback
   * @return {*}
   */
  function addMouseoutLabelsLayerEvent(callback) {
    labelsLayer.value?.on('mouseout', callback, { signal: controller.signal })
  }

  onUnmounted(() => {
    controller.abort()
  })

  return {
    labelMarkers,
    labelsLayer,
    generalLabelMarkers,
    addLabelMarkers,
    removeLabelMarkers,
    clearLabelMarkers,
    addMouseOverLabelsLayerEvent,
    addMouseoutLabelsLayerEvent
  }
}

export interface ClusterIndexSet {
  [key: string]: {
    minZoom: number
    maxZoom: number
  }
}

export interface ClusterDataOption {
  city: string
  district: string
  address: string
  lnglat: [number, number]
}
/**
 * @description: 索引聚合
 * @param {ShallowRef} map
 * @return {*}
 */
export function useMapIndexClusterHook(map: ShallowRef<AMap.Map | null>) {
  const shallowIndexCluster = shallowRef()
  const clusterIndexSet = ref<ClusterIndexSet>({})
  const activeClusterMarkerItem = ref()
  const clusterPointList = ref<ClusterDataOption[]>([])

  function initIndexCluster(_clusterIndexSet: ClusterIndexSet, _renderClusterMarker: (context: any) => void) {
    clusterIndexSet.value = _clusterIndexSet
    return new Promise((resolve, reject) => {
      try {
        shallowIndexCluster.value = new AMap.IndexCluster(map.value, [], {
          clusterIndexSet: _clusterIndexSet,
          renderClusterMarker: _renderClusterMarker
        })
        // 绑定聚合点的点击事件
        shallowIndexCluster.value?.on('click', debounceClusterClick)
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }

  // 创建一个 throttled 函数
  const debounceClusterClick = debounce(function (item: any) {
    const limitZoom = clusterIndexSet.value.address.minZoom
    const zoom = map.value?.getZoom() as number
    if (zoom < limitZoom) {
      if (item.clusterData.length === 0) {
        return
      }
      let allLng = 0,
        allLat = 0
      for (const mo of item.clusterData) {
        allLng += mo.lnglat.getLng()
        allLat += mo.lnglat.getLat()
      }
      const lat = allLat / item.clusterData.length
      const lng = allLng / item.clusterData.length
      map.value?.setZoomAndCenter(limitZoom, [lng, lat])
    } else {
      activeClusterMarkerItem.value = item.clusterData[0]
    }
  }, 200)

  function clearIndexClusterData() {
    clusterPointList.value = []
    clusterPointList.value.length = 0
    shallowIndexCluster.value?.setData(null)
  }

  function setIndexClusterData(originData: ClusterDataOption[]) {
    clearIndexClusterData()
    clusterPointList.value = originData
    shallowIndexCluster.value.setData(originData)
  }

  function addIndexClusterData(originData: ClusterDataOption[]) {
    clusterPointList.value.push(...originData)
    shallowIndexCluster.value.addData(originData)
  }

  return {
    activeClusterMarkerItem,
    initIndexCluster,
    clearIndexClusterData,
    setIndexClusterData,
    addIndexClusterData
  }
}

export function useMapHeatHook(map: ShallowRef<AMap.Map | null>) {
  const shallowHeatMapInit = shallowRef()
  //判断浏览区是否支持canvas
  function isSupportCanvas() {
    const elem = document.createElement('canvas')
    return !!(elem.getContext && elem.getContext('2d'))
  }

  function initHeatMap(opts?: AMap.HeatmapOptions) {
    return new Promise((resolve, reject) => {
      if (!isSupportCanvas()) {
        reject(new Error('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~'))
      }
      try {
        shallowHeatMapInit.value = new AMap.HeatMap(map.value, { ...(opts || {}) })
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    initHeatMap,
    shallowHeatMapInit
  }
}
// export function useMapDistrictSearchHook(districtSearchOptions: AMap.DistrictSearchOptions) {
//   const shallowDistrictSearch = shallowRef()
//   function initDistrictSearch() {
//     shallowDistrictSearch.value = new AMap.DistrictSearch({
//       // 关键字对应的行政区级别，country表示国家
//       level: 'province',
//       //  显示下级行政区级数，1表示返回下一级行政区
//       subdistrict: 1,
//       ...districtSearchOptions
//     })
//   }

//   function searchDistrictByKeyword(keyword: string) {
//     return new Promise((resolve, reject) => {
//       shallowDistrictSearch.value.search(keyword, function (status, result) {
//         resolve(result)
//       })
//     })
//   }

//   return {
//     shallowDistrictSearch,
//     initDistrictSearch,
//     searchDistrictByKeyword
//   }
// }
