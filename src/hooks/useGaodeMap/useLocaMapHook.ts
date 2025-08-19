import { Ref, shallowRef, ShallowRef } from 'vue'

export interface PluseLineLayerConfig {
  pulseLineOpt?: {
    zIndex?: number
    opacity?: number
    visible?: boolean
    zooms?: [number, number]
  }
  pulseLineStyle?: {
    lineWidth?: number | (() => number)
    headColor?: string | (() => string)
    trailColor?: string | (() => string)
    altitude?: number
    interval?: number
    duration?: number
  }
  areaNode: AMap.AreaNode
}

export interface BoundPolygonLayerCongig {
  areaNode: AMap.AreaNode
  cityhight?: number
  polygonOpt?: {
    zIndex?: number
    opacity?: number
    visible?: number
    zooms?: [number, number]
    cullface?: 'back' | 'front' | 'none'
    acceptLight?: boolean
    shininess?: number
    hasSide?: boolean
    hasBottom?: boolean
    depth?: boolean
    blockHide?: boolean
  }
  polygonStyle?: {
    topColor?: string | (() => string)
    sideTopColor?: string | (() => string)
    sideBottomColor?: string | (() => string)
    bottomColor?: string | (() => string)
    height?: number
    altitude?: number
    texture?: string
    textureSize?: [number, number] | (() => [number, number])
    labelAltitude?: number | (() => number)
  }
}

export interface Render3dLayerConfig extends BoundPolygonLayerCongig {
  mainPulseLineOpt?: {}
  shadowPulseLineOpt?: {}
  mainPulseLineStyle?: {}
  shadowPulseLineStyle?: {}
}

