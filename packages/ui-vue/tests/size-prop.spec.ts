/**
 * `_internal/size-prop` —— 类型 helper + `applySizeProp` / `makeSizeMap` 行为测试。
 *
 * 验证:
 * - applySizeProp(string, MAP, target) → 走 map[size](target)
 * - applySizeProp(factory, MAP, target) → 直接调 factory(target)
 * - applySizeProp(undefined, ...) → 跳过
 * - makeSizeMap 自动 fallback(tiny→small→middle, huge→large→middle)
 */
import { describe, expect, it } from 'vitest'
import { applySizeProp, makeSizeMap, type Size5, type SizeMap } from '../src/_internal/size-prop'

describe('size-prop — applySizeProp', () => {
  it('string 档位 → 走 map[size]', () => {
    let called: Size5 | null = null
    const map: SizeMap<unknown> = {
      tiny: () => {
        called = 'tiny'
      },
      small: () => {
        called = 'small'
      },
      middle: () => {
        called = 'middle'
      },
      large: () => {
        called = 'large'
      },
      huge: () => {
        called = 'huge'
      },
    }
    applySizeProp('large', map, {} as unknown)
    expect(called).toBe('large')
  })

  it('factory 函数 → 直接调 factory(target)', () => {
    let receivedTarget: unknown = null
    const factory = (t: unknown): void => {
      receivedTarget = t
    }
    const map: SizeMap<unknown> = {
      tiny: () => {},
      small: () => {},
      middle: () => {},
      large: () => {},
      huge: () => {},
    }
    const target = { marker: 42 }
    applySizeProp(factory, map, target)
    expect(receivedTarget).toBe(target)
  })

  it('undefined → 不调用 map 也不调用 factory', () => {
    let calledMap = 0
    let calledFactory = 0
    const map: SizeMap<unknown> = {
      tiny: () => {
        calledMap++
      },
      small: () => {
        calledMap++
      },
      middle: () => {
        calledMap++
      },
      large: () => {
        calledMap++
      },
      huge: () => {
        calledMap++
      },
    }
    applySizeProp(undefined, map, {} as unknown)
    expect(calledMap).toBe(0)
    expect(calledFactory).toBe(0)
  })
})

describe('size-prop — makeSizeMap 自动 fallback', () => {
  it('完整 5 阶传入 → 全部用原值', () => {
    const calls: Size5[] = []
    const map = makeSizeMap<unknown>({
      tiny: () => calls.push('tiny'),
      small: () => calls.push('small'),
      middle: () => calls.push('middle'),
      large: () => calls.push('large'),
      huge: () => calls.push('huge'),
    })
    ;(['tiny', 'small', 'middle', 'large', 'huge'] as const).forEach((k) => map[k]({}))
    expect(calls).toEqual(['tiny', 'small', 'middle', 'large', 'huge'])
  })

  it('只传 middle → tiny/small/large/huge 全 fallback 到 middle', () => {
    let middleCalls = 0
    const map = makeSizeMap<unknown>({
      middle: () => {
        middleCalls++
      },
    })
    ;(['tiny', 'small', 'middle', 'large', 'huge'] as const).forEach((k) => map[k]({}))
    expect(middleCalls).toBe(5)
  })

  it('3 阶(small/middle/large)→ tiny fallback 到 small, huge fallback 到 large', () => {
    const calls: string[] = []
    const map = makeSizeMap<unknown>({
      small: () => calls.push('small-impl'),
      middle: () => calls.push('middle-impl'),
      large: () => calls.push('large-impl'),
    })
    map.tiny({})
    expect(calls).toEqual(['small-impl'])
    calls.length = 0
    map.huge({})
    expect(calls).toEqual(['large-impl'])
  })

  it('空 partial → 5 阶全 noop(不抛错)', () => {
    const map = makeSizeMap<unknown>({})
    ;(['tiny', 'small', 'middle', 'large', 'huge'] as const).forEach((k) => {
      expect(() => map[k]({})).not.toThrow()
    })
  })
})

describe('size-prop — applySizeProp + makeSizeMap 组合', () => {
  it('用 makeSizeMap 构造的 map 兼容 applySizeProp', () => {
    let result = ''
    const map = makeSizeMap<unknown>({
      middle: () => {
        result = 'middle-applied'
      },
    })
    applySizeProp('tiny', map, {})
    expect(result).toBe('middle-applied') // tiny fallback 到 middle
  })
})
