/**
 * 性能基线：建链 + 出 className 耗时；对比原生 emotion css()。
 *
 * 运行：`pnpm --filter @kenconnet666/zui-core exec vitest bench`
 * 结果记录在 bench/baseline.md。
 */
import { css } from '@emotion/css'
import { bench, describe } from 'vitest'
import { Chain, defaultLight, icss } from '../src'

describe('单条 className 产出', () => {
  bench('emotion css() 原生（baseline）', () => {
    css({
      color: '#2563eb',
      padding: '16px',
      borderRadius: '8px',
      fontWeight: 700,
    })
  })

  bench('new Chain + toString（链式 + carrier 缓存）', () => {
    const c = new Chain(defaultLight)
    c.color._primary
    c.padding._middle
    c.borderRadius._middle
    c.fontWeight._huge
    c.toString()
  })

  bench('icss(theme, fn)（一行 shortcut）', () => {
    icss(defaultLight, (s) => {
      s.color._primary
      s.padding._middle
      s.borderRadius._middle
      s.fontWeight._huge
    })
  })
})

describe('嵌套伪类 + 多属性（典型按钮）', () => {
  bench('emotion css() 嵌套 baseline', () => {
    css({
      color: 'white',
      backgroundColor: '#2563eb',
      padding: '12px',
      borderRadius: '8px',
      fontWeight: 700,
      '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.85)' },
      '&:focus-visible': { outline: '2px solid #2563eb' },
    })
  })

  bench('icss 嵌套', () => {
    icss(defaultLight, (s) => {
      s.color.white
      s.backgroundColor._primary
      s.padding.px(12)
      s.borderRadius._middle
      s.fontWeight._huge
      s._hover((h) => {
        h.backgroundColor._primary.alpha(85)
      })
      s._focusVisible((f) => {
        f.outlineColor._primary
        f.outlineStyle('solid')
        f.outlineWidth.px(2)
      })
    })
  })
})

describe('Chain 实例化开销', () => {
  bench('new Chain(theme) 仅构造', () => {
    new Chain(defaultLight)
  })

  bench('Chain.color._primary 单 carrier 访问', () => {
    const c = new Chain(defaultLight)
    c.color._primary
  })
})