// LOCA数据可视化
export function useLocaMapHook(map: ShallowRef<AMap.Map | null>) {
  const mapLoca = shallowRef(null)

  const boundPolygonLayer = shallowRef(null)
  const pluseLineLayer = shallowRef(null)
  const pluseLineLayer1 = shallowRef(null)

  function initMapLoca() {
    console.log('Loca--', Loca)
    return new Promise((resolve, reject) => {
      try {
        // 创建loca容器
        mapLoca.value = new Loca.Container({
          map: map.value
        })
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * @description: 根据areaNode数据 生成线图层及轨迹线动画图层所需数据 Loca.GeoJSONSource 类型
   * @param {any} areaNode
   * @return {*}
   */
  const boundLinelayerDataSet = (areaNode: AMap.AreaNode) => {
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

  /**
   * @description: 创建轨迹线图层
   * @return {*}
   */
  const setPluseLineLayer = (pluseLineLayerConfig: PluseLineLayerConfig) => {
    const { areaNode, pulseLineOpt, pulseLineStyle } = pluseLineLayerConfig
    const data = boundLinelayerDataSet(areaNode)
    const pulseLineLayer = new Loca.PulseLineLayer({
      zIndex: 100,
      opacity: 1,
      visible: true,
      ...pulseLineOpt
    })
    pulseLineLayer.setSource(data)
    // 样式
    pulseLineLayer.setStyle({
      lineWidth: 12,
      headColor: 'rgba(188,208,239,0.4)',
      trailColor: 'rgba(0,0,0,0)',
      interval: 0.5,
      altitude: 5,
      duration: 30000,
      ...pulseLineStyle
    })
    mapLoca.value.add(pulseLineLayer)
    mapLoca.value.animate.start()
    return pulseLineLayer
  }

  /**
   * @description:  创建PolygonLayer 3d地图面图层
   * @return {*}
   */

  const setboundPolygonLayer = (boundPolygonLayerCongig: BoundPolygonLayerCongig) => {
    const { areaNode, polygonOpt, polygonStyle, cityhight = 40000 } = boundPolygonLayerCongig
    /**
     * 设置地图的数据
     * 如果没有lngLatSubList数据，说明已经下钻到区县了，高德地图没有更细致的街道数据，直接绘制区县本身
     * 官方描述：区县级以及部分没有子级的区划（比如台湾，东莞等）不在该列表中，也没有对应的AreaNode，它们的数据存在于其父级对应的AreaNode中
     */

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
      shininess: 5,
      hasSide: true,
      ...polygonOpt
    })

    _boundPolygonLayer.setSource(geo)

    // 样式 地图块的样式
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
      altitude: 0 - cityhight, // 地图偏移量
      ...polygonStyle
    })
    mapLoca.value.add(_boundPolygonLayer)
    return _boundPolygonLayer
  }

  /**
   * @description: 渲染3D地图
   * @params  options
   *    areaNode - AMap.AreaNode
   *    cityhight - number 地图厚度
   *    mainPulseLineOpt   主轨迹线配置
   *    mainPulseLineStyle 主轨迹线样式
   *    shadowPulseLineOpt 阴影轨迹线配置
   *    shadowPulseLineStyle 阴影轨迹线样式
   *
   * @return {*}
   */
  const _render3DLayer = ({
    areaNode,
    cityhight,
    polygonOpt,
    polygonStyle,
    mainPulseLineOpt,
    mainPulseLineStyle,
    shadowPulseLineOpt,
    shadowPulseLineStyle
  }: Render3dLayerConfig) => {
    cityhight = cityhight || 40000

    // 每次进来先清除

    if (boundPolygonLayer.value) {
      boundPolygonLayer.value.destroy()
    }
    if (pluseLineLayer.value) {
      pluseLineLayer.value.destroy()
    }
    if (pluseLineLayer1.value) {
      pluseLineLayer1.value.destroy()
    }
    // 3d地图面图层
    boundPolygonLayer.value = setboundPolygonLayer({
      areaNode,
      cityhight,
      polygonOpt,
      polygonStyle
    })

    // 主光;
    pluseLineLayer.value = setPluseLineLayer({
      areaNode,
      pulseLineOpt: mainPulseLineOpt,
      pulseLineStyle: mainPulseLineStyle
    })
    // 阴影效果的跑光
    pluseLineLayer1.value = setPluseLineLayer({
      areaNode,
      pulseLineOpt: shadowPulseLineOpt,
      pulseLineStyle: shadowPulseLineStyle
    })
  }

  return {
    initMapLoca,
    _render3DLayer,
    mapLoca
  }
}

export interface PrismLayerAnimateConfig {
  key: string // 动画的属性 key
  value: number[] // 动画的过渡值，范围是[0~1]之间，1 代表真实设定的值。
  duration: number // 动画时长，单位毫秒
  easing: string // 动画过渡函数，详情请看：https://redmed.github.io/chito/example/easing.html
  startAt: number // 一个动画 duration 中，从哪个时间开始动画
  yoyo: boolean // 是否开启来回摆动
  repeat: number // 动画重复次数，如果开启 yoyo 模式，那么 repeat 必须大于 1
  random: boolean // 是否开启随机执行动画，如果开启，图层中每个要素的动画开始的时间将随机延时，适合每个数据不同时间出现的效果
  delay: number // 随机动画延迟的时间段，每个要素的随机延迟将会在 delay 时间段内取值，单位毫秒，random为 true 时生效
  transform: number // 随机动画的动画执行时间，单位毫秒，random为 true 时生效
}
export function useMapLocaPrismLayerHook(locaInst: ShallowRef<any>) {
  const prismLayerInst = shallowRef()

  /**
   * @description:
   * @param {*} param1
   * @return {*}
   */
  const _renderPrismLayer = ({ prismLayerOpt }: { prismLayerOpt?: any }) => {
    return new Promise((resolve, reject) => {
      if (!prismLayerInst.value) {
        prismLayerInst.value = new Loca.PrismLayer({
          zIndex: 2000,
          opacity: 1,
          visible: false,
          hasSide: true,

          ...prismLayerOpt
        })
        locaInst.value.add(prismLayerInst.value)
        locaInst.value.animate.start()
      }

      resolve(true)
    })
  }

  function hidePriseLayer(duration = 0, callBack?: () => void) {
    prismLayerInst.value.hide()
  }

  function showPriseLayer(duration = 0, callBack?: () => void) {
    prismLayerInst.value.show(duration, callBack)
  }

  function setPriseLayerSource(sourceData: { lnglat: number[] }[]) {
    const geo = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: sourceData.map((ele) => {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: ele.lnglat
            },
            properties: ele
          }
        })
      }
    })
    prismLayerInst.value.setSource(geo)
  }

  function addPriseLayerAnimate(animateConfig: Partial<PrismLayerAnimateConfig>, callback: () => void) {
    prismLayerInst.value.addAnimate(animateConfig, callback)
  }

  return {
    prismLayerInst,
    _renderPrismLayer,
    hidePriseLayer,
    showPriseLayer,
    setPriseLayerSource,
    addPriseLayerAnimate
  }
}

