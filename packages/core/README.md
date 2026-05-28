# @kenconnet666/zui-core

> **框架无关**的 CSS-in-JS 工具库,基于 [`@emotion/css`](https://emotion.sh/docs/@emotion/css)。
> `class Theme<T>` + `class Chain<T>` 用 TypeScript declaration merging 把 ~857 个 CSS 属性挂到强类型 builder 上。

[![npm](https://img.shields.io/npm/v/@kenconnet666/zui-core.svg)](https://www.npmjs.com/package/@kenconnet666/zui-core)

## 为什么是 zui-core

CSS-in-JS 主流方案两条路:

- **字符串 / 模板**(styled-components):IDE 不补全、不校验,主题 token 拿不到
- **对象字面量**(emotion `css` 函数 / Mantine):补全部分有,但深嵌套 selector / 主题 token 拼接体验差

zui-core 走第三条路 —— **强类型 builder**:

```ts
import { icss, paletteLight } from '@kenconnet666/zui-core'

const cls = icss(paletteLight, s => {
  s.color._primary // ← IDE 知道 _primary 是合法 token
  s.fontSize._large
  s.padding.iem(1) // ← iem(N) 是 carrier 方法
  s.borderRadius._middle
  s._hover(h => {
    h.backgroundColor._primary.alpha(8) // ← modifier 链式
  })
  s._dark(d => {
    d.color._textSecondary
  })
})
```

`s` 是 `Chain<TSchema>` 实例,每个 CSS 属性都是它的强类型属性,带 csstype JSDoc(MDN 链接 + 兼容表 + Initial value)。

## 特性

- **四态访问**:`s.color('#ff0000')` / `s.color._primary` / `s.color.white`(palette)/ `s.padding.px(16)`
- **类型层 statement-only**:每个 setter 表达式返回 `void`,禁止跨属性 fluent 链式(IDE 补全干净)
- **colors token modifier**:`s.color._primary.alpha(50)` —— 11 个 modifier:`alpha` / `darken` / `lighten` / `mix` / `shade` / `tint` / `saturate` / `desaturate` / `complement` / `rotateHue` / `invert`(基于 color2k)
- **89+ 内建嵌套方法**:`_hover` / `_focusVisible` / `_active` / `_disabled` / `_dark` / `_media` / `_groupHover` / `_lineClamp` / `_ariaSelected` / `_dataState` / 等
- **iem 响应式单位**:`s.padding.iem(1)` 等价 `calc(1 * var(--zui-iem, 16px))`,整站等比缩放
- **类型完整**:每个属性都有 csstype value type
- **零依赖**:除 `@emotion/css`(peer)和 `color2k` / `csstype` 外无他
- **完全框架无关**:不依赖 Vue / React / Svelte / Solid;`icss(theme, factory)` 一行生成 className

## 安装

```bash
pnpm add @kenconnet666/zui-core @emotion/css
```

需要 Node ≥ 20、TypeScript ≥ 5(`moduleResolution: "Bundler"`)。

> **Tip**:如果你用 Vue 3,直接装 [`@kenconnet666/zui-vue`](../ui-vue) —— 它把 core 列在 dependencies,且额外提供 `<ZBox>` provider / 80+ 组件 / 主题包。

## 入门

### 1. 用默认 palette

```ts
import { icss, paletteLight } from '@kenconnet666/zui-core'

const btn = icss(paletteLight, s => {
  s.color.white
  s.backgroundColor._blue // tailwind palette 内建 token
  s.padding.px(12)
  s.borderRadius.px(8)
  s._hover(h => {
    h.backgroundColor._blue.darken(10)
  })
})

document.body.innerHTML = `<button class="${btn}">Click me</button>`
```

`paletteLight` / `paletteDark` 来自内建 Tailwind palette,只有 palette,没有 semantic / scale。**业务消费推荐 `zuiLight` / `zuiDark`**(来自 `@kenconnet666/zui-vue`,含完整设计 system token)。

### 2. 自定义主题

```ts
import { Theme, icss, type ThemeSchema } from '@kenconnet666/zui-core'

interface BrandSchema extends ThemeSchema {
  color: { primary: string; danger: string; brand: string }
  spacing: { tiny: string; small: string; middle: string; large: string }
}

const myTheme = new Theme<BrandSchema>({
  color: { primary: '#2563eb', danger: '#dc2626', brand: '#7c3aed' },
  spacing: { tiny: '4px', small: '8px', middle: '16px', large: '24px' },
})

const cls = icss(myTheme, s => {
  s.color._brand // ✅ 自家 token,IDE 补全
  s.padding._large // ✅
  s.padding._huge // ❌ 编译期报错:'_huge' 不在 spacing token 中
})
```

### 3. 全局副作用工具

```ts
import {
  injectGlobal,
  injectPreflight,
  registerCustomProperty,
  registerFont,
  injectLayer,
} from '@kenconnet666/zui-core'

// CSS reset
injectPreflight()

// @property 注册
registerCustomProperty({
  name: '--brand-hue',
  syntax: '<number>',
  inherits: true,
  initialValue: '210',
})

// @font-face
registerFont({
  family: 'Inter',
  src: { woff2: '/fonts/inter.woff2' },
  weight: '100 900',
  display: 'swap',
})

// CSS @layer
injectLayer('base', 'components', 'utilities')
```

## Subpath 入口

```ts
// 变体系统(cva / tv 风格)
import {
  defineVariants,
  defineParts,
  extendVariants,
  extendParts,
} from '@kenconnet666/zui-core/variants'

// 预设资源(动画 keyframes)
import { presetAnimations } from '@kenconnet666/zui-core/preset'

// 开发态工具
import { assertSchemaConsistency, makeCallsiteLabel } from '@kenconnet666/zui-core/dev'
```

## 核心 API

### `icss(theme, factory): string`

最常用入口。传 theme + factory,得到 className。

```ts
const cls = icss(theme, s => {
  /* ... */
})
```

### `Theme<TSchema>`

```ts
const theme = new Theme(schema, options?)
theme.resolve()                 // 取扁平化结果
theme.extend({ color: { ... } }) // 派生新主题
const forked = Theme.fork(theme, { /* override */ })
```

### `Chain<TSchema>`

不需要自己实例化 —— `icss` 传给 factory 的 `s` 就是 `Chain` 实例。

### 变体抽象 `defineVariants` / `defineParts`

```ts
import { defineVariants } from '@kenconnet666/zui-core/variants'

const button = defineVariants({
  base: s => {
    s.fontWeight._medium
    s.borderRadius._middle
  },
  variants: {
    size: {
      small: s => {
        s.fontSize._small
        s.padding.iem(0.5)
      },
      middle: s => {
        s.fontSize._middle
        s.padding.iem(0.75)
      },
      large: s => {
        s.fontSize._large
        s.padding.iem(1)
      },
    },
    color: {
      primary: s => {
        s.backgroundColor._primary
        s.color.white
      },
      danger: s => {
        s.backgroundColor._danger
        s.color.white
      },
    },
  },
  defaultVariants: { size: 'middle', color: 'primary' },
})

const cls = icss(theme, s => button(s, { size: 'large', color: 'danger' }))
```

### `createIcssInstance` —— SSR / 多实例

```ts
import { createEmotion } from '@emotion/css/create-instance'
import { createIcssInstance } from '@kenconnet666/zui-core'

const emotion = createEmotion({ key: 'app' })
const { icss, ikeyframes, cx, toClassName, injectGlobal } = createIcssInstance({
  emotion,
})

// 服务端 SSR 用 emotion.flush() / emotion.hydrate() 等
```

### 响应式 prop

```ts
import { applyResponsive, type ResponsiveValue } from '@kenconnet666/zui-core'

const size: ResponsiveValue<'small' | 'middle' | 'large'> = {
  base: 'small',
  md: 'middle',
  lg: 'large',
}

const cls = icss(theme, s => {
  applyResponsive(s, theme, size, (s, v) => {
    if (v === 'small') s.fontSize._small
    if (v === 'middle') s.fontSize._middle
    if (v === 'large') s.fontSize._large
  })
})
```

## 嵌套 / 状态选择器(89+ 内建)

```ts
icss(theme, s => {
  s._hover(h => {
    h.color._primary
  })
  s._focusVisible(f => {
    f.outline('2px solid currentColor')
  })
  s._dark(d => {
    d.backgroundColor._bgDark
  })
  s._media('(min-width: 768px)', m => {
    m.fontSize._large
  })
  s._groupHover(g => {
    g.opacity(1)
  })
  s._lineClamp(2) // -webkit-line-clamp shortcut
  s._ariaSelected(sel => {
    sel.backgroundColor._primary.alpha(8)
  })
  s._dataState('open', op => {
    op.borderColor._primary
  })
})
```

完整 89+ 嵌套方法见 source `packages/core/src/chain/Chain.ts` 或 docs 站点。

## 性能

- **每个 className cache 命中后 O(1)** —— emotion 内部 hash
- **零运行时类型开销** —— 全部在 TypeScript 编译期
- **tree-shake 友好** —— 单入口 + `sideEffects` 精确标注(只有 `preset/animations.js` 注入 keyframes 是副作用)

## 与 zui-vue 的关系

| 包         | 职责                                                                  | 依赖关系                                  |
| ---------- | --------------------------------------------------------------------- | ----------------------------------------- |
| `zui-core` | 框架无关 chain DSL / 主题模型 / 变体抽象                              | 仅依赖 `@emotion/css` `color2k` `csstype` |
| `zui-vue`  | Vue 3 集成 `<ZBox>` provider + 80+ 组件 + `zuiLight/Dark` 主题 + i18n | 依赖 `zui-core` + Vue 3 全家桶            |

## 开发

```bash
# 在 monorepo 根
pnpm install
pnpm --filter @kenconnet666/zui-core test          # 566+ spec
pnpm --filter @kenconnet666/zui-core run type-check
pnpm --filter @kenconnet666/zui-core run build
pnpm --filter @kenconnet666/zui-core run bench     # 性能基准
```

## 相关链接

- [zui-vue Vue 3 集成层](../ui-vue/README.md)
- [docs 站点](../docs/) —— `<ZBox>` / 主题 / iem / 80+ 组件 demo
- [完整 API 与设计文档](../../.claude/skills/zui.md)
- [CHANGELOG](./CHANGELOG.md)

## License

MIT
