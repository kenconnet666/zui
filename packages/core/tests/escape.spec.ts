import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { Chain, resolveStringValue } from '../src'
import { buildKeymap } from '../src/theme/keymap'
import { defaultLight } from './_fixture-theme'

// vitest 节点环境下 process 是 global,但 tsconfig 不引入 @types/node 故声明一下避免 TS2591
declare const process: { env: { NODE_ENV?: string } }

/**
 * 字符串逃生舱(`chain/escape.ts`)行为测试。
 *
 * 覆盖 4 种解析形态:
 *   1. `_tokenIdent`                        token 反查
 *   2. `_unitIdent(N)`                      unit 解析
 *   3. `_tokenIdent.mod(args).mod(args)`    token + color modifier 链
 *   4. 非 `_` 开头                          快速路径 untouched
 *
 * 同时覆盖:
 *   - `zuWith()` 纯 TS 基准工厂
 *   - chain setter 行为(`s.color('_primary')` ↔ `s.color._primary` 输出一致)
 *
 * 详细设计参见 `.claude/decisions/2026-05-22-string-escape-hatch.md`。
 */

const theme = defaultLight.resolve() as unknown as Record<string, Record<string, string | number>>
const keymap = buildKeymap(defaultLight.resolve())

// ════════════════════════════════════════════════════════════════════════
// 1. resolveStringValue —— 纯函数层
// ════════════════════════════════════════════════════════════════════════

describe('resolveStringValue — 快速路径', () => {
  it('不以 _ 开头的字符串原样返回(0 开销)', () => {
    expect(resolveStringValue('red', { tokenCat: 'color' }, theme, keymap)).toBe('red')
    expect(resolveStringValue('#abc', { tokenCat: 'color' }, theme, keymap)).toBe('#abc')
    expect(resolveStringValue('20px', { tokenCat: 'spacing' }, theme, keymap)).toBe('20px')
    expect(resolveStringValue('1px solid #ccc', undefined, theme, keymap)).toBe('1px solid #ccc')
  })

  it('含 _ 但不以 _ 开头的字面量保留(如 Open_Sans / my_var)', () => {
    expect(resolveStringValue('Open_Sans', undefined, theme, keymap)).toBe('Open_Sans')
    expect(resolveStringValue('my_custom_value', undefined, theme, keymap)).toBe('my_custom_value')
  })
})

