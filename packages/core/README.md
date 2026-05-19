# @kenconnet666/zui-core

> **框架无关**的 CSS-in-JS 工具库，基于 [`@emotion/css`](https://emotion.sh/docs/@emotion/css)。
> 用 `class Theme<T>` + `class Chain<T>` 把 ~857 个 CSS 属性挂到强类型 builder 上，让
> `s.color._primary` / `s.padding.px(16)` / `s.color._primary.alpha(50)` 全部在 IDE 里补全到位。

[![npm](https://img.shields.io/npm/v/@kenconnet666/zui-core.svg)](https://www.npmjs.com/package/@kenconnet666/zui-core)

---

## 特性

- **类型完整**：`Chain<T>` 上的每个 CSS 属性都按 csstype JSDoc 注释（MDN 链接、浏览器兼容
  表、Initial value）—— hover 提示直接看到。
- **四态访问** —— 同一个属性入口支持四种用法：

  ```ts
  s.color('red') // ① 函数调用：csstype 严格
  s.color._primary // ② 主题 token（_ 前缀）
  s.color.white // ③ CSS keyword（无前缀）
  s.padding.px(16) // ④ unit 方法 → '16px'
  ```

- **颜色 token modifier**：颜色 token 命中后挂 6 个 modifier（基于 color2k）：

  ```ts
  s.backgroundColor._primary.alpha(20) // rgba(37, 99, 235, 0.2)
  s.color._primary.darken(15) // 加深 15%
  s.borderColor._primary.lighten(30) // 提亮 30%
  s.color._danger.mix('#ffffff', 50) // 与白色 50% 混合
  s.color._primary.saturate(20) // 饱和度 +20%
  s.color._primary.desaturate(40) // 饱和度 -40%
  ```

- **59 个内建嵌套方法**：`_hover` / `_focus` / `_dark` / `_lineClamp(3)` / `_truncate()` /
  `_groupHover` / `_media('_md', ...)` / `_blur('_md')` / 等等。
- **完全框架无关**：库不依赖 Vue / React / Svelte / Solid。框架接入由用户 30 行级 provider 拼装。
- **`icss(theme, factory)` 一行 shortcut**：适合大多数场景，不用手动 `new Chain` + `toString`。

---

## 安装

```bash
pnpm add @kenconnet666/zui-core
# 需要 peer:
pnpm add @emotion/css
```

要求：Node ≥ 18，TypeScript ≥ 5（`moduleResolution: "Bundler"`）。

---

## 快速开始

### 1️⃣ 用内置 Tailwind 风 default theme

```ts
import { icss, defaultLight } from '@kenconnet666/zui-core'

const cls = icss(defaultLight, (s) => {
  s.color.white
  s.backgroundColor._primary
  s.padding.px(12)
  s.borderRadius._md
  s.fontWeight._bold
  s._hover((h) => {
    h.backgroundColor._primary.alpha(85)
  })
})

document.body.innerHTML = `<button class="${cls}">Click</button>`
```

### 2️⃣ 自定义 schema（继承）

```ts
import { Theme, type ThemeSchema, icss } from '@kenconnet666/zui-core'

interface BrandSchema extends ThemeSchema {
  color: { primary: string; danger: string; brand: string }
  spacing: { xs: string; sm: string; md: string; lg: string }
  brand: { logo: number; accent: string }
}

class BrandTheme extends Theme<BrandSchema> {
  constructor() {
    super({
      color: { primary: '#2563eb', danger: '#dc2626', brand: '#7c3aed' },
      spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
      brand: { logo: 80, accent: '#a78bfa' },
    })
  }
}

const myTheme = new BrandTheme()
const cls = icss(myTheme, (s) => {
  s.color._brand // ✅ 自家 token，IDE 补全
  s.padding._lg // ✅
  // s.color._notExist            // ❌ 编译期飘红
})
```

### 3️⃣ 长写法（`new Chain` 直接用）

```ts
import { Chain, defaultLight } from '@kenconnet666/zui-core'

const c = new Chain(defaultLight)
c.color._primary
c.padding.px(16)
c.fontSize._lg
const cls = c.toString() // → emotion className
```

---

## 内建方法（59 个，按职责分组）

| 组            | 方法                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| 状态伪类      | `_hover` `_active` `_focus` `_focusVisible` `_focusWithin` `_disabled` `_checked` `_enabled`         |
| 表单伪类      | `_required` `_optional` `_valid` `_invalid` `_readOnly` `_placeholderShown` `_inRange` `_outOfRange` |
| 链接 / 目标   | `_link` `_visited` `_target` `_dir(rtl/ltr, fn)`                                                     |
| 伪元素        | `_before` `_after` `_placeholder` `_selection` `_marker`                                             |
| 结构伪类      | `_firstChild` `_lastChild` `_only` `_empty` `_nthChild(n, fn)` `_nthOfType(n, fn)`                   |
| group / peer  | `_groupHover` `_groupFocus` `_groupActive` `_peerHover` `_peerFocus` `_peerChecked`                  |
| 选择器 / 条件 | `_selector(sel, fn)` `_and(tail, fn)` `_when(cond, fn)` `_unless(cond, fn)`                          |
| At 规则       | `_media('_md', fn)` `_supports('(...)' , fn)` `_container('_lg', fn)`                                |
| 媒体修饰符    | `_dark` `_light` `_motionSafe` `_motionReduce` `_print` `_rtl` `_ltr`                                |
| 工具组合      | `_truncate()` `_lineClamp(n)` `_srOnly()` `_centered()` `_absoluteCenter()`                          |
| filter        | `_blur('_md')` `_backdropBlur('_md')`                                                                |
| 逃生舱        | `_prop(name, value)` `_var('--x', val)` `_use(cssObj)` `_apply(fn)` `label(name)`                    |

---

## 框架集成（recipes）

库本身不打包任何框架代码 —— 各家 reactive system 接入 30 行就够，**recipe 直接复制粘贴**：

- [Vue 3](./recipes/vue.md) — `provide/inject` + `computed`
- [React](./recipes/react.md) — `createContext` + `useMemo`
- [Svelte 5](./recipes/svelte.md) — `$state` + `$derived` + `getContext`
- [SolidJS](./recipes/solid.md) — `createContext` + `createMemo`

**构建组件库**：
- [Vue 3 — 含 ConfigProvider 向下覆盖](./recipes/component-library-vue.md)（theme + variants 多层 override）

---

## 构建组件库（0.5.0+）

zui-core 为组件库作者提供以下 API：

### `defineVariants` — cva 风变体（单 className）

```ts
import { defineVariants, type VariantPropsOf } from '@kenconnet666/zui-core'

const button = defineVariants(theme, {
  base: s => { s.padding.px(12); s.borderRadius._md; s.fontWeight._bold },
  variants: {
    intent: {
      primary: s => { s.backgroundColor._primary; s.color.white },
      danger:  s => { s.backgroundColor._danger;  s.color.white },
      ghost:   s => { s.color._primary; s.backgroundColor.transparent },
    },
    size: {
      sm: s => { s.padding.px(8) },
      md: s => { s.padding.px(12) },
      lg: s => { s.padding.px(16) },
    },
    disabled: {                  // boolean variants 0.5.0+
      true: s => { s.opacity._50; s.pointerEvents('none') },
      false: () => {},
    },
  },
  defaultVariants: { intent: 'primary', size: 'md', disabled: false },
  compoundVariants: [
    { when: { intent: 'ghost', size: 'sm' }, apply: s => { s.padding.px(6) } },
  ],
})

// 用法
button({ intent: 'danger', size: 'sm', disabled: true })

// 类型推断
type ButtonProps = VariantPropsOf<typeof button>
// = { intent?: 'primary'|'danger'|'ghost'; size?: 'sm'|'md'|'lg'; disabled?: boolean | 'true' | 'false' }
```

### `defineParts` — 多 slot 组件（Dialog / Tabs / Select）

```ts
import { defineParts, type VariantPropsOfParts } from '@kenconnet666/zui-core'

const dialog = defineParts(theme, {
  slots: ['root', 'overlay', 'content', 'title'] as const,
  base: {
    root: s => { s.position.fixed; s.zIndex._modal },
    overlay: s => { s.position.absolute; s.backgroundColor.black; s.opacity._50 },
    content: s => { s.position.absolute; s.borderRadius._lg; s.padding._lg },
    title: s => { s.fontWeight._bold; s.fontSize._xl },
  },
  variants: {
    size: {
      sm: { content: s => { s.maxWidth.px(400) } },
      md: { content: s => { s.maxWidth.px(600) } },
    },
  },
  defaultVariants: { size: 'md' },
})

// 用法（每个 slot 独立工厂）
dialog.root({ size: 'sm' })
dialog.content({ size: 'sm' })
```

### `composeVariants` — 复用通用变体

```ts
import { composeVariants, defineVariants } from '@kenconnet666/zui-core'

const interactive = defineVariants(theme, {
  variants: {
    state: { idle: () => {}, loading: s => { s.opacity._70 } },
  },
})

const button = composeVariants(interactive, buttonCore)
// 类型推断自动合并 interactive + buttonCore 的 props union
```

### `defineMixin` — 可重用样式片段

```ts
import { defineMixin } from '@kenconnet666/zui-core'

const focusRing = defineMixin<MySchema>(s => {
  s._focusVisible(f => {
    f.outlineColor._primary
    f.outlineStyle('solid')
    f.outlineWidth.px(2)
  })
})

// 在 variants 内调用：
defineVariants(theme, {
  base: s => { focusRing(s) /* ... */ },
  ...
})
```

### `Chain._state` — 状态化样式

```ts
icss(theme, s => {
  s.padding.px(12)
  s._state(props, {
    loading:  h => { h.opacity._70; h.pointerEvents('none') },
    error:    h => { h.borderColor._danger },
    disabled: h => { h.opacity._50 },
  })
})
```

### `applyResponsive` / `applyStyleProps` — 响应式 prop

```ts
import { applyStyleProps } from '@kenconnet666/zui-core'

// (theme, props) 签名返回 className（0.5.0+）
const cls = applyStyleProps(theme, {
  p: { base: 4, md: 8, lg: 16 },     // 响应式
  bg: '_primary',
  rounded: '_md',
})
```

### `componentTokensFor` — runtime token map

```ts
import { componentTokensFor, withComponentTokens } from '@kenconnet666/zui-core'

declare module '@kenconnet666/zui-core' {
  interface ComponentTokenRegistry {
    button: { primary: string; primaryHover: string }
  }
}

const themed = withComponentTokens(theme, {
  button: t => ({ primary: t.color.primary, primaryHover: t.color.primaryHover }),
})

const tokens = componentTokensFor('button', themed)
// → { primary: '#2563eb', primaryHover: '#1d4ed8' }
```

### SSR / 多 emotion 实例

```ts
import { createInstance } from '@emotion/css/create-instance'
import { createIcssInstance } from '@kenconnet666/zui-core'

const emotion = createInstance({ key: 'myapp' })
const { icss, presetAnimations, injectPreflight } = createIcssInstance(emotion)

// presetAnimations 注册到 myapp 这个 instance，SSR 隔离
icss(theme, s => { s.animationName(presetAnimations.fadeIn) })
```

---

## 主题机制

### `Theme<T>`

```ts
class Theme<T extends ThemeSchema> {
  constructor(schema: T)
  schema: T
  resolve(): ResolvedTheme<T> // 展开 function token，结果缓存
  merge(partial: DeepPartial<T>): Theme<T>
}

// 同时：theme.color.primary 等字段强类型可访问（type intersection 注入）
```

### `ThemeSchema` 形状

```ts
interface ThemeSchema {
  color?: Record<string, ThemeValue>
  spacing?: Record<string, ThemeValue>
  radius?: Record<string, ThemeValue>
  shadow?: Record<string, ThemeValue>
  fontSize?: Record<string, ThemeValue>
  fontWeight?: Record<string, ThemeValue>
  // ... 等 18 个内置 category
  [customCategory: string]: Record<string, ThemeValue> | undefined
}

type ThemeValue = string | number | ((ctx: ResolvedThemeContext) => string | number)
```

### function token（延迟计算）

```ts
new Theme({
  color: {
    primary: '#2563eb',
    primaryHover: (ctx) => ctx.color!.primary, // 派生
  },
})
```

`resolve()` 后 `primaryHover = '#2563eb'`。

---

## 限制 / 已知约束

- **factory 必须是同步函数**：`icss(theme, async s => ...)` 不被支持（emotion `css()` 同步出 className）。
- **保留属性名**：用户 schema 的 category 名不能用 `label` / `constructor` / `toString` /
  `toCSSObject` / `_node` / `_theme` / `_keymap` / `_carriers`（会与 Chain 内部冲突，类型层没强约束，README 警告）。
- **TS 实例化深度**：单个 category 包含 200+ token 时（如完整 Tailwind palette）可能触发
  "Type instantiation is excessively deep"。0.2.0 计划用 `PaletteColorTokens`/`SemanticColorTokens`
  拆分缓解。
- **`schema` 上挂 function token 但通过 `theme.color.primary` 字段直接访问**：
  `Object.assign(this, schema)` 把 schema 各 category 拷到 instance 上，函数原值会出现在 instance；
  字段类型签名是 `string | number`（与 ResolvedTheme 形状一致），不一致。**最佳实践**：始终用
  `theme.resolve()` 或 `icss(theme, ...)` 拿展开后的值，避免直接访问 `theme.color.x`。
  0.4.0 起 dev 模式 `console.warn` 提醒。
- **Token 命中后**：
  - **颜色 token** 返回 `ColorTokenValue` helper（暴露 `.alpha(n)` / `.darken(n)` 等 6 modifier），**不要继续链式**：`c.color._primary.alpha(50)` ✅；`c.color._primary.padding.px(8)` ❌
  - **非颜色 token**（如 `c.padding._md`）运行时返回 chain，**类型层也允许继续链**，但请**仍按 statement-only 风格写**（每条独立一行），避免依赖隐式链式行为。**未来可能改为不返回 chain**。
- **`mergeTheme(parent, partial)` 的 partial 应为字面量**：0.4.0 起 dev 模式会 `console.warn` 警示
  partial 含 function token；生产构建静默。
- **`:focus-visible` 浏览器兼容**：iOS Safari 14- 不支持（2021-2022 安装基数 < 5%）。
  `Chain._focusVisible(fn)` 会原样输出 `&:focus-visible { ... }`，在不支持的浏览器上整段失效。
  若需要兜底，配合 `_focus(fn)` 写一份。
- **SSR / 多 emotion 实例**：0.3.0 起提供 `createIcssInstance(emotion)` 工厂，创建本地版 `icss` /
  `chain` / `cx` / `injectGlobal` / `ikeyframes` 等，避免全局 emotion cache 污染。

---

## 仓库 / 开发

```bash
git clone https://github.com/kenconnet666/zui.git
cd zui
pnpm install

# 在 packages/core 下：
pnpm test              # vitest run，17 个 spec / 281 测试
pnpm type-check        # tsc -p tsconfig.typecheck.json
pnpm build             # vite lib mode 出 ESM + .d.ts

# 跑 vanilla-button demo：
pnpm --filter @kenconnet666/example-vanilla-button dev

# 改了 ENHANCED_PROPS 后重生成 properties.generated.ts：
node scripts/generate-properties.mjs
```

更多设计文档见 [`.claude/Plan.md`](../../.claude/Plan.md) 与 [`.claude/AGENT.md`](../../.claude/AGENT.md)。

## 发布流程（changesets）

仓库用 [changesets](https://github.com/changesets/changesets) 管版本：

```bash
# 1. 改完代码后，记录一个 changeset（交互式选 patch/minor/major + 描述）
pnpm changeset

# 2. 准备发布时，让 changesets bump 版本 + 写 CHANGELOG
pnpm changeset version

# 3. 手动 publish（CI 不自动发，避免误发）
pnpm --filter @kenconnet666/zui-core publish --access public
```

发包前 `prepublishOnly` 会自动跑 type-check + test + build。

---

## License

MIT © kenconnet666
