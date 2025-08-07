import { merge } from 'lodash-es'
import AMapLoader from '@amap/amap-jsapi-loader'
import '@amap/amap-jsapi-types'
import { ShallowRef } from 'vue'

let AMap: Window['AMap']

export interface IMapConfigOptions {
  mapLoaderOptions?: {
    key: string
    version: string
    plugins: string[]
    AMapUI: {
      version: string
      plugins: string[]
    }
    Loca: {
      version: string
    }
  }
  mapId: string | HTMLDivElement
  mapOptions?: Partial<AMap.MapOptions>
}

/**
 * @description: 高德地图API加载器引入，地图创建
 * @param {IMapConfigOptions} mapConfigOptions
 * @return {*}
 */
export function useMapLoaderHook(mapConfigOptions: IMapConfigOptions) {
  const shallowMap = shallowRef<null | AMap.Map>(null)

  // 高德地图加载器默认配置
  const _mapLoaderOptions = {
    key: '60fdb942e15dfeefff0d5595c58a8de3', //申请好的 Web 端开发者 Key，首次调用 load 时必填
    version: '2.0', //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Scale', 'AMap.IndexCluster'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['AMap.Scale','...','...']
    AMapUI: {
      // 是否加载 AMapUI，缺省不加载
      version: '1.1' // AMapUI 版本
    },
    Loca: {
      // 是否加载 Loca， 缺省不加载
      version: '2.0' // Loca 版本
    }
  }

  /**
   * @description: 初始化AMapLoader加载器
   * @return {*}
   */
  async function initAMapLoader() {
    return new Promise((resolve, reject) => {
      if (AMap) {
        resolve(true)
        return
      }
      try {
        const options = merge(mapConfigOptions?.mapLoaderOptions ?? {}, _mapLoaderOptions)
        AMapLoader.load(options).then((_AMap) => {
          AMap = _AMap
          resolve(true)
          return
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  // 初始化地图
  function initMap() {
    return new Promise((resolve, reject) => {
      if (!AMap) {
        return reject(new Error('请确保地图加载器已正确加载'))
      }
      if (!mapConfigOptions.mapId) {
        return reject(new Error('地图容器不能为空'))
      }
      try {
        shallowMap.value = new AMap.Map(mapConfigOptions.mapId, mapConfigOptions.mapOptions)
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    initAMapLoader,
    initMap,
    shallowMap
  }
}

export interface DistrictExplorerBorderStyle {
  cursor?: string
  bubble: boolean
  strokeColor: string // 线颜色
  strokeOpacity: number // 线透明度
  strokeWeight: number // 线宽
  fillColor: string // 填充色
  fillOpacity: number // 填充透明度
}

export interface MapUIDistrictExplorerOptions {
  parentBorderStyle: Partial<DistrictExplorerBorderStyle>
  childBorderStyle: Partial<DistrictExplorerBorderStyle>
  _customChildFillColorFn: (properties, index: number) => string
  _renderMapLabel: (map: AMap.Map, subFeaturesInfos: { name: string; lngLat: [number, number] }[]) => void
}
/**
 * @description: 通过AMapUI组件库的DistrictExplorer-行政区划浏览，对区划面进行绘制
 * @return {*}
 */
export function useMapUIDistrictExplorerHook(map: ShallowRef<AMap.Map>, options: Partial<MapUIDistrictExplorerOptions>) {
  const districtExplorer = shallowRef(null)

  // 根据行政区划代码adcode 获取 areaNode数据
  const _loadAreaNode = (adcode: string | number) => {
    return new Promise((resolve, reject) => {
      districtExplorer.value.loadAreaNode(adcode, (error: any, areaNode: any) => {
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
  const _renderAreaNode = async (areaNode: any) => {
    const _districtExplorer = districtExplorer.value

    // 清除已经有的地图
    _districtExplorer.clearFeaturePolygons()

    // 行政区域 子级信息
    const subFeaturesInfos: { name: string; lngLat: [number, number] }[] = []

    // 行政区域 子级区域模块渲染
    _districtExplorer.renderSubFeatures(areaNode, (feature: any, i) => {
      const { name, centroid: lngLat } = feature.properties
      subFeaturesInfos.push({ name, lngLat })
      // 子级区块的填充色
      let { fillColor } = options?.childBorderStyle
      /**  业务上可能会涉及 根据不同地图的 特类数量 展示不同的填充颜色，
       *   通过函数形式 传入区块属性数据 ，业务开发自行设计逻辑，抛出对应子区域填充色
       */
      if (options?._customChildFillColorFn) {
        fillColor = options._customChildFillColorFn(feature.properties, i)
      }
      return {
        ...options.childBorderStyle,
        fillColor
      }
    })

    // render 子级区域标签（地标名）
    if (options?._renderMapLabel) {
      options._renderMapLabel(map.value, subFeaturesInfos)
    }

    // 绘制父级区划
    _districtExplorer.renderParentFeature(areaNode, {
      ...options.parentBorderStyle,
      fillColor: null
    })
  }

  // 加载 DistrictExplorer 插件
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

// LOCA数据可视化
export function useLocaMapHook(map: ShallowRef<AMap.Map>) {
  const mapLoca = shallowRef(null)
  const boundLinelayerTop = shallowRef(null)
  const boundLinelayerBottom = shallowRef(null)
  const boundPolygonLayer = shallowRef(null)
  const pluseLineLayer = shallowRef(null)
  const pluseLineLayer1 = shallowRef(null)

  // 线图层及动画图层所需数据
  const boundLinelayerDataSet = (areaNode: any) => {
    const parentFeature = areaNode.getParentFeature()
    const {
      geometry: {
        coordinates: [[boundCoords]]
      },
      properties
    } = parentFeature

    const data = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties,
            geometry: {
              type: 'LineString',
              coordinates: boundCoords
            }
          }
        ]
      }
    })
    return data
  }
  // 创建线图层
  const setboundLinelayer = ({ areaNode, styleOption = { altitude: 5 } }: { areaNode: any; styleOption?: any }) => {
    const data = boundLinelayerDataSet(areaNode)
    const boundLinelayer = new Loca.LineLayer({
      loca: mapLoca.value,
      zIndex: 10
    })
    boundLinelayer.setSource(data)
    // 样式
    boundLinelayer.setStyle({
      color: '#bad5f0',
      lineWidth: 3,
      ...styleOption
    })

    return boundLinelayer
  }

  // 创建动画图层
  const setPluseLineLayer = ({ areaNode, styleOption = {} }: { areaNode: any; styleOption?: any }) => {
    const { zIndex } = styleOption
    const data = boundLinelayerDataSet(areaNode)
    const pulseLineLayer = new Loca.PulseLineLayer({
      zIndex: zIndex || 100,
      opacity: 1,
      visible: true
    })
    pulseLineLayer.setSource(data)
    // 样式
    pulseLineLayer.setStyle({
      lineWidth: 8,
      headColor: 'rgba(255,120,4,0.2)',
      trailColor: 'rgba(0,0,0,0)',
      interval: 0.5,
      altitude: 5,
      duration: 30000,
      ...styleOption
    })
    mapLoca.value.add(pulseLineLayer)
    mapLoca.value.animate.start()
    return pulseLineLayer
  }
  // 创建3d图层
  const setboundPolygonLayer = (areaNode: any, cityhight: number) => {
    // 设置地图的数据

    // 如果没有lngLatSubList数据，说明已经下钻到区县了，高德地图没有更细致的街道数据，直接绘制区县本身
    const geo = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: areaNode._data.geoData.lngLatSubList ? [...areaNode._data.geoData.lngLatSubList] : [areaNode._data.geoData.lngLatParent]
      }
    })

    const _boundPolygonLayer = new Loca.PolygonLayer({
      zIndex: 20,
      opacity: 1,
      cullface: 'none',
      shininess: 10,
      hasSide: true
    })

    _boundPolygonLayer.setSource(geo)

    // 样式
    _boundPolygonLayer.setStyle({
      topColor() {
        return '#100829'
      },
      sideTopColor() {
        return '#0083F9'
      },
      sideBottomColor() {
        return '#021D35'
      },
      // 地图厚度
      height() {
        return cityhight
      },
      altitude: 0 - cityhight // 地图偏移量
    })
    mapLoca.value.add(_boundPolygonLayer)
    return _boundPolygonLayer
  }

  // 渲染3D地图
  const _render3DLayer = async ({ areaNode, cityhight }: { areaNode: any; cityhight: number }) => {
    // 创建loca容器
    if (!mapLoca.value) {
      mapLoca.value = new Loca.Container({
        map: map.value
      })
    }
    // 每次进来先清除
    if (boundLinelayerTop.value) {
      boundLinelayerTop.value.destroy()
    }
    if (boundLinelayerBottom.value) {
      boundLinelayerBottom.value.destroy()
    }

    if (boundPolygonLayer.value) {
      boundPolygonLayer.value.destroy()
    }
    if (pluseLineLayer.value) {
      pluseLineLayer.value.destroy()
    }
    if (pluseLineLayer1.value) {
      pluseLineLayer1.value.destroy()
    }
    // 线图层一
    // boundLinelayerTop.value = setboundLinelayer({
    //   areaNode,
    // });
    // // 线图层二
    // boundLinelayerBottom.value = setboundLinelayer({
    //   areaNode,
    //   styleOption: {
    //     color: "rgba(16,8,41,0.5)",
    //     lineWidth: 5,
    //     altitude: 0 - cityhight,
    //   },
    // });
    // 3d图层
    boundPolygonLayer.value = setboundPolygonLayer(areaNode, cityhight)

    // 主光;
    pluseLineLayer.value = setPluseLineLayer({ areaNode })
    // 阴影效果的跑光
    pluseLineLayer1.value = setPluseLineLayer({
      areaNode,
      styleOption: {
        lineWidth: 2,
        headColor: 'rgba(255,120,4,1)',
        trailColor: '#55DBFF',
        zIndex: 1000
      }
    })
  }

  return {
    _render3DLayer
  }
}

export function useRender3DMapHook({ mapId, mapOptions }) {
  const loading = ref(false)
  const { initAMapLoader, initMap, shallowMap } = useMapLoaderHook({
    mapId,
    mapOptions
  })
  const { _loadAreaNode, _renderAreaNode, initDistrictExplorer, districtExplorer } = useMapUIDistrictExplorerHook(shallowMap, {
    parentBorderStyle: {
      cursor: 'pointer',
      bubble: true,
      strokeColor: '#55DBFF', // 线颜色
      fillColor: null,
      strokeWeight: 2.5 // 线宽
    },
    childBorderStyle: {
      cursor: 'pointer',
      bubble: true,
      strokeColor: '#55DBFF', // 线颜色
      fillColor: '#1492ff',
      strokeOpacity: 1, // 线透明度
      strokeWeight: 1.5, // 线宽
      fillOpacity: 1 // 填充透明度
    }
  })
  const { _render3DLayer } = useLocaMapHook(shallowMap)

  // 初始化区域浏览
  const _renderDistrictArea = async (_adcode: number, cityhight = 20000) => {
    // 加载某个区域的浏览
    const areaNode = await _loadAreaNode(_adcode)
    districtExplorer.value.setAreaNodesForLocating([areaNode])
    // 渲染areaNode 父级区域 子级区域 颜色/边颜色
    _renderAreaNode(areaNode)
    // 添加图层
    _render3DLayer({ areaNode, cityhight })

    shallowMap.value.setFitView(districtExplorer.value.getAllFeaturePolygons(), false, [-200, -50, -200, -200])
  }

  // 地图点击
  const handleFeatureClick = async (e: any, feature: any) => {
    const { level, adcode: _adcode, name } = feature.properties
    _renderDistrictArea(_adcode)
  }

  // 鼠标悬浮
  const handleFeatureMouseoverAndOut = (e: any, feature: any) => {
    const isHover = e.type === 'featureMouseover'
    const { adcode: _adcode, level } = feature.properties
    const polys = districtExplorer.value.findFeaturePolygonsByAdcode(_adcode)
    polys.forEach((item: any) => {
      item.setOptions({
        cursor: 'pointer',
        fillOpacity: isHover ? 0.35 : 1
      })
    })
  }
  onMounted(async () => {
    loading.value = true
    await initAMapLoader()
    await initMap()
    await initDistrictExplorer()
    await _renderDistrictArea(510800)
    loading.value = false
    // districtExplorer.value.on('featureClick', handleFeatureClick)

    // 监听feature的hover事件
    districtExplorer.value.on('featureMouseout featureMouseover', handleFeatureMouseoverAndOut)
  })
  return {
    loading
  }
}
