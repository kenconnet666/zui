/**
 * `ZIcon` —— v3 chain factory props(单 carrier 全维度,2026-05-22)。
 *
 * 覆盖:
 * 1. 双模式渲染(slot / component prop)
 * 2. size factory(width carrier):默认 1iem(16px)/ em 倍率 / iem / px;height 自动镜像 width
 * 3. color factory(color carrier):默认 currentColor / schema token / modifier 链 / 字面量
 * 4. depth factory(opacity carrier):不传 / 字面量 / schema token
 * 5. spin factory(animationDuration carrier):不传 / 字面量 / token;自动加 name+iteration+timing
 * 6. css factory:基础 / 伪类 / 覆盖 / 嵌套 factory
 * 7. a11y label
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { ZIcon, zuiLight, type ZuiSchema } from '../src'

const DummyIcon = defineComponent({
  name: 'DummyIcon',
  setup() {
    return () => h('svg', { 'data-testid': 'dummy', viewBox: '0 0 24 24' })
  },
})

/** 收集注入 CSS,剥掉 keyframes 块避免误命中。 */
function getInjectedCss(): string {
  const raw = Array.from(document.querySelectorAll('style'))
    .map(el => el.textContent ?? '')
    .join('\n')
  return raw.replace(/@(?:-webkit-)?keyframes\s+\S+\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '')
}

describe('ZIcon — 渲染', () => {
  it('slot 模式:渲染 default slot 内容', () => {
    const w = mount(ZIcon, { slots: { default: () => h(DummyIcon) } })
    expect(w.find('[data-testid="dummy"]').exists()).toBe(true)
  })

  it('component prop 模式:渲染传入组件', () => {
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

describe('ZIcon — size factory(width carrier,height 自动镜像)', () => {
  it('default(未传 size)→ width:1iem / height:1iem(calc(1 * var(--zui-iem, 16px)))', () => {
    mount(ZIcon, { props: { component: DummyIcon } })
    const css = getInjectedCss()
    expect(css).toContain('var(--zui-iem')
    expect(css).toMatch(/width:calc\(1 \* var\(--zui-iem,/)
    expect(css).toMatch(/height:calc\(1 \* var\(--zui-iem,/)
  })

  it('size=1.25 → width + height 都 1.25iem(镜像)', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        size: 1.25,
      },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/width:calc\(1\.25 \* var\(--zui-iem,/)
    expect(css).toMatch(/height:calc\(1\.25 \* var\(--zui-iem,/)
  })

  it('css 兜底 → w.em(0.75) → width + height 都 0.75em(镜像)', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        css: (s: Chain<ZuiSchema>) => {
          s.width.em(0.75)
          s.height.em(0.75)
        },
      },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/width:0\.75em/)
    expect(css).toMatch(/height:0\.75em/)
  })

  it('css 兜底 → w.em(1.5) → 镜像', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        css: (s: Chain<ZuiSchema>) => {
          s.width.em(1.5)
          s.height.em(1.5)
        },
      },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/width:1\.5em/)
    expect(css).toMatch(/height:1\.5em/)
  })

  it('css 兜底 → w.em(1.125) 任意倍率镜像', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        css: (s: Chain<ZuiSchema>) => {
          s.width.em(1.125)
          s.height.em(1.125)
        },
      },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/width:1\.125em/)
    expect(css).toMatch(/height:1\.125em/)
  })

  it('size=1.5 跟随 :iem 基准(width + height 同一 calc)', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        size: 1.5,
      },
    })
    const css = getInjectedCss()
    expect(css).toContain('var(--zui-iem')
    // width / height 应该用相同的 calc 表达式
    const widthMatch = css.match(/width:calc\([^;]+\)/)
    const heightMatch = css.match(/height:calc\([^;]+\)/)
    expect(widthMatch).not.toBeNull()
    expect(heightMatch).not.toBeNull()
    expect(widthMatch![0].replace('width:', '')).toBe(heightMatch![0].replace('height:', ''))
  })

  it('css 兜底 → w.em(1.25) 跟父字号(em 而非 iem)', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        css: (s: Chain<ZuiSchema>) => {
          s.width.em(1.25)
          s.height.em(1.25)
        },
      },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/width:1\.25em/)
    expect(css).toMatch(/height:1\.25em/)
  })

  it('size=1.25 (20px @ 16px iem) → calc 镜像', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        size: 1.25,
      },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/width:calc\(1\.25 \* var\(--zui-iem,/)
    expect(css).toMatch(/height:calc\(1\.25 \* var\(--zui-iem,/)
  })

  it('css 单独覆盖 width / height(非正方形)', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        css: (s: Chain<ZuiSchema>) => {
          s.width.px(24)
          s.height.px(32)
        },
      },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/width:24px/)
    expect(css).toMatch(/height:32px/)
  })
})

describe('ZIcon — color factory(color carrier)', () => {
  it('default(未传 color)→ currentColor', () => {
    mount(ZIcon, { props: { component: DummyIcon } })
    expect(getInjectedCss().toLowerCase()).toMatch(/color:currentcolor/)
  })

  it('color factory → schema token c => c._primary', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        color: (c: Chain<ZuiSchema>['color']) => {
          c._primary
        },
      },
    })
    const primary = String((zuiLight.resolve() as { color: Record<string, string> }).color.primary)
    expect(getInjectedCss().toLowerCase()).toContain(primary.toLowerCase())
  })

  it('color factory → c => c._danger', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        color: (c: Chain<ZuiSchema>['color']) => {
          c._danger
        },
      },
    })
    const danger = String((zuiLight.resolve() as { color: Record<string, string> }).color.danger)
    expect(getInjectedCss().toLowerCase()).toContain(danger.toLowerCase())
  })

  it('color factory → token + modifier c => c._primary.alpha(50)', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        color: (c: Chain<ZuiSchema>['color']) => {
          c._primary.alpha(50)
        },
      },
    })
    const css = getInjectedCss().toLowerCase()
    expect(css).toMatch(/rgba\(/)
    expect(css).toMatch(/0\.5\)/)
  })

  it('color factory → 字面量 c => c("#ff00aa")', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        color: (c: Chain<ZuiSchema>['color']) => {
          c('#ff00aa')
        },
      },
    })
    expect(getInjectedCss().toLowerCase()).toContain('#ff00aa')
  })
})

