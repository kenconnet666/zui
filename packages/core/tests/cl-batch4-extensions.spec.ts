import { describe, expect, it } from 'vitest'
import { Theme, isResponsiveValue } from '../src'

describe('CL Batch 4 — core 扩展（ui-vue 启动前补齐）', () => {
  // ─── Theme.fork ──────────────────────────────────────────────
  describe('Theme.fork()', () => {
    it('fork 返回新实例，父主题不变', () => {
      const light = new Theme({
        color: { primary: '#fff', bg: '#000' },
      })
      const dark = light.fork({ color: { primary: '#000', bg: '#fff' } })
      expect(dark).not.toBe(light)
      expect(light.color!.primary).toBe('#fff')
      expect(dark.color!.primary).toBe('#000')
      expect(dark.color!.bg).toBe('#fff')
    })

    it('fork 与 merge 行为一致', () => {
      const t = new Theme({ color: { primary: '#000' } })
      const a = t.fork({ color: { primary: '#fff' } })
      const b = t.merge({ color: { primary: '#fff' } })
      expect(a.resolve()).toEqual(b.resolve())
    })
  })

  // ─── isResponsiveValue strict 模式 ───────────────────────────
  describe('isResponsiveValue(value, breakpoints?)', () => {
    it('严格模式：所有 key 在 breakpoints 内则 true', () => {
      expect(
        isResponsiveValue({ base: 1, middle: 2, large: 3 }, ['small', 'middle', 'large', 'huge']),
      ).toBe(true)
    })

    it('严格模式：含未声明 key 返回 false', () => {
      expect(isResponsiveValue({ base: 1, weird: 2 }, ['small', 'middle', 'large'])).toBe(false)
    })

    it('启发模式（不传 breakpoints）— 向后兼容', () => {
      expect(isResponsiveValue({ base: 1, middle: 2 })).toBe(true)
    })

    it('启发模式拒绝下划线开头 key（不被误判为响应式）', () => {
      expect(isResponsiveValue({ _primary: '#fff', _secondary: '#000' })).toBe(false)
    })

    it('严格模式拒绝下划线开头 key', () => {
      expect(isResponsiveValue({ _primary: '#fff' }, ['small', 'middle', 'large'])).toBe(false)
    })

    it('null / 非对象 / 数组都返回 false', () => {
      expect(isResponsiveValue(null)).toBe(false)
      expect(isResponsiveValue(42)).toBe(false)
      expect(isResponsiveValue('string')).toBe(false)
      expect(isResponsiveValue([1, 2, 3])).toBe(false)
    })

    it('空对象返回 false', () => {
      expect(isResponsiveValue({})).toBe(false)
      expect(isResponsiveValue({}, ['small', 'middle'])).toBe(false)
    })
  })
})
