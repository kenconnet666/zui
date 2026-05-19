import { Chain, defaultLight, icss } from '@kenconnet666/zui-core'

// ─── 1. 长写法：手动 new Chain ───
const long = new Chain(defaultLight)
long.color.white
long.backgroundColor._primary
long.padding.px(12)
long.borderRadius._middle
long.fontWeight._huge
long._hover((h) => {
  h.backgroundColor._primary.alpha(85)
})
const longCls = long.toString()

// ─── 2. icss shortcut：一行 builder ───
const dangerCls = icss(defaultLight, (s) => {
  s.color.white
  s.backgroundColor._danger
  s.padding.px(12)
  s.borderRadius._middle
  s.fontWeight._huge
  s._hover((h) => {
    h.backgroundColor._danger.alpha(85)
  })
})

// ─── 3. ghost：组合 token + alpha + 边框 ───
const ghostCls = icss(defaultLight, (s) => {
  s.color._primary
  s.backgroundColor._primary.alpha(10)
  s.padding.px(12)
  s.borderRadius._middle
  s.fontWeight._huge
  s.borderWidth.px(1)
  s.borderStyle('solid')
  s.borderColor._primary.alpha(30)
  s._hover((h) => {
    h.backgroundColor._primary.alpha(20)
  })
})

const app = document.getElementById('app')!
app.innerHTML = `
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <button class="${longCls}">Primary (long form)</button>
    <button class="${dangerCls}">Danger (icss)</button>
    <button class="${ghostCls}">Primary Ghost</button>
  </div>
`
