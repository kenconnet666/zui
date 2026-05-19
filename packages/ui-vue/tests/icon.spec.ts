/**
 * `ZIcon` —— v2.1 全离散行为测试。
 *
 * 覆盖：
 * 1. 双模式渲染（slot / component prop）
 * 2. size 5 阶 → em 单位
 * 3. color 6 种 → 各应用对应语义色
 * 4. depth 5 阶 + none → opacity
 * 5. spin none + boolean + 5 阶
 * 6. css factory：基础 + 伪类 + 覆盖 variants
 * 7. a11y label
 * 8. ZConfigProvider componentTokens 嵌套覆盖
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { defaultLight, type Chain, type DefaultSchema } from '@kenconnet666/zui-core'
import { ZConfigProvider, ZIcon } from '../src'

const DummyIcon = defineComponent({
  name: 'DummyIcon',
  setup() {
    return () => h('svg', { 'data-testid': 'dummy', viewBox: '0 0 24 24' })
  },
})

/** 收集注入 CSS，剥掉 keyframes 块避免误命中。 */
function getInjectedCss(): string {
  const raw = Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
  return raw.replace(/@(?:-webkit-)?keyframes\s+\S+\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '')
}

describe('ZIcon — 渲染', () => {
  it('slot 模式：渲染 default slot 内容', () => {
    const w = mount(ZIcon, { slots: { default: () => h(DummyIcon) } })
    expect(w.find('[data-testid="dummy"]').exists()).toBe(true)
  })

  it('component prop 模式：渲染传入组件', () => {
    const w = mount(ZIcon, { props: { component: DummyIcon } })
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

describe('ZIcon — size 5 阶', () => {
  it('default size middle → 1em', () => {
    mount(ZIcon, { props: { component: DummyIcon } })
    expect(getInjectedCss()).toMatch(/font-size:1em/)
  })

  it('size="tiny" → 0.75em', () => {
    mount(ZIcon, { props: { component: DummyIcon, size: 'tiny' } })
    expect(getInjectedCss()).toMatch(/font-size:0\.75em/)
  })

  it('size="huge" → 1.5em', () => {
    mount(ZIcon, { props: { component: DummyIcon, size: 'huge' } })
    expect(getInjectedCss()).toMatch(/font-size:1\.5em/)
  })
})

describe('ZIcon — color 6 种', () => {
  it('default → currentColor', () => {
    mount(ZIcon, { props: { component: DummyIcon } })
    expect(getInjectedCss().toLowerCase()).toMatch(/color:currentcolor/)
  })

  it('color="primary" 应用主题 primary', () => {
    mount(ZIcon, { props: { component: DummyIcon, color: 'primary' } })
    const primary = String((defaultLight.resolve() as { color: Record<string, string> }).color.primary)
    expect(getInjectedCss().toLowerCase()).toContain(primary.toLowerCase())
  })

  it('color="danger" 应用主题 danger', () => {
    mount(ZIcon, { props: { component: DummyIcon, color: 'danger' } })
    const danger = String((defaultLight.resolve() as { color: Record<string, string> }).color.danger)
    expect(getInjectedCss().toLowerCase()).toContain(danger.toLowerCase())
  })
})

describe('ZIcon — depth 5 阶 + none', () => {
  it('depth="2" → opacity 0.8', () => {
    mount(ZIcon, { props: { component: DummyIcon, depth: '2' } })
    expect(getInjectedCss()).toMatch(/opacity:0\.8/)
  })

  it('depth="5" → opacity 0.2', () => {
    mount(ZIcon, { props: { component: DummyIcon, depth: '5' } })
    expect(getInjectedCss()).toMatch(/opacity:0\.2/)
  })

  it('depth="none" → className 与 depth="2" 不同（无 opacity rule）', () => {
    const wNone = mount(ZIcon, { props: { component: DummyIcon, depth: 'none' } })
    const wTwo = mount(ZIcon, { props: { component: DummyIcon, depth: '2' } })
    expect(wNone.classes().join(' ')).not.toBe(wTwo.classes().join(' '))
  })
})

describe('ZIcon — spin 5 阶 + none', () => {
  it('未传 spin → 无动画 className 与 spin=true 不同', () => {
    const wOff = mount(ZIcon, { props: { component: DummyIcon } })
    const wOn = mount(ZIcon, { props: { component: DummyIcon, spin: true } })
    expect(wOff.classes().join(' ')).not.toBe(wOn.classes().join(' '))
  })

  it('spin=true → middle 速度 1s', () => {
    mount(ZIcon, { props: { component: DummyIcon, spin: true } })
    const css = getInjectedCss()
    expect(css).toMatch(/animation-name/)
    expect(css).toMatch(/animation-duration:1s/)
    expect(css).toMatch(/infinite/)
  })

  it('spin="tiny" → 0.3s', () => {
    mount(ZIcon, { props: { component: DummyIcon, spin: 'tiny' } })
    expect(getInjectedCss()).toMatch(/animation-duration:0\.3s/)
  })

  it('spin="huge" → 3s', () => {
    mount(ZIcon, { props: { component: DummyIcon, spin: 'huge' } })
    expect(getInjectedCss()).toMatch(/animation-duration:3s/)
  })

  it('spin="small" → 0.5s（快）', () => {
    mount(ZIcon, { props: { component: DummyIcon, spin: 'small' } })
    expect(getInjectedCss()).toMatch(/animation-duration:0\.5s/)
  })
})

describe('ZIcon — css factory（用 core chain 二次覆盖）', () => {
  it('在根元素写任意 CSS 属性', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        css: (s: Chain<DefaultSchema>) => {
          s.cursor('pointer')
        },
      },
    })
    expect(getInjectedCss()).toMatch(/cursor:pointer/)
  })

  it('支持 _hover 伪类', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        css: (s: Chain<DefaultSchema>) => {
          s._hover((h) => {
            h.color('#ff00aa')
          })
        },
      },
    })
    expect(getInjectedCss().toLowerCase()).toContain(':hover')
    expect(getInjectedCss().toLowerCase()).toContain('#ff00aa')
  })

  it('覆盖 variants 的 color（cx 后置优先）', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        color: 'primary',
        css: (s: Chain<DefaultSchema>) => {
          s.color('#abcdef')
        },
      },
    })
    expect(getInjectedCss().toLowerCase()).toContain('#abcdef')
  })

  it('结合 token 命中：访问 theme 颜色 _primary', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        css: (s: Chain<DefaultSchema>) => {
          s.color._primary
        },
      },
    })
    const primary = String((defaultLight.resolve() as { color: Record<string, string> }).color.primary)
    expect(getInjectedCss().toLowerCase()).toContain(primary.toLowerCase())
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
  it('改 icon.primaryColor → color="primary" 取新色', () => {
    const Wrap = defineComponent({
      components: { ZConfigProvider, ZIcon },
      data: () => ({
        overrides: { icon: { primaryColor: '#abcdef' } },
      }),
      template: `
        <ZConfigProvider :component-tokens="overrides">
          <ZIcon :component="DummyIcon" color="primary" />
        </ZConfigProvider>
      `,
      setup() {
        return { DummyIcon }
      },
    })
    mount(Wrap)
    expect(getInjectedCss().toLowerCase()).toContain('#abcdef')
  })

  it('改 icon.sizeLarge → size="large" 跟随', () => {
    const Wrap = defineComponent({
      components: { ZConfigProvider, ZIcon },
      data: () => ({
        overrides: { icon: { sizeLarge: '64px' } },
      }),
      template: `
        <ZConfigProvider :component-tokens="overrides">
          <ZIcon :component="DummyIcon" size="large" />
        </ZConfigProvider>
      `,
      setup() {
        return { DummyIcon }
      },
    })
    mount(Wrap)
    expect(getInjectedCss()).toMatch(/64px/)
  })

  it('嵌套 Provider：外 sizeLarge + 内 primaryColor', async () => {
    const Wrap = defineComponent({
      components: { ZConfigProvider, ZIcon },
      data: () => ({
        outer: { icon: { sizeLarge: '40px' } },
        inner: { icon: { primaryColor: '#112233' } },
      }),
      template: `
        <ZConfigProvider :component-tokens="outer">
          <ZConfigProvider :component-tokens="inner">
            <ZIcon :component="DummyIcon" size="large" color="primary" />
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
    expect(css).toContain('#112233')
    expect(css).toContain('40px')
  })

  it('改 spinMiddleDuration → spin=true 取新时长', () => {
    const Wrap = defineComponent({
      components: { ZConfigProvider, ZIcon },
      data: () => ({
        overrides: { icon: { spinMiddleDuration: '2.5s' } },
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
