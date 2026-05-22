import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { zuiLight } from '../src'
import { ZConfigProvider, enUS, useZDate, useZLocale, useZTheme } from '../src'

type AnyTheme = Record<string, Record<string, string | number>>

function asTheme(value: unknown): AnyTheme {
  return value as AnyTheme
}

describe('ZConfigProvider', () => {
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
      components: { ZConfigProvider, Child },
      template: '<ZConfigProvider><Child /></ZConfigProvider>',
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
      components: { ZConfigProvider, Child },
      data: () => ({ myTheme }),
      template: '<ZConfigProvider :theme="myTheme"><Child /></ZConfigProvider>',
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
      components: { ZConfigProvider, Child },
      data: () => ({ patch: { color: { primary: '#00ff00' } } }),
      template: `
        <ZConfigProvider>
          <ZConfigProvider :theme-patch="patch">
            <Child />
          </ZConfigProvider>
        </ZConfigProvider>
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
      components: { ZConfigProvider, Child },
      template: '<ZConfigProvider><Child /></ZConfigProvider>',
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
      components: { ZConfigProvider, Child },
      data: () => ({ enUS }),
      template: '<ZConfigProvider :locale="enUS"><Child /></ZConfigProvider>',
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
      components: { ZConfigProvider, Child },
      data: () => ({
        patch: { button: { loading: 'Loading...' } },
      }),
      template: '<ZConfigProvider :locale-patch="patch"><Child /></ZConfigProvider>',
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
      components: { ZConfigProvider, Outer, Inner },
      template: `
        <ZConfigProvider timezone="Asia/Shanghai">
          <Outer />
          <ZConfigProvider>
            <Inner />
          </ZConfigProvider>
        </ZConfigProvider>
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
      components: { ZConfigProvider, Child },
      template: '<ZConfigProvider timezone="Asia/Shanghai"><Child /></ZConfigProvider>',
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
      components: { ZConfigProvider, Child },
      setup: () => ({ myTheme }),
      template: '<ZConfigProvider :theme="myTheme"><Child /></ZConfigProvider>',
    })
    expect(captured).toBe('#111111')
    myTheme.value = zuiLight.fork({ color: { primary: '#222222' } })
    await wrapper.vm.$nextTick()
    expect(captured).toBe('#222222')
  })
})