describe('ZIcon — depth factory(opacity carrier)', () => {
  it('default(未传 depth)→ className 不含 opacity rule', () => {
    mount(ZIcon, { props: { component: DummyIcon } })
    expect(getInjectedCss()).not.toMatch(/opacity:/)
  })

  it('depth factory → 字面量 o => o(0.8)', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        depth: (o: Chain<ZuiSchema>['opacity']) => {
          o(0.8)
        },
      },
    })
    expect(getInjectedCss()).toMatch(/opacity:0\.8/)
  })

  it('depth factory → schema token o => o._half', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        depth: (o: Chain<ZuiSchema>['opacity']) => {
          o._half
        },
      },
    })
    // zuiLight.opacity.half = 0.5
    expect(getInjectedCss()).toMatch(/opacity:0\.5/)
  })

  it('depth factory → schema token o => o._strong', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        depth: (o: Chain<ZuiSchema>['opacity']) => {
          o._strong
        },
      },
    })
    // zuiLight.opacity.strong = 0.75
    expect(getInjectedCss()).toMatch(/opacity:0\.75/)
  })
})

describe('ZIcon — spin factory(animationDuration carrier;自动加 name + iteration + timing)', () => {
  it('default(未传 spin)→ className 不含 animation', () => {
    mount(ZIcon, { props: { component: DummyIcon } })
    expect(getInjectedCss()).not.toMatch(/animation-name/)
  })

  it('spin factory → d => d.s(1):自动加 name / iteration / timing,duration=1s', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        spin: (d: Chain<ZuiSchema>['animationDuration']) => {
          d.s(1)
        },
      },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/animation-name/)
    expect(css).toMatch(/animation-duration:1s/)
    expect(css).toMatch(/animation-iteration-count:infinite/)
    expect(css).toMatch(/animation-timing-function:linear/)
  })

  it('spin factory → d => d.ms(300)', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        spin: (d: Chain<ZuiSchema>['animationDuration']) => {
          d.ms(300)
        },
      },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/animation-duration:300ms/)
    expect(css).toMatch(/animation-name/)
  })

  it('spin factory → d => d._middle schema token(300ms)', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        spin: (d: Chain<ZuiSchema>['animationDuration']) => {
          d._middle
        },
      },
    })
    // zuiLight.duration.middle = '300ms'
    expect(getInjectedCss()).toMatch(/animation-duration:300ms/)
  })

  it('spin factory → d => d.s(3) 最慢', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        spin: (d: Chain<ZuiSchema>['animationDuration']) => {
          d.s(3)
        },
      },
    })
    expect(getInjectedCss()).toMatch(/animation-duration:3s/)
  })

  it('css 覆盖 spin 的 timing(自定义 easing)', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        spin: (d: Chain<ZuiSchema>['animationDuration']) => {
          d.s(2)
        },
        css: (s: Chain<ZuiSchema>) => {
          s.animationTimingFunction('ease-in-out')
        },
      },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/animation-duration:2s/)
    expect(css).toMatch(/animation-timing-function:ease-in-out/)
  })
})

describe('ZIcon — css factory(逃生口)', () => {
  it('在根元素写任意 CSS 属性', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        css: (s: Chain<ZuiSchema>) => {
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
        css: (s: Chain<ZuiSchema>) => {
          s._hover(h => {
            h.color('#ff00aa')
          })
        },
      },
    })
    expect(getInjectedCss().toLowerCase()).toContain(':hover')
    expect(getInjectedCss().toLowerCase()).toContain('#ff00aa')
  })

  it('覆盖 color factory(css 后置优先)', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        color: (c: Chain<ZuiSchema>['color']) => {
          c._primary
        },
        css: (s: Chain<ZuiSchema>) => {
          s.color('#abcdef')
        },
      },
    })
    expect(getInjectedCss().toLowerCase()).toContain('#abcdef')
  })

  it('css 内嵌套 color factory:_hover(h => h.color(c => c._danger))', () => {
    mount(ZIcon, {
      props: {
        component: DummyIcon,
        css: (s: Chain<ZuiSchema>) => {
          s._hover(h => {
            h.color(c => {
              c._danger
            })
          })
        },
      },
    })
    const danger = String((zuiLight.resolve() as { color: Record<string, string> }).color.danger)
    expect(getInjectedCss().toLowerCase()).toContain(':hover')
    expect(getInjectedCss().toLowerCase()).toContain(danger.toLowerCase())
  })
})

describe('ZIcon — a11y', () => {
  it('未传 label → aria-hidden="true"', () => {
    const w = mount(ZIcon, { props: { component: DummyIcon } })
    expect(w.attributes('aria-hidden')).toBe('true')
    expect(w.attributes('aria-label')).toBeUndefined()
  })

  it('传 label → aria-label + role="img",去掉 aria-hidden', () => {
    const w = mount(ZIcon, { props: { component: DummyIcon, label: '删除' } })
    expect(w.attributes('aria-label')).toBe('删除')
    expect(w.attributes('role')).toBe('img')
    expect(w.attributes('aria-hidden')).toBeUndefined()
  })
})
