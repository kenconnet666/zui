/**
 * `_internal/size-prop` —— 类型 helper + `applySizeProp` / `makeSizeMap` 行为测试。
 *
 * 2026-05-23 撤销 Size5 union 后:
 * - `applySizeProp(size, target)` 仅 2 参,size = factory 或 undefined
 * - SizeMap 仍存在,组件内部定义 5 阶 fallback;用户层不再传 string
 *
 * 验证:
 * - applySizeProp(factory, target) → 直接调 factory(target)
 * - applySizeProp(undefined, target) → 跳过
 * - makeSizeMap 自动 fallback(tiny→small→middle, huge→large→middle)
 * - 组件内常用 pattern:`size: undefined` default 用 `MAP.middle` 等价 factory
 */
import { describe, expect, it } from 'vitest'
import { applySizeProp, makeSizeMap, type Size5 } from '../src/_internal/size-prop'

describe('size-prop — applySizeProp(纯 factory 签名)', () => {
  it('factory 函数 → 直接调 factory(target)', () => {
    let receivedTarget: unknown = null
    const factory = (t: unknown): void => {
      receivedTarget = t
    }
    const target = { marker: 42 }
    applySizeProp(factory, target)
    expect(receivedTarget).toBe(target)
  })

  it('undefined → 不调用 factory(空操作)', () => {
    let calledFactory = 0
    const target = {}
    // 写一个仅在被调用时累加的 factory(实际不会传给 applySizeProp,只是对照组)
    const factoryRef = (_: unknown): void => {
      calledFactory++
    }
    applySizeProp(undefined, target)
    expect(calledFactory).toBe(0)
    // sanity:实际调用 factory 时确实会累加
    factoryRef(target)
    expect(calledFactory).toBe(1)
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
  it('组件 default 用 MAP.middle 作为 factory,applySizeProp 透传 target', () => {
    let result = ''
    const map = makeSizeMap<unknown>({
      middle: () => {
        result = 'middle-applied'
      },
    })
    // 模拟组件 default factory = MAP.middle
    applySizeProp(map.middle, {})
    expect(result).toBe('middle-applied')
  })

  it('tiny fallback 到 middle 也仍然可作为 factory 直接传 applySizeProp', () => {
    let result = ''
    const map = makeSizeMap<unknown>({
      middle: () => {
        result = 'middle-fallback'
      },
    })
    // tiny fallback 链 → middle
    applySizeProp(map.tiny, {})
    expect(result).toBe('middle-fallback')
  })
})
