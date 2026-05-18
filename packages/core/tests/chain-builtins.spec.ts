import { describe, expect, it } from 'vitest'
import { Chain, Theme, defaultLight } from '../src'
import type { DefaultSchema } from '../src'

interface SchemaWithBreakpoint extends DefaultSchema {
  breakpoint: { md: string; lg: string }
}

const themed = new Theme<SchemaWithBreakpoint>({
  ...defaultLight.schema,
  breakpoint: { md: '768px', lg: '1024px' },
})

describe('Chain — 内建方法', () => {
  describe('伪类嵌套（_nest 行为）', () => {
    it('_hover 写入 &:hover 子节点', () => {
      const c = new Chain(defaultLight)
      c._hover(h => { h.color._primary })
      expect(c._node['&:hover']).toEqual({ color: '#2563eb' })
    })

    it('嵌套 fn 内部走子节点；fn 退出后父节点 _node 还原', () => {
      const c = new Chain(defaultLight)
      c.color._danger
      c._hover(h => {
        h.color._primary
      })
      c.padding._md
      expect(c._node).toMatchObject({
        color: '#dc2626',
        padding: '16px',
        '&:hover': { color: '#2563eb' },
      })
    })

    it('双层嵌套（_focus 内含 _hover）', () => {
      const c = new Chain(defaultLight)
      c._focus(f => {
        f.color._primary
        f._hover(h => { h.opacity(0.8) })
      })
      expect(c._node['&:focus']).toMatchObject({
        color: '#2563eb',
        '&:hover': { opacity: 0.8 },
      })
    })

    it('同名 selector 二次嵌套时合并而非覆盖', () => {
      const c = new Chain(defaultLight)
      c._hover(h => { h.color._primary })
      c._hover(h => { h.padding._lg })
      expect(c._node['&:hover']).toEqual({ color: '#2563eb', padding: '24px' })
    })

    it('空 fn 不留下空 selector 节点', () => {
      const c = new Chain(defaultLight)
      c._hover(() => { /* noop */ })
      expect(c._node['&:hover']).toBeUndefined()
    })

    it('fn 抛错后 _node 引用仍正确还原', () => {
      const c = new Chain(defaultLight)
      expect(() => {
        c._hover(() => { throw new Error('boom') })
      }).toThrow('boom')
      c.padding._md
      expect(c._node.padding).toBe('16px')
    })
  })

  describe('伪元素 / 结构伪类 / 链接', () => {
    it('_before / _after / _placeholder', () => {
      const c = new Chain(defaultLight)
      c._before(b => { b.color._primary })
      c._after(a => { a.color._danger })
      c._placeholder(p => { p.color._textMuted })
      expect(c._node['&::before']).toEqual({ color: '#2563eb' })
      expect(c._node['&::after']).toEqual({ color: '#dc2626' })
      expect(c._node['&::placeholder']).toEqual({ color: '#4b5563' })
    })

    it('_nthChild / _nthOfType 拼参数', () => {
      const c = new Chain(defaultLight)
      c._nthChild(2, n => { n.color._primary })
      c._nthOfType('odd', n => { n.color._danger })
      expect(c._node['&:nth-child(2)']).toEqual({ color: '#2563eb' })
      expect(c._node['&:nth-of-type(odd)']).toEqual({ color: '#dc2626' })
    })

    it('_dir(rtl/ltr) 拼方向', () => {
      const c = new Chain(defaultLight)
      c._dir('rtl', r => { r.color._primary })
      expect(c._node['&:dir(rtl)']).toEqual({ color: '#2563eb' })
    })
  })

  describe('group / peer', () => {
    it('_groupHover / _peerChecked 拼选择器', () => {
      const c = new Chain(defaultLight)
      c._groupHover(g => { g.color._primary })
      c._peerChecked(p => { p.color._danger })
      expect(c._node[':where(.group):hover &']).toEqual({ color: '#2563eb' })
      expect(c._node[':where(.peer):checked ~ &']).toEqual({ color: '#dc2626' })
    })
  })

  describe('At 规则 + token 简写', () => {
    it('_media 接原生查询', () => {
      const c = new Chain(defaultLight)
      c._media('(min-width: 600px)', m => { m.padding._md })
      expect(c._node['@media (min-width: 600px)']).toEqual({ padding: '16px' })
    })

    it('_media 接 _md token 时查 theme.breakpoint', () => {
      const c = new Chain(themed)
      c._media('_md', m => { m.padding._md })
      expect(c._node['@media (min-width: 768px)']).toEqual({ padding: '16px' })
    })

    it('_media 找不到 token 时原值透传', () => {
      const c = new Chain(defaultLight) // no breakpoint
      c._media('_md', m => { m.padding._md })
      expect(c._node['@media _md']).toEqual({ padding: '16px' })
    })

    it('_supports', () => {
      const c = new Chain(defaultLight)
      c._supports('(display: grid)', s => { s.display.grid })
      expect(c._node['@supports (display: grid)']).toEqual({ display: 'grid' })
    })

    it('_container 接 token 简写', () => {
      const c = new Chain(themed)
      c._container('_lg', m => { m.padding._lg })
      expect(c._node['@container (min-width: 1024px)']).toEqual({ padding: '24px' })
    })
  })

  describe('媒体修饰符简写', () => {
    it('_dark / _light / _motionReduce / _print', () => {
      const c = new Chain(defaultLight)
      c._dark(d => { d.color._textMuted })
      c._light(l => { l.color._text })
      c._motionReduce(m => { m.opacity(0) })
      c._print(p => { p.color._text })
      expect(c._node['@media (prefers-color-scheme: dark)']).toEqual({ color: '#4b5563' })
      expect(c._node['@media (prefers-color-scheme: light)']).toEqual({ color: '#111827' })
      expect(c._node['@media (prefers-reduced-motion: reduce)']).toEqual({ opacity: 0 })
      expect(c._node['@media print']).toEqual({ color: '#111827' })
    })

    it('_rtl / _ltr', () => {
      const c = new Chain(defaultLight)
      c._rtl(r => { r.color._primary })
      c._ltr(l => { l.color._danger })
      expect(c._node[':where([dir="rtl"]) &']).toEqual({ color: '#2563eb' })
      expect(c._node[':where([dir="ltr"]) &']).toEqual({ color: '#dc2626' })
    })
  })

  describe('条件 / 选择器组合', () => {
    it('_when 条件为真时执行', () => {
      const c = new Chain(defaultLight)
      c._when(true, s => { s.color._primary })
      c._when(false, s => { s.color._danger })
      expect(c._node.color).toBe('#2563eb')
    })

    it('_unless 条件为假时执行', () => {
      const c = new Chain(defaultLight)
      c._unless(false, s => { s.padding._md })
      c._unless(true, s => { s.padding._lg })
      expect(c._node.padding).toBe('16px')
    })

    it('_and 自动补 & 前缀', () => {
      const c = new Chain(defaultLight)
      c._and('.icon', a => { a.color._primary })
      expect(c._node['&.icon']).toEqual({ color: '#2563eb' })
    })

    it('_selector 原样使用', () => {
      const c = new Chain(defaultLight)
      c._selector('> svg', s => { s.color._danger })
      expect(c._node['> svg']).toEqual({ color: '#dc2626' })
    })
  })

  describe('工具组合', () => {
    it('_truncate 三件套', () => {
      const c = new Chain(defaultLight)
      c._truncate()
      expect(c._node).toEqual({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      })
    })

    it('_lineClamp', () => {
      const c = new Chain(defaultLight)
      c._lineClamp(3)
      expect(c._node).toMatchObject({
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3,
      })
    })

    it('_centered 写 flex 居中', () => {
      const c = new Chain(defaultLight)
      c._centered()
      expect(c._node).toEqual({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })
    })

    it('_absoluteCenter', () => {
      const c = new Chain(defaultLight)
      c._absoluteCenter()
      expect(c._node).toMatchObject({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      })
    })

    it('_srOnly', () => {
      const c = new Chain(defaultLight)
      c._srOnly()
      expect(c._node).toMatchObject({
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      })
    })
  })

  describe('_blur / _backdropBlur', () => {
    it('_blur 查 theme.blur token', () => {
      const c = new Chain(themed)
      c._blur('_md')
      expect(c._node.filter).toBe('blur(12px)')
    })

    it('_blur 不带 _ 前缀也可', () => {
      const c = new Chain(themed)
      c._blur('sm')
      expect(c._node.filter).toBe('blur(4px)')
    })

    it('找不到 blur token → 原字符串透传（让用户发现）', () => {
      // 临时主题：故意不带 blur category
      const bareTheme = new Theme({ color: { primary: '#000' } })
      const c = new Chain(bareTheme)
      c._blur('_md')
      expect(c._node.filter).toBe('_md')
    })

    it('_backdropBlur 同 _blur 但写 backdropFilter', () => {
      const c = new Chain(themed)
      c._backdropBlur('_md')
      expect(c._node.backdropFilter).toBe('blur(12px)')
    })
  })

  describe('逃生舱', () => {
    it('_prop 直写', () => {
      const c = new Chain(defaultLight)
      c._prop('--my-x', '42px')
      expect(c._node['--my-x']).toBe('42px')
    })

    it('_var 写 CSS 自定义属性', () => {
      const c = new Chain(defaultLight)
      c._var('--brand', '#ff0066')
      expect(c._node['--brand']).toBe('#ff0066')
    })

    it('_use 深合并外部 CSSObject', () => {
      const c = new Chain(defaultLight)
      c.color._primary
      c._use({ padding: '16px', '&:hover': { color: 'red' } })
      expect(c._node).toMatchObject({
        color: '#2563eb',
        padding: '16px',
        '&:hover': { color: 'red' },
      })
    })

    it('_apply 复用样式片段', () => {
      const c = new Chain(defaultLight)
      const danger = (s: typeof c) => { s.color._danger; s.padding._sm }
      c._apply(danger)
      expect(c._node).toEqual({ color: '#dc2626', padding: '8px' })
    })

    it('label 写入 _node.label', () => {
      const c = new Chain(defaultLight)
      c.label('my-btn')
      expect(c._node.label).toBe('my-btn')
    })
  })

  describe('toString 出 className', () => {
    it('简单链可生成 className', () => {
      const c = new Chain(defaultLight)
      c.color._primary
      c._hover(h => { h.color._primaryHover })
      const cls = c.toString()
      expect(typeof cls).toBe('string')
      expect(cls.length).toBeGreaterThan(0)
    })
  })
})
