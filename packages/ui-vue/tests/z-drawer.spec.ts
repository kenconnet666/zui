/**
 * `ZDrawer` —— 抽屉(类 Modal 但侧边滑入)。
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { ZDrawer } from '../src'

let wrappers: VueWrapper[] = []

function cleanPortals(): void {
  wrappers.forEach(w => w.unmount())
  wrappers = []
  document.body.querySelectorAll('[role="dialog"]').forEach(el => el.remove())
  document.body.style.overflow = ''
}

beforeEach(cleanPortals)
afterEach(cleanPortals)

function makeHost(
  visible: ReturnType<typeof ref<boolean>>,
  extraProps: Record<string, unknown> = {},
) {
  return defineComponent({
    setup() {
      return () =>
        h(
          ZDrawer,
          {
            visible: visible.value,
            'onUpdate:visible': (v: boolean) => (visible.value = v),
            ...extraProps,
          },
          { default: () => 'drawer body' },
        )
    },
  })
}

describe('ZDrawer', () => {
  it('visible=false → 不渲染', () => {
    const visible = ref(false)
    wrappers.push(mount(makeHost(visible), { attachTo: document.body }))
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('visible=true → portal 渲染 + body 锁滚动', async () => {
    const visible = ref(true)
    wrappers.push(mount(makeHost(visible), { attachTo: document.body }))
    await nextTick()
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.body.textContent).toContain('drawer body')
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('点击关闭按钮 → update:visible(false)', async () => {
    const visible = ref(true)
    wrappers.push(mount(makeHost(visible, { title: 'Title' }), { attachTo: document.body }))
    await nextTick()
    const closeBtn = document.querySelector('button[aria-label="关闭"]') as HTMLButtonElement
    expect(closeBtn).not.toBeNull()
    closeBtn.click()
    await nextTick()
    expect(visible.value).toBe(false)
  })

  it('Escape → 关闭', async () => {
    const visible = ref(true)
    wrappers.push(mount(makeHost(visible), { attachTo: document.body }))
    await nextTick()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(visible.value).toBe(false)
  })

  it('closable=false → 无关闭按钮', async () => {
    const visible = ref(true)
    wrappers.push(
      mount(makeHost(visible, { title: 'T', closable: false }), { attachTo: document.body }),
    )
    await nextTick()
    expect(document.querySelector('button[aria-label="关闭"]')).toBeNull()
  })

  it('placement=left → drawer 在左侧(left:0 写入 style)', async () => {
    const visible = ref(true)
    wrappers.push(mount(makeHost(visible, { placement: 'left' }), { attachTo: document.body }))
    await nextTick()
    const css = Array.from(document.querySelectorAll('style'))
      .map(el => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/left:0/)
  })
})
