import { describe, expect, it } from 'vitest'
import { Theme, defineParts, extendParts, isResponsiveValue } from '../src'
import { defaultLight } from './_fixture-theme'

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

  // ─── extendParts ─────────────────────────────────────────────
  describe('extendParts()', () => {
    const theme = defaultLight

    it('补一个新 base 不影响 parent', () => {
      const dialog = defineParts(theme, {
        slots: ['root', 'content'] as const,
        base: {
          root: s => {
            s.position.fixed
          },
          content: s => {
            s.padding.px(16)
          },
        },
      })

      const compact = extendParts(theme, dialog, {
        base: {
          content: s => {
            s.padding.px(8)
          },
        },
      })

      const parentContent = dialog.content()
      const childContent = compact.content()
      // child 的 className 包含 parent + child 两个 hash
      expect(childContent.split(' ').length).toBe(2)
      // parent 仍可独立调用，未被污染
      expect(dialog.content()).toBe(parentContent)
    })

    it('扩展新 variant 维度（parent 没有的）', () => {
      const tabs = defineParts(theme, {
        slots: ['list', 'tab'] as const,
        base: {
          list: s => {
            s.display.flex
          },
        },
      })

      const themedTabs = extendParts(theme, tabs, {
        variants: {
          intent: {
            primary: {
              tab: s => {
                s.color._primary
              },
            },
            danger: {
              tab: s => {
                s.color._danger
              },
            },
          },
        } as const,
      })

      const a = themedTabs.tab({ intent: 'primary' })
      const b = themedTabs.tab({ intent: 'danger' })
      expect(a).not.toBe(b)
      // a / b 都至少含 parent 的 className（空 base）+ child variant className
      expect(a.length).toBeGreaterThan(0)
    })

    it('parent / child 同 slot 同 variant — child 后跑覆盖', () => {
      const select = defineParts(theme, {
        slots: ['trigger'] as const,
        base: {
          trigger: s => {
            s.padding.px(12)
          },
        },
        variants: {
          size: {
            small: {
              trigger: s => {
                s.fontSize.px(12)
              },
            },
            middle: {
              trigger: s => {
                s.fontSize.px(14)
              },
            },
          },
        } as const,
        defaultVariants: { size: 'middle' },
      })

      const customized = extendParts(theme, select, {
        variants: {
          size: {
            middle: {
              trigger: s => {
                s.fontSize.px(20)
              },
            },
          },
        } as const,
      })

      // 拿到 className 不空（不验证 CSS 内容，emotion 已 hash）
      const cls = customized.trigger({ size: 'middle' })
      expect(cls.length).toBeGreaterThan(0)
    })
  })
})