describe('resolveStringValue — token 直读', () => {
  it('优先用 carrier tokenCat (preferredCat)', () => {
    const v = resolveStringValue('_primary', { tokenCat: 'color' }, theme, keymap)
    expect(v).toBe(theme.color!.primary)
  })

  it('preferredCat miss 时全 schema 扫描兜底', () => {
    // _primary 在 color cat 但 carrier cat 是 spacing → 应该 fallback 全扫
    const v = resolveStringValue('_primary', { tokenCat: 'spacing' }, theme, keymap)
    expect(v).toBe(theme.color!.primary)
  })

  it('无 carrierCfg 时直接全 schema 扫描', () => {
    const v = resolveStringValue('_primary', undefined, theme, keymap)
    expect(v).toBe(theme.color!.primary)
  })

  it('carrierCfg.tokenCat 为 null 时全 schema 扫描', () => {
    const v = resolveStringValue('_primary', { tokenCat: null }, theme, keymap)
    expect(v).toBe(theme.color!.primary)
  })

  it('命中 spacing token(_middle)', () => {
    const v = resolveStringValue('_middle', { tokenCat: 'spacing' }, theme, keymap)
    expect(v).toBe(theme.spacing!.middle)
  })

  it('命中 fontSize token(_small)', () => {
    const v = resolveStringValue('_small', { tokenCat: 'fontSize' }, theme, keymap)
    expect(v).toBe(theme.fontSize!.small)
  })

  it('命中 fontWeight token(数字值)', () => {
    const v = resolveStringValue('_bold', { tokenCat: 'fontWeight' }, theme, keymap)
    expect(v).toBe(theme.fontWeight!.bold)
    expect(typeof v).toBe('number')
  })

  it('未知 token 原样返回 + dev warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const v = resolveStringValue('_definitelyNotAToken', undefined, theme, keymap)
    expect(v).toBe('_definitelyNotAToken')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('resolveStringValue — unit 解析', () => {
  it('_px(N) → "Npx"', () => {
    expect(resolveStringValue('_px(20)', undefined, theme, keymap)).toBe('20px')
    expect(resolveStringValue('_px(1.5)', undefined, theme, keymap)).toBe('1.5px')
    expect(resolveStringValue('_px(-4)', undefined, theme, keymap)).toBe('-4px')
  })

  it('_em / _rem / _ch / _ex 字体相对单位', () => {
    expect(resolveStringValue('_em(1.5)', undefined, theme, keymap)).toBe('1.5em')
    expect(resolveStringValue('_rem(1)', undefined, theme, keymap)).toBe('1rem')
    expect(resolveStringValue('_ch(8)', undefined, theme, keymap)).toBe('8ch')
    expect(resolveStringValue('_ex(2)', undefined, theme, keymap)).toBe('2ex')
  })

  it('视口单位 _vw / _vh / _svw / _dvh', () => {
    expect(resolveStringValue('_vw(50)', undefined, theme, keymap)).toBe('50vw')
    expect(resolveStringValue('_vh(100)', undefined, theme, keymap)).toBe('100vh')
    expect(resolveStringValue('_svw(50)', undefined, theme, keymap)).toBe('50svw')
    expect(resolveStringValue('_dvh(100)', undefined, theme, keymap)).toBe('100dvh')
  })

  it('容器查询单位 _cqw / _cqi', () => {
    expect(resolveStringValue('_cqw(50)', undefined, theme, keymap)).toBe('50cqw')
    expect(resolveStringValue('_cqi(30)', undefined, theme, keymap)).toBe('30cqi')
  })

  it('百分比 _pct(N) → "N%"', () => {
    expect(resolveStringValue('_pct(50)', undefined, theme, keymap)).toBe('50%')
  })

  it('时间单位 _ms / _s', () => {
    expect(resolveStringValue('_ms(300)', undefined, theme, keymap)).toBe('300ms')
    expect(resolveStringValue('_s(0.5)', undefined, theme, keymap)).toBe('0.5s')
  })

  it('角度单位 _deg / _rad / _turn', () => {
    expect(resolveStringValue('_deg(45)', undefined, theme, keymap)).toBe('45deg')
    expect(resolveStringValue('_rad(1.57)', undefined, theme, keymap)).toBe('1.57rad')
    expect(resolveStringValue('_turn(0.5)', undefined, theme, keymap)).toBe('0.5turn')
  })

  it('未知 unit ident 不解析,落到 token 反查路径', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // _zoinks 不在 ALL_UNITS,且不是 schema token → 原样返回 + warn
    const v = resolveStringValue('_zoinks(20)', undefined, theme, keymap)
    expect(v).toBe('_zoinks(20)')
    spy.mockRestore()
  })
})

describe('resolveStringValue — color modifier 链', () => {
  it('_primary.alpha(50) → setAlpha 50%', () => {
    const v = resolveStringValue(
      '_primary.alpha(50)',
      { tokenCat: 'color' },
      theme,
      keymap,
    ) as string
    expect(v).toMatch(/^rgba\(/)
    expect(v).toContain('0.5')
  })

  it('_primary.alpha(0) → 完全透明', () => {
    const v = resolveStringValue(
      '_primary.alpha(0)',
      { tokenCat: 'color' },
      theme,
      keymap,
    ) as string
    expect(v).toContain(', 0)')
  })

  it('_primary.alpha(100) → 完全不透明', () => {
    const v = resolveStringValue(
      '_primary.alpha(100)',
      { tokenCat: 'color' },
      theme,
      keymap,
    ) as string
    expect(v).toContain(', 1)')
  })

  it('_primary.darken(20) → 加深', () => {
    const v = resolveStringValue('_primary.darken(20)', { tokenCat: 'color' }, theme, keymap)
    expect(v).not.toBe(theme.color!.primary)
    expect(typeof v).toBe('string')
  })

  it('_primary.lighten(20) → 提亮', () => {
    const v = resolveStringValue('_primary.lighten(20)', { tokenCat: 'color' }, theme, keymap)
    expect(v).not.toBe(theme.color!.primary)
  })

  it('_primary.saturate(20) / desaturate(20)', () => {
    expect(resolveStringValue('_primary.saturate(20)', undefined, theme, keymap)).not.toBe(
      theme.color!.primary,
    )
    expect(resolveStringValue('_primary.desaturate(20)', undefined, theme, keymap)).not.toBe(
      theme.color!.primary,
    )
  })

  it('_primary.shade(50) / tint(50)', () => {
    expect(resolveStringValue('_primary.shade(50)', undefined, theme, keymap)).not.toBe(
      theme.color!.primary,
    )
    expect(resolveStringValue('_primary.tint(50)', undefined, theme, keymap)).not.toBe(
      theme.color!.primary,
    )
  })

  it('_primary.complement() / invert() 无参数 modifier', () => {
    expect(resolveStringValue('_primary.complement()', undefined, theme, keymap)).not.toBe(
      theme.color!.primary,
    )
    expect(resolveStringValue('_primary.invert()', undefined, theme, keymap)).not.toBe(
      theme.color!.primary,
    )
  })

  it('_primary.rotateHue(90) 任意角度', () => {
    expect(resolveStringValue('_primary.rotateHue(90)', undefined, theme, keymap)).not.toBe(
      theme.color!.primary,
    )
  })

  it('_primary.mix(_danger, 30) — 嵌套 token 反查', () => {
    const v = resolveStringValue('_primary.mix(_danger, 30)', { tokenCat: 'color' }, theme, keymap)
    expect(typeof v).toBe('string')
    expect(v).not.toBe(theme.color!.primary)
    expect(v).not.toBe(theme.color!.danger)
  })

  it('_primary.mix(#ff0000, 30) — 字面量 color 参数', () => {
    const v = resolveStringValue('_primary.mix(#ff0000, 30)', undefined, theme, keymap)
    expect(typeof v).toBe('string')
    expect(v).not.toBe(theme.color!.primary)
  })

  it('链式: _primary.shade(20).alpha(80)', () => {
    const v = resolveStringValue(
      '_primary.shade(20).alpha(80)',
      { tokenCat: 'color' },
      theme,
      keymap,
    ) as string
    expect(v).toMatch(/^rgba\(/)
    expect(v).toContain('0.8')
  })

  it('链式 3+ modifier: shade.lighten.alpha', () => {
    const v = resolveStringValue(
      '_primary.shade(10).lighten(5).alpha(50)',
      undefined,
      theme,
      keymap,
    ) as string
    expect(v).toMatch(/^rgba\(/)
  })

  it('未知 modifier 停下并 warn,保留已应用的部分', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const v = resolveStringValue(
      '_primary.shade(20).unknownMod(99)',
      undefined,
      theme,
      keymap,
    ) as string
    // shade 应用了,unknownMod 跳过
    expect(v).not.toBe(theme.color!.primary)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('unknown color modifier'))
    spy.mockRestore()
  })

  it('数字 token 不接 modifier(typeof !== string)', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const v = resolveStringValue('_bold.alpha(50)', { tokenCat: 'fontWeight' }, theme, keymap)
    // fontWeight.bold 是 number, modifier 跳过, 返回原 number
    expect(v).toBe(theme.fontWeight!.bold)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('cannot apply modifiers'))
    spy.mockRestore()
  })
})

describe('resolveStringValue — 错误兜底', () => {
  it('格式错乱的 modifier(缺括号)warn + 停止', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const v = resolveStringValue('_primary.alpha 50', undefined, theme, keymap) as string
    // splitChain 切出 ['_primary', 'alpha 50'],parseCall('alpha 50') 失败
    expect(v).toBe(theme.color!.primary)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('malformed'))
    spy.mockRestore()
  })

  it('head 不是合法 ident → 原样返回', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const v = resolveStringValue('_has space', undefined, theme, keymap)
    expect(v).toBe('_has space')
    spy.mockRestore()
  })
})

