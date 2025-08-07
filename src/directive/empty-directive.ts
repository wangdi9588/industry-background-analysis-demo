// src/directives/empty-directive.ts
import type { App, Directive, DirectiveBinding } from 'vue'
import empty_img from '@/assets/images/empty_img.png'
/**
 * 检查数据是否为空
 */
const isEmpty = (value: unknown): boolean => {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && value !== null && Object.keys(value).length === 0)
  )
}

/**
 * 默认空状态组件
 */
const renderEmptyState = (options?: { text?: string; image?: string }) => {
  const { text = '暂无相关内容', image } = options || {}

  return `
    <div class="empty-state" style="text-align: center; padding: 20px; color: #999;align-items: center;
    justify-content: center;
    display: flex
;
    flex-direction: column;">
      ${`<img src="${image || empty_img}" style="width: 80px; height: 80px; margin-bottom: 8px;" />`}
      <div>${text}</div>
    </div>
  `
}

/**
 * v-empty 指令实现
 */
const emptyDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    updateEmptyState(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    updateEmptyState(el, binding)
  }
}

const emptyElements = new WeakMap<HTMLElement, HTMLDivElement>()

const updateEmptyState = (el: HTMLElement, binding: DirectiveBinding) => {
  const { value } = binding
  const data = typeof value === 'object' && 'data' in value ? value.data : value
  const options = typeof value === 'object' && 'data' in value ? value : undefined

  let emptyEl = emptyElements.get(el)
  if (options.loading) return

  if (isEmpty(data)) {
    if (!emptyEl) {
      emptyEl = document.createElement('div')
      emptyEl.className = 'v-empty-container'
      el.appendChild(emptyEl)
      emptyElements.set(el, emptyEl)
    }
    emptyEl.innerHTML = renderEmptyState(options)
    // el.style.display = 'none'
    emptyEl.style.display = 'block'
  } else {
    // el.style.display = ''
    emptyEl ? (emptyEl.style.display = 'none') : ''
  }
}

/**
 * 注册指令的插件形式
 */
export const emptyDirectivePlugin = {
  install(app: App) {
    app.directive('empty', emptyDirective)
  }
}

// 默认导出插件
export default emptyDirectivePlugin
