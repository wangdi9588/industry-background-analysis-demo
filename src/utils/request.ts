import router from '@/routes'
import { commonAxios, TOKEN, type TCustomOptions } from '@/utils/commonAxios'
import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { getItem } from './storage'

function httpSuccessStatusHandle(response: AxiosResponse<any, any>) {
  let message = ''
  let messageStatus = 'success'
  switch (response.data.code) {
    case 401:
      // router.push('/login')
      break
    case 403:
      // 执行退出
      message = '您没有权限操作!'
      messageStatus = 'warning'
      break
    // 接口抛出 code 700 时候，将接口报错 原样返回
    case 500:
      message = response.data.msg
      messageStatus = 'warning'
      break
    case 700:
      message = response.data.msg
      messageStatus = 'warning'
      break
    default:
      message = `异常问题${response.data.code}，请联系管理员！`
      messageStatus = 'error'
  }
  window.$message(messageStatus, message)
}
function handleRequestHeader(config: InternalAxiosRequestConfig<any>, customOptions: TCustomOptions, axiosConfig: AxiosRequestConfig) {
  if (config && config.headers && customOptions.check_token) {
    config.headers['Authorization'] = `Bearer ${getItem(TOKEN)}`
  }

  return config
}

function handleResponseResult(response: AxiosResponse<any, any>, customOptions: TCustomOptions) {
  if (response.data && response.data.code === 200) return customOptions.reduct_data_format ? response.data : response
  httpSuccessStatusHandle(response)
  return Promise.reject({ ...response.data, config: customOptions })
}

function handleHttpsError(error: any) {
  if (error.status === 401) {
    router.push('/login')
  }
}
const [axiosInstance, javaFetch] = commonAxios({
  baseURL: import.meta.env.VITE_JAVA_API_URL as string,
  handleRequestHeader,
  handleResponseResult,
  handleHttpsError
})

export function setFetchBaseUrl(baseURL: string) {
  if (baseURL) {
    axiosInstance.defaults.baseURL = baseURL
  }
}
export { javaFetch }
