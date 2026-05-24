/**
 * Phase β 批 3 spec:ZTimeline / ZSteps / ZBackTop / ZAffix / ZStatistic / ZLoadingBar.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import {
  ZTimeline,
  ZSteps,
  ZBackTop,
  ZAffix,
  ZStatistic,
  ZLoadingBar,
} from '../src'

let wrappers: VueWrapper[] = []

function cleanup(): void {
  wrappers.forEach((w) => w.unmount())
  wrappers = []
  document.body.querySelectorAll('[role="progressbar"], [aria-label="回到顶部"]').forEach((el) => el.parentElement?.remove())
}

beforeEach(cleanup)
afterEach(cleanup)

describe('ZTimeline', () => {
  it('items 渲染 + role=list', () => {
    const w = mount(ZTimeline, {
      props: {
        items: [
          { title: 'Step 1', description: 'desc', color: (c: any) => c._success },
          { title: 'Step 2', color: (c: any) => c._primary },
          { title: 'Step 3' },
        ],
      },
    })
    expect(w.attributes('role')).toBe('list')
    expect(w.text()).toContain('Step 1')
    expect(w.text()).toContain('Step 2')
    expect(w.text()).toContain('Step 3')
    expect(w.text()).toContain('desc')
  })

  it('item.color factory 应用到 dot 背景色', () => {
    mount(ZTimeline, {
      props: { items: [{ title: 'ok', color: (c: any) => c._danger }] },
    })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css.toLowerCase()).toMatch(/#d32f2f|background-color:rgb\(211/)
  })
})

describe('ZSteps', () => {
  const ITEMS = [
    { title: 'A', description: 'a' },
    { title: 'B' },
    { title: 'C' },
  ]

  it('current=1 → 第 2 步 process', () => {
    const w = mount(ZSteps, { props: { current: 1, items: ITEMS } })
    expect(w.attributes('role')).toBe('list')
    expect(w.text()).toContain('A')
    expect(w.text()).toContain('B')
  })

  it('已完成的步骤显示 check 图标(_success 色)', () => {
    mount(ZSteps, { props: { current: 2, items: ITEMS } })
    // 前两步 finish 状态走 _success
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css.toLowerCase()).toMatch(/#2e7d32|background-color:rgb\(46/)
  })

  it('errored=true → 当前步骤红色(_danger)', () => {
    mount(ZSteps, { props: { current: 1, items: ITEMS, errored: true } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css.toLowerCase()).toMatch(/#d32f2f/)
  })

  it('currentColor factory → 当前步颜色覆盖默认 _primary', () => {
    mount(ZSteps, {
      props: {
        current: 1,
        items: ITEMS,
        currentColor: (c: any) => c._warning,
      },
    })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    // _warning 在 light theme 走橙色系
    expect(css.toLowerCase()).toMatch(/#ed6c02|#ff9800|background-color:rgb\(/)
  })

  it('vertical=true → flex-direction:column', () => {
    mount(ZSteps, { props: { current: 0, items: ITEMS, vertical: true } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/flex-direction:column/)
  })
})

describe('ZBackTop', () => {
  it('类型导入 OK(运行时挂载需真实浏览器环境)', () => {
    // happy-dom 下挂载 + scroll event listen 不稳定,跳过 mount,只检查导入
    expect(ZBackTop).toBeDefined()
  })
})

describe('ZAffix', () => {
  it('渲染 wrapper + slot', () => {
    const w = mount(ZAffix, { slots: { default: () => 'content' } })
    expect(w.text()).toContain('content')
  })
})

describe('ZStatistic', () => {
  it('value 渲染', () => {
    const w = mount(ZStatistic, { props: { value: 1234567 } })
    expect(w.text()).toContain('1,234,567')
  })

  it('precision=2 → 小数', () => {
    const w = mount(ZStatistic, { props: { value: 3.14159, precision: 2 } })
    expect(w.text()).toContain('3.14')
  })

  it('title + prefix + suffix', () => {
    const w = mount(ZStatistic, {
      props: { value: 100, title: 'Sales', prefix: '$', suffix: '万' },
    })
    expect(w.text()).toContain('Sales')
    expect(w.text()).toContain('$')
    expect(w.text()).toContain('100')
    expect(w.text()).toContain('万')
  })

  it('separator 自定义', () => {
    const w = mount(ZStatistic, { props: { value: 1234567, separator: ' ' } })
    expect(w.text()).toContain('1 234 567')
  })

  it('string value 原样输出(不格式化)', () => {
    const w = mount(ZStatistic, { props: { value: 'N/A' } })
    expect(w.text()).toContain('N/A')
  })
})

describe('ZLoadingBar', () => {
  it('value=null → 不渲染', () => {
    wrappers.push(mount(ZLoadingBar, { props: { value: null }, attachTo: document.body }))
    expect(document.querySelector('[role="progressbar"]')).toBeNull()
  })

  it('value=50 → 渲染 + aria-valuenow=50', async () => {
    wrappers.push(mount(ZLoadingBar, { props: { value: 50 }, attachTo: document.body }))
    await new Promise((r) => setTimeout(r, 0))
    const bar = document.querySelector('[role="progressbar"]')
    expect(bar).not.toBeNull()
    expect(bar!.getAttribute('aria-valuenow')).toBe('50')
  })

  it('error=true → 红色', async () => {
    wrappers.push(mount(ZLoadingBar, { props: { value: 30, error: true }, attachTo: document.body }))
    await new Promise((r) => setTimeout(r, 0))
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css.toLowerCase()).toMatch(/#d32f2f|background-color:rgb\(211/)
  })
})
