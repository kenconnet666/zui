/**
 * `ZCodeCard` —— 文档站「示例 + 源码」卡片 spec。
 *
 * 覆盖:
 * - title prop 渲染
 * - #header slot 优先于 title prop
 * - default 折叠态:代码区不可见(v-show=false)
 * - 点击展开按钮 → emit `update:expanded` + 展开
 * - defaultExpanded=true → 初始展开
 * - 受控 `expanded` prop:父组件控制展开
 * - 点击复制按钮 → emit `copy` + 按钮文字临时切到「已复制」
 * - `stripImports` helper:单行 / 多行 / 类型 import
 * - showImports=true → 不剥 import
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { ZCodeCard, stripImports } from '../src'

// happy-dom 默认无 clipboard,手动桩
beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn(() => Promise.resolve()) },
  })
})
afterEach(() => {
  vi.useRealTimers()
})

describe('ZCodeCard', () => {
  it('title prop 渲染到 header', () => {
    const w = mount(ZCodeCard, {
      props: { source: 'const x = 1', title: '基础用法' },
    })
    expect(w.text()).toContain('基础用法')
  })

  it('#header slot 优先于 title prop', () => {
    const w = mount(ZCodeCard, {
      props: { source: 'x', title: 'PROP_TITLE' },
      slots: { header: () => '自定义头部' },
    })
    expect(w.text()).toContain('自定义头部')
    expect(w.text()).not.toContain('PROP_TITLE')
  })

  it('default 折叠态:展开按钮文字「展开代码」', () => {
    const w = mount(ZCodeCard, { props: { source: 'x' } })
    const expandBtn = w.find('button[aria-label="展开代码"]')
    expect(expandBtn.exists()).toBe(true)
  })

  it('点击展开按钮 → emit update:expanded + aria-expanded=true', async () => {
    const w = mount(ZCodeCard, { props: { source: 'x' } })
    await w.find('button[aria-label="展开代码"]').trigger('click')
    expect(w.emitted('update:expanded')?.[0]).toEqual([true])
    const collapseBtn = w.find('button[aria-label="收起代码"]')
    expect(collapseBtn.exists()).toBe(true)
    expect(collapseBtn.attributes('aria-expanded')).toBe('true')
  })

  it('defaultExpanded=true → 初始 aria-expanded=true', () => {
    const w = mount(ZCodeCard, {
      props: { source: 'x', defaultExpanded: true },
    })
    const collapseBtn = w.find('button[aria-label="收起代码"]')
    expect(collapseBtn.exists()).toBe(true)
    expect(collapseBtn.attributes('aria-expanded')).toBe('true')
  })

  it('受控 expanded prop:点击不改 internal state,但 emit update:expanded', async () => {
    const w = mount(ZCodeCard, {
      props: { source: 'x', expanded: false },
    })
    await w.find('button[aria-label="展开代码"]').trigger('click')
    expect(w.emitted('update:expanded')?.[0]).toEqual([true])
    // expanded prop 仍是 false → 按钮还是「展开代码」
    expect(w.find('button[aria-label="展开代码"]').exists()).toBe(true)
  })

  it('点击复制 → 调 clipboard.writeText + emit copy(true, code)', async () => {
    const code = 'const a = 1'
    const w = mount(ZCodeCard, { props: { source: code, copyToastDuration: 0 } })
    await w.find('button[aria-label="复制代码"]').trigger('click')
    await flushPromises()
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(code)
    expect(w.emitted('copy')?.[0]).toEqual([true, code])
  })

  it('复制成功 → 按钮文字 1.5s 内显示「已复制」', async () => {
    vi.useFakeTimers()
    const w = mount(ZCodeCard, { props: { source: 'x', copyToastDuration: 0 } })
    const btn = w.find('button[aria-label="复制代码"]')
    await btn.trigger('click')
    await vi.advanceTimersByTimeAsync(0)
    await nextTick()
    expect(w.find('button[aria-label="已复制"]').exists()).toBe(true)

    await vi.advanceTimersByTimeAsync(1500)
    await nextTick()
    expect(w.find('button[aria-label="复制代码"]').exists()).toBe(true)
  })

  it('剥 import 默认开:processedSource 不含 import 行', () => {
    const src = `import { ref } from 'vue'\n\nconst x = ref(0)`
    const w = mount(ZCodeCard, { props: { source: src, defaultExpanded: true } })
    const html = w.html()
    expect(html).not.toContain("import { ref }")
    expect(html).toContain('const x = ref(0)')
  })

  it('showImports=true → 保留 import 行', () => {
    const src = `import { ref } from 'vue'\n\nconst x = ref(0)`
    const w = mount(ZCodeCard, {
      props: { source: src, showImports: true, defaultExpanded: true },
    })
    expect(w.html()).toContain('import')
  })
})

describe('stripImports', () => {
  it('单行 import', () => {
    expect(stripImports(`import { ref } from 'vue'\nconst x = 1`)).toBe('const x = 1')
  })

  it('多个单行 import', () => {
    const src = `import { ref } from 'vue'\nimport { computed } from 'vue'\nconst x = 1`
    expect(stripImports(src)).toBe('const x = 1')
  })

  it('多行 import', () => {
    const src = `import {\n  ref,\n  computed,\n} from 'vue'\nconst x = 1`
    expect(stripImports(src)).toBe('const x = 1')
  })

  it('type import', () => {
    const src = `import type { Foo } from './bar'\nconst x = 1`
    expect(stripImports(src)).toBe('const x = 1')
  })

  it('default import', () => {
    const src = `import Foo from './foo'\nconst x = 1`
    expect(stripImports(src)).toBe('const x = 1')
  })

  it('default + named', () => {
    const src = `import Foo, { bar } from './foo'\nconst x = 1`
    expect(stripImports(src)).toBe('const x = 1')
  })

  it('混合 + 压缩连续空行', () => {
    const src = `import a from 'a'\n\nimport b from 'b'\n\n\nconst x = 1`
    expect(stripImports(src)).toBe('const x = 1')
  })

  it('不影响内容里的 import 字符串', () => {
    const src = `const note = 'remember to import this'`
    expect(stripImports(src)).toBe(src)
  })
})
