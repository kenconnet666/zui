# @kenconnet666/zui-core

> **框架无关**的 CSS-in-JS 工具库，基于 [`@emotion/css`](https://emotion.sh/docs/@emotion/css)。
> `class Theme<T>` + `class Chain<T>` 把 ~857 个 CSS 属性挂到强类型 builder 上。

[![npm](https://img.shields.io/npm/v/@kenconnet666/zui-core.svg)](https://www.npmjs.com/package/@kenconnet666/zui-core)

## 特性

- **四态访问**：`s.color('red')` / `s.color._primary` / `s.color.white` / `s.padding.px(16)`
- **类型层 statement-only**：每个 setter 表达式一行 CSS，类型层返回 `void`，禁止 fluent 链式（IDE 补全干净，不爆 chain 表面）
- **类型完整**：每个 CSS 属性带 csstype JSDoc（MDN 链接 / 兼容表 / Initial value）
- **颜色 token modifier**：`s.color._primary.alpha(50)`（基于 color2k；modifier 覆盖式，不累积，11 个：alpha / darken / lighten / mix / shade / tint / saturate / desaturate / complement / rotateHue / invert）
- **89+ 内建嵌套方法**：`_hover` / `_dark` / `_media` / `_groupHover` / `_lineClamp` / 等
- **完全框架无关**：不依赖 Vue / React / Svelte / Solid
- **`icss(theme, factory)` 一行 shortcut**

## 安装

```bash
pnpm add @kenconnet666/zui-core @emotion/css
```

需要 Node ≥ 18，TypeScript ≥ 5（`moduleResolution: "Bundler"`）。

## 入门

```ts
import { icss, defaultLight } from '@kenconnet666/zui-core'

const cls = icss(defaultLight, (s) => {
  s.color.white
  s.backgroundColor._primary
  s.padding.px(12)
  s.borderRadius._middle
  s._hover((h) => { h.backgroundColor._primary.alpha(85) })
})

document.body.innerHTML = `<button class="${cls}">Click</button>`
```

## 自定义主题

```ts
import { Theme, type ThemeSchema, icss } from '@kenconnet666/zui-core'

interface BrandSchema extends ThemeSchema {
  color: { primary: string; danger: string; brand: string }
  spacing: { tiny: string; small: string; middle: string; large: string }
}

const myTheme = new Theme<BrandSchema>({
  color: { primary: '#2563eb', danger: '#dc2626', brand: '#7c3aed' },
  spacing: { tiny: '4px', small: '8px', middle: '16px', large: '24px' },
})

const cls = icss(myTheme, (s) => {
  s.color._brand           // ✅ 自家 token，IDE 补全
  s.padding._large         // ✅
})
```

## Subpath 入口（精确 tree-shake）

```ts
import { defineVariants, defineParts, extendVariants, extendParts } from '@kenconnet666/zui-core/variants'
import { presetAnimations, PREFLIGHT_STYLES } from '@kenconnet666/zui-core/preset'
import { assertSchemaConsistency, makeCallsiteLabel } from '@kenconnet666/zui-core/dev'
```

## 构建组件库

完整 API 速查（`Theme.fork` / `defineParts` / `extendParts` / `composeVariants` / `applyStyleProps` / `applyResponsive` / `createIcssInstance`）与 ConfigProvider 嵌套覆盖示范见 [仓库 skill](../../.claude/skills/zui.md)。

## License

MIT
