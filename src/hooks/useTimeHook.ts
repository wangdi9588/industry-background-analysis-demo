interface ITimeInfo {
  time_info: string
  date_info: string
}

export function useTimeHook() {
  let time_num = 0
  let animationId: number | null = null

  const timeData = reactive<ITimeInfo>({
    time_info: '',
    date_info: ''
  })

  function getTime() {
    if (time_num < 5) {
      time_num++
      requestAnimationFrame(() => {
        getTime()
      })
      return
    }
    time_num = 0
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    timeData.date_info = `${year}-${month}-${day}`
    const hours = date.getHours()
    const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    timeData.time_info = `${hours}:${min}:${second}`

    animationId = requestAnimationFrame(() => {
      getTime()
    })
  }

  onMounted(() => {
    getTime()
  })
  onBeforeUnmount(() => {
    animationId && cancelAnimationFrame(animationId)
  })

  return {
    timeData
  }
}
