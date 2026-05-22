/**
 * docs-zh 共享数据 / 类型定义 / 片段生成器。
 *
 * 这些片段在所有属性的 JSDoc 中复用，集中维护以避免漂移。
 */

// ════════════════════════════════════════════════════════════════════
// PropertyDocZh —— 中文文档源数据类型
// ════════════════════════════════════════════════════════════════════

/** 一组关键字 + 解释（表格行），格式：[keyword, meaning] */
export type KwRow = readonly [keyword: string, meaning: string]

/** 一个关键字分组（用于较多关键字时分类展示） */
export interface KeywordGroup {
  /** 分组标题（如 "5 个定位关键字" / "通用颜色关键字（4 个）"） */
  label: string
  /** 是否输出为表格（默认 true）。设 false 时输出为 "- `kw` — meaning" 的列表 */
  asTable?: boolean
  /** 表格列头（asTable=true 时必填，默认 ['关键字', '行为']） */
  headers?: readonly string[]
  /** 数据行：每行可能是 [kw, meaning] 或 [col1, col2, ..., colN]（与 headers 列数对齐） */
  rows: ReadonlyArray<readonly string[]>
}

/** Syntax 可用写法表格的一行 */
export type SyntaxRow = readonly [form: string, example: string, note?: string]

/** 完整的属性文档（不继承同族属性） */
export interface FullPropertyDoc {
  /** 第一行：一句话功能介绍（必填，markdown 可用） */
  firstLine: string

  /** 关键字分组列表（必填至少 1 个分组；不含全局关键字 —— 由 generator 自动追加） */
  keywordGroups: readonly KeywordGroup[]

  /** "详细说明 / 常见陷阱"小节正文（可选，markdown 字符串；多段用 \n\n 分隔） */
  details?: string

  /** "CSS 命名色"小节占位标记 —— 颜色属性专用。设为 true 时 generator 自动插入分组色名表 */
  insertNamedColors?: boolean

  /** Syntax 可用写法表格（必填）。第 1 列 = 形式，第 2 列 = 示例，第 3 列 = 备注（可选） */
  syntax: readonly SyntaxRow[]

  /** Initial value（必填，CSS spec 定义的初始值；用于全局关键字表 + Syntax 段） */
  initialValue: string

  /** 此属性是否为继承属性（必填，影响 inherit/unset 关键字说明） */
  inherits: boolean

  /** 浏览器兼容表正文（markdown 表格 + 可选补充说明，可选；缺省由 generator 从 csstype 抽 MDN 表替代） */
  browserCompat?: string

  /** 兼容性补充说明（可选，markdown） */
  browserNote?: string

  /** MDN 链接的 slug 部分（如 'color'）；缺省 generator 从 csstype 抽 */
  mdnSlug?: string

  /** "继承同族属性" 的反向标记 —— FullPropertyDoc 不该有此字段 */
  extends?: never
}

/** 继承同族属性的简写：仅声明 firstLine，generator 把目标属性的其他字段拷贝过来 */
export interface ExtendsPropertyDoc {
  /** 继承目标属性名（必须存在于同一分组或全局聚合中） */
  extends: string
  /** 替换的第一行（必填） */
  firstLine: string
  /** 可选：替换 details（不写则继承） */
  details?: string
  /** 可选：替换 keywordGroups（不写则继承） */
  keywordGroups?: readonly KeywordGroup[]
  /** 可选：替换 syntax（不写则继承） */
  syntax?: readonly SyntaxRow[]
  /** 可选：覆盖 initialValue（不写则继承） */
  initialValue?: string
  /** 可选：覆盖 inherits */
  inherits?: boolean
  /** 可选：覆盖 insertNamedColors */
  insertNamedColors?: boolean
  /** 可选：覆盖 browserNote */
  browserNote?: string
}

/** PropertyDocZh —— 完整文档 或 继承简写 */
export type PropertyDocZh = FullPropertyDoc | ExtendsPropertyDoc

// ════════════════════════════════════════════════════════════════════
// 全局关键字表（每个属性都用，generator 自动注入）
// ════════════════════════════════════════════════════════════════════

