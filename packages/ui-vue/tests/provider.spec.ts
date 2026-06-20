import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { zuiLight } from '../src'
import type { Chain } from '@kenconnet666/zui-core'
import { ZBox, enUS, useZDate, useZLocale, useZTheme, type ZuiSchema } from '../src'

type AnyTheme = Record<string, Record<string, string | number>>

function asTheme(value: unknown): AnyTheme {
  return value as AnyTheme
}

describe('ZBox', () => {
  it('根 Provider 不传 theme 时回落 zuiLight', () => {
    let captured: AnyTheme | null = null
    const Child = defineComponent({
      setup() {
        const t = useZTheme()
        captured = asTheme(t.value)
        return () => h('div')
      },
    })
    mount({
      components: { ZBox, Child },
      template: '<ZBox><Child /></ZBox>',
    })
    expect(captured).not.toBeNull()
    const fallback = asTheme(zuiLight.resolve())
    expect(asTheme(captured).color.primary).toBe(fallback.color.primary)
  })

  it('顶层 :theme 替换 fallback', () => {
    const myTheme = zuiLight.fork({ color: { primary: '#ff0000' } })
    let captured: AnyTheme | null = null
    const Child = defineComponent({
      setup() {
        const t = useZTheme()
        captured = asTheme(t.value)
        return () => h('div')
      },
    })
    mount({
      components: { ZBox, Child },
      data: () => ({ myTheme }),
      template: '<ZBox :theme="myTheme"><Child /></ZBox>',
    })
    expect(asTheme(captured).color.primary).toBe('#ff0000')
  })

  it('嵌套 Provider :themePatch 合并父主题', () => {
    let captured: AnyTheme | null = null
    const Child = defineComponent({
      setup() {
        const t = useZTheme()
        captured = asTheme(t.value)
        return () => h('div')
      },
    })
    mount({
      components: { ZBox, Child },
      data: () => ({ patch: { color: { primary: '#00ff00' } } }),
      template: `
        <ZBox>
          <ZBox :theme-patch="patch">
            <Child />
          </ZBox>
        </ZBox>
      `,
    })
    expect(asTheme(captured).color.primary).toBe('#00ff00')
    // 其它字段继承 fallback（zuiLight 含 color.bg = '#ffffff'）
    expect(asTheme(captured).color.bg).toBe('#ffffff')
  })

  it('locale 默认 zhCN', () => {
    const box: { value: { name?: string } | null } = { value: null }
    const Child = defineComponent({
      setup() {
        const l = useZLocale()
        box.value = l.value
        return () => h('div')
      },
    })
    mount({
      components: { ZBox, Child },
      template: '<ZBox><Child /></ZBox>',
    })
    expect(box.value?.name).toBe('zh-CN')
  })

  it('locale 切到 enUS', () => {
    let buttonText: string | undefined
    const Child = defineComponent({
      setup() {
        const l = useZLocale('button')
        buttonText = l.value.loading
        return () => h('div')
      },
    })
    mount({
      components: { ZBox, Child },
      data: () => ({ enUS }),
      template: '<ZBox :locale="enUS"><Child /></ZBox>',
    })
    expect(buttonText).toBe('Loading')
  })

  it('localePatch 合并到父 locale', () => {
    const box: { value: { name?: string; button?: { loading?: string } } | null } = {
      value: null,
    }
    const Child = defineComponent({
      setup() {
        const l = useZLocale()
        box.value = l.value
        return () => h('div')
      },
    })
    mount({
      components: { ZBox, Child },
      data: () => ({
        patch: { button: { loading: 'Loading...' } },
      }),
      template: '<ZBox :locale-patch="patch"><Child /></ZBox>',
    })
    expect(box.value?.name).toBe('zh-CN')
    expect(box.value?.button?.loading).toBe('Loading...')
  })

  it('timezone / dateLocale 各自继承', () => {
    let outerTz: string | undefined
    let innerTz: string | undefined
    const Outer = defineComponent({
      setup() {
        const d = useZDate()
        outerTz = d.timezone.value
        return () => h('div')
      },
    })
    const Inner = defineComponent({
      setup() {
        const d = useZDate()
        innerTz = d.timezone.value
        return () => h('div')
      },
    })
    mount({
      components: { ZBox, Outer, Inner },
      template: `
        <ZBox timezone="Asia/Shanghai">
          <Outer />
          <ZBox>
            <Inner />
          </ZBox>
        </ZBox>
      `,
    })
    expect(outerTz).toBe('Asia/Shanghai')
    expect(innerTz).toBe('Asia/Shanghai')
  })

  it('useZDate.format 按时区格式化', () => {
    let formatted: string | undefined
    const Child = defineComponent({
      setup() {
        const d = useZDate()
        // 固定 UTC 时间：2026-01-15T00:00:00Z
        formatted = d.format(new Date('2026-01-15T00:00:00Z'), 'yyyy-MM-dd HH:mm')
        return () => h('div')
      },
    })
    mount({
      components: { ZBox, Child },
      template: '<ZBox timezone="Asia/Shanghai"><Child /></ZBox>',
    })
    // UTC 0:00 → Shanghai 8:00
    expect(formatted).toBe('2026-01-15 08:00')
  })

  it('主题响应式切换：父 ref 变化驱动子组件重渲染', async () => {
    const myTheme = ref(zuiLight.fork({ color: { primary: '#111111' } }))
    let captured: string | undefined
    const Child = defineComponent({
      setup() {
        const t = useZTheme()
        return () => {
          captured = asTheme(t.value).color.primary as string
          return h('div', captured)
        }
      },
    })
    const wrapper = mount({
      components: { ZBox, Child },
      setup: () => ({ myTheme }),
      template: '<ZBox :theme="myTheme"><Child /></ZBox>',
    })
    expect(captured).toBe('#111111')
    myTheme.value = zuiLight.fork({ color: { primary: '#222222' } })
    await wrapper.vm.$nextTick()
    expect(captured).toBe('#222222')
  })
})

