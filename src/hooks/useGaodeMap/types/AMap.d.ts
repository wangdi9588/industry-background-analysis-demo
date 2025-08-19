declare global {
  namespace AMap {
    type LngLatType = [number, number]

    type Coordinates = LngLatType[][]

    interface Geometry {
      coordinates: Coordinates
      type: string
    }
    export interface Properties {
      acroutes?: number[]
      adcode: number
      name: string
      center: LngLatType
      centroid: LngLatType
      childrenNum: number
      level: 'country' | 'province' | 'city' | 'district'
      subFeatureIndex?: number
    }

    interface Feature {
      geometry: Geometry
      properties: Properties
      type: string
    }
    type Features = Feature[]

    type BoundsItem = {
      x: number
      y: number
      width: number
      height: number
    }

    export interface AreaNode {
      adcode: number
      _data: {
        geoData: {
          parent: Feature
          lngLatParent: Feature
          sub?: {
            features: Features
            type: string
          }
          lngLatSubList?: {
            features: Features
            type: string
          }[]
        }
        bounds: BoundsItem
      }
      getParentFeature: () => Feature
    }
  }
}

// 导出模块以确保 TypeScript 正确识别
export {}
