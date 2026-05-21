import { describe, expect, it } from 'vitest'
import { Chain } from '../src'
import { defaultLight } from './_fixture-theme'

describe('Chain — 四态 carrier', () => {
  describe('① fn(value)', () => {
    it('s.color("red") 写入 _node', () => {
      const c = new Chain(defaultLight)
      c.color('red')
      expect(c._node.color).toBe('red')
    })

    it('s.padding(16) 写入 _node（数字透传，emotion 后端补 px）', () => {
      const c = new Chain(defaultLight)
      c.padding(16)
      expect(c._node.padding).toBe(16)
    })
  })

  describe('② token (_ 前缀)', () => {
    it('s.color._primary 写入 theme 中的真值', () => {
      const c = new Chain(defaultLight)
      c.color._primary
      expect(c._node.color).toBe('#2563eb')
    })

    it('s.padding._large 写入 spacing.lg', () => {
      const c = new Chain(defaultLight)
      c.padding._large
      expect(c._node.padding).toBe('24px')
    })

    it('未定义 token 不写入', () => {
      const c = new Chain(defaultLight)
      // @ts-expect-error — _notExist 不在 ColorTokens 上
      c.color._notExist
      expect(c._node.color).toBeUndefined()
    })
  })

  describe('③ CSS keyword', () => {
    it('s.color.white 写入字面量 white', () => {
      const c = new Chain(defaultLight)
      c.color.white
      expect(c._node.color).toBe('white')
    })

    it('s.display.flex 写入字面量 flex', () => {
      const c = new Chain(defaultLight)
      c.display.flex
      expect(c._node.display).toBe('flex')
    })

    it('global keyword 总可用：s.color.inherit', () => {
      const c = new Chain(defaultLight)
      c.color.inherit
      expect(c._node.color).toBe('inherit')
    })
  })

  describe('④ unit 方法', () => {
    it('s.padding.px(16) → "16px"', () => {
      const c = new Chain(defaultLight)
      c.padding.px(16)
      expect(c._node.padding).toBe('16px')
    })

    it('s.padding.rem(1.5) → "1.5rem"', () => {
      const c = new Chain(defaultLight)
      c.padding.rem(1.5)
      expect(c._node.padding).toBe('1.5rem')
    })

    it('s.width.pct(50) → "50%"（pct 特殊映射）', () => {
      const c = new Chain(defaultLight)
      c.width.pct(50)
      expect(c._node.width).toBe('50%')
    })

    it('s.transitionDuration.ms(200) → "200ms"', () => {
      const c = new Chain(defaultLight)
      c.transitionDuration.ms(200)
      expect(c._node.transitionDuration).toBe('200ms')
    })
  })

  describe('alpha 简写（颜色 token 专属）', () => {
    it('s.color._primary.alpha(50) 覆盖为 rgba', () => {
      const c = new Chain(defaultLight)
      c.color._primary.alpha(50)
      expect(c._node.color).toBe('rgba(37, 99, 235, 0.5)')
    })

    it('alpha(100) → 完全不透明', () => {
      const c = new Chain(defaultLight)
      c.color._primary.alpha(100)
      expect(c._node.color).toBe('rgba(37, 99, 235, 1)')
    })

    it('alpha(0) → 完全透明', () => {
      const c = new Chain(defaultLight)
      c.color._primary.alpha(0)
      expect(c._node.color).toBe('rgba(37, 99, 235, 0)')
    })

    it('alpha 越界 clamp', () => {
      const c = new Chain(defaultLight)
      c.color._primary.alpha(150)
      expect(c._node.color).toBe('rgba(37, 99, 235, 1)')
    })

    it('backgroundColor._danger.alpha(20) 也工作', () => {
      const c = new Chain(defaultLight)
      c.backgroundColor._danger.alpha(20)
      expect(c._node.backgroundColor).toBe('rgba(220, 38, 38, 0.2)')
    })

    it('多次 alpha 用 token 原值算（非累积）', () => {
      const c = new Chain(defaultLight)
      const helper = c.color._primary
      helper.alpha(50)
      helper.alpha(80)
      expect(c._node.color).toBe('rgba(37, 99, 235, 0.8)')
    })

    it('darken: 加深颜色', () => {
      const c = new Chain(defaultLight)
      c.color._primary.darken(20)
      expect(c._node.color).toMatch(/^#[0-9a-f]{6}$/)
      expect(c._node.color).not.toBe('#2563eb')
    })

    it('lighten: 提亮颜色', () => {
      const c = new Chain(defaultLight)
      c.color._primary.lighten(20)
      expect(c._node.color).toMatch(/^#[0-9a-f]{6}$/)
      expect(c._node.color).not.toBe('#2563eb')
    })

    it('mix: 与另一颜色混合', () => {
      const c = new Chain(defaultLight)
      c.color._primary.mix('#ffffff', 50)
      expect(c._node.color).toMatch(/^#[0-9a-f]{6}$/)
      // 50% mix with white 应该偏淡
      expect(c._node.color).not.toBe('#2563eb')
    })

    it('saturate / desaturate', () => {
      const c1 = new Chain(defaultLight)
      c1.color._primary.saturate(30)
      expect(c1._node.color).toMatch(/^#[0-9a-f]{6}$/)

      const c2 = new Chain(defaultLight)
      c2.color._primary.desaturate(30)
      expect(c2._node.color).toMatch(/^#[0-9a-f]{6}$/)
      expect(c2._node.color).not.toBe(c1._node.color)
    })

    it('modifier 多次调用使用 token 原值（非累积）', () => {
      const c = new Chain(defaultLight)
      const helper = c.color._primary
      const lighten10 = lightenOnce()
      function lightenOnce() {
        const c2 = new Chain(defaultLight)
        c2.color._primary.lighten(10)
        return c2._node.color
      }
      helper.lighten(10)
      helper.lighten(10) // 二次仍是从原 token 算 +10
      expect(c._node.color).toBe(lighten10)
    })
  })

  describe('carrier 缓存', () => {
    it('同一 prop 多次访问返回同一 Proxy', () => {
      const c = new Chain(defaultLight)
      expect(c.color).toBe(c.color)
      expect(c.padding).toBe(c.padding)
    })

    it('不同 prop 返回不同 Proxy', () => {
      const c = new Chain(defaultLight)
      expect(c.color as unknown).not.toBe(c.backgroundColor as unknown)
    })
  })
})
