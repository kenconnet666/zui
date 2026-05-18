import { describe, expect, it } from 'vitest'
import { Chain, defaultLight, withComponentTokens } from '../src'

// 注册组件 token namespace（仅本测试文件作用域）
declare module '../src' {
  interface ComponentTokenRegistry {
    button: {
      primary: string
      primaryHover: string
      bg: string
    }
    input: {
      borderFocus: string
    }
  }
}

describe('W1.2 — ComponentTokenRegistry', () => {
  const resolved = defaultLight.resolve()

  it('withComponentTokens 把 button.primary → buttonPrimary 进 theme.color', () => {
    const themed = withComponentTokens(resolved, {
      button: t => ({
        primary: t.color.primary as string,
        primaryHover: t.color.primaryHover as string,
        bg: t.color.bg as string,
      }),
    })
    const themedColor = (themed as Record<string, Record<string, string | number>>).color!
    expect(themedColor.buttonPrimary).toBe(resolved.color.primary)
    expect(themedColor.buttonPrimaryHover).toBe(resolved.color.primaryHover)
    expect(themedColor.buttonBg).toBe(resolved.color.bg)
  })

  it('override 覆盖 deriver 输出', () => {
    const themed = withComponentTokens(
      resolved,
      { button: t => ({ primary: t.color.primary as string, bg: t.color.bg as string }) },
      { button: { primary: '#ff0000' } },
    )
    const themedColor = (themed as Record<string, Record<string, string | number>>).color!
    expect(themedColor.buttonPrimary).toBe('#ff0000')
    expect(themedColor.buttonBg).toBe(resolved.color.bg) // deriver 沿用
  })

  it('Chain 可访问 _buttonPrimary（运行时 carrier 命中）', () => {
    const themed = withComponentTokens(resolved, {
      button: t => ({
        primary: t.color.primary as string,
        primaryHover: t.color.primaryHover as string,
        bg: t.color.bg as string,
      }),
    })
    const c = new Chain(themed)
    // 类型层有 keyof T['color']，运行时 keymap 已经包含 _buttonPrimary
    c.color._buttonPrimary
    expect(c._node.color).toBe(resolved.color.primary)
  })

  it('多组件 namespace 合并不互相覆盖', () => {
    const themed = withComponentTokens(resolved, {
      button: t => ({
        primary: t.color.primary as string,
        primaryHover: t.color.primary as string,
        bg: t.color.bg as string,
      }),
      input: t => ({ borderFocus: t.color.primary as string }),
    })
    const themedColor = (themed as Record<string, Record<string, string | number>>).color!
    expect(themedColor.buttonPrimary).toBeDefined()
    expect(themedColor.inputBorderFocus).toBeDefined()
  })

  it('空 derivers 返回原 theme 引用', () => {
    const themed = withComponentTokens(resolved, {})
    expect(themed).toBe(resolved)
  })
})
