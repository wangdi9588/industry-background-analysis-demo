<script setup lang="ts">
import { useMessage, MessageReactive, MessageOptions } from 'naive-ui'
import { default as AsyncQueue } from '@/utils/asyncQueue'
import { TMessageType } from './types/message'

const message = useMessage()
let msgReactive: MessageReactive | null = null
const removeMessage = () => {
  if (msgReactive) {
    msgReactive.destroy()
    msgReactive = null
  }
}
let timer: number | null = null
const notifyQueue = new AsyncQueue()
window.$message = (type: TMessageType = 'info', content: string, options: MessageOptions = {}) => {
  const duration = options.duration || 3000
  notifyQueue
    .push(
      () => {
        if (msgReactive) {
          msgReactive.type = type
          msgReactive.content = content
        } else {
          options.duration = 0
          msgReactive = message[type](content, options)
        }
      },
      duration,
      true
    )
    .finally(() => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        removeMessage()
        timer = null
      }, duration)
      return msgReactive
    })
}
</script>
<template>
  <slot></slot>
</template>
