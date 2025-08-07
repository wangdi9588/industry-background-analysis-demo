import { LoadingBarInst } from 'naive-ui/es/loading-bar/src/LoadingBarProvider'
import { defineStore } from 'pinia'

interface LoadingStoreState {
  loadingBar: null | LoadingBarInst
  isShowSpin: boolean
}

/**
 * @description:
 * 这里是 按照 loadingBar组件 设计实现的。
 * 如果想改成全局 spin，只需要将 showLoading和hideLoading 内的方法 换成操作 spin隐藏显示即可
 * @return {*}
 */
export const useLoadingStore = defineStore('loadingStore', {
  state: (): LoadingStoreState => ({
    loadingBar: null,
    isShowSpin: false
  }),
  actions: {
    updateLoadingBar(ctx: LoadingBarInst) {
      this.loadingBar = ctx
    },
    showLoading() {
      this.isShowSpin = true
      this.loadingBar?.start()
    },
    hideLoading() {
      this.isShowSpin = false
      this.loadingBar?.finish()
    }
  }
})
