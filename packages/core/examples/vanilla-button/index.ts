import { Chain, FLAT_PALETTE, Theme, icss, tw } from '@kenconnet666/zui-core'
import type { BaseSchema } from '@kenconnet666/zui-core'

// ─── 0. 自定义小主题 ───
// core 只暴露 palette；语义色 + spacing/radius/fontWeight 由用户自家组合。
// 真实业务请用 `zuiLight`（来自 @kenconnet666/zui-vue），含完整设计系统 token。
interface MySchema extends BaseSchema {
  color: BaseSchema['color'] & {
    primary: string
    primaryHover: string
    danger: string
  }
  spacing: { middle: string }
  radius: { middle: string }
  fontWeight: { bold: number }
}

const theme = new Theme<MySchema>({
  color: {
    ...FLAT_PALETTE,
    primary: tw('blue', '600'),
    primaryHover: tw('blue', '500'),
    danger: tw('red', '600'),
  },
  spacing: { middle: '16px' },
  radius: { middle: '12px' },
  fontWeight: { bold: 700 },
})

// ─── 1. 长写法：手动 new Chain ───
const long = new Chain<MySchema>(theme)
long.color.white
long.backgroundColor._primary
long.padding.px(12)
long.borderRadius._middle
long.fontWeight._bold
long._hover(h => {
  h.backgroundColor._primary.alpha(85)
})
const longCls = long.toString()

// ─── 2. icss shortcut：一行 builder ───
const dangerCls = icss<MySchema>(theme, s => {
  s.color.white
  s.backgroundColor._danger
  s.padding.px(12)
  s.borderRadius._middle
  s.fontWeight._bold
  s._hover(h => {
    h.backgroundColor._danger.alpha(85)
  })
})

// ─── 3. ghost：组合 token + alpha + 边框 ───
const ghostCls = icss<MySchema>(theme, s => {
  s.color._primary
  s.backgroundColor._primary.alpha(10)
  s.padding.px(12)
  s.borderRadius._middle
  s.fontWeight._bold
  s.borderWidth.px(1)
  s.borderStyle('solid')
  s.borderColor._primary.alpha(30)
  s._hover(h => {
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
