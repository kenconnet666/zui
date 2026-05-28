/**
 * `ZPopover` —— 弹出层。
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { ZPopover } from '../src'

let wrappers: VueWrapper[] = []

function cleanPortals(): void {
  wrappers.forEach(w => w.unmount())
  wrappers = []
  document.body.querySelectorAll('[role="dialog"]').forEach(el => el.remove())
}

beforeEach(cleanPortals)
afterEach(cleanPortals)

describe('ZPopover', () => {
  it('默认 click 模式 + 默认隐藏', () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZPopover,
            { title: 'T' },
            {
              default: () => h('button', 'click'),
              content: () => 'content body',
            },
          )
      },
    })
    wrappers.push(mount(Host, { attachTo: document.body }))
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('点击触发器 → 渲染 dialog', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZPopover,
            { title: 'T' },
            {
              default: () => h('button', { id: 'trig' }, 'click'),
              content: () => 'content body',
            },
          )
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.find('#trig').trigger('click')
    await nextTick()
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.body.textContent).toContain('content body')
  })

  it('manual + visible=true 受控', async () => {
    const visible = ref(true)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZPopover,
            { trigger: 'manual', visible: visible.value, title: 'T' },
            { default: () => h('button', 'b'), content: () => 'manual content' },
          )
      },
    })
    wrappers.push(mount(Host, { attachTo: document.body }))
    await nextTick()
    expect(document.body.textContent).toContain('manual content')
  })

  it('Escape 关闭(click 模式)', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZPopover, null, {
            default: () => h('button', { id: 'trig2' }, 'b'),
            content: () => 'x',
          })
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.find('#trig2').trigger('click')
    await nextTick()
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('title prop 渲染', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZPopover,
            { trigger: 'manual', visible: true, title: 'My Title' },
            { default: () => h('button', 'b'), content: () => 'body' },
          )
      },
    })
    wrappers.push(mount(Host, { attachTo: document.body }))
    await nextTick()
    expect(document.body.textContent).toContain('My Title')
  })
})
