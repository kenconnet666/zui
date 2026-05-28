import { describe, expect, it } from 'vitest'
import { Chain, Theme } from '../src'
import { defaultLight } from './_fixture-theme'

// W1.8 之后 defaultLight 已含 breakpoint，不需要再 wrap SchemaWithBreakpoint
const themed = defaultLight

describe('Chain — 内建方法', () => {
  describe('伪类嵌套（_nest 行为）', () => {
    it('_hover 写入 &:hover 子节点', () => {
      const c = new Chain(defaultLight)
      c._hover(h => {
        h.color._primary
      })
      expect(c._node['&:hover']).toEqual({ color: '#2563eb' })
    })

    it('嵌套 fn 内部走子节点；fn 退出后父节点 _node 还原', () => {
      const c = new Chain(defaultLight)
      c.color._danger
      c._hover(h => {
        h.color._primary
      })
      c.padding._middle
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
        f._hover(h => {
          h.opacity(0.8)
        })
      })
      expect(c._node['&:focus']).toMatchObject({
        color: '#2563eb',
        '&:hover': { opacity: 0.8 },
      })
    })

    it('同名 selector 二次嵌套时合并而非覆盖', () => {
      const c = new Chain(defaultLight)
      c._hover(h => {
        h.color._primary
      })
      c._hover(h => {
        h.padding._large
      })
      expect(c._node['&:hover']).toEqual({ color: '#2563eb', padding: '24px' })
    })

    it('空 fn 不留下空 selector 节点', () => {
      const c = new Chain(defaultLight)
      c._hover(() => {
        /* noop */
      })
      expect(c._node['&:hover']).toBeUndefined()
    })

    it('fn 抛错后 _node 引用仍正确还原', () => {
      const c = new Chain(defaultLight)
      expect(() => {
        c._hover(() => {
          throw new Error('boom')
        })
      }).toThrow('boom')
      c.padding._middle
      expect(c._node.padding).toBe('16px')
    })
  })

  describe('伪元素 / 结构伪类 / 链接', () => {
    it('_before / _after / _placeholder', () => {
      const c = new Chain(defaultLight)
      c._before(b => {
        b.color._primary
      })
      c._after(a => {
        a.color._danger
      })
      c._placeholder(p => {
        p.color._textMuted
      })
      expect(c._node['&::before']).toEqual({ color: '#2563eb' })
      expect(c._node['&::after']).toEqual({ color: '#dc2626' })
      expect(c._node['&::placeholder']).toEqual({ color: '#4b5563' })
    })

    it('_nthChild / _nthOfType 拼参数', () => {
      const c = new Chain(defaultLight)
      c._nthChild(2, n => {
        n.color._primary
      })
      c._nthOfType('odd', n => {
        n.color._danger
      })
      expect(c._node['&:nth-child(2)']).toEqual({ color: '#2563eb' })
      expect(c._node['&:nth-of-type(odd)']).toEqual({ color: '#dc2626' })
    })

    it('_dir(rtl/ltr) 拼方向', () => {
      const c = new Chain(defaultLight)
      c._dir('rtl', r => {
        r.color._primary
      })
      expect(c._node['&:dir(rtl)']).toEqual({ color: '#2563eb' })
    })
  })

  describe('group / peer', () => {
    it('_groupHover / _peerChecked 拼选择器', () => {
      const c = new Chain(defaultLight)
      c._groupHover(g => {
        g.color._primary
      })
      c._peerChecked(p => {
        p.color._danger
      })
      expect(c._node[':where(.group):hover &']).toEqual({ color: '#2563eb' })
      expect(c._node[':where(.peer):checked ~ &']).toEqual({ color: '#dc2626' })
    })
  })

  describe('At 规则 + token 简写', () => {
    it('_media 接原生查询', () => {
      const c = new Chain(defaultLight)
      c._media('(min-width: 600px)', m => {
        m.padding._middle
      })
      expect(c._node['@media (min-width: 600px)']).toEqual({ padding: '16px' })
    })

    it('_media 接 _small token 时查 theme.breakpoint（0.6.0 small=768px）', () => {
      const c = new Chain(themed)
      c._media('_small', m => {
        m.padding._middle
      })
      expect(c._node['@media (min-width: 768px)']).toEqual({ padding: '16px' })
    })

    it('_media 找不到 token 时原值透传', () => {
      // 用临时无 breakpoint 主题验证 fallback；spacing 用 middle 对齐 0.6.0 命名
      const noBp = new Theme({ color: { primary: '#000' }, spacing: { middle: '16px' } })
      const c = new Chain(noBp)
      c._media('_middle', m => {
        m.padding._middle
      })
      expect(c._node['@media _middle']).toEqual({ padding: '16px' })
    })

    it('_supports', () => {
      const c = new Chain(defaultLight)
      c._supports('(display: grid)', s => {
        s.display.grid
      })
      expect(c._node['@supports (display: grid)']).toEqual({ display: 'grid' })
    })

    it('_container 接 token 简写', () => {
      const c = new Chain(themed)
      c._container('_middle', m => {
        m.padding._large
      })
      // 0.6.0：breakpoint.middle = 1024px（旧 lg）
      expect(c._node['@container (min-width: 1024px)']).toEqual({ padding: '24px' })
    })
  })

  describe('媒体修饰符简写', () => {
    it('_dark / _light / _motionReduce / _print', () => {
      const c = new Chain(defaultLight)
      c._dark(d => {
        d.color._textMuted
      })
      c._light(l => {
        l.color._text
      })
      c._motionReduce(m => {
        m.opacity(0)
      })
      c._print(p => {
        p.color._text
      })
      expect(c._node['@media (prefers-color-scheme: dark)']).toEqual({ color: '#4b5563' })
      expect(c._node['@media (prefers-color-scheme: light)']).toEqual({ color: '#111827' })
      expect(c._node['@media (prefers-reduced-motion: reduce)']).toEqual({ opacity: 0 })
      expect(c._node['@media print']).toEqual({ color: '#111827' })
    })

    it('_rtl / _ltr', () => {
      const c = new Chain(defaultLight)
      c._rtl(r => {
        r.color._primary
      })
      c._ltr(l => {
        l.color._danger
      })
      expect(c._node[':where([dir="rtl"]) &']).toEqual({ color: '#2563eb' })
      expect(c._node[':where([dir="ltr"]) &']).toEqual({ color: '#dc2626' })
    })
  })

  describe('条件 / 选择器组合', () => {
    it('_when 条件为真时执行', () => {
      const c = new Chain(defaultLight)
      c._when(true, s => {
        s.color._primary
      })
      c._when(false, s => {
        s.color._danger
      })
      expect(c._node.color).toBe('#2563eb')
    })

    it('_unless 条件为假时执行', () => {
      const c = new Chain(defaultLight)
      c._unless(false, s => {
        s.padding._middle
      })
      c._unless(true, s => {
        s.padding._large
      })
      expect(c._node.padding).toBe('16px')
    })

    it('_and 自动补 & 前缀', () => {
      const c = new Chain(defaultLight)
      c._and('.icon', a => {
        a.color._primary
      })
      expect(c._node['&.icon']).toEqual({ color: '#2563eb' })
    })

    it('_selector 原样使用', () => {
      const c = new Chain(defaultLight)
      c._selector('> svg', s => {
        s.color._danger
      })
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

    it('_absoluteCenter (W1.3 改为 longhand)', () => {
      const c = new Chain(defaultLight)
      c._absoluteCenter()
      expect(c._node).toMatchObject({
        position: 'absolute',
        top: '50%',
        left: '50%',
        translate: '-50% -50%',
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
      c._blur('_middle')
      expect(c._node.filter).toBe('blur(16px)')
    })

    it('_blur 不带 _ 前缀也可', () => {
      const c = new Chain(themed)
      c._blur('small')
      expect(c._node.filter).toBe('blur(8px)')
    })

    it('找不到 blur token → 原字符串透传（让用户发现）', () => {
      // 临时主题：故意不带 blur category
      const bareTheme = new Theme({ color: { primary: '#000' } })
      const c = new Chain(bareTheme)
      c._blur('_middle')
      expect(c._node.filter).toBe('_middle')
    })

    it('_backdropBlur 同 _blur 但写 backdropFilter', () => {
      const c = new Chain(themed)
      c._backdropBlur('_middle')
      expect(c._node.backdropFilter).toBe('blur(16px)')
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
      const danger = (s: typeof c) => {
        s.color._danger
        s.padding._small
      }
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
      c._hover(h => {
        h.color._primaryHover
      })
      const cls = c.toString()
      expect(typeof cls).toBe('string')
      expect(cls.length).toBeGreaterThan(0)
    })
  })

  // ─── W1.3 Transform longhand helpers ───
  describe('W1.3 — Transform longhand helpers', () => {
    it('_translate(x) 单参数 → translate: <x>px', () => {
      const c = new Chain(defaultLight)
      c._translate(10)
      expect(c._node.translate).toBe('10px')
    })

    it('_translate(x, y) 双参数', () => {
      const c = new Chain(defaultLight)
      c._translate(10, 20)
      expect(c._node.translate).toBe('10px 20px')
    })

    it('_translateY 设 0 <y>', () => {
      const c = new Chain(defaultLight)
      c._translateY(10)
      expect(c._node.translate).toBe('0 10px')
    })

    it('_translateZ 设 0 0 <z>', () => {
      const c = new Chain(defaultLight)
      c._translateZ(5)
      expect(c._node.translate).toBe('0 0 5px')
    })

    it('_rotate 加 deg 后缀', () => {
      const c = new Chain(defaultLight)
      c._rotate(45)
      expect(c._node.rotate).toBe('45deg')
    })

    it('_rotateX / _rotateY / _rotateZ 加轴前缀', () => {
      const c = new Chain(defaultLight)
      c._rotateX(30)
      expect(c._node.rotate).toBe('x 30deg')
      c._rotateY(60)
      expect(c._node.rotate).toBe('y 60deg')
      c._rotateZ(90)
      expect(c._node.rotate).toBe('z 90deg')
    })

    it('_scale(n) 单值同时缩放 xyz', () => {
      const c = new Chain(defaultLight)
      c._scale(1.5)
      expect(c._node.scale).toBe('1.5')
    })

    it('_scale(n, ny) 双值', () => {
      const c = new Chain(defaultLight)
      c._scale(2, 0.5)
      expect(c._node.scale).toBe('2 0.5')
    })

    it('_skew 拼 transform shorthand', () => {
      const c = new Chain(defaultLight)
      c._skew(10, 5)
      expect(c._node.transform).toBe('skew(10deg, 5deg)')
    })

    it('_perspective 加 px 后缀', () => {
      const c = new Chain(defaultLight)
      c._perspective(800)
      expect(c._node.perspective).toBe('800px')
    })

    it('_transformOrigin / _preserve3d', () => {
      const c = new Chain(defaultLight)
      c._transformOrigin('top left')
      c._preserve3d()
      expect(c._node.transformOrigin).toBe('top left')
      expect(c._node.transformStyle).toBe('preserve-3d')
    })

    it('_absoluteCenter 用 translate longhand', () => {
      const c = new Chain(defaultLight)
      c._absoluteCenter()
      expect(c._node).toMatchObject({
        position: 'absolute',
        top: '50%',
        left: '50%',
        translate: '-50% -50%',
      })
    })
  })

  // ─── W1.4 Filter / Backdrop helpers ───
  describe('W1.4 — Filter / Backdrop helpers', () => {
    it('_filterBlur(4) → filter: blur(4px)', () => {
      const c = new Chain(defaultLight)
      c._filterBlur(4)
      expect(c._node.filter).toBe('blur(4px)')
    })

    it('多个 filter helper 累加', () => {
      const c = new Chain(defaultLight)
      c._filterBlur(4)._filterBrightness(110)._filterContrast(120)
      expect(c._node.filter).toBe('blur(4px) brightness(110%) contrast(120%)')
    })

    it('_filterHueRotate / _filterInvert / _filterDropShadow', () => {
      const c = new Chain(defaultLight)
      c._filterHueRotate(90)
      c._filterInvert(50)
      c._filterDropShadow('0 4px 6px rgba(0,0,0,0.3)')
      expect(c._node.filter).toContain('hue-rotate(90deg)')
      expect(c._node.filter).toContain('invert(50%)')
      expect(c._node.filter).toContain('drop-shadow(0 4px 6px rgba(0,0,0,0.3))')
    })

    it('_backdropFilterBlur 设 backdropFilter', () => {
      const c = new Chain(defaultLight)
      c._backdropFilterBlur(8)._backdropFilterSaturate(180)
      expect(c._node.backdropFilter).toBe('blur(8px) saturate(180%)')
    })
  })

  // ─── W2.1 通用属性选择器 ───
  describe('W2.1 — 通用属性选择器', () => {
    it('_data 含 value', () => {
      const c = new Chain(defaultLight)
      c._data('state', 'open', s => {
        s.color._primary
      })
      expect(c._node['&[data-state="open"]']).toEqual({ color: '#2563eb' })
    })

    it('_data 不含 value', () => {
      const c = new Chain(defaultLight)
      c._data('loading', undefined, s => {
        s.opacity(0.5)
      })
      expect(c._node['&[data-loading]']).toEqual({ opacity: 0.5 })
    })

    it('_aria', () => {
      const c = new Chain(defaultLight)
      c._aria('expanded', 'true', s => {
        s.color._primary
      })
      expect(c._node['&[aria-expanded="true"]']).toEqual({ color: '#2563eb' })
    })

    it('_has / _not / _is / _where', () => {
      const c = new Chain(defaultLight)
      c._has('img', h => {
        h.padding._small
      })
      c._not('[disabled]', n => {
        n.cursor.pointer
      })
      c._is('h1, h2', i => {
        i.fontWeight._bold
      })
      c._where('.foo, .bar', w => {
        w.color._danger
      })
      expect(c._node['&:has(img)']).toEqual({ padding: '8px' })
      expect(c._node['&:not([disabled])']).toEqual({ cursor: 'pointer' })
      expect(c._node['&:is(h1, h2)']).toEqual({ fontWeight: 700 })
      expect(c._node['&:where(.foo, .bar)']).toEqual({ color: '#dc2626' })
    })
  })

  // ─── W2.2 状态属性 variant ───
  describe('W2.2 — 状态属性 variant', () => {
    it('_open / _closed', () => {
      const c = new Chain(defaultLight)
      c._open(o => {
        o.opacity(1)
      })
      c._closed(cl => {
        cl.opacity(0)
      })
      expect(c._node['&[open], &[data-state="open"]']).toEqual({ opacity: 1 })
      expect(c._node['&:not([open]), &[data-state="closed"]']).toEqual({ opacity: 0 })
    })

    it('_loading / _inert', () => {
      const c = new Chain(defaultLight)
      c._loading(l => {
        l.cursor.wait
      })
      c._inert(i => {
        i.opacity(0.4)
      })
      expect(c._node['&[data-loading="true"]']).toEqual({ cursor: 'wait' })
      expect(c._node['&[inert]']).toEqual({ opacity: 0.4 })
    })

    it('_forcedColors', () => {
      const c = new Chain(defaultLight)
      c._forcedColors(f => {
        f.color._text
      })
      expect(c._node['@media (forced-colors: active)']).toEqual({ color: '#111827' })
    })
  })

  // ─── W2.3 @starting-style ───
  describe('W2.3 — @starting-style', () => {
    it('_starting 包到 @starting-style → &', () => {
      const c = new Chain(defaultLight)
      c._starting(s => {
        s.opacity(0)
      })
      expect(c._node['@starting-style']).toEqual({ '&': { opacity: 0 } })
    })
  })

  // ─── W2.4 Container query simplified ───
  describe('W2.4 — Container query variant 简写', () => {
    it('_containerSmall 解析 theme.breakpoint.small（0.6.0 small=768px）', () => {
      const c = new Chain(defaultLight) // 现在 default 有 breakpoint
      c._containerSmall(m => {
        m.padding._middle
      })
      expect(c._node['@container (min-width: 768px)']).toEqual({ padding: '16px' })
    })
  })

  // ─── W2.5 group / peer data 变种 ───
  describe('W2.5 — group / peer data 变种', () => {
    it('_groupData / _peerData', () => {
      const c = new Chain(defaultLight)
      c._groupData('state', 'active', g => {
        g.color._primary
      })
      c._peerData('checked', undefined, p => {
        p.color._success
      })
      expect(c._node[':where(.group)[data-state="active"] &']).toEqual({ color: '#2563eb' })
      expect(c._node[':where(.peer)[data-checked] ~ &']).toEqual({ color: '#22c55e' })
    })

    it('_groupAria / _peerAria', () => {
      const c = new Chain(defaultLight)
      c._groupAria('expanded', 'true', g => {
        g.color._primary
      })
      c._peerAria('selected', undefined, p => {
        p.color._success
      })
      expect(c._node[':where(.group)[aria-expanded="true"] &']).toEqual({ color: '#2563eb' })
      expect(c._node[':where(.peer)[aria-selected] ~ &']).toEqual({ color: '#22c55e' })
    })
  })

  // ─── W7 Pattern 库 ───
  describe('W7 — Pattern 库', () => {
    it('_stack 默认 flex 横排', () => {
      const c = new Chain(defaultLight)
      c._stack({ direction: 'row', gap: '_middle', align: 'center', justify: 'spaceBetween' })
      expect(c._node).toMatchObject({
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between',
      })
    })

    it('_stack inline 模式', () => {
      const c = new Chain(defaultLight)
      c._stack({ inline: true })
      expect(c._node.display).toBe('inline-flex')
    })

    it('_grid({cols: 3}) → repeat(3, minmax(0, 1fr))', () => {
      const c = new Chain(defaultLight)
      c._grid({ cols: 3, gap: '_middle' })
      expect(c._node).toMatchObject({
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '16px',
      })
    })

    it('_grid 接 string 模板', () => {
      const c = new Chain(defaultLight)
      c._grid({ cols: 'auto 1fr auto' })
      expect(c._node.gridTemplateColumns).toBe('auto 1fr auto')
    })

    it('_aspectVideo / _aspectSquare', () => {
      const c1 = new Chain(defaultLight)
      c1._aspectVideo()
      const c2 = new Chain(defaultLight)
      c2._aspectSquare()
      expect(c1._node.aspectRatio).toBe('16 / 9')
      expect(c2._node.aspectRatio).toBe('1 / 1')
    })

    it('_focusRing 写到 &:focus-visible 子节点', () => {
      const c = new Chain(defaultLight)
      c._focusRing({ color: '_primary', width: 2, offset: 2 })
      const fv = c._node['&:focus-visible'] as Record<string, unknown>
      expect(fv.outline).toContain('2px solid')
      expect(fv.outline).toContain('#2563eb')
      expect(fv.outlineOffset).toBe('2px')
    })

    it('_visuallyHidden = _srOnly 别名', () => {
      const c = new Chain(defaultLight)
      c._visuallyHidden()
      expect(c._node).toMatchObject({ position: 'absolute', overflow: 'hidden' })
    })

    it('_fillParent', () => {
      const c = new Chain(defaultLight)
      c._fillParent()
      expect(c._node).toEqual({ position: 'absolute', inset: '0' })
    })
  })

  // ─── W3.1 _inspect ───
  describe('W3.1 — _inspect', () => {
    it('css 格式（默认）', () => {
      const c = new Chain(defaultLight)
      c.color._primary
      c._hover(h => {
        h.opacity(0.8)
      })
      const out = c._inspect()
      expect(out).toContain('color: #2563eb;')
      expect(out).toContain('&:hover {')
      expect(out).toContain('opacity: 0.8;')
    })

    it('json 格式', () => {
      const c = new Chain(defaultLight)
      c.color._danger
      const out = c._inspect({ format: 'json' })
      expect(JSON.parse(out)).toEqual({ color: '#dc2626' })
    })

    it('tree 格式', () => {
      const c = new Chain(defaultLight)
      c.color._primary
      c._hover(h => {
        h.opacity(0.8)
      })
      const out = c._inspect({ format: 'tree' })
      expect(out).toContain('color = #2563eb')
      expect(out).toContain('&:hover/')
    })
  })

  // ─── W1.5 Gradient helpers ───
  describe('W1.5 — Gradient helpers', () => {
    it('_linearGradient(angle, stops)', () => {
      const c = new Chain(defaultLight)
      c._linearGradient(45, ['#fff 0%', '#000 100%'])
      expect(c._node.backgroundImage).toBe('linear-gradient(45deg, #fff 0%, #000 100%)')
    })

    it('_linearGradient 接 string angle', () => {
      const c = new Chain(defaultLight)
      c._linearGradient('to right', ['red', 'blue'])
      expect(c._node.backgroundImage).toBe('linear-gradient(to right, red, blue)')
    })

    it('_radialGradient', () => {
      const c = new Chain(defaultLight)
      c._radialGradient('circle at center', ['#ff0', '#f00'])
      expect(c._node.backgroundImage).toBe('radial-gradient(circle at center, #ff0, #f00)')
    })

    it('_conicGradient', () => {
      const c = new Chain(defaultLight)
      c._conicGradient(90, ['red', 'blue'])
      expect(c._node.backgroundImage).toBe('conic-gradient(from 90deg, red, blue)')
    })
  })
})
