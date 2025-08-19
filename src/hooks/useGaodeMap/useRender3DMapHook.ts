import { useMapLoaderHook, type IMapConfigOptions } from './useMapLoaderHook'
import { type MapUIDistrictExplorerOptions, useMapUIDistrictExplorerHook } from './useMapUIDistrictExplorerHook'
import { type Render3dLayerConfig, useLocaMapHook } from './useLocaMapHook'
import { onMounted, onUnmounted, Ref, render } from 'vue'

export interface Render3DMapConfig
  extends IMapConfigOptions,
    Partial<MapUIDistrictExplorerOptions>,
    Omit<Render3dLayerConfig, 'areaNode' | 'cityhight'> {
  onFeatureClick?: (properties: AMap.Properties) => Promise<boolean>
  onFeatureMouseoverAndOut?: (properties: AMap.Properties, isHover: boolean) => Promise<boolean>
  onCompleteRenderMap?: (map: AMap.Map, districtExplorer: any) => void
  cityhight?: Ref<number>
}
/**
 * @description: 绘制3d地图
 * @params
 *   mapId 地图容器 Id
 *   mapOptions   生成地图配置
 *   mapLoaderOptions  地图加载器配置
 *   parentFeatureStyle  父级区域区划style
 *   childFeatureStyle 子级区域区划style
 *   _customChildFillColorFn 自定义子级区划填充色 (properties, index: number) => string
 *   _renderMapLabel 自定义区划label标签 marker点
 *   polygonOpt  polygonLayer面图层配置
 *   polygonStyle polygonLayer面图层样式
 *   cityhight 地图厚度
 *   mainPulseLineOpt 主轨迹线配置
 *   mainPulseLineStyle 主轨迹线样式
 *   shadowPulseLineOpt 阴影轨迹线配置
 *   shadowPulseLineStyle 阴影轨迹线样式
 *   onFeatureClick Promise<boolean> 返回为false 则阻断后续任务
 *   onCompleteRenderMap
 * @return {*}
 */

export function useRender3DMapHook(adcode: number, render3DMapConfig: Render3DMapConfig) {
  const { initAMapLoader, initMap, shallowMap, initMarker } = useMapLoaderHook({
    mapId: render3DMapConfig.mapId,
    mapOptions: render3DMapConfig.mapOptions,
    mapLoaderOptions: render3DMapConfig.mapLoaderOptions
  })

  const controller = new AbortController()

  const { _loadAreaNode, _renderAreaNode, initDistrictExplorer, districtExplorer } = useMapUIDistrictExplorerHook(shallowMap, {
    parentFeatureStyle: render3DMapConfig.parentFeatureStyle,
    childFeatureStyle: render3DMapConfig.childFeatureStyle,
    _customChildFillColorFn: render3DMapConfig._customChildFillColorFn,
    _renderMapLabel: render3DMapConfig._renderMapLabel
  })

  const { initMapLoca, _render3DLayer, mapLoca } = useLocaMapHook(shallowMap)

  // 初始化区域浏览
  const _renderDistrictArea = async (_adcode: number, cityhight = 40000 / 3) => {
    // 加载某个区域的浏览
    const areaNode = await _loadAreaNode(_adcode)
    districtExplorer.value.setAreaNodesForLocating([areaNode])
    // 渲染areaNode 父级区域 子级区域 颜色/边颜色
    _renderAreaNode(areaNode)
    // 添加图层
    _render3DLayer({
      areaNode,
      cityhight,
      polygonOpt: render3DMapConfig.polygonOpt,
      polygonStyle: render3DMapConfig.polygonStyle,
      mainPulseLineOpt: render3DMapConfig.mainPulseLineOpt,
      mainPulseLineStyle: render3DMapConfig.mainPulseLineStyle,
      shadowPulseLineOpt: render3DMapConfig.shadowPulseLineOpt,
      shadowPulseLineStyle: render3DMapConfig.shadowPulseLineStyle
    })
    render3DMapConfig?.onCompleteRenderMap?.(shallowMap.value as AMap.Map, districtExplorer.value)
  }

  // 地图点击
  const handleFeatureClick = async (e: any, feature: any) => {
    console.log('eeeee', e)
    const { level, adcode: _adcode, name } = feature.properties
    let isContinueTask = true
    if (render3DMapConfig.onFeatureClick) {
      isContinueTask = await render3DMapConfig.onFeatureClick(feature.properties)
    }
    if (isContinueTask) {
      console.log(render3DMapConfig.cityhight?.value)
      _renderDistrictArea(_adcode, render3DMapConfig.cityhight?.value)

      if (render3DMapConfig.cityhight?.value === 80000) {
        shallowMap.value?.setZoom(12)
      }
    }
  }

  // 鼠标悬浮
  const handleFeatureMouseoverAndOut = async (e: any, feature: any) => {
    const isHover = e.type === 'featureMouseover'

    const { adcode: _adcode, level } = feature.properties
    let isContinueTask = true
    if (render3DMapConfig.onFeatureMouseoverAndOut) {
      isContinueTask = await render3DMapConfig.onFeatureMouseoverAndOut(feature.properties, isHover)
    }
    if (isContinueTask) {
      const polys = districtExplorer.value.findFeaturePolygonsByAdcode(_adcode)
      polys.forEach((item: any) => {
        item.setOptions({
          cursor: 'pointer',
          fillColor: isHover ? '#366EC0' : '#1B427B'
          // fillOpacity: isHover ? 0.35 : 1
        })
      })
    }
  }

  onMounted(async () => {
    // 按照顺序执行
    // 一、高德JsAPI 加载器引入
    await initAMapLoader()
    // 二、初始化地图
    await initMap()
    // 三、初始化 MapUI DistrictExplorer插件
    await initDistrictExplorer()
    // 三、初始化 MapLoca
    await initMapLoca()
    // 四、地图渲染
    await _renderDistrictArea(adcode, render3DMapConfig.cityhight?.value)

    // 鼠标监听点击事件
    districtExplorer.value.on('featureClick', handleFeatureClick, {
      signal: controller.signal
    })

    // 监听feature的hover事件
    districtExplorer.value.on('featureMouseout featureMouseover', handleFeatureMouseoverAndOut, {
      signal: controller
    })
  })

  onUnmounted(() => {
    controller.abort()
  })

  return {
    shallowMap,
    districtExplorer,
    mapLoca,
    _renderDistrictArea,
    initMarker
  }
}
