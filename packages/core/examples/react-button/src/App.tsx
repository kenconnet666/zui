import { useMemo, useState } from 'react'
import { Chain, defaultLight, defaultDark, toClassName } from '@kenconnet666/zui-core'

export function App() {
  const [dark, setDark] = useState(false)
  const theme = dark ? defaultDark : defaultLight

  const primaryCls = useMemo(() => {
    const c = new Chain(theme)
    c.color.white
    c.backgroundColor._primary
    c.padding.px(12)
    c.borderRadius._md
    c.fontWeight._bold
    c.borderStyle.none
    c.transitionDuration.ms(150)
    c.transitionProperty('background-color')
    c._hover(h => { h.backgroundColor._primary.alpha(85) })
    c._focusVisible(f => {
      f.outlineColor._primary
      f.outlineStyle.solid
      f.outlineWidth.px(2)
      f.outlineOffset.px(2)
    })
    return toClassName(c)
  }, [theme])

  const ghostCls = useMemo(() => {
    const c = new Chain(theme)
    c.color._primary
    c.backgroundColor._primary.alpha(10)
    c.padding.px(12)
    c.borderRadius._md
    c.fontWeight._bold
    c.borderWidth.px(1)
    c.borderStyle.solid
    c.borderColor._primary.alpha(30)
    c._hover(h => { h.backgroundColor._primary.alpha(20) })
    return toClassName(c)
  }, [theme])

  const dangerCls = useMemo(() => {
    const c = new Chain(theme)
    c.color.white
    c.backgroundColor._danger
    c.padding.px(12)
    c.borderRadius._md
    c.fontWeight._bold
    c.borderStyle.none
    c._hover(h => { h.backgroundColor._danger.alpha(85) })
    return toClassName(c)
  }, [theme])

  return (
    <>
      <h1>zui-core · React 19 button demo</h1>
      <p>主题切换演示：useMemo 包 chain → className 自动响应主题切换。</p>
      <button onClick={() => setDark(d => !d)}>
        Toggle {dark ? 'light' : 'dark'} mode
      </button>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className={primaryCls}>Primary</button>
        <button className={ghostCls}>Ghost</button>
        <button className={dangerCls}>Danger</button>
      </div>
    </>
  )
}
