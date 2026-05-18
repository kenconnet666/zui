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
  s.color('red')                 // ① 函数调用：csstype 严格
  s.color._primary               // ② 主题 token（_ 前缀）
  s.color.white                  // ③ CSS keyword（无前缀）
  s.padding.px(16)               // ④ unit 方法 → '16px'
  ```

- **alpha 简写**：颜色 token 命中后挂 `.alpha(n)`（0-100 百分比）：

  ```ts
  s.backgroundColor._primary.alpha(20)   // rgba(37, 99, 235, 0.2)
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

const cls = icss(defaultLight, s => {
  s.color.white
  s.backgroundColor._primary
  s.padding.px(12)
  s.borderRadius._md
  s.fontWeight._bold
  s._hover(h => { h.backgroundColor._primary.alpha(85) })
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
      color:   { primary: '#2563eb', danger: '#dc2626', brand: '#7c3aed' },
      spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
      brand:   { logo: 80, accent: '#a78bfa' },
    })
  }
}

const myTheme = new BrandTheme()
const cls = icss(myTheme, s => {
  s.color._brand                  // ✅ 自家 token，IDE 补全
  s.padding._lg                   // ✅
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
const cls = c.toString()    // → emotion className
```

---

## 内建方法（59 个，按职责分组）

| 组 | 方法 |
|---|---|
| 状态伪类 | `_hover` `_active` `_focus` `_focusVisible` `_focusWithin` `_disabled` `_checked` `_enabled` |
| 表单伪类 | `_required` `_optional` `_valid` `_invalid` `_readOnly` `_placeholderShown` `_inRange` `_outOfRange` |
| 链接 / 目标 | `_link` `_visited` `_target` `_dir(rtl/ltr, fn)` |
| 伪元素 | `_before` `_after` `_placeholder` `_selection` `_marker` |
| 结构伪类 | `_firstChild` `_lastChild` `_only` `_empty` `_nthChild(n, fn)` `_nthOfType(n, fn)` |
| group / peer | `_groupHover` `_groupFocus` `_groupActive` `_peerHover` `_peerFocus` `_peerChecked` |
| 选择器 / 条件 | `_selector(sel, fn)` `_and(tail, fn)` `_when(cond, fn)` `_unless(cond, fn)` |
| At 规则 | `_media('_md', fn)` `_supports('(...)' , fn)` `_container('_lg', fn)` |
| 媒体修饰符 | `_dark` `_light` `_motionSafe` `_motionReduce` `_print` `_rtl` `_ltr` |
| 工具组合 | `_truncate()` `_lineClamp(n)` `_srOnly()` `_centered()` `_absoluteCenter()` |
| filter | `_blur('_md')` `_backdropBlur('_md')` |
| 逃生舱 | `_prop(name, value)` `_var('--x', val)` `_use(cssObj)` `_apply(fn)` `label(name)` |

---

## 框架集成（recipes）

库本身不打包任何框架代码 —— 各家 reactive system 接入 30 行就够，**recipe 直接复制粘贴**：

- [Vue 3](./recipes/vue.md) — `provide/inject` + `computed`
- [React](./recipes/react.md) — `createContext` + `useMemo`
- [Svelte 5](./recipes/svelte.md) — `$state` + `$derived` + `getContext`
- [SolidJS](./recipes/solid.md) — `createContext` + `createMemo`

---

## 主题机制

### `Theme<T>`

```ts
class Theme<T extends ThemeSchema> {
  constructor(schema: T)
  schema: T
  resolve(): ResolvedTheme<T>        // 展开 function token，结果缓存
  merge(partial: DeepPartial<T>): Theme<T>
}

// 同时：theme.color.primary 等字段强类型可访问（type intersection 注入）
```

### `ThemeSchema` 形状

```ts
interface ThemeSchema {
  color?:      Record<string, ThemeValue>
  spacing?:    Record<string, ThemeValue>
  radius?:     Record<string, ThemeValue>
  shadow?:     Record<string, ThemeValue>
  fontSize?:   Record<string, ThemeValue>
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
    primaryHover: ctx => ctx.color!.primary,   // 派生
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
- **SSR**：当前不提供 emotion 实例隔离 wrapper，0.3.0 计划提供
  `createIcssInstance(emotion)` 工厂。

---

## 仓库 / 开发

```bash
git clone https://github.com/kenconnet666/zui.git
cd zui
pnpm install

# 在 packages/core 下：
pnpm test              # vitest run，6 个 spec 合计 83 测试
pnpm type-check        # tsc --noEmit
pnpm build             # vite lib mode 出 ESM + .d.ts

# 跑 vanilla-button demo：
pnpm --filter @kenconnet666/example-vanilla-button dev

# 改了 ENHANCED_PROPS 后重生成 properties.generated.ts：
node scripts/generate-properties.mjs
```

更多设计文档见 [`Plan.md`](../../Plan.md)。

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
