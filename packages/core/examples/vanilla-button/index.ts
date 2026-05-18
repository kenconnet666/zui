
// 长写法
import { Chain, defaultLight, icss } from '../../src'

const c = new Chain(defaultLight)
c.color._primary
c.padding._lg
c.color.white
const cls1 = c.toString()

// 一行 shortcut
const cls2 = icss(defaultLight, (s) => {
  s.color._primary
  s.padding.px(16)
  s._hover((h) => {
    h.opacity(0.9)
  })
})

document.body.innerHTML = `
  <button class="${cls1}">primary 按钮（长写法）</button>
  <button class="${cls2}">primary 按钮（icss）</button>
`
