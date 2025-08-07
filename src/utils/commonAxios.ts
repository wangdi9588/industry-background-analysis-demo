import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useGlobalRequestControlStore, useLoadingStore } from '@/stores'
import { LoadingInstance } from './loadingInstance'
import { getItem } from './storage'

/**
 * @description:
 * @return {
 * * baseURL  服务地址
 * * requestTimeout 超时时间 - ms
 * * getToken 自定义获取token函数，默认为 localStorage.getItem('token')
 * * handleRequestHeader
 * * showLoading
 * * hideLoading
 * * handleResponseResult
 * * handleHttpsError
 * }
 */
export interface CommonAxiosOptions {
  baseURL?: string
  requestTimeout?: number
  getToken?: () => string | undefined | null
  handleRequestHeader: (
    config: InternalAxiosRequestConfig<any>,
    customOptions: TCustomOptions,
    axiosConfig: AxiosRequestConfig
  ) => InternalAxiosRequestConfig<any>
  showLoading?: () => void
  hideLoading?: () => void
  handleResponseResult: (
    response: AxiosResponse<any, any>,
    customOptions: TCustomOptions
  ) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>
  handleHttpsError?: (error: any) => void
}

/**
 * @description:
 * @param {}
 * @return {
 * * repeat_request_cancel: 请求取消,
 * * loading: 加载中
 * * reduct_data_format: 数据格式化
 * * error_message_show: 错误信息显示
 * * code_message_show: 错误码信息显示
 * * [propName: string]: any
 * }
 */
export type TCustomOptions = {
  repeat_request_cancel: boolean
  loading: boolean
  reduct_data_format: boolean
  error_message_show: boolean
  code_message_show: boolean
  check_token: boolean
  [propName: string]: unknown
}

export const TOKEN = 'token'

export function defaultGetToken() {
  return getItem(TOKEN)
}

export function commonAxios(
  requestoptions: CommonAxiosOptions
): [AxiosInstance, (axiosConfig: AxiosRequestConfig, customOptions?: any) => Promise<AxiosResponse<any, any>>] {
  const globalRequestControlStore = useGlobalRequestControlStore()
  console.log(globalRequestControlStore, 'globalRequestControlStore')
  const {
    baseURL = '/',
    requestTimeout = 60000,
    getToken = defaultGetToken,
    handleRequestHeader,
    handleResponseResult,
    handleHttpsError
  } = requestoptions
  const service = axios.create({
    baseURL, // 设置统一的请求前缀
    timeout: requestTimeout // 设置统一的超时时长
  })

  let isInterceptorSet = false

  const fetch = (axiosConfig: AxiosRequestConfig, customOptions = {}) => {
    let { showLoading, hideLoading } = requestoptions
    if (!showLoading || !hideLoading) {
      const loadingBarStore = useLoadingStore()
      showLoading = loadingBarStore.showLoading
      hideLoading = loadingBarStore.hideLoading
    }

    const loading = new LoadingInstance(showLoading, hideLoading)
    // 自定义配置
    const custom_options: TCustomOptions = Object.assign(
      {},
      {
        repeat_request_cancel: true, // 是否开启取消重复请求, 默认为 true
        loading: true, // 是否开启loading层效果, 默认为true
        reduct_data_format: true, // 是否开启简洁的数据结构响应, 默认为true
        error_message_show: true, // 是否开启接口错误信息展示,默认为true
        code_message_show: true, // 是否开启code不为200时的信息提示, 默认为false
        check_token: true // 是否开启token校验，默认是true
      },
      customOptions
    )

    const mergeAxiosConfig = { ...axiosConfig, custom_options }
    if (!isInterceptorSet) {
      isInterceptorSet = true
      // 请求拦截
      service.interceptors.request.use(
        (config) => {
          const { custom_options } = config
          custom_options.repeat_request_cancel && globalRequestControlStore.addPending(config)

          const _token = getToken()

          // 如果接口需要校验token，并且token 为空 直接取消接口
          if (custom_options.check_token && !_token) {
            globalRequestControlStore.removePending(config)
            return Promise.reject({
              status: 401,
              message: 'Token is missing or invalid',
              config
            })
          }
          // 创建loading实例
          if (custom_options.loading) {
            loading.add()
          }
          return handleRequestHeader(config, custom_options, axiosConfig)
        },
        (error) => {
          return Promise.reject(error)
        }
      )

      // 响应拦截
      service.interceptors.response.use(
        (response: AxiosResponse) => {
          const { custom_options, responseType } = response.config as AxiosRequestConfig & { custom_options: TCustomOptions }

          globalRequestControlStore.removePending(response.config)
          custom_options?.loading && loading.reduce() // 关闭loading

          if (responseType === 'blob') {
            return response.data
          }
          return handleResponseResult(response, custom_options as TCustomOptions)
        },
        (error) => {
          const { custom_options } = error.config
          if (!axios.isCancel(error)) {
            error.config && globalRequestControlStore.removePending(error.config)
            custom_options.loading && loading.reduce() // 关闭loading
            custom_options.error_message_show && handleHttpsError?.(error) // 处理错误状态码
          }
          return Promise.reject(error) // 错误继续返回给到具体页面
        }
      )
    }

    return service(mergeAxiosConfig)
  }

  return [service, fetch]
}
