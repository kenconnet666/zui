/**
 * `usePopper` —— floating-ui useFloating 薄包装。
 *
 * **覆盖**:基础 API 返回值结构。Floating-ui 内部计算依赖 ResizeObserver + 真实 layout,
 * 在 happy-dom 下定位数值未必精确,因此只测 API 形状(`floatingStyles` / `placement` / `update` 等存在)。
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { usePopper } from '../src'

describe('usePopper', () => {
  it('返回 floatingStyles / placement / update / strategy refs', () => {
    let popper: ReturnType<typeof usePopper> | null = null
    const C = defineComponent({
      setup() {
        const reference = ref<HTMLElement | null>(null)
        const floating = ref<HTMLElement | null>(null)
        popper = usePopper(reference, floating)
        return () =>
          h('div', [
            h('button', { ref: 'reference' }, 'btn'),
            h('div', { ref: 'floating' }, 'pop'),
          ])
      },
    })
    mount(C)
    expect(popper).not.toBeNull()
    expect(popper!.floatingStyles).toBeDefined()
    expect(popper!.placement).toBeDefined()
    expect(popper!.strategy).toBeDefined()
    expect(typeof popper!.update).toBe('function')
  })

  it('默认 placement=bottom', () => {
    let popper: ReturnType<typeof usePopper> | null = null
    const C = defineComponent({
      setup() {
        popper = usePopper(ref(null), ref(null))
        return () => h('div')
      },
    })
    mount(C)
    expect(popper!.placement.value).toBe('bottom')
  })

  it('指定 placement / strategy', () => {
    let popper: ReturnType<typeof usePopper> | null = null
    const C = defineComponent({
      setup() {
        popper = usePopper(ref(null), ref(null), {
          placement: 'top-start',
          strategy: 'fixed',
        })
        return () => h('div')
      },
    })
    mount(C)
    expect(popper!.placement.value).toBe('top-start')
    expect(popper!.strategy.value).toBe('fixed')
  })
})
