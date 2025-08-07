import { AxiosRequestConfig } from 'axios'
import { defineStore } from 'pinia'
import { getPendingKey } from '@/utils/getPendingKey'

const pendingMap = new Map()

export const useGlobalRequestControlStore = defineStore('global-request-control', {
  state: () => ({
    routeControllerMap: new Map()
  }),
  actions: {
    addPending(config: AxiosRequestConfig) {
      this.removePending(config)
      const pendingKey = getPendingKey(config)
      const controller = new AbortController()
      config.signal = config.signal || controller.signal
      pendingMap.set(pendingKey, controller)
      // 如果接口不限制与 路由页面 ，则不需要 存入 routeControllerMap
      if (
        (Reflect.ownKeys(config?.data ?? {}).length > 0 && !config?.data?._is_global_request) ||
        (Reflect.ownKeys(config?.params ?? {}).length > 0 && !config.params._is_global_request)
      ) {
        this.routeControllerMap.set(pendingKey, controller)
      }
    },
    /**
     * @description: 删除重复的请求
     * @param {AxiosRequestConfig} config
     * @return {*}
     */
    removePending(config: AxiosRequestConfig) {
      const pendingKey = getPendingKey(config)
      // if (pendingMap.has(pendingKey)) {
      //   const controller = pendingMap.get(pendingKey)
      //   controller?.abort()
      //   pendingMap.delete(pendingKey)
      // }
    },
    cancelAllCurrentRouteRequest() {
      for (const controller of this.routeControllerMap.values()) {
        controller.abort()
      }
      this.routeControllerMap.clear()
    }
  }
})
