/**
 * Carrier 访问 / 缓存 / token 解析专项 bench。
 *
 * 用途：N7 拆细 — 当总体 icss bench 退化时，看是哪一层（carrier 缓存 / token 解析 / Proxy 拦截）
 * 出问题。
 *
 * 运行：`pnpm --filter @kenconnet666/zui-core bench`
 */
import { bench, describe } from 'vitest'
import { Chain, defaultLight, Theme } from '../src'

describe('Carrier 访问开销', () => {
  bench('chain.color 首访（建 carrier）', () => {
    const c = new Chain(defaultLight)
    void c.color
  })

  bench('chain.color 重访（缓存命中）', () => {
    const c = new Chain(defaultLight)
    void c.color
    void c.color
    void c.color
    void c.color
  })

  bench('100 次同名 carrier 访问（_carriers Map 命中）', () => {
    const c = new Chain(defaultLight)
    for (let i = 0; i < 100; i++) void c.color
  })

  bench('100 次不同 carrier 访问（建 100 个 callable Proxy）', () => {
    const c = new Chain(defaultLight)
    const props = ['color', 'backgroundColor', 'padding', 'margin', 'borderRadius',
      'fontWeight', 'fontSize', 'lineHeight', 'borderColor', 'borderWidth']
    for (let i = 0; i < 10; i++) {
      for (const p of props) void (c as unknown as Record<string, unknown>)[p]
    }
  })
})

describe('Token 解析（keymap 查找）', () => {
  bench('chain.color._primary（token 命中）', () => {
    const c = new Chain(defaultLight)
    c.color._primary
  })

  bench('chain.color.white（CSS keyword 命中）', () => {
    const c = new Chain(defaultLight)
    c.color.white
  })

  bench('chain.color("red")（函数态，无 keymap 查询）', () => {
    const c = new Chain(defaultLight)
    c.color('red')
  })

  bench('chain.padding.px(16)（unit 方法）', () => {
    const c = new Chain(defaultLight)
    c.padding.px(16)
  })
})

describe('Theme.getKeymap() 缓存（W4.1）', () => {
  bench('Theme 实例 + Chain 构造（getKeymap 缓存命中）', () => {
    const t = defaultLight   // 单例，keymap 已缓存
    new Chain(t)
  })

  bench('裸 ResolvedTheme + Chain 构造（buildKeymap 每次重建）', () => {
    const resolved = defaultLight.resolve()
    new Chain(resolved)
  })

  bench('Theme.getKeymap() 直接调用（缓存命中）', () => {
    defaultLight.getKeymap()
  })

  bench('新 Theme 构造 + getKeymap()（首次构建）', () => {
    const t = new Theme({
      color: { primary: '#2563eb', danger: '#dc2626' },
      spacing: { md: '16px' },
    })
    t.getKeymap()
  })
})
