/**
 * `ZModal` —— Portal + mask + escape stack 对话框。
 */
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZModal } from '../src'

afterEach(() => {
  document.body.querySelectorAll('[role="dialog"]').forEach((el) => el.parentElement?.remove())
  document.body.style.overflow = ''
})

function makeHost(visible: ReturnType<typeof ref<boolean>>, extraProps: Record<string, unknown> = {}) {
  return defineComponent({
    setup() {
      return () =>
        h(
          ZModal,
          {
            visible: visible.value,
            'onUpdate:visible': (v: boolean) => (visible.value = v),
            ...extraProps,
          },
          { default: () => 'body content' },
        )
    },
  })
}

describe('ZModal — 渲染', () => {
  it('visible=false → 不渲染 dialog', () => {
    const visible = ref(false)
    mount(makeHost(visible), { attachTo: document.body })
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('visible=true → portal 渲染 dialog + role=dialog + aria-modal', async () => {
    const visible = ref(true)
    mount(makeHost(visible), { attachTo: document.body })
    await nextTick()
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    expect(dialog!.getAttribute('aria-modal')).toBe('true')
    expect(document.body.textContent).toContain('body content')
  })
})

describe('ZModal — 关闭', () => {
  it('点击关闭按钮 → update:visible(false) + close', async () => {
    const visible = ref(true)
    mount(makeHost(visible, { title: 'T' }), { attachTo: document.body })
    await nextTick()
    const btn = document.querySelector('button[aria-label="关闭"]') as HTMLButtonElement
    expect(btn).not.toBeNull()
    btn.click()
    await nextTick()
    expect(visible.value).toBe(false)
  })

  it('Escape 键 → 关闭', async () => {
    const visible = ref(true)
    mount(makeHost(visible), { attachTo: document.body })
    await nextTick()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(visible.value).toBe(false)
  })

  it('closable=false → 不渲染关闭按钮', async () => {
    const visible = ref(true)
    mount(makeHost(visible, { title: 'T', closable: false }), { attachTo: document.body })
    await nextTick()
    expect(document.querySelector('button[aria-label="关闭"]')).toBeNull()
  })
})

describe('ZModal — body scroll lock', () => {
  it('visible=true 时 body overflow=hidden', async () => {
    const visible = ref(true)
    mount(makeHost(visible), { attachTo: document.body })
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('visible 切换 → body overflow 切换', async () => {
    const visible = ref(false)
    mount(makeHost(visible), { attachTo: document.body })
    await nextTick()
    expect(document.body.style.overflow).toBe('')
    visible.value = true
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    visible.value = false
    await nextTick()
    expect(document.body.style.overflow).toBe('')
  })
})
