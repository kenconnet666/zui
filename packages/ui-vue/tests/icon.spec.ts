/**
 * `ZIcon` —— 行为测试。
 *
 * 覆盖：
 * 1. slot 模式渲染
 * 2. component prop 模式渲染
 * 3. size prop（数字 + 字符串）
 * 4. color prop（字面量 + token 引用）
 * 5. intent → 含语义色（success 在 emotion 注入的 styleSheet 内可查）
 * 6. depth → 含 opacity
 * 7. spin → 含 animation
 * 8. a11y: label / 无 label
 * 9. ZConfigProvider componentTokens 嵌套覆盖
 * 10. tag prop 切换根元素
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { defaultLight } from '@kenconnet666/zui-core'
import { ZConfigProvider, ZIcon } from '../src'

// ─── 用一个最小 SVG 占位组件代表 @vicons/* 体系 ───
const DummyIcon = defineComponent({
  name: 'DummyIcon',
  setup() {
    return () => h('svg', { 'data-testid': 'dummy', viewBox: '0 0 24 24' })
  },
})

/**
 * 从 className（emotion 类名是哈希）查到注入的 CSS 文本。
 * 用 happy-dom 下的 document.head 收集所有 <style>，**剔除 @keyframes 块**——
 * preset 动画里含 `opacity:0.5` 等会误命中针对 icon class 自身的断言。
 */
function getInjectedCss(): string {
  const raw = Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
  // 去掉 @keyframes / @-webkit-keyframes ...{ ... }（顶层块匹配，假设无嵌套 @-rule）
  return raw.replace(/@(?:-webkit-)?keyframes\s+\S+\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '')
}

describe('ZIcon — 渲染', () => {
  it('slot 模式：渲染 default slot 内容', () => {
    const w = mount(ZIcon, {
      slots: { default: () => h(DummyIcon) },
    })
    expect(w.find('[data-testid="dummy"]').exists()).toBe(true)
  })

  it('component prop 模式：渲染传入组件', () => {
    const w = mount(ZIcon, {
      props: { component: DummyIcon },
    })
    expect(w.find('[data-testid="dummy"]').exists()).toBe(true)
  })

  it('slot 优先于 component prop', () => {
    const Another = defineComponent({
      setup() {
        return () => h('svg', { 'data-testid': 'another' })
      },
    })
    const w = mount(ZIcon, {
      props: { component: Another },
      slots: { default: () => h(DummyIcon) },
    })
    expect(w.find('[data-testid="dummy"]').exists()).toBe(true)
    expect(w.find('[data-testid="another"]').exists()).toBe(false)
  })

  it('默认根元素是 <i>', () => {
    const w = mount(ZIcon, { props: { component: DummyIcon } })
    expect(w.element.tagName).toBe('I')
  })

  it('tag prop 切换根元素', () => {
    const w = mount(ZIcon, { props: { component: DummyIcon, tag: 'span' } })
    expect(w.element.tagName).toBe('SPAN')
  })
})

