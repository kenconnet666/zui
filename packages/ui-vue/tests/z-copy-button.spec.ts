/**
 * `ZCopyButton` —— 通用复制按钮 spec。
 *
 * 覆盖:
 * - 默认无 label → 纯图标按钮(无可见 span)
 * - 传 label → 显示文字
 * - 点击 → emit copy(true, text) + clipboard.writeText 被调用
 * - 复制成功 → 按钮文字 / aria-label 临时切到 copiedLabel
 * - duration 控制临时态时长
 * - text 变化复制对应新值
 * - toast=false → 不触发 messageApi 容器
 * - clipboard 不可用(纯图标场景模拟) → emit copy(false, text),不切换文字
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { ZCopyButton } from '../src'

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn(() => Promise.resolve()) },
  })
  // 清掉上一轮的 message host
  document.querySelectorAll('[data-zui-message-host]').forEach((n) => n.remove())
})
afterEach(() => {
  vi.useRealTimers()
})

describe('ZCopyButton', () => {
  it('默认无 label → 纯图标按钮(无可见 span)', () => {
    const w = mount(ZCopyButton, { props: { text: 'hi' } })
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.find('span').exists()).toBe(false)
    // aria-label 默认 "复制"
    expect(w.attributes('aria-label')).toBe('复制')
  })

  it('传 label → 显示文字 + aria-label 跟随', () => {
    const w = mount(ZCopyButton, { props: { text: 'hi', label: '拷贝' } })
    expect(w.find('span').text()).toBe('拷贝')
    expect(w.attributes('aria-label')).toBe('拷贝')
  })

  it('点击 → emit copy(true, text) + 调 clipboard.writeText', async () => {
    const w = mount(ZCopyButton, { props: { text: 'payload', toast: false } })
    await w.trigger('click')
    await flushPromises()
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('payload')
    expect(w.emitted('copy')?.[0]).toEqual([true, 'payload'])
  })

  it('复制成功 → 按钮文字 + aria-label 临时切到 copiedLabel', async () => {
    vi.useFakeTimers()
    const w = mount(ZCopyButton, {
      props: { text: 'x', label: '复制', toast: false },
    })
    await w.trigger('click')
    await vi.advanceTimersByTimeAsync(0)
    await nextTick()
    expect(w.find('span').text()).toBe('已复制')
    expect(w.attributes('aria-label')).toBe('已复制')

    await vi.advanceTimersByTimeAsync(1500)
    await nextTick()
    expect(w.find('span').text()).toBe('复制')
  })

  it('duration=500 → 临时态 500ms 后恢复', async () => {
    vi.useFakeTimers()
    const w = mount(ZCopyButton, {
      props: { text: 'x', label: '复制', duration: 500, toast: false },
    })
    await w.trigger('click')
    await vi.advanceTimersByTimeAsync(0)
    await nextTick()
    expect(w.find('span').text()).toBe('已复制')

    await vi.advanceTimersByTimeAsync(499)
    await nextTick()
    expect(w.find('span').text()).toBe('已复制')

    await vi.advanceTimersByTimeAsync(1)
    await nextTick()
    expect(w.find('span').text()).toBe('复制')
  })

  it('toast=false → 不创建 message host', async () => {
    const w = mount(ZCopyButton, { props: { text: 'x', toast: false } })
    await w.trigger('click')
    await flushPromises()
    expect(document.querySelector('[data-zui-message-host]')).toBeNull()
  })

  it('toast=true(默认)+ 成功 → 创建 message host', async () => {
    const w = mount(ZCopyButton, { props: { text: 'x' } })
    await w.trigger('click')
    await flushPromises()
    expect(document.querySelector('[data-zui-message-host]')).not.toBeNull()
  })

  it('clipboard 不可用 → emit copy(false, text),按钮文字不切换', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    })
    const w = mount(ZCopyButton, {
      props: { text: 'x', label: '复制', toast: false },
    })
    await w.trigger('click')
    await flushPromises()
    expect(w.emitted('copy')?.[0]).toEqual([false, 'x'])
    expect(w.find('span').text()).toBe('复制')
  })

  it('text 变化 → 复制新值', async () => {
    const w = mount(ZCopyButton, { props: { text: 'a', toast: false } })
    await w.setProps({ text: 'b' })
    await w.trigger('click')
    await flushPromises()
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith('b')
  })
})
