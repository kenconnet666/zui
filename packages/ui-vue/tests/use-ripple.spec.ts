/**
 * `useRipple` —— Material 风波纹。pointerdown → 注入 <span class="zui-ripple"> → animationend 移除。
 */
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useRipple } from '../src'

function makePointerDown(x = 50, y = 50): PointerEvent {
  return new PointerEvent('pointerdown', {
    clientX: x,
    clientY: y,
    bubbles: true,
    pointerType: 'mouse',
  })
}

afterEach(() => {
  document.querySelectorAll('.zui-ripple').forEach((el) => el.remove())
})

/**
 * 构造一个带 button + useRipple 的简单组件,callback ref 把 element 写入外部 ref。
 * 用 functional ref(`ref: (el) => target.value = el`)规避 render function 直传 Ref 的边界。
 */
function makeRippleComponent(
  target: Ref<HTMLElement | null>,
  rippleOpts?: Parameters<typeof useRipple>[1],
): ReturnType<typeof defineComponent> {
  return defineComponent({
    setup() {
      useRipple(target, rippleOpts)
      return () =>
        h('button', {
          ref: (el: unknown) => {
            target.value = (el as HTMLElement) ?? null
          },
          style: { position: 'relative', overflow: 'hidden', width: '100px', height: '40px' },
        })
    },
  })
}

describe('useRipple', () => {
  it('pointerdown 注入 .zui-ripple 元素', async () => {
    const target = ref<HTMLElement | null>(null)
    const w = mount(makeRippleComponent(target), { attachTo: document.body })
    await nextTick()
    const btn = w.element as HTMLElement
    btn.dispatchEvent(makePointerDown())
    expect(btn.querySelector('.zui-ripple')).not.toBeNull()
    w.unmount()
  })

  it('注入 keyframes 样式到 head', async () => {
    const target = ref<HTMLElement | null>(null)
    const w = mount(makeRippleComponent(target), { attachTo: document.body })
    await nextTick()
    ;(w.element as HTMLElement).dispatchEvent(makePointerDown())
    expect(document.getElementById('zui-ripple-style')).not.toBeNull()
    w.unmount()
  })

  it('disabled=true → 不注入 ripple', async () => {
    const target = ref<HTMLElement | null>(null)
    const w = mount(makeRippleComponent(target, { disabled: true }), { attachTo: document.body })
    await nextTick()
    const btn = w.element as HTMLElement
    btn.dispatchEvent(makePointerDown())
    expect(btn.querySelector('.zui-ripple')).toBeNull()
    w.unmount()
  })

  it('自定义 color / duration 写入 ripple style', async () => {
    const target = ref<HTMLElement | null>(null)
    const w = mount(
      makeRippleComponent(target, { color: 'rgba(255,0,0,0.5)', duration: 500 }),
      { attachTo: document.body },
    )
    await nextTick()
    ;(w.element as HTMLElement).dispatchEvent(makePointerDown())
    const ripple = (w.element as HTMLElement).querySelector('.zui-ripple') as HTMLElement
    expect(ripple).not.toBeNull()
    expect(ripple.style.backgroundColor).toContain('255, 0, 0')
    expect(ripple.style.animationDuration).toBe('500ms')
    w.unmount()
  })

  it('animationend → 自动移除 ripple', async () => {
    const target = ref<HTMLElement | null>(null)
    const w = mount(makeRippleComponent(target), { attachTo: document.body })
    await nextTick()
    const btn = w.element as HTMLElement
    btn.dispatchEvent(makePointerDown())
    const ripple = btn.querySelector('.zui-ripple') as HTMLElement
    expect(ripple).not.toBeNull()
    ripple.dispatchEvent(new Event('animationend'))
    expect(btn.querySelector('.zui-ripple')).toBeNull()
    w.unmount()
  })

  it('reactive disabled ref → 动态切换', async () => {
    const target = ref<HTMLElement | null>(null)
    const disabled = ref(false)
    const w = mount(makeRippleComponent(target, { disabled }), { attachTo: document.body })
    await nextTick()
    const btn = w.element as HTMLElement
    btn.dispatchEvent(makePointerDown())
    expect(btn.querySelectorAll('.zui-ripple').length).toBe(1)
    disabled.value = true
    btn.dispatchEvent(makePointerDown())
    expect(btn.querySelectorAll('.zui-ripple').length).toBe(1)
    w.unmount()
  })
})