describe('ZIcon — 样式应用', () => {
  it('base 样式包含 inline-flex 与默认 1em 尺寸', () => {
    mount(ZIcon, { props: { component: DummyIcon } })
    const css = getInjectedCss()
    expect(css).toMatch(/inline-flex/)
    expect(css).toMatch(/1em/)
  })

  it('size 数字 prop 应用 px 单位', () => {
    mount(ZIcon, { props: { component: DummyIcon, size: 24 } })
    expect(getInjectedCss()).toMatch(/24px/)
  })

  it('size 字符串 prop 原样', () => {
    mount(ZIcon, { props: { component: DummyIcon, size: '2rem' } })
    expect(getInjectedCss()).toMatch(/2rem/)
  })

  it('color 字面量 prop 应用', () => {
    mount(ZIcon, { props: { component: DummyIcon, color: '#ff00aa' } })
    expect(getInjectedCss().toLowerCase()).toMatch(/#ff00aa/)
  })

  it('color 走 _primary token 引用', () => {
    mount(ZIcon, { props: { component: DummyIcon, color: '_primary' } })
    const css = getInjectedCss()
    const primary = String((defaultLight.resolve() as { color: Record<string, string> }).color.primary)
    expect(css.toLowerCase()).toContain(primary.toLowerCase())
  })

  it('intent="danger" 应用语义色', () => {
    mount(ZIcon, { props: { component: DummyIcon, intent: 'danger' } })
    const css = getInjectedCss()
    const danger = String((defaultLight.resolve() as { color: Record<string, string> }).color.danger)
    expect(css.toLowerCase()).toContain(danger.toLowerCase())
  })

  it('depth="2" 应用 opacity 0.8', () => {
    mount(ZIcon, { props: { component: DummyIcon, depth: '2' } })
    expect(getInjectedCss()).toMatch(/opacity:0\.8/)
  })

  it('depth="5" 应用 opacity 0.2', () => {
    mount(ZIcon, { props: { component: DummyIcon, depth: '5' } })
    expect(getInjectedCss()).toMatch(/opacity:0\.2/)
  })

  it('depth="none" 不应用 opacity（断 className 与 depth="2" 不同 → 不同 CSS rule）', () => {
    const wNone = mount(ZIcon, { props: { component: DummyIcon, depth: 'none' } })
    const wTwo = mount(ZIcon, { props: { component: DummyIcon, depth: '2' } })
    // emotion 同 CSS 同 hash —— 不同 hash 就说明 none 没生成 opacity rule
    expect(wNone.classes().join(' ')).not.toBe(wTwo.classes().join(' '))
  })

  it('spin=true 应用 spin keyframe 与 1s duration', () => {
    mount(ZIcon, { props: { component: DummyIcon, spin: true } })
    const css = getInjectedCss()
    expect(css).toMatch(/animation-name/)
    expect(css).toMatch(/1s/)
    expect(css).toMatch(/infinite/)
  })

  it('spin=2 数字 → 2s duration', () => {
    mount(ZIcon, { props: { component: DummyIcon, spin: 2 } })
    expect(getInjectedCss()).toMatch(/2s/)
  })

  it('spin="800ms" 字符串原样', () => {
    mount(ZIcon, { props: { component: DummyIcon, spin: '800ms' } })
    expect(getInjectedCss()).toMatch(/800ms/)
  })
})

describe('ZIcon — a11y', () => {
  it('未传 label → aria-hidden="true"', () => {
    const w = mount(ZIcon, { props: { component: DummyIcon } })
    expect(w.attributes('aria-hidden')).toBe('true')
    expect(w.attributes('aria-label')).toBeUndefined()
  })

  it('传 label → aria-label + role="img"，去掉 aria-hidden', () => {
    const w = mount(ZIcon, { props: { component: DummyIcon, label: '删除' } })
    expect(w.attributes('aria-label')).toBe('删除')
    expect(w.attributes('role')).toBe('img')
    expect(w.attributes('aria-hidden')).toBeUndefined()
  })
})

describe('ZIcon — ZConfigProvider componentTokens 覆盖', () => {
  it('Provider 改 icon.dangerColor → intent="danger" 取新色', () => {
    const Wrap = defineComponent({
      components: { ZConfigProvider, ZIcon },
      data: () => ({
        overrides: { icon: { dangerColor: '#abcdef' } },
      }),
      template: `
        <ZConfigProvider :component-tokens="overrides">
          <ZIcon :component="DummyIcon" intent="danger" />
        </ZConfigProvider>
      `,
      setup() {
        return { DummyIcon }
      },
    })
    mount(Wrap)
    expect(getInjectedCss().toLowerCase()).toContain('#abcdef')
  })

  it('Provider 改 icon.defaultSize → 默认尺寸跟随', () => {
    const Wrap = defineComponent({
      components: { ZConfigProvider, ZIcon },
      data: () => ({
        overrides: { icon: { defaultSize: '48px' } },
      }),
      template: `
        <ZConfigProvider :component-tokens="overrides">
          <ZIcon :component="DummyIcon" />
        </ZConfigProvider>
      `,
      setup() {
        return { DummyIcon }
      },
    })
    mount(Wrap)
    expect(getInjectedCss()).toMatch(/48px/)
  })

  it('嵌套 Provider：外层 + 内层 icon token 合并', async () => {
    const Wrap = defineComponent({
      components: { ZConfigProvider, ZIcon },
      data: () => ({
        outer: { icon: { defaultSize: '32px' } },
        inner: { icon: { dangerColor: '#112233' } },
      }),
      template: `
        <ZConfigProvider :component-tokens="outer">
          <ZConfigProvider :component-tokens="inner">
            <ZIcon :component="DummyIcon" intent="danger" />
          </ZConfigProvider>
        </ZConfigProvider>
      `,
      setup() {
        return { DummyIcon }
      },
    })
    mount(Wrap)
    await nextTick()
    const css = getInjectedCss().toLowerCase()
    expect(css).toContain('#112233')   // 内层 danger
    expect(css).toContain('32px')      // 外层 defaultSize
  })

  it('Provider 改 spinDuration → spin=true 取新时长', () => {
    const Wrap = defineComponent({
      components: { ZConfigProvider, ZIcon },
      data: () => ({
        overrides: { icon: { spinDuration: '2.5s' } },
      }),
      template: `
        <ZConfigProvider :component-tokens="overrides">
          <ZIcon :component="DummyIcon" spin />
        </ZConfigProvider>
      `,
      setup() {
        return { DummyIcon }
      },
    })
    mount(Wrap)
    expect(getInjectedCss()).toMatch(/2\.5s/)
  })
})