/**
 * 生成全局关键字（inherit/initial/unset/revert/revertLayer）的解释表格。
 *
 * 行为根据 `inherits` 调整：
 * - 继承属性：`inherit` 提示"默认就继承"；`unset` 说明等同 `inherit`
 * - 非继承属性：`inherit` 提示"非继承属性写 inherit 才显式继承"；`unset` 说明等同 `initial`
 */
export function globalKeywordsTable(propName: string, initialValue: string, inherits: boolean): string {
  const inheritRow = inherits
    ? `| \`inherit\` | 强制继承父元素 \`${propName}\`。⚠️ \`${propName}\` **默认就是继承属性**，写 \`inherit\` 仅在被局部覆盖后用来还原 |`
    : `| \`inherit\` | 强制继承父元素 \`${propName}\`。⚠️ \`${propName}\` **非继承属性**，写 \`inherit\` 才显式继承 |`

  const unsetRow = inherits
    ? `| \`unset\` | \`${propName}\` 是继承属性 → 等同 \`inherit\`（向上找继承值，找不到才用 \`initial\`） |`
    : `| \`unset\` | \`${propName}\` 非继承属性 → 等同 \`initial\`（= \`${initialValue}\`） |`

  return [
    `### 全局关键字`,
    ``,
    `| 关键字 | 含义 |`,
    `| --- | --- |`,
    inheritRow,
    `| \`initial\` | 重置为 CSS spec 初始值 \`${initialValue}\` |`,
    unsetRow,
    `| \`revert\` | 回到**浏览器 user-agent 样式表**中 \`${propName}\` 的值 |`,
    `| \`revertLayer\` | 回到上一个 CSS \`@layer\` 中 \`${propName}\` 的值；不在 layer 中等同 \`revert\` |`,
  ].join('\n')
}

// ════════════════════════════════════════════════════════════════════
// 146 个 CSS 命名色（按色相分组，颜色属性共用）
// ════════════════════════════════════════════════════════════════════

/**
 * 生成 "CSS 命名色（146 个，按色相分组）" 小节文本。
 *
 * 颜色属性把 `insertNamedColors: true` 时由 generator 自动调用此函数注入。
 */
