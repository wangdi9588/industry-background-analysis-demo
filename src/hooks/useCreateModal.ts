import { ModalOptions, useModal } from 'naive-ui'
import { VNodeChild } from 'vue'
import cancel_img from '@/assets/images/cancel.png'

export function useCreateModalHook() {
  const modal = useModal()

  const modalIntance = shallowRef()

  function createModal(childNode: VNodeChild) {
    modalIntance.value = modal.create({
      title: '',
      preset: 'card',
      bordered: false,
      closable: false,
      style: {
        height: '100vh',
        background: 'transparent',
        '--n-padding-top': 0,
        '--n-padding-bottom': 0,
        '--n-padding-left': 0
      },
      content: () => {
        return h(
          'div',
          {
            style: {
              width: '100%',
              height: '100%',
              display: 'flex',
              'flex-direction': 'column',
              overflow: 'hidden'
            }
          },
          [
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  'justify-content': 'flex-end',
                  'align-items': 'center',
                  height: '61px'
                }
              },
              h('img', {
                src: cancel_img,
                style: {
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer'
                },
                onClick: () => {
                  modalIntance.value.destroy()
                }
              })
            ),
            h(
              'div',
              {
                style: {
                  width: '100%',
                  height: 'calc(100vh - 61px',
                  background: '#1566b2',
                  'border-radius': '48px 48px 0 0'
                }
              },
              [childNode]
            )
          ]
        )
      }
    })
  }

  function destroyModal() {
    modalIntance.value?.destroy()
  }

  return {
    modalIntance,
    createModal,
    destroyModal
  }
}
