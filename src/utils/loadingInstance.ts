/**
 * @description:
 * showLoading 开启loading
 * hideLoading 隐藏loading
 * delay  延迟加载，默认超过100ms之后 才开始显示loading
 * @return {*}
 */
export class LoadingInstance {
  timer: null | number = null
  private _count = 0

  constructor(private showLoading: () => void, private hideLoading: () => void, private delay = 100) {}
  run() {
    if (this._count === 1) {
      this.timer = setTimeout(() => {
        this.showLoading()
        this.timer && clearTimeout(this.timer)
        this.timer = null
      }, this.delay)
    }
  }
  stop() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
      return
    }
    if (this._count === 0) {
      this.hideLoading()
    }
  }
  add() {
    this._count++
    this.run()
  }
  reduce() {
    this._count--
    this.stop()
  }
}
