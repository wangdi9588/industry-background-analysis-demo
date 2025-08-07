// import { getCompanyList } from '@/api/data'
import { throttle } from 'lodash-es'

export const useCompanyList = (delay = 2000) => {
  interface OriginCompanyItem {
    company_code: string
    company_name: string
  }
  interface CompanyItem {
    label: string
    value: string
  }
  const companyList = ref<CompanyItem[]>([])
  const searchLoading = ref(false)
  const searchKey = ref('')
  const isShowCompanyOptions = ref<boolean | undefined>(false)

  const handleSearchCompany = throttle(async (val: string) => {
    searchKey.value = val
    searchLoading.value = true
    if (!val) {
      companyList.value = []
      searchLoading.value = false
      isShowCompanyOptions.value = false
      return
    }
    const params = {
      name: val,
      page: 1,
      size: 50
    }
    const res = {
      data: { records: [] }
    }
    // const res: { data: { records: OriginCompanyItem[] } } = await getCompanyList(params)
    const { records } = res.data
    const list = records?.map((item) => ({
      ...item,
      label: item.company_name,
      value: item.company_code
    }))
    companyList.value = list ?? []
    searchLoading.value = false
    isShowCompanyOptions.value = undefined
  }, delay)

  return {
    companyList,
    searchKey,
    isShowCompanyOptions,
    searchLoading,
    handleSearchCompany
  }
}