export function namedColorsSection(): string {
  return `## CSS 命名色（146 个，按色相分组）

全小写无连字符，如 \`s.color.coral\` / \`s.backgroundColor.royalblue\`。所有颜色属性通用。

- **中性色（27）**：
  - 白系（17）：\`white\` \`snow\` \`ivory\` \`floralwhite\` \`seashell\` \`linen\` \`oldlace\` \`antiquewhite\`
    \`beige\` \`lavenderblush\` \`mistyrose\` \`honeydew\` \`mintcream\` \`azure\` \`aliceblue\` \`ghostwhite\` \`whitesmoke\`
    （⚠️ \`azure\` 不是天蓝，是带蓝色调的白 \`#F0FFFF\`）
  - 灰系（9）：\`gainsboro\` \`lightgray\`/\`lightgrey\` \`silver\` \`darkgray\`/\`darkgrey\` \`gray\`/\`grey\`
    \`dimgray\`/\`dimgrey\` \`lightslategray\` \`slategray\` \`darkslategray\`
    （⚠️ \`darkgray #A9A9A9\` 比 \`gray #808080\` **浅**，HTML 4 命名错误延续至今）
  - 黑（1）：\`black\`

- **红系（10）**：\`red\` \`crimson\` \`firebrick\` \`darkred\` \`indianred\`
  \`salmon\` \`darksalmon\` \`lightsalmon\` \`lightcoral\` \`rosybrown\`

- **粉系（6）**：\`pink\` \`lightpink\` \`hotpink\` \`deeppink\` \`palevioletred\` \`mediumvioletred\`

- **橙系（5）**：\`orange\` \`darkorange\` \`coral\` \`tomato\` \`orangered\`

- **黄系（11）**：\`yellow\` \`gold\` \`khaki\` \`darkkhaki\` \`lightyellow\` \`lemonchiffon\`
  \`lightgoldenrodyellow\` \`papayawhip\` \`moccasin\` \`peachpuff\` \`palegoldenrod\`

- **棕 / 土系（16）**：\`brown\` \`maroon\` \`chocolate\` \`peru\` \`sienna\` \`saddlebrown\`
  \`tan\` \`wheat\` \`burlywood\` \`sandybrown\` \`goldenrod\` \`darkgoldenrod\`
  \`cornsilk\` \`blanchedalmond\` \`bisque\` \`navajowhite\`

- **绿系（19）**：\`green\` \`lime\` \`darkgreen\` \`forestgreen\` \`seagreen\` \`mediumseagreen\`
  \`darkseagreen\` \`lightgreen\` \`palegreen\` \`springgreen\` \`mediumspringgreen\`
  \`chartreuse\` \`lawngreen\` \`greenyellow\` \`yellowgreen\` \`limegreen\`
  \`olive\` \`olivedrab\` \`darkolivegreen\`
  （⚠️ \`lime #00FF00\` 是 HTML 纯绿，\`green #008000\` 比 \`lime\` **暗**）

- **青系（12）**：\`cyan\`/\`aqua\` \`darkcyan\` \`teal\` \`lightcyan\` \`turquoise\`
  \`mediumturquoise\` \`darkturquoise\` \`aquamarine\` \`mediumaquamarine\`
  \`paleturquoise\` \`lightseagreen\` \`cadetblue\`
  （⚠️ \`cyan\` ≡ \`aqua\`，完全相同的色 \`#00FFFF\`）

- **蓝系（15）**：\`blue\` \`darkblue\` \`mediumblue\` \`navy\` \`midnightblue\`
  \`dodgerblue\` \`cornflowerblue\` \`royalblue\` \`steelblue\` \`skyblue\`
  \`lightskyblue\` \`lightblue\` \`deepskyblue\` \`powderblue\` \`lightsteelblue\`

- **紫系（18）**：\`purple\` \`indigo\` \`violet\` \`magenta\`/\`fuchsia\` \`darkmagenta\`
  \`orchid\` \`darkorchid\` \`mediumorchid\` \`plum\` \`lavender\` \`thistle\`
  \`blueviolet\` \`darkviolet\` \`mediumpurple\` \`slateblue\` \`mediumslateblue\`
  \`darkslateblue\` \`rebeccapurple\`
  （⚠️ \`magenta\` ≡ \`fuchsia\`，完全相同的色 \`#FF00FF\`；
  \`rebeccapurple\` 为纪念 Eric Meyer 之女命名）`
}

// ════════════════════════════════════════════════════════════════════
// 共享 Syntax 行集合（颜色 / 长度 / 全局等）
// ════════════════════════════════════════════════════════════════════

/** 颜色属性共用的 Syntax 行集（除全局关键字 / 命名色，其余颜色形式） */
export const COLOR_SYNTAX_ROWS: readonly SyntaxRow[] = [
  ['`<named-color>`', "`'red'` `'coral'` `'royalblue'`", '146 个 CSS 命名色（见上）'],
  ['`<hex-color>`', "`'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'`", '3/4/6/8 位；4/8 位末两位为 alpha'],
  ['`rgb()` / `rgba()`', "`'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'`", '现代空格语法（推荐）+ 旧逗号语法'],
  ['`hsl()` / `hsla()`', "`'hsl(30 100% 50% / 0.8)'`", 'H 色相 / S 饱和 / L 明度'],
  ['`hwb()`', "`'hwb(30 0% 0%)'`", '色相+白度+黑度（CSS Color 4）'],
  ['`lab()` / `lch()`', "`'lab(60% 40 30)'` `'lch(60% 50 30)'`", '感知均匀色彩（CSS Color 4）'],
  ['`oklab()` / `oklch()`', "`'oklch(0.7 0.15 30)'`", '**推荐**，渐变插值最稳（CSS Color 4）'],
  ['`color()`', "`'color(display-p3 1 0.5 0)'`", '宽色域 P3 / Rec2020（CSS Color 4）'],
  ['`color-mix()`', "`'color-mix(in oklch, #f80 60%, #fff)'`", '浏览器原生混色（CSS Color 5）'],
  ['`<system-color>`', "`'canvas'` `'canvastext'` `'linktext'` `'buttonface'`", '系统色，跟随 OS 主题'],
  ['`currentColor`', '—', '引用当前 `color`'],
]

