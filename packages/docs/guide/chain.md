# Chain 四态访问

每个增强属性都支持以下四种使用方式：

```ts
import { Chain, defaultLight } from '@kenconnet666/zui-core'

const s = new Chain(defaultLight)

s.color('red')        // 1. 函数调用（逃生舱，csstype 严格）
s.color._primary      // 2. 主题 token（_ 前缀，IDE 推断自 schema）
s.color.white         // 3. CSS keyword（无前缀，驼峰）
s.padding.px(16)      // 4. unit 方法
```

内建嵌套方法全部以 `_` 前缀：

```ts
s._hover((h) => h.color._danger)
s._media('(min-width: 768px)', (m) => m.fontSize.px(20))
s._when(isActive, (a) => a.opacity(1))
```
