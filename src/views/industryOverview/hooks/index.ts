import { useAwaitActionHook } from '@/hooks/useAwaitAction'
import { Render3DMapConfig, useMapLocaPrismLayerHook, useRender3DMapHook } from '@/hooks/useGaodeMap'
import { useElementInverseCalcHook } from '@/hooks/useGXResizeEventHooks'

export function useIndustryOverview3DMapHook(mapId: string) {
  const { isWaiting: PrismWaiting, addTask: PrismAddTask } = useAwaitActionHook()

  const mapBtnList = ref([
    {
      label: '全国',
      value: 100000,
      type: 'country'
    }
  ])
  const activeMapLevel = ref(mapBtnList.value[0].value)
  const activeUnit = ref('亿元')
  const mapCityHight = ref(100000)
  const currentMapLevel = ref('province')
  const currentPrimseData = ref<any[]>([])
  const render3DMapConfig: Render3DMapConfig = {
    mapId,
    childFeatureStyle: {
      cursor: 'pointer',
      bubble: true,
      strokeColor: '#fff', // 线颜色
      strokeOpacity: 0.1, // 线透明度
      strokeWeight: 1, // 线宽
      fillColor: '#1B427B',
      fillOpacity: 0.8 // 填充透明度
    },
    mapOptions: {
      zoomEnable: false,
      animateEnable: false,
      showLabel: false,
      pitch: 36,
      pitchEnable: false,
      mapStyle: 'amap://styles/4eee52d358907721115d6546de8f67ff',
      viewMode: '3D',
      features: ['bg']
    },
    mapLoaderOptions: {
      key: '60fdb942e15dfeefff0d5595c58a8de3', //申请好的 Web 端开发者 Key，首次调用 load 时必填
      version: '2.0', //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
      AMapUI: {
        version: '1.1', // AMapUI 缺省 1.1
        plugins: [] // 需要加载的 AMapUI ui插件
      },
      Loca: {
        version: '2.0' // Loca 版本，缺省 1.3.2
      }
    },
    mainPulseLineStyle: {
      headColor: 'rgba(148,52,223,1)',
      trailColor: 'rgba(148,52,223,0.1)',
      lineWidth: 12,
      interval: 0.5,
      altitude: 5,
      duration: 30000
    },
    shadowPulseLineStyle: {
      headColor: 'rgba(255,255,255,0.1)',
      trailColor: 'rgba(255,255,255,0.1)',
      lineWidth: 4
    },
    cityhight: mapCityHight,
    onCompleteRenderMap,
    onFeatureClick,
    onFeatureMouseoverAndOut,
    _renderMapLabel
  }

  const adcode = ref(510000)
  const optionLngLat = ref()
  const { shallowMap, mapLoca, _renderDistrictArea, initMarker } = useRender3DMapHook(adcode.value, { ...render3DMapConfig })
  const { _renderPrismLayer, prismLayerInst, setPriseLayerSource } = useMapLocaPrismLayerHook(mapLoca)
  const pointInfoWindow = shallowRef()
  const pointMarkerTop = shallowRef()

  function onCompleteRenderMap(map: AMap.Map, _districtExplorer: any) {
    addLight(map, currentMapLevel.value)

    if (!pointInfoWindow.value) {
      pointInfoWindow.value = new AMap.InfoWindow({
        anchor: 'middle-left',
        isCustom: true,
        autoMove: false,
        offset: [0, 0]
      })
    }

    if (!pointMarkerTop.value) {
      pointMarkerTop.value = createMarker()
    }

    map.setFitView(
      _districtExplorer.getAllFeaturePolygons(),
      false,
      [-200, -120, -200, -200]
      // currentMapLevel.value === 'country' ? [-250, -280, -280, -280] : [-80, -80, -80, -80]
    )

    // getPriseLayerData()
    PrismAddTask(getPriseLayerData)
  }

  function addLight(map: any, level: string) {
    // let centerPoint = pxToLnt(map, baseXY[0], baseXY[1], mapCityHight.value)
    let addLength = 0
    switch (level) {
      case 'city':
        addLength = 0.7
        break
      case 'province':
        addLength = 0
        break
      case 'district':
        addLength = 1.1
        break
    }
    let centerPoint = [113.263227, 23.141937, 150000]

    mapLoca.value.pointLight = {
      color: '#9434DF',
      position: centerPoint,
      intensity: 200,
      // 距离表示从光源到光照强度为 0 的位置，0 就是光不会消失。
      distance: 0
      // decay: 1.5
    }
    // mapLoca.value.dirLight.position = [0, 0, 0]
    // mapLoca.value.ambLight.color = '#fff'
    // mapLoca.value.ambLight.intensity = 1
  }

  function onFeatureClick(properties: AMap.Properties): Promise<boolean> {
    const arr = []
    return new Promise((resolve, reject) => {
      resolve(false)
      return
      currentMapLevel.value = properties.level
      switch (properties.level) {
        case 'province':
          mapCityHight.value = 100000
          break
        case 'city':
          mapCityHight.value = 80000
          break
        case 'district':
          mapCityHight.value = 20000
          break
      }

      if (mapCityHight.value <= 20000) {
        resolve(false)
        return
      } else {
        // 只处理省市区
        const mapIndex = mapBtnList.value.findIndex((it) => it.type === properties.level)
        if (mapIndex === -1) {
          mapBtnList.value.push({
            label: properties.name,
            value: properties.adcode,
            type: properties.level
          })
        } else {
          mapBtnList.value[mapIndex] = {
            label: properties.name,
            value: properties.adcode,
            type: properties.level
          }
        }
        // if (properties.level === 'province') {
        //   cityList.value = allMapData.value?.find((it) => it.name === properties.name)?.childChart ?? []
        // } else {
        //   areaList.value = cityList.value?.find((it) => it.name === properties.name)?.childChart ?? []
        // }
        activeMapLevel.value = properties.adcode
      }
      resolve(true)
    })
  }

  function onFeatureMouseoverAndOut(properties: AMap.Properties, isHover: boolean): Promise<boolean> {
    const findItem = currentPrimseData?.value.find((ele) => ele.name === properties.name)
    return new Promise((resolve, reject) => {
      if (isHover && findItem) {
        const content = `
          <div class="info-window-wrapper">
            <div class="info-real-content">
              <span >
        ${properties?.name}
              </span>
            </div>
              <div class='info-num'> ${findItem?.value ?? 0} ${activeUnit.value} </div>
  
         </div>
          `
        pointInfoWindow.value.setContent(content)
        let height = getCurrentHeight(findItem)

        let lng = [...(properties?.centroid || properties?.center), height]
        pointMarkerTop.value.setPosition(lng)
        pointMarkerTop.value.show()
        // pointInfoWindow.value.setAnchor('bottom-center')
        pointInfoWindow.value.open(shallowMap?.value, properties?.centroid || properties?.center, height)
      } else {
        pointInfoWindow.value.close()
        pointMarkerTop.value.hide()
      }
      resolve(true)
    })
  }

  function getCurrentHeight(findItem: { value: number }) {
    // z轴高度
    let baseHeight = 100
    let minHeight = 100000
    let maxHeight = 800000
    switch (currentMapLevel.value) {
      case 'country':
        baseHeight = 500
        break
      case 'province':
        baseHeight = 200
        break
      case 'city':
        baseHeight = 100
        minHeight = 20000
        maxHeight = 50000
        break
      default:
        break
    }
    return Math.max(minHeight, Math.min(maxHeight, Math.ceil(findItem['value']) * baseHeight))
  }

  function _renderMapLabel(map: AMap.Map | null, options: { name: string; lngLat: [number, number] }[]) {
    // 在这边处理mark柱状图

    // setMarkCylinder(map,options)
    //临时做下光源测试
    // lights()
    // setMarkCityName(map, options)
    optionLngLat.value = options
  }

  function createMarker(options?: any) {
    const content = `12312`

    const marker = new AMap.Marker({
      content: content //自定义点标记覆盖物内容
    })

    return marker
  }

  async function getPriseLayerData() {
    let originData: any[] = []
    switch (currentMapLevel.value) {
      case 'country':
        // originData = allMapData.value
        break
      case 'province':
        // originData = cityList.value
        break
      case 'city':
        // originData = areaList.value
        break
      default:
        break
    }
    // let PrismList =
    //   originData?.map((it) => {
    //     // 渲染柱子的list
    //     const newObj = optionLngLat.value.find((ele) => it.name === ele.name)
    //     return {
    //       lnglat: newObj?.lngLat,
    //       value: Number(it.value) || 0,
    //       name: it.name
    //     }
    //   }) ?? []
    // PrismList.sort((a: any, b: any) => b.value - a.value)
    // PrismList = PrismList.map((it, index) => {
    //   return {
    //     ...it,
    //     sort: index + 1
    //   }
    // }).filter((ele) => ele.lnglat && ele.lnglat !== undefined)
    let PrismList = [
      {
        lnglat: [103.931804, 30.652329],
        name: '成都市',
        value: 6000
      },
      {
        name: '自贡市',
        lnglat: [104.685446, 29.28421],
        value: 1200
      },
      {
        name: '攀枝花市',
        lnglat: [101.625394, 26.755869],
        value: 800
      },
      {
        name: '泸州市',
        lnglat: [105.443348, 28.889138],
        value: 1600
      },
      {
        name: '德阳市',
        lnglat: [104.436756, 31.128701],
        value: 3600
      },
      {
        name: '绵阳市',
        lnglat: [104.704392, 31.850919],
        value: 2980
      },
      {
        name: '广元市',
        lnglat: [105.78583, 32.26157],
        value: 2309
      },
      {
        name: '遂宁市',
        lnglat: [105.475016, 30.630107],
        value: 2000
      },
      {
        name: '内江市',
        lnglat: [104.913978, 29.638381],
        value: 1942
      },
      {
        name: '乐山市',
        lnglat: [103.571823, 29.214311],
        value: 902
      },
      {
        name: '南充市',
        lnglat: [106.207711, 31.195136],
        value: 1390
      },
      {
        name: '眉山市',
        lnglat: [103.754827, 29.924767],
        value: 868
      },
      {
        name: '宜宾市',
        lnglat: [104.637629, 28.572053],
        value: 1230
      },
      {
        name: '广安市',
        lnglat: [106.666151, 30.42449],
        value: 789
      },
      {
        name: '达州市',
        lnglat: [107.650611, 31.367469],
        value: 1456
      },
      {
        name: '雅安市',
        lnglat: [102.665156, 29.914326],
        value: 2000
      },
      {
        name: '巴中市',
        lnglat: [107.041958, 32.016794],
        value: 650
      },
      {
        name: '资阳市',
        lnglat: [105.118328, 30.098408],
        value: 2760
      },
      {
        name: '阿坝藏族羌族自治州',
        lnglat: [102.612554, 32.409135],
        value: 420
      },
      {
        name: '甘孜藏族自治州',
        lnglat: [99.98712, 30.97906],
        value: 579
      },
      {
        name: '凉山彝族自治州',
        lnglat: [102.08054, 27.889541],
        value: 320
      }
    ]
    currentPrimseData.value = [...PrismList]
    await _renderPrismLayer({})

    setPriseLayerSource(PrismList)

    prismLayerInst.value.setStyle({
      unit: 'meter',
      sideNumber: 32,
      topColor: (index, f) => {
        return '#9434DF'
      },
      sideTopColor: () => {
        return 'rgba(148, 52, 223, .64)'
      },
      sideBottomColor: 'rgba(148, 52, 223, .64)',
      radius: () => {
        let radius = 10000
        switch (currentMapLevel.value) {
          case 'country':
            radius = 25000
            break
          case 'province':
            radius = 5000
            break
          case 'city':
            radius = 1000
            break
          default:
            break
        }
        return radius
      },
      height: (index, f) => {
        var props = f.properties

        let baseHeight = 100
        let minHeight = 100000
        let maxHeight = 800000
        switch (currentMapLevel.value) {
          case 'country':
            baseHeight = 500
            break
          case 'province':
            baseHeight = 100
            minHeight = 10000
            maxHeight = 400000
            break
          case 'city':
            baseHeight = 10
            minHeight = 2000
            maxHeight = 10000
            break
          default:
            break
        }

        const height = Math.max(minHeight, Math.min(maxHeight, Math.ceil(props['value']) * baseHeight))

        return height
      },
      rotation: 360,
      altitude: 0
      // extrude: true,     // 开启拉伸效果，使其成为3D柱状图
      // rotation: Math.PI / 5 // 调整旋转角度，倾斜柱状图
    })
    prismLayerInst.value.show(500)
    prismLayerInst.value.addAnimate({
      key: 'height',
      value: [0, 1],
      duration: 500,
      easing: 'Linear',
      transform: 2000,
      random: true,
      delay: 2000
    })
    prismLayerInst.value.addAnimate({
      key: 'rotation',
      value: [0, 1],
      duration: 500,
      easing: 'Linear',
      transform: 2000,
      random: true,
      delay: 2000
    })
  }

  onMounted(() => {
    useElementInverseCalcHook(mapId)
  })
}
