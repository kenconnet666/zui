# 按钮示例

```ts
import { Chain, defaultLight, icss } from '@kenconnet666/zui-core'

const cls = icss(defaultLight, (s) => {
  s.display.inlineFlex
  s.padding.px(8)
  s.borderRadius._md
  s.color.white
  s.backgroundColor._primary
  s.cursor.pointer
  s._hover((h) => h.opacity(0.9))
})
```
