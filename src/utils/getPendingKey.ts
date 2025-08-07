import { AxiosRequestConfig } from 'axios'

/**
 * @description: 生成唯一的每个请求的唯一key
 * @param {AxiosRequestConfig} config
 * @return {*}
 */
export function getPendingKey(config: AxiosRequestConfig) {
  const { url, method, params } = config
  let { data } = config
  if (typeof data === 'string') data = JSON.parse(data) // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}