// ════════════════════════════════════════════════════════════════════════
// 2. Chain setter 集成 —— 字符串与 chain shortcut 等价
// ════════════════════════════════════════════════════════════════════════

describe('Chain setter — 字符串与 shortcut 等价', () => {
  it("s.color('_primary') === s.color._primary 写入同样的值", () => {
    const a = new Chain(defaultLight)
    a.color('_primary')
    const b = new Chain(defaultLight)
    b.color._primary
    expect(a._node.color).toBe(b._node.color)
  })

  it("s.padding('_middle') 命中 spacing.middle", () => {
    const c = new Chain(defaultLight)
    c.padding('_middle')
    expect(c._node.padding).toBe(theme.spacing!.middle)
  })

  it("s.width('_px(20)') === s.width.px(20)", () => {
    const a = new Chain(defaultLight)
    a.width('_px(20)')
    const b = new Chain(defaultLight)
    b.width.px(20)
    expect(a._node.width).toBe(b._node.width)
    expect(a._node.width).toBe('20px')
  })

  it("s.color('_primary.alpha(50)') 写入 rgba", () => {
    const c = new Chain(defaultLight)
    c.color('_primary.alpha(50)')
    expect(c._node.color as string).toMatch(/^rgba\(/)
    expect(c._node.color as string).toContain('0.5')
  })

  it("s.color('red') 普通字面量保留", () => {
    const c = new Chain(defaultLight)
    c.color('red')
    expect(c._node.color).toBe('red')
  })

  it("s.color('#abc') 普通字面量保留", () => {
    const c = new Chain(defaultLight)
    c.color('#abc')
    expect(c._node.color).toBe('#abc')
  })

  it("跨 carrier:s.outlineColor('_primary') 全 schema 扫描命中", () => {
    // outlineColor 在 ENHANCED_PROPS 里也有 tokenCat=color,所以走 preferredCat
    const c = new Chain(defaultLight)
    c.outlineColor('_primary')
    expect(c._node.outlineColor).toBe(theme.color!.primary)
  })

  it('setter 调用后 _node 持续累积(多次调用写到同一 _node)', () => {
    // chain 内部 target 返回 raw chain 不影响"用 proxy c 多次调"用法
    const c = new Chain(defaultLight)
    c.color('_primary')
    c.backgroundColor('_danger')
    c.padding('_middle')
    expect(c._node.color).toBe(theme.color!.primary)
    expect(c._node.backgroundColor).toBe(theme.color!.danger)
    expect(c._node.padding).toBe(theme.spacing!.middle)
  })
})

// ════════════════════════════════════════════════════════════════════════
// 3. iemWith() —— 已移除（0.9.x iem 单位重构删除，保留 skip 块以记录历史）
// ════════════════════════════════════════════════════════════════════════

describe.skip('iemWith() — 已移除（0.9.x 移除 iem 逻辑单位，API 不再存在）', () => {
  it('placeholder', () => {
    expect(true).toBe(true)
  })
})

// ════════════════════════════════════════════════════════════════════════
// 4. dev warn 在 production env 静默
// ════════════════════════════════════════════════════════════════════════

describe('escape — production env warn 静默', () => {
  const originalNodeEnv = process.env.NODE_ENV

  beforeEach(() => {
    process.env.NODE_ENV = 'production'
  })
  afterEach(() => {
    // exactOptionalPropertyTypes: NODE_ENV 类型是 string,undefined 时 delete 而非赋 undefined
    if (originalNodeEnv === undefined) delete (process.env as Record<string, unknown>).NODE_ENV
    else process.env.NODE_ENV = originalNodeEnv
  })

  it('未知 token 在 production 不 warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    resolveStringValue('_definitelyNotAToken', undefined, theme, keymap)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
