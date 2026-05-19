import { describe, expect, it } from 'vitest'
import { createIcssInstance, presetAnimations } from '../src'
import { PRESET_ANIMATION_DEFS } from '../src/preset/animation-defs'

/**
 * Audit Batch 3 测试（S4：preset instance 工厂）。
 */

function mockEmotion() {
  const keyframeCalls: object[] = []
  return {
    keyframeCalls,
    css: () => 'mock-css',
    cx: (...a: unknown[]) => a.filter(Boolean).join(' '),
    injectGlobal: () => {},
    keyframes: (stops: object) => {
      keyframeCalls.push(stops)
      return `kf-${keyframeCalls.length}`
    },
  }
}

describe('S4 — createIcssInstance.presetAnimations', () => {
  it('返回对象拥有全部 15 个预设动画的 key', () => {
    const inst = createIcssInstance(mockEmotion())
    const keys = Object.keys(inst.presetAnimations)
    expect(keys.length).toBe(15)
    for (const expected of Object.keys(PRESET_ANIMATION_DEFS)) {
      expect(keys).toContain(expected)
    }
  })

  it('访问 .fadeIn 才注册到 instance（lazy）', () => {
    const m = mockEmotion()
    const inst = createIcssInstance(m)
    expect(m.keyframeCalls.length).toBe(0)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    inst.presetAnimations.fadeIn
    expect(m.keyframeCalls.length).toBe(1)
  })

  it('访问已注册的字段命中缓存，不重复 register', () => {
    const m = mockEmotion()
    const inst = createIcssInstance(m)
    const a = inst.presetAnimations.spin
    const b = inst.presetAnimations.spin
    const c = inst.presetAnimations.spin
    expect(a).toBe(b)
    expect(b).toBe(c)
    expect(m.keyframeCalls.length).toBe(1)
  })

  it('不同 instance 独立注册（SSR 隔离）', () => {
    const m1 = mockEmotion()
    const m2 = mockEmotion()
    const inst1 = createIcssInstance(m1)
    const inst2 = createIcssInstance(m2)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    inst1.presetAnimations.fadeIn
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    inst1.presetAnimations.spin
    expect(m1.keyframeCalls.length).toBe(2)
    expect(m2.keyframeCalls.length).toBe(0)

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    inst2.presetAnimations.fadeIn
    expect(m1.keyframeCalls.length).toBe(2)
    expect(m2.keyframeCalls.length).toBe(1)
  })

  it('注册的 stops 与 PRESET_ANIMATION_DEFS 一致', () => {
    const m = mockEmotion()
    const inst = createIcssInstance(m)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    inst.presetAnimations.fadeIn
    expect(m.keyframeCalls[0]).toEqual(PRESET_ANIMATION_DEFS.fadeIn)
  })

  it('未知 key 返回 undefined（不调 emotion.keyframes）', () => {
    const m = mockEmotion()
    const inst = createIcssInstance(m)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (inst.presetAnimations as any).nonExistent
    expect(val).toBeUndefined()
    expect(m.keyframeCalls.length).toBe(0)
  })

  it('支持 in 操作符判断', () => {
    const inst = createIcssInstance(mockEmotion())
    expect('fadeIn' in inst.presetAnimations).toBe(true)
    expect('shake' in inst.presetAnimations).toBe(true)
    expect('nonExistent' in inst.presetAnimations).toBe(false)
  })

  it('支持 Object.keys 枚举', () => {
    const inst = createIcssInstance(mockEmotion())
    const keys = Object.keys(inst.presetAnimations)
    expect(keys).toContain('fadeIn')
    expect(keys).toContain('shake')
    expect(keys.length).toBe(15)
  })
})

describe('全局 presetAnimations 仍正常工作（向后兼容）', () => {
  it('全部 15 个字段是非空字符串', () => {
    for (const key of Object.keys(PRESET_ANIMATION_DEFS) as Array<
      keyof typeof PRESET_ANIMATION_DEFS
    >) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const val = (presetAnimations as any)[key]
      expect(typeof val).toBe('string')
      expect(val.length).toBeGreaterThan(0)
    }
  })

  it('与 instance 版的 name 不同（注册环境不同）', () => {
    const m = mockEmotion()
    const inst = createIcssInstance(m)
    const globalName = presetAnimations.fadeIn
    const instanceName = inst.presetAnimations.fadeIn
    expect(globalName).not.toBe(instanceName)
  })
})
