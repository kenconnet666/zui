# docs-zh Agent 工作指南

本文档供子代理填充分组中文文档时使用。**请先完整读完本文件 + `colors.ts`，再开始写。**

---

## 你要做的事

填充 `packages/core/src/types/docs-zh/<group>.ts` 中文文档，每个属性符合下面"模板规范"。

写完后必须：

1. 跑 `node scripts/generate-properties.mjs`（应零报错）
2. 跑 `pnpm --filter @kenconnet666/zui-core run type-check`（应零报错）
3. 抽查生成的 `packages/core/src/types/properties.generated.ts` 中你负责的属性 JSDoc 渲染正常

---

## 用户原话约束（必须遵守）

- 用户对 CSS **不熟悉，是学习者**。所有关键字必须**逐一详细解释**，不能略写
- 写清楚每个关键字的**实际效果**，特别是"跟随父级 / 自动 / 默认 / 撑满"这种机制类关键字
- 关键字多则**分组**，少则**全列**
- 兼容性段要写"几种写法"（Syntax 列举多种形式）
- **不偷懒，不简化**

---

## 模板规范

每个属性的 `PropertyDocZh` 必须包含：

### 1. `firstLine`（必填）—— 第一行：一句话功能介绍

不超过 2 行；markdown 加粗 / 反引号 OK。

### 2. `keywordGroups`（必填）—— 关键字详解

至少 1 个分组（如 "X 个 keyword"、"此属性特有"、"通用颜色关键字"）。
**不要**自己写 "全局关键字" 分组 —— generator 会自动追加。

每分组：

```ts
{
  label: '5 个定位关键字',
  headers: ['关键字', '占位', '偏移属性生效', '偏移基准', '用途'],  // 可省，默认 ['关键字', '行为']
  rows: [
    ['`static`', '✓ 占位', '✗ 无效', '—', '**默认值**。正常文档流...'],
    // ...
  ],
}
```

**所有关键字必须写出效果**：

- 默认值要标注 "**默认值**"
- 类似 `auto` / `none` / `normal` / `inherit` 这种容易理解错的，要解释具体含义
- "跟随父级 / 撑满父容器 / 内容驱动 / 系统主题色" 等机制必须显式说

### 3. `details`（可选）—— 详细说明 / 常见陷阱

markdown 字符串。多段用 `\n\n` 分隔。

适合写：

- 同族关系（如 `paddingTop` 与 `padding` 简写的关系）
- 百分比参照基准（如 `paddingTop` 百分比参照"父宽度"，反直觉）
- 配合属性（如 `borderColor` 必须配 `borderStyle != none` 才显示）
- 主题 token 写法示例（length 属性可调 `lengthUnitsSnippet(propName)`）

不要写：单纯的英文翻译。所有内容必须是中文 / 中英混合。

### 4. `syntax`（必填）—— "可用写法（Syntax）" 表格

必须列举该属性接受的**所有形式**。最少几行：

```ts
syntax: [
  ['`<length>`', "`'200px'` `'12rem'` `'50vw'`", '长度单位'],
  ['`<percentage>`', "`'50%'`", '参照基准见详细说明'],
  ['`auto`', '—', '默认；浏览器自动算'],
  // ...
]
// 全局关键字一行由 generator 自动追加，不要自己写
```

颜色属性可直接 spread `COLOR_SYNTAX_ROWS`；长度属性可 spread `LENGTH_SYNTAX_ROWS`。

### 5. `initialValue`（必填）—— CSS spec 的初始值

例：`'auto'` / `'normal'` / `'static'` / `'transparent'` / `'0'`。
不知道就查 MDN 或 csstype 注释。

### 6. `inherits`（必填）—— 是否继承

例：color/font/lineHeight 等是 `true`；width/margin/border 等大多是 `false`。
不知道就查 MDN（每个属性页有 "Inherited" 行）。

### 7. `browserNote`（可选）—— 兼容性补充说明

generator 会自动从 csstype 抽取浏览器表，这里只写补充说明（如 "CSS 4 新属性，2023+ 支持" / "stretch 关键字 Chrome 124+"）。

---

## 同族属性复用：`extends`

如果 `paddingTop` / `paddingRight` 等同族属性的关键字 / details / syntax 完全相同，只需替换 `firstLine`，用：

```ts
paddingTop: {
  extends: 'padding',  // 继承同分组的 padding 属性
  firstLine: '设置元素**上内边距**。其他规则同 [`padding`]。',
},
```

**注意**：generator 只支持一级继承，不能链式。

---

## 可用的 \_common 工具

```ts
import {
  type DocsGroup, // const colors: DocsGroup = { ... }
  type PropertyDocZh, // 单个属性类型
  COLOR_SYNTAX_ROWS, // 颜色属性的 11 行 Syntax 共享数据
  LENGTH_SYNTAX_ROWS, // 长度属性的 3 行 Syntax 共享数据
  colorTokenUsage, // 函数：生成 "### 主题 token 写法" 片段（颜色属性用）
  lengthUnitsSnippet, // 函数：生成 "### 长度单位 / 数学函数" 片段（长度属性用）
} from './_common'
```

---

## 完整示例参考

`packages/core/src/types/docs-zh/colors.ts` 已写好 14 个颜色属性，**先完整读这个文件再动手**。

关键参考点：

- `color` —— 最详细模板（包含命名色 / token 用法 / 常见陷阱 / 函数态形式）
- `borderColor` —— 简写属性（含 1/2/3/4 值分配规则）
- `borderTopColor` etc —— 用 `extends` 同族复用
- `outlineColor` —— 此属性特有关键字（`invert`）独立分组
- `caretColor` —— `auto` 关键字单独分组
- `fill` / `stroke` —— SVG 专属关键字 + paint server URL

---

## 验证流程

完成后**必须**：

1. `node scripts/generate-properties.mjs` —— 应输出 `[gen-properties] 已生成: ...`，无错误
2. 检查 `packages/core/src/types/properties.generated.ts` 中你的属性 JSDoc 渲染（用 grep 找）
3. `pnpm --filter @kenconnet666/zui-core run type-check` —— 应零报错

---

## 注意

- **不要**改 `_common.ts` / `banner.ts` / `index.ts` / `colors.ts`
- **不要**改 `generate-properties.mjs`
- **不要**改 `enhanced-props.ts` 或其他源文件
- 只填充你被分配的分组文件

如果某个属性的 keyword 不清楚怎么用，请查：

- MDN：`https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/<prop>`
- `enhanced-props.ts` 中找到该属性的 keywords 数组，按 CSS spec 解释
- csstype 注释（properties.generated.ts 中该属性的旧 JSDoc 有 syntax + 兼容表）