/** 长度属性共用的 Syntax 行（length / percentage / 数学函数 / 全局） */
export const LENGTH_SYNTAX_ROWS: readonly SyntaxRow[] = [
  ['`<length>`', "`'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'`", '绝对/字体/视口/容器查询单位'],
  ['`<percentage>`', "`'50%'`", '参照基准见详细说明'],
  ['数学函数', "`'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'`", '加减乘除 / 取小 / 取大 / 区间'],
]

/** 全局关键字的 Syntax 行（generator 自动追加；这里 export 供单独使用时调用） */
export const GLOBAL_KW_SYNTAX_ROW: SyntaxRow = [
  '全局关键字',
  '`inherit` `initial` `unset` `revert` `revertLayer`',
  '见上方关键字表',
]

// ════════════════════════════════════════════════════════════════════
// "颜色属性"通用 token 写法片段（详细说明小节用）
// ════════════════════════════════════════════════════════════════════

export const COLOR_TOKEN_USAGE_SNIPPET = `### 主题 token 写法

\`\`\`ts
s.${'<prop>'}._primary                    // 主题主色（ZBox 切 light/dark 自动跟随）
s.${'<prop>'}._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
s.${'<prop>'}._red500                     // Palette token（tailwind 风格 50–950 阶）
s.${'<prop>'}._primary.alpha(0.6)         // token + 修饰链
s.${'<prop>'}._primary.darken(0.1)
s.${'<prop>'}._primary.complement         // 互补色（色相 +180°）
\`\`\`

**核心规则**：加 \`_\` 走 token，不加 \`_\` 走 CSS 关键字 ——
\`s.${'<prop>'}._coral\` 查 \`schema.color.coral\` token（必须有定义），
\`s.${'<prop>'}.coral\` 走 CSS 命名色，输出 CSS 值。`

/** 把 `<prop>` 占位符替换为实际属性名 */
export function colorTokenUsage(propName: string): string {
  return COLOR_TOKEN_USAGE_SNIPPET.replaceAll('<prop>', propName)
}

// ════════════════════════════════════════════════════════════════════
// 长度属性通用单位方法 / 数学函数片段
// ════════════════════════════════════════════════════════════════════

export function lengthUnitsSnippet(propName: string): string {
  return `### 长度单位

zui Chain 提供单位方法简写：

\`\`\`ts
s.${propName}.px(200)         ≡ s.${propName}('200px')
s.${propName}.rem(1.5)        ≡ s.${propName}('1.5rem')
s.${propName}.em(2)           ≡ s.${propName}('2em')      // 当前元素 font-size 的倍数
s.${propName}.vw(50)          ≡ s.${propName}('50vw')     // 视口宽 1%
s.${propName}.dvw(50)         ≡ s.${propName}('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
s.${propName}.cqw(50)         ≡ s.${propName}('50cqw')    // container query 容器尺寸
s.${propName}.percent(50)     ≡ s.${propName}('50%')
\`\`\`

### 数学函数

\`\`\`ts
s.${propName}('calc(100% - 32px)')
s.${propName}('min(100%, 1200px)')
s.${propName}('max(280px, 50%)')
s.${propName}('clamp(280px, 50%, 1200px)')
\`\`\``
}

// ════════════════════════════════════════════════════════════════════
// PropertyDocZh 文件级 satisfies 类型（每个分组文件 default export 时用）
// ════════════════════════════════════════════════════════════════════

/** 一组属性的中文文档（Record<propName, PropertyDocZh>）。 */
export type DocsGroup = Record<string, PropertyDocZh>