export function useMapLocaIconLayerHook(locaInst: ShallowRef<any>) {
  const iconLayerInst = shallowRef()

  /**
   * @description:
   * @param {*} param1
   * @return {*}
   */
  const _renderIconLayer = (iconLayerOpt = {}, ifReload = false) => {
    return new Promise((resolve, reject) => {
      if (!iconLayerInst.value) {
        iconLayerInst.value = new Loca.IconLayer({
          zIndex: 100,
          opacity: 1,
          visible: true,
          ...iconLayerOpt
        })
        locaInst.value.add(iconLayerInst.value)
        locaInst.value.animate.start()
      }

      resolve(true)
    })
  }

  function removeIconLayer(layer, duration = 0, callBack?: () => void) {
    locaInst.value.remove(layer)
    iconLayerInst.value = undefined
  }
  function hideIconLayer(duration = 0, callBack?: () => void) {
    iconLayerInst.value.hide()
  }

  function showIconLayer(duration = 0, callBack?: () => void) {
    iconLayerInst.value.show(duration, callBack)
  }

  function setIconLayer(sourceData: { lngLat: number[] }[]) {
    const geo = getPointGeoJSONSource(sourceData)
    iconLayerInst.value.setSource(geo)
  }

  function addIconLayerAnimate(animateConfig: Partial<PrismLayerAnimateConfig>, callBack?: () => void) {
    iconLayerInst.value.addAnimate(animateConfig, callBack)
  }

  function getPointGeoJSONSource(pointList: { lngLat: number[] }[]) {
    const geo = new Loca.GeoJSONSource({
      data: {
        type: 'FeatureCollection',
        features: pointList.map((ele) => {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: ele.lngLat
            },
            properties: ele
          }
        })
      }
    })
    return geo
  }

  return {
    iconLayerInst,
    _renderIconLayer,
    removeIconLayer,
    hideIconLayer,
    showIconLayer,
    setIconLayer,
    addIconLayerAnimate,
    getPointGeoJSONSource
  }
}

export function useMapMarkHook(
  map: AMap.Map | null,
  options: { name: string; lngLat: [number, number] }[],
  contentFun: (data: any) => string,
  markConfigFun?: (data: any) => any,
  onClick?: (data: any) => void
): AMapOverlayGroup {
  const overlayGroup = shallowRef(null)
  const group: AMap.Marker[] = []
  if (!options?.length) return
  for (let i = 0; i < options.length; i++) {
    const curData = options[i]
    const mark = new AMap.Marker({
      anchor: 'center',
      content: contentFun(curData),
      position: curData.lngLat,
      ...(markConfigFun ? markConfigFun(curData) : {})
    })
    debugger
    mark.on('click', () => onClick && onClick(curData))
    group.push(mark)
  }
  // 创建新的覆盖物组并添加到地图
  overlayGroup.value = new AMap.OverlayGroup(group)

  map?.add(overlayGroup.value)
  return overlayGroup.value
}
