/**
 * `ZTooltip` —— 悬停提示。
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { ZTooltip } from '../src'

let wrappers: VueWrapper[] = []

function cleanPortals(): void {
  wrappers.forEach((w) => w.unmount())
  wrappers = []
  document.body.querySelectorAll('[role="tooltip"]').forEach((el) => el.remove())
}

beforeEach(cleanPortals)
afterEach(cleanPortals)

describe('ZTooltip', () => {
  it('默认 hover 模式 + 默认隐藏', () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZTooltip, { content: 'tip' }, { default: () => h('button', 'hover me') })
      },
    })
    wrappers.push(mount(Host, { attachTo: document.body }))
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  })

  it('manual + visible=true → 渲染 tooltip', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZTooltip,
            { content: 'tip-content', trigger: 'manual', visible: true },
            { default: () => h('button', 'b') },
          )
      },
    })
    wrappers.push(mount(Host, { attachTo: document.body }))
    await nextTick()
    const tip = document.querySelector('[role="tooltip"]')
    expect(tip).not.toBeNull()
    expect(tip!.textContent).toContain('tip-content')
  })

  it('disabled → 不渲染', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZTooltip,
            { content: 'tip', trigger: 'manual', visible: true, disabled: true },
            { default: () => h('button', 'b') },
          )
      },
    })
    wrappers.push(mount(Host, { attachTo: document.body }))
    await nextTick()
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  })

  it('content slot 覆盖 content prop', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZTooltip,
            { content: 'from-prop', trigger: 'manual', visible: true },
            {
              default: () => h('button', 'b'),
              content: () => h('strong', 'custom'),
            },
          )
      },
    })
    wrappers.push(mount(Host, { attachTo: document.body }))
    await nextTick()
    const tip = document.querySelector('[role="tooltip"]')
    expect(tip!.textContent).toContain('custom')
    expect(tip!.textContent).not.toContain('from-prop')
  })
})
