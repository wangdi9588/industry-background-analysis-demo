import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'
import { NButton, NEllipsis } from 'naive-ui'

import { EllipsisExpandProps } from './types'
import { debounce } from 'lodash-es'

export const EllipsisExpand = defineComponent({
  name: 'EllipsisExpand',
  props: {
    content: {
      type: String as PropType<EllipsisExpandProps['content']>,
      default: ''
    },
    lineClamp: {
      type: Number as PropType<EllipsisExpandProps['lineClamp']>,
      default: 3
    }
  },
  setup(props, { attrs }) {
    const ellipsisRefEle = ref()

    const expanded = ref(false)

    const isClamped = ref(false) // 文本是否被截断

    // 动态计算是否需要显示展开按钮
    const showToggle = computed(() => isClamped.value || expanded.value)

    const computedCurrentLineClamp = computed(() => {
      return expanded.value ? null : props.lineClamp
    })

    const debouncedUpdate = debounce(() => checkOver(), 100)
    const resizeObserver = new ResizeObserver(debouncedUpdate)

    function checkOver() {
      const { scrollHeight, offsetHeight } = ellipsisRefEle.value.$el
      isClamped.value = scrollHeight > offsetHeight
    }
    onMounted(() => {
      nextTick(() => {
        checkOver()
        resizeObserver.observe(ellipsisRefEle.value.$el)
      })
    })
    onBeforeUnmount(() => {
      resizeObserver.disconnect()
    })

    return () => (
      <div>
        <NEllipsis ref={ellipsisRefEle} line-clamp={computedCurrentLineClamp.value} tooltip={false}>
          {{
            default: () => props.content
          }}
        </NEllipsis>
        {showToggle.value && (
          <div style={{ display: 'flex', 'justify-content': 'flex-end' }}>
            {
              <NButton style="color:#fff" text type="primary" size="small" onClick={() => (expanded.value = !expanded.value)}>
                {{
                  default: () => (expanded.value ? '收起' : '展开')
                }}
              </NButton>
            }
          </div>
        )}
      </div>
    )
  }
})

export type { EllipsisExpandProps }
