/**
 * `useEscapeStack` —— 多层浮层 ESC 栈式管理(只关最顶层)。
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useEscapeStack } from '../src'

function dispatchEscape(): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
}

function dispatchKey(key: string): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { key }))
}

afterEach(() => {
  // 清理:wrapper.unmount() 已在每个 test 内做
})

describe('useEscapeStack', () => {
  it('单个 handler → Escape 触发回调', () => {
    const fn = vi.fn()
    const C = defineComponent({
      setup() {
        useEscapeStack(fn)
        return () => h('div')
      },
    })
    const w = mount(C)
    dispatchEscape()
    expect(fn).toHaveBeenCalledTimes(1)
    w.unmount()
  })

  it('非 Escape 键 → 不触发', () => {
    const fn = vi.fn()
    const C = defineComponent({
      setup() {
        useEscapeStack(fn)
        return () => h('div')
      },
    })
    const w = mount(C)
    dispatchKey('Enter')
    dispatchKey('a')
    expect(fn).not.toHaveBeenCalled()
    w.unmount()
  })

  it('双层 → 只触发最顶层(后注册的)', () => {
    const outer = vi.fn()
    const inner = vi.fn()
    const Outer = defineComponent({
      setup() {
        useEscapeStack(outer)
        return () => h('div')
      },
    })
    const Inner = defineComponent({
      setup() {
        useEscapeStack(inner)
        return () => h('div')
      },
    })
    const w1 = mount(Outer)
    const w2 = mount(Inner)
    dispatchEscape()
    expect(inner).toHaveBeenCalledTimes(1)
    expect(outer).not.toHaveBeenCalled()
    w2.unmount()
    // inner 销毁后,outer 接管
    dispatchEscape()
    expect(outer).toHaveBeenCalledTimes(1)
    w1.unmount()
  })

  it('enabled=false 的 handler 被跳过', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const disabled = ref(true)
    const C1 = defineComponent({
      setup() {
        useEscapeStack(fn1)
        return () => h('div')
      },
    })
    const C2 = defineComponent({
      setup() {
        // 顶层但 disabled → 应跳过,触发下层
        useEscapeStack(fn2, { enabled: ref(false) })
        return () => h('div')
      },
    })
    void disabled
    const w1 = mount(C1)
    const w2 = mount(C2)
    dispatchEscape()
    expect(fn2).not.toHaveBeenCalled()
    expect(fn1).toHaveBeenCalledTimes(1)
    w2.unmount()
    w1.unmount()
  })

  it('Esc 别名(部分浏览器旧 key 值)也触发', () => {
    const fn = vi.fn()
    const C = defineComponent({
      setup() {
        useEscapeStack(fn)
        return () => h('div')
      },
    })
    const w = mount(C)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Esc' }))
    expect(fn).toHaveBeenCalledTimes(1)
    w.unmount()
  })
})
