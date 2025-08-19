import { ref, watch } from 'vue'

export function useAwaitActionHook() {
  const isWaiting = ref(false)
  const actionQueen = ref<Array<() => void>>([])

  const addTask = (fn: () => void) => {
    if (isWaiting.value) {
      actionQueen.value.push(fn)
    } else {
      fn()
    }
  }

  watch(isWaiting, (val) => {
    if (!val && actionQueen.value.length) {
      while (actionQueen.value.length) {
        const fn = actionQueen.value.shift()
        fn?.()
      }
      actionQueen.value.length = 0
    }
  })

  return {
    isWaiting,
    addTask
  }
}
