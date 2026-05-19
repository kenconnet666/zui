---
'@kenconnet666/zui-core': minor
---

Batch C — 预设动画 + `_transition` 简写

### `presetAnimations` 模块

15 个组件库常用 keyframes 预设（参考 tailwindcss-animate）：

| 类别 | 名称 |
|---|---|
| Fade | `fadeIn` / `fadeOut` |
| Slide | `slideInUp` / `slideInDown` / `slideInLeft` / `slideInRight` / `slideOutDown` |
| Scale / Zoom | `scaleIn` / `scaleOut` / `zoomIn` |
| 强调 / 循环 | `spin` / `pulse` / `bounce` / `ping` / `shake` |

每个值是 emotion 注册后的 `animation-name` 字符串，直接传给 `s.animationName(...)` 使用：

```ts
import { presetAnimations, icss, defaultLight } from '@kenconnet666/zui-core'

const cls = icss(defaultLight, s => {
  s.animationName(presetAnimations.fadeIn)
  s.animationDuration('300ms')
  s.animationFillMode('both')
})
```

### `_transition` 链式简写

新 Chain method，token 名（`_normal` / `_inOut`）自动解析自 `theme.duration` / `theme.easing`：

```ts
s._transition({ property: 'all', duration: '_normal', easing: '_inOut' })
// → transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1)

s._transition({ property: 'opacity', duration: 200, easing: 'ease-out' })
// → transition: opacity 200ms ease-out
```

特性：
- 数字 `duration` 自动加 `ms` 单位
- token 不存在时原样透传（不抛错）
- `delay` 也支持 token / 数字
- 与 `_hover` 等嵌套方法协调

新增导出：
- `presetAnimations` 主对象
- `PresetAnimationName` 字面量 union 类型
- `Chain._transition(opts)` method

新增 38 测试（共 341 / 303 → 341）。
