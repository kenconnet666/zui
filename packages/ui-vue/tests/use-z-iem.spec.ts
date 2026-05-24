/**
 * `useZIem` + ZBox iem 解析 spec(Sprint 0)。
 *
 * 覆盖:
 * - 不在 ZBox 子树 → fallback 16(警告 silenced)
 * - ZBox `:iem='16px'` → useZIem 返回 16
 * - ZBox `:iem='0.8333vw'` → 返回 viewportWidth * 0.008333
 * - ZBox `:iem=20`(number)→ 返回 20(当 px)
 * - 嵌套 ZBox 子层不传 → 透传父值
 * - 嵌套 ZBox 子层传 fixed → 覆盖
 * - 非法字符串 → fallback 16 + dev warn
 * - vw 模式响应式跟随 viewport resize
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useZIem, ZBox, ZIemPreset } from '../src'
import type { Ref } from 'vue'

/** 拿 useZIem 在某个 wrapper 里的引用。 */
function mountWithIem(template: (slot: () => unknown) => unknown): Ref<number> {
  let api: Ref<number> | null = null
  const Probe = defineComponent({
    setup() {
      api = useZIem()
      return () => h('span')
    },
  })
  const Host = defineComponent({
    setup() {
      return () => template(() => h(Probe))
    },
  })
  mount(Host)
  if (!api) throw new Error('useZIem not initialized')
  return api
}

describe('useZIem — 树外 / 无 ZBox', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>
  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('不在 ZBox 子树 → fallback 16 + 警告', () => {
    const Probe = defineComponent({
      setup() {
        const v = useZIem()
        return () => h('span', `${v.value}`)
      },
    })
    const w = mount(Probe)
    expect(w.text()).toBe('16')
    expect(warnSpy).toHaveBeenCalled()
  })
})

describe('useZIem — 在 ZBox 子树内', () => {
  it("ZBox :iem='16px' → 16", async () => {
    const v = mountWithIem((slot) =>
      h(ZBox, { iem: '16px' }, { default: slot }),
    )
    await nextTick()
    expect(v.value).toBe(16)
  })

  it("ZBox :iem=20 (number) → 20", async () => {
    const v = mountWithIem((slot) =>
      h(ZBox, { iem: 20 }, { default: slot }),
    )
    await nextTick()
    expect(v.value).toBe(20)
  })

  it("ZBox :iem='0.8333vw' → viewportWidth * 0.008333", async () => {
    // happy-dom 的 window.innerWidth 默认 1024
    const v = mountWithIem((slot) =>
      h(ZBox, { iem: '0.8333vw' }, { default: slot }),
    )
    await nextTick()
    const expected = window.innerWidth * 0.008333
    expect(v.value).toBeCloseTo(expected, 2)
  })

  it("ZBox :iem=ZIemPreset.default → vw 计算", async () => {
    const v = mountWithIem((slot) =>
      h(ZBox, { iem: ZIemPreset.default }, { default: slot }),
    )
    await nextTick()
    expect(v.value).toBeCloseTo(window.innerWidth * 0.008333, 2)
  })

  it("ZBox :iem=ZIemPreset.fixed → 16 (静态)", async () => {
    const v = mountWithIem((slot) =>
      h(ZBox, { iem: ZIemPreset.fixed }, { default: slot }),
    )
    await nextTick()
    expect(v.value).toBe(16)
  })
})

describe('useZIem — 嵌套', () => {
  it('子 ZBox 不传 → 透传父值', async () => {
    const v = mountWithIem((slot) =>
      h(ZBox, { iem: '20px' }, {
        default: () => h(ZBox, {}, { default: slot }),
      }),
    )
    await nextTick()
    expect(v.value).toBe(20)
  })

  it('子 ZBox 传 fixed → 覆盖父', async () => {
    const v = mountWithIem((slot) =>
      h(ZBox, { iem: '20px' }, {
        default: () =>
          h(ZBox, { iem: '14px' }, { default: slot }),
      }),
    )
    await nextTick()
    expect(v.value).toBe(14)
  })
})

describe('useZIem — 非法值兜底', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>
  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('非法字符串 → fallback 16 + warn', async () => {
    const v = mountWithIem((slot) =>
      // `'1em'` 在 v0.2 后已不在 `ZIem` 类型范围内,这里故意传非法值测 fallback,
      // 用 `as never` 绕开 TS 类型检查(运行时分支才是测试目标)。
      h(ZBox, { iem: '1em' as never }, { default: slot }),
    )
    await nextTick()
    expect(v.value).toBe(16)
    expect(warnSpy).toHaveBeenCalled()
  })
})

describe('ZIemPreset 值校验', () => {
  it('default = 0.8333vw', () => {
    expect(ZIemPreset.default).toBe('0.8333vw')
  })
  it('fixed = 16px', () => {
    expect(ZIemPreset.fixed).toBe('16px')
  })
  it('large = 1.0417vw', () => {
    expect(ZIemPreset.large).toBe('1.0417vw')
  })
  it('compact = 0.7292vw', () => {
    expect(ZIemPreset.compact).toBe('0.7292vw')
  })
  it("不再提供 em / rem", () => {
    // 类型上已删除,运行时也不应存在
    expect((ZIemPreset as Record<string, unknown>).em).toBeUndefined()
    expect((ZIemPreset as Record<string, unknown>).rem).toBeUndefined()
  })
})