describe('ZBox — 底层 box 能力(css + tag)', () => {
  function getInjectedCss(): string {
    return Array.from(document.querySelectorAll('style'))
      .map(el => el.textContent ?? '')
      .join('\n')
  }

  it('默认 tag=div', () => {
    const w = mount(ZBox, { slots: { default: () => 'x' } })
    expect(w.element.tagName).toBe('DIV')
  })

  it('tag prop 切换语义化元素', () => {
    const w = mount(ZBox, { props: { tag: 'section' }, slots: { default: () => 'x' } })
    expect(w.element.tagName).toBe('SECTION')
  })

  it('css 写入 emotion className,样式 emit', () => {
    const w = mount(ZBox, {
      props: {
        css: (s: Chain<ZuiSchema>) => {
          s.padding.px(24)
          s.backgroundColor('#abc123')
        },
      },
      slots: { default: () => 'x' },
    })
    const cls = w.classes().find(c => c.startsWith('css-'))
    expect(cls).toBeDefined()
    const css = getInjectedCss().toLowerCase()
    expect(css).toMatch(/padding:24px/)
    expect(css).toContain('#abc123')
  })

  it('css 不传 → 仍挂基础字体 className(根节点应用主题 _sans)', () => {
    const w = mount(ZBox, { slots: { default: () => 'x' } })
    // ZBox 根始终应用基础字体(_sans,中文优先 PingFang / 微软雅黑),故有一个 emotion class
    const cls = w.classes().find(c => c.startsWith('css-'))
    expect(cls).toBeDefined()
    const css = getInjectedCss().toLowerCase()
    expect(css).toContain('font-family')
  })
})

describe('ZBox — fonts schema token', () => {
  function getInjectedCss(): string {
    return Array.from(document.querySelectorAll('style'))
      .map(el => el.textContent ?? '')
      .join('\n')
  }

  it('s.fontFamily._mono → 走 schema fonts.mono(zuiLight 默认 ui-monospace 栈)', () => {
    mount(ZBox, {
      props: {
        css: (s: Chain<ZuiSchema>) => {
          s.fontFamily._mono
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toContain('ui-monospace')
  })

  it('themePatch 覆盖 fonts.mono → ZBox css 取到新值', () => {
    mount(ZBox, {
      props: {
        themePatch: { fonts: { mono: 'Fira Code, monospace' } },
        css: (s: Chain<ZuiSchema>) => {
          s.fontFamily._mono
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toContain('Fira Code')
  })
})

describe('ZBox — 新增 schema token(sizes / borders / transitionProperty)', () => {
  function getInjectedCss(): string {
    return Array.from(document.querySelectorAll('style'))
      .map(el => el.textContent ?? '')
      .join('\n')
  }

  it('s.width._container → schema.sizes.container(1200px)', () => {
    mount(ZBox, {
      props: {
        theme: zuiLight,
        css: (s: Chain<ZuiSchema>) => {
          s.width._container
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/width:1200px/)
  })

  it('s.maxWidth._readable → schema.sizes.readable("65ch")', () => {
    mount(ZBox, {
      props: {
        theme: zuiLight,
        css: (s: Chain<ZuiSchema>) => {
          s.maxWidth._readable
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/max-width:65ch/)
  })

  it('s.height._screenH → schema.sizes.screenH("100vh")', () => {
    mount(ZBox, {
      props: {
        theme: zuiLight,
        css: (s: Chain<ZuiSchema>) => {
          s.height._screenH
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/height:100vh/)
  })

  it('s.borderWidth._thin → schema.borders.thin("1px")', () => {
    mount(ZBox, {
      props: {
        theme: zuiLight,
        css: (s: Chain<ZuiSchema>) => {
          s.borderWidth._thin
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/border-width:1px/)
  })

  it('s.outlineWidth._middle → schema.borders.middle("2px")(borders 复用 outlineWidth)', () => {
    mount(ZBox, {
      props: {
        theme: zuiLight,
        css: (s: Chain<ZuiSchema>) => {
          s.outlineWidth._middle
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/outline-width:2px/)
  })

  it('s.transitionProperty._colors → 逗号分隔属性列表', () => {
    mount(ZBox, {
      props: {
        theme: zuiLight,
        css: (s: Chain<ZuiSchema>) => {
          s.transitionProperty._colors
        },
      },
      slots: { default: () => 'x' },
    })
    const css = getInjectedCss()
    // 多值 css 属性
    expect(css).toContain('transition-property')
    expect(css).toContain('background-color')
    expect(css).toContain('border-color')
  })

  it('themePatch 覆盖 sizes.container → ZBox css 取到新值', () => {
    mount(ZBox, {
      props: {
        theme: zuiLight,
        themePatch: { sizes: { container: '900px' } },
        css: (s: Chain<ZuiSchema>) => {
          s.width._container
        },
      },
      slots: { default: () => 'x' },
    })
    expect(getInjectedCss()).toMatch(/width:900px/)
  })
})

