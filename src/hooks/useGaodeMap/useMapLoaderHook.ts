import AMapLoader from '@amap/amap-jsapi-loader'
import { shallowRef } from 'vue'

// const AMapsMap = new Map()

export let AMap: Window['AMap']

export interface IMapConfigOptions {
  mapLoaderOptions: {
    key: string
    version: string
    plugins?: string[]
    AMapUI?: {
      version?: string
      plugins?: string[]
    }
    Loca?: {
      version?: string
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

  /**
   * @description: 初始化AMapLoader加载器
   * @return {*}
   */
  async function initAMapLoader() {

    return new Promise((resolve, reject) => {
      try {
        AMapLoader.reset()
        AMapLoader.load(mapConfigOptions.mapLoaderOptions).then((_AMap) => {
          AMap = _AMap
          resolve(true)
          return
        })
      } catch (error) {
        console.log('error---', error)
        reject(error)
      }
    })
  }

  function initMarker(options){
    if(!AMap){
      return new Error('请确保地图加载器已正确加载')

    }
    return new AMap.Marker(options)


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
        console.log('mapConfigOptions', mapConfigOptions)
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
    shallowMap,
    initMarker
  }
}
