import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { EXTRA_KEYWORDS } from '../src/chain/config/extra-keywords.config'

/**
 * W6.1 / W6.2 / W6.3 守护测试。
 *
 * - extra-keywords 扩展槽存在 + 默认空
 * - 所有 extra-keyword 必须 `_` 前缀（W6.3）
 * - properties.generated.ts 已含第 5/6 元 TExtraKeywords slot
 */
describe('W6 — generator + PropCarrier extension slot', () => {
  it('EXTRA_KEYWORDS 默认空对象', () => {
    expect(typeof EXTRA_KEYWORDS).toBe('object')
    expect(Object.keys(EXTRA_KEYWORDS).length).toBe(0)
  })

  it('W6.3 — 所有 extra-keyword 必须 _ 前缀', () => {
    for (const prop in EXTRA_KEYWORDS) {
      for (const kw of EXTRA_KEYWORDS[prop]!) {
        expect(kw.startsWith('_'), `${prop}.${kw} 缺 _ 前缀`).toBe(true)
      }
    }
  })

  it('properties.generated.ts 用 PropCarrier 5/6 元形态', () => {
    const generated = readFileSync(
      resolve(process.cwd(), 'src/types/properties.generated.ts'),
      'utf8',
    )
    // 抽样：padding 应该是 PropCarrier<..., LengthUnits<TSelf>, never>
    expect(generated).toMatch(/padding: PropCarrier<TSelf, [^,]+, SpacingTokens<T>, [^,]+, LengthUnits<TSelf>, never>/)
    // color 应该是 ColorPropCarrier<..., ColorTokens<T>, ..., never>
    expect(generated).toMatch(/color: ColorPropCarrier<TSelf, [^,]+, ColorTokens<T>, [^,]+, never>/)
  })
})
