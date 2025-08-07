import { PaginationInfo, PaginationProps } from 'naive-ui'
import { nextTick, onMounted, ref, watch } from 'vue'

export interface JavaGetListRequest<K> {
  total: number
  size?: number
  list: K[]
}

export interface JavaPageFnParams<T> {
  searchParams: object
  getList: () => Promise<JavaGetListRequest<T>>
  pageSize?: number
  isMounted?: boolean
}

/**
 * @description:
 * @param {object} searchParams 筛选项
 * @param {function} getList 列表方法
 * @return {*}
 */
export function useJavaPage<T>(options: JavaPageFnParams<T>) {
  const { searchParams, getList, pageSize: size = 10, isMounted = true } = options

  const total = ref(0)
  const current = ref(1)
  const pageSize = ref(size)
  const pageList = ref<T[]>([])

  const commonPaginationConfig = computed<PaginationProps>(() => {
    return {
      onUpdatePage: handleUpdatePage,
      onUpdatePageSize: handleUpdatePageSize,
      itemCount: total.value,
      pageSize: pageSize.value,
      page: current.value
    }
  })

  const handleUpdatePage = (val: number) => {
    current.value = val
  }
  const handleUpdatePageSize = (val: number) => {
    pageSize.value = val
  }

  const handleRequestList = () => {
    getList().then((res) => {
      const { total: count, list } = res
      total.value = count
      pageList.value = list
    })
  }
  const unifyHandleMethod = () => {
    if (current.value === 1) {
      handleRequestList()
      return
    }
    current.value = 1
  }

  watch(
    [pageSize, () => searchParams],
    () => {
      unifyHandleMethod()
    },
    {
      deep: true
    }
  )
  watch(current, () => {
    handleRequestList()
  })

  onMounted(() => {
    if (isMounted) {
      nextTick(() => {
        unifyHandleMethod()
      })
    }
  })

  return {
    total,
    current,
    pageSize,
    pageList,
    commonPaginationConfig,
    handleUpdatePage,
    handleUpdatePageSize,
    handleRequestList
  }
}
