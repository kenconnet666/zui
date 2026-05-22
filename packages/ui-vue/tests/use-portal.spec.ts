/**
 * `usePortal` —— Teleport target 解析 + ZPortal 组件。
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { usePortal, ZPortal } from '../src'

describe('usePortal', () => {
  it('默认 target = document.body', async () => {
    let portalEl: HTMLElement | null = null
    const C = defineComponent({
      setup() {
        const el = usePortal()
        return () => {
          portalEl = el.value
          return h('div')
        }
      },
    })
    mount(C)
    await nextTick()
    expect(portalEl).toBe(document.body)
  })

  it('传 css selector 字符串 → querySelector 结果', async () => {
    const div = document.createElement('div')
    div.id = 'my-target'
    document.body.appendChild(div)
    let portalEl: HTMLElement | null = null
    const C = defineComponent({
      setup() {
        const el = usePortal('#my-target')
        return () => {
          portalEl = el.value
          return h('div')
        }
      },
    })
    mount(C)
    await nextTick()
    expect(portalEl).toBe(div)
    div.remove()
  })

  it('传 Element → 直接使用', async () => {
    const div = document.createElement('div')
    let portalEl: HTMLElement | null = null
    const C = defineComponent({
      setup() {
        const el = usePortal(div)
        return () => {
          portalEl = el.value
          return h('div')
        }
      },
    })
    mount(C)
    await nextTick()
    expect(portalEl).toBe(div)
  })
})

describe('ZPortal', () => {
  it('默认 to=body,渲染 slot 到 body', async () => {
    mount(
      defineComponent({
        components: { ZPortal },
        template: '<ZPortal><div data-testid="portal-content">x</div></ZPortal>',
      }),
      { attachTo: document.body },
    )
    await nextTick()
    expect(document.querySelector('[data-testid="portal-content"]')).not.toBeNull()
  })
})
