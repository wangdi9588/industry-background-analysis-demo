import { javaFetch } from '@/utils/request'

export function getPolicyListApi(data: any) {
  return javaFetch(
    {
      method: 'post',
      url: '/demo/getPolicyPage',
      data
    },
    {
      check_token: false
    }
  )
}
