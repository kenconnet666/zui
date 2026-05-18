/**
 * 类型层守护（expect-type）。
 *
 * 编译时校验，不在 vitest runtime 跑（it.skip 占位让 vitest 不抱怨空文件）；
 * tsc --noEmit 通过即等价于这些断言通过。
 */
import { describe, expectTypeOf, it } from 'vitest'
import { Chain, defaultLight } from '../src'
import type { ColorTokenValue } from '../src'

const c = new Chain(defaultLight)

describe('Chain — 类型层四态', () => {
  it('s.color._primary 返回 ColorTokenValue（带 alpha）', () => {
    expectTypeOf(c.color._primary).toMatchTypeOf<ColorTokenValue<typeof c>>()
    expectTypeOf(c.color._primary.alpha).toBeCallableWith(50)
  })

  it('s.padding._lg 返回 Chain（非颜色 token）', () => {
    expectTypeOf(c.padding._lg).toEqualTypeOf<typeof c>()
  })

  it('s.color.white 返回 Chain（CSS keyword）', () => {
    expectTypeOf(c.color.white).toEqualTypeOf<typeof c>()
  })

  it('s.padding.px 是 (n: number) => Chain', () => {
    expectTypeOf(c.padding.px).toBeFunction()
    expectTypeOf(c.padding.px).parameter(0).toBeNumber()
    expectTypeOf(c.padding.px(16)).toEqualTypeOf<typeof c>()
  })

  it('fn 调用 s.color("red") 返回 Chain', () => {
    expectTypeOf(c.color('red' as const)).toEqualTypeOf<typeof c>()
  })

  it('未增强属性是 PropFn（仅 fn + GlobalKw）', () => {
    expectTypeOf(c.appearance).toBeFunction()
    expectTypeOf(c.alignSelf).toBeFunction()
  })
})

describe('Chain — 内建方法签名', () => {
  it('_hover((s) => void) 返回 Chain', () => {
    expectTypeOf(c._hover).toBeCallableWith(() => {})
    expectTypeOf(c._hover(() => {})).toEqualTypeOf<typeof c>()
  })

  it('_media(query, fn) 接 string + factory', () => {
    expectTypeOf(c._media).toBeFunction()
    expectTypeOf(c._media('_md', () => {})).toEqualTypeOf<typeof c>()
  })

  it('_nthChild 第一个参数是 number | string', () => {
    expectTypeOf(c._nthChild).parameter(0).toEqualTypeOf<number | string>()
  })

  it('_dir 第一个参数限定 rtl/ltr', () => {
    expectTypeOf(c._dir).parameter(0).toEqualTypeOf<'rtl' | 'ltr'>()
  })

  it('_var name 限定 `--${string}`', () => {
    expectTypeOf(c._var).parameter(0).toEqualTypeOf<`--${string}`>()
  })

  it('toString() 返回 string', () => {
    expectTypeOf(c.toString()).toBeString()
  })
})

describe('Chain — token 不存在时类型层飘红', () => {
  it('未声明的 token 在 carrier 上不出现（编译期 @ts-expect-error 守护）', () => {
    // @ts-expect-error — _notExist 不在 DefaultSchema['color'] 上
    c.color._notExist
    // @ts-expect-error — _xxl 不在 DefaultSchema['spacing'] 上
    c.padding._xxl
  })
})
