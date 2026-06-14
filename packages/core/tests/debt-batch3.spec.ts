import { describe, expect, it, vi } from 'vitest'
import { Chain, registerFont } from '../src'
import { defaultLight } from './_fixture-theme'
import { KEYWORD_TO_CSS } from '../src/chain/keywords'

/**
 * Debt Batch 3 测试（L5 / L6 / M2 / M3）。
 */

// ────────────────────────────────────────────────────────────────────────────
// L6 — registerFont URL escape + dev warn
// ────────────────────────────────────────────────────────────────────────────

describe('L6 — registerFont URL 安全 escape', () => {
  it('不含特殊字符的 src 正常注册', () => {
    expect(() =>
      registerFont('Inter', [{ src: '/fonts/Inter.woff2', format: 'woff2', weight: 400 }]),
    ).not.toThrow()
  })

  it('含 url(...) 的 src 直接透传', () => {
    expect(() =>
      registerFont('Inter', [{ src: 'url(/fonts/Inter.woff2)', format: 'woff2' }]),
    ).not.toThrow()
  })

  it('含单引号的 src 不破坏 @font-face（escape 后注入）', () => {
    expect(() =>
      registerFont('My"Font', [{ src: "/fonts/font's.woff2", format: 'woff2' }]),
    ).not.toThrow()
  })

  it('dev 模式下 url(<script>) 等可疑字符触发 warn', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      registerFont('Test', [{ src: 'url(/x<script>.woff2)', format: 'woff2' }])
      expect(warnSpy).toHaveBeenCalled()
      const msg = warnSpy.mock.calls[0]?.[0] as string
      expect(msg).toContain('可疑字符')
    } finally {
      warnSpy.mockRestore()
    }
  })

  it('正常 url() src 不触发 warn', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      registerFont('Test', [{ src: 'url(/fonts/normal.woff2)' }])
      expect(warnSpy).not.toHaveBeenCalled()
    } finally {
      warnSpy.mockRestore()
    }
  })
})

// ────────────────────────────────────────────────────────────────────────────
// M3 — keywords.ts ↔ enhanced-props.ts 覆盖率守护
// ────────────────────────────────────────────────────────────────────────────

describe('M3 — KEYWORD_TO_CSS 覆盖 enhanced-props 引用的 keyword', () => {
  it('补全的 6 个 keyword 都在 KEYWORD_TO_CSS', () => {
    expect(KEYWORD_TO_CSS.top).toBe('top')
    expect(KEYWORD_TO_CSS.bottom).toBe('bottom')
    expect(KEYWORD_TO_CSS.inside).toBe('inside')
    expect(KEYWORD_TO_CSS.outside).toBe('outside')
    expect(KEYWORD_TO_CSS.light).toBe('light')
    expect(KEYWORD_TO_CSS.dark).toBe('dark')
  })

  it('captionSide.top 命中 keyword（不是字符串透传）', () => {
    const c = new Chain(defaultLight)
    c.captionSide.top
    expect(c._node.captionSide).toBe('top')
  })

  it('listStylePosition.inside / outside 命中', () => {
    const c1 = new Chain(defaultLight)
    c1.listStylePosition.inside
    expect(c1._node.listStylePosition).toBe('inside')

    const c2 = new Chain(defaultLight)
    c2.listStylePosition.outside
    expect(c2._node.listStylePosition).toBe('outside')
  })

  it('colorScheme.light / dark 命中', () => {
    const c1 = new Chain(defaultLight)
    c1.colorScheme.light
    expect(c1._node.colorScheme).toBe('light')

    const c2 = new Chain(defaultLight)
    c2.colorScheme.dark
    expect(c2._node.colorScheme).toBe('dark')
  })
})

// ────────────────────────────────────────────────────────────────────────────
// M2 — README 文档化（运行时无 assertion，靠 README）
// ────────────────────────────────────────────────────────────────────────────

describe('M2 — README 已更新警告非颜色 token 不应链式', () => {
  // 不写运行时校验（运行时仍允许链式 — escape hatch）；这里仅守护行为稳定。
  it('颜色 token 命中返回 ColorTokenValue（不返回 chain）', () => {
    const c = new Chain(defaultLight)
    const result = (c as unknown as { color: Record<string, unknown> }).color._primary as Record<
      string,
      unknown
    >
    // ColorTokenValue 接口暴露 alpha / darken / lighten / mix / saturate / desaturate
    expect(typeof result.alpha).toBe('function')
    expect(typeof result.darken).toBe('function')
    expect(typeof result.lighten).toBe('function')
    expect(typeof result.mix).toBe('function')
    expect(typeof result.saturate).toBe('function')
    expect(typeof result.desaturate).toBe('function')
  })

  it('非颜色 token 命中返回 chain-like（旧行为，README 警告不要链式）', () => {
    const c = new Chain(defaultLight)
    const result = (c as unknown as { padding: Record<string, unknown> }).padding._middle as Chain
    // 当前行为：返回 chain（Proxy / 原 instance 不必是同一引用）；README 警告不要靠这个
    expect(typeof result.toString).toBe('function')
    expect(result._node).toBeDefined()
  })
})
