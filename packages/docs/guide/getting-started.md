# 快速开始

## 安装

```bash
pnpm add @kenconnet666/zui-core @emotion/css
```

## 最简用法

```ts
import { Chain, defaultLight, icss } from '@kenconnet666/zui-core'

const cls = icss(defaultLight, (s) => {
  s.color._primary
  s.padding.px(16)
  s._hover((h) => h.opacity(0.9))
})

document.querySelector('button')!.className = cls
```
