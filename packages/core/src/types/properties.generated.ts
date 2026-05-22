// 此文件由 scripts/generate-properties.mjs 自动生成，请勿手动编辑。
// 来源：csstype Properties + src/chain/enhanced-props.ts (ENHANCED_PROPS)。
// 修改方式：改 ENHANCED_PROPS 或升级 csstype，然后 `node scripts/generate-properties.mjs`。

import type * as csstype from 'csstype'
import type { ThemeSchema } from '../theme/types'
import type {
  ColorPropCarrier,
  GlobalKw,
  PropCarrier,
  PropFn,
  AngleUnits,
  LengthUnits,
  TimeUnits,
} from './carrier'
import type {
  AspectRatioTokens,
  BordersTokens,
  ColorTokens,
  CursorTokens,
  DurationTokens,
  EasingTokens,
  FontSizeTokens,
  FontWeightTokens,
  FontsTokens,
  LetterSpacingTokens,
  LineHeightTokens,
  OpacityTokens,
  RadiusTokens,
  ShadowTokens,
  SizeTokens,
  SpacingTokens,
  TransitionPropertyTokens,
  ZIndexTokens,
} from './tokens'

/**
 * 取某个 CSS 属性的 csstype 值类型（剥掉 undefined）。
 *
 * 用 `Properties<string | number, string | number>` 让 length / time 等数值属性同时接受数字
 * （emotion 收到数字会自动加 px / ms）。
 */
type CssValueOf<K extends keyof csstype.Properties> = NonNullable<csstype.Properties<string | number, string | number>[K]>

/**
 * # zui CSS 属性值通用指南（中文）
 *
 * 本文件由 generator 生成。下方 §1-§7 是**所有属性共享的基础知识**，
 * 看完后每个属性的 JSDoc 只需关注它特有的部分。
 *
 * - §1 全局关键字（所有属性都能用）
 * - §2 颜色值 `<color>`
 * - §3 长度值 `<length>` / 单位方法
 * - §4 百分比 `<percentage>` 的参照基准
 * - §5 角度 `<angle>` / 时间 `<time>`
 * - §6 "跟随父级 / 自动 / 默认"机制关键字
 * - §7 zui Chain 四态调用约定
 *
 * ----------------------------------------------------------------------
 *
 * ## §1 全局关键字 GlobalKw（所有属性都接受）
 *
 * | 关键字 | 行为 |
 * | --- | --- |
 * | `inherit` | 强制继承父元素该属性的**计算值**。继承属性（color/font）默认就继承，对非继承属性（border/width）才有意义 |
 * | `initial` | 重置为该属性 CSS spec 定义的**初始值**（不同属性不同，如 `color` 的 initial 是 `canvastext`） |
 * | `unset` | 继承属性 → 等同 `inherit`；非继承属性 → 等同 `initial` |
 * | `revert` | 回到**浏览器默认样式表**（user-agent stylesheet）的值。比 `initial` 更接近"原始浏览器样子" |
 * | `revertLayer` | 回到上一个 CSS `@layer` 中该属性的值 |
 *
 * 链式调用：`s.color.inherit` / `s.padding.initial` / `s.fontSize.unset`。
 *
 * ----------------------------------------------------------------------
 *
 * ## §2 颜色值 `<color>`
 *
 * 所有颜色属性（`color` / `backgroundColor` / `borderColor` / `caretColor` / `outlineColor` / `fill` 等）
 * 都接受相同形式的颜色值。
 *
 * ### §2.1 函数态可接受形式
 *
 * | 形式 | 示例 | 说明 |
 * | --- | --- | --- |
 * | 十六进制 | `'#f80'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
 * | `rgb()` | `'rgb(255 128 0 / 0.8)'` | 现代空格语法（旧逗号语法兼容） |
 * | `hsl()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
 * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS 4） |
 * | `lab()` `lch()` | `'lab(60% 40 30)'` | 感知均匀色彩（CSS 4） |
 * | `oklab()` `oklch()` | `'oklch(0.7 0.15 30)'` | 推荐，渐变插值最稳（CSS 4） |
 * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020 |
 * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS 5） |
 *
 * ### §2.2 4 个通用颜色关键字
 *
 * | 关键字 | 等价 | 用途 |
 * | --- | --- | --- |
 * | `white` | `#FFFFFF` | 纯白 |
 * | `black` | `#000000` | 纯黑 |
 * | `transparent` | `rgba(0,0,0,0)` | 完全透明。用于渐变端点比 `rgba(0,0,0,0)` 更稳 |
 * | `currentColor` | 引用当前元素 `color` | **"跟随文字色"最常用关键字** |
 *
 * ### §2.3 146 个 CSS 命名色
 *
 * 颜色属性的 JSDoc 会附详细的分组色名表（中性 / 红 / 粉 / 橙 / 黄 / 棕 / 绿 / 青 / 蓝 / 紫，按色相组织）。
 *
 * ### §2.4 zui 主题 token 写法
 *
 * ```ts
 * s.color._primary                    // 主题主色（跟随 ZConfigProvider light/dark 切换）
 * s.color._textPrimary                // 语义化文本主色
 * s.color._red500                     // Palette token（tailwind 50–950 阶）
 * s.color._primary.alpha(0.6)         // token + 修饰链
 * s.color._primary.darken(0.1)
 * s.color._primary.complement         // 互补色（色相 +180°）
 * ```
 *
 * **核心规则**：加 `_` 走 token，不加走 CSS 关键字。
 *
 * ----------------------------------------------------------------------
 *
 * ## §3 长度值 `<length>`
 *
 * 所有长度属性（`width` / `height` / `padding*` / `margin*` / `top` / `fontSize` / `borderWidth` ...）都接受这些单位。
 *
 * zui Chain 上有 `.px()` / `.em()` / `.rem()` / `.vw()` 等单位方法，等价于"字符串+单位"：
 *
 * ```ts
 * s.width.px(200)      ≡ s.width('200px')
 * s.padding.rem(1.5)   ≡ s.padding('1.5rem')
 * ```
 *
 * ### §3.1 单位分类
 *
 * | 类别 | 单位 | 1 单位 = ? | 用例 |
 * | --- | --- | --- | --- |
 * | **绝对** | `px` | 1 CSS 像素 | 精确控制 |
 * | | `pt` `cm` `mm` `in` `pc` `Q` | 物理单位 | 打印 |
 * | **字体相对** | `em` | 当前元素 `font-size` 的倍数 | **跟随当前字号**缩放 |
 * | | `rem` | **根元素** `<html>` `font-size` 的倍数 | **全站统一缩放点** |
 * | | `ex` | 当前字体小写 x 高度 | 罕用 |
 * | | `ch` | 当前字体 "0" 字符宽 | 限制等宽行宽 |
 * | | `cap` | 大写字母高度（新） | |
 * | | `ic` | 表意文字宽度（CJK） | |
 * | | `lh` | 当前元素 `line-height` | 精确对齐行高 |
 * | | `rlh` | 根元素 `line-height` | |
 * | **视口相对** | `vw` `vh` | 视口宽 / 高 的 1% | 全屏区块 |
 * | | `vmin` `vmax` | 视口短边 / 长边 1% | 横竖屏自适应 |
 * | | `svw` `svh` | **小**视口（移动浏览器折叠 UI 时） | 移动适配 |
 * | | `lvw` `lvh` | **大**视口（移动浏览器全展开时） | |
 * | | `dvw` `dvh` | **动态**视口（随 UI 折叠变） | 移动 `100vh` 顶替方案 |
 * | **容器相对** | `cqw` `cqh` `cqi` `cqb` `cqmin` `cqmax` | container query 容器尺寸 1% | 组件级响应式 |
 * | **百分比** | `%` | 见 §4 | 不同属性参照不同 |
 *
 * ### §3.2 数学函数
 *
 * ```ts
 * s.width('calc(100% - 32px)')               // 加减乘除
 * s.width('min(100%, 1200px)')                // 取小
 * s.width('max(280px, 50%)')                  // 取大
 * s.fontSize('clamp(14px, 2vw, 18px)')        // 限制在区间（响应式字号利器）
 * ```
 *
 * ### §3.3 数字 0
 *
 * length 上下文写 `0` **不需要单位**：`s.margin(0)` ≡ `s.margin('0px')`。
 *
 * ----------------------------------------------------------------------
 *
 * ## §4 百分比 `<percentage>` 的参照基准
 *
 * ⚠️ **CSS 学习者最常困惑的点**：百分比的"100% 等于什么"**取决于所在属性**，不是统一规则。
 *
 * | 属性 | 100% 参照 |
 * | --- | --- |
 * | `width` `min-width` `max-width` `inset-inline-*` `left` `right` | 父元素 **content-box 宽度** |
 * | `height` `min-height` `max-height` `top` `bottom` | 父元素 content-box **高度**（且**父高度需明确**才生效） |
 * | `margin*` `padding*` | 父元素 **content-box 宽度**（即使是 `marginTop`/`paddingTop` 也参照**宽**！） |
 * | `font-size` | 父元素 `font-size` |
 * | `line-height` | 当前元素 `font-size` |
 * | `background-position` | (容器尺寸 - 自身尺寸) 的差值 |
 * | `background-size` | 容器对应轴尺寸 |
 * | `transform: translate()` `transform-origin` | **元素自身**对应尺寸 |
 * | `border-radius` | 元素自身对应轴尺寸 |
 *
 * ----------------------------------------------------------------------
 *
 * ## §5 角度 `<angle>` / 时间 `<time>`
 *
 * ### 角度
 * | 单位 | 1 单位 = ? |
 * | --- | --- |
 * | `deg` | 1 度，360deg 一圈 |
 * | `rad` | 弧度，2π rad 一圈 |
 * | `grad` | 百分度，400grad 一圈 |
 * | `turn` | 圈，1turn = 360deg |
 *
 * ### 时间
 * | 单位 | 1 单位 = ? |
 * | --- | --- |
 * | `s` | 1 秒 |
 * | `ms` | 1 毫秒（1s = 1000ms） |
 *
 * ```ts
 * s.animationDuration.s(0.3)    ≡ s.animationDuration('0.3s')
 * s.transitionDuration.ms(300)  ≡ s.transitionDuration('300ms')
 * ```
 *
 * ----------------------------------------------------------------------
 *
 * ## §6 "跟随父级 / 自动 / 默认"机制关键字
 *
 * 这一类关键字让 CSS 学习者最困惑，因为含义**取决于上下文**。
 *
 * ### `auto` —— 浏览器自动算（不同属性算法不同）
 * | 属性 | `auto` 含义 |
 * | --- | --- |
 * | `width` `height` | 内容驱动；block 元素 `width: auto` = 撑满父容器，inline / flex item = 内容宽 |
 * | `margin: 0 auto` | 水平居中（左右自动分配剩余空间） |
 * | `overflow` | 内容溢出才显示滚动条 |
 * | `cursor` | 浏览器按上下文选光标 |
 * | `flex-basis` | 等于元素 `width`（或 `height`，看 flex 方向） |
 * | `grid-auto-columns/rows` | 内容驱动轨道大小 |
 * | `inset` / `top` / `left` | 不参与定位（默认） |
 *
 * ### `inherit` —— 显式继承父
 * 拷贝父元素该属性的**计算值**。继承属性（color/font）默认就继承，对非继承属性（border/background/width）才显式生效。
 *
 * ### `currentColor` —— 跟随当前 `color`
 * 引用当前元素 `color`。让 `border-color` / `outline-color` / svg `fill` / `stroke` / `caret-color` 等跟随文字色变。
 *
 * ### `min-content` / `max-content` / `fit-content` —— 内容驱动尺寸
 * | 关键字 | 行为 |
 * | --- | --- |
 * | `min-content` | **最小内容宽**（再窄就溢出，等于最长单词 / 不可断处长度） |
 * | `max-content` | **最大内容宽**（理想宽度，等同无约束时 `width: auto`） |
 * | `fit-content` | `min(max-content, max(min-content, 可用宽度))` —— 跟内容长但不超容器 |
 *
 * 用例：Tag / Toast 宽度跟随文字、表格列宽自适应。
 *
 * ### `none` —— 关闭某种效果
 * | 属性 | `none` 含义 |
 * | --- | --- |
 * | `display` | 元素及子元素不渲染（不占空间） |
 * | `border-style` | 无边框 |
 * | `text-decoration` | 无下划线/删除线 |
 * | `pointer-events` | 不响应鼠标（事件穿透） |
 * | `outline` | 无外轮廓（⚠️慎用，影响键盘可访问性） |
 * | `list-style` | 列表无标记 |
 * | `box-shadow` `filter` `transform` | 无效果 |
 *
 * ### `normal` —— "默认行为"（不同属性含义不同）
 * | 属性 | `normal` 含义 |
 * | --- | --- |
 * | `font-style` | 正体（非 italic） |
 * | `font-weight` | 400 |
 * | `line-height` | 浏览器默认（一般 1.2 左右） |
 * | `letter-spacing` `word-spacing` | 字符/单词默认间距 |
 * | `white-space` | 默认空白处理（多空格合并） |
 * | `align-items` / `justify-content` | 触发新规范行为（flex 容器=`stretch`/`flex-start`） |
 *
 * ### `stretch` / `baseline`
 * flex / grid 容器子项的对齐：`stretch` 撑满交叉轴；`baseline` 沿文字基线对齐（不同字号子项也能整齐）。
 *
 * ----------------------------------------------------------------------
 *
 * ## §7 zui Chain 四态调用约定
 *
 * 每个 ENHANCED_PROPS 属性都支持以下 4 种调用：
 *
 * ```ts
 * // 1) 函数态 —— 直接传任意 CSS 值
 * s.color('#ff0080')
 *
 * // 2) token 态 —— 加 `_` 前缀，从主题 schema 查值（自动跟随主题）
 * s.color._primary
 * s.padding._lg
 *
 * // 3) keyword 态 —— 不加 `_`，CSS 关键字 / 命名色
 * s.color.transparent
 * s.display.flex
 * s.width.auto
 *
 * // 4) 单位方法 —— length / time / angle 属性的单位简写
 * s.width.px(200)        ≡ s.width('200px')
 * s.fontSize.rem(1.2)
 * s.animationDuration.ms(300)
 * ```
 *
 * **非 ENHANCED_PROPS**（如 `transform` / `filter` / `clipPath` / `gridTemplateColumns` 等复杂语法属性）
 * 只有函数态 + GlobalKw 关键字（`inherit` / `initial` / `unset` / `revert` / `revertLayer`）。
 */
export interface IcxPropMethods<T extends ThemeSchema> {
  /**
   * 设置**原生表单控件**（checkbox / radio / range slider / progress bar）的强调色。让 `<input type="checkbox">` 等不用自定义 CSS 即可染色。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白 |
   * | `black` | `#000000` | 纯黑 |
   * | `transparent` | `rgba(0,0,0,0)` | 透明（罕用） |
   * | `currentColor` | 引用 `color` | 表单强调色跟随文字色 |
   *
   * ### 此属性特有
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器使用平台原生强调色（macOS 蓝、Windows 蓝） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `accentColor`。⚠️ `accentColor` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `accentColor` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `accentColor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `accentColor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```html
   * <input type="checkbox" :style="{ accentColor: theme.color._primary }" />
   * ```
   *
   * ```ts
   * s.accentColor._primary     // 全站表单控件用品牌色
   * ```
   *
   * 适用控件：`<input type="checkbox"|"radio"|"range">` / `<progress>`。
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.accentColor._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.accentColor._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.accentColor._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.accentColor._primary.alpha(0.6)         // token + 修饰链
   * s.accentColor._primary.darken(0.1)
   * s.accentColor._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.accentColor._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.accentColor.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 浏览器支持
   *
   * CSS Color 4 新属性，Chrome 93+ / Firefox 92+ / Safari 15.4+ 支持。旧浏览器自动忽略，回退到平台原生色。
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | `auto` | — | 默认；平台原生强调色 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **93** | **92**  | **15.4** | **93** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/accent-color
   */
  accentColor: ColorPropCarrier<CssValueOf<'accentColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
   * flex / grid 容器**交叉轴方向**上**多行内容**之间的对齐方式。**仅在 `flexWrap: wrap/wrapReverse`（多行）或 grid 多行时生效**。
   *
   * ## 关键字
   *
   * ### 11 个对齐 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。等同 `stretch` 在 flex 容器中 |
   * | `stretch` | 多行**撑满**交叉轴方向（每行平分剩余空间） |
   * | `flexStart` | 多行挤到交叉轴**起点** |
   * | `flexEnd` | 挤到交叉轴**终点** |
   * | `center` | 多行整体**居中** |
   * | `baseline` | 按基线对齐（罕用） |
   * | `start` | 逻辑起点 |
   * | `end` | 逻辑终点 |
   * | `spaceBetween` | 首尾贴边，其余间距均分 |
   * | `spaceAround` | 每行两侧距离相等 |
   * | `spaceEvenly` | 所有间距相等 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `alignContent`。⚠️ `alignContent` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `alignContent` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `alignContent` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `alignContent` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### alignItems vs alignContent 区别
   *
   * | 属性 | 控制对象 | 生效条件 |
   * | --- | --- | --- |
   * | `alignItems` | **单行内**子元素的对齐 | 任何 flex/grid |
   * | `alignContent` | **多行**之间的对齐 | 必须多行（flex 需 wrap 或 grid 多行） |
   *
   * ### 用例
   *
   * ```ts
   * // 多行 grid 整体居中
   * s.display.grid
   * s.gridTemplateColumns('repeat(3, 1fr)')
   * s.alignContent.center
   *
   * // flex 多行内容均匀分布
   * s.display.flex
   * s.flexWrap.wrap
   * s.alignContent.spaceBetween
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 基础对齐 | `stretch` ｜ `flexStart` ｜ `flexEnd` ｜ `center` ｜ `start` ｜ `end` ｜ `baseline` ｜ `normal` | 只接受关键字 |
   * | 分布对齐 | `spaceBetween` ｜ `spaceAround` ｜ `spaceEvenly` | 间距分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :------: | :-----: | :-----: | :----: | :----: |
   * |  **29**  | **28**  |  **9**  | **12** | **11** |
   * | 21 _-x-_ |         | 7 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/align-content
   */
  alignContent: PropCarrier<CssValueOf<'alignContent'>, never, 'flexStart' | 'flexEnd' | 'center' | 'baseline' | 'stretch' | 'normal' | 'start' | 'end' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly' | GlobalKw, unknown, never>
  /**
   * flex / grid 容器**交叉轴方向**上**所有子元素**的对齐方式（flex row 时控制垂直对齐）。
   *
   * ## 关键字
   *
   * ### 8 个对齐 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `stretch` | **默认值**。子元素在交叉轴方向**撑满容器**（前提：未设交叉轴尺寸） |
   * | `flexStart` | 子元素挤到交叉轴**起点** |
   * | `flexEnd` | 挤到交叉轴**终点** |
   * | `center` | 交叉轴**居中**（垂直居中神器） |
   * | `baseline` | 子元素沿**文字基线**对齐 —— 不同字号子元素也能整齐排列（不同字体 line-height 不同时尤其有用） |
   * | `start` | 逻辑起点（对 flex/grid 通用） |
   * | `end` | 逻辑终点 |
   * | `normal` | 行为同 `stretch` |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `alignItems`。⚠️ `alignItems` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `alignItems` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `alignItems` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `alignItems` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 经典：完美居中
   *
   * ```ts
   * s.display.flex
   *   .justifyContent.center
   *   .alignItems.center
   * // 横纵都居中
   * ```
   *
   * ### baseline 神器
   *
   * 不同字号 / 字体的子元素，用 `baseline` 比 `center` 更整齐：
   *
   * ```ts
   * s.display.flex
   * s.alignItems.baseline
   * // <span>大</span> <small>小</small>
   * // 大字和小字按 baseline 对齐，视觉更稳
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 8 个对齐 keyword | `stretch` ｜ `flexStart` ｜ `flexEnd` ｜ `center` ｜ `baseline` ｜ `start` ｜ `end` ｜ `normal` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :------: | :-----: | :-----: | :----: | :----: |
   * |  **29**  | **20**  |  **9**  | **12** | **11** |
   * | 21 _-x-_ |         | 7 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/align-items
   */
  alignItems: PropCarrier<CssValueOf<'alignItems'>, never, 'flexStart' | 'flexEnd' | 'center' | 'baseline' | 'stretch' | 'normal' | 'start' | 'end' | GlobalKw, unknown, never>
  /**
   * flex / grid **子元素**在交叉轴方向上的对齐方式（覆盖父的 `alignItems`）。可让单个子元素与其他兄弟对齐方式不同。
   *
   * ## 关键字
   *
   * ### 8 个对齐 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `stretch` | **默认值**。子元素在交叉轴方向**撑满容器**（前提：未设交叉轴尺寸） |
   * | `flexStart` | 子元素挤到交叉轴**起点** |
   * | `flexEnd` | 挤到交叉轴**终点** |
   * | `center` | 交叉轴**居中**（垂直居中神器） |
   * | `baseline` | 子元素沿**文字基线**对齐 —— 不同字号子元素也能整齐排列（不同字体 line-height 不同时尤其有用） |
   * | `start` | 逻辑起点（对 flex/grid 通用） |
   * | `end` | 逻辑终点 |
   * | `normal` | 行为同 `stretch` |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `alignSelf`。⚠️ `alignSelf` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `alignSelf` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `alignSelf` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `alignSelf` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 经典：完美居中
   *
   * ```ts
   * s.display.flex
   *   .justifyContent.center
   *   .alignItems.center
   * // 横纵都居中
   * ```
   *
   * ### baseline 神器
   *
   * 不同字号 / 字体的子元素，用 `baseline` 比 `center` 更整齐：
   *
   * ```ts
   * s.display.flex
   * s.alignItems.baseline
   * // <span>大</span> <small>小</small>
   * // 大字和小字按 baseline 对齐，视觉更稳
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 9 个对齐 keyword | `auto` ｜ `stretch` ｜ `flexStart` ｜ `flexEnd` ｜ `center` ｜ `baseline` ｜ `start` ｜ `end` ｜ `normal` | `auto` = 继承父的 alignItems |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :------: | :-----: | :-----: | :----: | :----: |
   * |  **29**  | **20**  |  **9**  | **12** | **10** |
   * | 21 _-x-_ |         | 7 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/align-self
   */
  alignSelf: PropCarrier<CssValueOf<'alignSelf'>, never, 'flexStart' | 'flexEnd' | 'center' | 'baseline' | 'stretch' | 'normal' | 'start' | 'end' | 'auto' | GlobalKw, unknown, never>
  /**
     * **Syntax**: `[ normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position> ]#`
     *
     * **Initial value**: `normal`
     */
  alignTracks: PropFn<CssValueOf<'alignTracks'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `baseline | alphabetic | ideographic | middle | central | mathematical | text-before-edge | text-after-edge`
     *
     * **Initial value**: `baseline`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **1**  |   No    | **5.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/alignment-baseline
     */
  alignmentBaseline: PropFn<CssValueOf<'alignmentBaseline'>>
  /**
   * 给元素**命名为锚点** —— 让其他绝对定位的元素可以**相对此锚点定位**（CSS Anchor Positioning，实验性）。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不作为锚点 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `anchorName`。⚠️ `anchorName` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `anchorName` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `anchorName` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `anchorName` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：tooltip 跟随按钮
   *
   * ```ts
   * // 按钮（锚点）
   * s.anchorName('--my-btn')
   *
   * // tooltip（被锚定，绝对定位）
   * s.positionAnchor('--my-btn')
   *   .position.absolute.top('anchor(bottom)')        // 锚点底部
   * ```
   *
   * ⚠️ **实验性**：仅 Chrome 125+ 支持。其他浏览器需 JS / popper 方案兜底。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<dashed-ident>` | `'--my-anchor'` | 必须以 `--` 开头的标识符 |
   * | `none` | — | 默认 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
   * | :-----: | :---------: | :----: | :-----: | :-: |
   * | **125** | **preview** | **26** | **125** | No  |
   *
   * CSS Anchor Positioning（实验性），Chrome 125+。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/anchor-name
   */
  anchorName: PropCarrier<CssValueOf<'anchorName'>, never, 'none' | GlobalKw, unknown, never>
  /**
     * **Syntax**: `none | all | <dashed-ident>#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
     * | :-----: | :---------: | :----: | :-----: | :-: |
     * | **131** | **preview** | **26** | **131** | No  |
     */
  anchorScope: PropFn<CssValueOf<'anchorScope'>>
  /**
     * Since July 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<single-animation-composition>#`
     *
     * **Initial value**: `replace`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **112** | **115** | **16** | **112** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-composition
     */
  animationComposition: PropFn<CssValueOf<'animationComposition'>>
  /**
   * 设置 `@keyframes` 动画**开始前的延迟**。可负值（让动画从中间状态开始）。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受 `<time>`（`s` 或 `ms`），可正可负，**无关键字**` —— undefined
   * - `负值 = 过渡"跳过"前 N 时间，直接从该时刻继续` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `animationDelay`。⚠️ `animationDelay` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0s` |
   * | `unset` | `animationDelay` 非继承属性 → 等同 `initial`（= `0s`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `animationDelay` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `animationDelay` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.transition('opacity 300ms')
   * s.transitionDelay.ms(100)     // 等 100ms 才开始
   *
   * // 错峰动画
   * // child1: transitionDelay 0ms
   * // child2: transitionDelay 100ms
   * // child3: transitionDelay 200ms
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<time>` | `'100ms'` `'-200ms'` | 可正可负 |
   * | 多个值 | `'0ms, 100ms, 200ms'` | 逗号分隔 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0s`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **43**  | **16**  |  **9**  | **12** | **10** |
   * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-delay
   */
  animationDelay: PropCarrier<CssValueOf<'animationDelay'>, DurationTokens<T>, GlobalKw, TimeUnits, never>
  /**
   * 设置动画**播放方向** —— 正向、反向、交替（来回）。
   *
   * ## 关键字
   *
   * ### 4 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。从 0% 到 100% 正向播放 |
   * | `reverse` | 从 100% 到 0% **反向**播放 |
   * | `alternate` | **交替播放**：第 1 次正向，第 2 次反向，第 3 次正向...（来回往复，最常用于"呼吸"动画） |
   * | `alternateReverse` | 交替播放，但**首次反向** |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `animationDirection`。⚠️ `animationDirection` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `animationDirection` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `animationDirection` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `animationDirection` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 心跳呼吸动画
   * s.animationName('pulse')
   *   .animationIterationCount.infinite
   *   .animationDirection.alternate    // 来回缩放
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 4 个 keyword | `normal` ｜ `reverse` ｜ `alternate` ｜ `alternateReverse` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **43**  | **16**  |  **9**  | **12** | **10** |
   * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-direction
   */
  animationDirection: PropCarrier<CssValueOf<'animationDirection'>, never, 'normal' | 'reverse' | 'alternate' | 'alternateReverse' | GlobalKw, unknown, never>
  /**
   * 设置 `@keyframes` **动画的持续时间**。0 表示动画立即跳到终态。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受 `<time>`（`s` 或 `ms`），**无关键字**（除全局关键字）` —— undefined
   * - `多个值用逗号分隔，对应多个属性（与 `transitionProperty` 顺序一致）` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `animationDuration`。⚠️ `animationDuration` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0s` |
   * | `unset` | `animationDuration` 非继承属性 → 等同 `initial`（= `0s`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `animationDuration` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `animationDuration` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.transitionDuration.ms(300)             // 300 毫秒
   * s.transitionDuration.s(0.5)              // 0.5 秒
   * s.transitionDuration('300ms, 500ms')     // 多属性各自时长（与 transitionProperty 对应）
   * ```
   *
   * ### 常用时长参考
   *
   * | 场景 | 推荐时长 |
   * | --- | --- |
   * | 微交互（hover、focus） | 150-200ms |
   * | 中等交互（modal 弹出） | 200-300ms |
   * | 大动画（页面切换） | 300-500ms |
   * | 注意力 / 强调 | 500ms+ |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<time>` | `'300ms'` `'0.3s'` | 具体时长 |
   * | 多个值 | `'300ms, 500ms'` | 逗号分隔，与 transitionProperty 对应 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0s`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **43**  | **16**  |  **9**  | **12** | **10** |
   * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-duration
   */
  animationDuration: PropCarrier<CssValueOf<'animationDuration'>, DurationTokens<T>, GlobalKw, TimeUnits, never>
  /**
   * 决定动画**结束后**（以及开始前延迟期间）元素保留**哪个状态** —— 起始 / 终止 / 双向 / 都不保留。
   *
   * ## 关键字
   *
   * ### 4 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。动画结束后**回到元素原本样式**（动画的样式不保留） |
   * | `forwards` | 动画结束后**保持最后一帧（100%）**的样式（最常用 —— 进入动画后保持终态） |
   * | `backwards` | 动画**开始前的延迟期间**就应用第一帧（0%）的样式（避免延迟期间的闪烁） |
   * | `both` | 同时启用 `forwards` 和 `backwards` |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `animationFillMode`。⚠️ `animationFillMode` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `animationFillMode` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `animationFillMode` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `animationFillMode` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 元素 fade-in 后保持完全显示
   * s.animationName('fadeIn')
   *   .animationDuration.ms(300)
   *   .animationFillMode.forwards    // 不写的话动画结束会回到初始 opacity:1，但若 fadeIn 从 0→1，初始可能就是 1，最关键的是用 forwards 让进入动画的"中间状态"得以保留
   *
   * // 延迟 200ms 才开始动画，但希望延迟期间元素已是 0% 状态
   * s.animationDelay.ms(200)
   * s.animationFillMode.backwards
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 4 个 keyword | `none` ｜ `forwards` ｜ `backwards` ｜ `both` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **43**  | **16**  |  **9**  | **12** | **10** |
   * | 3 _-x-_ | 5 _-x-_ | 5 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-fill-mode
   */
  animationFillMode: PropCarrier<CssValueOf<'animationFillMode'>, never, 'none' | 'forwards' | 'backwards' | 'both' | GlobalKw, unknown, never>
  /**
   * 设置动画**循环次数**。可为整数、小数（不完整循环）、或 `infinite`（无限循环）。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `infinite` | **无限循环**（loading 旋转、心跳等场景） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `animationIterationCount`。⚠️ `animationIterationCount` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `1` |
   * | `unset` | `animationIterationCount` 非继承属性 → 等同 `initial`（= `1`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `animationIterationCount` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `animationIterationCount` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.animationIterationCount(1)         // **默认值**。只播一次
   * s.animationIterationCount(3)         // 播 3 次
   * s.animationIterationCount('2.5')     // 播 2.5 次（最后一次只播一半）
   * s.animationIterationCount.infinite   // 无限循环
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 数字 | `1` `3` `2.5` | 循环次数（可小数） |
   * | `infinite` | — | 无限循环 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `1`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **43**  | **16**  |  **9**  | **12** | **10** |
   * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-iteration-count
   */
  animationIterationCount: PropCarrier<CssValueOf<'animationIterationCount'>, never, 'infinite' | GlobalKw, unknown, never>
  /**
   * 指定使用的 `@keyframes` **关键帧动画名称**。多个动画用逗号分隔，同时播放。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不使用动画 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `animationName`。⚠️ `animationName` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `animationName` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `animationName` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `animationName` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 先定义 @keyframes
   * const spinKeyframes = ikeyframes`
   *   from { transform: rotate(0deg); }
   *   to { transform: rotate(360deg); }
   * `
   *
   * // 使用
   * s.animationName(spinKeyframes)
   *   .animationDuration.s(1)
   *   .animationIterationCount.infinite
   *   .animationTimingFunction.linear
   *
   * // 多个动画同时播
   * s.animationName('fadeIn, slideUp')
   *   .animationDuration('300ms, 400ms')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<custom-ident>` | `'fadeIn'` `'spin'` | @keyframes 名称（kebab-case 或 camelCase） |
   * | 多个动画 | `'fadeIn, slideUp'` | 逗号分隔，同时播放 |
   * | `none` | — | 不使用动画 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **43**  | **16**  |  **9**  | **12** | **10** |
   * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-name
   */
  animationName: PropCarrier<CssValueOf<'animationName'>, never, 'none' | GlobalKw, unknown, never>
  /**
   * 控制动画**播放 / 暂停**状态。可用于 JS 控制动画暂停。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `running` | **默认值**。正在播放 |
   * | `paused` | **暂停**（保持当前帧不动） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `animationPlayState`。⚠️ `animationPlayState` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `running` |
   * | `unset` | `animationPlayState` 非继承属性 → 等同 `initial`（= `running`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `animationPlayState` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `animationPlayState` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // hover 时暂停动画
   * s.animationName('spin')
   * s.animationDuration.s(2)
   * s.animationIterationCount.infinite
   * // :hover 选择器或 hover 状态下：
   * //   s.animationPlayState.paused
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `running` ｜ `paused` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `running`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **43**  | **16**  |  **9**  | **12** | **10** |
   * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-play-state
   */
  animationPlayState: PropCarrier<CssValueOf<'animationPlayState'>, never, 'running' | 'paused' | GlobalKw, unknown, never>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ normal | <length-percentage> | <timeline-range-name> <length-percentage>? ]#`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-range-end
     */
  animationRangeEnd: PropFn<CssValueOf<'animationRangeEnd'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ normal | <length-percentage> | <timeline-range-name> <length-percentage>? ]#`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-range-start
     */
  animationRangeStart: PropFn<CssValueOf<'animationRangeStart'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<single-animation-timeline>#`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-timeline
     */
  animationTimeline: PropFn<CssValueOf<'animationTimeline'>>
  /**
   * 设置 `@keyframes` 动画的**速率曲线**。规则同 `transitionTimingFunction`，但作用于关键帧动画。
   *
   * ## 关键字
   *
   * ### 7 个标准缓动关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `linear` | 匀速（无加速 / 减速） |
   * | `ease` | **默认值**。慢-快-慢（CSS 默认，类似 ease-in-out 但开头更慢） |
   * | `easeIn` | 由慢到快（先慢加速） |
   * | `easeOut` | 由快到慢（先快减速，最常用 —— 进入动画首选） |
   * | `easeInOut` | 两端慢，中间快（自然来回） |
   * | `stepStart` | 瞬间跳到终态（在开始时刻立即完成） |
   * | `stepEnd` | 保持初态直到结束才瞬间跳到终态 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `animationTimingFunction`。⚠️ `animationTimingFunction` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `ease` |
   * | `unset` | `animationTimingFunction` 非继承属性 → 等同 `initial`（= `ease`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `animationTimingFunction` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `animationTimingFunction` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态：自定义曲线
   *
   * ```ts
   * // 三次贝塞尔曲线（4 个控制点 x1,y1,x2,y2）
   * s.transitionTimingFunction('cubic-bezier(0.4, 0, 0.2, 1)')      // Material Design 标准曲线
   *
   * // 阶梯函数
   * s.transitionTimingFunction('steps(5, end)')                     // 分 5 步执行
   * s.transitionTimingFunction('steps(10, jump-start)')             // 10 步，开始时立即跳一步
   * ```
   *
   * ### 选择建议
   *
   * - **进入动画**（fade-in、scale-in）：`easeOut`（先快后慢，自然停止）
   * - **退出动画**（fade-out、scale-out）：`easeIn`（先慢后快，加速离开）
   * - **来回 / 双向**（modal 弹出弹回）：`easeInOut`
   * - **匀速**（loading 旋转）：`linear`
   * - **打字机 / 像素跳变**：`steps(N)`
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 7 个标准 keyword | `linear` ｜ `ease` ｜ `easeIn` ｜ `easeOut` ｜ `easeInOut` ｜ `stepStart` ｜ `stepEnd` | 常用 |
   * | 贝塞尔曲线 | `'cubic-bezier(0.4, 0, 0.2, 1)'` | 4 个控制点 |
   * | 阶梯函数 | `'steps(5, end)'` | N 步 + 方向 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `ease`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **43**  | **16**  |  **9**  | **12** | **10** |
   * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-timing-function
   */
  animationTimingFunction: PropCarrier<CssValueOf<'animationTimingFunction'>, EasingTokens<T>, 'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'stepStart' | 'stepEnd' | GlobalKw, unknown, never>
  /**
   * 控制原生表单控件的**外观渲染** —— 用浏览器默认样式、平台原生样式、或完全去除让 CSS 接管。
   *
   * ## 关键字
   *
   * ### 4 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器按元素类型决定样式（如 `<select>` 显示下拉箭头） |
   * | `none` | **完全去除原生外观** —— 让 CSS 完全接管（最常用，定制按钮 / select 时） |
   * | `textfield` | 强制按 `<input type="text">` 渲染（让 `type="search"` 等显示文本框外观） |
   * | `menulistButton` | 强制按下拉按钮渲染 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `appearance`。⚠️ `appearance` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `appearance` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `appearance` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `appearance` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 经典用法
   *
   * ```ts
   * // 自定义 select 样式（去除浏览器默认箭头）
   * s.appearance.none
   *   .background("url('/icons/chevron.svg') no-repeat right 12px center")
   *   .paddingRight.px(32)
   *
   * // 自定义 checkbox（hide 原生勾选）
   * s.appearance.none
   * s.width.px(16)
   * s.height.px(16)
   * s.border('2px solid')
   * ```
   *
   * ### 前缀
   *
   * 旧浏览器需 `-webkit-appearance` / `-moz-appearance` 前缀。zui 链式调用会自动加。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 4 个 keyword | `auto` ｜ `none` ｜ `textfield` ｜ `menulistButton` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari  |   Edge   | IE  |
   * | :-----: | :-----: | :------: | :------: | :-: |
   * | **84**  | **80**  | **15.4** |  **84**  | No  |
   * | 1 _-x-_ | 1 _-x-_ | 3 _-x-_  | 12 _-x-_ |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/appearance
   */
  appearance: PropCarrier<CssValueOf<'appearance'>, never, 'none' | 'auto' | 'textfield' | 'menulistButton' | GlobalKw, unknown, never>
  /**
   * 设置元素的**宽高比**。只设了宽度时浏览器按比例自动算高度（反之亦然），无需手动维护两者同步。
   *
   * ## 关键字
   *
   * ### 1 个关键字
   *
   * | 关键字 | 效果 |
   * | --- | --- |
   * | `auto` | **默认值**。不设宽高比，宽高各自独立（普通盒子的默认行为）。如果同时设了 `auto` 和一个比例（如 `auto 16 / 9`），替换内容（如 `<img>`）使用其内在比例，非替换内容使用指定比例 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `aspectRatio`。⚠️ `aspectRatio` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `aspectRatio` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `aspectRatio` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `aspectRatio` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态可用形式
   *
   * ```ts
   * s.aspectRatio('16 / 9')     // 16:9 横屏（视频、横幅常用）
   * s.aspectRatio('1 / 1')      // 1:1 正方形（头像、图标常用）
   * s.aspectRatio('4 / 3')      // 4:3 传统屏
   * s.aspectRatio('1.618')      // 黄金比例
   * s.aspectRatio('auto')       // 不设比例（默认）
   * ```
   *
   * ### 搭配 width 使用
   *
   * 设了 `aspectRatio` 后，只需设一个轴的尺寸，另一个轴自动计算：
   *
   * ```ts
   * s.width('100%')
   * s.aspectRatio('16 / 9')
   * // 宽度撑满父容器，高度按 16:9 自动算出
   * ```
   *
   * ### 替代旧的 padding-top 技巧
   *
   * 旧写法（CSS 2 时代）：
   * ```ts
   * s.paddingTop('56.25%')   // 9/16 = 0.5625 = 56.25%（很难读）
   * ```
   * 新写法（CSS 3，现代浏览器全支持）：
   * ```ts
   * s.aspectRatio('16 / 9')  // 清晰易读
   * ```
   *
   * ### 与 min/max-height 配合
   *
   * `aspect-ratio` 指定的高度是**期望值**，仍受 `min-height` / `max-height` 约束：
   *
   * ```ts
   * s.width('100%')
   * s.aspectRatio('16 / 9')
   * s.maxHeight('80vh')
   * // 宽 100% 时按 16:9 算高，但不超过视口高度 80%
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `auto` | — | **默认值**；不设宽高比 |
   * | `<ratio>` | `'16 / 9'` `'1 / 1'` `'4 / 3'` | 分子 / 分母（注意分隔符两侧有空格） |
   * | `<number>` | `'1.618'` `'1'` | 等同 `<number> / 1` |
   * | `auto <ratio>` | `'auto 16 / 9'` | 替换内容用内在比例，非替换内容用指定比例 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **88** | **89**  | **15** | **88** | No  |
   *
   * Chrome 88+ / Firefox 89+ / Safari 15+ 全面支持（2021+）。旧浏览器需用 padding-top hack。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/aspect-ratio
   */
  aspectRatio: PropCarrier<CssValueOf<'aspectRatio'>, AspectRatioTokens<T>, 'auto' | GlobalKw, unknown, never>
  /**
   * 给元素**身后的内容**应用滤镜（毛玻璃、玻璃拟态最常用）。元素本身不变，但**透过它看到的下层**被滤镜处理。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无滤镜 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `backdropFilter`。⚠️ `backdropFilter` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `backdropFilter` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `backdropFilter` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `backdropFilter` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 经典：毛玻璃效果
   *
   * ```ts
   * s.backgroundColor('rgba(255,255,255,0.6)')         // 半透明白底
   *   .backdropFilter('blur(20px) saturate(1.5)')      // 后方模糊 + 增饱和
   * // 经典 macOS 风格毛玻璃
   * ```
   *
   * ### 性能 / 兼容性
   *
   * - Safari 早期需要 `-webkit-backdrop-filter` 前缀（现代版本已无需）
   * - Firefox 较晚支持（103+，且需用户开启 `layout.css.backdrop-filter.enabled`）
   * - **性能开销大** —— 每帧重新合成下层，移动端慎用大模糊半径
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | **默认值** |
   * | blur | `'blur(8px)'` | 高斯模糊 |
   * | brightness | `'brightness(1.2)'` | 亮度 |
   * | contrast | `'contrast(150%)'` | 对比度 |
   * | grayscale | `'grayscale(0.5)'` | 灰度 |
   * | sepia | `'sepia(80%)'` | 棕褐色调 |
   * | saturate | `'saturate(200%)'` | 饱和度 |
   * | hue-rotate | `'hue-rotate(90deg)'` | 色相旋转 |
   * | invert | `'invert(1)'` | 反色 |
   * | opacity | `'opacity(0.5)'` | 透明度 |
   * | drop-shadow | `'drop-shadow(0 2px 4px #0003)'` | 真实阴影 |
   * | SVG filter | `'url(#myFilter)'` | 引用 SVG 滤镜 |
   * | 链式叠加 | `'blur(2px) brightness(1.1)'` | 空格分隔多个函数 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  | IE  |
   * | :----: | :-----: | :-----: | :----: | :-: |
   * | **76** | **103** | **18**  | **79** | No  |
   * |        |         | 9 _-x-_ |        |     |
   *
   * Chrome 76 / Safari 9（需前缀至 18）/ Firefox 103+。移动端性能需评估。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/backdrop-filter
   */
  backdropFilter: PropCarrier<CssValueOf<'backdropFilter'>, never, 'none' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `visible | hidden`
     *
     * **Initial value**: `visible`
     *
     * |  Chrome  | Firefox  |  Safari   |  Edge  |   IE   |
     * | :------: | :------: | :-------: | :----: | :----: |
     * |  **36**  |  **16**  | **15.4**  | **12** | **10** |
     * | 12 _-x-_ | 10 _-x-_ | 5.1 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/backface-visibility
     */
  backfaceVisibility: PropFn<CssValueOf<'backfaceVisibility'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<attachment>#`
     *
     * **Initial value**: `scroll`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-attachment
     */
  backgroundAttachment: PropFn<CssValueOf<'backgroundAttachment'>>
  /**
   * 决定**多重背景**之间（或 background-image 与 background-color 之间）的**混合模式**。可叠加滤镜般的色彩效果。
   *
   * ## 关键字
   *
   * ### 16 种混合模式
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。无混合（上层完全覆盖下层） |
   * | `multiply` | **正片叠底**：颜色相乘 —— 整体变暗（白 = 无效，黑 = 全黑） |
   * | `screen` | **滤色**：取反相乘 —— 整体变亮（黑 = 无效，白 = 全白） |
   * | `overlay` | **叠加**：multiply + screen 组合，增强对比 |
   * | `darken` | **变暗**：每像素取两层中较深的色 |
   * | `lighten` | **变亮**：每像素取两层中较浅的色 |
   * | `colorDodge` | **颜色减淡**：基于上层降低对比度（高光更亮） |
   * | `colorBurn` | **颜色加深**：基于上层增加对比度（阴影更暗） |
   * | `hardLight` | **强光**：等同 overlay 但上下层调换 |
   * | `softLight` | **柔光**：变暗 / 变亮取决于上层（柔和叠加） |
   * | `difference` | **差值**：取两层颜色差的绝对值 |
   * | `exclusion` | **排除**：类似 difference 但对比度低 |
   * | `hue` | 保留下层亮度+饱和度，使用上层**色相** |
   * | `saturation` | 保留下层色相+亮度，使用上层**饱和度** |
   * | `color` | 保留下层亮度，使用上层**色相+饱和度** |
   * | `luminosity` | 保留下层色相+饱和度，使用上层**亮度** |
   * | `plusDarker` | 加性变暗（实验性，CSS Compositing 2） |
   * | `plusLighter` | 加性变亮（实验性，CSS Compositing 2） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `backgroundBlendMode`。⚠️ `backgroundBlendMode` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `backgroundBlendMode` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `backgroundBlendMode` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `backgroundBlendMode` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 给背景图加品牌色滤镜
   * s.backgroundImage("url('/hero.jpg')")
   *   .backgroundColor._primary
   *   .backgroundBlendMode.multiply         // 把品牌色乘进背景图
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 16 种混合 keyword | `normal` `multiply` `screen` `overlay` `darken` `lighten` `colorDodge` `colorBurn` `hardLight` `softLight` `difference` `exclusion` `hue` `saturation` `color` `luminosity` `plusDarker` `plusLighter` | 见上方关键字表 |
   * | 多个值（多背景层各一个） | `'multiply screen'` | 逗号分隔 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **35** | **30**  | **8**  | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-blend-mode
   */
  backgroundBlendMode: PropCarrier<CssValueOf<'backgroundBlendMode'>, never, 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'colorDodge' | 'colorBurn' | 'hardLight' | 'softLight' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | 'plusDarker' | 'plusLighter' | GlobalKw, unknown, never>
  /**
   * 决定背景（image 和 color）**绘制范围** —— border 内 / padding 内 / content 内 / 仅文字。
   *
   * ## 关键字
   *
   * ### 4 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `borderBox` | **默认值**。背景延伸到 border **外边缘**（包括 border 区） |
   * | `paddingBox` | 背景仅在 padding **外边缘**内（不包括 border 区） |
   * | `contentBox` | 背景仅在 content **外边缘**内（不包括 padding 和 border） |
   * | `text` | **背景仅显示在文字范围内**（霓虹字 / 渐变字效果）。需要配合 `color: transparent` |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `backgroundClip`。⚠️ `backgroundClip` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `borderBox` |
   * | `unset` | `backgroundClip` 非继承属性 → 等同 `initial`（= `borderBox`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `backgroundClip` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `backgroundClip` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 文字渐变（霓虹字效果）
   *
   * ```ts
   * s.backgroundImage('linear-gradient(45deg, #ff00ff, #00ffff)')
   *   .backgroundClip.text
   *   .color.transparent             // 让文字本身透明，露出背景渐变
   * ```
   *
   * ⚠️ 早期需要 `-webkit-background-clip: text` 前缀（现代浏览器均支持无前缀，但 Safari 仍推荐加前缀确保兼容）。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 4 个 keyword | `borderBox` ｜ `paddingBox` ｜ `contentBox` ｜ `text` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `borderBox`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |  IE   |
   * | :----: | :-----: | :-----: | :----: | :---: |
   * | **1**  |  **4**  |  **5**  | **12** | **9** |
   * |        |         | 3 _-x-_ |        |       |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-clip
   */
  backgroundClip: PropCarrier<CssValueOf<'backgroundClip'>, never, 'borderBox' | 'paddingBox' | 'contentBox' | 'text' | GlobalKw, unknown, never>
  /**
   * 设置元素的**背景色**。叠在 `background-image` 之下，常用作底色。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白 |
   * | `black` | `#000000` | 纯黑 |
   * | `transparent` | `rgba(0,0,0,0)` | **默认值**。完全透明，露出父背景 |
   * | `currentColor` | 引用当前 `color` | 让背景跟随文字色变（罕用） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `backgroundColor`。⚠️ `backgroundColor` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `transparent` |
   * | `unset` | `backgroundColor` 非继承属性 → 等同 `initial`（= `transparent`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `backgroundColor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `backgroundColor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * 背景色在 `background` 简写中可省略；与 `background-image` 共存时背景图叠在背景色之上。
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.backgroundColor._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.backgroundColor._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.backgroundColor._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.backgroundColor._primary.alpha(0.6)         // token + 修饰链
   * s.backgroundColor._primary.darken(0.1)
   * s.backgroundColor._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.backgroundColor._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.backgroundColor.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 常见陷阱
   *
   * - 默认 `transparent` 而不是 `white`（与传统认知不同）
   * - 与 `background-clip` 配合：`backgroundClip.text` 让背景色只在文字范围显示（霓虹字效果）
   * - 非继承属性 —— 子元素不会继承父背景色
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `transparent`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-color
   */
  backgroundColor: ColorPropCarrier<CssValueOf<'backgroundColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-image>#`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-image
     */
  backgroundImage: PropFn<CssValueOf<'backgroundImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<visual-box>#`
     *
     * **Initial value**: `padding-box`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **4**  | **3**  | **12** | **9** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-origin
     */
  backgroundOrigin: PropFn<CssValueOf<'backgroundOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2016.
     *
     * **Syntax**: `[ center | [ [ left | right | x-start | x-end ]? <length-percentage>? ]! ]#`
     *
     * **Initial value**: `0%`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  | **49**  | **1**  | **12** | **6** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-position-x
     */
  backgroundPositionX: PropFn<CssValueOf<'backgroundPositionX'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2016.
     *
     * **Syntax**: `[ center | [ [ top | bottom | y-start | y-end ]? <length-percentage>? ]! ]#`
     *
     * **Initial value**: `0%`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  | **49**  | **1**  | **12** | **6** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-position-y
     */
  backgroundPositionY: PropFn<CssValueOf<'backgroundPositionY'>>
  /**
   * 决定 `background-image` 在容器中**是否平铺**、如何平铺。
   *
   * ## 关键字
   *
   * ### 6 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `repeat` | **默认值**。两轴都**平铺**（可能在边缘有半个图） |
   * | `noRepeat` | **不平铺**，只显示一张 |
   * | `repeatX` | 仅水平方向平铺 |
   * | `repeatY` | 仅垂直方向平铺 |
   * | `round` | **整数次**平铺：缩放图片让边缘正好放下整数张（避免半张图） |
   * | `space` | **等距分布**：平铺整数次 + 在图之间留间距（不缩放图） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `backgroundRepeat`。⚠️ `backgroundRepeat` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `repeat` |
   * | `unset` | `backgroundRepeat` 非继承属性 → 等同 `initial`（= `repeat`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `backgroundRepeat` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `backgroundRepeat` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 两值简写
   *
   * 第 1 个 X 轴，第 2 个 Y 轴：
   *
   * ```ts
   * s.backgroundRepeat('repeat no-repeat')      // 横向平铺，纵向不平铺
   * ```
   *
   * ### round vs space 对比
   *
   * 容器 100px 宽，图片 30px 宽：
   *
   * - `repeat`：3.33 张图（边缘裁切 0.33 张）
   * - `round`：3 张图但**缩放到 33.33px 宽**（无裁切）
   * - `space`：3 张 30px 图 + 之间分配剩余 10px 间距（不缩放）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 6 个 keyword | `repeat` ｜ `noRepeat` ｜ `repeatX` ｜ `repeatY` ｜ `round` ｜ `space` | 只接受关键字 |
   * | 2 个 keyword | `'repeat no-repeat'` | 第 1 个 X，第 2 个 Y |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `repeat`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-repeat
   */
  backgroundRepeat: PropCarrier<CssValueOf<'backgroundRepeat'>, never, 'repeat' | 'noRepeat' | 'repeatX' | 'repeatY' | 'round' | 'space' | GlobalKw, unknown, never>
  /**
   * 设置 `background-image` 的**显示尺寸** —— 拉伸 / 包含 / 覆盖 / 平铺时的图片大小。
   *
   * ## 关键字
   *
   * ### 3 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。图片原始尺寸（一轴 auto 时按比例缩放另一轴） |
   * | `cover` | **等比缩放铺满容器**（可能裁剪溢出部分）；适合 hero 图、卡片封面 |
   * | `contain` | **等比缩放完整显示**（不裁剪，可能留空白）；适合 logo、整图展示 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `backgroundSize`。⚠️ `backgroundSize` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto auto` |
   * | `unset` | `backgroundSize` 非继承属性 → 等同 `initial`（= `auto auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `backgroundSize` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `backgroundSize` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 1/2 值
   *
   * ```ts
   * s.backgroundSize.cover                     // 铺满
   * s.backgroundSize('100px')                  // 宽 100px，高 auto（按比例）
   * s.backgroundSize('100px 50px')             // 宽 100，高 50
   * s.backgroundSize('100% auto')              // 宽撑满，高按比例
   * ```
   *
   * ### cover vs contain
   *
   * ```
   * 容器 200×100，图片 100×100：
   *
   * cover（铺满，裁剪）：
   * ┌────────────────────┐
   * │ ╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳ │  ← 上下被裁
   * │ ░░░░░░░░░░░░░░░░░░ │
   * │ ╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳ │
   * └────────────────────┘
   *
   * contain（完整显示，留空白）：
   * ┌────────────────────┐
   * │       ░░░░░░       │
   * │ 空白  ░░░░░░  空白 │
   * │       ░░░░░░       │
   * └────────────────────┘
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.backgroundSize.px(200)         ≡ s.backgroundSize('200px')
   * s.backgroundSize.rem(1.5)        ≡ s.backgroundSize('1.5rem')
   * s.backgroundSize.em(2)           ≡ s.backgroundSize('2em')      // 当前元素 font-size 的倍数
   * s.backgroundSize.vw(50)          ≡ s.backgroundSize('50vw')     // 视口宽 1%
   * s.backgroundSize.dvw(50)         ≡ s.backgroundSize('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.backgroundSize.cqw(50)         ≡ s.backgroundSize('50cqw')    // container query 容器尺寸
   * s.backgroundSize.percent(50)     ≡ s.backgroundSize('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.backgroundSize('calc(100% - 32px)')
   * s.backgroundSize('min(100%, 1200px)')
   * s.backgroundSize('max(280px, 50%)')
   * s.backgroundSize('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 3 个 keyword | `auto` ｜ `cover` ｜ `contain` | 常用 |
   * | 1 个长度 / 百分比 | `'100px'` `'50%'` | 宽，高自动 |
   * | 2 个值 | `'100px 50px'` `'100% auto'` | 宽 / 高 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto auto`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
   * | :-----: | :-----: | :-----: | :----: | :---: |
   * |  **3**  |  **4**  |  **5**  | **12** | **9** |
   * | 1 _-x-_ |         | 3 _-x-_ |        |       |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-size
   */
  backgroundSize: PropCarrier<CssValueOf<'backgroundSize'>, never, 'auto' | 'cover' | 'contain' | GlobalKw, LengthUnits, never>
  /**
     * **Syntax**: `<length-percentage> | sub | super | baseline`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **1**  |   No    | **4**  | **79** | No  |
     */
  baselineShift: PropFn<CssValueOf<'baselineShift'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'width'>`
     *
     * **Initial value**: `auto`
     *
     * |            Chrome            | Firefox |             Safari             |  Edge  | IE  |
     * | :--------------------------: | :-----: | :----------------------------: | :----: | :-: |
     * |            **57**            | **41**  |            **12.1**            | **79** | No  |
     * | 8 _(-webkit-logical-height)_ |         | 5.1 _(-webkit-logical-height)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/block-size
     */
  blockSize: PropFn<CssValueOf<'blockSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-end-color
     */
  borderBlockEndColor: PropFn<CssValueOf<'borderBlockEndColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-style'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-end-style
     */
  borderBlockEndStyle: PropFn<CssValueOf<'borderBlockEndStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-end-width
     */
  borderBlockEndWidth: PropFn<CssValueOf<'borderBlockEndWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-start-color
     */
  borderBlockStartColor: PropFn<CssValueOf<'borderBlockStartColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-style'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-start-style
     */
  borderBlockStartStyle: PropFn<CssValueOf<'borderBlockStartStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-start-width
     */
  borderBlockStartWidth: PropFn<CssValueOf<'borderBlockStartWidth'>>
  /**
   * 设置元素**下边框**的颜色。其他规则同 [`borderColor`]。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白 |
   * | `black` | `#000000` | 纯黑 |
   * | `transparent` | `rgba(0,0,0,0)` | 完全透明边框；仍占边框宽度位置，可见为间隙 |
   * | `currentColor` | **默认值**，跟随 `color` | 让边框色跟随文字色变（最常用） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderBottomColor`。⚠️ `borderBottomColor` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `currentColor` |
   * | `unset` | `borderBottomColor` 非继承属性 → 等同 `initial`（= `currentColor`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderBottomColor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderBottomColor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法
   *
   * `s.borderColor('red')` 等同四边设为 red；多值时按 CSS 简写规则：
   *
   * - 1 值：四边相同
   * - 2 值：上下 / 左右
   * - 3 值：上 / 左右 / 下
   * - 4 值：上 / 右 / 下 / 左（顺时针）
   *
   * `s.borderColor('red green blue yellow')` 等同上=red 右=green 下=blue 左=yellow。
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.borderColor._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.borderColor._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.borderColor._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.borderColor._primary.alpha(0.6)         // token + 修饰链
   * s.borderColor._primary.darken(0.1)
   * s.borderColor._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.borderColor._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.borderColor.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 配合 borderStyle / borderWidth
   *
   * 只有 `border-style` 不是 `none` 时才显示边框 —— **新元素默认 border-style 是 none**，光设颜色不显示！
   * 正确写法：`s.border('1px solid'); s.borderColor._primary`（两条 statement，statement-only 风）。
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | 多值简写 | `'red green blue yellow'` | 1/2/3/4 个值按上述简写规则分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `currentColor`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-bottom-color
   */
  borderBottomColor: ColorPropCarrier<CssValueOf<'borderBottomColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
   * 设置元素**左下角**的圆角半径。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度 / 百分比 / 数学函数，**无关键字**（除全局关键字）` —— undefined
   * - `百分比相对元素对应轴尺寸；正方形 50% = 圆形` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderBottomLeftRadius`。⚠️ `borderBottomLeftRadius` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `borderBottomLeftRadius` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderBottomLeftRadius` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderBottomLeftRadius` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `borderRadius.px(8)` | 四角均为 8px |
   * | `borderRadius('8px 16px')` | 左上右下 8px，右上左下 16px |
   * | `borderRadius('8px 16px 4px 0')` | 左上 / 右上 / 右下 / 左下（顺时针） |
   *
   * ### 椭圆角：横纵半径分开
   *
   * 用 `/` 分隔：
   *
   * ```ts
   * s.borderRadius('10px / 20px')        // 横半径 10px，纵半径 20px
   * s.borderRadius('50%')                // 圆 / 椭圆
   * ```
   *
   * ### 经典用法
   *
   * ```ts
   * s.borderRadius('50%')                // 圆形（正方形元素时）
   * s.borderRadius.px(8)                 // 卡片圆角
   * s.borderRadius._md                   // 主题 token
   *
   * // 仅单边圆角
   * s.borderRadius('8px 0 0 8px')        // 左侧圆角，右侧直角
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderRadius.px(200)         ≡ s.borderRadius('200px')
   * s.borderRadius.rem(1.5)        ≡ s.borderRadius('1.5rem')
   * s.borderRadius.em(2)           ≡ s.borderRadius('2em')      // 当前元素 font-size 的倍数
   * s.borderRadius.vw(50)          ≡ s.borderRadius('50vw')     // 视口宽 1%
   * s.borderRadius.dvw(50)         ≡ s.borderRadius('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderRadius.cqw(50)         ≡ s.borderRadius('50cqw')    // container query 容器尺寸
   * s.borderRadius.percent(50)     ≡ s.borderRadius('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderRadius('calc(100% - 32px)')
   * s.borderRadius('min(100%, 1200px)')
   * s.borderRadius('max(280px, 50%)')
   * s.borderRadius('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` / `<percentage>` | `'8px'` `'50%'` | 该角的圆角半径 |
   * | 椭圆角（单角） | `'10px 20px'` | 横半径 / 纵半径 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
   * | :-----: | :-----: | :-----: | :----: | :---: |
   * |  **4**  |  **4**  |  **5**  | **12** | **9** |
   * | 1 _-x-_ |         | 3 _-x-_ |        |       |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-bottom-left-radius
   */
  borderBottomLeftRadius: PropCarrier<CssValueOf<'borderBottomLeftRadius'>, RadiusTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * 设置元素**右下角**的圆角半径。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度 / 百分比 / 数学函数，**无关键字**（除全局关键字）` —— undefined
   * - `百分比相对元素对应轴尺寸；正方形 50% = 圆形` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderBottomRightRadius`。⚠️ `borderBottomRightRadius` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `borderBottomRightRadius` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderBottomRightRadius` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderBottomRightRadius` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `borderRadius.px(8)` | 四角均为 8px |
   * | `borderRadius('8px 16px')` | 左上右下 8px，右上左下 16px |
   * | `borderRadius('8px 16px 4px 0')` | 左上 / 右上 / 右下 / 左下（顺时针） |
   *
   * ### 椭圆角：横纵半径分开
   *
   * 用 `/` 分隔：
   *
   * ```ts
   * s.borderRadius('10px / 20px')        // 横半径 10px，纵半径 20px
   * s.borderRadius('50%')                // 圆 / 椭圆
   * ```
   *
   * ### 经典用法
   *
   * ```ts
   * s.borderRadius('50%')                // 圆形（正方形元素时）
   * s.borderRadius.px(8)                 // 卡片圆角
   * s.borderRadius._md                   // 主题 token
   *
   * // 仅单边圆角
   * s.borderRadius('8px 0 0 8px')        // 左侧圆角，右侧直角
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderRadius.px(200)         ≡ s.borderRadius('200px')
   * s.borderRadius.rem(1.5)        ≡ s.borderRadius('1.5rem')
   * s.borderRadius.em(2)           ≡ s.borderRadius('2em')      // 当前元素 font-size 的倍数
   * s.borderRadius.vw(50)          ≡ s.borderRadius('50vw')     // 视口宽 1%
   * s.borderRadius.dvw(50)         ≡ s.borderRadius('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderRadius.cqw(50)         ≡ s.borderRadius('50cqw')    // container query 容器尺寸
   * s.borderRadius.percent(50)     ≡ s.borderRadius('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderRadius('calc(100% - 32px)')
   * s.borderRadius('min(100%, 1200px)')
   * s.borderRadius('max(280px, 50%)')
   * s.borderRadius('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` / `<percentage>` | `'8px'` `'50%'` | 该角的圆角半径 |
   * | 椭圆角（单角） | `'10px 20px'` | 横半径 / 纵半径 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
   * | :-----: | :-----: | :-----: | :----: | :---: |
   * |  **4**  |  **4**  |  **5**  | **12** | **9** |
   * | 1 _-x-_ |         | 3 _-x-_ |        |       |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-bottom-right-radius
   */
  borderBottomRightRadius: PropCarrier<CssValueOf<'borderBottomRightRadius'>, RadiusTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * 设置元素**下边框**的样式。规则同 `borderStyle`。
   *
   * ## 关键字
   *
   * ### 10 个样式关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。完全无边框，不占任何空间 |
   * | `hidden` | 视觉效果同 `none`（无边框），但在**表格冲突边框解析**中优先级高于 `none` |
   * | `dotted` | **点状**虚线边框（圆点） |
   * | `dashed` | **虚线**边框（短横线） |
   * | `solid` | **实线**边框（最常用） |
   * | `double` | **双线**边框（两条平行实线 + 中间空隙；总宽 ≥ 3px 才能看出效果） |
   * | `groove` | **凹槽**：模拟凹下去的边框（3D 效果，浏览器渲染差异大） |
   * | `ridge` | **凸脊**：模拟凸起的边框（3D 效果，与 `groove` 视觉相反） |
   * | `inset` | **凹陷**：让元素看起来嵌入页面（上左暗，下右亮） |
   * | `outset` | **凸起**：让元素看起来浮出页面（上左亮，下右暗） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderBottomStyle`。⚠️ `borderBottomStyle` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `borderBottomStyle` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderBottomStyle` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderBottomStyle` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 重要：边框三件套
   *
   * CSS 边框需要 **width + style + color** 三件齐全才显示：
   *
   * - `borderWidth` 默认 `medium`（≈3px）✓
   * - `borderStyle` 默认 `none` ✗ **必须显式设**
   * - `borderColor` 默认 `currentColor`（跟随文字色）✓
   *
   * ### hidden vs none 在表格中
   *
   * `borderCollapse: collapse` 时，相邻单元格边框冲突解析：
   * - `hidden` 优先级**最高**，强制不显示
   * - `none` 优先级**最低**，让对方边框显示
   *
   * ### 简写：1/2/3/4 值
   *
   * ```ts
   * s.borderStyle.solid                            // 四边 solid
   * s.borderStyle('solid dashed')                  // 上下 solid，左右 dashed
   * s.borderStyle('solid dashed dotted none')      // 上 / 右 / 下 / 左
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 10 个 keyword | `none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset` | 见关键字表 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE    |
   * | :----: | :-----: | :----: | :----: | :-----: |
   * | **1**  |  **1**  | **1**  | **12** | **5.5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-bottom-style
   */
  borderBottomStyle: PropCarrier<CssValueOf<'borderBottomStyle'>, never, 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | GlobalKw, unknown, never>
  /**
   * 设置元素**下边框**的宽度。规则同 `borderWidth`。
   *
   * ## 关键字
   *
   * ### 3 个尺寸关键字（浏览器约定值）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `thin` | 细边框（约 **1px**；具体由浏览器决定） |
   * | `medium` | 中等边框（**默认值**，约 **3px**） |
   * | `thick` | 粗边框（约 **5px**） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderBottomWidth`。⚠️ `borderBottomWidth` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `medium` |
   * | `unset` | `borderBottomWidth` 非继承属性 → 等同 `initial`（= `medium`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderBottomWidth` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderBottomWidth` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写：1/2/3/4 值
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `borderWidth.px(1)` | 四边均为 1px |
   * | `borderWidth('1px 2px')` | 上下 1px，左右 2px |
   * | `borderWidth('1px 2px 3px 4px')` | 上 / 右 / 下 / 左（顺时针） |
   *
   * ### 必须配合 borderStyle
   *
   * ```ts
   * // ❌ 不显示
   * s.borderWidth.px(2)
   * s.borderColor._primary
   * // ✅
   * s.borderWidth.px(2)
   * s.borderStyle.solid
   * s.borderColor._primary
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderWidth.px(200)         ≡ s.borderWidth('200px')
   * s.borderWidth.rem(1.5)        ≡ s.borderWidth('1.5rem')
   * s.borderWidth.em(2)           ≡ s.borderWidth('2em')      // 当前元素 font-size 的倍数
   * s.borderWidth.vw(50)          ≡ s.borderWidth('50vw')     // 视口宽 1%
   * s.borderWidth.dvw(50)         ≡ s.borderWidth('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderWidth.cqw(50)         ≡ s.borderWidth('50cqw')    // container query 容器尺寸
   * s.borderWidth.percent(50)     ≡ s.borderWidth('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderWidth('calc(100% - 32px)')
   * s.borderWidth('min(100%, 1200px)')
   * s.borderWidth('max(280px, 50%)')
   * s.borderWidth('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'1px'` `'0.5rem'` | 具体长度 |
   * | 3 个 keyword | `thin` ｜ `medium` ｜ `thick` | 浏览器约定值 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `medium`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-bottom-width
   */
  borderBottomWidth: PropCarrier<CssValueOf<'borderBottomWidth'>, BordersTokens<T>, 'thin' | 'medium' | 'thick' | GlobalKw, LengthUnits, never>
  /**
   * 决定 `<table>` 中相邻单元格**边框合并还是分离**。表格样式的核心开关。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `separate` | **默认值**。相邻单元格边框**独立**（有间距），间距由 `borderSpacing` 控制 |
   * | `collapse` | 相邻单元格边框**合并**（消除间距 + 重叠时取优先级高的样式） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderCollapse`。⚠️ `borderCollapse` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `separate` |
   * | `unset` | `borderCollapse` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderCollapse` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderCollapse` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 影响
   *
   * - `separate`：可用 `borderSpacing`；`borderRadius` 可圆角
   * - `collapse`：`borderSpacing` 无效；`borderRadius` 在多数浏览器**无效**
   *
   * ### 边框冲突解决（collapse 模式）
   *
   * 按优先级：
   * 1. `hidden` > 任何（强制无边框）
   * 2. 宽 > 窄
   * 3. `double` > `solid` > `dashed` > `dotted` > `ridge` > `outset` > `groove` > `inset`
   * 4. 相同时取 cell 自身
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `separate` ｜ `collapse` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `separate`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |  IE   |
   * | :----: | :-----: | :-----: | :----: | :---: |
   * | **1**  |  **1**  | **1.1** | **12** | **5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-collapse
   */
  borderCollapse: PropCarrier<CssValueOf<'borderCollapse'>, never, 'collapse' | 'separate' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<'border-top-left-radius'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **89** | **66**  | **15** | **89** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-end-end-radius
     */
  borderEndEndRadius: PropFn<CssValueOf<'borderEndEndRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<'border-top-left-radius'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **89** | **66**  | **15** | **89** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-end-start-radius
     */
  borderEndStartRadius: PropFn<CssValueOf<'borderEndStartRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ <length [0,∞]> | <number [0,∞]> ]{1,4}  `
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **15** | **15**  | **6**  | **12** | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-image-outset
     */
  borderImageOutset: PropFn<CssValueOf<'borderImageOutset'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2016.
     *
     * **Syntax**: `[ stretch | repeat | round | space ]{1,2}`
     *
     * **Initial value**: `stretch`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **15** | **15**  | **6**  | **12** | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-image-repeat
     */
  borderImageRepeat: PropFn<CssValueOf<'borderImageRepeat'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ <number [0,∞]> | <percentage [0,∞]> ]{1,4}  && fill?`
     *
     * **Initial value**: `100%`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **15** | **15**  | **6**  | **12** | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-image-slice
     */
  borderImageSlice: PropFn<CssValueOf<'borderImageSlice'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `none | <image>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **15** | **15**  | **6**  | **12** | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-image-source
     */
  borderImageSource: PropFn<CssValueOf<'borderImageSource'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ <length-percentage [0,∞]> | <number [0,∞]> | auto ]{1,4}`
     *
     * **Initial value**: `1`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **16** | **13**  | **6**  | **12** | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-image-width
     */
  borderImageWidth: PropFn<CssValueOf<'borderImageWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome |           Firefox           |  Safari  |  Edge  | IE  |
     * | :----: | :-------------------------: | :------: | :----: | :-: |
     * | **69** |           **41**            | **12.1** | **79** | No  |
     * |        | 3 _(-moz-border-end-color)_ |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-end-color
     */
  borderInlineEndColor: PropFn<CssValueOf<'borderInlineEndColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-style'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome |           Firefox           |  Safari  |  Edge  | IE  |
     * | :----: | :-------------------------: | :------: | :----: | :-: |
     * | **69** |           **41**            | **12.1** | **79** | No  |
     * |        | 3 _(-moz-border-end-style)_ |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-end-style
     */
  borderInlineEndStyle: PropFn<CssValueOf<'borderInlineEndStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome |           Firefox           |  Safari  |  Edge  | IE  |
     * | :----: | :-------------------------: | :------: | :----: | :-: |
     * | **69** |           **41**            | **12.1** | **79** | No  |
     * |        | 3 _(-moz-border-end-width)_ |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-end-width
     */
  borderInlineEndWidth: PropFn<CssValueOf<'borderInlineEndWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome |            Firefox            |  Safari  |  Edge  | IE  |
     * | :----: | :---------------------------: | :------: | :----: | :-: |
     * | **69** |            **41**             | **12.1** | **79** | No  |
     * |        | 3 _(-moz-border-start-color)_ |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-start-color
     */
  borderInlineStartColor: PropFn<CssValueOf<'borderInlineStartColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-style'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome |            Firefox            |  Safari  |  Edge  | IE  |
     * | :----: | :---------------------------: | :------: | :----: | :-: |
     * | **69** |            **41**             | **12.1** | **79** | No  |
     * |        | 3 _(-moz-border-start-style)_ |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-start-style
     */
  borderInlineStartStyle: PropFn<CssValueOf<'borderInlineStartStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-start-width
     */
  borderInlineStartWidth: PropFn<CssValueOf<'borderInlineStartWidth'>>
  /**
   * 设置元素**左边框**的颜色。其他规则同 [`borderColor`]。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白 |
   * | `black` | `#000000` | 纯黑 |
   * | `transparent` | `rgba(0,0,0,0)` | 完全透明边框；仍占边框宽度位置，可见为间隙 |
   * | `currentColor` | **默认值**，跟随 `color` | 让边框色跟随文字色变（最常用） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderLeftColor`。⚠️ `borderLeftColor` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `currentColor` |
   * | `unset` | `borderLeftColor` 非继承属性 → 等同 `initial`（= `currentColor`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderLeftColor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderLeftColor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法
   *
   * `s.borderColor('red')` 等同四边设为 red；多值时按 CSS 简写规则：
   *
   * - 1 值：四边相同
   * - 2 值：上下 / 左右
   * - 3 值：上 / 左右 / 下
   * - 4 值：上 / 右 / 下 / 左（顺时针）
   *
   * `s.borderColor('red green blue yellow')` 等同上=red 右=green 下=blue 左=yellow。
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.borderColor._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.borderColor._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.borderColor._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.borderColor._primary.alpha(0.6)         // token + 修饰链
   * s.borderColor._primary.darken(0.1)
   * s.borderColor._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.borderColor._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.borderColor.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 配合 borderStyle / borderWidth
   *
   * 只有 `border-style` 不是 `none` 时才显示边框 —— **新元素默认 border-style 是 none**，光设颜色不显示！
   * 正确写法：`s.border('1px solid'); s.borderColor._primary`（两条 statement，statement-only 风）。
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | 多值简写 | `'red green blue yellow'` | 1/2/3/4 个值按上述简写规则分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `currentColor`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-left-color
   */
  borderLeftColor: ColorPropCarrier<CssValueOf<'borderLeftColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
   * 设置元素**左边框**的样式。规则同 `borderStyle`。
   *
   * ## 关键字
   *
   * ### 10 个样式关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。完全无边框，不占任何空间 |
   * | `hidden` | 视觉效果同 `none`（无边框），但在**表格冲突边框解析**中优先级高于 `none` |
   * | `dotted` | **点状**虚线边框（圆点） |
   * | `dashed` | **虚线**边框（短横线） |
   * | `solid` | **实线**边框（最常用） |
   * | `double` | **双线**边框（两条平行实线 + 中间空隙；总宽 ≥ 3px 才能看出效果） |
   * | `groove` | **凹槽**：模拟凹下去的边框（3D 效果，浏览器渲染差异大） |
   * | `ridge` | **凸脊**：模拟凸起的边框（3D 效果，与 `groove` 视觉相反） |
   * | `inset` | **凹陷**：让元素看起来嵌入页面（上左暗，下右亮） |
   * | `outset` | **凸起**：让元素看起来浮出页面（上左亮，下右暗） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderLeftStyle`。⚠️ `borderLeftStyle` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `borderLeftStyle` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderLeftStyle` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderLeftStyle` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 重要：边框三件套
   *
   * CSS 边框需要 **width + style + color** 三件齐全才显示：
   *
   * - `borderWidth` 默认 `medium`（≈3px）✓
   * - `borderStyle` 默认 `none` ✗ **必须显式设**
   * - `borderColor` 默认 `currentColor`（跟随文字色）✓
   *
   * ### hidden vs none 在表格中
   *
   * `borderCollapse: collapse` 时，相邻单元格边框冲突解析：
   * - `hidden` 优先级**最高**，强制不显示
   * - `none` 优先级**最低**，让对方边框显示
   *
   * ### 简写：1/2/3/4 值
   *
   * ```ts
   * s.borderStyle.solid                            // 四边 solid
   * s.borderStyle('solid dashed')                  // 上下 solid，左右 dashed
   * s.borderStyle('solid dashed dotted none')      // 上 / 右 / 下 / 左
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 10 个 keyword | `none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset` | 见关键字表 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE    |
   * | :----: | :-----: | :----: | :----: | :-----: |
   * | **1**  |  **1**  | **1**  | **12** | **5.5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-left-style
   */
  borderLeftStyle: PropCarrier<CssValueOf<'borderLeftStyle'>, never, 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | GlobalKw, unknown, never>
  /**
   * 设置元素**左边框**的宽度。规则同 `borderWidth`。
   *
   * ## 关键字
   *
   * ### 3 个尺寸关键字（浏览器约定值）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `thin` | 细边框（约 **1px**；具体由浏览器决定） |
   * | `medium` | 中等边框（**默认值**，约 **3px**） |
   * | `thick` | 粗边框（约 **5px**） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderLeftWidth`。⚠️ `borderLeftWidth` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `medium` |
   * | `unset` | `borderLeftWidth` 非继承属性 → 等同 `initial`（= `medium`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderLeftWidth` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderLeftWidth` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写：1/2/3/4 值
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `borderWidth.px(1)` | 四边均为 1px |
   * | `borderWidth('1px 2px')` | 上下 1px，左右 2px |
   * | `borderWidth('1px 2px 3px 4px')` | 上 / 右 / 下 / 左（顺时针） |
   *
   * ### 必须配合 borderStyle
   *
   * ```ts
   * // ❌ 不显示
   * s.borderWidth.px(2)
   * s.borderColor._primary
   * // ✅
   * s.borderWidth.px(2)
   * s.borderStyle.solid
   * s.borderColor._primary
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderWidth.px(200)         ≡ s.borderWidth('200px')
   * s.borderWidth.rem(1.5)        ≡ s.borderWidth('1.5rem')
   * s.borderWidth.em(2)           ≡ s.borderWidth('2em')      // 当前元素 font-size 的倍数
   * s.borderWidth.vw(50)          ≡ s.borderWidth('50vw')     // 视口宽 1%
   * s.borderWidth.dvw(50)         ≡ s.borderWidth('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderWidth.cqw(50)         ≡ s.borderWidth('50cqw')    // container query 容器尺寸
   * s.borderWidth.percent(50)     ≡ s.borderWidth('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderWidth('calc(100% - 32px)')
   * s.borderWidth('min(100%, 1200px)')
   * s.borderWidth('max(280px, 50%)')
   * s.borderWidth('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'1px'` `'0.5rem'` | 具体长度 |
   * | 3 个 keyword | `thin` ｜ `medium` ｜ `thick` | 浏览器约定值 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `medium`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-left-width
   */
  borderLeftWidth: PropCarrier<CssValueOf<'borderLeftWidth'>, BordersTokens<T>, 'thin' | 'medium' | 'thick' | GlobalKw, LengthUnits, never>
  /**
   * 设置元素**右边框**的颜色。其他规则同 [`borderColor`]。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白 |
   * | `black` | `#000000` | 纯黑 |
   * | `transparent` | `rgba(0,0,0,0)` | 完全透明边框；仍占边框宽度位置，可见为间隙 |
   * | `currentColor` | **默认值**，跟随 `color` | 让边框色跟随文字色变（最常用） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderRightColor`。⚠️ `borderRightColor` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `currentColor` |
   * | `unset` | `borderRightColor` 非继承属性 → 等同 `initial`（= `currentColor`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderRightColor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderRightColor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法
   *
   * `s.borderColor('red')` 等同四边设为 red；多值时按 CSS 简写规则：
   *
   * - 1 值：四边相同
   * - 2 值：上下 / 左右
   * - 3 值：上 / 左右 / 下
   * - 4 值：上 / 右 / 下 / 左（顺时针）
   *
   * `s.borderColor('red green blue yellow')` 等同上=red 右=green 下=blue 左=yellow。
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.borderColor._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.borderColor._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.borderColor._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.borderColor._primary.alpha(0.6)         // token + 修饰链
   * s.borderColor._primary.darken(0.1)
   * s.borderColor._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.borderColor._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.borderColor.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 配合 borderStyle / borderWidth
   *
   * 只有 `border-style` 不是 `none` 时才显示边框 —— **新元素默认 border-style 是 none**，光设颜色不显示！
   * 正确写法：`s.border('1px solid'); s.borderColor._primary`（两条 statement，statement-only 风）。
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | 多值简写 | `'red green blue yellow'` | 1/2/3/4 个值按上述简写规则分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `currentColor`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-right-color
   */
  borderRightColor: ColorPropCarrier<CssValueOf<'borderRightColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
   * 设置元素**右边框**的样式。规则同 `borderStyle`。
   *
   * ## 关键字
   *
   * ### 10 个样式关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。完全无边框，不占任何空间 |
   * | `hidden` | 视觉效果同 `none`（无边框），但在**表格冲突边框解析**中优先级高于 `none` |
   * | `dotted` | **点状**虚线边框（圆点） |
   * | `dashed` | **虚线**边框（短横线） |
   * | `solid` | **实线**边框（最常用） |
   * | `double` | **双线**边框（两条平行实线 + 中间空隙；总宽 ≥ 3px 才能看出效果） |
   * | `groove` | **凹槽**：模拟凹下去的边框（3D 效果，浏览器渲染差异大） |
   * | `ridge` | **凸脊**：模拟凸起的边框（3D 效果，与 `groove` 视觉相反） |
   * | `inset` | **凹陷**：让元素看起来嵌入页面（上左暗，下右亮） |
   * | `outset` | **凸起**：让元素看起来浮出页面（上左亮，下右暗） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderRightStyle`。⚠️ `borderRightStyle` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `borderRightStyle` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderRightStyle` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderRightStyle` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 重要：边框三件套
   *
   * CSS 边框需要 **width + style + color** 三件齐全才显示：
   *
   * - `borderWidth` 默认 `medium`（≈3px）✓
   * - `borderStyle` 默认 `none` ✗ **必须显式设**
   * - `borderColor` 默认 `currentColor`（跟随文字色）✓
   *
   * ### hidden vs none 在表格中
   *
   * `borderCollapse: collapse` 时，相邻单元格边框冲突解析：
   * - `hidden` 优先级**最高**，强制不显示
   * - `none` 优先级**最低**，让对方边框显示
   *
   * ### 简写：1/2/3/4 值
   *
   * ```ts
   * s.borderStyle.solid                            // 四边 solid
   * s.borderStyle('solid dashed')                  // 上下 solid，左右 dashed
   * s.borderStyle('solid dashed dotted none')      // 上 / 右 / 下 / 左
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 10 个 keyword | `none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset` | 见关键字表 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE    |
   * | :----: | :-----: | :----: | :----: | :-----: |
   * | **1**  |  **1**  | **1**  | **12** | **5.5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-right-style
   */
  borderRightStyle: PropCarrier<CssValueOf<'borderRightStyle'>, never, 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | GlobalKw, unknown, never>
  /**
   * 设置元素**右边框**的宽度。规则同 `borderWidth`。
   *
   * ## 关键字
   *
   * ### 3 个尺寸关键字（浏览器约定值）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `thin` | 细边框（约 **1px**；具体由浏览器决定） |
   * | `medium` | 中等边框（**默认值**，约 **3px**） |
   * | `thick` | 粗边框（约 **5px**） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderRightWidth`。⚠️ `borderRightWidth` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `medium` |
   * | `unset` | `borderRightWidth` 非继承属性 → 等同 `initial`（= `medium`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderRightWidth` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderRightWidth` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写：1/2/3/4 值
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `borderWidth.px(1)` | 四边均为 1px |
   * | `borderWidth('1px 2px')` | 上下 1px，左右 2px |
   * | `borderWidth('1px 2px 3px 4px')` | 上 / 右 / 下 / 左（顺时针） |
   *
   * ### 必须配合 borderStyle
   *
   * ```ts
   * // ❌ 不显示
   * s.borderWidth.px(2)
   * s.borderColor._primary
   * // ✅
   * s.borderWidth.px(2)
   * s.borderStyle.solid
   * s.borderColor._primary
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderWidth.px(200)         ≡ s.borderWidth('200px')
   * s.borderWidth.rem(1.5)        ≡ s.borderWidth('1.5rem')
   * s.borderWidth.em(2)           ≡ s.borderWidth('2em')      // 当前元素 font-size 的倍数
   * s.borderWidth.vw(50)          ≡ s.borderWidth('50vw')     // 视口宽 1%
   * s.borderWidth.dvw(50)         ≡ s.borderWidth('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderWidth.cqw(50)         ≡ s.borderWidth('50cqw')    // container query 容器尺寸
   * s.borderWidth.percent(50)     ≡ s.borderWidth('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderWidth('calc(100% - 32px)')
   * s.borderWidth('min(100%, 1200px)')
   * s.borderWidth('max(280px, 50%)')
   * s.borderWidth('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'1px'` `'0.5rem'` | 具体长度 |
   * | 3 个 keyword | `thin` ｜ `medium` ｜ `thick` | 浏览器约定值 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `medium`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-right-width
   */
  borderRightWidth: PropCarrier<CssValueOf<'borderRightWidth'>, BordersTokens<T>, 'thin' | 'medium' | 'thick' | GlobalKw, LengthUnits, never>
  /**
   * 设置 `<table>` 中相邻单元格**边框之间的距离**。仅在 `borderCollapse: separate` 时生效。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受 1 或 2 个长度值，**无关键字**` —— undefined
   * - `1 值：横纵相同；2 值：横距 / 纵距` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderSpacing`。⚠️ `borderSpacing` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `borderSpacing` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderSpacing` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderSpacing` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.borderCollapse.separate
   * s.borderSpacing.px(8)
   * s.borderSpacing('12px 4px')         // 横 12px，纵 4px
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderSpacing.px(200)         ≡ s.borderSpacing('200px')
   * s.borderSpacing.rem(1.5)        ≡ s.borderSpacing('1.5rem')
   * s.borderSpacing.em(2)           ≡ s.borderSpacing('2em')      // 当前元素 font-size 的倍数
   * s.borderSpacing.vw(50)          ≡ s.borderSpacing('50vw')     // 视口宽 1%
   * s.borderSpacing.dvw(50)         ≡ s.borderSpacing('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderSpacing.cqw(50)         ≡ s.borderSpacing('50cqw')    // container query 容器尺寸
   * s.borderSpacing.percent(50)     ≡ s.borderSpacing('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderSpacing('calc(100% - 32px)')
   * s.borderSpacing('min(100%, 1200px)')
   * s.borderSpacing('max(280px, 50%)')
   * s.borderSpacing('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 1 个长度 | `'8px'` | 横纵相同 |
   * | 2 个长度 | `'12px 4px'` | 横距 / 纵距 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **8** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-spacing
   */
  borderSpacing: PropCarrier<CssValueOf<'borderSpacing'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<'border-top-left-radius'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **89** | **66**  | **15** | **89** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-start-end-radius
     */
  borderStartEndRadius: PropFn<CssValueOf<'borderStartEndRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<'border-top-left-radius'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **89** | **66**  | **15** | **89** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-start-start-radius
     */
  borderStartStartRadius: PropFn<CssValueOf<'borderStartStartRadius'>>
  /**
   * 设置元素**上边框**的颜色。其他规则同 [`borderColor`]。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白 |
   * | `black` | `#000000` | 纯黑 |
   * | `transparent` | `rgba(0,0,0,0)` | 完全透明边框；仍占边框宽度位置，可见为间隙 |
   * | `currentColor` | **默认值**，跟随 `color` | 让边框色跟随文字色变（最常用） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderTopColor`。⚠️ `borderTopColor` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `currentColor` |
   * | `unset` | `borderTopColor` 非继承属性 → 等同 `initial`（= `currentColor`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderTopColor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderTopColor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法
   *
   * `s.borderColor('red')` 等同四边设为 red；多值时按 CSS 简写规则：
   *
   * - 1 值：四边相同
   * - 2 值：上下 / 左右
   * - 3 值：上 / 左右 / 下
   * - 4 值：上 / 右 / 下 / 左（顺时针）
   *
   * `s.borderColor('red green blue yellow')` 等同上=red 右=green 下=blue 左=yellow。
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.borderColor._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.borderColor._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.borderColor._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.borderColor._primary.alpha(0.6)         // token + 修饰链
   * s.borderColor._primary.darken(0.1)
   * s.borderColor._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.borderColor._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.borderColor.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 配合 borderStyle / borderWidth
   *
   * 只有 `border-style` 不是 `none` 时才显示边框 —— **新元素默认 border-style 是 none**，光设颜色不显示！
   * 正确写法：`s.border('1px solid'); s.borderColor._primary`（两条 statement，statement-only 风）。
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | 多值简写 | `'red green blue yellow'` | 1/2/3/4 个值按上述简写规则分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `currentColor`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-top-color
   */
  borderTopColor: ColorPropCarrier<CssValueOf<'borderTopColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
   * 设置元素**左上角**的圆角半径。可用 2 个值指定该角的横/纵半径（椭圆角）。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度 / 百分比 / 数学函数，**无关键字**（除全局关键字）` —— undefined
   * - `百分比相对元素对应轴尺寸；正方形 50% = 圆形` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderTopLeftRadius`。⚠️ `borderTopLeftRadius` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `borderTopLeftRadius` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderTopLeftRadius` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderTopLeftRadius` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `borderRadius.px(8)` | 四角均为 8px |
   * | `borderRadius('8px 16px')` | 左上右下 8px，右上左下 16px |
   * | `borderRadius('8px 16px 4px 0')` | 左上 / 右上 / 右下 / 左下（顺时针） |
   *
   * ### 椭圆角：横纵半径分开
   *
   * 用 `/` 分隔：
   *
   * ```ts
   * s.borderRadius('10px / 20px')        // 横半径 10px，纵半径 20px
   * s.borderRadius('50%')                // 圆 / 椭圆
   * ```
   *
   * ### 经典用法
   *
   * ```ts
   * s.borderRadius('50%')                // 圆形（正方形元素时）
   * s.borderRadius.px(8)                 // 卡片圆角
   * s.borderRadius._md                   // 主题 token
   *
   * // 仅单边圆角
   * s.borderRadius('8px 0 0 8px')        // 左侧圆角，右侧直角
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderRadius.px(200)         ≡ s.borderRadius('200px')
   * s.borderRadius.rem(1.5)        ≡ s.borderRadius('1.5rem')
   * s.borderRadius.em(2)           ≡ s.borderRadius('2em')      // 当前元素 font-size 的倍数
   * s.borderRadius.vw(50)          ≡ s.borderRadius('50vw')     // 视口宽 1%
   * s.borderRadius.dvw(50)         ≡ s.borderRadius('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderRadius.cqw(50)         ≡ s.borderRadius('50cqw')    // container query 容器尺寸
   * s.borderRadius.percent(50)     ≡ s.borderRadius('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderRadius('calc(100% - 32px)')
   * s.borderRadius('min(100%, 1200px)')
   * s.borderRadius('max(280px, 50%)')
   * s.borderRadius('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` / `<percentage>` | `'8px'` `'50%'` | 该角的圆角半径 |
   * | 椭圆角（单角） | `'10px 20px'` | 横半径 / 纵半径（注意这里不用 `/`） |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
   * | :-----: | :-----: | :-----: | :----: | :---: |
   * |  **4**  |  **4**  |  **5**  | **12** | **9** |
   * | 1 _-x-_ |         | 3 _-x-_ |        |       |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-top-left-radius
   */
  borderTopLeftRadius: PropCarrier<CssValueOf<'borderTopLeftRadius'>, RadiusTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * 设置元素**右上角**的圆角半径。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度 / 百分比 / 数学函数，**无关键字**（除全局关键字）` —— undefined
   * - `百分比相对元素对应轴尺寸；正方形 50% = 圆形` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderTopRightRadius`。⚠️ `borderTopRightRadius` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `borderTopRightRadius` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderTopRightRadius` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderTopRightRadius` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `borderRadius.px(8)` | 四角均为 8px |
   * | `borderRadius('8px 16px')` | 左上右下 8px，右上左下 16px |
   * | `borderRadius('8px 16px 4px 0')` | 左上 / 右上 / 右下 / 左下（顺时针） |
   *
   * ### 椭圆角：横纵半径分开
   *
   * 用 `/` 分隔：
   *
   * ```ts
   * s.borderRadius('10px / 20px')        // 横半径 10px，纵半径 20px
   * s.borderRadius('50%')                // 圆 / 椭圆
   * ```
   *
   * ### 经典用法
   *
   * ```ts
   * s.borderRadius('50%')                // 圆形（正方形元素时）
   * s.borderRadius.px(8)                 // 卡片圆角
   * s.borderRadius._md                   // 主题 token
   *
   * // 仅单边圆角
   * s.borderRadius('8px 0 0 8px')        // 左侧圆角，右侧直角
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderRadius.px(200)         ≡ s.borderRadius('200px')
   * s.borderRadius.rem(1.5)        ≡ s.borderRadius('1.5rem')
   * s.borderRadius.em(2)           ≡ s.borderRadius('2em')      // 当前元素 font-size 的倍数
   * s.borderRadius.vw(50)          ≡ s.borderRadius('50vw')     // 视口宽 1%
   * s.borderRadius.dvw(50)         ≡ s.borderRadius('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderRadius.cqw(50)         ≡ s.borderRadius('50cqw')    // container query 容器尺寸
   * s.borderRadius.percent(50)     ≡ s.borderRadius('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderRadius('calc(100% - 32px)')
   * s.borderRadius('min(100%, 1200px)')
   * s.borderRadius('max(280px, 50%)')
   * s.borderRadius('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` / `<percentage>` | `'8px'` `'50%'` | 该角的圆角半径 |
   * | 椭圆角（单角） | `'10px 20px'` | 横半径 / 纵半径 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
   * | :-----: | :-----: | :-----: | :----: | :---: |
   * |  **4**  |  **4**  |  **5**  | **12** | **9** |
   * | 1 _-x-_ |         | 3 _-x-_ |        |       |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-top-right-radius
   */
  borderTopRightRadius: PropCarrier<CssValueOf<'borderTopRightRadius'>, RadiusTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * 设置元素**上边框**的样式。规则同 `borderStyle`。
   *
   * ## 关键字
   *
   * ### 10 个样式关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。完全无边框，不占任何空间 |
   * | `hidden` | 视觉效果同 `none`（无边框），但在**表格冲突边框解析**中优先级高于 `none` |
   * | `dotted` | **点状**虚线边框（圆点） |
   * | `dashed` | **虚线**边框（短横线） |
   * | `solid` | **实线**边框（最常用） |
   * | `double` | **双线**边框（两条平行实线 + 中间空隙；总宽 ≥ 3px 才能看出效果） |
   * | `groove` | **凹槽**：模拟凹下去的边框（3D 效果，浏览器渲染差异大） |
   * | `ridge` | **凸脊**：模拟凸起的边框（3D 效果，与 `groove` 视觉相反） |
   * | `inset` | **凹陷**：让元素看起来嵌入页面（上左暗，下右亮） |
   * | `outset` | **凸起**：让元素看起来浮出页面（上左亮，下右暗） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderTopStyle`。⚠️ `borderTopStyle` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `borderTopStyle` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderTopStyle` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderTopStyle` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 重要：边框三件套
   *
   * CSS 边框需要 **width + style + color** 三件齐全才显示：
   *
   * - `borderWidth` 默认 `medium`（≈3px）✓
   * - `borderStyle` 默认 `none` ✗ **必须显式设**
   * - `borderColor` 默认 `currentColor`（跟随文字色）✓
   *
   * ### hidden vs none 在表格中
   *
   * `borderCollapse: collapse` 时，相邻单元格边框冲突解析：
   * - `hidden` 优先级**最高**，强制不显示
   * - `none` 优先级**最低**，让对方边框显示
   *
   * ### 简写：1/2/3/4 值
   *
   * ```ts
   * s.borderStyle.solid                            // 四边 solid
   * s.borderStyle('solid dashed')                  // 上下 solid，左右 dashed
   * s.borderStyle('solid dashed dotted none')      // 上 / 右 / 下 / 左
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 10 个 keyword | `none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset` | 见关键字表 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE    |
   * | :----: | :-----: | :----: | :----: | :-----: |
   * | **1**  |  **1**  | **1**  | **12** | **5.5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-top-style
   */
  borderTopStyle: PropCarrier<CssValueOf<'borderTopStyle'>, never, 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | GlobalKw, unknown, never>
  /**
   * 设置元素**上边框**的宽度。规则同 `borderWidth`。
   *
   * ## 关键字
   *
   * ### 3 个尺寸关键字（浏览器约定值）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `thin` | 细边框（约 **1px**；具体由浏览器决定） |
   * | `medium` | 中等边框（**默认值**，约 **3px**） |
   * | `thick` | 粗边框（约 **5px**） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderTopWidth`。⚠️ `borderTopWidth` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `medium` |
   * | `unset` | `borderTopWidth` 非继承属性 → 等同 `initial`（= `medium`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderTopWidth` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderTopWidth` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写：1/2/3/4 值
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `borderWidth.px(1)` | 四边均为 1px |
   * | `borderWidth('1px 2px')` | 上下 1px，左右 2px |
   * | `borderWidth('1px 2px 3px 4px')` | 上 / 右 / 下 / 左（顺时针） |
   *
   * ### 必须配合 borderStyle
   *
   * ```ts
   * // ❌ 不显示
   * s.borderWidth.px(2)
   * s.borderColor._primary
   * // ✅
   * s.borderWidth.px(2)
   * s.borderStyle.solid
   * s.borderColor._primary
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderWidth.px(200)         ≡ s.borderWidth('200px')
   * s.borderWidth.rem(1.5)        ≡ s.borderWidth('1.5rem')
   * s.borderWidth.em(2)           ≡ s.borderWidth('2em')      // 当前元素 font-size 的倍数
   * s.borderWidth.vw(50)          ≡ s.borderWidth('50vw')     // 视口宽 1%
   * s.borderWidth.dvw(50)         ≡ s.borderWidth('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderWidth.cqw(50)         ≡ s.borderWidth('50cqw')    // container query 容器尺寸
   * s.borderWidth.percent(50)     ≡ s.borderWidth('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderWidth('calc(100% - 32px)')
   * s.borderWidth('min(100%, 1200px)')
   * s.borderWidth('max(280px, 50%)')
   * s.borderWidth('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'1px'` `'0.5rem'` | 具体长度 |
   * | 3 个 keyword | `thin` ｜ `medium` ｜ `thick` | 浏览器约定值 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `medium`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-top-width
   */
  borderTopWidth: PropCarrier<CssValueOf<'borderTopWidth'>, BordersTokens<T>, 'thin' | 'medium' | 'thick' | GlobalKw, LengthUnits, never>
  /**
   * 设置定位元素距**底部**的偏移量。正值向上移，负值向下移。**只在 `position` 非 `static` 时生效**。其他规则同 [`inset`]。
   *
   * ## 关键字
   *
   * ### 1 个偏移关键字
   *
   * | 关键字 | 效果 | 说明 |
   * | --- | --- | --- |
   * | `auto` | **默认值**。不参与定位，交由浏览器按正常文档流决定位置 | 未定位元素（`position: static`）的默认状态；也用于取消之前设过的偏移 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `bottom`。⚠️ `bottom` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `bottom` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `bottom` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `bottom` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### ⚠️ 必须配合 position: relative/absolute/fixed/sticky 才生效
   *
   * `top` / `right` / `bottom` / `left`（以及 `inset`）对 `position: static`（默认值）的元素**无效**。
   *
   * ### 简写语法（与 margin/padding 相同的 1/2/3/4 值规则）
   *
   * ```ts
   * s.inset.px(0)                     // 四边均偏移 0（常用于绝对定位充满父容器）
   * s.inset('0 16px')                 // 上下 0，左右 16px
   * s.inset('8px 16px 24px 32px')     // 上 右 下 左（顺时针）
   * ```
   *
   * ### 偏移基准（四种定位各不同）
   *
   * | position | 偏移基准 |
   * | --- | --- |
   * | `relative` | **元素原始位置**（偏移后原位仍占空间） |
   * | `absolute` | **最近的定位祖先**（position 非 static 的祖先）的 padding-box 边缘 |
   * | `fixed` | **视口**（viewport）边缘（⚠️ 祖先有 `transform` / `will-change: transform` / `filter` 时变为祖先 padding-box） |
   * | `sticky` | 正常文档流位置（偏移值 = 粘住后距视口边缘的距离） |
   *
   * ### 绝对定位充满父容器
   *
   * ```ts
   * s.position.absolute
   * s.inset.px(0)   // 等同 top:0 right:0 bottom:0 left:0
   * // 前提：父容器 position 不是 static
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.inset.px(200)         ≡ s.inset('200px')
   * s.inset.rem(1.5)        ≡ s.inset('1.5rem')
   * s.inset.em(2)           ≡ s.inset('2em')      // 当前元素 font-size 的倍数
   * s.inset.vw(50)          ≡ s.inset('50vw')     // 视口宽 1%
   * s.inset.dvw(50)         ≡ s.inset('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.inset.cqw(50)         ≡ s.inset('50cqw')    // container query 容器尺寸
   * s.inset.percent(50)     ≡ s.inset('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.inset('calc(100% - 32px)')
   * s.inset('min(100%, 1200px)')
   * s.inset('max(280px, 50%)')
   * s.inset('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | — | **默认值**；不偏移，由文档流决定位置 |
   * | 多值简写 | `'0 16px'` `'8px 16px 24px 32px'` | 1/2/3/4 个值，顺时针分配到四边 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/bottom
   */
  bottom: PropCarrier<CssValueOf<'bottom'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * 决定**跨行 / 跨栏 / 跨页**元素的**装饰**（border / padding / background / box-shadow）如何处理 —— 整体计算还是每片单独计算。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `slice` | **默认值**。装饰被**切断**：跨行元素第一段有起始边框，最后一段有结束边框，中间无两端装饰 |
   * | `clone` | 装饰**每段独立**：每段都完整应用装饰（如每行都有完整 border） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `boxDecorationBreak`。⚠️ `boxDecorationBreak` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `slice` |
   * | `unset` | `boxDecorationBreak` 非继承属性 → 等同 `initial`（= `slice`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `boxDecorationBreak` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `boxDecorationBreak` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：多行文字高亮
   *
   * ```html
   * <span class="highlight">这是一段很长的文字会换行<br/>第二行</span>
   * ```
   *
   * ```ts
   * // slice（默认）：第一行只有左圆角，最后一行只有右圆角
   * // clone：每行都有完整左右圆角
   * s.padding.px(4)
   * s.backgroundColor._yellow200
   * s.borderRadius.px(4)
   * s.boxDecorationBreak.clone
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `slice` ｜ `clone` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `slice`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox |   Safari    |   Edge   | IE  |
   * | :------: | :-----: | :---------: | :------: | :-: |
   * | **130**  | **32**  | **7** _-x-_ | **130**  | No  |
   * | 22 _-x-_ |         |             | 79 _-x-_ |     |
   *
   * Safari/iOS 需 `-webkit-box-decoration-break` 前缀。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/box-decoration-break
   */
  boxDecorationBreak: PropCarrier<CssValueOf<'boxDecorationBreak'>, never, 'slice' | 'clone' | GlobalKw, unknown, never>
  /**
   * 给元素添加**阴影**。可叠加多组（逗号分隔），支持外/内阴影。CSS 中最常用的视觉增强属性。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无阴影 |
   *
   * ### 函数态特殊关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `inset` | 让阴影变为**内阴影**（投影在元素内部）；写在 offset/blur/spread/color 之前 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `boxShadow`。⚠️ `boxShadow` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `boxShadow` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `boxShadow` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `boxShadow` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态语法
   *
   * `boxShadow: [inset?] <offsetX> <offsetY> <blur>? <spread>? <color>?`
   *
   * | 参数 | 必填 | 含义 |
   * | --- | --- | --- |
   * | `inset` | 否 | 写则为内阴影 |
   * | `offsetX` | ✓ | 水平偏移（正右负左） |
   * | `offsetY` | ✓ | 垂直偏移（正下负上） |
   * | `blur` | 否 | 模糊半径（≥ 0） |
   * | `spread` | 否 | 扩散半径，正值放大阴影，负值缩小 |
   * | `color` | 否 | 阴影颜色（默认 `currentColor`） |
   *
   * ### 多阴影叠加
   *
   * 逗号分隔，**先写的在最前**：
   *
   * ```ts
   * s.boxShadow(`
   *   0 1px 3px rgba(0,0,0,0.1),
   *   0 1px 2px rgba(0,0,0,0.06)
   * `)
   * ```
   *
   * ### 经典写法
   *
   * ```ts
   * s.boxShadow('0 4px 12px rgba(0,0,0,0.1)')        // 卡片浮起
   * s.boxShadow._md                                  // 主题 token
   * s.boxShadow('inset 0 2px 4px rgba(0,0,0,0.06)')  // 内阴影
   * s.boxShadow('0 0 0 1px rgba(0,0,0,0.1)')         // 模拟 border（不占空间）
   * s.boxShadow('0 0 0 3px rgba(59,130,246,0.4)')    // 焦点环
   * ```
   *
   * ### 性能提示
   *
   * - `boxShadow` 触发 paint；频繁动画的大模糊半径会卡顿
   * - 优化：用 `filter: drop-shadow()` 或多个小阴影代替
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | **默认值** |
   * | 单组阴影 | `'2px 4px 8px #0002'` | offsetX offsetY blur color |
   * | 完整 5 参数 | `'inset 0 2px 4px 0 rgba(0,0,0,0.1)'` | inset offsetX offsetY blur spread color |
   * | 多组叠加 | `'0 1px 3px #0001, 0 1px 2px #0006'` | 逗号分隔 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
   * | :-----: | :-----: | :-----: | :----: | :---: |
   * | **10**  |  **4**  | **5.1** | **12** | **9** |
   * | 1 _-x-_ |         | 3 _-x-_ |        |       |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/box-shadow
   */
  boxShadow: PropCarrier<CssValueOf<'boxShadow'>, ShadowTokens<T>, 'none' | GlobalKw, unknown, never>
  /**
   * 决定元素的 `width` / `height` **是否包含** `padding` 和 `border`。CSS 历史上最经典的"踩坑点"。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `contentBox` | **默认值**。`width`/`height` 仅指**内容区**；最终总宽 = `width` + `padding-left` + `padding-right` + `border-left` + `border-right`（容易算错） |
   * | `borderBox` | `width`/`height` 包含 `padding` 和 `border`（直观），内容区会自动收缩。**现代项目通常 reset 为此值** |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `boxSizing`。⚠️ `boxSizing` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `contentBox` |
   * | `unset` | `boxSizing` 非继承属性 → 等同 `initial`（= `contentBox`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `boxSizing` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `boxSizing` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 经典 reset
   *
   * 绝大多数现代项目会全局设：
   *
   * ```css
   * *, *::before, *::after { box-sizing: border-box; }
   * ```
   *
   * 这样所有元素的尺寸计算更符合直觉：写 `width: 100px` 就是真的 100px 宽（含 padding+border）。
   *
   * ### contentBox vs borderBox
   *
   * ```
   * contentBox（默认，反直觉）：
   * ┌──────────────────────────────────────┐
   * │ margin                               │
   * │  ┌────────────────────────────────┐  │
   * │  │ border                         │  │
   * │  │  ┌──────────────────────────┐  │  │
   * │  │  │ padding                  │  │  │
   * │  │  │  ┌────────────────────┐  │  │  │
   * │  │  │  │ content (width)    │  │  │  │  ← width 只算这里
   * │  │  │  └────────────────────┘  │  │  │
   * │  │  └──────────────────────────┘  │  │
   * │  └────────────────────────────────┘  │
   * └──────────────────────────────────────┘
   *
   * borderBox（直观）：
   * ┌──────────────────────────────────────┐
   * │ margin                               │
   * │  ┌─[ width ─────────────────────]─┐  │
   * │  │ border                         │  │
   * │  │  padding                       │  │
   * │  │   content                      │  │  ← width 算到 border 外侧
   * │  └────────────────────────────────┘  │
   * └──────────────────────────────────────┘
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `contentBox` ｜ `borderBox` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `contentBox`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
   * | :-----: | :-----: | :-----: | :----: | :---: |
   * | **10**  | **29**  | **5.1** | **12** | **8** |
   * | 1 _-x-_ | 1 _-x-_ | 3 _-x-_ |        |       |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/box-sizing
   */
  boxSizing: PropCarrier<CssValueOf<'boxSizing'>, never, 'borderBox' | 'contentBox' | GlobalKw, unknown, never>
  /**
   * 控制元素**后**是否强制分页 / 分栏。规则同 `breakBefore`。
   *
   * ## 关键字
   *
   * ### 通用
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动决定 |
   * | `avoid` | 尽量**避免**在元素前分页/分栏 |
   * | `always` | **强制在元素前**分页/分栏 |
   * | `all` | 强制分所有可能的边界（分页 + 分栏 + 区域） |
   *
   * ### 分页专属
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `avoidPage` | 尽量避免**分页** |
   * | `page` | 强制分页 |
   * | `left` | 强制分页且下一页是**左页**（书籍排版用） |
   * | `right` | 强制分页且下一页是**右页** |
   * | `recto` | 逻辑右页（西方书 = right，阿拉伯书 = left） |
   * | `verso` | 逻辑左页 |
   *
   * ### 分栏专属
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `avoidColumn` | 尽量避免分栏 |
   * | `column` | 强制分栏 |
   *
   * ### 区域专属（CSS Regions）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `avoidRegion` | 尽量避免分区域 |
   * | `region` | 强制分区域 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `breakAfter`。⚠️ `breakAfter` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `breakAfter` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `breakAfter` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `breakAfter` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：打印
   *
   * ```ts
   * // 每个 <h1> 前都强制分页
   * s.breakBefore.page
   *
   * // 表格行尽量不在分页处断开
   * s.breakInside.avoid
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 |
   * | --- | --- |
   * | 通用 | `auto` ｜ `avoid` ｜ `always` ｜ `all` |
   * | 分页 | `avoidPage` ｜ `page` ｜ `left` ｜ `right` ｜ `recto` ｜ `verso` |
   * | 分栏 | `avoidColumn` ｜ `column` |
   * | 区域 | `avoidRegion` ｜ `region` |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE   |
   * | :----: | :-----: | :----: | :----: | :----: |
   * | **50** | **65**  | **10** | **12** | **10** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/break-after
   */
  breakAfter: PropCarrier<CssValueOf<'breakAfter'>, never, 'auto' | 'avoid' | 'always' | 'all' | 'avoidPage' | 'page' | 'left' | 'right' | 'recto' | 'verso' | 'avoidColumn' | 'column' | 'avoidRegion' | 'region' | GlobalKw, unknown, never>
  /**
   * 控制元素**前**是否**强制分页 / 分栏 / 分区域**（打印分页 / 多栏布局换栏）。
   *
   * ## 关键字
   *
   * ### 通用
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动决定 |
   * | `avoid` | 尽量**避免**在元素前分页/分栏 |
   * | `always` | **强制在元素前**分页/分栏 |
   * | `all` | 强制分所有可能的边界（分页 + 分栏 + 区域） |
   *
   * ### 分页专属
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `avoidPage` | 尽量避免**分页** |
   * | `page` | 强制分页 |
   * | `left` | 强制分页且下一页是**左页**（书籍排版用） |
   * | `right` | 强制分页且下一页是**右页** |
   * | `recto` | 逻辑右页（西方书 = right，阿拉伯书 = left） |
   * | `verso` | 逻辑左页 |
   *
   * ### 分栏专属
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `avoidColumn` | 尽量避免分栏 |
   * | `column` | 强制分栏 |
   *
   * ### 区域专属（CSS Regions）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `avoidRegion` | 尽量避免分区域 |
   * | `region` | 强制分区域 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `breakBefore`。⚠️ `breakBefore` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `breakBefore` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `breakBefore` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `breakBefore` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：打印
   *
   * ```ts
   * // 每个 <h1> 前都强制分页
   * s.breakBefore.page
   *
   * // 表格行尽量不在分页处断开
   * s.breakInside.avoid
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 |
   * | --- | --- |
   * | 通用 | `auto` ｜ `avoid` ｜ `always` ｜ `all` |
   * | 分页 | `avoidPage` ｜ `page` ｜ `left` ｜ `right` ｜ `recto` ｜ `verso` |
   * | 分栏 | `avoidColumn` ｜ `column` |
   * | 区域 | `avoidRegion` ｜ `region` |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE   |
   * | :----: | :-----: | :----: | :----: | :----: |
   * | **50** | **65**  | **10** | **12** | **10** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/break-before
   */
  breakBefore: PropCarrier<CssValueOf<'breakBefore'>, never, 'auto' | 'avoid' | 'always' | 'all' | 'avoidPage' | 'page' | 'left' | 'right' | 'recto' | 'verso' | 'avoidColumn' | 'column' | 'avoidRegion' | 'region' | GlobalKw, unknown, never>
  /**
   * 控制元素**内部**是否允许分页 / 分栏。常用于让卡片 / 表格行**不被打印分页拆断**。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动决定（可能拆断） |
   * | `avoid` | **尽量避免在内部**分页 / 分栏 / 分区域（最常用） |
   * | `avoidPage` | 尽量避免**分页**（仅打印） |
   * | `avoidColumn` | 尽量避免**分栏** |
   * | `avoidRegion` | 尽量避免分区域 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `breakInside`。⚠️ `breakInside` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `breakInside` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `breakInside` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `breakInside` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个 keyword | `auto` ｜ `avoid` ｜ `avoidPage` ｜ `avoidColumn` ｜ `avoidRegion` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE   |
   * | :----: | :-----: | :----: | :----: | :----: |
   * | **50** | **65**  | **10** | **12** | **10** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/break-inside
   */
  breakInside: PropCarrier<CssValueOf<'breakInside'>, never, 'auto' | 'avoid' | 'avoidPage' | 'avoidColumn' | 'avoidRegion' | GlobalKw, unknown, never>
  /**
   * 决定 `<caption>` 元素（表格标题）**显示在表格上方还是下方**。
   *
   * ## 关键字
   *
   * ### 6 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `top` | **默认值**。标题在表格**上方** |
   * | `bottom` | 标题在表格**下方** |
   * | `blockStart` | 逻辑属性：块方向起点（横向书写 = top） |
   * | `blockEnd` | 逻辑属性：块方向终点（横向书写 = bottom） |
   * | `inlineStart` | 逻辑属性：行内方向起点（罕用） |
   * | `inlineEnd` | 逻辑属性：行内方向终点 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `captionSide`。⚠️ `captionSide` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `top` |
   * | `unset` | `captionSide` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `captionSide` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `captionSide` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 6 个 keyword | `top` ｜ `bottom` ｜ `blockStart` ｜ `blockEnd` ｜ `inlineStart` ｜ `inlineEnd` | 物理 / 逻辑方向 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `top`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **8** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/caption-side
   */
  captionSide: PropCarrier<CssValueOf<'captionSide'>, never, 'top' | 'bottom' | 'blockStart' | 'blockEnd' | 'inlineStart' | 'inlineEnd' | GlobalKw, unknown, never>
  /**
   * 设置**文本输入光标**（caret）的颜色 —— `<input>` / `<textarea>` / `contenteditable` 元素聚焦时的闪烁竖线。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白光标（深色背景输入框常用） |
   * | `black` | `#000000` | 纯黑光标 |
   * | `transparent` | `rgba(0,0,0,0)` | 隐藏光标（仍可输入，**慎用，影响可访问性**；只在自定义光标动画时用） |
   * | `currentColor` | 引用 `color` | 光标跟随文字色变 |
   *
   * ### 此属性特有
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动选择（一般同 `color`，但会针对背景做对比度调整） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `caretColor`。⚠️ `caretColor` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `caretColor` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `caretColor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `caretColor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.caretColor._primary           // 让光标用品牌色
   * s.caretColor.transparent        // 隐藏光标（配合 JS 自定义光标）
   * ```
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.caretColor._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.caretColor._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.caretColor._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.caretColor._primary.alpha(0.6)         // token + 修饰链
   * s.caretColor._primary.darken(0.1)
   * s.caretColor._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.caretColor._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.caretColor.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 常见陷阱
   *
   * - 在 `<input type="checkbox">` / `<input type="radio">` 上无效（这些控件无文本光标）
   * - 仅在元素**聚焦时**可见
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | `auto` | — | 默认；浏览器按对比度自动选 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **57** | **53**  | **11.1** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/caret-color
   */
  caretColor: ColorPropCarrier<CssValueOf<'caretColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
     * **Syntax**: `auto | bar | block | underscore`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari | Edge | IE  |
     * | :----: | :-----: | :----: | :--: | :-: |
     * |   No   |   No    |   No   |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/caret-shape
     */
  caretShape: PropFn<CssValueOf<'caretShape'>>
  /**
   * 让元素**不与浮动元素并排** —— 在它之前的浮动元素结束之后才开始布局。配合 `float` 使用。
   *
   * ## 关键字
   *
   * ### 6 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不避开浮动 |
   * | `left` | 不与左浮动元素并排（让自己下移到左浮动元素下方） |
   * | `right` | 不与右浮动元素并排 |
   * | `both` | **最常用**：不与任何方向浮动元素并排（彻底清除浮动） |
   * | `inlineStart` | 逻辑属性：避开阅读方向起始侧的浮动 |
   * | `inlineEnd` | 逻辑属性：避开阅读方向结束侧的浮动 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `clear`。⚠️ `clear` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `clear` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `clear` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `clear` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 经典清浮动（旧）
   *
   * ```css
   * .clearfix::after {
   *   content: '';
   *   display: block;
   *   clear: both;
   * }
   * ```
   *
   * ### 现代替代
   *
   * 直接给父容器加 `display: flow-root` 即可触发 BFC 包含浮动子元素，无需 clear。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 清除方向 | `none` ｜ `left` ｜ `right` ｜ `both` ｜ `inlineStart` ｜ `inlineEnd` | 物理/逻辑方向 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/clear
   */
  clear: PropCarrier<CssValueOf<'clear'>, never, 'left' | 'right' | 'none' | 'both' | 'inlineStart' | 'inlineEnd' | GlobalKw, unknown, never>
  /**
   * **几何裁剪**:把元素显示区裁成任意形状/路径。与 mask 区别 —— clip-path 是**硬边裁切**(0/1),mask 是**alpha 渐变**。
   *
   * ## 关键字
   *
   * ### CSS 基本形状(`<basic-shape>`)
   *
   * | 形式 | 示例 | 说明 |
   * | --- | --- | --- |
   * | `inset()` | `'inset(10px 20px 30px 40px round 8px)'` | 矩形内缩裁剪,可圆角 |
   * | `circle()` | `'circle(50% at 50% 50%)'` | 圆形,半径 + 中心点 |
   * | `ellipse()` | `'ellipse(50% 30% at center)'` | 椭圆,半轴 + 中心点 |
   * | `polygon()` | `'polygon(0 0, 100% 0, 100% 100%, 0 100%)'` | 多边形顶点列表 |
   * | `path()` | `'path("M0 0 L100 0 L50 100 Z")'` | SVG path 命令 |
   * | `rect()` | `'rect(10px 90% 90% 10px)'` | 四边偏移矩形(CSS 4) |
   * | `xywh()` | `'xywh(0 0 100% 100%)'` | XY+宽高 矩形(CSS 4) |
   * | `shape()` | `'shape(from 0 0, line to 100px 0, curve to ...)'` | 声明式形状(CSS 4) |
   *
   * ### 其它取值
   *
   * | 关键字 / 形式 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无裁剪 |
   * | `<url>` | `'url(#svgClip)'` 引用 SVG `<clipPath>` |
   * | `<geometry-box>` | `border-box` / `padding-box` / `content-box` / `margin-box` / `fill-box` / `stroke-box` / `view-box`,定义裁切参照盒 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `clipPath`。⚠️ `clipPath` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `clipPath` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `clipPath` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `clipPath` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **典型用法**:
   * ```ts
   * s.clipPath('circle(50%)')                          // 圆形头像
   * s.clipPath('polygon(0 0, 100% 0, 100% 80%, 0 100%)')  // 斜切底边
   * s.clipPath('inset(0 round 8px)')                   // 仅圆角裁切(等同 border-radius 但更强)
   * s.clipPath('url(#myClip)')                         // 引用 SVG <clipPath>
   * ```
   *
   * **配合动画**:同类形状之间(如 `circle` ↔ `circle`、`polygon` 顶点数相同)可平滑 transition,跨类不可。
   *
   * **已废弃** `clip` 属性(矩形裁剪) —— 用 `clip-path: inset(...)` 替代。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 基本形状 | `'circle(50%)'` `'polygon(...)'` `'inset(...)'` | 见上 |
   * | SVG 引用 | `'url(#clipId)'` | 复用 SVG `<clipPath>` |
   * | 几何盒 | `'border-box'` `'view-box'` | 改裁切基准 |
   * | `none` | — | 无裁剪 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :------: | :-----: | :-----: | :----: | :----: |
   * |  **55**  | **3.5** | **9.1** | **79** | **10** |
   * | 23 _-x-_ |         | 7 _-x-_ |        |        |
   *
   * `path()` Chrome 88+ / Safari 13.1+ / Firefox 97+。`shape()` Chrome 130+(2024 末新)。SVG `<clipPath>` 引用所有现代浏览器都支持。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/clip-path
   */
  clipPath: PropFn<CssValueOf<'clipPath'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `nonzero | evenodd`
     *
     * **Initial value**: `nonzero`
     *
     * | Chrome  | Firefox | Safari |  Edge  | IE  |
     * | :-----: | :-----: | :----: | :----: | :-: |
     * | **≤15** | **3.5** | **≤5** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/clip-rule
     */
  clipRule: PropFn<CssValueOf<'clipRule'>>
  /**
   * 设置元素的**前景色** —— 文字色，并作为 `currentColor` 源被 `border-color` / `outline-color` / svg `fill` / `caret-color` 等在未显式设置时引用。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白 |
   * | `black` | `#000000` | 纯黑 |
   * | `transparent` | `rgba(0,0,0,0)` | 完全透明；用于渐变端点比直接写透明色更稳定（避免某些浏览器在 alpha=0 时丢色相） |
   * | `currentColor` | 引用当前层级 `color` | 让 border / outline / svg fill 跟随文字色（"跟随文字色"最常用关键字） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `color`。⚠️ `color` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `canvastext` |
   * | `unset` | `color` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `color` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `color` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * `color` 作用范围远超"文字色"：
   * 1. **文字主色**（所有未被 `::selection` / 子元素覆盖的文字）
   * 2. **文本装饰线**（`text-decoration-color` 未设时跟随）
   * 3. **`currentColor` 链的源头**：`border-color` / `outline-color` / svg `fill` / `stroke` /
   *    `caret-color` 等未显式设置时都回退到 `currentColor`，即沿用当前 `color`
   * 4. 调一处 `color` 可联动一组相关视觉，无需写一堆 `borderColor` / `fill`
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.color._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.color._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.color._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.color._primary.alpha(0.6)         // token + 修饰链
   * s.color._primary.darken(0.1)
   * s.color._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.color._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.color.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 常见陷阱
   *
   * - `currentColor` 是**动态引用**：父元素 `color` 改了，子元素用 `currentColor` 的属性都跟着变
   * - 继承属性，给容器设了会影响所有未单独设色的子元素（包括 svg `<use>` / `<symbol>`）
   * - `transparent` 视觉上等同 `rgba(0,0,0,0)`，但渐变 / `color-mix()` 中行为更稳定（前者保留色相，后者可能丢）
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `canvastext`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **3** |
   *
   * 远古属性，所有浏览器都支持。OKLCH / `color-mix()` / `<system-color>` 等 CSS 4/5 新形式需较新浏览器（2023+）。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/color
   */
  color: ColorPropCarrier<CssValueOf<'color'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
     * Since May 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `economy | exact`
     *
     * **Initial value**: `economy`
     *
     * |  Chrome  |       Firefox       |  Safari  |   Edge   | IE  |
     * | :------: | :-----------------: | :------: | :------: | :-: |
     * | **136**  |       **97**        | **15.4** | **136**  | No  |
     * | 17 _-x-_ | 48 _(color-adjust)_ | 6 _-x-_  | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/print-color-adjust
     */
  colorAdjust: PropFn<CssValueOf<'colorAdjust'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | sRGB | linearRGB`
     *
     * **Initial value**: `linearRGB`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **1**  |  **3**  | **3**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/color-interpolation-filters
     */
  colorInterpolationFilters: PropFn<CssValueOf<'colorInterpolationFilters'>>
  /**
   * 告诉浏览器元素支持**哪种配色模式**（light / dark） —— 让原生表单 / 滚动条 / 系统色等自动适配。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。无明确偏好，浏览器使用 light |
   * | `light` | 仅支持浅色（强制浅色 UI） |
   * | `dark` | 仅支持深色（强制深色 UI） |
   * | `lightDark` | **两种都支持**（让浏览器根据用户系统主题自动切换） |
   * | `only` | 关键字修饰符：`only light` 表示严格只支持 light（关闭浏览器自动 dark mode） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `colorScheme`。⚠️ `colorScheme` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `colorScheme` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `colorScheme` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `colorScheme` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```html
   * <html style="color-scheme: light dark">
   * <!-- 浏览器原生 <input> / <select> / 滚动条都会跟随系统主题切换 -->
   * ```
   *
   * ```ts
   * s.colorScheme.lightDark              // 推荐：跟随系统
   * s.colorScheme.light                  // 强制浅色
   * s.colorScheme('only light')          // 严格浅色，禁用浏览器自动 dark
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个 keyword | `normal` ｜ `light` ｜ `dark` ｜ `lightDark` ｜ `only` | 只接受关键字 |
   * | 组合 | `'light dark'` `'only light'` | 空格分隔 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **81** | **96**  | **13** | **81** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/color-scheme
   */
  colorScheme: PropCarrier<CssValueOf<'colorScheme'>, never, 'normal' | 'light' | 'dark' | 'lightDark' | 'only' | GlobalKw, unknown, never>
  /**
   * 指定**栏数**（多栏布局的简单方式）。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。按 column-width 决定 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `columnCount`。⚠️ `columnCount` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `columnCount` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `columnCount` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `columnCount` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<integer>` | `2` `3` `4` | 栏数 |
   * | `auto` | — | 自动 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **50**  | **52**  |  **9**  | **12** | **10** |
   * | 1 _-x-_ |         | 3 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-count
   */
  columnCount: PropCarrier<CssValueOf<'columnCount'>, never, 'auto' | GlobalKw, unknown, never>
  /**
   * 决定多栏内容如何**填充各栏** —— 平衡（每栏内容等高）还是顺序填充（先填满第一栏再换下一栏）。
   *
   * ## 关键字
   *
   * ### 3 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `balance` | **默认值**。**平衡填充** —— 内容均分到各栏让每栏内容高度接近（最常用） |
   * | `auto` | **顺序填充** —— 先填满前一栏再填下一栏 |
   * | `balanceAll` | 所有 column-break 区域都平衡（不只是最后一段） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `columnFill`。⚠️ `columnFill` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `balance` |
   * | `unset` | `columnFill` 非继承属性 → 等同 `initial`（= `balance`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `columnFill` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `columnFill` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 3 个 keyword | `balance` ｜ `auto` ｜ `balanceAll` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `balance`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |   IE   |
   * | :----: | :-----: | :-----: | :----: | :----: |
   * | **50** | **52**  |  **9**  | **12** | **10** |
   * |        |         | 8 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-fill
   */
  columnFill: PropCarrier<CssValueOf<'columnFill'>, never, 'auto' | 'balance' | 'balanceAll' | GlobalKw, unknown, never>
  /**
   * 仅设置**列间距**（水平方向）。可单独覆盖 `gap` 简写的列间距值。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。flex/grid 中等于 `0`；多栏布局中浏览器默认值 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `columnGap`。⚠️ `columnGap` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `columnGap` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `columnGap` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `columnGap` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写：1 或 2 个值
   *
   * ```ts
   * s.gap.px(12)                  // 行列都 12px
   * s.gap('12px 24px')            // 行间距 12px，列间距 24px
   * ```
   *
   * 等价于：
   *
   * ```ts
   * s.rowGap.px(12)
   * s.columnGap.px(24)
   * ```
   *
   * ### gap vs margin
   *
   * | 方案 | 边缘多余间距 | 适应换行 |
   * | --- | --- | --- |
   * | `gap` | ✗ 无 | ✓ 自动 |
   * | `margin` | ✓ 有（需配合 `:first-child` 等） | ✗ 需手动处理 |
   *
   * `gap` 是现代 CSS 推荐方案。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.gap.px(200)         ≡ s.gap('200px')
   * s.gap.rem(1.5)        ≡ s.gap('1.5rem')
   * s.gap.em(2)           ≡ s.gap('2em')      // 当前元素 font-size 的倍数
   * s.gap.vw(50)          ≡ s.gap('50vw')     // 视口宽 1%
   * s.gap.dvw(50)         ≡ s.gap('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.gap.cqw(50)         ≡ s.gap('50cqw')    // container query 容器尺寸
   * s.gap.percent(50)     ≡ s.gap('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.gap('calc(100% - 32px)')
   * s.gap('min(100%, 1200px)')
   * s.gap('max(280px, 50%)')
   * s.gap('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 1 个 `<length>` | `'12px'` `'1rem'` | 行列相同 |
   * | 2 个 `<length>` | `'12px 24px'` | 行间距 / 列间距 |
   * | `<percentage>` | `'5%'` | 相对容器尺寸 |
   * | `normal` | — | 默认；flex/grid 中等于 0 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE   |
   * | :----: | :-----: | :----: | :----: | :----: |
   * | **1**  | **1.5** | **3**  | **12** | **10** |
   *
   * flex `gap` 较晚普及：Chrome 84 / Firefox 63 / Safari 14.1。早期可用 margin + 负 margin 兼容方案。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-gap
   */
  columnGap: PropCarrier<CssValueOf<'columnGap'>, SpacingTokens<T>, 'normal' | GlobalKw, LengthUnits, never>
  /**
   * 设置**多栏布局**（`column-count` / `columns`）中**栏间分隔线**的颜色。类似栏间的 border。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白 |
   * | `black` | `#000000` | 纯黑 |
   * | `transparent` | `rgba(0,0,0,0)` | 透明分隔线（不可见） |
   * | `currentColor` | **默认值**，跟随 `color` | 分隔线跟随文字色 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `columnRuleColor`。⚠️ `columnRuleColor` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `currentColor` |
   * | `unset` | `columnRuleColor` 非继承属性 → 等同 `initial`（= `currentColor`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `columnRuleColor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `columnRuleColor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 多栏布局示例
   *
   * ```ts
   * s.columns(3)                          // 三栏
   *   .columnRuleStyle.solid
   *   .columnRuleWidth.px(1)
   *   .columnRuleColor._textDisabled      // 灰色分隔线
   * ```
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.columnRuleColor._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.columnRuleColor._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.columnRuleColor._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.columnRuleColor._primary.alpha(0.6)         // token + 修饰链
   * s.columnRuleColor._primary.darken(0.1)
   * s.columnRuleColor._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.columnRuleColor._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.columnRuleColor.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 配合 columnRuleStyle / columnRuleWidth
   *
   * 类似边框三件套：必须同时设 `columnRuleStyle`（默认是 `none`），否则线不显示。
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `currentColor`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **50**  | **52**  |  **9**  | **12** | **10** |
   * | 1 _-x-_ |         | 3 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-rule-color
   */
  columnRuleColor: ColorPropCarrier<CssValueOf<'columnRuleColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
   * 设置**多栏布局**中**栏间分隔线**的样式。规则同 `borderStyle`。⚠️ 必须设非 `none` 才显示。
   *
   * ## 关键字
   *
   * ### 10 个样式关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。完全无边框，不占任何空间 |
   * | `hidden` | 视觉效果同 `none`（无边框），但在**表格冲突边框解析**中优先级高于 `none` |
   * | `dotted` | **点状**虚线边框（圆点） |
   * | `dashed` | **虚线**边框（短横线） |
   * | `solid` | **实线**边框（最常用） |
   * | `double` | **双线**边框（两条平行实线 + 中间空隙；总宽 ≥ 3px 才能看出效果） |
   * | `groove` | **凹槽**：模拟凹下去的边框（3D 效果，浏览器渲染差异大） |
   * | `ridge` | **凸脊**：模拟凸起的边框（3D 效果，与 `groove` 视觉相反） |
   * | `inset` | **凹陷**：让元素看起来嵌入页面（上左暗，下右亮） |
   * | `outset` | **凸起**：让元素看起来浮出页面（上左亮，下右暗） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `columnRuleStyle`。⚠️ `columnRuleStyle` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `columnRuleStyle` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `columnRuleStyle` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `columnRuleStyle` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 重要：边框三件套
   *
   * CSS 边框需要 **width + style + color** 三件齐全才显示：
   *
   * - `borderWidth` 默认 `medium`（≈3px）✓
   * - `borderStyle` 默认 `none` ✗ **必须显式设**
   * - `borderColor` 默认 `currentColor`（跟随文字色）✓
   *
   * ### hidden vs none 在表格中
   *
   * `borderCollapse: collapse` 时，相邻单元格边框冲突解析：
   * - `hidden` 优先级**最高**，强制不显示
   * - `none` 优先级**最低**，让对方边框显示
   *
   * ### 简写：1/2/3/4 值
   *
   * ```ts
   * s.borderStyle.solid                            // 四边 solid
   * s.borderStyle('solid dashed')                  // 上下 solid，左右 dashed
   * s.borderStyle('solid dashed dotted none')      // 上 / 右 / 下 / 左
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 10 个 keyword | `none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset` | 同 borderStyle |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **50**  | **52**  |  **9**  | **12** | **10** |
   * | 1 _-x-_ |         | 3 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-rule-style
   */
  columnRuleStyle: PropCarrier<CssValueOf<'columnRuleStyle'>, never, 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | GlobalKw, unknown, never>
  /**
   * 设置**多栏布局**（`columns` / `columnCount`）中**栏间分隔线**的宽度。规则同 `borderWidth`。
   *
   * ## 关键字
   *
   * ### 3 个尺寸关键字（浏览器约定值）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `thin` | 细边框（约 **1px**；具体由浏览器决定） |
   * | `medium` | 中等边框（**默认值**，约 **3px**） |
   * | `thick` | 粗边框（约 **5px**） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `columnRuleWidth`。⚠️ `columnRuleWidth` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `medium` |
   * | `unset` | `columnRuleWidth` 非继承属性 → 等同 `initial`（= `medium`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `columnRuleWidth` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `columnRuleWidth` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写：1/2/3/4 值
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `borderWidth.px(1)` | 四边均为 1px |
   * | `borderWidth('1px 2px')` | 上下 1px，左右 2px |
   * | `borderWidth('1px 2px 3px 4px')` | 上 / 右 / 下 / 左（顺时针） |
   *
   * ### 必须配合 borderStyle
   *
   * ```ts
   * // ❌ 不显示
   * s.borderWidth.px(2)
   * s.borderColor._primary
   * // ✅
   * s.borderWidth.px(2)
   * s.borderStyle.solid
   * s.borderColor._primary
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderWidth.px(200)         ≡ s.borderWidth('200px')
   * s.borderWidth.rem(1.5)        ≡ s.borderWidth('1.5rem')
   * s.borderWidth.em(2)           ≡ s.borderWidth('2em')      // 当前元素 font-size 的倍数
   * s.borderWidth.vw(50)          ≡ s.borderWidth('50vw')     // 视口宽 1%
   * s.borderWidth.dvw(50)         ≡ s.borderWidth('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderWidth.cqw(50)         ≡ s.borderWidth('50cqw')    // container query 容器尺寸
   * s.borderWidth.percent(50)     ≡ s.borderWidth('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderWidth('calc(100% - 32px)')
   * s.borderWidth('min(100%, 1200px)')
   * s.borderWidth('max(280px, 50%)')
   * s.borderWidth('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'1px'` `'2px'` | 具体长度 |
   * | 3 个 keyword | `thin` ｜ `medium` ｜ `thick` | 浏览器约定值 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `medium`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **50**  | **52**  |  **9**  | **12** | **10** |
   * | 1 _-x-_ |         | 3 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-rule-width
   */
  columnRuleWidth: PropCarrier<CssValueOf<'columnRuleWidth'>, BordersTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * 让元素**跨越所有栏**（多栏内容中的标题 / 横幅常用）。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不跨栏（正常分栏） |
   * | `all` | **横跨所有栏**（撑满容器宽度） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `columnSpan`。⚠️ `columnSpan` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `columnSpan` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `columnSpan` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `columnSpan` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 多栏内容里的章节标题
   * s.columnSpan.all          // 跨栏显示
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `none` ｜ `all` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari   |  Edge  |   IE   |
   * | :-----: | :-----: | :-------: | :----: | :----: |
   * | **50**  | **71**  |   **9**   | **12** | **10** |
   * | 6 _-x-_ |         | 5.1 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-span
   */
  columnSpan: PropCarrier<CssValueOf<'columnSpan'>, never, 'none' | 'all' | GlobalKw, unknown, never>
  /**
   * 指定**每栏的理想宽度**（栏数由容器宽度自动算）。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值** |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `columnWidth`。⚠️ `columnWidth` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `columnWidth` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `columnWidth` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `columnWidth` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.columnWidth.px(250)
   * // 容器 800px → 3 栏（800/250 = 3.2，向下取整）
   * // 容器 600px → 2 栏
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.columnWidth.px(200)         ≡ s.columnWidth('200px')
   * s.columnWidth.rem(1.5)        ≡ s.columnWidth('1.5rem')
   * s.columnWidth.em(2)           ≡ s.columnWidth('2em')      // 当前元素 font-size 的倍数
   * s.columnWidth.vw(50)          ≡ s.columnWidth('50vw')     // 视口宽 1%
   * s.columnWidth.dvw(50)         ≡ s.columnWidth('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.columnWidth.cqw(50)         ≡ s.columnWidth('50cqw')    // container query 容器尺寸
   * s.columnWidth.percent(50)     ≡ s.columnWidth('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.columnWidth('calc(100% - 32px)')
   * s.columnWidth('min(100%, 1200px)')
   * s.columnWidth('max(280px, 50%)')
   * s.columnWidth('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'250px'` `'20em'` | 理想宽度 |
   * | `auto` | — | 自动 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **50**  | **50**  |  **9**  | **12** | **10** |
   * | 1 _-x-_ |         | 3 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-width
   */
  columnWidth: PropCarrier<CssValueOf<'columnWidth'>, never, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * **containment 隔离** —— 告诉浏览器本元素子树**不会影响**外部布局/绘制/样式,允许跳过子树的渲染开销。性能优化属性。
   *
   * ## 关键字
   *
   * ### 6 个关键字
   *
   * | 关键字 | 隔离范围 | 常用场景 |
   * | --- | --- | --- |
   * | `none` | **默认值**。无隔离 | 一般元素 |
   * | `strict` | = `size layout paint style`,**最强**隔离 | 复杂卡片 / 列表项 |
   * | `content` | = `layout paint style`,**不**含 size(子尺寸仍影响父) | 可滚动列表 / 折叠面板 |
   * | `size` | 子布局不影响本元素尺寸(必须配自给尺寸,否则坍缩) | 虚拟列表项 |
   * | `layout` | 子布局不影响外部 | 复杂组件根 |
   * | `paint` | 子内容不绘制到本元素外 | 溢出隐藏区 |
   * | `style` | CSS counter/quotes 等不向外冒泡 | 罕用 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `contain`。⚠️ `contain` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `contain` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `contain` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `contain` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **注意**:`contain: size` 不配 `contain-intrinsic-size` 会让元素坍缩到 0×0。
   *
   * **典型用法**:
   * ```ts
   * s.contain('content')                  // 列表项最常用,平衡性能与正确性
   * s.contain('strict')                   // 必须配 width/height 或 contain-intrinsic-size
   * s.contain('layout paint')             // 组合多个 keyword
   * ```
   *
   * **与 container queries 关系**:`container-type: size` 隐含 `contain: size layout style paint`(完整 containment);`container-type: inline-size` 隐含 `contain: inline-size layout style paint`。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 单一 | `none` / `strict` / `content` / `size` / `layout` / `paint` / `style` | 见上 |
   * | 多个 | `'layout paint'` | 空格组合(`size layout paint style` 任意子集) |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **52** | **69**  | **15.4** | **79** | No  |
   *
   * Chrome 52+ / Safari 15.4+ / Firefox 69+,稳定可用。`content-visibility` 配套使用效益更高。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/contain
   */
  contain: PropFn<CssValueOf<'contain'>>
  /**
   * `contain-intrinsic-size` 的**块轴分量**(逻辑属性版,跟随 `writing-mode`)。详情见 [`contain-intrinsic-size`]。
   *
   * ## 关键字
   *
   * ### 取值形式
   *
   * | 形式 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无内禀尺寸,可能坍缩 |
   * | `auto <length>` | **推荐**。`auto` 让浏览器记住实际渲染尺寸;`<length>` 是首次渲染前的占位 |
   * | `<length>` | 固定内禀宽 = 高 = N |
   * | `<length> <length>` | 分别设宽 高 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `containIntrinsicBlockSize`。⚠️ `containIntrinsicBlockSize` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `containIntrinsicBlockSize` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `containIntrinsicBlockSize` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `containIntrinsicBlockSize` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **核心用途**:与 `content-visibility: auto` 配合实现**虚拟滚动列表**:
   *
   * ```ts
   * s.contentVisibility('auto')
   * s.containIntrinsicSize('auto 200px')   // 预估每项 200px 高
   * // → 视口外的项跳过渲染,布局滚动条仍准确
   * ```
   *
   * `auto` 让浏览器记住实际渲染过的尺寸,**滚动回去时复用**,避免抖动。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | 无内禀尺寸 |
   * | `auto <length>` | `'auto 200px'` `'auto 100px 200px'` | 推荐:auto + 占位 |
   * | `<length>` | `'200px'` `'100px 200px'` | 固定占位 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **95** | **107** | **17** | **95** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/contain-intrinsic-block-size
   */
  containIntrinsicBlockSize: PropFn<CssValueOf<'containIntrinsicBlockSize'>>
  /**
   * `contain-intrinsic-size` 的**高度分量**(单轴版)。详情见 [`contain-intrinsic-size`]。
   *
   * ## 关键字
   *
   * ### 取值形式
   *
   * | 形式 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无内禀尺寸,可能坍缩 |
   * | `auto <length>` | **推荐**。`auto` 让浏览器记住实际渲染尺寸;`<length>` 是首次渲染前的占位 |
   * | `<length>` | 固定内禀宽 = 高 = N |
   * | `<length> <length>` | 分别设宽 高 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `containIntrinsicHeight`。⚠️ `containIntrinsicHeight` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `containIntrinsicHeight` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `containIntrinsicHeight` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `containIntrinsicHeight` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **核心用途**:与 `content-visibility: auto` 配合实现**虚拟滚动列表**:
   *
   * ```ts
   * s.contentVisibility('auto')
   * s.containIntrinsicSize('auto 200px')   // 预估每项 200px 高
   * // → 视口外的项跳过渲染,布局滚动条仍准确
   * ```
   *
   * `auto` 让浏览器记住实际渲染过的尺寸,**滚动回去时复用**,避免抖动。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | 无内禀尺寸 |
   * | `auto <length>` | `'auto 200px'` `'auto 100px 200px'` | 推荐:auto + 占位 |
   * | `<length>` | `'200px'` `'100px 200px'` | 固定占位 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **95** | **107** | **17** | **95** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/contain-intrinsic-height
   */
  containIntrinsicHeight: PropFn<CssValueOf<'containIntrinsicHeight'>>
  /**
   * `contain-intrinsic-size` 的**行轴分量**(逻辑属性版,跟随 `writing-mode`)。详情见 [`contain-intrinsic-size`]。
   *
   * ## 关键字
   *
   * ### 取值形式
   *
   * | 形式 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无内禀尺寸,可能坍缩 |
   * | `auto <length>` | **推荐**。`auto` 让浏览器记住实际渲染尺寸;`<length>` 是首次渲染前的占位 |
   * | `<length>` | 固定内禀宽 = 高 = N |
   * | `<length> <length>` | 分别设宽 高 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `containIntrinsicInlineSize`。⚠️ `containIntrinsicInlineSize` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `containIntrinsicInlineSize` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `containIntrinsicInlineSize` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `containIntrinsicInlineSize` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **核心用途**:与 `content-visibility: auto` 配合实现**虚拟滚动列表**:
   *
   * ```ts
   * s.contentVisibility('auto')
   * s.containIntrinsicSize('auto 200px')   // 预估每项 200px 高
   * // → 视口外的项跳过渲染,布局滚动条仍准确
   * ```
   *
   * `auto` 让浏览器记住实际渲染过的尺寸,**滚动回去时复用**,避免抖动。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | 无内禀尺寸 |
   * | `auto <length>` | `'auto 200px'` `'auto 100px 200px'` | 推荐:auto + 占位 |
   * | `<length>` | `'200px'` `'100px 200px'` | 固定占位 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **95** | **107** | **17** | **95** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/contain-intrinsic-inline-size
   */
  containIntrinsicInlineSize: PropFn<CssValueOf<'containIntrinsicInlineSize'>>
  /**
   * `contain-intrinsic-size` 的**宽度分量**(单轴版)。详情见 [`contain-intrinsic-size`]。
   *
   * ## 关键字
   *
   * ### 取值形式
   *
   * | 形式 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无内禀尺寸,可能坍缩 |
   * | `auto <length>` | **推荐**。`auto` 让浏览器记住实际渲染尺寸;`<length>` 是首次渲染前的占位 |
   * | `<length>` | 固定内禀宽 = 高 = N |
   * | `<length> <length>` | 分别设宽 高 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `containIntrinsicWidth`。⚠️ `containIntrinsicWidth` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `containIntrinsicWidth` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `containIntrinsicWidth` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `containIntrinsicWidth` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **核心用途**:与 `content-visibility: auto` 配合实现**虚拟滚动列表**:
   *
   * ```ts
   * s.contentVisibility('auto')
   * s.containIntrinsicSize('auto 200px')   // 预估每项 200px 高
   * // → 视口外的项跳过渲染,布局滚动条仍准确
   * ```
   *
   * `auto` 让浏览器记住实际渲染过的尺寸,**滚动回去时复用**,避免抖动。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | 无内禀尺寸 |
   * | `auto <length>` | `'auto 200px'` `'auto 100px 200px'` | 推荐:auto + 占位 |
   * | `<length>` | `'200px'` `'100px 200px'` | 固定占位 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **95** | **107** | **17** | **95** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/contain-intrinsic-width
   */
  containIntrinsicWidth: PropFn<CssValueOf<'containIntrinsicWidth'>>
  /**
   * 本元素的**容器名** —— 给 `@container <name> (...)` 引用,实现"按名定向查询"。
   *
   * ## 关键字
   *
   * ### 取值
   *
   * | 形式 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。匿名容器(只能用 `@container (...)` 无名查询匹配最近祖先) |
   * | `<custom-ident>` | `'card'` `'sidebar'` 等自定义名;`@container card (...)` 只匹配同名容器 |
   * | 多个名 | `'card sidebar'` 同时拥有多个名;空格分隔 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `containerName`。⚠️ `containerName` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `containerName` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `containerName` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `containerName` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **为什么要给容器命名**?多层嵌套容器时,匿名查询只匹配**最近**的查询容器,可能不是你期望的那层。命名让你跳过中间层,精确指向需要的容器。
   *
   * ```ts
   * // 外层 card 容器
   * s.container('card / inline-size')
   * //   ... 中间层(可能也是匿名容器)
   * //      .item:子节点想响应外层 card,而非中间层 → @container card (min-width: 400px) { ... }
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<custom-ident>` | `'card'` `'main-grid'` | 自定义名,字母数字 + `-`/`_` 开头 |
   * | 多个 | `'card sidebar'` | 空格分隔 |
   * | `none` | — | 匿名 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari |  Edge   | IE  |
   * | :-----: | :-----: | :----: | :-----: | :-: |
   * | **105** | **110** | **16** | **105** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/container-name
   */
  containerName: PropFn<CssValueOf<'containerName'>>
  /**
   * 本元素的**容器查询类型** —— 决定 `@container` 查询能查询哪些维度。
   *
   * ## 关键字
   *
   * ### 3 个关键字
   *
   * | 关键字 | 允许查询 | 布局副作用 |
   * | --- | --- | --- |
   * | `normal` | **默认值**。**不**作为查询容器 | 无副作用 |
   * | `inline-size` | 查询**主轴**尺寸(横向布局时 = 宽度) | 主轴含布局/样式/绘制 containment;子树不能 affect 外层宽度 |
   * | `size` | 查询**两个轴**尺寸(宽 + 高) | 两轴 containment;**子树必须明确尺寸**(否则布局崩),通常需配 `contain-intrinsic-size` |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `containerType`。⚠️ `containerType` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `containerType` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `containerType` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `containerType` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **陷阱:为什么 `size` 比 `inline-size` 罕见**?
   *
   * `size` 在两个轴都建 containment,意味着**容器自身高度不能由子内容撑开**(否则就是循环依赖:子靠容器尺寸决定 layout,容器靠子撑开)。所以 `size` 需要容器**显式设高度**或配 `contain-intrinsic-size` 给个 placeholder 尺寸。
   *
   * 绝大多数场景用 `inline-size` —— 仅查询宽度,高度仍由内容撑开,无布局副作用。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `normal` / `inline-size` / `size` | 见上 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari |  Edge   | IE  |
   * | :-----: | :-----: | :----: | :-----: | :-: |
   * | **105** | **110** | **16** | **105** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/container-type
   */
  containerType: PropFn<CssValueOf<'containerType'>>
  /**
   * 在 `::before` / `::after` 伪元素中**插入内容**（文字 / 图片 / counter 数值 / attr）。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**（普通元素上）。不生成内容 |
   * | `normal` | 伪元素默认值（等同 `none` 在 ::before / ::after 上） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `content`。⚠️ `content` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `content` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `content` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `content` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态：常见值
   *
   * ```ts
   * // 字符串
   * s.content("'★'")                      // 引号必须
   *
   * // 引用 attr
   * s.content("attr(data-tip)")           // 显示元素的 data-tip 属性值
   *
   * // counter
   * s.content("counter(section)")         // 当前 section 计数器值
   *
   * // 图片
   * s.content("url('/icons/check.svg')")
   *
   * // 多个组合
   * s.content("counter(item) '. '")
   * ```
   *
   * ### 用例：清浮动 hack（旧）
   *
   * ```ts
   * // ::after
   * s.content("''")
   * s.display.block
   * s.clear.both
   * ```
   *
   * ### 现代替代
   *
   * `display: flow-root` 已取代清浮动 hack；`content` 现在主要用于**伪元素装饰内容**。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | 不生成 |
   * | `normal` | — | 伪元素默认 |
   * | 字符串 | `"'★'"` | 内嵌单引号 |
   * | `attr()` | `'attr(data-x)'` | 引用属性值 |
   * | `counter()` | `'counter(section)'` | CSS 计数器 |
   * | URL | `"url('/icon.svg')"` | 图片 |
   * | 组合 | `"counter(item) '. '"` | 空格连接多个值 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **8** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/content
   */
  content: PropCarrier<CssValueOf<'content'>, never, 'none' | 'normal' | GlobalKw, unknown, never>
  /**
   * **内容可见性优化** —— 浏览器对视口外子树**跳过渲染**(类似 `display: none` 但保留可达性 + 自动复活)。性能利器,通常配 `contain-intrinsic-size` 使用。
   *
   * ## 关键字
   *
   * ### 3 个关键字
   *
   * | 关键字 | 行为 | 何时用 |
   * | --- | --- | --- |
   * | `visible` | **默认值**。正常渲染 | 一般元素 |
   * | `auto` | 视口外**跳过**渲染(layout / style / paint),进入视口**自动恢复**;不影响 a11y/find-in-page | 长列表 / 文档站每个 section |
   * | `hidden` | **始终**跳过渲染(类似 `display: none` 但保留布局空间状态可瞬间恢复) | 手动管理的虚拟列表 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `contentVisibility`。⚠️ `contentVisibility` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `visible` |
   * | `unset` | `contentVisibility` 非继承属性 → 等同 `initial`（= `visible`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `contentVisibility` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `contentVisibility` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **与 `display: none` 区别**:
   * - `display: none` —— 元素**不存在**于布局,Tab 不到,find-in-page 找不到
   * - `content-visibility: hidden` —— **保留**布局占位 + a11y / find-in-page 可达,只是不绘制
   * - `content-visibility: auto` —— 上述基础上**自动**在视口边界激活/休眠
   *
   * **必须配 `contain-intrinsic-size`** 否则视口外元素坍缩,滚动条乱跳:
   * ```ts
   * s.contentVisibility('auto')
   * s.containIntrinsicSize('auto 300px')   // 预估占位高度
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `visible` / `auto` / `hidden` | 见上 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `visible`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **85** | **125** | **18** | **85** | No  |
   *
   * Chrome 85+ / Edge 85+ / Safari 18+(2024)。Firefox 暂不支持(2026 中状态)。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/content-visibility
   */
  contentVisibility: PropFn<CssValueOf<'contentVisibility'>>
  /**
   * **递增 CSS 计数器**（每遇到该元素时计数器 +1，或自定义增量）。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不递增 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `counterIncrement`。⚠️ `counterIncrement` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `counterIncrement` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `counterIncrement` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `counterIncrement` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | 默认 |
   * | 名称 | `'chapter'` | 递增 1 |
   * | 名称 + 数字 | `'chapter 2'` | 递增指定值（可负 = 递减） |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **2**  |  **1**  | **3**  | **12** | **8** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/counter-increment
   */
  counterIncrement: PropCarrier<CssValueOf<'counterIncrement'>, never, 'none' | GlobalKw, unknown, never>
  /**
   * **重置 CSS 计数器**到指定值（默认 0）。配合 `content: counter(...)` 实现自定义编号。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不重置任何计数器 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `counterReset`。⚠️ `counterReset` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `counterReset` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `counterReset` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `counterReset` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：章节编号
   *
   * ```ts
   * // 在容器上重置 chapter
   * s.counterReset('chapter')
   *
   * // 每个 <h2> 上递增并显示
   * // h2: s.counterIncrement('chapter')
   * // h2::before: s.content("'第 ' counter(chapter) ' 章 '")
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | 默认 |
   * | 名称 | `'chapter'` | 重置为 0 |
   * | 名称 + 数字 | `'chapter 5'` | 重置为指定值 |
   * | 多个计数器 | `'chapter section 0'` | 空格分隔 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **2**  |  **1**  | **3**  | **12** | **8** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/counter-reset
   */
  counterReset: PropCarrier<CssValueOf<'counterReset'>, never, 'none' | GlobalKw, unknown, never>
  /**
   * **设置 CSS 计数器**到指定值（不依赖前值）。与 `counterReset` 类似但语义更强：明确设置而非"重置"。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不设置 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `counterSet`。⚠️ `counterSet` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `counterSet` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `counterSet` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `counterSet` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | 默认 |
   * | 名称 + 数字 | `'chapter 5'` | 设为指定值 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **85** | **68**  | **17.2** | **85** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/counter-set
   */
  counterSet: PropCarrier<CssValueOf<'counterSet'>, never, 'none' | GlobalKw, unknown, never>
  /**
   * 设置元素**鼠标指针**的样式 —— 箭头 / 手型 / 文字光标 / 等待 / 拖动 / 调整方向等。
   *
   * ## 关键字
   *
   * ### 通用 / 自动
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器按上下文自动选（可点击元素 → pointer，文字 → text 等） |
   * | `default` | 操作系统默认指针（箭头 ↖） |
   * | `none` | 隐藏指针 |
   *
   * ### 交互类（最常用）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `pointer` | **手型**（表示可点击 —— 链接、按钮） |
   * | `text` | 文字光标 I 字（表示文本可选） |
   * | `verticalText` | 垂直文字光标（竖排文本） |
   * | `wait` | 沙漏 / 转圈（等待） |
   * | `progress` | 箭头 + 沙漏（操作中但仍可交互） |
   * | `help` | 问号 ?（hover 显示帮助） |
   * | `contextMenu` | 右键菜单图标 |
   * | `cell` | 十字形（表格单元选择，如 Excel） |
   * | `crosshair` | 十字线（精确选择，画图工具） |
   *
   * ### 拖放类
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `move` | 十字双箭头（可移动） |
   * | `grab` | 手掌张开（可抓取） |
   * | `grabbing` | 手掌握紧（抓取中） |
   * | `alias` | 快捷方式箭头 |
   * | `copy` | 加号（复制） |
   * | `notAllowed` | 禁止符号 🚫 |
   * | `noDrop` | 禁止符号（不允许放下） |
   *
   * ### 缩放类
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `allScroll` | 四向箭头（可朝任意方向滚动） |
   * | `zoomIn` | 放大镜 +（可放大） |
   * | `zoomOut` | 放大镜 -（可缩小） |
   *
   * ### 调整大小（resize）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `colResize` | 左右双箭头（调整列宽） |
   * | `rowResize` | 上下双箭头（调整行高） |
   * | `eResize` / `wResize` | 左右单向（东 / 西方向调整） |
   * | `nResize` / `sResize` | 上下单向（北 / 南方向调整） |
   * | `neResize` `nwResize` `seResize` `swResize` | 4 个对角线方向（东北 / 西北 / 东南 / 西南） |
   * | `ewResize` / `nsResize` | 横 / 纵双向调整 |
   * | `neswResize` / `nwseResize` | 对角线双向调整 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `cursor`。⚠️ `cursor` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `cursor` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `cursor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `cursor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 自定义图片光标
   *
   * ```ts
   * s.cursor("url('/cursors/sword.png'), pointer")     // 自定义 + 兜底关键字
   * s.cursor("url('/sword.png') 16 16, pointer")       // 带热点坐标（图片中心点偏移）
   * ```
   *
   * ### 限制
   *
   * - 自定义图片需 ≤ 128×128 像素（多数浏览器）
   * - 必须**带兜底关键字**（如上例的 `pointer`），否则浏览器加载失败时无指针
   * - iOS Safari **完全忽略 cursor**（触摸设备无指针概念）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 通用 | `auto` ｜ `default` ｜ `none` | 基础 |
   * | 交互 | `pointer` ｜ `text` ｜ `wait` ｜ `progress` ｜ `help` ｜ `contextMenu` ｜ `cell` ｜ `crosshair` ｜ `verticalText` | 最常用 |
   * | 拖放 | `move` ｜ `grab` ｜ `grabbing` ｜ `alias` ｜ `copy` ｜ `notAllowed` ｜ `noDrop` | 拖放交互 |
   * | 缩放 | `allScroll` ｜ `zoomIn` ｜ `zoomOut` |  |
   * | 调整大小 | `colResize` ｜ `rowResize` ｜ `eResize` ｜ `wResize` ｜ `nResize` ｜ `sResize` ｜ `neResize` ｜ `nwResize` ｜ `seResize` ｜ `swResize` ｜ `ewResize` ｜ `nsResize` ｜ `neswResize` ｜ `nwseResize` | 8 方向 + 4 双向 |
   * | 自定义图片 | `"url('/cursor.png'), pointer"` | URL + 兜底关键字（必须） |
   * | 图片 + 热点 | `"url('/c.png') 16 16, pointer"` | 坐标为图片热点位置 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |  IE   |
   * | :----: | :-----: | :-----: | :----: | :---: |
   * | **1**  |  **1**  | **1.2** | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/cursor
   */
  cursor: PropCarrier<CssValueOf<'cursor'>, CursorTokens<T>, 'auto' | 'default' | 'none' | 'pointer' | 'text' | 'verticalText' | 'wait' | 'progress' | 'help' | 'contextMenu' | 'cell' | 'crosshair' | 'move' | 'grab' | 'grabbing' | 'alias' | 'copy' | 'notAllowed' | 'noDrop' | 'allScroll' | 'zoomIn' | 'zoomOut' | 'colResize' | 'rowResize' | 'eResize' | 'nResize' | 'sResize' | 'wResize' | 'neResize' | 'nwResize' | 'seResize' | 'swResize' | 'ewResize' | 'nsResize' | 'neswResize' | 'nwseResize' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **43** | **69**  | **9**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/cx
     */
  cx: PropFn<CssValueOf<'cx'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **43** | **69**  | **9**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/cy
     */
  cy: PropFn<CssValueOf<'cy'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | path(<string>)`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **52** | **97**  |   No   | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/d
     */
  d: PropFn<CssValueOf<'d'>>
  /**
   * 设置**文本流方向** —— 从左到右（LTR）或从右到左（RTL）。RTL 用于阿拉伯语 / 希伯来语。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `ltr` | **默认值**。从**左到右**（中英文、大多数语言） |
   * | `rtl` | 从**右到左**（阿拉伯语、希伯来语等） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `direction`。⚠️ `direction` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `ltr` |
   * | `unset` | `direction` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `direction` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `direction` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ⚠️ **推荐用 HTML `dir` 属性**而非 CSS `direction` —— HTML 属性还会影响 Unicode 双向算法 (BiDi)，更全面。
   *
   * ```html
   * <html lang="ar" dir="rtl">
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `ltr` ｜ `rtl` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `ltr`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE    |
   * | :----: | :-----: | :----: | :----: | :-----: |
   * | **2**  |  **1**  | **1**  | **12** | **5.5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/direction
   */
  direction: PropCarrier<CssValueOf<'direction'>, never, 'ltr' | 'rtl' | GlobalKw, unknown, never>
  /**
   * 决定元素的**显示类型** —— 是块级、行内、flex 容器、grid 容器还是不显示等。CSS 布局的总开关。
   *
   * ## 关键字
   *
   * ### 基础显示类型（外部布局）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `block` | **块级**：独占一行，可设宽高；如 `<div>`/`<p>` 的默认表现 |
   * | `inline` | **行内**：与文字同行，宽高/marginY/paddingY 部分无效；如 `<span>`/`<a>` 的默认表现 |
   * | `inlineBlock` | **行内块**：与文字同行（不换行），但可设完整 width/height/margin/padding；按钮/标签常用 |
   * | `none` | **完全不渲染**（不占任何空间）。注意：屏幕阅读器**仍会跳过**，可访问性需评估 |
   * | `contents` | 元素自身消失但**子元素照常渲染**，子元素直接成为父的子；用于去掉无意义包装层 |
   *
   * ### Flex / Grid 容器
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `flex` | **块级 flex 容器**：子元素自动成为 flex item，按主轴/交叉轴排列 |
   * | `inlineFlex` | 行内 flex 容器（与文字同行） |
   * | `grid` | **块级 grid 容器**：子元素自动成为 grid item，按行列排布 |
   * | `inlineGrid` | 行内 grid 容器 |
   *
   * ### 其他特殊容器
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `flowRoot` | **触发 BFC**（块格式化上下文）—— 现代清浮动方案；元素内的浮动不会影响外部 |
   * | `listItem` | 生成列表标记符号（与 `list-style` 配合）；如 `<li>` 默认 |
   * | `ruby` | 日文/中文注音排版（基线对齐注音字符）；罕用 |
   *
   * ### Table 家族（模拟 HTML 表格）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `table` | 块级表格容器（同 `<table>`） |
   * | `inlineTable` | 行内表格容器 |
   * | `tableCell` | 表格单元格（同 `<td>`/`<th>`）—— 经常用于精确垂直居中（配合 `vertical-align: middle`） |
   * | `tableRow` | 表格行（同 `<tr>`） |
   * | `tableColumn` | 表格列定义（同 `<col>`） |
   * | `tableRowGroup` | 同 `<tbody>` |
   * | `tableHeaderGroup` | 同 `<thead>` |
   * | `tableFooterGroup` | 同 `<tfoot>` |
   * | `tableColumnGroup` | 同 `<colgroup>` |
   * | `tableCaption` | 同 `<caption>` |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `display`。⚠️ `display` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `inline` |
   * | `unset` | `display` 非继承属性 → 等同 `initial`（= `inline`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `display` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `display` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 默认值与元素类型
   *
   * `display` **默认值取决于 HTML 元素类型**（user-agent 样式表决定）：
   * - `<div>` `<p>` `<section>` 等：`block`
   * - `<span>` `<a>` `<strong>` 等：`inline`
   * - `<img>` `<input>` `<button>`：`inline-block` 风格（但实际是 `inline` 加替换元素特殊处理）
   * - `<table>`：`table`
   * - `<li>`：`list-item`
   *
   * ### 经典用法
   *
   * ```ts
   * // flex 容器（最常用）
   * s.display.flex                   // 子元素水平排列
   *   .alignItems.center             // 垂直居中
   *   .gap.px(12)                    // 子元素间距
   *
   * // 完全隐藏元素（不占位）
   * s.display.none
   *
   * // 去掉无意义包装层（保留子元素正常布局）
   * s.display.contents               // <wrapper> 消失，子元素直接成为父的子
   *
   * // 触发 BFC，清除内部浮动
   * s.display.flowRoot               // 现代清浮动方案，替代经典 `clearfix` hack
   * ```
   *
   * ### `display: none` vs `visibility: hidden` vs `opacity: 0`
   *
   * | 写法 | 占位 | 事件触发 | 屏幕阅读器 |
   * | --- | --- | --- | --- |
   * | `display: none` | ✗ 不占位 | ✗ 无 | ✗ 跳过 |
   * | `visibility: hidden` | ✓ 占位 | ✗ 无 | ✗ 跳过 |
   * | `opacity: 0` | ✓ 占位 | ✓ **可点击** | ✓ 读出 |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 基础类型 | `block` `inline` `inlineBlock` `none` `contents` | 常用 |
   * | 容器类型 | `flex` `inlineFlex` `grid` `inlineGrid` `flowRoot` | 现代布局 |
   * | list-item | `listItem` | 生成列表标记 |
   * | table 家族 | `table` `inlineTable` `tableCell` `tableRow` `tableColumn` `tableRowGroup` ... | 模拟 HTML 表格行为 |
   * | ruby | `ruby` | CJK 注音排版（罕用） |
   * | 两值语法 | `'block flow'` `'inline flex'` | CSS Display Module 3（新，外/内类型分开写，多数浏览器尚未实现） |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `inline`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * 基础类型 / table 家族 / flex 远古支持。`grid` Chrome 57 / Firefox 52。`contents` Chrome 65 / Firefox 37。`flowRoot` Chrome 58 / Firefox 53。两值语法 Firefox 70+ 已实现，Chrome / Safari 部分支持。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/display
   */
  display: PropCarrier<CssValueOf<'display'>, never, 'block' | 'inline' | 'inlineBlock' | 'flex' | 'inlineFlex' | 'grid' | 'inlineGrid' | 'none' | 'contents' | 'flowRoot' | 'ruby' | 'listItem' | 'table' | 'inlineTable' | 'tableCell' | 'tableRow' | 'tableColumn' | 'tableRowGroup' | 'tableHeaderGroup' | 'tableFooterGroup' | 'tableColumnGroup' | 'tableCaption' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | text-bottom | alphabetic | ideographic | middle | central | mathematical | hanging | text-top`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **1**  |  **1**  | **4**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/dominant-baseline
     */
  dominantBaseline: PropFn<CssValueOf<'dominantBaseline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `show | hide`
     *
     * **Initial value**: `show`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **1**  |  **1**  | **1.2** | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/empty-cells
     */
  emptyCells: PropFn<CssValueOf<'emptyCells'>>
  /**
   * 控制 `<input>` / `<textarea>` / `<select>` 等表单元素的**尺寸自动调整模式** —— 是固定还是按内容增长。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `fixed` | **默认值**。固定尺寸（按 CSS / HTML 属性的宽度，不跟随内容增长） |
   * | `content` | **按内容自动调整**：`<input>` 跟随输入文字宽度，`<textarea>` 跟随内容高度（无需 JS 自适应高度） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `fieldSizing`。⚠️ `fieldSizing` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `fixed` |
   * | `unset` | `fieldSizing` 非继承属性 → 等同 `initial`（= `fixed`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `fieldSizing` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `fieldSizing` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 自动增高的 textarea（替代 JS 方案）
   * s.fieldSizing.content
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `fixed` ｜ `content` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `fixed`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |   Safari    |  Edge   | IE  |
   * | :-----: | :-----: | :---------: | :-----: | :-: |
   * | **123** |   No    | **preview** | **123** | No  |
   *
   * CSS UI 4 新属性，Chrome 123+。其他浏览器尚未支持。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/field-sizing
   */
  fieldSizing: PropCarrier<CssValueOf<'fieldSizing'>, never, 'content' | 'fixed' | GlobalKw, unknown, never>
  /**
   * SVG 专属：设置 SVG 图形（`<path>` / `<circle>` / `<rect>` 等）的**填充颜色**。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白填充 |
   * | `black` | `#000000` | **默认值**。纯黑填充 |
   * | `transparent` | `rgba(0,0,0,0)` | 完全透明，等同 `none`（露出下层） |
   * | `currentColor` | 引用 `color` | 让 SVG 跟随文字色 —— **icon font 风格**的核心写法 |
   *
   * ### SVG 专属
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | 无填充（与 `transparent` 视觉相同，但语义更清晰） |
   * | `context-fill` | 引用调用 SVG 的元素的 fill（在 `<use>` 引用的 \<symbol\> 内使用） |
   * | `context-stroke` | 引用调用元素的 stroke |
   *
   * ### SVG paint server 引用
   *
   * | 形式 | 示例 | 用途 |
   * | --- | --- | --- |
   * | `url(#id)` | `'url(#gradient1)'` | 引用 `<linearGradient>` / `<radialGradient>` / `<pattern>` 实现渐变/图案填充 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `fill`。⚠️ `fill` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `black` |
   * | `unset` | `fill` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `fill` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `fill` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### Icon font 风格写法
   *
   * SVG 图标继承文字色的标准模式 —— SVG 内 `fill="currentColor"`：
   *
   * ```html
   * <svg viewBox="0 0 24 24"><path fill="currentColor" d="..." /></svg>
   * ```
   *
   * 外层只需改 `color` 即可整体染色：
   *
   * ```ts
   * s.color._danger      // 文字 + svg 全变红
   * ```
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.fill._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.fill._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.fill._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.fill._primary.alpha(0.6)         // token + 修饰链
   * s.fill._primary.darken(0.1)
   * s.fill._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.fill._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.fill.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 常见陷阱
   *
   * - 浏览器渲染 SVG 时 `fill` 默认为 `black` 而不是 `currentColor` —— icon 库通常会自动加 `fill="currentColor"`
   * - 同时设了 SVG 属性 `fill="red"` 和 CSS `fill`：CSS 优先级**低于** presentation attribute，但比 inline style 低（CSS Spec 已修正，现代浏览器 CSS > attribute）
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | `none` | — | 无填充（SVG 专属） |
   * | `url(#id)` | `'url(#grad)'` | SVG paint server 引用（渐变/图案） |
   * | `context-fill` / `context-stroke` | — | 在 `<symbol>` 内引用调用元素的 fill/stroke |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `black`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge   | IE  |
   * | :----: | :-----: | :----: | :-----: | :-: |
   * | **1**  |  **3**  | **4**  | **≤15** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/fill
   */
  fill: ColorPropCarrier<CssValueOf<'fill'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<'opacity'>`
     *
     * **Initial value**: `1`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **1**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/fill-opacity
     */
  fillOpacity: PropFn<CssValueOf<'fillOpacity'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `nonzero | evenodd`
     *
     * **Initial value**: `nonzero`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/fill-rule
     */
  fillRule: PropFn<CssValueOf<'fillRule'>>
  /**
   * 给元素应用**视觉滤镜** —— 模糊、亮度、对比度、灰度、阴影等。可链式叠加多个滤镜函数。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无滤镜 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `filter`。⚠️ `filter` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `filter` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `filter` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `filter` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 11 个滤镜函数
   *
   * | 函数 | 参数 | 效果 |
   * | --- | --- | --- |
   * | `blur(<length>)` | 模糊半径 | **高斯模糊**（如 `blur(8px)`） |
   * | `brightness(<%>)` | 0-∞ | 亮度（100% 原值，> 100% 变亮，< 100% 变暗，0 全黑） |
   * | `contrast(<%>)` | 0-∞ | 对比度（100% 原值，0 全灰） |
   * | `grayscale(<%>)` | 0-100% | 灰度（100% 完全黑白） |
   * | `sepia(<%>)` | 0-100% | 棕褐色调（怀旧滤镜） |
   * | `saturate(<%>)` | 0-∞ | 饱和度（100% 原值，0 灰度） |
   * | `hue-rotate(<angle>)` | 角度 | 色相旋转（0deg-360deg） |
   * | `invert(<%>)` | 0-100% | 反色（100% 完全反相） |
   * | `opacity(<%>)` | 0-100% | 透明度（同 `opacity` 属性但参与滤镜链） |
   * | `drop-shadow(...)` | 同 boxShadow（无 spread/inset）| **真实阴影**（跟随透明像素边缘，svg/png 可见） |
   * | `url(#filter)` | SVG filter | 引用 SVG 中定义的滤镜（最强大） |
   *
   * ### 用例
   *
   * ```ts
   * // hover 增亮
   * s.filter('brightness(1.1)')
   *
   * // disable 灰度
   * s.filter('grayscale(1) opacity(0.5)')
   *
   * // 毛玻璃文字（配合 backdrop-filter）
   * s.filter('blur(2px)')
   *
   * // 跟随透明边缘的阴影（svg icon、png）
   * s.filter('drop-shadow(0 2px 4px rgba(0,0,0,0.2))')
   * ```
   *
   * ### filter vs boxShadow
   *
   * - `boxShadow`：阴影按**元素矩形边界**绘制（包括透明背景区）
   * - `filter: drop-shadow()`：阴影按**实际可见像素**绘制（适合非矩形元素如 SVG）
   *
   * ### 性能提示
   *
   * filter 触发**合成层** —— 性能比 boxShadow 好，但**多个滤镜叠加**会变慢，避免动画大模糊半径。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | **默认值** |
   * | blur | `'blur(8px)'` | 高斯模糊 |
   * | brightness | `'brightness(1.2)'` | 亮度 |
   * | contrast | `'contrast(150%)'` | 对比度 |
   * | grayscale | `'grayscale(0.5)'` | 灰度 |
   * | sepia | `'sepia(80%)'` | 棕褐色调 |
   * | saturate | `'saturate(200%)'` | 饱和度 |
   * | hue-rotate | `'hue-rotate(90deg)'` | 色相旋转 |
   * | invert | `'invert(1)'` | 反色 |
   * | opacity | `'opacity(0.5)'` | 透明度 |
   * | drop-shadow | `'drop-shadow(0 2px 4px #0003)'` | 真实阴影 |
   * | SVG filter | `'url(#myFilter)'` | 引用 SVG 滤镜 |
   * | 链式叠加 | `'blur(2px) brightness(1.1)'` | 空格分隔多个函数 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox | Safari  |  Edge  | IE  |
   * | :------: | :-----: | :-----: | :----: | :-: |
   * |  **53**  | **35**  | **9.1** | **12** | No  |
   * | 18 _-x-_ |         | 6 _-x-_ |        |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/filter
   */
  filter: PropCarrier<CssValueOf<'filter'>, never, 'none' | GlobalKw, unknown, never>
  /**
   * flex 子元素的**初始尺寸** —— 在剩余空间分配（flexGrow/flexShrink）之前的"起步大小"。
   *
   * ## 关键字
   *
   * ### 6 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。等于元素自身 `width` / `height`（视 flex 方向） |
   * | `fill` | 撑满可用空间（实验性，未标准化） |
   * | `maxContent` | 理想内容尺寸（不换行的宽度） |
   * | `minContent` | 最小内容尺寸（最长不可断处） |
   * | `fitContent` | 内容驱动但不超容器 |
   * | `content` | 基于内容自动算（**忽略** width 设置） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `flexBasis`。⚠️ `flexBasis` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `flexBasis` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `flexBasis` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `flexBasis` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### flexBasis vs width
   *
   * flex 子元素上同时设 `width` 和 `flexBasis` 时：
   * - `flexBasis: auto` → 用 `width` 的值
   * - `flexBasis: <length>` → **覆盖** width
   *
   * 推荐做法：直接用 `width` 即可，无需写 `flexBasis` 除非要特殊行为。
   *
   * ### flex 简写
   *
   * ```ts
   * s.flex(1)                       // flex: 1 1 0 → grow:1 shrink:1 basis:0
   * s.flex('0 0 200px')             // 不增不缩，固定 200px
   * s.flex('1 1 auto')              // 经典：可增可缩，起步 = 内容尺寸
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.flexBasis.px(200)         ≡ s.flexBasis('200px')
   * s.flexBasis.rem(1.5)        ≡ s.flexBasis('1.5rem')
   * s.flexBasis.em(2)           ≡ s.flexBasis('2em')      // 当前元素 font-size 的倍数
   * s.flexBasis.vw(50)          ≡ s.flexBasis('50vw')     // 视口宽 1%
   * s.flexBasis.dvw(50)         ≡ s.flexBasis('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.flexBasis.cqw(50)         ≡ s.flexBasis('50cqw')    // container query 容器尺寸
   * s.flexBasis.percent(50)     ≡ s.flexBasis('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.flexBasis('calc(100% - 32px)')
   * s.flexBasis('min(100%, 1200px)')
   * s.flexBasis('max(280px, 50%)')
   * s.flexBasis('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` | 具体长度起步 |
   * | `<percentage>` | `'50%'` | 相对容器主轴尺寸 |
   * | 6 个 keyword | `auto` ｜ `fill` ｜ `maxContent` ｜ `minContent` ｜ `fitContent` ｜ `content` | 内容驱动 / 自适应 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :------: | :-----: | :-----: | :----: | :----: |
   * |  **29**  | **22**  |  **9**  | **12** | **11** |
   * | 22 _-x-_ |         | 7 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex-basis
   */
  flexBasis: PropCarrier<CssValueOf<'flexBasis'>, SizeTokens<T>, 'auto' | 'fill' | 'maxContent' | 'minContent' | 'fitContent' | 'content' | GlobalKw, LengthUnits, never>
  /**
   * 决定 flex 容器的**主轴方向** —— 子元素是横向排列还是纵向排列、是否反向。仅对 `display: flex/inlineFlex` 容器生效。
   *
   * ## 关键字
   *
   * ### 4 个方向关键字
   *
   * | 关键字 | 主轴方向 |
   * | --- | --- |
   * | `row` | **默认值**。主轴 = 从**左到右**（LTR）/ 从右到左（RTL） |
   * | `rowReverse` | 主轴 = 从**右到左**（LTR）/ 从左到右（RTL） |
   * | `column` | 主轴 = 从**上到下**（垂直排列） |
   * | `columnReverse` | 主轴 = 从**下到上**（垂直反向） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `flexDirection`。⚠️ `flexDirection` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `row` |
   * | `unset` | `flexDirection` 非继承属性 → 等同 `initial`（= `row`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `flexDirection` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `flexDirection` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 主轴 vs 交叉轴
   *
   * - **主轴**：`flexDirection` 决定的方向，子元素沿此方向排列
   * - **交叉轴**：与主轴垂直的方向
   *
   * | flexDirection | 主轴 | 交叉轴 | `justifyContent` 控制 | `alignItems` 控制 |
   * | --- | --- | --- | --- | --- |
   * | `row` | 横向 | 纵向 | 水平对齐 | 垂直对齐 |
   * | `column` | 纵向 | 横向 | 垂直对齐 | 水平对齐 |
   *
   * ### 经典用法
   *
   * ```ts
   * s.display.flex
   * s.flexDirection.column
   * s.gap.px(12)
   * // 垂直堆叠子元素，间距 12px
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 4 个方向 keyword | `row` ｜ `rowReverse` ｜ `column` ｜ `columnReverse` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `row`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox | Safari  |  Edge  |    IE    |
   * | :------: | :-----: | :-----: | :----: | :------: |
   * |  **29**  | **22**  |  **9**  | **12** |  **11**  |
   * | 21 _-x-_ |         | 7 _-x-_ |        | 10 _-x-_ |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex-direction
   */
  flexDirection: PropCarrier<CssValueOf<'flexDirection'>, never, 'row' | 'rowReverse' | 'column' | 'columnReverse' | GlobalKw, unknown, never>
  /**
   * flex 子元素的**放大比例** —— 容器有剩余空间时，按此比例分配给各子元素。**默认 0**（不放大）。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `接受非负数字（含 0）。无关键字（除全局关键字）` —— undefined
   * - `多个子元素的 flexGrow 比例决定剩余空间分配` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `flexGrow`。⚠️ `flexGrow` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `flexGrow` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `flexGrow` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `flexGrow` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 算法
   *
   * 容器剩余空间 = 容器总宽 − 所有子元素 `flex-basis` 之和
   *
   * 每个子元素分到 = 剩余空间 × (自己的 flexGrow / 所有子元素 flexGrow 之和)
   *
   * ### 经典用法
   *
   * ```ts
   * // 子元素 A:1, B:2, C:1 → A 和 C 各占剩余 25%，B 占 50%
   * s.display.flex
   * // childA: flexGrow(1)
   * // childB: flexGrow(2)
   * // childC: flexGrow(1)
   *
   * // "填充剩余空间"模式（导航、侧栏）
   * s.flexGrow(1)        // 此子元素占满剩余空间，其他兄弟保持原大小
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<number>` | `0` `1` `2.5` | 非负数字（不带单位） |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox | Safari  |  Edge  |            IE            |
   * | :------: | :-----: | :-----: | :----: | :----------------------: |
   * |  **29**  | **20**  |  **9**  | **12** |          **11**          |
   * | 22 _-x-_ |         | 7 _-x-_ |        | 10 _(-ms-flex-positive)_ |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex-grow
   */
  flexGrow: PropCarrier<CssValueOf<'flexGrow'>, never, GlobalKw, unknown, never>
  /**
   * flex 子元素的**收缩比例** —— 容器空间不足时，按此比例缩小各子元素。**默认 1**（允许收缩）。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `接受非负数字（含 0）。无关键字（除全局关键字）` —— undefined
   * - `设为 `0` = 该子元素**不收缩**（即使溢出也保持原尺寸）` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `flexShrink`。⚠️ `flexShrink` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `1` |
   * | `unset` | `flexShrink` 非继承属性 → 等同 `initial`（= `1`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `flexShrink` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `flexShrink` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 常见用法
   *
   * ```ts
   * // 防止图标 / 按钮被压缩
   * s.flexShrink(0)
   * s.width.px(40)
   *
   * // 让长文本可压缩
   * s.flexShrink(1)
   * s.minWidth(0)
   * // minWidth(0) 是关键 —— flex 子元素默认 min-width: auto 会阻止收缩到内容以下
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<number>` | `0` `1` `2` | 非负数字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `1`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :------: | :-----: | :-----: | :----: | :----: |
   * |  **29**  | **20**  |  **9**  | **12** | **10** |
   * | 22 _-x-_ |         | 8 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex-shrink
   */
  flexShrink: PropCarrier<CssValueOf<'flexShrink'>, never, GlobalKw, unknown, never>
  /**
   * 决定 flex 子元素**是否换行**。默认所有子元素挤在一行（必要时压缩尺寸），开启换行后超出宽度的会换行排列。
   *
   * ## 关键字
   *
   * ### 3 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `nowrap` | **默认值**。所有子元素挤在一行（一列），不换行（必要时收缩子元素尺寸） |
   * | `wrap` | 允许换行，从**上到下**新行（主轴 row 时） |
   * | `wrapReverse` | 允许换行，从**下到上**新行（顺序反向） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `flexWrap`。⚠️ `flexWrap` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `nowrap` |
   * | `unset` | `flexWrap` 非继承属性 → 等同 `initial`（= `nowrap`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `flexWrap` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `flexWrap` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.display.flex
   * s.flexWrap.wrap
   * s.gap.px(8)
   * // 子元素挤不下时换行，每行间隔 8px
   * ```
   *
   * ### nowrap 的坑
   *
   * `nowrap` 默认 + 子元素总宽度超过容器时：
   * - 子元素会被**强制压缩**（按 `flex-shrink: 1`）
   * - 想"不压缩"用 `flex-shrink: 0`
   * - 想"溢出滚动"配合 `overflow.auto`
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 3 个 keyword | `nowrap` ｜ `wrap` ｜ `wrapReverse` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `nowrap`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :------: | :-----: | :-----: | :----: | :----: |
   * |  **29**  | **28**  |  **9**  | **12** | **11** |
   * | 21 _-x-_ |         | 7 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex-wrap
   */
  flexWrap: PropCarrier<CssValueOf<'flexWrap'>, never, 'nowrap' | 'wrap' | 'wrapReverse' | GlobalKw, unknown, never>
  /**
   * 让元素**浮动**到容器一侧，**脱离正常文档流**，文字 / 行内元素会环绕它。现代布局已被 flex / grid 取代，但 `<img>` 文字环绕仍是经典场景。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不浮动 |
   * | `left` | 浮动到容器**左侧**，文字从右侧环绕 |
   * | `right` | 浮动到容器**右侧**，文字从左侧环绕 |
   * | `inlineStart` | 逻辑属性：阅读方向起始侧（LTR 文档 = `left`，RTL 文档 = `right`） |
   * | `inlineEnd` | 逻辑属性：阅读方向结束侧（LTR = `right`，RTL = `left`） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `float`。⚠️ `float` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `float` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `float` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `float` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 经典用法
   *
   * 文字环绕图片：
   *
   * ```ts
   * // 给 <img>
   * s.float.left
   * s.marginRight.px(16)
   * s.marginBottom.px(8)
   * // 旁边的文字会自动环绕
   * ```
   *
   * ### 浮动后的副作用
   *
   * - 浮动元素**脱离文档流**：父容器高度不再包含浮动子元素 → 需要清除浮动（`clear` 或父级 `overflow: hidden` / `display: flow-root`）
   * - 浮动元素自动变成块级（`display: block`），可设宽高
   * - 现代项目多用 flex/grid 替代
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 浮动方向 | `none` ｜ `left` ｜ `right` ｜ `inlineStart` ｜ `inlineEnd` | 物理/逻辑方向 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * `inlineStart` / `inlineEnd` Chrome 118 / Firefox 119 / Safari 17.4+。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/float
   */
  float: PropCarrier<CssValueOf<'float'>, never, 'left' | 'right' | 'none' | 'inlineStart' | 'inlineEnd' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `black`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **5**  |  **3**  | **6**  | **12** | **≤11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flood-color
     */
  floodColor: PropFn<CssValueOf<'floodColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'opacity'>`
     *
     * **Initial value**: `black`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **5**  |  **3**  | **6**  | **12** | **≤11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flood-opacity
     */
  floodOpacity: PropFn<CssValueOf<'floodOpacity'>>
  /**
   * 设置元素使用的**字体族**。可写具体字体名 + 回退族，或仅写通用族关键字。
   *
   * ## 关键字
   *
   * ### 5 个传统通用族（generic family）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `serif` | **衬线**字体（笔画末端有装饰）：宋体、Times New Roman |
   * | `sansSerif` | **无衬线**字体：黑体、Arial、Helvetica（屏幕阅读首选） |
   * | `monospace` | **等宽**字体：所有字符宽度相同；代码、表格首选 |
   * | `cursive` | **手写体** / 草书风格 |
   * | `fantasy` | **艺术装饰**字体（高度可变，少用） |
   *
   * ### 8 个现代 UI 通用族（CSS Fonts 4）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `systemUi` | **系统 UI 字体**（macOS: SF Pro，Windows: Segoe UI，Linux: Cantarell 等）—— 现代 Web App 首选 |
   * | `uiSerif` | 系统 UI 的衬线版本 |
   * | `uiSansSerif` | 系统 UI 的无衬线版本 |
   * | `uiMonospace` | 系统 UI 的等宽版本 |
   * | `uiRounded` | 系统 UI 的圆角版本（macOS: SF Pro Rounded） |
   * | `emoji` | 彩色 emoji 字体（自动选择系统 emoji 字体） |
   * | `math` | 数学公式字体（Cambria Math 等） |
   * | `fangsong` | 仿宋字体（CJK 专用） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `fontFamily`。⚠️ `fontFamily` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `取决于浏览器（一般为 sans-serif）` |
   * | `unset` | `fontFamily` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `fontFamily` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `fontFamily` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态：字体栈
   *
   * 按优先级列出多个字体，找不到就用下一个，最后兜底通用族：
   *
   * ```ts
   * s.fontFamily("'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")
   * ```
   *
   * ### 现代推荐
   *
   * ```ts
   * s.fontFamily('systemUi')                  // 跨平台原生字体（macOS/Win/Linux 各显示对应系统字体）
   * s.fontFamily.systemUi                     // 等价 token 写法
   * ```
   *
   * ### 字体名包含空格 / 中文必须加引号
   *
   * ```ts
   * s.fontFamily("'PingFang SC', 'Microsoft YaHei', sans-serif")
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 函数态字体栈 | `"'Inter', sans-serif"` | 按优先级列出，逗号分隔 |
   * | 通用族关键字 | `serif` `sansSerif` `monospace` `cursive` `fantasy` | 5 个传统通用族 |
   * | 现代 UI 族 | `systemUi` `uiSerif` `uiSansSerif` `uiMonospace` `uiRounded` `emoji` `math` `fangsong` | CSS Fonts 4 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `取决于浏览器（一般为 sans-serif）`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **3** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-family
   */
  fontFamily: PropCarrier<CssValueOf<'fontFamily'>, FontsTokens<T>, 'serif' | 'sansSerif' | 'monospace' | 'cursive' | 'fantasy' | 'systemUi' | 'uiSerif' | 'uiSansSerif' | 'uiMonospace' | 'uiRounded' | 'emoji' | 'math' | 'fangsong' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `normal | <feature-tag-value>#`
     *
     * **Initial value**: `normal`
     *
     * |  Chrome  | Firefox  | Safari  |  Edge  |   IE   |
     * | :------: | :------: | :-----: | :----: | :----: |
     * |  **48**  |  **34**  | **9.1** | **15** | **10** |
     * | 16 _-x-_ | 15 _-x-_ |         |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-feature-settings
     */
  fontFeatureSettings: PropFn<CssValueOf<'fontFeatureSettings'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | normal | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **33** | **32**  |  **9**  | **79** | No  |
     * |        |         | 6 _-x-_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-kerning
     */
  fontKerning: PropFn<CssValueOf<'fontKerning'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | <string>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **143** | **34**  |   No   | **143** | No  |
     * |         | 4 _-x-_ |        |         |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-language-override
     */
  fontLanguageOverride: PropFn<CssValueOf<'fontLanguageOverride'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2020.
     *
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **79** | **62**  | **13.1** | **17** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-optical-sizing
     */
  fontOpticalSizing: PropFn<CssValueOf<'fontOpticalSizing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since November 2022.
     *
     * **Syntax**: `normal | light | dark | <palette-identifier> | <palette-mix()>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **101** | **107** | **15.4** | **101** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-palette
     */
  fontPalette: PropFn<CssValueOf<'fontPalette'>>
  /**
   * 设置元素的**字号**。可用长度（px/rem/em 等）、百分比（相对父级字号）、关键字（绝对大小 / 相对大小）。
   *
   * ## 关键字
   *
   * ### 8 个绝对大小关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `xxSmall` | 约 9px（浏览器约定） |
   * | `xSmall` | 约 10px |
   * | `small` | 约 13px |
   * | `medium` | **默认值**，约 16px（浏览器默认字号） |
   * | `large` | 约 18px |
   * | `xLarge` | 约 24px |
   * | `xxLarge` | 约 32px |
   * | `xxxLarge` | 约 48px |
   *
   * ### 2 个相对大小关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `smaller` | 比父元素字号**小一档**（参考 8 阶绝对大小） |
   * | `larger` | 比父元素字号**大一档** |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `fontSize`。⚠️ `fontSize` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `medium` |
   * | `unset` | `fontSize` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `fontSize` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `fontSize` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### em vs rem vs px
   *
   * | 单位 | 参照 | 何时用 |
   * | --- | --- | --- |
   * | `px` | 绝对 | 精确控制，不响应用户字号设置 |
   * | `em` | **父级**字号 | 跟随上下文缩放（如组件内嵌） |
   * | `rem` | **根元素** `<html>` 字号 | 全站统一缩放点（推荐） |
   * | `%` | **父级**字号 | 同 em 行为 |
   *
   * ### 响应式字号
   *
   * ```ts
   * s.fontSize('clamp(14px, 2vw, 18px)')        // 最小 14，理想 2vw，最大 18px
   * ```
   *
   * ### 可访问性
   *
   * 直接写 `px` 时用户在浏览器调大字号设置**不会缩放**；用 `rem` 则会跟随根字号变化 —— 建议用 `rem` / `em`。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.fontSize.px(200)         ≡ s.fontSize('200px')
   * s.fontSize.rem(1.5)        ≡ s.fontSize('1.5rem')
   * s.fontSize.em(2)           ≡ s.fontSize('2em')      // 当前元素 font-size 的倍数
   * s.fontSize.vw(50)          ≡ s.fontSize('50vw')     // 视口宽 1%
   * s.fontSize.dvw(50)         ≡ s.fontSize('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.fontSize.cqw(50)         ≡ s.fontSize('50cqw')    // container query 容器尺寸
   * s.fontSize.percent(50)     ≡ s.fontSize('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.fontSize('calc(100% - 32px)')
   * s.fontSize('min(100%, 1200px)')
   * s.fontSize('max(280px, 50%)')
   * s.fontSize('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'16px'` `'1rem'` `'1.2em'` | 具体长度 |
   * | `<percentage>` | `'120%'` | 相对父字号 |
   * | 8 个绝对大小 | `xxSmall` `xSmall` `small` `medium` `large` `xLarge` `xxLarge` `xxxLarge` | 浏览器约定值 |
   * | 2 个相对大小 | `smaller` ｜ `larger` | 相对父字号 |
   * | 数学函数 | `'clamp(14px, 2vw, 18px)'` | 响应式字号 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `medium`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE    |
   * | :----: | :-----: | :----: | :----: | :-----: |
   * | **1**  |  **1**  | **1**  | **12** | **5.5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-size
   */
  fontSize: PropCarrier<CssValueOf<'fontSize'>, FontSizeTokens<T>, 'xxSmall' | 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge' | 'xxLarge' | 'xxxLarge' | 'smaller' | 'larger' | GlobalKw, LengthUnits, never>
  /**
     * Since July 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | [ ex-height | cap-height | ch-width | ic-width | ic-height ]? [ from-font | <number> ]`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **127** |  **3**  | **16.4** | **127** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-size-adjust
     */
  fontSizeAdjust: PropFn<CssValueOf<'fontSizeAdjust'>>
  /**
     * The **`font-smooth`** CSS property controls the application of anti-aliasing when fonts are rendered.
     *
     * **Syntax**: `auto | never | always | <absolute-size> | <length>`
     *
     * **Initial value**: `auto`
     *
     * |              Chrome              |              Firefox               |              Safari              |               Edge                | IE  |
     * | :------------------------------: | :--------------------------------: | :------------------------------: | :-------------------------------: | :-: |
     * | **5** _(-webkit-font-smoothing)_ | **25** _(-moz-osx-font-smoothing)_ | **4** _(-webkit-font-smoothing)_ | **79** _(-webkit-font-smoothing)_ | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-smooth
     */
  fontSmooth: PropFn<CssValueOf<'fontSmooth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | italic | oblique <angle>?`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-style
     */
  fontStyle: PropFn<CssValueOf<'fontStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2022.
     *
     * **Syntax**: `none | [ weight || style || small-caps || position]`
     *
     * **Initial value**: `weight style small-caps position `
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **97** | **34**  | **9**  | **97** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-synthesis
     */
  fontSynthesis: PropFn<CssValueOf<'fontSynthesis'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari | Edge | IE  |
     * | :----: | :-----: | :----: | :--: | :-: |
     * |   No   | **118** |   No   |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-synthesis-position
     */
  fontSynthesisPosition: PropFn<CssValueOf<'fontSynthesisPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2023.
     *
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **97** | **111** | **16.4** | **97** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-synthesis-small-caps
     */
  fontSynthesisSmallCaps: PropFn<CssValueOf<'fontSynthesisSmallCaps'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2023.
     *
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **97** | **111** | **16.4** | **97** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-synthesis-style
     */
  fontSynthesisStyle: PropFn<CssValueOf<'fontSynthesisStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2023.
     *
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **97** | **111** | **16.4** | **97** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-synthesis-weight
     */
  fontSynthesisWeight: PropFn<CssValueOf<'fontSynthesisWeight'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> || stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) || [ small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps ] || <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero || <east-asian-variant-values> || <east-asian-width-values> || ruby ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant
     */
  fontVariant: PropFn<CssValueOf<'fontVariant'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2023.
     *
     * **Syntax**: `normal | [ stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :-----: | :-----: | :-: |
     * | **111** | **34**  | **9.1** | **111** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-alternates
     */
  fontVariantAlternates: PropFn<CssValueOf<'fontVariantAlternates'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **52** | **34**  | **9.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-caps
     */
  fontVariantCaps: PropFn<CssValueOf<'fontVariantCaps'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `normal | [ <east-asian-variant-values> || <east-asian-width-values> || ruby ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **63** | **34**  | **9.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-east-asian
     */
  fontVariantEastAsian: PropFn<CssValueOf<'fontVariantEastAsian'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | text | emoji | unicode`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **131** | **141** |   No   | **131** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-emoji
     */
  fontVariantEmoji: PropFn<CssValueOf<'fontVariantEmoji'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> ]`
     *
     * **Initial value**: `normal`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  | IE  |
     * | :------: | :-----: | :-----: | :----: | :-: |
     * |  **34**  | **34**  | **9.1** | **79** | No  |
     * | 31 _-x-_ |         | 7 _-x-_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-ligatures
     */
  fontVariantLigatures: PropFn<CssValueOf<'fontVariantLigatures'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `normal | [ <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **52** | **34**  | **9.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-numeric
     */
  fontVariantNumeric: PropFn<CssValueOf<'fontVariantNumeric'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | sub | super`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari  | Edge | IE  |
     * | :----: | :-----: | :-----: | :--: | :-: |
     * |   No   | **34**  | **9.1** |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-position
     */
  fontVariantPosition: PropFn<CssValueOf<'fontVariantPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2018.
     *
     * **Syntax**: `normal | [ <string> <number> ]#`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **62** | **62**  | **11** | **17** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variation-settings
     */
  fontVariationSettings: PropFn<CssValueOf<'fontVariationSettings'>>
  /**
   * 设置字体的**粗细**（重量）。可用关键字或数字（100-900，整百）；支持可变字体的任意精细值。
   *
   * ## 关键字
   *
   * ### 4 个关键字
   *
   * | 关键字 | 等价数字 | 说明 |
   * | --- | --- | --- |
   * | `normal` | `400` | **默认值**。常规粗细 |
   * | `bold` | `700` | 加粗 |
   * | `lighter` | 相对父级 | 比父元素**减一档**（在 400 时 → 100） |
   * | `bolder` | 相对父级 | 比父元素**加一档**（在 400 时 → 700） |
   *
   * ### 数字
   *
   * - ``100` Thin / Hairline` —— undefined
   * - ``200` Extra Light / Ultra Light` —— undefined
   * - ``300` Light` —— undefined
   * - ``400` Regular / Normal（= `normal`）` —— undefined
   * - ``500` Medium` —— undefined
   * - ``600` Semi Bold / Demi Bold` —— undefined
   * - ``700` Bold（= `bold`）` —— undefined
   * - ``800` Extra Bold / Ultra Bold` —— undefined
   * - ``900` Black / Heavy` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `fontWeight`。⚠️ `fontWeight` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `fontWeight` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `fontWeight` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `fontWeight` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 字体能否显示某个 weight 取决于字体文件
   *
   * 不是所有字体都有 9 个 weight。常规字体只有 `400` 和 `700`：
   *
   * - 写 `fontWeight(300)` 但字体没有 300 → 浏览器降级显示最接近的（通常退回 400）
   * - 写 `fontWeight(500)` 同理
   *
   * ### 可变字体（Variable Font）
   *
   * 支持任意精细值：
   *
   * ```ts
   * s.fontWeight(450)         // 介于 400 和 500 之间（仅可变字体支持）
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `normal` ｜ `bold` ｜ `lighter` ｜ `bolder` | 基础粗细 |
   * | 数字 | `100` … `900`（整百） | 具体粗细等级 |
   * | 可变字体 | `450` `550` 等任意值 | 仅可变字体支持 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **2**  |  **1**  | **1**  | **12** | **3** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-weight
   */
  fontWeight: PropCarrier<CssValueOf<'fontWeight'>, FontWeightTokens<T>, 'normal' | 'bold' | 'lighter' | 'bolder' | GlobalKw, unknown, never>
  /**
     * **Syntax**: `normal | <percentage [0,∞]> | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox |  Safari  | Edge | IE  |
     * | :----: | :-----: | :------: | :--: | :-: |
     * |   No   |   No    | **18.4** |  No  | No  |
     */
  fontWidth: PropFn<CssValueOf<'fontWidth'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | none | preserve-parent-color`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |              Edge               |                 IE                  |
     * | :----: | :-----: | :----: | :-----------------------------: | :---------------------------------: |
     * | **89** | **113** |   No   |             **79**              | **10** _(-ms-high-contrast-adjust)_ |
     * |        |         |        | 12 _(-ms-high-contrast-adjust)_ |                                     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/forced-color-adjust
     */
  forcedColorAdjust: PropFn<CssValueOf<'forcedColorAdjust'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<track-size>+`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |             IE              |
     * | :----: | :-----: | :------: | :----: | :-------------------------: |
     * | **57** | **70**  | **10.1** | **16** | **10** _(-ms-grid-columns)_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-auto-columns
     */
  gridAutoColumns: PropFn<CssValueOf<'gridAutoColumns'>>
  /**
   * grid 中**未显式定位的子元素**如何自动填入网格 —— 沿行还是沿列、是否填补空隙。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `row` | **默认值**。子元素**逐行**填入（先填满一行再换下一行） |
   * | `column` | 子元素**逐列**填入（先填满一列再换下一列） |
   * | `dense` | 允许**回填**空隙：后面的小子元素可填入前面留下的空隙；但可能打乱 DOM 顺序 |
   * | `rowDense` | 组合：逐行 + 回填空隙 |
   * | `columnDense` | 组合：逐列 + 回填空隙 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `gridAutoFlow`。⚠️ `gridAutoFlow` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `row` |
   * | `unset` | `gridAutoFlow` 非继承属性 → 等同 `initial`（= `row`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `gridAutoFlow` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `gridAutoFlow` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### dense 用例
   *
   * masonry 风格瀑布流：
   *
   * ```ts
   * s.display.grid
   *   .gridTemplateColumns('repeat(auto-fill, 200px)')
   *   .gridAutoFlow.dense              // 后面的小图填入前面大图留下的空隙
   * ```
   *
   * ⚠️ `dense` 会让视觉顺序与 DOM 顺序不一致，**影响屏幕阅读器**。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个 keyword | `row` ｜ `column` ｜ `dense` ｜ `rowDense` ｜ `columnDense` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `row`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **57** | **52**  | **10.1** | **16** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-auto-flow
   */
  gridAutoFlow: PropCarrier<CssValueOf<'gridAutoFlow'>, never, 'row' | 'column' | 'dense' | 'rowDense' | 'columnDense' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<track-size>+`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |            IE            |
     * | :----: | :-----: | :------: | :----: | :----------------------: |
     * | **57** | **70**  | **10.1** | **16** | **10** _(-ms-grid-rows)_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-auto-rows
     */
  gridAutoRows: PropFn<CssValueOf<'gridAutoRows'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<grid-line>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-column-end
     */
  gridColumnEnd: PropFn<CssValueOf<'gridColumnEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<grid-line>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-column-start
     */
  gridColumnStart: PropFn<CssValueOf<'gridColumnStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<grid-line>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-row-end
     */
  gridRowEnd: PropFn<CssValueOf<'gridRowEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<grid-line>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-row-start
     */
  gridRowStart: PropFn<CssValueOf<'gridRowStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `none | <string>+`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-template-areas
     */
  gridTemplateAreas: PropFn<CssValueOf<'gridTemplateAreas'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `none | <track-list> | <auto-track-list> | subgrid <line-name-list>?`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |             IE              |
     * | :----: | :-----: | :------: | :----: | :-------------------------: |
     * | **57** | **52**  | **10.1** | **16** | **10** _(-ms-grid-columns)_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-template-columns
     */
  gridTemplateColumns: PropFn<CssValueOf<'gridTemplateColumns'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `none | <track-list> | <auto-track-list> | subgrid <line-name-list>?`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |            IE            |
     * | :----: | :-----: | :------: | :----: | :----------------------: |
     * | **57** | **52**  | **10.1** | **16** | **10** _(-ms-grid-rows)_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-template-rows
     */
  gridTemplateRows: PropFn<CssValueOf<'gridTemplateRows'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | [ first || [ force-end | allow-end ] || last ]`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari | Edge | IE  |
     * | :----: | :-----: | :----: | :--: | :-: |
     * |   No   |   No    | **10** |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/hanging-punctuation
     */
  hangingPunctuation: PropFn<CssValueOf<'hangingPunctuation'>>
  /**
   * 设置元素的**内容区高度**。行为与 `width` 类似，但百分比参照父元素**高度**（且父高度需显式设置才生效）。
   *
   * ## 关键字
   *
   * ### 4 个尺寸关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `auto` | **默认值**。浏览器自动计算：块级元素（`display: block`）撑满父容器 content-box 宽度；行内元素 / flex 项目 / grid 单元格 = 内容宽度 | 通常不需要显式写，块级布局默认行为 |
   * | `minContent` | 元素尽可能收窄，直到再窄一个像素就会使内容溢出为止。等于"最长不可断单词/图片"的宽度 | 让宽度跟随最小内容，避免拉伸过宽；表格列紧凑排列 |
   * | `maxContent` | 元素扩展到"理想宽度"——如果空间无限大它会有多宽。等于最长文本行不换行时的宽度 | 让元素像 Tag / Badge 一样宽度跟随文字，但不被容器压缩 |
   * | `fitContent` | `min(max-content, max(min-content, 可用宽度))`：尽量撑到 max-content，但不超过父容器；比父容器窄时收到 max-content | 响应式 Tooltip / 弹窗宽度自适应内容但不溢出 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `height`。⚠️ `height` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `height` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `height` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `height` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 百分比参照与父高度依赖
   *
   * `height: 50%` 参照**父元素 content-box 高度**。若父元素未设置明确高度（如父元素 `height: auto`），百分比高度**无效**，等同 `auto`。
   *
   * 这是 CSS 布局中最常见的困惑：想让子元素高度 100% 填满父容器，必须确保祖先链上每一级都有明确高度，或改用 flex / grid 布局。
   *
   * ### 块级 vs 行内
   *
   * 块级元素 `height: auto` = 高度跟随内容；行内元素 `height` 设置无效（改用 `line-height`）。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.height.px(200)         ≡ s.height('200px')
   * s.height.rem(1.5)        ≡ s.height('1.5rem')
   * s.height.em(2)           ≡ s.height('2em')      // 当前元素 font-size 的倍数
   * s.height.vw(50)          ≡ s.height('50vw')     // 视口宽 1%
   * s.height.dvw(50)         ≡ s.height('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.height.cqw(50)         ≡ s.height('50cqw')    // container query 容器尺寸
   * s.height.percent(50)     ≡ s.height('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.height('calc(100% - 32px)')
   * s.height('min(100%, 1200px)')
   * s.height('max(280px, 50%)')
   * s.height('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | — | **默认值**；块级元素撑满父宽，行内 / flex 项 = 内容宽 |
   * | `minContent` | — | 收窄至最小内容宽（最长不可断处） |
   * | `maxContent` | — | 扩展至理想宽度（不换行全行宽） |
   * | `fitContent` | — | 内容宽但不超父容器 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/height
   */
  height: PropCarrier<CssValueOf<'height'>, SizeTokens<T>, 'auto' | 'minContent' | 'maxContent' | 'fitContent' | GlobalKw, LengthUnits, never>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto | <string>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox |  Safari   |   Edge   | IE  |
     * | :-----: | :-----: | :-------: | :------: | :-: |
     * | **106** | **98**  |  **17**   | **106**  | No  |
     * | 6 _-x-_ |         | 5.1 _-x-_ | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/hyphenate-character
     */
  hyphenateCharacter: PropFn<CssValueOf<'hyphenateCharacter'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ auto | <integer> ]{1,3}`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **109** | **137** |   No   | **109** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/hyphenate-limit-chars
     */
  hyphenateLimitChars: PropFn<CssValueOf<'hyphenateLimitChars'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | manual | auto`
     *
     * **Initial value**: `manual`
     *
     * |  Chrome  | Firefox |  Safari   |  Edge  |      IE      |
     * | :------: | :-----: | :-------: | :----: | :----------: |
     * |  **55**  | **43**  |  **17**   | **79** | **10** _-x-_ |
     * | 13 _-x-_ | 6 _-x-_ | 5.1 _-x-_ |        |              |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/hyphens
     */
  hyphens: PropFn<CssValueOf<'hyphens'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2020.
     *
     * **Syntax**: `from-image | <angle> | [ <angle>? flip ]`
     *
     * **Initial value**: `from-image`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **81** | **26**  | **13.1** | **81** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/image-orientation
     */
  imageOrientation: PropFn<CssValueOf<'imageOrientation'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | crisp-edges | pixelated | smooth`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **13** | **3.6** | **6**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/image-rendering
     */
  imageRendering: PropFn<CssValueOf<'imageRendering'>>
  /**
     * The **`image-resolution`** CSS property specifies the intrinsic resolution of all raster images used in or on the element. It affects content images such as replaced elements and generated content, and decorative images such as `background-image` images.
     *
     * **Syntax**: `[ from-image || <resolution> ] && snap?`
     *
     * **Initial value**: `1dppx`
     */
  imageResolution: PropFn<CssValueOf<'imageResolution'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | [ <number> <integer>? ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox |   Safari    |  Edge   | IE  |
     * | :-----: | :-----: | :---------: | :-----: | :-: |
     * | **110** |   No    | **9** _-x-_ | **110** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/initial-letter
     */
  initialLetter: PropFn<CssValueOf<'initialLetter'>>
  /**
     * **Syntax**: `[ auto | alphabetic | hanging | ideographic ]`
     *
     * **Initial value**: `auto`
     */
  initialLetterAlign: PropFn<CssValueOf<'initialLetterAlign'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'width'>`
     *
     * **Initial value**: `auto`
     *
     * |           Chrome            | Firefox |            Safari             |  Edge  | IE  |
     * | :-------------------------: | :-----: | :---------------------------: | :----: | :-: |
     * |           **57**            | **41**  |           **12.1**            | **79** | No  |
     * | 8 _(-webkit-logical-width)_ |         | 5.1 _(-webkit-logical-width)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inline-size
     */
  inlineSize: PropFn<CssValueOf<'inlineSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **63**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset-block-end
     */
  insetBlockEnd: PropFn<CssValueOf<'insetBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **63**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset-block-start
     */
  insetBlockStart: PropFn<CssValueOf<'insetBlockStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **63**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset-inline-end
     */
  insetInlineEnd: PropFn<CssValueOf<'insetInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **63**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset-inline-start
     */
  insetInlineStart: PropFn<CssValueOf<'insetInlineStart'>>
  /**
   * 允许 `auto` / `min-content` 等**内容驱动尺寸关键字**参与 `transition` / `@keyframes` 动画（默认这些值无法动画）。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `numericOnly` | **默认值**。仅数值（如 px）才能动画 |
   * | `allowKeywords` | 允许 `auto` / `fit-content` / `min-content` / `max-content` 等关键字参与动画 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `interpolateSize`。⚠️ `interpolateSize` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `numericOnly` |
   * | `unset` | `interpolateSize` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `interpolateSize` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `interpolateSize` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：高度从 0 → auto 动画
   *
   * ```ts
   * // 给祖先（如 :root）
   * s.interpolateSize.allowKeywords
   *
   * // 然后子元素可以动画 height: auto
   * s.transition('height 300ms')
   * s.height(0)
   * // hover/active: s.height('auto')         // 现在可以动画了
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `numericOnly` ｜ `allowKeywords` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `numericOnly`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari |  Edge   | IE  |
   * | :-----: | :-----: | :----: | :-----: | :-: |
   * | **129** |   No    |   No   | **129** | No  |
   *
   * CSS Values 5 新属性，Chrome 129+。其他浏览器尚未支持。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/interpolate-size
   */
  interpolateSize: PropCarrier<CssValueOf<'interpolateSize'>, never, 'allowKeywords' | 'numericOnly' | GlobalKw, unknown, never>
  /**
   * 控制元素是否创建**新的层叠上下文**（stacking context）。常用于让 `mix-blend-mode` 局部生效，不影响外部。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。不强制创建层叠上下文（但其他属性如 `opacity < 1` / `transform` 仍可能创建） |
   * | `isolate` | **强制创建**新的层叠上下文 —— 内部的 `mix-blend-mode` 只与本上下文内的元素混合，不影响外部 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `isolation`。⚠️ `isolation` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `isolation` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `isolation` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `isolation` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * 让 `mix-blend-mode` 局部生效：
   *
   * ```ts
   * // 父容器
   * s.isolation.isolate                  // 创建层叠上下文
   *
   * // 子元素
   * s.mixBlendMode.multiply              // 只与本上下文内的兄弟混合，不影响整页
   * ```
   *
   * ### 不引入额外副作用
   *
   * 相比其他"触发层叠上下文"的属性（`opacity` / `transform` / `will-change`），`isolation: isolate` 不带任何视觉副作用，是**最干净**的层叠上下文触发器。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `auto` ｜ `isolate` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **41** | **36**  | **8**  | **79** | No  |
   *
   * Chrome 41 / Firefox 36 / Safari 8。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/isolation
   */
  isolation: PropCarrier<CssValueOf<'isolation'>, never, 'auto' | 'isolate' | GlobalKw, unknown, never>
  /**
   * flex / grid 容器**主轴方向**上的对齐方式。控制子元素如何分配剩余空间（左对齐 / 居中 / 两端 / 等距等）。
   *
   * ## 关键字
   *
   * ### 基础对齐（沿主轴起点 / 终点 / 中点）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `flexStart` | **默认值**（flex 容器）。子元素挤到主轴**起点** |
   * | `flexEnd` | 挤到主轴**终点** |
   * | `center` | 主轴**居中** |
   * | `start` | 挤到容器**逻辑起点**（取代 flex-start，对 flex/grid 通用） |
   * | `end` | 挤到容器**逻辑终点** |
   * | `left` | 挤到容器**左侧**（不依赖书写方向） |
   * | `right` | 挤到容器**右侧** |
   *
   * ### 分布对齐（分配剩余空间）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `spaceBetween` | 两端贴边，**其余空间均分到子元素之间**（第一个贴起点，最后一个贴终点） |
   * | `spaceAround` | 每个子元素两侧距离相等（**端点间距 = 中间间距的一半**） |
   * | `spaceEvenly` | 所有间距都相等（**端点间距 = 中间间距**） |
   *
   * ### 其他
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | 行为同 `start`（grid 容器中触发新规范） |
   * | `stretch` | flex 中无效；grid 中让子元素撑满轨道 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `justifyContent`。⚠️ `justifyContent` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `justifyContent` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `justifyContent` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `justifyContent` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 三种 space-* 视觉对比
   *
   * 容器宽 600px，3 个子元素各 80px，剩余 360px 空间分配方式：
   *
   * ```
   * spaceBetween:   [A]          [B]          [C]      间距 180 / 180，两端 0
   * spaceAround:      [A]       [B]       [C]          端点 60，中间 120
   * spaceEvenly:        [A]    [B]    [C]              所有间距 90
   * ```
   *
   * ### 经典用法
   *
   * ```ts
   * // 完美居中
   * s.display.flex
   * s.justifyContent.center
   * s.alignItems.center
   *
   * // 两端对齐导航
   * s.display.flex
   * s.justifyContent.spaceBetween         // [logo] ............. [user]
   *
   * // 工具栏
   * s.display.flex
   * s.justifyContent.flexEnd
   * s.gap.px(8)    // 按钮组右对齐
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 基础对齐 | `flexStart` ｜ `flexEnd` ｜ `center` ｜ `start` ｜ `end` ｜ `left` ｜ `right` | 子元素挤到某一端 / 居中 |
   * | 分布对齐 | `spaceBetween` ｜ `spaceAround` ｜ `spaceEvenly` | 剩余空间分配规则 |
   * | 其他 | `normal` ｜ `stretch` | grid 容器中常用 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :------: | :-----: | :-----: | :----: | :----: |
   * |  **29**  | **20**  |  **9**  | **12** | **11** |
   * | 21 _-x-_ |         | 7 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/justify-content
   */
  justifyContent: PropCarrier<CssValueOf<'justifyContent'>, never, 'flexStart' | 'flexEnd' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly' | 'normal' | 'stretch' | 'start' | 'end' | 'left' | 'right' | GlobalKw, unknown, never>
  /**
   * **grid** 容器中：所有子元素在**主轴方向**（行内方向）上的默认对齐方式。在 flex 容器中无效（用 `justifyContent`）。
   *
   * ## 关键字
   *
   * ### 基础对齐（沿主轴起点 / 终点 / 中点）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `flexStart` | **默认值**（flex 容器）。子元素挤到主轴**起点** |
   * | `flexEnd` | 挤到主轴**终点** |
   * | `center` | 主轴**居中** |
   * | `start` | 挤到容器**逻辑起点**（取代 flex-start，对 flex/grid 通用） |
   * | `end` | 挤到容器**逻辑终点** |
   * | `left` | 挤到容器**左侧**（不依赖书写方向） |
   * | `right` | 挤到容器**右侧** |
   *
   * ### 分布对齐（分配剩余空间）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `spaceBetween` | 两端贴边，**其余空间均分到子元素之间**（第一个贴起点，最后一个贴终点） |
   * | `spaceAround` | 每个子元素两侧距离相等（**端点间距 = 中间间距的一半**） |
   * | `spaceEvenly` | 所有间距都相等（**端点间距 = 中间间距**） |
   *
   * ### 其他
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | 行为同 `start`（grid 容器中触发新规范） |
   * | `stretch` | flex 中无效；grid 中让子元素撑满轨道 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `justifyItems`。⚠️ `justifyItems` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `justifyItems` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `justifyItems` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `justifyItems` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 三种 space-* 视觉对比
   *
   * 容器宽 600px，3 个子元素各 80px，剩余 360px 空间分配方式：
   *
   * ```
   * spaceBetween:   [A]          [B]          [C]      间距 180 / 180，两端 0
   * spaceAround:      [A]       [B]       [C]          端点 60，中间 120
   * spaceEvenly:        [A]    [B]    [C]              所有间距 90
   * ```
   *
   * ### 经典用法
   *
   * ```ts
   * // 完美居中
   * s.display.flex
   * s.justifyContent.center
   * s.alignItems.center
   *
   * // 两端对齐导航
   * s.display.flex
   * s.justifyContent.spaceBetween         // [logo] ............. [user]
   *
   * // 工具栏
   * s.display.flex
   * s.justifyContent.flexEnd
   * s.gap.px(8)    // 按钮组右对齐
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 基础对齐 | `flexStart` ｜ `flexEnd` ｜ `center` ｜ `start` ｜ `end` ｜ `left` ｜ `right` | 子元素挤到某一端 / 居中 |
   * | 分布对齐 | `spaceBetween` ｜ `spaceAround` ｜ `spaceEvenly` | 剩余空间分配规则 |
   * | 其他 | `normal` ｜ `stretch` | grid 容器中常用 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE   |
   * | :----: | :-----: | :----: | :----: | :----: |
   * | **52** | **20**  | **9**  | **12** | **11** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/justify-items
   */
  justifyItems: PropCarrier<CssValueOf<'justifyItems'>, never, 'flexStart' | 'flexEnd' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly' | 'normal' | 'stretch' | 'start' | 'end' | 'left' | 'right' | GlobalKw, unknown, never>
  /**
   * **grid 子元素**在**主轴方向**（行内方向）上的对齐方式（覆盖父的 `justifyItems`）。在 flex 子元素中无效。
   *
   * ## 关键字
   *
   * ### 基础对齐（沿主轴起点 / 终点 / 中点）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `flexStart` | **默认值**（flex 容器）。子元素挤到主轴**起点** |
   * | `flexEnd` | 挤到主轴**终点** |
   * | `center` | 主轴**居中** |
   * | `start` | 挤到容器**逻辑起点**（取代 flex-start，对 flex/grid 通用） |
   * | `end` | 挤到容器**逻辑终点** |
   * | `left` | 挤到容器**左侧**（不依赖书写方向） |
   * | `right` | 挤到容器**右侧** |
   *
   * ### 分布对齐（分配剩余空间）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `spaceBetween` | 两端贴边，**其余空间均分到子元素之间**（第一个贴起点，最后一个贴终点） |
   * | `spaceAround` | 每个子元素两侧距离相等（**端点间距 = 中间间距的一半**） |
   * | `spaceEvenly` | 所有间距都相等（**端点间距 = 中间间距**） |
   *
   * ### 其他
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | 行为同 `start`（grid 容器中触发新规范） |
   * | `stretch` | flex 中无效；grid 中让子元素撑满轨道 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `justifySelf`。⚠️ `justifySelf` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `justifySelf` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `justifySelf` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `justifySelf` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 三种 space-* 视觉对比
   *
   * 容器宽 600px，3 个子元素各 80px，剩余 360px 空间分配方式：
   *
   * ```
   * spaceBetween:   [A]          [B]          [C]      间距 180 / 180，两端 0
   * spaceAround:      [A]       [B]       [C]          端点 60，中间 120
   * spaceEvenly:        [A]    [B]    [C]              所有间距 90
   * ```
   *
   * ### 经典用法
   *
   * ```ts
   * // 完美居中
   * s.display.flex
   * s.justifyContent.center
   * s.alignItems.center
   *
   * // 两端对齐导航
   * s.display.flex
   * s.justifyContent.spaceBetween         // [logo] ............. [user]
   *
   * // 工具栏
   * s.display.flex
   * s.justifyContent.flexEnd
   * s.gap.px(8)    // 按钮组右对齐
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 基础对齐 | `flexStart` ｜ `flexEnd` ｜ `center` ｜ `start` ｜ `end` ｜ `left` ｜ `right` ｜ `auto` | `auto` 表示继承父的 justifyItems |
   * | 分布对齐 | `spaceBetween` ｜ `spaceAround` ｜ `spaceEvenly` |  |
   * | 其他 | `normal` ｜ `stretch` |  |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  |   IE   |
   * | :----: | :-----: | :------: | :----: | :----: |
   * | **57** | **45**  | **10.1** | **16** | **10** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/justify-self
   */
  justifySelf: PropCarrier<CssValueOf<'justifySelf'>, never, 'flexStart' | 'flexEnd' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly' | 'normal' | 'stretch' | 'start' | 'end' | 'left' | 'right' | 'auto' | GlobalKw, unknown, never>
  /**
     * **Syntax**: `[ normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ] ]#`
     *
     * **Initial value**: `normal`
     */
  justifyTracks: PropFn<CssValueOf<'justifyTracks'>>
  /**
   * 设置定位元素距**左侧**的偏移量。正值向右移，负值向左溢出。**只在 `position` 非 `static` 时生效**。其他规则同 [`inset`]。
   *
   * ## 关键字
   *
   * ### 1 个偏移关键字
   *
   * | 关键字 | 效果 | 说明 |
   * | --- | --- | --- |
   * | `auto` | **默认值**。不参与定位，交由浏览器按正常文档流决定位置 | 未定位元素（`position: static`）的默认状态；也用于取消之前设过的偏移 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `left`。⚠️ `left` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `left` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `left` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `left` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### ⚠️ 必须配合 position: relative/absolute/fixed/sticky 才生效
   *
   * `top` / `right` / `bottom` / `left`（以及 `inset`）对 `position: static`（默认值）的元素**无效**。
   *
   * ### 简写语法（与 margin/padding 相同的 1/2/3/4 值规则）
   *
   * ```ts
   * s.inset.px(0)                     // 四边均偏移 0（常用于绝对定位充满父容器）
   * s.inset('0 16px')                 // 上下 0，左右 16px
   * s.inset('8px 16px 24px 32px')     // 上 右 下 左（顺时针）
   * ```
   *
   * ### 偏移基准（四种定位各不同）
   *
   * | position | 偏移基准 |
   * | --- | --- |
   * | `relative` | **元素原始位置**（偏移后原位仍占空间） |
   * | `absolute` | **最近的定位祖先**（position 非 static 的祖先）的 padding-box 边缘 |
   * | `fixed` | **视口**（viewport）边缘（⚠️ 祖先有 `transform` / `will-change: transform` / `filter` 时变为祖先 padding-box） |
   * | `sticky` | 正常文档流位置（偏移值 = 粘住后距视口边缘的距离） |
   *
   * ### 绝对定位充满父容器
   *
   * ```ts
   * s.position.absolute
   * s.inset.px(0)   // 等同 top:0 right:0 bottom:0 left:0
   * // 前提：父容器 position 不是 static
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.inset.px(200)         ≡ s.inset('200px')
   * s.inset.rem(1.5)        ≡ s.inset('1.5rem')
   * s.inset.em(2)           ≡ s.inset('2em')      // 当前元素 font-size 的倍数
   * s.inset.vw(50)          ≡ s.inset('50vw')     // 视口宽 1%
   * s.inset.dvw(50)         ≡ s.inset('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.inset.cqw(50)         ≡ s.inset('50cqw')    // container query 容器尺寸
   * s.inset.percent(50)     ≡ s.inset('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.inset('calc(100% - 32px)')
   * s.inset('min(100%, 1200px)')
   * s.inset('max(280px, 50%)')
   * s.inset('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | — | **默认值**；不偏移，由文档流决定位置 |
   * | 多值简写 | `'0 16px'` `'8px 16px 24px 32px'` | 1/2/3/4 个值，顺时针分配到四边 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE    |
   * | :----: | :-----: | :----: | :----: | :-----: |
   * | **1**  |  **1**  | **1**  | **12** | **5.5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/left
   */
  left: PropCarrier<CssValueOf<'left'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * 设置**字符之间**的额外间距（正值变宽松，负值变紧凑）。常用于标题字间距优化。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。字体本身的间距设定 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `letterSpacing`。⚠️ `letterSpacing` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `letterSpacing` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `letterSpacing` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `letterSpacing` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 大标题增加字间距（视觉更稳）
   * s.fontSize('48px')
   * s.letterSpacing.px(-1)     // 负值（紧凑）
   *
   * // 全大写英文加字间距（提升可读性）
   * s.textTransform.uppercase
   * s.letterSpacing.em(0.05)
   *
   * // 中文标题适度展开
   * s.letterSpacing.em(0.1)
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.letterSpacing.px(200)         ≡ s.letterSpacing('200px')
   * s.letterSpacing.rem(1.5)        ≡ s.letterSpacing('1.5rem')
   * s.letterSpacing.em(2)           ≡ s.letterSpacing('2em')      // 当前元素 font-size 的倍数
   * s.letterSpacing.vw(50)          ≡ s.letterSpacing('50vw')     // 视口宽 1%
   * s.letterSpacing.dvw(50)         ≡ s.letterSpacing('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.letterSpacing.cqw(50)         ≡ s.letterSpacing('50cqw')    // container query 容器尺寸
   * s.letterSpacing.percent(50)     ≡ s.letterSpacing('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.letterSpacing('calc(100% - 32px)')
   * s.letterSpacing('min(100%, 1200px)')
   * s.letterSpacing('max(280px, 50%)')
   * s.letterSpacing('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'0.5px'` `'-0.5px'` `'0.05em'` | 可正可负 |
   * | `normal` | — | 字体本身的间距 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/letter-spacing
   */
  letterSpacing: PropCarrier<CssValueOf<'letterSpacing'>, LetterSpacingTokens<T>, 'normal' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `white`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **5**  |  **3**  | **6**  | **12** | **≤11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/lighting-color
     */
  lightingColor: PropFn<CssValueOf<'lightingColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `auto | loose | normal | strict | anywhere`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE    |
     * | :-----: | :-----: | :-----: | :----: | :-----: |
     * | **58**  | **69**  | **11**  | **14** | **5.5** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |         |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/line-break
     */
  lineBreak: PropFn<CssValueOf<'lineBreak'>>
  /**
   * 设置文字**行高** —— 每行文字占据的垂直空间。直接影响段落呼吸感与可读性。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。浏览器默认（约 1.0~1.2，因字体而异） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `lineHeight`。⚠️ `lineHeight` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `lineHeight` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `lineHeight` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `lineHeight` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态：多种写法
   *
   * | 写法 | 例 | 计算 |
   * | --- | --- | --- |
   * | **无单位数字** | `lineHeight(1.5)` | 当前字号 × 1.5（**推荐**：子元素继承时按各自字号计算） |
   * | 长度 | `lineHeight.px(24)` | 固定 24px（子元素继承会用固定值，可能不合适） |
   * | 百分比 | `lineHeight('150%')` | 当前字号的 150%（**已计算成长度继承**） |
   * | em | `lineHeight('1.5em')` | 当前字号 × 1.5（已计算） |
   *
   * ### 推荐用无单位数字
   *
   * ```ts
   * s.lineHeight(1.5)                // 子元素继承后按各自字号重新算（最稳）
   * ```
   *
   * ### 常用值参考
   *
   * - `1.0` 紧密（标题）
   * - `1.2~1.4` 紧凑（按钮、表格）
   * - `1.5~1.6` 段落正文（最舒适阅读）
   * - `1.8~2.0` 宽松（强调可读性）
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.lineHeight.px(200)         ≡ s.lineHeight('200px')
   * s.lineHeight.rem(1.5)        ≡ s.lineHeight('1.5rem')
   * s.lineHeight.em(2)           ≡ s.lineHeight('2em')      // 当前元素 font-size 的倍数
   * s.lineHeight.vw(50)          ≡ s.lineHeight('50vw')     // 视口宽 1%
   * s.lineHeight.dvw(50)         ≡ s.lineHeight('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.lineHeight.cqw(50)         ≡ s.lineHeight('50cqw')    // container query 容器尺寸
   * s.lineHeight.percent(50)     ≡ s.lineHeight('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.lineHeight('calc(100% - 32px)')
   * s.lineHeight('min(100%, 1200px)')
   * s.lineHeight('max(280px, 50%)')
   * s.lineHeight('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 无单位数字 | `1.5` `1.2` | **推荐**：子元素按各自字号算 |
   * | `<length>` | `'24px'` `'1.5rem'` | 固定长度（继承时维持固定值） |
   * | `<percentage>` | `'150%'` | 相对字号 |
   * | `normal` | — | 浏览器默认 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/line-height
   */
  lineHeight: PropCarrier<CssValueOf<'lineHeight'>, LineHeightTokens<T>, 'normal' | GlobalKw, LengthUnits, never>
  /**
     * The **`line-height-step`** CSS property sets the step unit for line box heights. When the property is set, line box heights are rounded up to the closest multiple of the unit.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     */
  lineHeightStep: PropFn<CssValueOf<'lineHeightStep'>>
  /**
   * 使用**图片**作为列表标记（替代 `listStyleType` 的字符）。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不使用图片 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `listStyleImage`。⚠️ `listStyleImage` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `listStyleImage` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `listStyleImage` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `listStyleImage` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.listStyleImage("url('/icons/check.svg')")
   * ```
   *
   * ⚠️ 浏览器对图片大小无统一控制，**多数现代项目改用 `::marker` 伪元素或自定义符号**。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<url>` | `"url('/icons/dot.svg')"` | 图片 URL |
   * | `none` | — | 不使用图片 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/list-style-image
   */
  listStyleImage: PropCarrier<CssValueOf<'listStyleImage'>, never, 'none' | GlobalKw, unknown, never>
  /**
   * 决定列表标记**在文本之外还是文本流之内**。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `outside` | **默认值**。标记在 li 的内容框**外侧**（标记不参与换行缩进） |
   * | `inside` | 标记**在 li 内容内**（标记跟随文字一起缩进、参与换行） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `listStylePosition`。⚠️ `listStylePosition` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `outside` |
   * | `unset` | `listStylePosition` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `listStylePosition` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `listStylePosition` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `outside` ｜ `inside` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `outside`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/list-style-position
   */
  listStylePosition: PropCarrier<CssValueOf<'listStylePosition'>, never, 'inside' | 'outside' | GlobalKw, unknown, never>
  /**
   * 设置列表项的**标记类型**（点 / 数字 / 罗马字 / 自定义）。
   *
   * ## 关键字
   *
   * ### 基础标记
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `disc` | **默认值**（`<ul>`）。实心圆点 • |
   * | `circle` | 空心圆 ○ |
   * | `square` | 实心方块 ▪ |
   * | `none` | **无标记**（常用于自定义列表） |
   *
   * ### 数字 / 字母
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `decimal` | **默认值**（`<ol>`）。阿拉伯数字 1, 2, 3 |
   * | `decimalLeadingZero` | 带前导零的数字 01, 02, 03 |
   * | `lowerRoman` | 小写罗马字 i, ii, iii |
   * | `upperRoman` | 大写罗马字 I, II, III |
   * | `lowerAlpha` | 小写字母 a, b, c |
   * | `upperAlpha` | 大写字母 A, B, C |
   *
   * ### 国际化
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `lowerGreek` | 小写希腊字母 α, β, γ |
   * | `armenian` | 亚美尼亚数字 |
   * | `georgian` | 格鲁吉亚数字 |
   * | `hebrew` | 希伯来数字 |
   * | `hiragana` | 日语平假名 あ, い, う |
   * | `katakana` | 日语片假名 ア, イ, ウ |
   * | `cjkIdeographic` | CJK 表意文字 一, 二, 三 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `listStyleType`。⚠️ `listStyleType` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `disc` |
   * | `unset` | `listStyleType` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `listStyleType` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `listStyleType` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态：自定义符号
   *
   * ```ts
   * s.listStyleType("'→ '")              // 用箭头作标记
   * s.listStyleType('"★ "')              // 自定义符号
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 基础标记 | `disc` ｜ `circle` ｜ `square` ｜ `none` | 常用 |
   * | 数字 / 字母 | `decimal` `decimalLeadingZero` `lowerRoman` `upperRoman` `lowerAlpha` `upperAlpha` |  |
   * | 国际化 | `lowerGreek` `armenian` `georgian` `hebrew` `hiragana` `katakana` `cjkIdeographic` |  |
   * | 自定义字符 | `"'★ '"` | 用字符串作为标记 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `disc`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/list-style-type
   */
  listStyleType: PropCarrier<CssValueOf<'listStyleType'>, never, 'disc' | 'circle' | 'square' | 'none' | 'decimal' | 'decimalLeadingZero' | 'lowerRoman' | 'upperRoman' | 'lowerAlpha' | 'upperAlpha' | 'lowerGreek' | 'armenian' | 'georgian' | 'hebrew' | 'hiragana' | 'katakana' | 'cjkIdeographic' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-block-end
     */
  marginBlockEnd: PropFn<CssValueOf<'marginBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-block-start
     */
  marginBlockStart: PropFn<CssValueOf<'marginBlockStart'>>
  /**
   * 设置元素的**下外边距**。常用于段落 / 标题之间的垂直间隔。其他规则同 [`margin`]。
   *
   * ## 关键字
   *
   * ### 1 个外边距关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `auto` | 浏览器按剩余空间自动分配。**常用于水平居中**：`margin: 0 auto` 让块级元素在父容器中水平居中（左右各自分配剩余空间的一半） | 水平居中：`s.margin('0 auto')`；`margin-left: auto` 把元素推到右侧（flex 布局右对齐技巧） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `marginBottom`。⚠️ `marginBottom` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `marginBottom` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `marginBottom` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `marginBottom` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `margin('16px')` | 四边均为 16px |
   * | `margin('8px 16px')` | 上下 8px，左右 16px |
   * | `margin('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `margin('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### 水平居中经典写法
   *
   * ```ts
   * s.width.px(800)
   * s.margin('0 auto')
   * // 块级元素 800px 宽，左右 auto 均分剩余空间 = 水平居中
   * // 等价于：marginLeft.auto + marginRight.auto
   * ```
   *
   * ⚠️ `margin: auto` **只在水平方向**对 block 元素生效；垂直居中需用 flex / grid。
   *
   * ### 百分比参照
   *
   * `margin: 25%` 参照**父元素宽度**（即使是 marginTop / marginBottom 也参照宽，这是反直觉的 CSS 规则）。
   *
   * ### 外边距折叠（Margin Collapse）
   *
   * ⚠️ **只有普通文档流中的块级元素**在**垂直方向**会发生外边距折叠：
   * - 相邻兄弟元素：两个上下 margin 取较大值（不是相加）
   * - 父子元素：父无 border/padding/BFC 时，子元素的 marginTop 会"穿透"成为父元素的 marginTop
   *
   * **以下情况不折叠**：flex 容器子项、grid 子项、绝对定位元素、inline 元素。
   *
   * ### 接受负值
   *
   * `margin` 接受**负值**，可以让元素向反方向移动甚至与相邻元素重叠。`padding` **不接受负值**。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.margin.px(200)         ≡ s.margin('200px')
   * s.margin.rem(1.5)        ≡ s.margin('1.5rem')
   * s.margin.em(2)           ≡ s.margin('2em')      // 当前元素 font-size 的倍数
   * s.margin.vw(50)          ≡ s.margin('50vw')     // 视口宽 1%
   * s.margin.dvw(50)         ≡ s.margin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.margin.cqw(50)         ≡ s.margin('50cqw')    // container query 容器尺寸
   * s.margin.percent(50)     ≡ s.margin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.margin('calc(100% - 32px)')
   * s.margin('min(100%, 1200px)')
   * s.margin('max(280px, 50%)')
   * s.margin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | `'auto'`（或多值如 `'0 auto'`） | 让浏览器按剩余空间分配；`0 auto` 水平居中 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，按上述简写规则分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **3** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-bottom
   */
  marginBottom: PropCarrier<CssValueOf<'marginBottom'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     *
     * |          Chrome          |        Firefox        |          Safari          |  Edge  | IE  |
     * | :----------------------: | :-------------------: | :----------------------: | :----: | :-: |
     * |          **69**          |        **41**         |         **12.1**         | **79** | No  |
     * | 2 _(-webkit-margin-end)_ | 3 _(-moz-margin-end)_ | 3 _(-webkit-margin-end)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-inline-end
     */
  marginInlineEnd: PropFn<CssValueOf<'marginInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     *
     * |           Chrome           |         Firefox         |           Safari           |  Edge  | IE  |
     * | :------------------------: | :---------------------: | :------------------------: | :----: | :-: |
     * |           **69**           |         **41**          |          **12.1**          | **79** | No  |
     * | 2 _(-webkit-margin-start)_ | 3 _(-moz-margin-start)_ | 3 _(-webkit-margin-start)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-inline-start
     */
  marginInlineStart: PropFn<CssValueOf<'marginInlineStart'>>
  /**
   * 设置元素的**左外边距**。`auto` 可把元素推到容器右侧（左侧留空），是 flex 布局末尾对齐常用技巧。其他规则同 [`margin`]。
   *
   * ## 关键字
   *
   * ### 1 个外边距关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `auto` | 浏览器按剩余空间自动分配。**常用于水平居中**：`margin: 0 auto` 让块级元素在父容器中水平居中（左右各自分配剩余空间的一半） | 水平居中：`s.margin('0 auto')`；`margin-left: auto` 把元素推到右侧（flex 布局右对齐技巧） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `marginLeft`。⚠️ `marginLeft` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `marginLeft` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `marginLeft` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `marginLeft` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `margin('16px')` | 四边均为 16px |
   * | `margin('8px 16px')` | 上下 8px，左右 16px |
   * | `margin('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `margin('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### 水平居中经典写法
   *
   * ```ts
   * s.width.px(800)
   * s.margin('0 auto')
   * // 块级元素 800px 宽，左右 auto 均分剩余空间 = 水平居中
   * // 等价于：marginLeft.auto + marginRight.auto
   * ```
   *
   * ⚠️ `margin: auto` **只在水平方向**对 block 元素生效；垂直居中需用 flex / grid。
   *
   * ### 百分比参照
   *
   * `margin: 25%` 参照**父元素宽度**（即使是 marginTop / marginBottom 也参照宽，这是反直觉的 CSS 规则）。
   *
   * ### 外边距折叠（Margin Collapse）
   *
   * ⚠️ **只有普通文档流中的块级元素**在**垂直方向**会发生外边距折叠：
   * - 相邻兄弟元素：两个上下 margin 取较大值（不是相加）
   * - 父子元素：父无 border/padding/BFC 时，子元素的 marginTop 会"穿透"成为父元素的 marginTop
   *
   * **以下情况不折叠**：flex 容器子项、grid 子项、绝对定位元素、inline 元素。
   *
   * ### 接受负值
   *
   * `margin` 接受**负值**，可以让元素向反方向移动甚至与相邻元素重叠。`padding` **不接受负值**。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.margin.px(200)         ≡ s.margin('200px')
   * s.margin.rem(1.5)        ≡ s.margin('1.5rem')
   * s.margin.em(2)           ≡ s.margin('2em')      // 当前元素 font-size 的倍数
   * s.margin.vw(50)          ≡ s.margin('50vw')     // 视口宽 1%
   * s.margin.dvw(50)         ≡ s.margin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.margin.cqw(50)         ≡ s.margin('50cqw')    // container query 容器尺寸
   * s.margin.percent(50)     ≡ s.margin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.margin('calc(100% - 32px)')
   * s.margin('min(100%, 1200px)')
   * s.margin('max(280px, 50%)')
   * s.margin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | `'auto'`（或多值如 `'0 auto'`） | 让浏览器按剩余空间分配；`0 auto` 水平居中 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，按上述简写规则分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **3** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-left
   */
  marginLeft: PropCarrier<CssValueOf<'marginLeft'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * 设置元素的**右外边距**。正值向右推开相邻内容，`auto` 可把元素推到容器左侧（右侧留空）。其他规则同 [`margin`]。
   *
   * ## 关键字
   *
   * ### 1 个外边距关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `auto` | 浏览器按剩余空间自动分配。**常用于水平居中**：`margin: 0 auto` 让块级元素在父容器中水平居中（左右各自分配剩余空间的一半） | 水平居中：`s.margin('0 auto')`；`margin-left: auto` 把元素推到右侧（flex 布局右对齐技巧） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `marginRight`。⚠️ `marginRight` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `marginRight` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `marginRight` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `marginRight` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `margin('16px')` | 四边均为 16px |
   * | `margin('8px 16px')` | 上下 8px，左右 16px |
   * | `margin('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `margin('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### 水平居中经典写法
   *
   * ```ts
   * s.width.px(800)
   * s.margin('0 auto')
   * // 块级元素 800px 宽，左右 auto 均分剩余空间 = 水平居中
   * // 等价于：marginLeft.auto + marginRight.auto
   * ```
   *
   * ⚠️ `margin: auto` **只在水平方向**对 block 元素生效；垂直居中需用 flex / grid。
   *
   * ### 百分比参照
   *
   * `margin: 25%` 参照**父元素宽度**（即使是 marginTop / marginBottom 也参照宽，这是反直觉的 CSS 规则）。
   *
   * ### 外边距折叠（Margin Collapse）
   *
   * ⚠️ **只有普通文档流中的块级元素**在**垂直方向**会发生外边距折叠：
   * - 相邻兄弟元素：两个上下 margin 取较大值（不是相加）
   * - 父子元素：父无 border/padding/BFC 时，子元素的 marginTop 会"穿透"成为父元素的 marginTop
   *
   * **以下情况不折叠**：flex 容器子项、grid 子项、绝对定位元素、inline 元素。
   *
   * ### 接受负值
   *
   * `margin` 接受**负值**，可以让元素向反方向移动甚至与相邻元素重叠。`padding` **不接受负值**。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.margin.px(200)         ≡ s.margin('200px')
   * s.margin.rem(1.5)        ≡ s.margin('1.5rem')
   * s.margin.em(2)           ≡ s.margin('2em')      // 当前元素 font-size 的倍数
   * s.margin.vw(50)          ≡ s.margin('50vw')     // 视口宽 1%
   * s.margin.dvw(50)         ≡ s.margin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.margin.cqw(50)         ≡ s.margin('50cqw')    // container query 容器尺寸
   * s.margin.percent(50)     ≡ s.margin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.margin('calc(100% - 32px)')
   * s.margin('min(100%, 1200px)')
   * s.margin('max(280px, 50%)')
   * s.margin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | `'auto'`（或多值如 `'0 auto'`） | 让浏览器按剩余空间分配；`0 auto` 水平居中 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，按上述简写规则分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **3** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-right
   */
  marginRight: PropCarrier<CssValueOf<'marginRight'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * 设置元素的**上外边距**。正值向下推开相邻内容，负值让元素上移。其他规则同 [`margin`]。
   *
   * ## 关键字
   *
   * ### 1 个外边距关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `auto` | 浏览器按剩余空间自动分配。**常用于水平居中**：`margin: 0 auto` 让块级元素在父容器中水平居中（左右各自分配剩余空间的一半） | 水平居中：`s.margin('0 auto')`；`margin-left: auto` 把元素推到右侧（flex 布局右对齐技巧） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `marginTop`。⚠️ `marginTop` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `marginTop` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `marginTop` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `marginTop` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `margin('16px')` | 四边均为 16px |
   * | `margin('8px 16px')` | 上下 8px，左右 16px |
   * | `margin('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `margin('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### 水平居中经典写法
   *
   * ```ts
   * s.width.px(800)
   * s.margin('0 auto')
   * // 块级元素 800px 宽，左右 auto 均分剩余空间 = 水平居中
   * // 等价于：marginLeft.auto + marginRight.auto
   * ```
   *
   * ⚠️ `margin: auto` **只在水平方向**对 block 元素生效；垂直居中需用 flex / grid。
   *
   * ### 百分比参照
   *
   * `margin: 25%` 参照**父元素宽度**（即使是 marginTop / marginBottom 也参照宽，这是反直觉的 CSS 规则）。
   *
   * ### 外边距折叠（Margin Collapse）
   *
   * ⚠️ **只有普通文档流中的块级元素**在**垂直方向**会发生外边距折叠：
   * - 相邻兄弟元素：两个上下 margin 取较大值（不是相加）
   * - 父子元素：父无 border/padding/BFC 时，子元素的 marginTop 会"穿透"成为父元素的 marginTop
   *
   * **以下情况不折叠**：flex 容器子项、grid 子项、绝对定位元素、inline 元素。
   *
   * ### 接受负值
   *
   * `margin` 接受**负值**，可以让元素向反方向移动甚至与相邻元素重叠。`padding` **不接受负值**。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.margin.px(200)         ≡ s.margin('200px')
   * s.margin.rem(1.5)        ≡ s.margin('1.5rem')
   * s.margin.em(2)           ≡ s.margin('2em')      // 当前元素 font-size 的倍数
   * s.margin.vw(50)          ≡ s.margin('50vw')     // 视口宽 1%
   * s.margin.dvw(50)         ≡ s.margin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.margin.cqw(50)         ≡ s.margin('50cqw')    // container query 容器尺寸
   * s.margin.percent(50)     ≡ s.margin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.margin('calc(100% - 32px)')
   * s.margin('min(100%, 1200px)')
   * s.margin('max(280px, 50%)')
   * s.margin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | `'auto'`（或多值如 `'0 auto'`） | 让浏览器按剩余空间分配；`0 auto` 水平居中 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，按上述简写规则分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **3** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-top
   */
  marginTop: PropCarrier<CssValueOf<'marginTop'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | in-flow | all`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  | Edge | IE  |
     * | :----: | :-----: | :------: | :--: | :-: |
     * |   No   |   No    | **16.4** |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-trim
     */
  marginTrim: PropFn<CssValueOf<'marginTrim'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `none | <url>`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/marker
     */
  marker: PropFn<CssValueOf<'marker'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `none | <url>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/marker-end
     */
  markerEnd: PropFn<CssValueOf<'markerEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `none | <url>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/marker-mid
     */
  markerMid: PropFn<CssValueOf<'markerMid'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `none | <url>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/marker-start
     */
  markerStart: PropFn<CssValueOf<'markerStart'>>
  /**
     * The **`mask-border-mode`** CSS property specifies the blending mode used in a mask border.
     *
     * **Syntax**: `luminance | alpha`
     *
     * **Initial value**: `alpha`
     */
  maskBorderMode: PropFn<CssValueOf<'maskBorderMode'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <length> | <number> ]{1,4}`
     *
     * **Initial value**: `0`
     *
     * |                 Chrome                  | Firefox |                Safari                 |                   Edge                   | IE  |
     * | :-------------------------------------: | :-----: | :-----------------------------------: | :--------------------------------------: | :-: |
     * | **1** _(-webkit-mask-box-image-outset)_ |   No    |               **17.2**                | **79** _(-webkit-mask-box-image-outset)_ | No  |
     * |                                         |         | 3.1 _(-webkit-mask-box-image-outset)_ |                                          |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-border-outset
     */
  maskBorderOutset: PropFn<CssValueOf<'maskBorderOutset'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ stretch | repeat | round | space ]{1,2}`
     *
     * **Initial value**: `stretch`
     *
     * |                 Chrome                  | Firefox |                Safari                 |                   Edge                   | IE  |
     * | :-------------------------------------: | :-----: | :-----------------------------------: | :--------------------------------------: | :-: |
     * | **1** _(-webkit-mask-box-image-repeat)_ |   No    |               **17.2**                | **79** _(-webkit-mask-box-image-repeat)_ | No  |
     * |                                         |         | 3.1 _(-webkit-mask-box-image-repeat)_ |                                          |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-border-repeat
     */
  maskBorderRepeat: PropFn<CssValueOf<'maskBorderRepeat'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<number-percentage>{1,4} fill?`
     *
     * **Initial value**: `0`
     *
     * |                 Chrome                 | Firefox |                Safari                |                  Edge                   | IE  |
     * | :------------------------------------: | :-----: | :----------------------------------: | :-------------------------------------: | :-: |
     * | **1** _(-webkit-mask-box-image-slice)_ |   No    |               **17.2**               | **79** _(-webkit-mask-box-image-slice)_ | No  |
     * |                                        |         | 3.1 _(-webkit-mask-box-image-slice)_ |                                         |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-border-slice
     */
  maskBorderSlice: PropFn<CssValueOf<'maskBorderSlice'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <image>`
     *
     * **Initial value**: `none`
     *
     * |                 Chrome                  | Firefox |                Safari                 |                   Edge                   | IE  |
     * | :-------------------------------------: | :-----: | :-----------------------------------: | :--------------------------------------: | :-: |
     * | **1** _(-webkit-mask-box-image-source)_ |   No    |               **17.2**                | **79** _(-webkit-mask-box-image-source)_ | No  |
     * |                                         |         | 3.1 _(-webkit-mask-box-image-source)_ |                                          |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-border-source
     */
  maskBorderSource: PropFn<CssValueOf<'maskBorderSource'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <length-percentage> | <number> | auto ]{1,4}`
     *
     * **Initial value**: `auto`
     *
     * |                 Chrome                 | Firefox |                Safari                |                  Edge                   | IE  |
     * | :------------------------------------: | :-----: | :----------------------------------: | :-------------------------------------: | :-: |
     * | **1** _(-webkit-mask-box-image-width)_ |   No    |               **17.2**               | **79** _(-webkit-mask-box-image-width)_ | No  |
     * |                                        |         | 3.1 _(-webkit-mask-box-image-width)_ |                                         |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-border-width
     */
  maskBorderWidth: PropFn<CssValueOf<'maskBorderWidth'>>
  /**
   * 蒙版**生效区域**裁剪边界:超出该边界的蒙版部分被裁掉。
   *
   * ## 关键字
   *
   * ### 6 个关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `border-box` | **默认值**。蒙版裁到 border 外缘 |
   * | `padding-box` | 蒙版裁到 padding 外缘 |
   * | `content-box` | 蒙版裁到内容区 |
   * | `fill-box` | SVG 几何盒 |
   * | `stroke-box` | SVG 含 stroke 盒 |
   * | `no-clip` | 不裁剪(CSS 4) |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `maskClip`。⚠️ `maskClip` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `border-box` |
   * | `unset` | `maskClip` 非继承属性 → 等同 `initial`（= `border-box`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `maskClip` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `maskClip` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **与 `mask-origin` 区别**:`origin` 是蒙版"起点"(原点位置),`clip` 是蒙版"边界"(超出剪掉)。两者通常同步设。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `border-box` / `padding-box` / `content-box` / `fill-box` / `stroke-box` / `no-clip` | 见上 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `border-box`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari  |   Edge   | IE  |
   * | :-----: | :-----: | :------: | :------: | :-: |
   * | **120** | **53**  | **15.4** | **120**  | No  |
   * | 1 _-x-_ |         | 4 _-x-_  | 79 _-x-_ |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-clip
   */
  maskClip: PropFn<CssValueOf<'maskClip'>>
  /**
   * 多张蒙版**复合方式**(类似 Photoshop 图层混合)。
   *
   * ## 关键字
   *
   * ### 4 种复合
   *
   * | 关键字 | 运算 | 直观效果 |
   * | --- | --- | --- |
   * | `add` | A ∪ B | **默认值**。两蒙版并集 —— 任一显示即显示 |
   * | `subtract` | A - B | 从 A 减去 B 显示区(打洞) |
   * | `intersect` | A ∩ B | 两蒙版交集 —— 两者都显示才显示 |
   * | `exclude` | A ⊕ B | 异或 —— 只在一个里时显示(交集隐藏) |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `maskComposite`。⚠️ `maskComposite` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `add` |
   * | `unset` | `maskComposite` 非继承属性 → 等同 `initial`（= `add`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `maskComposite` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `maskComposite` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * 多值时第 N 个 composite 控制第 N 张 mask-image 与下层合成结果的关系。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `add` / `subtract` / `intersect` / `exclude` | 见上 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `add`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari  | Edge  | IE  |
   * | :-----: | :-----: | :------: | :---: | :-: |
   * | **120** | **53**  | **15.4** | 18-79 | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-composite
   */
  maskComposite: PropFn<CssValueOf<'maskComposite'>>
  /**
   * 蒙版**图像/渐变源**。模板的 alpha(或 luminance,见 `mask-mode`)决定元素显示/隐藏。
   *
   * ## 关键字
   *
   * ### 取值形式
   *
   * | 关键字 / 形式 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无蒙版 |
   * | `<image>` | 任意 CSS 图像:`url(...)` / 渐变 / `image-set(...)` |
   * | `<gradient>` | `linear-gradient` / `radial-gradient` / `conic-gradient` 等 |
   * | 多张叠加 | 逗号分隔多个值:第一张在顶层,按 `mask-composite` 复合 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `maskImage`。⚠️ `maskImage` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `maskImage` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `maskImage` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `maskImage` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **配合 `mask-mode` 决定如何读模板**:
   * - `alpha` —— 模板 alpha 通道决定透明度(默认行为)
   * - `luminance` —— 模板亮度决定透明度(黑=隐藏 / 白=显示;适合无 alpha 的灰阶图)
   *
   * **叠加 vs 复合**:多张 mask-image 用 `mask-composite` 控制相互关系(add / subtract / intersect / exclude)。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<image>` | `'url(./m.png)'` `'linear-gradient(black, transparent)'` | 单图 |
   * | 多张 | `'url(a.svg), url(b.svg)'` | 逗号分隔,按 composite 复合 |
   * | `none` | — | 清除蒙版 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari  | Edge  | IE  |
   * | :-----: | :-----: | :------: | :---: | :-: |
   * | **120** | **53**  | **15.4** | 16-79 | No  |
   * | 1 _-x-_ |         | 4 _-x-_  |       |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-image
   */
  maskImage: PropFn<CssValueOf<'maskImage'>>
  /**
   * 蒙版**读取通道**:从 alpha 还是亮度(luminance)取值。
   *
   * ## 关键字
   *
   * ### 3 个关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `match-source` | **默认值**。SVG `<mask>` 默认走 luminance,其它默认走 alpha |
   * | `alpha` | 强制读 alpha 通道(透明=隐藏 / 不透明=显示) |
   * | `luminance` | 强制读亮度(黑=隐藏 / 白=显示,常用于灰阶图) |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `maskMode`。⚠️ `maskMode` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `match-source` |
   * | `unset` | `maskMode` 非继承属性 → 等同 `initial`（= `match-source`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `maskMode` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `maskMode` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **关键陷阱**:把 PNG 当 alpha mask 时用 `match-source`(默认即可);把灰阶 JPEG 当 mask 时**必须** `luminance`,否则 JPEG 无 alpha 会全显示。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `match-source` / `alpha` / `luminance` | 见上 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `match-source`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
   * | :-----: | :-----: | :------: | :-----: | :-: |
   * | **120** | **53**  | **15.4** | **120** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-mode
   */
  maskMode: PropFn<CssValueOf<'maskMode'>>
  /**
   * 蒙版**定位区域起点**:从 border-box / padding-box / content-box 哪个边缘开始。
   *
   * ## 关键字
   *
   * ### 5 个关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `border-box` | **默认值**。从 border 外缘起算(包含 border 区域) |
   * | `padding-box` | 从 padding 外缘起算(不含 border) |
   * | `content-box` | 从内容区起算(不含 padding 和 border) |
   * | `fill-box` | SVG 专用:`<` 元素的几何盒 |
   * | `stroke-box` | SVG 专用:含 stroke 的盒 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `maskOrigin`。⚠️ `maskOrigin` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `border-box` |
   * | `unset` | `maskOrigin` 非继承属性 → 等同 `initial`（= `border-box`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `maskOrigin` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `maskOrigin` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `border-box` / `padding-box` / `content-box` / `fill-box` / `stroke-box` | 见上 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `border-box`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari  |   Edge   | IE  |
   * | :-----: | :-----: | :------: | :------: | :-: |
   * | **120** | **53**  | **15.4** | **120**  | No  |
   * | 1 _-x-_ |         | 4 _-x-_  | 79 _-x-_ |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-origin
   */
  maskOrigin: PropFn<CssValueOf<'maskOrigin'>>
  /**
   * 蒙版图像**起点位置**(与 `background-position` 等价语义)。
   *
   * ## 关键字
   *
   * ### 关键字形式
   *
   * | 关键字 | 等价 % |
   * | --- | --- |
   * | `left` | `0%` |
   * | `center` | `50%` |
   * | `right` | `100%` |
   * | `top` | `0%` |
   * | `bottom` | `100%` |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `maskPosition`。⚠️ `maskPosition` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0% 0%` |
   * | `unset` | `maskPosition` 非继承属性 → 等同 `initial`（= `0% 0%`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `maskPosition` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `maskPosition` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **两值语法**: `<x> <y>`(水平 然后 垂直)。
   *
   * ```ts
   * s.maskPosition('center')                  // = 'center center' = '50% 50%'
   * s.maskPosition('left top')                // 左上
   * s.maskPosition('20% 80%')                 // 百分比
   * s.maskPosition('10px 20px')               // 像素
   * s.maskPosition('right 16px bottom 8px')   // 4 值:从右 16px / 从底 8px
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `'center'` `'left top'` | 5 个位置关键字组合 |
   * | `<percentage>` | `'50%'` `'20% 80%'` | 相对蒙版定位区域 |
   * | `<length>` | `'10px 20px'` | 从原点偏移 |
   * | 4 值 | `'right 16px bottom 8px'` | 从右/底偏移(CSS 4) |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0% 0%`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari   | Edge  | IE  |
   * | :-----: | :-----: | :-------: | :---: | :-: |
   * | **120** | **53**  | **15.4**  | 18-79 | No  |
   * | 1 _-x-_ |         | 3.1 _-x-_ |       |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-position
   */
  maskPosition: PropFn<CssValueOf<'maskPosition'>>
  /**
   * 蒙版图像**平铺方式**(与 `background-repeat` 等价语义)。
   *
   * ## 关键字
   *
   * ### 6 个关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `repeat` | **默认值**。双向平铺 |
   * | `repeat-x` | 仅水平平铺 |
   * | `repeat-y` | 仅垂直平铺 |
   * | `no-repeat` | 不平铺,单次贴 |
   * | `space` | 平铺但用间距填满(无裁剪) |
   * | `round` | 平铺,允许缩放到刚好整数次填满 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `maskRepeat`。⚠️ `maskRepeat` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `repeat` |
   * | `unset` | `maskRepeat` 非继承属性 → 等同 `initial`（= `repeat`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `maskRepeat` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `maskRepeat` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `repeat` / `no-repeat` / `space` / `round` / `repeat-x` / `repeat-y` | 见上 |
   * | 多轴 | `'repeat space'` | 第 1 值水平 / 第 2 值垂直 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `repeat`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari   | Edge  | IE  |
   * | :-----: | :-----: | :-------: | :---: | :-: |
   * | **120** | **53**  | **15.4**  | 18-79 | No  |
   * | 1 _-x-_ |         | 3.1 _-x-_ |       |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-repeat
   */
  maskRepeat: PropFn<CssValueOf<'maskRepeat'>>
  /**
   * 蒙版图像**缩放尺寸**(与 `background-size` 等价语义)。
   *
   * ## 关键字
   *
   * ### 3 个关键字 + 长度/百分比
   *
   * | 关键字 / 形式 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。保持图像原尺寸 / SVG 内禀比例 |
   * | `cover` | 等比缩放**完全覆盖**定位区域(可能裁剪) |
   * | `contain` | 等比缩放**完全装入**定位区域(可能留白) |
   * | `<length>` | `10px` `2em` 等明确尺寸 |
   * | `<percentage>` | `50%` 相对定位区域 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `maskSize`。⚠️ `maskSize` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `maskSize` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `maskSize` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `maskSize` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `auto` / `cover` / `contain` | 见上 |
   * | 1 值 | `'200px'` | 宽度,高度 auto |
   * | 2 值 | `'200px 100px'` | 宽 高 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari  | Edge  | IE  |
   * | :-----: | :-----: | :------: | :---: | :-: |
   * | **120** | **53**  | **15.4** | 18-79 | No  |
   * | 4 _-x-_ |         | 4 _-x-_  |       |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-size
   */
  maskSize: PropFn<CssValueOf<'maskSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `luminance | alpha`
     *
     * **Initial value**: `luminance`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **24** | **35**  | **7**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-type
     */
  maskType: PropFn<CssValueOf<'maskType'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `[ pack | next ] || [ definite-first | ordered ]`
     *
     * **Initial value**: `pack`
     */
  masonryAutoFlow: PropFn<CssValueOf<'masonryAutoFlow'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto-add | add(<integer>) | <integer>`
     *
     * **Initial value**: `0`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **109** | **117** |   No   | **109** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/math-depth
     */
  mathDepth: PropFn<CssValueOf<'mathDepth'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | compact`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **109** |   No    |   No   | **109** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/math-shift
     */
  mathShift: PropFn<CssValueOf<'mathShift'>>
  /**
     * Since August 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `normal | compact`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **109** | **117** | **14.1** | **109** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/math-style
     */
  mathStyle: PropFn<CssValueOf<'mathStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'max-width'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/max-block-size
     */
  maxBlockSize: PropFn<CssValueOf<'maxBlockSize'>>
  /**
   * 设置元素的**最大高度**上限。内容超出时通常配合 `overflow: auto/hidden` 截断或滚动。
   *
   * ## 关键字
   *
   * ### 5 个尺寸关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `none` | **默认值**。无高度上限 | 默认；不设上限 |
   * | `auto` | 跟随内容高度 | 一般同 none |
   * | `minContent` | 上限收窄至最小内容高 | 罕用 |
   * | `maxContent` | 上限 = 理想内容高 | 按内容设上限 |
   * | `fitContent` | 内容驱动但不超父容器高 | 弹性上限 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `maxHeight`。⚠️ `maxHeight` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `maxHeight` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `maxHeight` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `maxHeight` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 经典用法：下拉列表高度限制
   *
   * ```ts
   * s.maxHeight.px(300)
   * s.overflowY.auto
   * // 最多 300px 高，超出时内部滚动
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.maxHeight.px(200)         ≡ s.maxHeight('200px')
   * s.maxHeight.rem(1.5)        ≡ s.maxHeight('1.5rem')
   * s.maxHeight.em(2)           ≡ s.maxHeight('2em')      // 当前元素 font-size 的倍数
   * s.maxHeight.vw(50)          ≡ s.maxHeight('50vw')     // 视口宽 1%
   * s.maxHeight.dvw(50)         ≡ s.maxHeight('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.maxHeight.cqw(50)         ≡ s.maxHeight('50cqw')    // container query 容器尺寸
   * s.maxHeight.percent(50)     ≡ s.maxHeight('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.maxHeight('calc(100% - 32px)')
   * s.maxHeight('min(100%, 1200px)')
   * s.maxHeight('max(280px, 50%)')
   * s.maxHeight('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `none` | — | **默认值**；无高度上限 |
   * | `minContent` | — | 上限 = 最小内容高 |
   * | `maxContent` | — | 上限 = 理想内容高 |
   * | `fitContent` | — | 内容驱动但不超父容器高 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |  IE   |
   * | :----: | :-----: | :-----: | :----: | :---: |
   * | **1**  |  **1**  | **1.3** | **12** | **7** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/max-height
   */
  maxHeight: PropCarrier<CssValueOf<'maxHeight'>, SizeTokens<T>, 'auto' | 'minContent' | 'maxContent' | 'fitContent' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'max-width'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |   Safari   |  Edge  | IE  |
     * | :----: | :-----: | :--------: | :----: | :-: |
     * | **57** | **41**  |  **12.1**  | **79** | No  |
     * |        |         | 10.1 _-x-_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/max-inline-size
     */
  maxInlineSize: PropFn<CssValueOf<'maxInlineSize'>>
  /**
     * **Syntax**: `none | <integer>`
     *
     * **Initial value**: `none`
     */
  maxLines: PropFn<CssValueOf<'maxLines'>>
  /**
   * 设置元素的**最大宽度**上限。元素宽度不会超过此值，常用于响应式布局限制内容区最宽。
   *
   * ## 关键字
   *
   * ### 5 个尺寸关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `none` | **默认值**。无宽度上限，元素可以任意宽 | 默认；不设上限 |
   * | `auto` | 浏览器自动（继承 width 行为） | 一般同 none，很少单独使用 |
   * | `minContent` | 上限收窄至最小内容宽 | 罕用于 maxWidth |
   * | `maxContent` | 上限 = 理想内容宽（不换行） | 按内容设上限 |
   * | `fitContent` | 内容驱动但不超父容器 | 弹性上限 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `maxWidth`。⚠️ `maxWidth` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `maxWidth` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `maxWidth` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `maxWidth` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 经典用法：内容区宽度限制
   *
   * ```ts
   * s.width('100%')
   * s.maxWidth.px(1200)
   * s.marginInline.auto
   * // 等宽占满但不超 1200px，左右 auto 水平居中
   * ```
   *
   * ### none = 无限制
   *
   * `max-width` 初始值为 `none`（不设上限）。写 `maxWidth.none` 可取消之前设过的 max-width。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.maxWidth.px(200)         ≡ s.maxWidth('200px')
   * s.maxWidth.rem(1.5)        ≡ s.maxWidth('1.5rem')
   * s.maxWidth.em(2)           ≡ s.maxWidth('2em')      // 当前元素 font-size 的倍数
   * s.maxWidth.vw(50)          ≡ s.maxWidth('50vw')     // 视口宽 1%
   * s.maxWidth.dvw(50)         ≡ s.maxWidth('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.maxWidth.cqw(50)         ≡ s.maxWidth('50cqw')    // container query 容器尺寸
   * s.maxWidth.percent(50)     ≡ s.maxWidth('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.maxWidth('calc(100% - 32px)')
   * s.maxWidth('min(100%, 1200px)')
   * s.maxWidth('max(280px, 50%)')
   * s.maxWidth('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `none` | — | **默认值**；无宽度上限 |
   * | `minContent` | — | 上限 = 最小内容宽 |
   * | `maxContent` | — | 上限 = 理想内容宽 |
   * | `fitContent` | — | 上限 = 内容宽但不超父容器 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **7** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/max-width
   */
  maxWidth: PropCarrier<CssValueOf<'maxWidth'>, SizeTokens<T>, 'auto' | 'minContent' | 'maxContent' | 'fitContent' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'min-width'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/min-block-size
     */
  minBlockSize: PropFn<CssValueOf<'minBlockSize'>>
  /**
   * 设置元素的**最小高度**下限。内容较少时不会缩到比此高度更小，常用于保证卡片/区块最低高度。
   *
   * ## 关键字
   *
   * ### 4 个尺寸关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `auto` | **默认值**。浏览器自动计算：块级元素（`display: block`）撑满父容器 content-box 宽度；行内元素 / flex 项目 / grid 单元格 = 内容宽度 | 通常不需要显式写，块级布局默认行为 |
   * | `minContent` | 元素尽可能收窄，直到再窄一个像素就会使内容溢出为止。等于"最长不可断单词/图片"的宽度 | 让宽度跟随最小内容，避免拉伸过宽；表格列紧凑排列 |
   * | `maxContent` | 元素扩展到"理想宽度"——如果空间无限大它会有多宽。等于最长文本行不换行时的宽度 | 让元素像 Tag / Badge 一样宽度跟随文字，但不被容器压缩 |
   * | `fitContent` | `min(max-content, max(min-content, 可用宽度))`：尽量撑到 max-content，但不超过父容器；比父容器窄时收到 max-content | 响应式 Tooltip / 弹窗宽度自适应内容但不溢出 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `minHeight`。⚠️ `minHeight` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `minHeight` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `minHeight` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `minHeight` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 常见用途
   *
   * ```ts
   * s.minHeight('100dvh')   // 内容少时也占满动态视口高度（移动端适配）
   * s.minHeight.px(48)      // 保证按钮/输入框最低高度 48px（可访问性最小点击区域）
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.minHeight.px(200)         ≡ s.minHeight('200px')
   * s.minHeight.rem(1.5)        ≡ s.minHeight('1.5rem')
   * s.minHeight.em(2)           ≡ s.minHeight('2em')      // 当前元素 font-size 的倍数
   * s.minHeight.vw(50)          ≡ s.minHeight('50vw')     // 视口宽 1%
   * s.minHeight.dvw(50)         ≡ s.minHeight('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.minHeight.cqw(50)         ≡ s.minHeight('50cqw')    // container query 容器尺寸
   * s.minHeight.percent(50)     ≡ s.minHeight('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.minHeight('calc(100% - 32px)')
   * s.minHeight('min(100%, 1200px)')
   * s.minHeight('max(280px, 50%)')
   * s.minHeight('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | — | **默认值**；块级元素撑满父宽，行内 / flex 项 = 内容宽 |
   * | `minContent` | — | 收窄至最小内容宽（最长不可断处） |
   * | `maxContent` | — | 扩展至理想宽度（不换行全行宽） |
   * | `fitContent` | — | 内容宽但不超父容器 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |  IE   |
   * | :----: | :-----: | :-----: | :----: | :---: |
   * | **1**  |  **3**  | **1.3** | **12** | **7** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/min-height
   */
  minHeight: PropCarrier<CssValueOf<'minHeight'>, SizeTokens<T>, 'auto' | 'minContent' | 'maxContent' | 'fitContent' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'min-width'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/min-inline-size
     */
  minInlineSize: PropFn<CssValueOf<'minInlineSize'>>
  /**
   * 设置元素的**最小宽度**下限。元素宽度不会缩小到此值以下（即使父容器更窄），可防止内容被压碎。
   *
   * ## 关键字
   *
   * ### 4 个尺寸关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `auto` | **默认值**。浏览器自动计算：块级元素（`display: block`）撑满父容器 content-box 宽度；行内元素 / flex 项目 / grid 单元格 = 内容宽度 | 通常不需要显式写，块级布局默认行为 |
   * | `minContent` | 元素尽可能收窄，直到再窄一个像素就会使内容溢出为止。等于"最长不可断单词/图片"的宽度 | 让宽度跟随最小内容，避免拉伸过宽；表格列紧凑排列 |
   * | `maxContent` | 元素扩展到"理想宽度"——如果空间无限大它会有多宽。等于最长文本行不换行时的宽度 | 让元素像 Tag / Badge 一样宽度跟随文字，但不被容器压缩 |
   * | `fitContent` | `min(max-content, max(min-content, 可用宽度))`：尽量撑到 max-content，但不超过父容器；比父容器窄时收到 max-content | 响应式 Tooltip / 弹窗宽度自适应内容但不溢出 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `minWidth`。⚠️ `minWidth` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `minWidth` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `minWidth` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `minWidth` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 与 width / max-width 优先级
   *
   * `min-width` 优先级**最高**：即使写了 `width: 0` 也不会低于 `min-width`。
   * 当 `min-width` > `max-width` 时，`min-width` 赢。
   *
   * ### Flex / Grid 布局注意
   *
   * flex 项目默认 `min-width: auto`（跟随内容最小宽），导致内容超出 flex 容器。
   * 修复：给 flex 子项加 `min-width: 0` 允许缩小。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.minWidth.px(200)         ≡ s.minWidth('200px')
   * s.minWidth.rem(1.5)        ≡ s.minWidth('1.5rem')
   * s.minWidth.em(2)           ≡ s.minWidth('2em')      // 当前元素 font-size 的倍数
   * s.minWidth.vw(50)          ≡ s.minWidth('50vw')     // 视口宽 1%
   * s.minWidth.dvw(50)         ≡ s.minWidth('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.minWidth.cqw(50)         ≡ s.minWidth('50cqw')    // container query 容器尺寸
   * s.minWidth.percent(50)     ≡ s.minWidth('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.minWidth('calc(100% - 32px)')
   * s.minWidth('min(100%, 1200px)')
   * s.minWidth('max(280px, 50%)')
   * s.minWidth('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | — | **默认值**；块级元素撑满父宽，行内 / flex 项 = 内容宽 |
   * | `minContent` | — | 收窄至最小内容宽（最长不可断处） |
   * | `maxContent` | — | 扩展至理想宽度（不换行全行宽） |
   * | `fitContent` | — | 内容宽但不超父容器 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **7** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/min-width
   */
  minWidth: PropCarrier<CssValueOf<'minWidth'>, SizeTokens<T>, 'auto' | 'minContent' | 'maxContent' | 'fitContent' | GlobalKw, LengthUnits, never>
  /**
   * 决定元素**与下层内容**的**混合模式**（不仅是背景之间，还可与父级 / 兄弟元素混合）。
   *
   * ## 关键字
   *
   * ### 18 种混合模式（同 backgroundBlendMode）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。无混合 |
   * | `multiply` | 正片叠底（整体变暗） |
   * | `screen` | 滤色（整体变亮） |
   * | `overlay` | 叠加（multiply + screen 组合） |
   * | `darken` | 取较深 |
   * | `lighten` | 取较浅 |
   * | `colorDodge` | 颜色减淡 |
   * | `colorBurn` | 颜色加深 |
   * | `hardLight` | 强光 |
   * | `softLight` | 柔光 |
   * | `difference` | 差值 |
   * | `exclusion` | 排除 |
   * | `hue` | 色相 |
   * | `saturation` | 饱和度 |
   * | `color` | 色彩 |
   * | `luminosity` | 亮度 |
   * | `plusDarker` | 加性变暗（实验性） |
   * | `plusLighter` | 加性变亮（实验性） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `mixBlendMode`。⚠️ `mixBlendMode` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `mixBlendMode` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `mixBlendMode` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `mixBlendMode` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 黑色文字在彩色背景上 → 反相文字效果
   * s.color.white
   * s.mixBlendMode.difference
   *
   * // 让 SVG icon 与背景融合
   * s.mixBlendMode.multiply
   * ```
   *
   * ### 副作用：创建层叠上下文
   *
   * mixBlendMode 非 `normal` 时，元素自动创建新的**层叠上下文** —— 类似 `opacity < 1` 或 `transform`。
   *
   * ### 配合 isolation
   *
   * 如果**希望混合范围局限在某个父容器内**（而不是混合到整页背景），父容器加 `isolation: isolate`：
   *
   * ```ts
   * // 父容器
   * s.isolation.isolate          // 创建层叠上下文边界
   *
   * // 子元素 mixBlendMode 仅在父内生效，不影响外部
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 18 种混合 keyword | `normal` `multiply` `screen` `overlay` `darken` `lighten` `colorDodge` `colorBurn` `hardLight` `softLight` `difference` `exclusion` `hue` `saturation` `color` `luminosity` `plusDarker` `plusLighter` | 见上方关键字表 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **41** | **32**  | **8**  | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mix-blend-mode
   */
  mixBlendMode: PropCarrier<CssValueOf<'mixBlendMode'>, never, 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'colorDodge' | 'colorBurn' | 'hardLight' | 'softLight' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | 'plusDarker' | 'plusLighter' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `<length-percentage>`
     *
     * **Initial value**: `0`
     *
     * |         Chrome         | Firefox | Safari |  Edge  | IE  |
     * | :--------------------: | :-----: | :----: | :----: | :-: |
     * |         **55**         | **72**  | **16** | **79** | No  |
     * | 46 _(motion-distance)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-distance
     */
  motionDistance: PropFn<CssValueOf<'motionDistance'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | <offset-path> || <coord-box>`
     *
     * **Initial value**: `none`
     *
     * |       Chrome       | Firefox |  Safari  |  Edge  | IE  |
     * | :----------------: | :-----: | :------: | :----: | :-: |
     * |       **55**       | **72**  | **15.4** | **79** | No  |
     * | 46 _(motion-path)_ |         |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-path
     */
  motionPath: PropFn<CssValueOf<'motionPath'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `[ auto | reverse ] || <angle>`
     *
     * **Initial value**: `auto`
     *
     * |         Chrome         | Firefox | Safari |  Edge  | IE  |
     * | :--------------------: | :-----: | :----: | :----: | :-: |
     * |         **56**         | **72**  | **16** | **79** | No  |
     * | 46 _(motion-rotation)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-rotate
     */
  motionRotation: PropFn<CssValueOf<'motionRotation'>>
  /**
   * 决定**替换元素**（`<img>` / `<video>`）的内容如何**适应容器**（拉伸 / 包含 / 覆盖等）。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `fill` | **默认值**。**拉伸填满**容器（会变形） |
   * | `contain` | **等比缩放完整显示**（不裁剪，可能留空白）—— 整图展示首选 |
   * | `cover` | **等比缩放铺满**（可能裁剪溢出部分）—— 头像 / 封面首选 |
   * | `none` | **不缩放**（原始尺寸，可能溢出或留空） |
   * | `scaleDown` | `contain` 和 `none` 中较小的（不放大，仅缩小） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `objectFit`。⚠️ `objectFit` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `fill` |
   * | `unset` | `objectFit` 非继承属性 → 等同 `initial`（= `fill`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `objectFit` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `objectFit` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 头像（裁剪铺满）
   * s.width.px(80)
   * s.height.px(80)
   * s.objectFit.cover
   *
   * // 商品图（完整显示）
   * s.objectFit.contain
   * s.backgroundColor._neutral100      // 留白处用浅灰
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个 keyword | `fill` ｜ `contain` ｜ `cover` ｜ `none` ｜ `scaleDown` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `fill`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **32** | **36**  | **10** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/object-fit
   */
  objectFit: PropCarrier<CssValueOf<'objectFit'>, never, 'fill' | 'contain' | 'cover' | 'none' | 'scaleDown' | GlobalKw, unknown, never>
  /**
   * 决定**替换元素**（`<img>` / `<video>`）内容**在容器中的位置**（配合 `objectFit: cover/contain` 使用）。
   *
   * ## 关键字
   *
   * ### 5 个位置关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `top` | 顶部对齐 |
   * | `bottom` | 底部对齐 |
   * | `left` | 左侧对齐 |
   * | `right` | 右侧对齐 |
   * | `center` | **默认值**。居中 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `objectPosition`。⚠️ `objectPosition` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `50% 50%` |
   * | `unset` | `objectPosition` 非继承属性 → 等同 `initial`（= `50% 50%`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `objectPosition` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `objectPosition` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // cover 模式下，让头像聚焦在人脸（顶部）
   * s.objectFit.cover
   * s.objectPosition.top
   *
   * // 精确控制
   * s.objectPosition('25% 75%')           // 横向 25%，纵向 75%
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.objectPosition.px(200)         ≡ s.objectPosition('200px')
   * s.objectPosition.rem(1.5)        ≡ s.objectPosition('1.5rem')
   * s.objectPosition.em(2)           ≡ s.objectPosition('2em')      // 当前元素 font-size 的倍数
   * s.objectPosition.vw(50)          ≡ s.objectPosition('50vw')     // 视口宽 1%
   * s.objectPosition.dvw(50)         ≡ s.objectPosition('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.objectPosition.cqw(50)         ≡ s.objectPosition('50cqw')    // container query 容器尺寸
   * s.objectPosition.percent(50)     ≡ s.objectPosition('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.objectPosition('calc(100% - 32px)')
   * s.objectPosition('min(100%, 1200px)')
   * s.objectPosition('max(280px, 50%)')
   * s.objectPosition('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `top` `bottom` `left` `right` `center` | 5 个位置 |
   * | `<length>` / `<percentage>` | `'25% 75%'` `'10px 20px'` | X / Y |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `50% 50%`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **32** | **36**  | **10** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/object-position
   */
  objectPosition: PropCarrier<CssValueOf<'objectPosition'>, never, 'top' | 'bottom' | 'left' | 'right' | 'center' | GlobalKw, LengthUnits, never>
  /**
     * **Syntax**: `none | <basic-shape-rect>`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **104** |   No    |   No   | **104** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/object-view-box
     */
  objectViewBox: PropFn<CssValueOf<'objectViewBox'>>
  /**
     * Since August 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto | <position>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **116** | **72**  | **16** | **116** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-anchor
     */
  offsetAnchor: PropFn<CssValueOf<'offsetAnchor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `<length-percentage>`
     *
     * **Initial value**: `0`
     *
     * |         Chrome         | Firefox | Safari |  Edge  | IE  |
     * | :--------------------: | :-----: | :----: | :----: | :-: |
     * |         **55**         | **72**  | **16** | **79** | No  |
     * | 46 _(motion-distance)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-distance
     */
  offsetDistance: PropFn<CssValueOf<'offsetDistance'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | <offset-path> || <coord-box>`
     *
     * **Initial value**: `none`
     *
     * |       Chrome       | Firefox |  Safari  |  Edge  | IE  |
     * | :----------------: | :-----: | :------: | :----: | :-: |
     * |       **55**       | **72**  | **15.4** | **79** | No  |
     * | 46 _(motion-path)_ |         |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-path
     */
  offsetPath: PropFn<CssValueOf<'offsetPath'>>
  /**
     * Since January 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `normal | auto | <position>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **116** | **122** | **16** | **116** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-position
     */
  offsetPosition: PropFn<CssValueOf<'offsetPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `[ auto | reverse ] || <angle>`
     *
     * **Initial value**: `auto`
     *
     * |         Chrome         | Firefox | Safari |  Edge  | IE  |
     * | :--------------------: | :-----: | :----: | :----: | :-: |
     * |         **56**         | **72**  | **16** | **79** | No  |
     * | 46 _(motion-rotation)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-rotate
     */
  offsetRotate: PropFn<CssValueOf<'offsetRotate'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `[ auto | reverse ] || <angle>`
     *
     * **Initial value**: `auto`
     *
     * |         Chrome         | Firefox | Safari |  Edge  | IE  |
     * | :--------------------: | :-----: | :----: | :----: | :-: |
     * |         **56**         | **72**  | **16** | **79** | No  |
     * | 46 _(motion-rotation)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-rotate
     */
  offsetRotation: PropFn<CssValueOf<'offsetRotation'>>
  /**
   * 设置元素的**整体透明度**（0 完全透明 → 1 完全不透明）。影响整个元素**包括子元素**。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受 0-1 数字（或 0%-100% 百分比），**无关键字**（除全局关键字）` —— undefined
   * - `默认值 = `1`（完全不透明）` —— undefined
   * - `影响子元素 —— 与 `rgba/hsla` 的 alpha 不同（后者只影响该属性的颜色）` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `opacity`。⚠️ `opacity` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `1` |
   * | `unset` | `opacity` 非继承属性 → 等同 `initial`（= `1`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `opacity` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `opacity` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### opacity vs alpha
   *
   * | 写法 | 影响范围 |
   * | --- | --- |
   * | `opacity: 0.5` | **整个元素 + 子元素**都半透明 |
   * | `background-color: rgba(0,0,0,0.5)` | **只**该属性的颜色半透明 |
   * | `color: rgba(0,0,0,0.5)` | **只**文字颜色半透明 |
   *
   * 子元素需要不同透明度时，**避免用 opacity** —— 给具体属性 alpha 更精细。
   *
   * ### 副作用：创建层叠上下文
   *
   * `opacity < 1` 会创建新的层叠上下文，这是 fixed 子元素相对祖先错乱的常见原因。
   *
   * ### token 写法
   *
   * ```ts
   * s.opacity._disabled       // 例如 0.5
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<number>` | `0` `0.5` `1` | 0-1 范围（可超出但被截断） |
   * | `<percentage>` | `50%` `100%` | 相当于 0-1 数字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `1`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **2**  | **12** | **9** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/opacity
   */
  opacity: PropCarrier<CssValueOf<'opacity'>, OpacityTokens<T>, GlobalKw, unknown, never>
  /**
   * flex / grid 子元素的**显示顺序** —— 不改变 DOM 顺序但改变视觉顺序。可为**负数**。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `接受整数（可负，**默认 0**）。无关键字（除全局关键字）` —— undefined
   * - `数字越小越靠前；相同 order 按 DOM 顺序` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `order`。⚠️ `order` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `order` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `order` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `order` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // DOM 顺序：[A] [B] [C]
   * // 改成视觉顺序：[B] [A] [C]
   * // 给 B 设 order(-1)
   * s.order(-1)
   *
   * // 给 C 设 order(99) 排到最后
   * s.order(99)
   * ```
   *
   * ### a11y 注意
   *
   * `order` 不改变屏幕阅读器和键盘 Tab 顺序（仍按 DOM 顺序），可能造成视觉与朗读顺序不一致 —— **影响视觉顺序请改 DOM**，order 仅用于响应式微调。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<integer>` | `0` `1` `-1` `99` | 可正可负的整数 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox | Safari  |  Edge  |    IE    |
   * | :------: | :-----: | :-----: | :----: | :------: |
   * |  **29**  | **20**  |  **9**  | **12** |  **11**  |
   * | 21 _-x-_ |         | 7 _-x-_ |        | 10 _-x-_ |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/order
   */
  order: PropCarrier<CssValueOf<'order'>, never, GlobalKw, unknown, never>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `2`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **25** |   No    | **1.3** | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/orphans
     */
  orphans: PropFn<CssValueOf<'orphans'>>
  /**
   * 设置元素的**外轮廓 outline 颜色**。outline 不占空间、可跨圆角包绕，常用于焦点态高亮。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白 |
   * | `black` | `#000000` | 纯黑 |
   * | `transparent` | `rgba(0,0,0,0)` | 透明轮廓（保留焦点行为但不可见，**慎用，影响可访问性**） |
   * | `currentColor` | **默认值**，跟随 `color` | 轮廓色跟随文字色变（最常用） |
   *
   * ### 此属性特有
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `invert` | 反色：将下方像素颜色取反作为 outline 颜色（深色变浅、浅色变深，保证可见）。**浏览器实现不一致**，常退化为 `currentColor` |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `outlineColor`。⚠️ `outlineColor` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `currentColor` |
   * | `unset` | `outlineColor` 非继承属性 → 等同 `initial`（= `currentColor`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `outlineColor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `outlineColor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **outline 与 border 的区别**：
   * - outline **不占空间**（不撑大盒子），border 占
   * - outline 可在 `borderRadius` 圆角**外**包绕，CSS 3 起跟随圆角
   * - outline 默认不能分边设置（CSS 4 起部分浏览器支持 `outline-top-color` 等）
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.outlineColor._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.outlineColor._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.outlineColor._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.outlineColor._primary.alpha(0.6)         // token + 修饰链
   * s.outlineColor._primary.darken(0.1)
   * s.outlineColor._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.outlineColor._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.outlineColor.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 常见用途
   *
   * - `:focus-visible` 高亮：键盘聚焦时显示蓝色 outline（用 `outline` 而非 `border` 不抖动布局）
   * - 调试：临时 `outline: 1px solid red` 给元素加可见框不影响布局
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | `invert` | — | 反色（罕用，浏览器实现不一致） |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `currentColor`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |  IE   |
   * | :----: | :-----: | :-----: | :----: | :---: |
   * | **1**  | **1.5** | **1.2** | **12** | **8** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/outline-color
   */
  outlineColor: ColorPropCarrier<CssValueOf<'outlineColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
   * 控制 **outline 与元素边缘的距离**。可为**负值**（outline 缩入元素内部），常用于焦点环呼吸感。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受 `<length>`，可正可负，无关键字（除全局关键字）` —— undefined
   * - `正值 = outline 向外推；负值 = outline 向内缩` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `outlineOffset`。⚠️ `outlineOffset` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `outlineOffset` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `outlineOffset` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `outlineOffset` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.outlineWidth.px(2)
   * s.outlineStyle.solid
   * s.outlineColor._primary
   * s.outlineOffset.px(4)             // 焦点环离元素 4px 远
   *
   * s.outlineOffset.px(-2)             // outline 缩入元素 2px，防止被父级 overflow:hidden 裁切
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.outlineOffset.px(200)         ≡ s.outlineOffset('200px')
   * s.outlineOffset.rem(1.5)        ≡ s.outlineOffset('1.5rem')
   * s.outlineOffset.em(2)           ≡ s.outlineOffset('2em')      // 当前元素 font-size 的倍数
   * s.outlineOffset.vw(50)          ≡ s.outlineOffset('50vw')     // 视口宽 1%
   * s.outlineOffset.dvw(50)         ≡ s.outlineOffset('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.outlineOffset.cqw(50)         ≡ s.outlineOffset('50cqw')    // container query 容器尺寸
   * s.outlineOffset.percent(50)     ≡ s.outlineOffset('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.outlineOffset('calc(100% - 32px)')
   * s.outlineOffset('min(100%, 1200px)')
   * s.outlineOffset('max(280px, 50%)')
   * s.outlineOffset('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'4px'` `'-2px'` `'0.5rem'` | 可正可负 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  | IE  |
   * | :----: | :-----: | :-----: | :----: | :-: |
   * | **1**  | **1.5** | **1.2** | **15** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/outline-offset
   */
  outlineOffset: PropCarrier<CssValueOf<'outlineOffset'>, never, GlobalKw, LengthUnits, never>
  /**
   * 设置 outline 的样式。同 `borderStyle`，常用 `solid`。outline 还接受 `auto`（平台原生焦点环）。
   *
   * ## 关键字
   *
   * ### 10 个样式关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。完全无边框，不占任何空间 |
   * | `hidden` | 视觉效果同 `none`（无边框），但在**表格冲突边框解析**中优先级高于 `none` |
   * | `dotted` | **点状**虚线边框（圆点） |
   * | `dashed` | **虚线**边框（短横线） |
   * | `solid` | **实线**边框（最常用） |
   * | `double` | **双线**边框（两条平行实线 + 中间空隙；总宽 ≥ 3px 才能看出效果） |
   * | `groove` | **凹槽**：模拟凹下去的边框（3D 效果，浏览器渲染差异大） |
   * | `ridge` | **凸脊**：模拟凸起的边框（3D 效果，与 `groove` 视觉相反） |
   * | `inset` | **凹陷**：让元素看起来嵌入页面（上左暗，下右亮） |
   * | `outset` | **凸起**：让元素看起来浮出页面（上左亮，下右暗） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `outlineStyle`。⚠️ `outlineStyle` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `outlineStyle` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `outlineStyle` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `outlineStyle` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 重要：边框三件套
   *
   * CSS 边框需要 **width + style + color** 三件齐全才显示：
   *
   * - `borderWidth` 默认 `medium`（≈3px）✓
   * - `borderStyle` 默认 `none` ✗ **必须显式设**
   * - `borderColor` 默认 `currentColor`（跟随文字色）✓
   *
   * ### hidden vs none 在表格中
   *
   * `borderCollapse: collapse` 时，相邻单元格边框冲突解析：
   * - `hidden` 优先级**最高**，强制不显示
   * - `none` 优先级**最低**，让对方边框显示
   *
   * ### 简写：1/2/3/4 值
   *
   * ```ts
   * s.borderStyle.solid                            // 四边 solid
   * s.borderStyle('solid dashed')                  // 上下 solid，左右 dashed
   * s.borderStyle('solid dashed dotted none')      // 上 / 右 / 下 / 左
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 10 个 keyword | `none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset` | 同 borderStyle |
   * | `auto` | — | outline 特有：浏览器使用平台原生焦点轮廓（如 macOS 蓝光环） |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |  IE   |
   * | :----: | :-----: | :-----: | :----: | :---: |
   * | **1**  | **1.5** | **1.2** | **12** | **8** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/outline-style
   */
  outlineStyle: PropCarrier<CssValueOf<'outlineStyle'>, never, 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | GlobalKw, unknown, never>
  /**
   * 设置 **outline 的宽度**。outline 不占空间，可跨圆角包绕。
   *
   * ## 关键字
   *
   * ### 3 个尺寸关键字（浏览器约定值）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `thin` | 细边框（约 **1px**；具体由浏览器决定） |
   * | `medium` | 中等边框（**默认值**，约 **3px**） |
   * | `thick` | 粗边框（约 **5px**） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `outlineWidth`。⚠️ `outlineWidth` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `medium` |
   * | `unset` | `outlineWidth` 非继承属性 → 等同 `initial`（= `medium`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `outlineWidth` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `outlineWidth` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写：1/2/3/4 值
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `borderWidth.px(1)` | 四边均为 1px |
   * | `borderWidth('1px 2px')` | 上下 1px，左右 2px |
   * | `borderWidth('1px 2px 3px 4px')` | 上 / 右 / 下 / 左（顺时针） |
   *
   * ### 必须配合 borderStyle
   *
   * ```ts
   * // ❌ 不显示
   * s.borderWidth.px(2)
   * s.borderColor._primary
   * // ✅
   * s.borderWidth.px(2)
   * s.borderStyle.solid
   * s.borderColor._primary
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderWidth.px(200)         ≡ s.borderWidth('200px')
   * s.borderWidth.rem(1.5)        ≡ s.borderWidth('1.5rem')
   * s.borderWidth.em(2)           ≡ s.borderWidth('2em')      // 当前元素 font-size 的倍数
   * s.borderWidth.vw(50)          ≡ s.borderWidth('50vw')     // 视口宽 1%
   * s.borderWidth.dvw(50)         ≡ s.borderWidth('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderWidth.cqw(50)         ≡ s.borderWidth('50cqw')    // container query 容器尺寸
   * s.borderWidth.percent(50)     ≡ s.borderWidth('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderWidth('calc(100% - 32px)')
   * s.borderWidth('min(100%, 1200px)')
   * s.borderWidth('max(280px, 50%)')
   * s.borderWidth('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'1px'` `'2px'` | 具体长度 |
   * | 3 个 keyword | `thin` ｜ `medium` ｜ `thick` | 浏览器约定值 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `medium`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |  IE   |
   * | :----: | :-----: | :-----: | :----: | :---: |
   * | **1**  | **1.5** | **1.2** | **12** | **8** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/outline-width
   */
  outlineWidth: PropCarrier<CssValueOf<'outlineWidth'>, BordersTokens<T>, 'thin' | 'medium' | 'thick' | GlobalKw, LengthUnits, never>
  /**
   * 控制**滚动锚定**（scroll anchoring）—— 防止页面顶部加载新内容时**当前可视区跳动**。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。启用滚动锚定（浏览器自动记住当前可视位置，新内容插入上方时保持视图稳定） |
   * | `none` | 禁用（用于动画中的元素，避免锚定行为干扰） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `overflowAnchor`。⚠️ `overflowAnchor` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `overflowAnchor` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `overflowAnchor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `overflowAnchor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * 社交媒体 feed 加载新内容时，浏览器自动锚定让你不会被"推走"位置。
   *
   * ```ts
   * // 默认启用，无需写代码
   *
   * // 对动画元素禁用（避免锚定算法错误"锚住"动画中的元素）
   * s.overflowAnchor.none
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `auto` ｜ `none` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |   Safari    |  Edge  | IE  |
   * | :----: | :-----: | :---------: | :----: | :-: |
   * | **56** | **66**  | **preview** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-anchor
   */
  overflowAnchor: PropCarrier<CssValueOf<'overflowAnchor'>, never, 'auto' | 'none' | GlobalKw, unknown, never>
  /**
     * Since September 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `visible | hidden | clip | scroll | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **135** | **69**  | **26** | **135** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-block
     */
  overflowBlock: PropFn<CssValueOf<'overflowBlock'>>
  /**
     * **Syntax**: `padding-box | content-box`
     *
     * **Initial value**: `padding-box`
     */
  overflowClipBox: PropFn<CssValueOf<'overflowClipBox'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<visual-box> || <length [0,∞]>`
     *
     * **Initial value**: `0px`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **90** | **102** |   No   | **90** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-clip-margin
     */
  overflowClipMargin: PropFn<CssValueOf<'overflowClipMargin'>>
  /**
     * Since September 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `visible | hidden | clip | scroll | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **135** | **69**  | **26** | **135** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-inline
     */
  overflowInline: PropFn<CssValueOf<'overflowInline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2018.
     *
     * **Syntax**: `normal | break-word | anywhere`
     *
     * **Initial value**: `normal`
     *
     * |     Chrome      |      Firefox      |     Safari      |       Edge       |          IE           |
     * | :-------------: | :---------------: | :-------------: | :--------------: | :-------------------: |
     * |     **23**      |      **49**       |      **7**      |      **18**      | **5.5** _(word-wrap)_ |
     * | 1 _(word-wrap)_ | 3.5 _(word-wrap)_ | 1 _(word-wrap)_ | 12 _(word-wrap)_ |                       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-wrap
     */
  overflowWrap: PropFn<CssValueOf<'overflowWrap'>>
  /**
   * 控制元素**水平方向**内容溢出的处理。其他规则同 [`overflow`]，但只接受单值。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `visible` | **默认值**。溢出内容可见（超出容器边界），不裁剪 |
   * | `hidden` | **裁剪**溢出，**不显示滚动条**；用户无法手动滚动，但 JS `scrollTo` 仍可 |
   * | `scroll` | **强制**显示滚动条（即使没溢出也占滚动条空间） |
   * | `auto` | 内容**溢出时**才显示滚动条（最常用） |
   * | `clip` | 同 `hidden` 但**禁止程序滚动**（更严格）；不创建滚动容器（不会成为 `sticky` 的祖先滚动容器） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `overflowX`。⚠️ `overflowX` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `visible` |
   * | `unset` | `overflowX` 非继承属性 → 等同 `initial`（= `visible`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `overflowX` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `overflowX` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 两值简写
   *
   * `overflow` 可写 1 或 2 个值：第一个是 X，第二个是 Y。1 值时两轴相同。
   *
   * ```ts
   * s.overflow.hidden                   // 两轴都裁剪
   * s.overflow('auto hidden')           // X 滚动条按需，Y 裁剪
   * s.overflow.auto                     // 内容溢出时出滚动条
   * ```
   *
   * ### 创建 BFC 的副作用
   *
   * 任何非 `visible` 的 `overflow` 值都会**触发 BFC**（块格式化上下文），可用于：
   * - 包含浮动子元素（清浮动）
   * - 防止外边距合并
   *
   * ### 常见陷阱
   *
   * - `overflow: hidden` 在父级会**让 `position: sticky` 失效** —— sticky 找不到可粘的滚动祖先
   * - 父级 `overflow: hidden` **不会**裁剪 `position: absolute` 子元素，除非父级也 `position: relative`
   * - `overflow: scroll` 在 macOS 默认配置下滚动条不可见（hover 才出），但仍预留空间
   * - `overflow: clip` 不创建滚动容器 —— 适合纯视觉裁剪而不想破坏 sticky
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个 keyword | `visible` ｜ `hidden` ｜ `scroll` ｜ `auto` ｜ `clip` | 单轴只接受 1 个值 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `visible`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  | **3.5** | **3**  | **12** | **5** |
   *
   * `clip` 较晚：Chrome 90 / Firefox 81 / Safari 16。其他远古支持。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-x
   */
  overflowX: PropCarrier<CssValueOf<'overflowX'>, never, 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | GlobalKw, unknown, never>
  /**
   * 控制元素**垂直方向**内容溢出的处理。其他规则同 [`overflow`]，但只接受单值。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `visible` | **默认值**。溢出内容可见（超出容器边界），不裁剪 |
   * | `hidden` | **裁剪**溢出，**不显示滚动条**；用户无法手动滚动，但 JS `scrollTo` 仍可 |
   * | `scroll` | **强制**显示滚动条（即使没溢出也占滚动条空间） |
   * | `auto` | 内容**溢出时**才显示滚动条（最常用） |
   * | `clip` | 同 `hidden` 但**禁止程序滚动**（更严格）；不创建滚动容器（不会成为 `sticky` 的祖先滚动容器） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `overflowY`。⚠️ `overflowY` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `visible` |
   * | `unset` | `overflowY` 非继承属性 → 等同 `initial`（= `visible`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `overflowY` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `overflowY` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 两值简写
   *
   * `overflow` 可写 1 或 2 个值：第一个是 X，第二个是 Y。1 值时两轴相同。
   *
   * ```ts
   * s.overflow.hidden                   // 两轴都裁剪
   * s.overflow('auto hidden')           // X 滚动条按需，Y 裁剪
   * s.overflow.auto                     // 内容溢出时出滚动条
   * ```
   *
   * ### 创建 BFC 的副作用
   *
   * 任何非 `visible` 的 `overflow` 值都会**触发 BFC**（块格式化上下文），可用于：
   * - 包含浮动子元素（清浮动）
   * - 防止外边距合并
   *
   * ### 常见陷阱
   *
   * - `overflow: hidden` 在父级会**让 `position: sticky` 失效** —— sticky 找不到可粘的滚动祖先
   * - 父级 `overflow: hidden` **不会**裁剪 `position: absolute` 子元素，除非父级也 `position: relative`
   * - `overflow: scroll` 在 macOS 默认配置下滚动条不可见（hover 才出），但仍预留空间
   * - `overflow: clip` 不创建滚动容器 —— 适合纯视觉裁剪而不想破坏 sticky
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个 keyword | `visible` ｜ `hidden` ｜ `scroll` ｜ `auto` ｜ `clip` | 单轴只接受 1 个值 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `visible`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  | **3.5** | **3**  | **12** | **5** |
   *
   * `clip` 较晚：Chrome 90 / Firefox 81 / Safari 16。其他远古支持。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-y
   */
  overflowY: PropCarrier<CssValueOf<'overflowY'>, never, 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | GlobalKw, unknown, never>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | auto`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **117** |   No    |   No   | **117** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overlay
     */
  overlay: PropFn<CssValueOf<'overlay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `contain | none | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **77** | **73**  | **16** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overscroll-behavior-block
     */
  overscrollBehaviorBlock: PropFn<CssValueOf<'overscrollBehaviorBlock'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `contain | none | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **77** | **73**  | **16** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overscroll-behavior-inline
     */
  overscrollBehaviorInline: PropFn<CssValueOf<'overscrollBehaviorInline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `contain | none | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **63** | **59**  | **16** | **18** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overscroll-behavior-x
     */
  overscrollBehaviorX: PropFn<CssValueOf<'overscrollBehaviorX'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `contain | none | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **63** | **59**  | **16** | **18** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overscroll-behavior-y
     */
  overscrollBehaviorY: PropFn<CssValueOf<'overscrollBehaviorY'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-block-end
     */
  paddingBlockEnd: PropFn<CssValueOf<'paddingBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-block-start
     */
  paddingBlockStart: PropFn<CssValueOf<'paddingBlockStart'>>
  /**
   * 设置元素的**下内边距**。⚠️ 百分比参照**父容器宽度**（非高度）。其他规则同 [`padding`]。
   *
   * ## 关键字
   *
   * ### padding 关键字（仅含 auto，实际很少用）
   *
   * | 关键字 | 效果 | 说明 |
   * | --- | --- | --- |
   * | `auto` | 浏览器自动计算。⚠️ **`padding` 很少用 auto**，
   * 实际仅在某些布局情形（如 flex/grid 的 padding-inline）有意义 | 通常写具体长度值；`auto` 不像 margin 那样有居中效果 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `paddingBottom`。⚠️ `paddingBottom` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `paddingBottom` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `paddingBottom` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `paddingBottom` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值，与 margin 完全相同）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `padding('16px')` | 四边均为 16px |
   * | `padding('8px 16px')` | 上下 8px，左右 16px |
   * | `padding('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `padding('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### ⚠️ padding 不接受负值
   *
   * `padding` 不同于 `margin`，**不接受负值**。负 padding 无效，会被浏览器忽略。
   *
   * ### 背景延伸到 padding 区域
   *
   * 默认 `background-clip: border-box`，背景色/图会填充 padding 区域（直到边框）。
   * 改为 `background-clip: content-box` 可让背景只覆盖内容区。
   *
   * ### 百分比参照
   *
   * `padding: 25%` 参照**父元素宽度**（即使是 paddingTop / paddingBottom 也参照宽，同 margin）。
   * 这一点常被误解 —— 常用于实现"固定比例"盒子（如 16:9 视频容器）：
   *
   * ```ts
   * s.paddingTop('56.25%')   // = 16:9 比例（9/16 = 56.25%）
   * // 配合子元素 position:absolute 实现固定宽高比容器
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.padding.px(200)         ≡ s.padding('200px')
   * s.padding.rem(1.5)        ≡ s.padding('1.5rem')
   * s.padding.em(2)           ≡ s.padding('2em')      // 当前元素 font-size 的倍数
   * s.padding.vw(50)          ≡ s.padding('50vw')     // 视口宽 1%
   * s.padding.dvw(50)         ≡ s.padding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.padding.cqw(50)         ≡ s.padding('50cqw')    // container query 容器尺寸
   * s.padding.percent(50)     ≡ s.padding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.padding('calc(100% - 32px)')
   * s.padding('min(100%, 1200px)')
   * s.padding('max(280px, 50%)')
   * s.padding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，顺时针分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-bottom
   */
  paddingBottom: PropCarrier<CssValueOf<'paddingBottom'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     *
     * |          Chrome           |        Firefox         |          Safari           |  Edge  | IE  |
     * | :-----------------------: | :--------------------: | :-----------------------: | :----: | :-: |
     * |          **69**           |         **41**         |         **12.1**          | **79** | No  |
     * | 2 _(-webkit-padding-end)_ | 3 _(-moz-padding-end)_ | 3 _(-webkit-padding-end)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-inline-end
     */
  paddingInlineEnd: PropFn<CssValueOf<'paddingInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     *
     * |           Chrome            |         Firefox          |           Safari            |  Edge  | IE  |
     * | :-------------------------: | :----------------------: | :-------------------------: | :----: | :-: |
     * |           **69**            |          **41**          |          **12.1**           | **79** | No  |
     * | 2 _(-webkit-padding-start)_ | 3 _(-moz-padding-start)_ | 3 _(-webkit-padding-start)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-inline-start
     */
  paddingInlineStart: PropFn<CssValueOf<'paddingInlineStart'>>
  /**
   * 设置元素的**左内边距**。其他规则同 [`padding`]。
   *
   * ## 关键字
   *
   * ### padding 关键字（仅含 auto，实际很少用）
   *
   * | 关键字 | 效果 | 说明 |
   * | --- | --- | --- |
   * | `auto` | 浏览器自动计算。⚠️ **`padding` 很少用 auto**，
   * 实际仅在某些布局情形（如 flex/grid 的 padding-inline）有意义 | 通常写具体长度值；`auto` 不像 margin 那样有居中效果 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `paddingLeft`。⚠️ `paddingLeft` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `paddingLeft` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `paddingLeft` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `paddingLeft` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值，与 margin 完全相同）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `padding('16px')` | 四边均为 16px |
   * | `padding('8px 16px')` | 上下 8px，左右 16px |
   * | `padding('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `padding('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### ⚠️ padding 不接受负值
   *
   * `padding` 不同于 `margin`，**不接受负值**。负 padding 无效，会被浏览器忽略。
   *
   * ### 背景延伸到 padding 区域
   *
   * 默认 `background-clip: border-box`，背景色/图会填充 padding 区域（直到边框）。
   * 改为 `background-clip: content-box` 可让背景只覆盖内容区。
   *
   * ### 百分比参照
   *
   * `padding: 25%` 参照**父元素宽度**（即使是 paddingTop / paddingBottom 也参照宽，同 margin）。
   * 这一点常被误解 —— 常用于实现"固定比例"盒子（如 16:9 视频容器）：
   *
   * ```ts
   * s.paddingTop('56.25%')   // = 16:9 比例（9/16 = 56.25%）
   * // 配合子元素 position:absolute 实现固定宽高比容器
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.padding.px(200)         ≡ s.padding('200px')
   * s.padding.rem(1.5)        ≡ s.padding('1.5rem')
   * s.padding.em(2)           ≡ s.padding('2em')      // 当前元素 font-size 的倍数
   * s.padding.vw(50)          ≡ s.padding('50vw')     // 视口宽 1%
   * s.padding.dvw(50)         ≡ s.padding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.padding.cqw(50)         ≡ s.padding('50cqw')    // container query 容器尺寸
   * s.padding.percent(50)     ≡ s.padding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.padding('calc(100% - 32px)')
   * s.padding('min(100%, 1200px)')
   * s.padding('max(280px, 50%)')
   * s.padding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，顺时针分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-left
   */
  paddingLeft: PropCarrier<CssValueOf<'paddingLeft'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * 设置元素的**右内边距**。其他规则同 [`padding`]。
   *
   * ## 关键字
   *
   * ### padding 关键字（仅含 auto，实际很少用）
   *
   * | 关键字 | 效果 | 说明 |
   * | --- | --- | --- |
   * | `auto` | 浏览器自动计算。⚠️ **`padding` 很少用 auto**，
   * 实际仅在某些布局情形（如 flex/grid 的 padding-inline）有意义 | 通常写具体长度值；`auto` 不像 margin 那样有居中效果 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `paddingRight`。⚠️ `paddingRight` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `paddingRight` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `paddingRight` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `paddingRight` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值，与 margin 完全相同）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `padding('16px')` | 四边均为 16px |
   * | `padding('8px 16px')` | 上下 8px，左右 16px |
   * | `padding('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `padding('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### ⚠️ padding 不接受负值
   *
   * `padding` 不同于 `margin`，**不接受负值**。负 padding 无效，会被浏览器忽略。
   *
   * ### 背景延伸到 padding 区域
   *
   * 默认 `background-clip: border-box`，背景色/图会填充 padding 区域（直到边框）。
   * 改为 `background-clip: content-box` 可让背景只覆盖内容区。
   *
   * ### 百分比参照
   *
   * `padding: 25%` 参照**父元素宽度**（即使是 paddingTop / paddingBottom 也参照宽，同 margin）。
   * 这一点常被误解 —— 常用于实现"固定比例"盒子（如 16:9 视频容器）：
   *
   * ```ts
   * s.paddingTop('56.25%')   // = 16:9 比例（9/16 = 56.25%）
   * // 配合子元素 position:absolute 实现固定宽高比容器
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.padding.px(200)         ≡ s.padding('200px')
   * s.padding.rem(1.5)        ≡ s.padding('1.5rem')
   * s.padding.em(2)           ≡ s.padding('2em')      // 当前元素 font-size 的倍数
   * s.padding.vw(50)          ≡ s.padding('50vw')     // 视口宽 1%
   * s.padding.dvw(50)         ≡ s.padding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.padding.cqw(50)         ≡ s.padding('50cqw')    // container query 容器尺寸
   * s.padding.percent(50)     ≡ s.padding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.padding('calc(100% - 32px)')
   * s.padding('min(100%, 1200px)')
   * s.padding('max(280px, 50%)')
   * s.padding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，顺时针分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-right
   */
  paddingRight: PropCarrier<CssValueOf<'paddingRight'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * 设置元素的**上内边距**。⚠️ 百分比参照**父容器宽度**（非高度），常用于实现固定宽高比容器。其他规则同 [`padding`]。
   *
   * ## 关键字
   *
   * ### padding 关键字（仅含 auto，实际很少用）
   *
   * | 关键字 | 效果 | 说明 |
   * | --- | --- | --- |
   * | `auto` | 浏览器自动计算。⚠️ **`padding` 很少用 auto**，
   * 实际仅在某些布局情形（如 flex/grid 的 padding-inline）有意义 | 通常写具体长度值；`auto` 不像 margin 那样有居中效果 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `paddingTop`。⚠️ `paddingTop` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `paddingTop` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `paddingTop` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `paddingTop` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值，与 margin 完全相同）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `padding('16px')` | 四边均为 16px |
   * | `padding('8px 16px')` | 上下 8px，左右 16px |
   * | `padding('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `padding('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### ⚠️ padding 不接受负值
   *
   * `padding` 不同于 `margin`，**不接受负值**。负 padding 无效，会被浏览器忽略。
   *
   * ### 背景延伸到 padding 区域
   *
   * 默认 `background-clip: border-box`，背景色/图会填充 padding 区域（直到边框）。
   * 改为 `background-clip: content-box` 可让背景只覆盖内容区。
   *
   * ### 百分比参照
   *
   * `padding: 25%` 参照**父元素宽度**（即使是 paddingTop / paddingBottom 也参照宽，同 margin）。
   * 这一点常被误解 —— 常用于实现"固定比例"盒子（如 16:9 视频容器）：
   *
   * ```ts
   * s.paddingTop('56.25%')   // = 16:9 比例（9/16 = 56.25%）
   * // 配合子元素 position:absolute 实现固定宽高比容器
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.padding.px(200)         ≡ s.padding('200px')
   * s.padding.rem(1.5)        ≡ s.padding('1.5rem')
   * s.padding.em(2)           ≡ s.padding('2em')      // 当前元素 font-size 的倍数
   * s.padding.vw(50)          ≡ s.padding('50vw')     // 视口宽 1%
   * s.padding.dvw(50)         ≡ s.padding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.padding.cqw(50)         ≡ s.padding('50cqw')    // container query 容器尺寸
   * s.padding.percent(50)     ≡ s.padding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.padding('calc(100% - 32px)')
   * s.padding('min(100%, 1200px)')
   * s.padding('max(280px, 50%)')
   * s.padding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，顺时针分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-top
   */
  paddingTop: PropCarrier<CssValueOf<'paddingTop'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since February 2023.
     *
     * **Syntax**: `auto | <custom-ident>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **85** | **110** | **1**  | **85** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/page
     */
  page: PropFn<CssValueOf<'page'>>
  /**
     * Since March 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `normal | [ fill || stroke || markers ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **123** | **60**  | **11** | **123** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/paint-order
     */
  paintOrder: PropFn<CssValueOf<'paintOrder'>>
  /**
   * 设置 **3D 透视距离** —— 观察者到 Z=0 平面的距离。值越小透视越强烈（夸张），越大越平。设此属性可让子元素的 3D 变换看起来"立体"。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无透视（3D 变换看起来是 2D 平面投影） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `perspective`。⚠️ `perspective` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `perspective` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `perspective` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `perspective` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 父容器开启透视
   * s.perspective.px(800)
   *
   * // 子元素 3D 旋转才会有立体感
   * // child: s.transform('rotateY(45deg)')
   * ```
   *
   * ### perspective 属性 vs transform 函数
   *
   * | 写法 | 影响范围 |
   * | --- | --- |
   * | `perspective: 800px`（本属性）| 给**所有子元素**应用相同的观察距离（容器级） |
   * | `transform: perspective(800px)` | 仅当前元素的 3D 变换有透视效果 |
   *
   * 容器级 `perspective` 让多个子元素**共享同一灭点**（看起来"在一个 3D 空间里"）；transform 函数则各自独立。
   *
   * ### 常用值
   *
   * - `300-500px`：强烈透视（卡片翻转、画廊效果）
   * - `800-1200px`：温和透视
   * - `> 2000px`：几乎无透视
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.perspective.px(200)         ≡ s.perspective('200px')
   * s.perspective.rem(1.5)        ≡ s.perspective('1.5rem')
   * s.perspective.em(2)           ≡ s.perspective('2em')      // 当前元素 font-size 的倍数
   * s.perspective.vw(50)          ≡ s.perspective('50vw')     // 视口宽 1%
   * s.perspective.dvw(50)         ≡ s.perspective('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.perspective.cqw(50)         ≡ s.perspective('50cqw')    // container query 容器尺寸
   * s.perspective.percent(50)     ≡ s.perspective('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.perspective('calc(100% - 32px)')
   * s.perspective('min(100%, 1200px)')
   * s.perspective('max(280px, 50%)')
   * s.perspective('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'800px'` `'30em'` | 透视距离（必须 > 0） |
   * | `none` | — | 无透视 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox  | Safari  |  Edge  |   IE   |
   * | :------: | :------: | :-----: | :----: | :----: |
   * |  **36**  |  **16**  |  **9**  | **12** | **10** |
   * | 12 _-x-_ | 10 _-x-_ | 4 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/perspective
   */
  perspective: PropCarrier<CssValueOf<'perspective'>, never, 'none' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<position>`
     *
     * **Initial value**: `50% 50%`
     *
     * |  Chrome  | Firefox  | Safari  |  Edge  |   IE   |
     * | :------: | :------: | :-----: | :----: | :----: |
     * |  **36**  |  **16**  |  **9**  | **12** | **10** |
     * | 12 _-x-_ | 10 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/perspective-origin
     */
  perspectiveOrigin: PropFn<CssValueOf<'perspectiveOrigin'>>
  /**
   * 控制元素**是否响应鼠标 / 触摸事件**（点击、hover、拖动）。`none` 让元素**事件穿透**到下方。
   *
   * ## 关键字
   *
   * ### 通用
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。响应所有事件 |
   * | `none` | **事件穿透** —— 元素不响应任何事件，事件直接传给下方元素（覆盖层 / 装饰元素常用） |
   *
   * ### SVG 专属（仅在 SVG 元素生效）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `visiblePainted` | 仅可见且有 fill / stroke 的区域响应（SVG 默认） |
   * | `visibleFill` | 仅可见且有 fill 的区域响应 |
   * | `visibleStroke` | 仅可见且有 stroke 的区域响应 |
   * | `visible` | 所有可见区域都响应（包括 fill: none 的填充区） |
   * | `painted` | 所有有 fill / stroke 的区域响应（不管可见性） |
   * | `fill` | 所有有 fill 的区域响应 |
   * | `stroke` | 所有有 stroke 的区域响应 |
   * | `all` | 所有区域都响应（包括透明） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `pointerEvents`。⚠️ `pointerEvents` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `pointerEvents` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `pointerEvents` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `pointerEvents` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 让 disabled 按钮不响应点击
   * s.pointerEvents.none
   * s.opacity(0.5)
   *
   * // 装饰性遮罩不阻挡下层交互
   * s.position.absolute
   * s.inset(0)
   * s.pointerEvents.none
   *
   * // 仅让按钮内的图标透传点击到按钮本身
   * // icon: s.pointerEvents.none
   * ```
   *
   * ### 注意
   *
   * - `pointerEvents: none` 不会改变**屏幕阅读器** —— 仍可访问。需配合 `aria-hidden` 才彻底"消失"
   * - 仍会响应键盘 focus（仅鼠标 / 触摸事件被禁）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 通用 | `auto` ｜ `none` | 最常用 |
   * | SVG 专属 | `visiblePainted` ｜ `visibleFill` ｜ `visibleStroke` ｜ `visible` ｜ `painted` ｜ `fill` ｜ `stroke` ｜ `all` | 仅 SVG 元素生效 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE   |
   * | :----: | :-----: | :----: | :----: | :----: |
   * | **1**  | **1.5** | **4**  | **12** | **11** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/pointer-events
   */
  pointerEvents: PropCarrier<CssValueOf<'pointerEvents'>, never, 'none' | 'auto' | 'visiblePainted' | 'visibleFill' | 'visibleStroke' | 'visible' | 'painted' | 'fill' | 'stroke' | 'all' | GlobalKw, unknown, never>
  /**
   * 决定元素的**定位上下文** —— 影响该元素如何参与文档流，以及 `top` / `right` / `bottom` / `left` / `inset` / `z-index` 是否生效、以谁为基准。
   *
   * ## 关键字
   *
   * ### 5 个定位关键字
   *
   * | 关键字 | 占位 | 偏移属性生效 | 偏移基准 | 用途 |
   * | --- | --- | --- | --- | --- |
   * | `static` | ✓ 占位 | ✗ 无效 | — | **默认值**。正常文档流，`top/left/...` 无效，`z-index` 也无效 |
   * | `relative` | ✓ 占位 | ✓ | **自己原位置** | 让自己微量偏移（视觉移动，原位置仍占）；同时可作 absolute 子元素的"定位父" |
   * | `absolute` | ✗ **脱离文档流** | ✓ | **最近的非 static 祖先** | 脱离文档流，绝对定位；找不到非 static 祖先则退回 `<html>` |
   * | `fixed` | ✗ 脱离文档流 | ✓ | **视口** viewport | 固定在视口；滚动不动 |
   * | `sticky` | ✓ 占位 | ✓ | **最近的滚动容器** | 阈值前同 `relative`，滚动到阈值后变 `fixed` —— 实现"粘性头部 / 侧边栏" |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `position`。⚠️ `position` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `static` |
   * | `unset` | `position` 非继承属性 → 等同 `initial`（= `static`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `position` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `position` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 常见陷阱
   *
   * - **`absolute` 找不到定位父** → 退回 `<html>` 为参照（常见 bug：写了 `position: absolute` 但忘了给父加 `position: relative`，结果元素跑到 body 左上角）
   * - **`fixed` 在祖先有 `transform` / `filter` / `perspective` / `will-change: transform` / `contain: paint`** 时会变成相对该祖先定位（**不再相对视口**）—— Safari 经常踩
   * - **`sticky` 在父元素有 `overflow: hidden`/`auto`/`scroll`** 时**不会粘** —— 父创建了新的滚动上下文，sticky 找不到可粘的祖先
   * - **`sticky` 必须配合至少一个阈值**：`s.position.sticky` + `s.top(0)` 才生效
   * - **z-index 仅对非 static 元素生效**：`position: static` 写 `z-index` 是无效的
   * - **flex / grid item 上的 `absolute`**：让该 item 脱离布局流，不再参与对齐
   *
   * ### 经典布局示例
   *
   * ```ts
   * // 居中遮罩
   * s.position.fixed
   * s.inset(0)             // 4 边都贴视口 = 全屏
   * s.display.flex
   * s.alignItems.center
   * s.justifyContent.center
   *
   * // 粘性头部
   * s.position.sticky
   * s.top(0)
   * s.zIndex(10)
   *
   * // 绝对定位徽标
   * s.position.absolute
   * s.top.px(-8)
   * s.right.px(-8)
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个定位关键字 | `static` ｜ `relative` ｜ `absolute` ｜ `fixed` ｜ `sticky` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `static`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * 远古基础属性。`sticky` 较晚：Chrome 56 / Firefox 32 / Safari 13。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position
   */
  position: PropCarrier<CssValueOf<'position'>, never, 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky' | GlobalKw, unknown, never>
  /**
   * 绑定到一个已命名的**锚点元素**，让自己相对该锚点定位（CSS Anchor Positioning，实验性）。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。隐式锚点（如有） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `positionAnchor`。⚠️ `positionAnchor` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `positionAnchor` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `positionAnchor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `positionAnchor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<dashed-ident>` | `'--my-anchor'` | 引用 anchorName 设置的名称 |
   * | `auto` | — | 默认 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
   * | :-----: | :---------: | :----: | :-----: | :-: |
   * | **125** | **preview** | **26** | **125** | No  |
   *
   * CSS Anchor Positioning（实验性），Chrome 125+。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position-anchor
   */
  positionAnchor: PropCarrier<CssValueOf<'positionAnchor'>, never, 'auto' | GlobalKw, unknown, never>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <position-area>`
     *
     * **Initial value**: `none`
     *
     * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
     * | :-----: | :---------: | :----: | :-----: | :-: |
     * | **129** | **preview** | **26** | **129** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position-area
     */
  positionArea: PropFn<CssValueOf<'positionArea'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | [ [<dashed-ident> || <try-tactic>] | <'position-area'> ]#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
     * | :-----: | :---------: | :----: | :-----: | :-: |
     * | **128** | **preview** | **26** | **128** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position-try-fallbacks
     */
  positionTryFallbacks: PropFn<CssValueOf<'positionTryFallbacks'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | <try-size>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **125** |   No    | **26** | **125** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position-try-order
     */
  positionTryOrder: PropFn<CssValueOf<'positionTryOrder'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `always | [ anchors-valid || anchors-visible || no-overflow ]`
     *
     * **Initial value**: `anchors-visible`
     *
     * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
     * | :-----: | :---------: | :----: | :-----: | :-: |
     * | **125** | **preview** |   No   | **125** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position-visibility
     */
  positionVisibility: PropFn<CssValueOf<'positionVisibility'>>
  /**
     * Since May 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `economy | exact`
     *
     * **Initial value**: `economy`
     *
     * |  Chrome  |       Firefox       |  Safari  |   Edge   | IE  |
     * | :------: | :-----------------: | :------: | :------: | :-: |
     * | **136**  |       **97**        | **15.4** | **136**  | No  |
     * | 17 _-x-_ | 48 _(color-adjust)_ | 6 _-x-_  | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/print-color-adjust
     */
  printColorAdjust: PropFn<CssValueOf<'printColorAdjust'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | auto | [ <string> <string> ]+`
     *
     * **Initial value**: depends on user agent
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **11** | **1.5** | **9**  | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/quotes
     */
  quotes: PropFn<CssValueOf<'quotes'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **43** | **69**  | **9**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/r
     */
  r: PropFn<CssValueOf<'r'>>
  /**
   * 允许用户**手动调整元素尺寸**（拖右下角）。最常用于 `<textarea>` 让用户拖动改大小。
   *
   * ## 关键字
   *
   * ### 6 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不可调整 |
   * | `both` | 可同时调整宽和高 |
   * | `horizontal` | 仅可调整**宽度** |
   * | `vertical` | 仅可调整**高度** |
   * | `block` | 逻辑：块方向（横排 = 高度） |
   * | `inline` | 逻辑：行内方向（横排 = 宽度） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `resize`。⚠️ `resize` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `resize` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `resize` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `resize` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // textarea 仅允许调高度（避免破坏布局）
   * s.resize.vertical
   *
   * // 禁用 textarea 默认的调整功能
   * s.resize.none
   * ```
   *
   * ### 生效前提
   *
   * `resize` 需要元素是 `overflow` 非 `visible`（默认 `<textarea>` 满足，其他元素需 `overflow: auto/hidden/scroll`）。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 6 个 keyword | `none` ｜ `both` ｜ `horizontal` ｜ `vertical` ｜ `block` ｜ `inline` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **1**  |  **4**  | **3**  | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/resize
   */
  resize: PropCarrier<CssValueOf<'resize'>, never, 'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline' | GlobalKw, unknown, never>
  /**
   * 设置定位元素距**右侧**的偏移量。正值向左移（向内缩），负值向右溢出。**只在 `position` 非 `static` 时生效**。其他规则同 [`inset`]。
   *
   * ## 关键字
   *
   * ### 1 个偏移关键字
   *
   * | 关键字 | 效果 | 说明 |
   * | --- | --- | --- |
   * | `auto` | **默认值**。不参与定位，交由浏览器按正常文档流决定位置 | 未定位元素（`position: static`）的默认状态；也用于取消之前设过的偏移 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `right`。⚠️ `right` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `right` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `right` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `right` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### ⚠️ 必须配合 position: relative/absolute/fixed/sticky 才生效
   *
   * `top` / `right` / `bottom` / `left`（以及 `inset`）对 `position: static`（默认值）的元素**无效**。
   *
   * ### 简写语法（与 margin/padding 相同的 1/2/3/4 值规则）
   *
   * ```ts
   * s.inset.px(0)                     // 四边均偏移 0（常用于绝对定位充满父容器）
   * s.inset('0 16px')                 // 上下 0，左右 16px
   * s.inset('8px 16px 24px 32px')     // 上 右 下 左（顺时针）
   * ```
   *
   * ### 偏移基准（四种定位各不同）
   *
   * | position | 偏移基准 |
   * | --- | --- |
   * | `relative` | **元素原始位置**（偏移后原位仍占空间） |
   * | `absolute` | **最近的定位祖先**（position 非 static 的祖先）的 padding-box 边缘 |
   * | `fixed` | **视口**（viewport）边缘（⚠️ 祖先有 `transform` / `will-change: transform` / `filter` 时变为祖先 padding-box） |
   * | `sticky` | 正常文档流位置（偏移值 = 粘住后距视口边缘的距离） |
   *
   * ### 绝对定位充满父容器
   *
   * ```ts
   * s.position.absolute
   * s.inset.px(0)   // 等同 top:0 right:0 bottom:0 left:0
   * // 前提：父容器 position 不是 static
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.inset.px(200)         ≡ s.inset('200px')
   * s.inset.rem(1.5)        ≡ s.inset('1.5rem')
   * s.inset.em(2)           ≡ s.inset('2em')      // 当前元素 font-size 的倍数
   * s.inset.vw(50)          ≡ s.inset('50vw')     // 视口宽 1%
   * s.inset.dvw(50)         ≡ s.inset('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.inset.cqw(50)         ≡ s.inset('50cqw')    // container query 容器尺寸
   * s.inset.percent(50)     ≡ s.inset('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.inset('calc(100% - 32px)')
   * s.inset('min(100%, 1200px)')
   * s.inset('max(280px, 50%)')
   * s.inset('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | — | **默认值**；不偏移，由文档流决定位置 |
   * | 多值简写 | `'0 16px'` `'8px 16px 24px 32px'` | 1/2/3/4 个值，顺时针分配到四边 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE    |
   * | :----: | :-----: | :----: | :----: | :-----: |
   * | **1**  |  **1**  | **1**  | **12** | **5.5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/right
   */
  right: PropCarrier<CssValueOf<'right'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * 设置元素的**旋转角度**（CSS Transforms 2，独立属性，等价于 `transform: rotate()`）。可指定旋转轴。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不旋转 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `rotate`。⚠️ `rotate` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `rotate` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `rotate` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `rotate` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态
   *
   * ```ts
   * s.rotate('45deg')                   // 2D 旋转 45 度（顺时针）
   * s.rotate('-90deg')                  // 逆时针 90 度
   * s.rotate('0.5turn')                 // 半圈 = 180deg
   *
   * // 3D 旋转（需指定轴）
   * s.rotate('x 45deg')                 // 围绕 X 轴旋转
   * s.rotate('y 90deg')                 // 围绕 Y 轴旋转
   * s.rotate('1 1 0 45deg')             // 围绕自定义轴向量
   * ```
   *
   * ### rotate 独立属性 vs transform
   *
   * ```ts
   * // 现代写法（独立属性 + 复合）
   * s.rotate('45deg')
   * s.scale('1.2')
   * s.translate('10px, 20px')
   *
   * // 经典写法（transform 综合）
   * s.transform('rotate(45deg) scale(1.2) translate(10px, 20px)')
   * ```
   *
   * 独立属性的优势：**单独动画化某一项变换**（如只动画 rotate，保留 scale 不变）。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<angle>` | `'45deg'` `'-90deg'` `'0.5turn'` | 2D 旋转 |
   * | 轴 + 角度 | `'x 45deg'` `'y 90deg'` `'z 45deg'` | 3D 旋转，指定轴 |
   * | 向量 + 角度 | `'1 1 0 45deg'` | 围绕自定义轴向量 |
   * | `none` | — | 不旋转 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
   * | :-----: | :-----: | :------: | :-----: | :-: |
   * | **104** | **72**  | **14.1** | **104** | No  |
   *
   * CSS Transforms 2 独立属性 Chrome 104 / Firefox 72 / Safari 14.1+。旧浏览器用 `transform: rotate()`。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/rotate
   */
  rotate: PropCarrier<CssValueOf<'rotate'>, never, 'none' | GlobalKw, AngleUnits, never>
  /**
   * 仅设置**行间距**（垂直方向）。可单独覆盖 `gap` 简写的行间距值。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。flex/grid 中等于 `0`；多栏布局中浏览器默认值 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `rowGap`。⚠️ `rowGap` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `rowGap` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `rowGap` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `rowGap` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写：1 或 2 个值
   *
   * ```ts
   * s.gap.px(12)                  // 行列都 12px
   * s.gap('12px 24px')            // 行间距 12px，列间距 24px
   * ```
   *
   * 等价于：
   *
   * ```ts
   * s.rowGap.px(12)
   * s.columnGap.px(24)
   * ```
   *
   * ### gap vs margin
   *
   * | 方案 | 边缘多余间距 | 适应换行 |
   * | --- | --- | --- |
   * | `gap` | ✗ 无 | ✓ 自动 |
   * | `margin` | ✓ 有（需配合 `:first-child` 等） | ✗ 需手动处理 |
   *
   * `gap` 是现代 CSS 推荐方案。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.gap.px(200)         ≡ s.gap('200px')
   * s.gap.rem(1.5)        ≡ s.gap('1.5rem')
   * s.gap.em(2)           ≡ s.gap('2em')      // 当前元素 font-size 的倍数
   * s.gap.vw(50)          ≡ s.gap('50vw')     // 视口宽 1%
   * s.gap.dvw(50)         ≡ s.gap('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.gap.cqw(50)         ≡ s.gap('50cqw')    // container query 容器尺寸
   * s.gap.percent(50)     ≡ s.gap('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.gap('calc(100% - 32px)')
   * s.gap('min(100%, 1200px)')
   * s.gap('max(280px, 50%)')
   * s.gap('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 1 个 `<length>` | `'12px'` `'1rem'` | 行列相同 |
   * | 2 个 `<length>` | `'12px 24px'` | 行间距 / 列间距 |
   * | `<percentage>` | `'5%'` | 相对容器尺寸 |
   * | `normal` | — | 默认；flex/grid 中等于 0 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **47** | **52**  | **10.1** | **16** | No  |
   *
   * flex `gap` 较晚普及：Chrome 84 / Firefox 63 / Safari 14.1。早期可用 margin + 负 margin 兼容方案。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/row-gap
   */
  rowGap: PropCarrier<CssValueOf<'rowGap'>, SpacingTokens<T>, 'normal' | GlobalKw, LengthUnits, never>
  /**
     * Since December 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `start | center | space-between | space-around`
     *
     * **Initial value**: `space-around`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **128** | **38**  | **18.2** | **128** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/ruby-align
     */
  rubyAlign: PropFn<CssValueOf<'rubyAlign'>>
  /**
     * **Syntax**: `separate | collapse | auto`
     *
     * **Initial value**: `separate`
     */
  rubyMerge: PropFn<CssValueOf<'rubyMerge'>>
  /**
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  | Edge | IE  |
     * | :----: | :-----: | :------: | :--: | :-: |
     * |   No   |   No    | **18.2** |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/ruby-overhang
     */
  rubyOverhang: PropFn<CssValueOf<'rubyOverhang'>>
  /**
     * Since December 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ alternate || [ over | under ] ] | inter-character`
     *
     * **Initial value**: `alternate`
     *
     * | Chrome  | Firefox |  Safari  | Edge  | IE  |
     * | :-----: | :-----: | :------: | :---: | :-: |
     * | **84**  | **38**  | **18.2** | 12-79 | No  |
     * | 1 _-x-_ |         | 7 _-x-_  |       |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/ruby-position
     */
  rubyPosition: PropFn<CssValueOf<'rubyPosition'>>
  /**
     * Since March 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **43** | **69**  | **17.4** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/rx
     */
  rx: PropFn<CssValueOf<'rx'>>
  /**
     * Since March 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **43** | **69**  | **17.4** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/ry
     */
  ry: PropFn<CssValueOf<'ry'>>
  /**
   * 设置元素的**缩放比例**（CSS Transforms 2 独立属性）。1.0 = 原始大小，2 = 双倍，0.5 = 一半。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不缩放（等同 `1`） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scale`。⚠️ `scale` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `scale` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scale` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scale` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态
   *
   * ```ts
   * s.scale(1.2)               // X、Y 都放大 1.2 倍
   * s.scale('1.2 0.8')         // X 放大 1.2，Y 缩小到 0.8
   * s.scale('1.2 1.2 1.5')     // 3D 缩放（X Y Z）
   * ```
   *
   * ### 用例
   *
   * ```ts
   * // hover 微放大
   * s.transition('scale 200ms ease-out')
   * // :hover { scale: 1.05 }
   *
   * // 翻转
   * s.scale('-1 1')            // 水平翻转
   * s.scale('1 -1')            // 垂直翻转
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 1 个数字 | `1.2` `0.5` | X 和 Y 同时缩放 |
   * | 2 个数字 | `'1.2 0.8'` | X / Y 分别缩放 |
   * | 3 个数字 | `'1 1 1.5'` | X / Y / Z (3D) |
   * | `<percentage>` | `'120%'` | 相当于 1.2 |
   * | `none` | — | 不缩放 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
   * | :-----: | :-----: | :------: | :-----: | :-: |
   * | **104** | **72**  | **14.1** | **104** | No  |
   *
   * CSS Transforms 2 独立属性 Chrome 104 / Firefox 72 / Safari 14.1+。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scale
   */
  scale: PropCarrier<CssValueOf<'scale'>, never, 'none' | GlobalKw, unknown, never>
  /**
   * 设置滚动**是否平滑过渡** —— JS `scrollTo` / 锚点跳转时是瞬间跳过去还是平滑滚过去。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。瞬间跳转（无动画） |
   * | `smooth` | **平滑滚动**（自动缓动动画） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollBehavior`。⚠️ `scrollBehavior` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `scrollBehavior` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollBehavior` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollBehavior` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 全站平滑滚动（给根元素或 body）
   * s.scrollBehavior.smooth
   *
   * // 锚点跳转 <a href="#section"> 时自动平滑滚到目标
   * // JS: window.scrollTo({ top: 0, behavior: 'smooth' }) 也是另一种方式
   * ```
   *
   * ### a11y 注意
   *
   * 部分用户系统设了"减少动画"偏好（prefers-reduced-motion），应配合：
   *
   * ```css
   * @media (prefers-reduced-motion: reduce) {
   *   * { scroll-behavior: auto !important; }
   * }
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `auto` ｜ `smooth` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **61** | **36**  | **15.4** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-behavior
   */
  scrollBehavior: PropCarrier<CssValueOf<'scrollBehavior'>, never, 'auto' | 'smooth' | GlobalKw, unknown, never>
  /**
     * **Syntax**: `none | nearest`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **133** |   No    |   No   | **133** | No  |
     */
  scrollInitialTarget: PropFn<CssValueOf<'scrollInitialTarget'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-block-end
     */
  scrollMarginBlockEnd: PropFn<CssValueOf<'scrollMarginBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-block-start
     */
  scrollMarginBlockStart: PropFn<CssValueOf<'scrollMarginBlockStart'>>
  /**
   * snap 对齐时**下方**的外边距偏移。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度（可负），**无关键字**` —— undefined
   * - `仅在元素是 snap item 时生效` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollMarginBottom`。⚠️ `scrollMarginBottom` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `scrollMarginBottom` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollMarginBottom` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollMarginBottom` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 让 item 对齐时距容器左边缘留 20px 缓冲
   * s.scrollMargin.px(20)
   *
   * // 简写四方位
   * s.scrollMargin('10px 20px')
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollMargin.px(200)         ≡ s.scrollMargin('200px')
   * s.scrollMargin.rem(1.5)        ≡ s.scrollMargin('1.5rem')
   * s.scrollMargin.em(2)           ≡ s.scrollMargin('2em')      // 当前元素 font-size 的倍数
   * s.scrollMargin.vw(50)          ≡ s.scrollMargin('50vw')     // 视口宽 1%
   * s.scrollMargin.dvw(50)         ≡ s.scrollMargin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollMargin.cqw(50)         ≡ s.scrollMargin('50cqw')    // container query 容器尺寸
   * s.scrollMargin.percent(50)     ≡ s.scrollMargin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollMargin('calc(100% - 32px)')
   * s.scrollMargin('min(100%, 1200px)')
   * s.scrollMargin('max(280px, 50%)')
   * s.scrollMargin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'20px'` `'1rem'` | 可正可负 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |              Safari              |  Edge  | IE  |
   * | :----: | :-----: | :------------------------------: | :----: | :-: |
   * | **69** | **68**  |             **14.1**             | **79** | No  |
   * |        |         | 11 _(scroll-snap-margin-bottom)_ |        |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-bottom
   */
  scrollMarginBottom: PropCarrier<CssValueOf<'scrollMarginBottom'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-inline-end
     */
  scrollMarginInlineEnd: PropFn<CssValueOf<'scrollMarginInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-inline-start
     */
  scrollMarginInlineStart: PropFn<CssValueOf<'scrollMarginInlineStart'>>
  /**
   * snap 对齐时**左侧**的外边距偏移。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度（可负），**无关键字**` —— undefined
   * - `仅在元素是 snap item 时生效` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollMarginLeft`。⚠️ `scrollMarginLeft` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `scrollMarginLeft` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollMarginLeft` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollMarginLeft` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 让 item 对齐时距容器左边缘留 20px 缓冲
   * s.scrollMargin.px(20)
   *
   * // 简写四方位
   * s.scrollMargin('10px 20px')
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollMargin.px(200)         ≡ s.scrollMargin('200px')
   * s.scrollMargin.rem(1.5)        ≡ s.scrollMargin('1.5rem')
   * s.scrollMargin.em(2)           ≡ s.scrollMargin('2em')      // 当前元素 font-size 的倍数
   * s.scrollMargin.vw(50)          ≡ s.scrollMargin('50vw')     // 视口宽 1%
   * s.scrollMargin.dvw(50)         ≡ s.scrollMargin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollMargin.cqw(50)         ≡ s.scrollMargin('50cqw')    // container query 容器尺寸
   * s.scrollMargin.percent(50)     ≡ s.scrollMargin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollMargin('calc(100% - 32px)')
   * s.scrollMargin('min(100%, 1200px)')
   * s.scrollMargin('max(280px, 50%)')
   * s.scrollMargin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'20px'` `'1rem'` | 可正可负 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |             Safari             |  Edge  | IE  |
   * | :----: | :-----: | :----------------------------: | :----: | :-: |
   * | **69** | **68**  |            **14.1**            | **79** | No  |
   * |        |         | 11 _(scroll-snap-margin-left)_ |        |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-left
   */
  scrollMarginLeft: PropCarrier<CssValueOf<'scrollMarginLeft'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * snap 对齐时**右侧**的外边距偏移。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度（可负），**无关键字**` —— undefined
   * - `仅在元素是 snap item 时生效` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollMarginRight`。⚠️ `scrollMarginRight` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `scrollMarginRight` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollMarginRight` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollMarginRight` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 让 item 对齐时距容器左边缘留 20px 缓冲
   * s.scrollMargin.px(20)
   *
   * // 简写四方位
   * s.scrollMargin('10px 20px')
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollMargin.px(200)         ≡ s.scrollMargin('200px')
   * s.scrollMargin.rem(1.5)        ≡ s.scrollMargin('1.5rem')
   * s.scrollMargin.em(2)           ≡ s.scrollMargin('2em')      // 当前元素 font-size 的倍数
   * s.scrollMargin.vw(50)          ≡ s.scrollMargin('50vw')     // 视口宽 1%
   * s.scrollMargin.dvw(50)         ≡ s.scrollMargin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollMargin.cqw(50)         ≡ s.scrollMargin('50cqw')    // container query 容器尺寸
   * s.scrollMargin.percent(50)     ≡ s.scrollMargin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollMargin('calc(100% - 32px)')
   * s.scrollMargin('min(100%, 1200px)')
   * s.scrollMargin('max(280px, 50%)')
   * s.scrollMargin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'20px'` `'1rem'` | 可正可负 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |             Safari              |  Edge  | IE  |
   * | :----: | :-----: | :-----------------------------: | :----: | :-: |
   * | **69** | **68**  |            **14.1**             | **79** | No  |
   * |        |         | 11 _(scroll-snap-margin-right)_ |        |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-right
   */
  scrollMarginRight: PropCarrier<CssValueOf<'scrollMarginRight'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * snap 对齐时**上方**的外边距偏移。常用于锚点跳转时避开固定头部。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度（可负），**无关键字**` —— undefined
   * - `仅在元素是 snap item 时生效` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollMarginTop`。⚠️ `scrollMarginTop` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `scrollMarginTop` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollMarginTop` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollMarginTop` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：避开固定头部
   *
   * ```ts
   * // 给锚点目标元素
   * s.scrollMarginTop.px(80)
   * // 锚点跳转后，元素位置往下 80px（让出固定头部空间）
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollMarginTop.px(200)         ≡ s.scrollMarginTop('200px')
   * s.scrollMarginTop.rem(1.5)        ≡ s.scrollMarginTop('1.5rem')
   * s.scrollMarginTop.em(2)           ≡ s.scrollMarginTop('2em')      // 当前元素 font-size 的倍数
   * s.scrollMarginTop.vw(50)          ≡ s.scrollMarginTop('50vw')     // 视口宽 1%
   * s.scrollMarginTop.dvw(50)         ≡ s.scrollMarginTop('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollMarginTop.cqw(50)         ≡ s.scrollMarginTop('50cqw')    // container query 容器尺寸
   * s.scrollMarginTop.percent(50)     ≡ s.scrollMarginTop('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollMarginTop('calc(100% - 32px)')
   * s.scrollMarginTop('min(100%, 1200px)')
   * s.scrollMarginTop('max(280px, 50%)')
   * s.scrollMarginTop('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'20px'` `'1rem'` | 可正可负 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |            Safari             |  Edge  | IE  |
   * | :----: | :-----: | :---------------------------: | :----: | :-: |
   * | **69** | **68**  |           **14.1**            | **79** | No  |
   * |        |         | 11 _(scroll-snap-margin-top)_ |        |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-top
   */
  scrollMarginTop: PropCarrier<CssValueOf<'scrollMarginTop'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `auto | <length-percentage>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-block-end
     */
  scrollPaddingBlockEnd: PropFn<CssValueOf<'scrollPaddingBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `auto | <length-percentage>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-block-start
     */
  scrollPaddingBlockStart: PropFn<CssValueOf<'scrollPaddingBlockStart'>>
  /**
   * 滚动容器**底部**的内边距偏移。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动算（一般是 0） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollPaddingBottom`。⚠️ `scrollPaddingBottom` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `scrollPaddingBottom` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollPaddingBottom` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollPaddingBottom` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：固定头部 + snap
   *
   * ```ts
   * // 容器上
   * s.scrollPaddingTop.px(80)           // snap 时为顶部固定头部留 80px
   * // snap 子项对齐时不会贴到容器顶部，而是顶部留出 80px
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollPadding.px(200)         ≡ s.scrollPadding('200px')
   * s.scrollPadding.rem(1.5)        ≡ s.scrollPadding('1.5rem')
   * s.scrollPadding.em(2)           ≡ s.scrollPadding('2em')      // 当前元素 font-size 的倍数
   * s.scrollPadding.vw(50)          ≡ s.scrollPadding('50vw')     // 视口宽 1%
   * s.scrollPadding.dvw(50)         ≡ s.scrollPadding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollPadding.cqw(50)         ≡ s.scrollPadding('50cqw')    // container query 容器尺寸
   * s.scrollPadding.percent(50)     ≡ s.scrollPadding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollPadding('calc(100% - 32px)')
   * s.scrollPadding('min(100%, 1200px)')
   * s.scrollPadding('max(280px, 50%)')
   * s.scrollPadding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `auto` | — | 默认；浏览器自动 |
   * | `<length>` | `'20px'` | 具体长度（不可负） |
   * | `<percentage>` | `'10%'` | 相对容器对应轴尺寸 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **69** | **68**  | **14.1** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-bottom
   */
  scrollPaddingBottom: PropCarrier<CssValueOf<'scrollPaddingBottom'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `auto | <length-percentage>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-inline-end
     */
  scrollPaddingInlineEnd: PropFn<CssValueOf<'scrollPaddingInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `auto | <length-percentage>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-inline-start
     */
  scrollPaddingInlineStart: PropFn<CssValueOf<'scrollPaddingInlineStart'>>
  /**
   * 滚动容器**左侧**的内边距偏移。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动算（一般是 0） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollPaddingLeft`。⚠️ `scrollPaddingLeft` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `scrollPaddingLeft` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollPaddingLeft` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollPaddingLeft` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：固定头部 + snap
   *
   * ```ts
   * // 容器上
   * s.scrollPaddingTop.px(80)           // snap 时为顶部固定头部留 80px
   * // snap 子项对齐时不会贴到容器顶部，而是顶部留出 80px
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollPadding.px(200)         ≡ s.scrollPadding('200px')
   * s.scrollPadding.rem(1.5)        ≡ s.scrollPadding('1.5rem')
   * s.scrollPadding.em(2)           ≡ s.scrollPadding('2em')      // 当前元素 font-size 的倍数
   * s.scrollPadding.vw(50)          ≡ s.scrollPadding('50vw')     // 视口宽 1%
   * s.scrollPadding.dvw(50)         ≡ s.scrollPadding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollPadding.cqw(50)         ≡ s.scrollPadding('50cqw')    // container query 容器尺寸
   * s.scrollPadding.percent(50)     ≡ s.scrollPadding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollPadding('calc(100% - 32px)')
   * s.scrollPadding('min(100%, 1200px)')
   * s.scrollPadding('max(280px, 50%)')
   * s.scrollPadding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `auto` | — | 默认；浏览器自动 |
   * | `<length>` | `'20px'` | 具体长度（不可负） |
   * | `<percentage>` | `'10%'` | 相对容器对应轴尺寸 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **69** | **68**  | **14.1** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-left
   */
  scrollPaddingLeft: PropCarrier<CssValueOf<'scrollPaddingLeft'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * 滚动容器**右侧**的内边距偏移。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动算（一般是 0） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollPaddingRight`。⚠️ `scrollPaddingRight` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `scrollPaddingRight` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollPaddingRight` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollPaddingRight` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：固定头部 + snap
   *
   * ```ts
   * // 容器上
   * s.scrollPaddingTop.px(80)           // snap 时为顶部固定头部留 80px
   * // snap 子项对齐时不会贴到容器顶部，而是顶部留出 80px
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollPadding.px(200)         ≡ s.scrollPadding('200px')
   * s.scrollPadding.rem(1.5)        ≡ s.scrollPadding('1.5rem')
   * s.scrollPadding.em(2)           ≡ s.scrollPadding('2em')      // 当前元素 font-size 的倍数
   * s.scrollPadding.vw(50)          ≡ s.scrollPadding('50vw')     // 视口宽 1%
   * s.scrollPadding.dvw(50)         ≡ s.scrollPadding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollPadding.cqw(50)         ≡ s.scrollPadding('50cqw')    // container query 容器尺寸
   * s.scrollPadding.percent(50)     ≡ s.scrollPadding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollPadding('calc(100% - 32px)')
   * s.scrollPadding('min(100%, 1200px)')
   * s.scrollPadding('max(280px, 50%)')
   * s.scrollPadding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `auto` | — | 默认；浏览器自动 |
   * | `<length>` | `'20px'` | 具体长度（不可负） |
   * | `<percentage>` | `'10%'` | 相对容器对应轴尺寸 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **69** | **68**  | **14.1** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-right
   */
  scrollPaddingRight: PropCarrier<CssValueOf<'scrollPaddingRight'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * 滚动容器**顶部**的内边距偏移。最常用 —— 让出固定头部空间。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动算（一般是 0） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollPaddingTop`。⚠️ `scrollPaddingTop` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `scrollPaddingTop` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollPaddingTop` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollPaddingTop` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：固定头部 + snap
   *
   * ```ts
   * // 容器上
   * s.scrollPaddingTop.px(80)           // snap 时为顶部固定头部留 80px
   * // snap 子项对齐时不会贴到容器顶部，而是顶部留出 80px
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollPadding.px(200)         ≡ s.scrollPadding('200px')
   * s.scrollPadding.rem(1.5)        ≡ s.scrollPadding('1.5rem')
   * s.scrollPadding.em(2)           ≡ s.scrollPadding('2em')      // 当前元素 font-size 的倍数
   * s.scrollPadding.vw(50)          ≡ s.scrollPadding('50vw')     // 视口宽 1%
   * s.scrollPadding.dvw(50)         ≡ s.scrollPadding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollPadding.cqw(50)         ≡ s.scrollPadding('50cqw')    // container query 容器尺寸
   * s.scrollPadding.percent(50)     ≡ s.scrollPadding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollPadding('calc(100% - 32px)')
   * s.scrollPadding('min(100%, 1200px)')
   * s.scrollPadding('max(280px, 50%)')
   * s.scrollPadding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `auto` | — | 默认；浏览器自动 |
   * | `<length>` | `'20px'` | 具体长度（不可负） |
   * | `<percentage>` | `'10%'` | 相对容器对应轴尺寸 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **69** | **68**  | **14.1** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-top
   */
  scrollPaddingTop: PropCarrier<CssValueOf<'scrollPaddingTop'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * 在**滚动项**（snap children）上设置**对齐点** —— 滚动停止时该 item 的哪一边对齐到容器边缘。
   *
   * ## 关键字
   *
   * ### 4 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。该 item 不参与 snap |
   * | `start` | 对齐 item **起点**（左 / 上）到容器对应边缘 |
   * | `end` | 对齐 item **终点**（右 / 下）到容器对应边缘 |
   * | `center` | item **中心**对齐容器中心 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollSnapAlign`。⚠️ `scrollSnapAlign` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `scrollSnapAlign` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollSnapAlign` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollSnapAlign` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 4 个 keyword | `none` ｜ `start` ｜ `end` ｜ `center` | 只接受关键字 |
   * | 两个值（块 / 行内） | `'start end'` | 块方向 / 行内方向 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **69** | **68**  | **11** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-snap-align
   */
  scrollSnapAlign: PropCarrier<CssValueOf<'scrollSnapAlign'>, never, 'none' | 'start' | 'end' | 'center' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |              Safari              |  Edge  | IE  |
     * | :----: | :-----: | :------------------------------: | :----: | :-: |
     * | **69** | **68**  |             **14.1**             | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin-bottom)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-bottom
     */
  scrollSnapMarginBottom: PropFn<CssValueOf<'scrollSnapMarginBottom'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |             Safari             |  Edge  | IE  |
     * | :----: | :-----: | :----------------------------: | :----: | :-: |
     * | **69** | **68**  |            **14.1**            | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin-left)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-left
     */
  scrollSnapMarginLeft: PropFn<CssValueOf<'scrollSnapMarginLeft'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |             Safari              |  Edge  | IE  |
     * | :----: | :-----: | :-----------------------------: | :----: | :-: |
     * | **69** | **68**  |            **14.1**             | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin-right)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-right
     */
  scrollSnapMarginRight: PropFn<CssValueOf<'scrollSnapMarginRight'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |            Safari             |  Edge  | IE  |
     * | :----: | :-----: | :---------------------------: | :----: | :-: |
     * | **69** | **68**  |           **14.1**            | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin-top)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-top
     */
  scrollSnapMarginTop: PropFn<CssValueOf<'scrollSnapMarginTop'>>
  /**
   * 决定滚动是否**必须停在每个 snap point**（不允许快速滑过多个）。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。快速滚动可跳过多个 snap point |
   * | `always` | **必须停**在下一个 snap point（即使用户快速 fling，也只滚 1 个 item） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollSnapStop`。⚠️ `scrollSnapStop` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `scrollSnapStop` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollSnapStop` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollSnapStop` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 全屏 PPT 风滑动：每次只滑 1 屏
   * s.scrollSnapType('y mandatory')
   * s.scrollSnapStop.always
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `normal` ｜ `always` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **75** | **103** | **15** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-snap-stop
   */
  scrollSnapStop: PropCarrier<CssValueOf<'scrollSnapStop'>, never, 'normal' | 'always' | GlobalKw, unknown, never>
  /**
   * 在**滚动容器**上启用**滚动捕捉** —— 滚动结束时自动对齐到子元素。常用于卡片轮播、全屏滑动。
   *
   * ## 关键字
   *
   * ### 基础模式
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无滚动捕捉 |
   * | `x` | 横向轴启用捕捉 |
   * | `y` | 纵向轴启用捕捉 |
   * | `block` | 逻辑块方向（横排文 = y） |
   * | `inline` | 逻辑行内方向（横排文 = x） |
   * | `both` | 两轴都启用 |
   *
   * ### 严格程度
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `mandatory` | **强制对齐**：滚动结束**必须**对齐到某个子元素（即使滚动到中间） |
   * | `proximity` | **邻近时对齐**：仅当滚动结束接近某个 snap point 时才对齐（默认） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollSnapType`。⚠️ `scrollSnapType` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `scrollSnapType` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollSnapType` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollSnapType` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态：方向 + 严格程度
   *
   * ```ts
   * s.scrollSnapType('x mandatory')        // 横轴强制对齐
   * s.scrollSnapType('y proximity')        // 纵轴邻近对齐
   * s.scrollSnapType('both mandatory')     // 双轴
   * ```
   *
   * ### 完整轮播示例
   *
   * ```ts
   * // 容器
   * s.scrollSnapType('x mandatory')
   * s.overflowX.auto
   * s.display.flex
   *
   * // 每个 item
   * s.scrollSnapAlign.start              // 滚动停止时对齐到 item 起点
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 方向 keyword | `none` ｜ `x` ｜ `y` ｜ `block` ｜ `inline` ｜ `both` | 只接受关键字 |
   * | 严格程度 | `mandatory` ｜ `proximity` | 配合方向使用 |
   * | 组合 | `'x mandatory'` `'y proximity'` | 方向 + 严格程度 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |      IE      |
   * | :----: | :-----: | :-----: | :----: | :----------: |
   * | **69** |  39-68  | **11**  | **79** | **10** _-x-_ |
   * |        |         | 9 _-x-_ |        |              |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-snap-type
   */
  scrollSnapType: PropCarrier<CssValueOf<'scrollSnapType'>, never, 'none' | 'x' | 'y' | 'block' | 'inline' | 'both' | 'mandatory' | 'proximity' | GlobalKw, unknown, never>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ block | inline | x | y ]#`
     *
     * **Initial value**: `block`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-timeline-axis
     */
  scrollTimelineAxis: PropFn<CssValueOf<'scrollTimelineAxis'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ none | <dashed-ident> ]#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-timeline-name
     */
  scrollTimelineName: PropFn<CssValueOf<'scrollTimelineName'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | <color>{2}`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **121** | **64**  |   No   | **121** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scrollbar-color
     */
  scrollbarColor: PropFn<CssValueOf<'scrollbarColor'>>
  /**
     * Since December 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto | stable && both-edges?`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **94** | **97**  | **18.2** | **94** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scrollbar-gutter
     */
  scrollbarGutter: PropFn<CssValueOf<'scrollbarGutter'>>
  /**
     * Since December 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto | thin | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **121** | **64**  | **18.2** | **121** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scrollbar-width
     */
  scrollbarWidth: PropFn<CssValueOf<'scrollbarWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<opacity-value>`
     *
     * **Initial value**: `0.0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **37** | **62**  | **10.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/shape-image-threshold
     */
  shapeImageThreshold: PropFn<CssValueOf<'shapeImageThreshold'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<length-percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **37** | **62**  | **10.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/shape-margin
     */
  shapeMargin: PropFn<CssValueOf<'shapeMargin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `none | [ <shape-box> || <basic-shape> ] | <image>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **37** | **62**  | **10.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/shape-outside
     */
  shapeOutside: PropFn<CssValueOf<'shapeOutside'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | optimizeSpeed | crispEdges | geometricPrecision`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **1**  |  **3**  | **4**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/shape-rendering
     */
  shapeRendering: PropFn<CssValueOf<'shapeRendering'>>
  /**
     * **Syntax**: `normal | spell-out || digits || [ literal-punctuation | no-punctuation ]`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  | Edge | IE  |
     * | :----: | :-----: | :------: | :--: | :-: |
     * |   No   |   No    | **11.1** |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/speak-as
     */
  speakAs: PropFn<CssValueOf<'speakAs'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<'color'>`
     *
     * **Initial value**: `black`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stop-color
     */
  stopColor: PropFn<CssValueOf<'stopColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<'opacity'>`
     *
     * **Initial value**: `black`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stop-opacity
     */
  stopOpacity: PropFn<CssValueOf<'stopOpacity'>>
  /**
   * SVG 专属：设置 SVG 图形的**描边颜色**（线条 / 轮廓）。配合 `stroke-width` 控制粗细。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白描边 |
   * | `black` | `#000000` | 纯黑描边 |
   * | `transparent` | `rgba(0,0,0,0)` | 完全透明（等同 `none`） |
   * | `currentColor` | 引用 `color` | icon 风格：描边跟随文字色 |
   *
   * ### SVG 专属
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无描边 |
   * | `context-fill` / `context-stroke` | 在 `<symbol>` 内引用调用元素的 fill/stroke |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `stroke`。⚠️ `stroke` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `stroke` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `stroke` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `stroke` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 配合 strokeWidth / strokeLinecap / strokeLinejoin
   *
   * 完整描边需要四件套：
   *
   * ```ts
   * // SVG 元素
   * s.stroke._primary
   *   .strokeWidth.px(2)
   *   .strokeLinecap.round              // 端点圆角
   *   .strokeLinejoin.round             // 拐角圆角
   * ```
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.stroke._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.stroke._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.stroke._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.stroke._primary.alpha(0.6)         // token + 修饰链
   * s.stroke._primary.darken(0.1)
   * s.stroke._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.stroke._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.stroke.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 常见陷阱
   *
   * - 默认 `stroke: none`（与 `fill: black` 相反）—— 不写 stroke 就没有描边
   * - `stroke-width` 默认 `1px` —— 即使写了 `stroke` 不指定宽度也能看到 1px 细线
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | `none` | — | 无描边（**默认值**） |
   * | `url(#id)` | `'url(#grad)'` | SVG paint server 引用 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge   | IE  |
   * | :----: | :-----: | :----: | :-----: | :-: |
   * | **1**  | **1.5** | **4**  | **≤15** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke
   */
  stroke: ColorPropCarrier<CssValueOf<'stroke'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `transparent`
     *
     * | Chrome | Firefox |  Safari  | Edge | IE  |
     * | :----: | :-----: | :------: | :--: | :-: |
     * |   No   |   No    | **11.1** |  No  | No  |
     */
  strokeColor: PropFn<CssValueOf<'strokeColor'>>
  /**
   * SVG 专属：设置**虚线描边**的模式（实线段长度和间隔长度）。可创建虚线、点状线、复杂图案。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。**实线** |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `strokeDasharray`。⚠️ `strokeDasharray` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `strokeDasharray` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `strokeDasharray` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `strokeDasharray` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态语法
   *
   * ```ts
   * s.strokeDasharray('5')           // 实线 5 + 间隔 5（单值会重复）
   * s.strokeDasharray('10 5')        // 实线 10 + 间隔 5
   * s.strokeDasharray('5 5 2 5')     // 复杂模式：5 实 + 5 空 + 2 实 + 5 空（循环）
   * s.strokeDasharray('1 8')         // 点状线（很短的实段 + 长间隔）
   * ```
   *
   * ### 经典：进度环动画
   *
   * ```ts
   * // 圆周长例如 314.16
   * s.strokeDasharray('314.16')
   * s.strokeDashoffset('157.08')
   * // 显示 50% 进度（offset 让虚线偏移半圈）
   *
   * // 配合 transition 动画 strokeDashoffset 0 → 314.16
   * // 实现"画圆"的进度动画
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | **默认值**，实线 |
   * | 单个数字 / 长度 | `'5'` `'10px'` | 实段 = 间隔 |
   * | 多值（实-空-实-空 ...） | `'10 5'` `'5 5 2 5'` | 循环模式 |
   * | 百分比 | `'10% 5%'` | 相对路径长度 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge   | IE  |
   * | :----: | :-----: | :----: | :-----: | :-: |
   * | **1**  | **1.5** | **4**  | **≤15** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-dasharray
   */
  strokeDasharray: PropCarrier<CssValueOf<'strokeDasharray'>, never, 'none' | GlobalKw, unknown, never>
  /**
   * SVG 专属：设置**虚线描边的起始偏移** —— 让虚线从路径的哪个位置开始。常用于实现"画线 / 进度环"动画。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受 `<length>` / `<percentage>` / 数字，**无关键字**（除全局关键字）` —— undefined
   * - `默认 0；正值让虚线向前偏移（顺路径方向），负值向后` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `strokeDashoffset`。⚠️ `strokeDashoffset` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `strokeDashoffset` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `strokeDashoffset` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `strokeDashoffset` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 经典：进度环动画
   *
   * 完整实现步骤：
   *
   * ```ts
   * // 1. 准备一个 SVG 圆，例如 r=50 → 周长 = 2πr ≈ 314.16
   *
   * // 2. 设 strokeDasharray = 路径总长（让虚线 = 整圈）
   * s.strokeDasharray('314.16')
   *
   * // 3. strokeDashoffset 控制偏移：314.16 = 完全隐藏，0 = 完整显示
   * s.strokeDashoffset('314.16')          // 起始 0%
   * // 动画到 0 → 100%
   *
   * // 4. 加上 transition 即可流畅
   * s.transition('stroke-dashoffset 1s ease-out')
   * ```
   *
   * ### 路径长度
   *
   * 可用 JS `path.getTotalLength()` 获取任意 path 的精确长度。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.strokeDashoffset.px(200)         ≡ s.strokeDashoffset('200px')
   * s.strokeDashoffset.rem(1.5)        ≡ s.strokeDashoffset('1.5rem')
   * s.strokeDashoffset.em(2)           ≡ s.strokeDashoffset('2em')      // 当前元素 font-size 的倍数
   * s.strokeDashoffset.vw(50)          ≡ s.strokeDashoffset('50vw')     // 视口宽 1%
   * s.strokeDashoffset.dvw(50)         ≡ s.strokeDashoffset('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.strokeDashoffset.cqw(50)         ≡ s.strokeDashoffset('50cqw')    // container query 容器尺寸
   * s.strokeDashoffset.percent(50)     ≡ s.strokeDashoffset('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.strokeDashoffset('calc(100% - 32px)')
   * s.strokeDashoffset('min(100%, 1200px)')
   * s.strokeDashoffset('max(280px, 50%)')
   * s.strokeDashoffset('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'10px'` | 具体长度 |
   * | `<number>` | `50` `-20` | 可正可负 |
   * | `<percentage>` | `'50%'` | 相对路径总长 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge   | IE  |
   * | :----: | :-----: | :----: | :-----: | :-: |
   * | **1**  | **1.5** | **4**  | **≤15** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-dashoffset
   */
  strokeDashoffset: PropCarrier<CssValueOf<'strokeDashoffset'>, never, GlobalKw, LengthUnits, never>
  /**
   * SVG 专属：决定**描边线段端点**的形状（直角 / 圆角 / 方块延伸）。
   *
   * ## 关键字
   *
   * ### 3 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `butt` | **默认值**。**直角**端点（线段在端点处直接截断） |
   * | `round` | **圆角**端点（端点处加一个半圆，半径 = strokeWidth/2）—— 让线条看起来更柔和 |
   * | `square` | **方角**端点（端点处加一个矩形延伸出去，长度 = strokeWidth/2） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `strokeLinecap`。⚠️ `strokeLinecap` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `butt` |
   * | `unset` | `strokeLinecap` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `strokeLinecap` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `strokeLinecap` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 视觉对比
   *
   * ```
   * butt（默认）:   ━━━━━━━━━━━     端点齐刷刷截断
   * round:          ●━━━━━━━━━━●   端点圆滑
   * square:         ┃━━━━━━━━━━┃   端点方块延伸（实际线条略长 strokeWidth）
   * ```
   *
   * ### 用例
   *
   * ```ts
   * // 现代图标库标配（柔和外观）
   * s.strokeLinecap.round
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 3 个 keyword | `butt` ｜ `round` ｜ `square` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `butt`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge   | IE  |
   * | :----: | :-----: | :----: | :-----: | :-: |
   * | **1**  | **1.5** | **4**  | **≤15** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-linecap
   */
  strokeLinecap: PropCarrier<CssValueOf<'strokeLinecap'>, never, 'butt' | 'round' | 'square' | GlobalKw, unknown, never>
  /**
   * SVG 专属：决定**描边拐角**的形状（尖角 / 圆角 / 斜切 / 弧形）。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `miter` | **默认值**。**尖角**（两边延伸出尖角） |
   * | `round` | **圆角**拐角（用圆弧平滑过渡）—— 现代图标库标配 |
   * | `bevel` | **斜切**拐角（两边相交处用直线连接，砍掉尖角） |
   * | `arcs` | **弧形**拐角（CSS 4，类似 round 但用圆弧填充更平滑） |
   * | `miterClip` | 类似 miter 但超出 `stroke-miterlimit` 时截断（CSS 4） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `strokeLinejoin`。⚠️ `strokeLinejoin` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `miter` |
   * | `unset` | `strokeLinejoin` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `strokeLinejoin` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `strokeLinejoin` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 视觉对比
   *
   * ```
   * miter（默认）:    ╱ ╲     尖角
   *                   ▲
   *
   * round:            ╱ ╲     圆角
   *                   ⌒
   *
   * bevel:            ╱ ╲     斜切
   *                   ─
   *
   * arcs:             ╱ ╲     弧形
   *                   ⌣
   * ```
   *
   * ### 用例
   *
   * ```ts
   * // Material Design / Feather Icons 风格
   * s.strokeLinecap.round
   * s.strokeLinejoin.round
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个 keyword | `miter` ｜ `round` ｜ `bevel` ｜ `arcs` ｜ `miterClip` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `miter`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge   | IE  |
   * | :----: | :-----: | :----: | :-----: | :-: |
   * | **1**  | **1.5** | **4**  | **≤15** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-linejoin
   */
  strokeLinejoin: PropCarrier<CssValueOf<'strokeLinejoin'>, never, 'miter' | 'round' | 'bevel' | 'arcs' | 'miterClip' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `4`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  | **1.5** | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-miterlimit
     */
  strokeMiterlimit: PropFn<CssValueOf<'strokeMiterlimit'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<'opacity'>`
     *
     * **Initial value**: `1`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  | **1.5** | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-opacity
     */
  strokeOpacity: PropFn<CssValueOf<'strokeOpacity'>>
  /**
   * SVG 专属：设置图形**描边的粗细**。仅在 SVG 元素（`<path>` / `<circle>` 等）上生效。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受 `<length>` / `<percentage>` / 数字，**无关键字**（除全局关键字）` —— undefined
   * - `SVG 中 `stroke-width: 1` 不带单位即可（=1 用户坐标单位）` —— undefined
   * - `默认值 = `1`（SVG 默认）` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `strokeWidth`。⚠️ `strokeWidth` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `1` |
   * | `unset` | `strokeWidth` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `strokeWidth` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `strokeWidth` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.stroke._primary
   * s.strokeWidth.px(2)            // 2px 描边
   * s.strokeWidth(0.5)                             // 0.5 用户坐标单位
   * ```
   *
   * ### 描边四件套
   *
   * 完整描边样式：
   *
   * ```ts
   * s.stroke._primary
   *   .strokeWidth.px(2)
   *   .strokeLinecap.round        // 端点圆角
   *   .strokeLinejoin.round       // 拐角圆角
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.strokeWidth.px(200)         ≡ s.strokeWidth('200px')
   * s.strokeWidth.rem(1.5)        ≡ s.strokeWidth('1.5rem')
   * s.strokeWidth.em(2)           ≡ s.strokeWidth('2em')      // 当前元素 font-size 的倍数
   * s.strokeWidth.vw(50)          ≡ s.strokeWidth('50vw')     // 视口宽 1%
   * s.strokeWidth.dvw(50)         ≡ s.strokeWidth('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.strokeWidth.cqw(50)         ≡ s.strokeWidth('50cqw')    // container query 容器尺寸
   * s.strokeWidth.percent(50)     ≡ s.strokeWidth('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.strokeWidth('calc(100% - 32px)')
   * s.strokeWidth('min(100%, 1200px)')
   * s.strokeWidth('max(280px, 50%)')
   * s.strokeWidth('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'2px'` `'0.5em'` | 具体长度 |
   * | `<number>` | `1` `0.5` `2` | 数字（用户坐标单位） |
   * | `<percentage>` | `'50%'` | 相对 viewBox 对角线 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `1`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge   | IE  |
   * | :----: | :-----: | :----: | :-----: | :-: |
   * | **1**  | **1.5** | **4**  | **≤15** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-width
   */
  strokeWidth: PropCarrier<CssValueOf<'strokeWidth'>, BordersTokens<T>, GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since August 2021.
     *
     * **Syntax**: `<integer> | <length>`
     *
     * **Initial value**: `8`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **21** | **91**  | **7**  | **79** | No  |
     * |        | 4 _-x-_ |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/tab-size
     */
  tabSize: PropFn<CssValueOf<'tabSize'>>
  /**
   * 决定 `<table>` 列宽**算法**。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器读完全部内容后**自适应**列宽（慢，但灵活） |
   * | `fixed` | **首行决定**所有列宽（快）；超出内容截断或换行，不影响列宽 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `tableLayout`。⚠️ `tableLayout` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `tableLayout` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `tableLayout` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `tableLayout` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.tableLayout.fixed
   * s.width('100%')
   * // 大表格性能优化：跳过列宽计算，按首行/colgroup 设的宽
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `auto` ｜ `fixed` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **14** |  **1**  | **1**  | **12** | **5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/table-layout
   */
  tableLayout: PropCarrier<CssValueOf<'tableLayout'>, never, 'auto' | 'fixed' | GlobalKw, unknown, never>
  /**
   * 设置文本**水平对齐方式** —— 左对齐、居中、右对齐、两端对齐等。
   *
   * ## 关键字
   *
   * ### 8 个对齐 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `start` | **默认值**。文字方向起点对齐（LTR = 左对齐，RTL = 右对齐） |
   * | `end` | 文字方向终点对齐 |
   * | `left` | **强制左**对齐（不依赖书写方向） |
   * | `right` | **强制右**对齐 |
   * | `center` | **水平居中** |
   * | `justify` | **两端对齐**：通过调整单词间距让每行齐平左右边界（最后一行除外）；中文效果不佳 |
   * | `matchParent` | 与父元素的 `text-align` **相同**（解决 `start`/`end` 继承时的方向问题） |
   * | `justifyAll` | **所有行**都两端对齐（包括最后一行；实验性） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `textAlign`。⚠️ `textAlign` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `start` |
   * | `unset` | `textAlign` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `textAlign` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `textAlign` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### justify 的中文场景
   *
   * 中文没有显著的单词空格，`justify` 会拉大字符间距，效果常常不佳。
   *
   * 更好的方案：
   * ```ts
   * s.textAlign.justify
   *   .textJustify('inter-character')   // 强制按字符调整（CSS 3，浏览器支持不一）
   * ```
   *
   * ### 用例
   *
   * ```ts
   * s.textAlign.center                // 居中
   * s.textAlign.right                 // 右对齐
   * s.textAlign.justify               // 两端对齐（书籍 / 报纸风格）
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 8 个对齐 keyword | `start` ｜ `end` ｜ `left` ｜ `right` ｜ `center` ｜ `justify` ｜ `matchParent` ｜ `justifyAll` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `start`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **3** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-align
   */
  textAlign: PropCarrier<CssValueOf<'textAlign'>, never, 'left' | 'right' | 'center' | 'justify' | 'start' | 'end' | 'matchParent' | 'justifyAll' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `auto | start | end | left | right | center | justify`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **47** | **49**  | **16** | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-align-last
     */
  textAlignLast: PropFn<CssValueOf<'textAlignLast'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since August 2016.
     *
     * **Syntax**: `start | middle | end`
     *
     * **Initial value**: `start`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤14** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-anchor
     */
  textAnchor: PropFn<CssValueOf<'textAnchor'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | <autospace> | auto`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **140** | **145** | **18.4** | **140** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-autospace
     */
  textAutospace: PropFn<CssValueOf<'textAutospace'>>
  /**
     * **Syntax**: `normal | <'text-box-trim'> || <'text-box-edge'>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **133** |   No    | **18.2** | **133** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-box
     */
  textBox: PropFn<CssValueOf<'textBox'>>
  /**
     * **Syntax**: `auto | <text-edge>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **133** |   No    | **18.2** | **133** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-box-edge
     */
  textBoxEdge: PropFn<CssValueOf<'textBoxEdge'>>
  /**
     * **Syntax**: `none | trim-start | trim-end | trim-both`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **133** |   No    | **18.2** | **133** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-box-trim
     */
  textBoxTrim: PropFn<CssValueOf<'textBoxTrim'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | all | [ digits <integer>? ]`
     *
     * **Initial value**: `none`
     *
     * |           Chrome           | Firefox |            Safari            |  Edge  |                   IE                   |
     * | :------------------------: | :-----: | :--------------------------: | :----: | :------------------------------------: |
     * |           **48**           | **48**  |           **15.4**           | **79** | **11** _(-ms-text-combine-horizontal)_ |
     * | 9 _(-webkit-text-combine)_ |         | 5.1 _(-webkit-text-combine)_ |        |                                        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-combine-upright
     */
  textCombineUpright: PropFn<CssValueOf<'textCombineUpright'>>
  /**
   * 设置**文本装饰线**（下划线 / 删除线 / 上划线）的颜色。未设置时跟随 `color`。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白 |
   * | `black` | `#000000` | 纯黑 |
   * | `transparent` | `rgba(0,0,0,0)` | 隐藏装饰线（但仍占位） |
   * | `currentColor` | **默认值**，跟随 `color` | 装饰线跟随文字色（最常用） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `textDecorationColor`。⚠️ `textDecorationColor` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `currentColor` |
   * | `unset` | `textDecorationColor` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `textDecorationColor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `textDecorationColor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 配合 textDecorationLine / textDecorationStyle
   *
   * 需要先开启装饰线（`textDecorationLine.underline` 等）才能看到颜色生效：
   *
   * ```ts
   * s.textDecorationLine.underline
   *   .textDecorationStyle.wavy
   *   .textDecorationColor._danger    // 红色波浪下划线（错误提示常用）
   * ```
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.textDecorationColor._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.textDecorationColor._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.textDecorationColor._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.textDecorationColor._primary.alpha(0.6)         // token + 修饰链
   * s.textDecorationColor._primary.darken(0.1)
   * s.textDecorationColor._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.textDecorationColor._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.textDecorationColor.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `currentColor`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **57** | **36**  | **12.1** | **79** | No  |
   * |        |         | 8 _-x-_  |        |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration-color
   */
  textDecorationColor: ColorPropCarrier<CssValueOf<'textDecorationColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
   * 设置**文本装饰线**的类型（下划线 / 删除线 / 上划线 / 拼写错误）。可多选叠加。
   *
   * ## 关键字
   *
   * ### 6 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无装饰线 |
   * | `underline` | **下划线**（最常用） |
   * | `overline` | **上划线**（少用） |
   * | `lineThrough` | **删除线**（穿过文字中部） |
   * | `spellingError` | 拼写错误标记（浏览器原生 typo 红波浪线样式） |
   * | `grammarError` | 语法错误标记（浏览器原生绿波浪线样式） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `textDecorationLine`。⚠️ `textDecorationLine` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `textDecorationLine` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `textDecorationLine` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `textDecorationLine` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态可叠加多个
   *
   * ```ts
   * s.textDecorationLine('underline lineThrough')      // 同时下划线 + 删除线
   * ```
   *
   * ### 配合其他装饰属性
   *
   * 完整装饰线写法：
   *
   * ```ts
   * s.textDecorationLine.underline
   *   .textDecorationStyle.wavy             // 样式
   *   .textDecorationColor._danger          // 颜色
   *   .textDecorationThickness.px(2)        // 粗细
   * ```
   *
   * 或简写：`s.textDecoration('underline wavy red 2px')`
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 6 个 keyword | `none` ｜ `underline` ｜ `overline` ｜ `lineThrough` ｜ `spellingError` ｜ `grammarError` | 可叠加 |
   * | 多个叠加 | `'underline lineThrough'` | 空格分隔多个 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **57** | **36**  | **12.1** | **79** | No  |
   * |        |         | 8 _-x-_  |        |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration-line
   */
  textDecorationLine: PropCarrier<CssValueOf<'textDecorationLine'>, never, 'none' | 'underline' | 'overline' | 'lineThrough' | 'spellingError' | 'grammarError' | GlobalKw, unknown, never>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | [ objects || [ spaces | [ leading-spaces || trailing-spaces ] ] || edges || box-decoration ]`
     *
     * **Initial value**: `objects`
     *
     * | Chrome | Firefox |  Safari  | Edge | IE  |
     * | :----: | :-----: | :------: | :--: | :-: |
     * | 57-64  |   No    | **12.1** |  No  | No  |
     * |        |         | 7 _-x-_  |      |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration-skip
     */
  textDecorationSkip: PropFn<CssValueOf<'textDecorationSkip'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `auto | all | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **64** | **70**  | **15.4** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration-skip-ink
     */
  textDecorationSkipInk: PropFn<CssValueOf<'textDecorationSkipInk'>>
  /**
   * 设置文本装饰线的**样式**（实线 / 虚线 / 双线 / 波浪线）。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `solid` | **默认值**。实线 |
   * | `double` | 双线 |
   * | `dotted` | 点状虚线 |
   * | `dashed` | 虚线 |
   * | `wavy` | 波浪线（常用于拼写错误提示样式） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `textDecorationStyle`。⚠️ `textDecorationStyle` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `solid` |
   * | `unset` | `textDecorationStyle` 非继承属性 → 等同 `initial`（= `solid`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `textDecorationStyle` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `textDecorationStyle` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个 keyword | `solid` ｜ `double` ｜ `dotted` ｜ `dashed` ｜ `wavy` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `solid`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **57** | **36**  | **12.1** | **79** | No  |
   * |        |         | 8 _-x-_  |        |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration-style
   */
  textDecorationStyle: PropCarrier<CssValueOf<'textDecorationStyle'>, never, 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | GlobalKw, unknown, never>
  /**
   * 设置文本装饰线的**粗细**。可精细控制下划线 / 删除线粗细。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动选（按字号 / 字体） |
   * | `fromFont` | 使用字体文件中**内置**的下划线粗细（如果字体有此元数据） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `textDecorationThickness`。⚠️ `textDecorationThickness` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `textDecorationThickness` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `textDecorationThickness` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `textDecorationThickness` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.textDecorationLine.underline
   * s.textDecorationThickness.px(2)
   * // 2px 粗下划线（无视字号）
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.textDecorationThickness.px(200)         ≡ s.textDecorationThickness('200px')
   * s.textDecorationThickness.rem(1.5)        ≡ s.textDecorationThickness('1.5rem')
   * s.textDecorationThickness.em(2)           ≡ s.textDecorationThickness('2em')      // 当前元素 font-size 的倍数
   * s.textDecorationThickness.vw(50)          ≡ s.textDecorationThickness('50vw')     // 视口宽 1%
   * s.textDecorationThickness.dvw(50)         ≡ s.textDecorationThickness('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.textDecorationThickness.cqw(50)         ≡ s.textDecorationThickness('50cqw')    // container query 容器尺寸
   * s.textDecorationThickness.percent(50)     ≡ s.textDecorationThickness('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.textDecorationThickness('calc(100% - 32px)')
   * s.textDecorationThickness('min(100%, 1200px)')
   * s.textDecorationThickness('max(280px, 50%)')
   * s.textDecorationThickness('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'2px'` `'0.1em'` | 具体长度 |
   * | `<percentage>` | `'10%'` | 相对字号 |
   * | `auto` | — | 默认；浏览器自动 |
   * | `fromFont` | — | 使用字体内置的下划线粗细 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **89** | **70**  | **12.1** | **89** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration-thickness
   */
  textDecorationThickness: PropCarrier<CssValueOf<'textDecorationThickness'>, never, 'auto' | 'fromFont' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     *
     * |  Chrome  | Firefox | Safari |   Edge   | IE  |
     * | :------: | :-----: | :----: | :------: | :-: |
     * |  **99**  | **46**  | **7**  |  **99**  | No  |
     * | 25 _-x-_ |         |        | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-emphasis-color
     */
  textEmphasisColor: PropFn<CssValueOf<'textEmphasisColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `auto | [ over | under ] && [ right | left ]?`
     *
     * **Initial value**: `auto`
     *
     * |  Chrome  | Firefox | Safari |   Edge   | IE  |
     * | :------: | :-----: | :----: | :------: | :-: |
     * |  **99**  | **46**  | **7**  |  **99**  | No  |
     * | 25 _-x-_ |         |        | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-emphasis-position
     */
  textEmphasisPosition: PropFn<CssValueOf<'textEmphasisPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ] | <string>`
     *
     * **Initial value**: `none`
     *
     * |  Chrome  | Firefox | Safari |   Edge   | IE  |
     * | :------: | :-----: | :----: | :------: | :-: |
     * |  **99**  | **46**  | **7**  |  **99**  | No  |
     * | 25 _-x-_ |         |        | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-emphasis-style
     */
  textEmphasisStyle: PropFn<CssValueOf<'textEmphasisStyle'>>
  /**
   * 设置**首行缩进** —— 段落第一行的左侧（或 LTR/RTL 起点侧）额外缩进。中文排版常用 2 字符。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度 / 百分比，**无 CSS 关键字**（除全局关键字）` —— undefined
   * - `百分比相对**包含块宽度**` —— undefined
   * - `可为**负值**（首行外凸缩进，悬挂效果）` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `textIndent`。⚠️ `textIndent` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `textIndent` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `textIndent` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `textIndent` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 中文典型用法
   *
   * ```ts
   * s.textIndent.em(2)              // 首行缩进 2 字符（最常用）
   * ```
   *
   * ### 悬挂缩进（hanging indent）
   *
   * ```ts
   * s.textIndent.em(-2)
   * s.paddingLeft.em(2)
   * // 首行外凸 2 字符，配合 padding-left 让首行齐左边，其他行向右缩进
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.textIndent.px(200)         ≡ s.textIndent('200px')
   * s.textIndent.rem(1.5)        ≡ s.textIndent('1.5rem')
   * s.textIndent.em(2)           ≡ s.textIndent('2em')      // 当前元素 font-size 的倍数
   * s.textIndent.vw(50)          ≡ s.textIndent('50vw')     // 视口宽 1%
   * s.textIndent.dvw(50)         ≡ s.textIndent('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.textIndent.cqw(50)         ≡ s.textIndent('50cqw')    // container query 容器尺寸
   * s.textIndent.percent(50)     ≡ s.textIndent('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.textIndent('calc(100% - 32px)')
   * s.textIndent('min(100%, 1200px)')
   * s.textIndent('max(280px, 50%)')
   * s.textIndent('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'2em'` `'32px'` | 可正可负 |
   * | `<percentage>` | `'10%'` | 相对包含块宽度 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **3** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-indent
   */
  textIndent: PropCarrier<CssValueOf<'textIndent'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | inter-character | inter-word | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari | Edge  |   IE   |
     * | :----: | :-----: | :----: | :---: | :----: |
     * |   No   | **55**  |   No   | 12-79 | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-justify
     */
  textJustify: PropFn<CssValueOf<'textJustify'>>
  /**
   * 在竖排书写（`writingMode: verticalRl/verticalLr`）时，控制单个**字符的朝向**。
   *
   * ## 关键字
   *
   * ### 3 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `mixed` | **默认值**。CJK 字符正立，西文字符侧躺 |
   * | `upright` | **所有字符都正立**（西文字符也正立，每字单独一行） |
   * | `sideways` | **所有字符侧躺**（变成 90° 旋转的横排） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `textOrientation`。⚠️ `textOrientation` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `mixed` |
   * | `unset` | `textOrientation` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `textOrientation` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `textOrientation` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 3 个 keyword | `mixed` ｜ `upright` ｜ `sideways` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `mixed`
   *
   * ### 浏览器
   *
   * |  Chrome  | Firefox |  Safari   |  Edge  | IE  |
   * | :------: | :-----: | :-------: | :----: | :-: |
   * |  **48**  | **41**  |  **14**   | **79** | No  |
   * | 12 _-x-_ |         | 5.1 _-x-_ |        |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-orientation
   */
  textOrientation: PropCarrier<CssValueOf<'textOrientation'>, never, 'mixed' | 'upright' | 'sideways' | GlobalKw, unknown, never>
  /**
   * 决定**溢出文本**的处理方式（截断或省略号）。需配合 `overflow: hidden` + `whiteSpace: nowrap`（或 line-clamp）才生效。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `clip` | **默认值**。直接裁剪（在字符中间也会切） |
   * | `ellipsis` | **省略号**显示溢出（…），最常用 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `textOverflow`。⚠️ `textOverflow` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `clip` |
   * | `unset` | `textOverflow` 非继承属性 → 等同 `initial`（= `clip`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `textOverflow` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `textOverflow` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 单行省略
   *
   * ```ts
   * s.whiteSpace.nowrap          // 不换行
   *   .overflow.hidden           // 溢出裁剪
   *   .textOverflow.ellipsis     // 显示省略号
   * ```
   *
   * ### 多行省略
   *
   * 需 CSS line-clamp（不属于 textOverflow）：
   *
   * ```ts
   * s.display('-webkit-box')
   *   .webkitBoxOrient('vertical')
   *   .webkitLineClamp(2)         // 2 行后省略
   *   .overflow.hidden
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 2 个 keyword | `clip` ｜ `ellipsis` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `clip`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |  IE   |
   * | :----: | :-----: | :-----: | :----: | :---: |
   * | **1**  |  **7**  | **1.3** | **12** | **6** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-overflow
   */
  textOverflow: PropCarrier<CssValueOf<'textOverflow'>, never, 'clip' | 'ellipsis' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | optimizeSpeed | optimizeLegibility | geometricPrecision`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **4**  |  **1**  | **5**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-rendering
     */
  textRendering: PropFn<CssValueOf<'textRendering'>>
  /**
   * 给**文字**添加阴影。比 `boxShadow` 简化，**无 `spread`，无 `inset`**。可叠加多组。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无文字阴影 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `textShadow`。⚠️ `textShadow` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `textShadow` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `textShadow` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `textShadow` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态语法
   *
   * `textShadow: <offsetX> <offsetY> <blur>? <color>?`
   *
   * 参数同 `boxShadow` 但**无 spread、无 inset**。
   *
   * ### 经典用法
   *
   * ```ts
   * // 文字浮起感
   * s.textShadow('0 1px 2px rgba(0,0,0,0.3)')
   *
   * // 多方向描边
   * s.textShadow(`
   *   -1px -1px 0 #fff,
   *    1px -1px 0 #fff,
   *   -1px  1px 0 #fff,
   *    1px  1px 0 #fff
   * `)
   *
   * // 霓虹光效
   * s.textShadow(`
   *   0 0 6px #fff,
   *   0 0 12px #ff00ff,
   *   0 0 24px #ff00ff
   * `)
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | **默认值** |
   * | 单组阴影 | `'1px 1px 2px #0008'` | offsetX offsetY blur color |
   * | 多组叠加 | `'1px 1px 0 #fff, -1px -1px 0 #fff'` | 逗号分隔实现描边等效果 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |   IE   |
   * | :----: | :-----: | :-----: | :----: | :----: |
   * | **2**  | **3.5** | **1.1** | **12** | **10** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-shadow
   */
  textShadow: PropCarrier<CssValueOf<'textShadow'>, ShadowTokens<T>, 'none' | GlobalKw, unknown, never>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | auto | <percentage>`
     *
     * **Initial value**: `auto` for smartphone browsers supporting inflation, `none` in other cases (and then not modifiable).
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **54** |   No    |   No   | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-size-adjust
     */
  textSizeAdjust: PropFn<CssValueOf<'textSizeAdjust'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `space-all | normal | space-first | trim-start`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **123** |   No    |   No   | **123** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-spacing-trim
     */
  textSpacingTrim: PropFn<CssValueOf<'textSpacingTrim'>>
  /**
   * 控制文字的**大小写转换** / 全角半角转换（不修改 DOM，仅显示层变换）。
   *
   * ## 关键字
   *
   * ### 7 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不变换 |
   * | `capitalize` | 每个单词**首字母大写**（按 Unicode 词边界） |
   * | `uppercase` | **全部大写** |
   * | `lowercase` | **全部小写** |
   * | `fullWidth` | 转**全角**字符（半角→全角，CJK 排版用） |
   * | `fullSizeKana` | 日文小写假名→大写假名（罕用） |
   * | `mathAuto` | 数学公式自动样式（CSS Math，实验性） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `textTransform`。⚠️ `textTransform` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `textTransform` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `textTransform` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `textTransform` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.textTransform.uppercase            // HELLO WORLD
   * s.textTransform.capitalize           // Hello World
   * ```
   *
   * ### a11y 注意
   *
   * `textTransform: uppercase` 不修改 DOM —— 屏幕阅读器仍按原文朗读，对全大写英文阅读体验更好。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 7 个 keyword | `none` ｜ `capitalize` ｜ `uppercase` ｜ `lowercase` ｜ `fullWidth` ｜ `fullSizeKana` ｜ `mathAuto` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-transform
   */
  textTransform: PropCarrier<CssValueOf<'textTransform'>, never, 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'fullWidth' | 'fullSizeKana' | 'mathAuto' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since November 2020.
     *
     * **Syntax**: `auto | <length> | <percentage> `
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **70**  | **12.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-underline-offset
     */
  textUnderlineOffset: PropFn<CssValueOf<'textUnderlineOffset'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `auto | from-font | [ under || [ left | right ] ]`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :------: | :----: | :---: |
     * | **33** | **74**  | **12.1** | **12** | **6** |
     * |        |         | 9 _-x-_  |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-underline-position
     */
  textUnderlinePosition: PropFn<CssValueOf<'textUnderlinePosition'>>
  /**
     * Since October 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `wrap | nowrap`
     *
     * **Initial value**: `wrap`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **130** | **124** | **17.4** | **130** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-wrap-mode
     */
  textWrapMode: PropFn<CssValueOf<'textWrapMode'>>
  /**
     * Since October 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto | balance | stable | pretty`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **130** | **124** | **17.5** | **130** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-wrap-style
     */
  textWrapStyle: PropFn<CssValueOf<'textWrapStyle'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <dashed-ident>#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **116** |   No    | **26** | **116** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/timeline-scope
     */
  timelineScope: PropFn<CssValueOf<'timelineScope'>>
  /**
   * 设置定位元素距**顶部**的偏移量。正值向下移，负值向上移。**只在 `position` 非 `static` 时生效**。其他规则同 [`inset`]。
   *
   * ## 关键字
   *
   * ### 1 个偏移关键字
   *
   * | 关键字 | 效果 | 说明 |
   * | --- | --- | --- |
   * | `auto` | **默认值**。不参与定位，交由浏览器按正常文档流决定位置 | 未定位元素（`position: static`）的默认状态；也用于取消之前设过的偏移 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `top`。⚠️ `top` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `top` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `top` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `top` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### ⚠️ 必须配合 position: relative/absolute/fixed/sticky 才生效
   *
   * `top` / `right` / `bottom` / `left`（以及 `inset`）对 `position: static`（默认值）的元素**无效**。
   *
   * ### 简写语法（与 margin/padding 相同的 1/2/3/4 值规则）
   *
   * ```ts
   * s.inset.px(0)                     // 四边均偏移 0（常用于绝对定位充满父容器）
   * s.inset('0 16px')                 // 上下 0，左右 16px
   * s.inset('8px 16px 24px 32px')     // 上 右 下 左（顺时针）
   * ```
   *
   * ### 偏移基准（四种定位各不同）
   *
   * | position | 偏移基准 |
   * | --- | --- |
   * | `relative` | **元素原始位置**（偏移后原位仍占空间） |
   * | `absolute` | **最近的定位祖先**（position 非 static 的祖先）的 padding-box 边缘 |
   * | `fixed` | **视口**（viewport）边缘（⚠️ 祖先有 `transform` / `will-change: transform` / `filter` 时变为祖先 padding-box） |
   * | `sticky` | 正常文档流位置（偏移值 = 粘住后距视口边缘的距离） |
   *
   * ### 绝对定位充满父容器
   *
   * ```ts
   * s.position.absolute
   * s.inset.px(0)   // 等同 top:0 right:0 bottom:0 left:0
   * // 前提：父容器 position 不是 static
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.inset.px(200)         ≡ s.inset('200px')
   * s.inset.rem(1.5)        ≡ s.inset('1.5rem')
   * s.inset.em(2)           ≡ s.inset('2em')      // 当前元素 font-size 的倍数
   * s.inset.vw(50)          ≡ s.inset('50vw')     // 视口宽 1%
   * s.inset.dvw(50)         ≡ s.inset('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.inset.cqw(50)         ≡ s.inset('50cqw')    // container query 容器尺寸
   * s.inset.percent(50)     ≡ s.inset('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.inset('calc(100% - 32px)')
   * s.inset('min(100%, 1200px)')
   * s.inset('max(280px, 50%)')
   * s.inset('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | — | **默认值**；不偏移，由文档流决定位置 |
   * | 多值简写 | `'0 16px'` `'8px 16px 24px 32px'` | 1/2/3/4 个值，顺时针分配到四边 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/top
   */
  top: PropCarrier<CssValueOf<'top'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * 决定**触摸操作**（移动端）哪些动作由浏览器默认处理（滚动 / 缩放）、哪些被 JS 接管。常用于绘图 / 拖拽组件禁用浏览器手势。
   *
   * ## 关键字
   *
   * ### 10 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器接管所有手势（双指缩放 / 滑动滚动等） |
   * | `none` | **禁用所有触摸手势** —— 所有触摸事件由 JS 处理（绘图板必备） |
   * | `panX` | 仅允许浏览器处理**水平**滚动手势 |
   * | `panY` | 仅允许浏览器处理**垂直**滚动手势（最常用 —— 让 JS 接管横滑用作 Carousel） |
   * | `panLeft` | 仅允许**向左**滑动 |
   * | `panRight` | 仅允许**向右**滑动 |
   * | `panUp` | 仅允许**向上**滑动 |
   * | `panDown` | 仅允许**向下**滑动 |
   * | `pinchZoom` | 仅允许双指缩放（其他手势由 JS 处理） |
   * | `manipulation` | 允许 pan + zoom，**禁用双击缩放** —— 让按钮点击响应更快（移除 300ms 等待双击的延迟） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `touchAction`。⚠️ `touchAction` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `touchAction` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `touchAction` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `touchAction` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 经典用例
   *
   * ```ts
   * // 横向 Carousel：让浏览器处理纵向滚动，横向手势让 JS 处理
   * s.touchAction.panY
   *
   * // 绘图板：禁用所有触摸默认行为
   * s.touchAction.none
   *
   * // 按钮：消除 300ms 双击缩放延迟（旧 iOS 兼容）
   * s.touchAction.manipulation
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 10 个 keyword | `auto` ｜ `none` ｜ `panX` ｜ `panY` ｜ `panLeft` ｜ `panRight` ｜ `panUp` ｜ `panDown` ｜ `pinchZoom` ｜ `manipulation` | 只接受关键字 |
   * | 多个组合 | `'pan-y pinch-zoom'` | 空格分隔允许多种手势 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |    IE    |
   * | :----: | :-----: | :----: | :----: | :------: |
   * | **36** | **52**  | **13** | **12** |  **11**  |
   * |        |         |        |        | 10 _-x-_ |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/touch-action
   */
  touchAction: PropCarrier<CssValueOf<'touchAction'>, never, 'auto' | 'none' | 'panX' | 'panY' | 'panLeft' | 'panRight' | 'panUp' | 'panDown' | 'pinchZoom' | 'manipulation' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <transform-list>`
     *
     * **Initial value**: `none`
     *
     * | Chrome  |  Firefox  |  Safari   |  Edge  |   IE    |
     * | :-----: | :-------: | :-------: | :----: | :-----: |
     * | **36**  |  **16**   |   **9**   | **12** | **10**  |
     * | 1 _-x-_ | 3.5 _-x-_ | 3.1 _-x-_ |        | 9 _-x-_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transform
     */
  transform: PropFn<CssValueOf<'transform'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `content-box | border-box | fill-box | stroke-box | view-box`
     *
     * **Initial value**: `view-box`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **64** | **55**  | **11** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transform-box
     */
  transformBox: PropFn<CssValueOf<'transformBox'>>
  /**
   * 设置 `transform` 变换的**原点位置** —— 旋转/缩放围绕哪个点进行。默认元素中心 (50% 50%)。
   *
   * ## 关键字
   *
   * ### 5 个位置关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `top` | 上侧（= `50% 0%`） |
   * | `bottom` | 下侧（= `50% 100%`） |
   * | `left` | 左侧（= `0% 50%`） |
   * | `right` | 右侧（= `100% 50%`） |
   * | `center` | 中心（= `50% 50%`，**默认值**） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `transformOrigin`。⚠️ `transformOrigin` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `50% 50%` |
   * | `unset` | `transformOrigin` 非继承属性 → 等同 `initial`（= `50% 50%`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `transformOrigin` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `transformOrigin` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 1/2/3 值
   *
   * | 值数量 | 含义 |
   * | --- | --- |
   * | 1 | X 或关键字（Y 默认 center） |
   * | 2 | X Y（如 `'left top'` 或 `'0% 50%'`） |
   * | 3 | X Y Z（Z 用于 3D 变换深度） |
   *
   * ### 经典用法
   *
   * ```ts
   * // 围绕左上角旋转
   * s.transformOrigin('left top')
   * s.transform('rotate(45deg)')
   *
   * // 围绕底部中心缩放（从底向上展开）
   * s.transformOrigin.bottom
   * s.transform('scaleY(0)')
   * // transition 后 scaleY(1) 就是"从底部展开"动画
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.transformOrigin.px(200)         ≡ s.transformOrigin('200px')
   * s.transformOrigin.rem(1.5)        ≡ s.transformOrigin('1.5rem')
   * s.transformOrigin.em(2)           ≡ s.transformOrigin('2em')      // 当前元素 font-size 的倍数
   * s.transformOrigin.vw(50)          ≡ s.transformOrigin('50vw')     // 视口宽 1%
   * s.transformOrigin.dvw(50)         ≡ s.transformOrigin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.transformOrigin.cqw(50)         ≡ s.transformOrigin('50cqw')    // container query 容器尺寸
   * s.transformOrigin.percent(50)     ≡ s.transformOrigin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.transformOrigin('calc(100% - 32px)')
   * s.transformOrigin('min(100%, 1200px)')
   * s.transformOrigin('max(280px, 50%)')
   * s.transformOrigin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `top` `bottom` `left` `right` `center` | 5 个位置 |
   * | `<length>` | `'10px 20px'` | X 和 Y 偏移 |
   * | `<percentage>` | `'50% 50%'` | 相对元素自身尺寸 |
   * | 3 值（含 Z） | `'50% 50% 100px'` | 3D 变换深度 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `50% 50%`
   *
   * ### 浏览器
   *
   * | Chrome  |  Firefox  | Safari  |  Edge  |   IE    |
   * | :-----: | :-------: | :-----: | :----: | :-----: |
   * | **36**  |  **16**   |  **9**  | **12** | **10**  |
   * | 1 _-x-_ | 3.5 _-x-_ | 2 _-x-_ |        | 9 _-x-_ |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transform-origin
   */
  transformOrigin: PropCarrier<CssValueOf<'transformOrigin'>, never, 'top' | 'bottom' | 'left' | 'right' | 'center' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `flat | preserve-3d`
     *
     * **Initial value**: `flat`
     *
     * |  Chrome  | Firefox  | Safari  |  Edge  | IE  |
     * | :------: | :------: | :-----: | :----: | :-: |
     * |  **36**  |  **16**  |  **9**  | **12** | No  |
     * | 12 _-x-_ | 10 _-x-_ | 4 _-x-_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transform-style
     */
  transformStyle: PropFn<CssValueOf<'transformStyle'>>
  /**
     * Since August 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<transition-behavior-value>#`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **117** | **129** | **17.4** | **117** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transition-behavior
     */
  transitionBehavior: PropFn<CssValueOf<'transitionBehavior'>>
  /**
   * 设置 CSS 过渡**开始前的延迟**。可为负值（让过渡从中间状态开始）。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受 `<time>`（`s` 或 `ms`），可正可负，**无关键字**` —— undefined
   * - `负值 = 过渡"跳过"前 N 时间，直接从该时刻继续` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `transitionDelay`。⚠️ `transitionDelay` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0s` |
   * | `unset` | `transitionDelay` 非继承属性 → 等同 `initial`（= `0s`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `transitionDelay` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `transitionDelay` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.transition('opacity 300ms')
   * s.transitionDelay.ms(100)     // 等 100ms 才开始
   *
   * // 错峰动画
   * // child1: transitionDelay 0ms
   * // child2: transitionDelay 100ms
   * // child3: transitionDelay 200ms
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<time>` | `'100ms'` `'-200ms'` | 可正可负 |
   * | 多个值 | `'0ms, 100ms, 200ms'` | 逗号分隔 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0s`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
   * | :-----: | :-----: | :-----: | :----: | :----: |
   * | **26**  | **16**  |  **9**  | **12** | **10** |
   * | 1 _-x-_ |         | 4 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transition-delay
   */
  transitionDelay: PropCarrier<CssValueOf<'transitionDelay'>, DurationTokens<T>, GlobalKw, TimeUnits, never>
  /**
   * 设置 CSS 过渡（`transition`）的**持续时间**。0 表示无过渡（即时变化）。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受 `<time>`（`s` 或 `ms`），**无关键字**（除全局关键字）` —— undefined
   * - `多个值用逗号分隔，对应多个属性（与 `transitionProperty` 顺序一致）` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `transitionDuration`。⚠️ `transitionDuration` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0s` |
   * | `unset` | `transitionDuration` 非继承属性 → 等同 `initial`（= `0s`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `transitionDuration` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `transitionDuration` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.transitionDuration.ms(300)             // 300 毫秒
   * s.transitionDuration.s(0.5)              // 0.5 秒
   * s.transitionDuration('300ms, 500ms')     // 多属性各自时长（与 transitionProperty 对应）
   * ```
   *
   * ### 常用时长参考
   *
   * | 场景 | 推荐时长 |
   * | --- | --- |
   * | 微交互（hover、focus） | 150-200ms |
   * | 中等交互（modal 弹出） | 200-300ms |
   * | 大动画（页面切换） | 300-500ms |
   * | 注意力 / 强调 | 500ms+ |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<time>` | `'300ms'` `'0.3s'` | 具体时长 |
   * | 多个值 | `'300ms, 500ms'` | 逗号分隔，与 transitionProperty 对应 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0s`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari   |  Edge  |   IE   |
   * | :-----: | :-----: | :-------: | :----: | :----: |
   * | **26**  | **16**  |   **9**   | **12** | **10** |
   * | 1 _-x-_ |         | 3.1 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transition-duration
   */
  transitionDuration: PropCarrier<CssValueOf<'transitionDuration'>, DurationTokens<T>, GlobalKw, TimeUnits, never>
  /**
   * 指定**哪些 CSS 属性**要应用过渡动画。可以是单个属性名、多个属性名、或 `all` / `none`。
   *
   * ## 关键字
   *
   * ### 2 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `all` | **默认值**。所有可过渡属性都过渡（方便但有性能风险 —— 任意变化都触发动画） |
   * | `none` | 禁用所有过渡 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `transitionProperty`。⚠️ `transitionProperty` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `all` |
   * | `unset` | `transitionProperty` 非继承属性 → 等同 `initial`（= `all`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `transitionProperty` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `transitionProperty` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态：指定属性名
   *
   * ```ts
   * // 单属性
   * s.transitionProperty('opacity')
   *
   * // 多属性（逗号分隔）
   * s.transitionProperty('opacity, transform, background-color')
   *
   * // 全部过渡（同 'all' 关键字）
   * s.transitionProperty('all')
   * ```
   *
   * ### 与其他 transition-* 属性配合
   *
   * ```ts
   * // 推荐用 transition 简写
   * s.transition('opacity 300ms ease-out, transform 200ms ease-in')
   *
   * // 或分开写
   * s.transitionProperty('opacity, transform')
   *   .transitionDuration('300ms, 200ms')
   *   .transitionTimingFunction('ease-out, ease-in')
   * ```
   *
   * ### 不可过渡的属性
   *
   * 不是所有 CSS 属性都能过渡。可过渡属性必须是"可计算的连续值"（数字 / 颜色 / 长度等），不能过渡 `display` / `visibility`（visibility 是离散值，但有特殊插值规则）等。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `all` ｜ `none` | 全部 / 全不过渡 |
   * | 单属性名 | `'opacity'` | CSS 属性 kebab-case 名 |
   * | 多属性名 | `'opacity, transform, color'` | 逗号分隔 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `all`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari   |  Edge  |   IE   |
   * | :-----: | :-----: | :-------: | :----: | :----: |
   * | **26**  | **16**  |   **9**   | **12** | **10** |
   * | 1 _-x-_ |         | 3.1 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transition-property
   */
  transitionProperty: PropCarrier<CssValueOf<'transitionProperty'>, TransitionPropertyTokens<T>, 'none' | 'all' | GlobalKw, unknown, never>
  /**
   * 设置 CSS 过渡的**速率曲线**（缓动函数）—— 决定过渡是匀速、加速、减速还是阶梯式。
   *
   * ## 关键字
   *
   * ### 7 个标准缓动关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `linear` | 匀速（无加速 / 减速） |
   * | `ease` | **默认值**。慢-快-慢（CSS 默认，类似 ease-in-out 但开头更慢） |
   * | `easeIn` | 由慢到快（先慢加速） |
   * | `easeOut` | 由快到慢（先快减速，最常用 —— 进入动画首选） |
   * | `easeInOut` | 两端慢，中间快（自然来回） |
   * | `stepStart` | 瞬间跳到终态（在开始时刻立即完成） |
   * | `stepEnd` | 保持初态直到结束才瞬间跳到终态 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `transitionTimingFunction`。⚠️ `transitionTimingFunction` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `ease` |
   * | `unset` | `transitionTimingFunction` 非继承属性 → 等同 `initial`（= `ease`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `transitionTimingFunction` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `transitionTimingFunction` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态：自定义曲线
   *
   * ```ts
   * // 三次贝塞尔曲线（4 个控制点 x1,y1,x2,y2）
   * s.transitionTimingFunction('cubic-bezier(0.4, 0, 0.2, 1)')      // Material Design 标准曲线
   *
   * // 阶梯函数
   * s.transitionTimingFunction('steps(5, end)')                     // 分 5 步执行
   * s.transitionTimingFunction('steps(10, jump-start)')             // 10 步，开始时立即跳一步
   * ```
   *
   * ### 选择建议
   *
   * - **进入动画**（fade-in、scale-in）：`easeOut`（先快后慢，自然停止）
   * - **退出动画**（fade-out、scale-out）：`easeIn`（先慢后快，加速离开）
   * - **来回 / 双向**（modal 弹出弹回）：`easeInOut`
   * - **匀速**（loading 旋转）：`linear`
   * - **打字机 / 像素跳变**：`steps(N)`
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 7 个标准 keyword | `linear` ｜ `ease` ｜ `easeIn` ｜ `easeOut` ｜ `easeInOut` ｜ `stepStart` ｜ `stepEnd` | 常用 |
   * | 贝塞尔曲线 | `'cubic-bezier(0.4, 0, 0.2, 1)'` | 4 个控制点（前两个 X∈[0,1]，Y 无限制） |
   * | 阶梯函数 | `'steps(5, end)'` | N 步 + 方向（start / end / jump-start / jump-end / jump-both / jump-none） |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `ease`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari   |  Edge  |   IE   |
   * | :-----: | :-----: | :-------: | :----: | :----: |
   * | **26**  | **16**  |   **9**   | **12** | **10** |
   * | 1 _-x-_ |         | 3.1 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transition-timing-function
   */
  transitionTimingFunction: PropCarrier<CssValueOf<'transitionTimingFunction'>, EasingTokens<T>, 'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'stepStart' | 'stepEnd' | GlobalKw, unknown, never>
  /**
   * 设置元素的**平移量**（CSS Transforms 2 独立属性）。等价于 `transform: translate()`，可单独动画化。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。不平移 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `translate`。⚠️ `translate` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `translate` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `translate` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `translate` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态
   *
   * ```ts
   * s.translate('20px')                  // 仅 X 平移
   * s.translate('20px 10px')             // X 和 Y
   * s.translate('20px 10px 5px')         // X Y Z（3D）
   *
   * // 百分比相对元素自身
   * s.translate('-50% -50%')             // 经典：负值半身，配合 position absolute + top/left 50% 居中
   *
   * // 主题 token
   * s.translate.px(8)
   * ```
   *
   * ### 经典："绝对定位居中"
   *
   * ```ts
   * s.position.absolute
   * s.top('50%')
   * s.left('50%')
   * s.translate('-50% -50%')
   * // 元素中心位于父容器中心，无视元素尺寸
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.translate.px(200)         ≡ s.translate('200px')
   * s.translate.rem(1.5)        ≡ s.translate('1.5rem')
   * s.translate.em(2)           ≡ s.translate('2em')      // 当前元素 font-size 的倍数
   * s.translate.vw(50)          ≡ s.translate('50vw')     // 视口宽 1%
   * s.translate.dvw(50)         ≡ s.translate('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.translate.cqw(50)         ≡ s.translate('50cqw')    // container query 容器尺寸
   * s.translate.percent(50)     ≡ s.translate('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.translate('calc(100% - 32px)')
   * s.translate('min(100%, 1200px)')
   * s.translate('max(280px, 50%)')
   * s.translate('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 1 个值 | `'20px'` | 仅 X 平移 |
   * | 2 个值 | `'20px 10px'` | X / Y |
   * | 3 个值 | `'20px 10px 5px'` | X / Y / Z (3D) |
   * | `<percentage>` | `'-50% -50%'` | 相对元素自身（不是父容器） |
   * | `none` | — | 不平移 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
   * | :-----: | :-----: | :------: | :-----: | :-: |
   * | **104** | **72**  | **14.1** | **104** | No  |
   *
   * CSS Transforms 2 独立属性 Chrome 104 / Firefox 72 / Safari 14.1+。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/translate
   */
  translate: PropCarrier<CssValueOf<'translate'>, never, 'none' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | embed | isolate | bidi-override | isolate-override | plaintext`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari  |  Edge  |   IE    |
     * | :----: | :-----: | :-----: | :----: | :-----: |
     * | **2**  |  **1**  | **1.3** | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/unicode-bidi
     */
  unicodeBidi: PropFn<CssValueOf<'unicodeBidi'>>
  /**
   * 控制文本是否**可被用户选中**（鼠标拖选、键盘 Ctrl+A 等）。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。文本可选 |
   * | `none` | **禁止选中**（按钮、UI 控件常用，防止误选） |
   * | `text` | 强制可选（覆盖父级 `none`） |
   * | `all` | 点击即**全选**（如代码块） |
   * | `contain` | 允许选中但限制范围在当前元素内（不会延伸到父/兄弟） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `userSelect`。⚠️ `userSelect` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `userSelect` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `userSelect` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `userSelect` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 按钮 / 标签 / 拖拽手柄：禁止选中
   * s.userSelect.none
   *
   * // 代码片段：点击全选
   * s.userSelect.all
   * ```
   *
   * ### a11y 注意
   *
   * `userSelect: none` 会让屏幕阅读器和键盘用户无法选中文本 —— **正文内容不要禁用**，仅 UI 控件用。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个 keyword | `auto` ｜ `none` ｜ `text` ｜ `all` ｜ `contain` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |   Safari    |   Edge   |      IE      |
   * | :-----: | :-----: | :---------: | :------: | :----------: |
   * | **54**  | **69**  | **3** _-x-_ |  **79**  | **10** _-x-_ |
   * | 1 _-x-_ | 1 _-x-_ |             | 12 _-x-_ |              |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/user-select
   */
  userSelect: PropCarrier<CssValueOf<'userSelect'>, never, 'none' | 'auto' | 'text' | 'all' | 'contain' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `none | non-scaling-stroke | non-scaling-size | non-rotation | fixed-position`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **6**  | **15**  | **5.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/vector-effect
     */
  vectorEffect: PropFn<CssValueOf<'vectorEffect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `baseline | sub | super | text-top | text-bottom | middle | top | bottom | <percentage> | <length>`
     *
     * **Initial value**: `baseline`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/vertical-align
     */
  verticalAlign: PropFn<CssValueOf<'verticalAlign'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ block | inline | x | y ]#`
     *
     * **Initial value**: `block`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/view-timeline-axis
     */
  viewTimelineAxis: PropFn<CssValueOf<'viewTimelineAxis'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ [ auto | <length-percentage> ]{1,2} ]#`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/view-timeline-inset
     */
  viewTimelineInset: PropFn<CssValueOf<'viewTimelineInset'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ none | <dashed-ident> ]#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/view-timeline-name
     */
  viewTimelineName: PropFn<CssValueOf<'viewTimelineName'>>
  /**
     * **Syntax**: `none | <custom-ident>+`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **125** | **144** | **18.2** | **125** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/view-transition-class
     */
  viewTransitionClass: PropFn<CssValueOf<'viewTransitionClass'>>
  /**
     * Since October 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | <custom-ident> | match-element`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **111** | **144** | **18** | **111** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/view-transition-name
     */
  viewTransitionName: PropFn<CssValueOf<'viewTransitionName'>>
  /**
   * 控制元素是否**可见**（但仍占空间，与 `display: none` 不同）。还可用于表格行 / 列的隐藏。
   *
   * ## 关键字
   *
   * ### 3 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `visible` | **默认值**。可见 |
   * | `hidden` | 隐藏但**仍占位**（与 `display: none` 区别！）；不触发鼠标事件；屏幕阅读器跳过；transition 可生效 |
   * | `collapse` | 仅对 `<table>` 行 / 列 / 行组生效：隐藏整行 / 列且**让其他单元格占用其空间**（不像 `hidden` 那样留空）；在非表格元素上等同 `hidden` |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `visibility`。⚠️ `visibility` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `visible` |
   * | `unset` | `visibility` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `visibility` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `visibility` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### `visibility: hidden` vs `display: none`
   *
   * | 行为 | `visibility: hidden` | `display: none` |
   * | --- | --- | --- |
   * | 是否占位 | ✓ 占位 | ✗ 不占位 |
   * | 是否触发事件 | ✗ 不触发 | ✗ 不触发 |
   * | transition 可用 | ✓（visibility 可过渡） | ✗（display 不能动画） |
   * | 子元素 `visibility: visible` 能覆盖 | ✓ 可见 | ✗ 不可恢复 |
   *
   * ```ts
   * // 占位但不可见（保留布局空间）
   * s.visibility.hidden
   *
   * // 切换显隐时保持动画（visibility 是可 transition 的）
   * s.transition('opacity 0.3s, visibility 0.3s')
   *   .visibility.hidden.opacity(0)
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 可见性关键字 | `visible` ｜ `hidden` ｜ `collapse` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `visible`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * 所有浏览器远古支持。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/visibility
   */
  visibility: PropCarrier<CssValueOf<'visibility'>, never, 'visible' | 'hidden' | 'collapse' | GlobalKw, unknown, never>
  /**
   * 控制文本中**空白字符**（空格、换行、tab）的处理 + 是否换行。CSS 中最容易混淆的属性之一。
   *
   * ## 关键字
   *
   * ### 8 个 keyword
   *
   * | 关键字 | 空白 | 换行符 | 自动换行 |
   * | --- | --- | --- | --- |
   * | `normal` | **默认值**。多个空白合并为一个 | 换行符当空格处理 | ✓ 内容溢出时换行 |
   * | `nowrap` | 多空白合并 | 换行符当空格 | ✗ **不换行**（单行） |
   * | `pre` | **保留**所有空白 | **保留**换行 | ✗ 不自动换行（同 `<pre>`） |
   * | `preWrap` | 保留所有空白 | 保留换行 | ✓ 同时自动换行 |
   * | `preLine` | 多空白合并 | **保留**换行 | ✓ 自动换行 |
   * | `breakSpaces` | 保留所有空白（含尾部空格） | 保留换行 | ✓ 自动换行（更严格） |
   * | `wrap` | 同 `normal`（CSS Text 4 新别名） | 换行符当空格 | ✓ |
   * | `collapse` | 同 `normal` 的合并行为（CSS Text 4 新） | — | — |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `whiteSpace`。⚠️ `whiteSpace` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `whiteSpace` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `whiteSpace` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `whiteSpace` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 速查
   *
   * | 需求 | 写法 |
   * | --- | --- |
   * | 默认 | `normal` |
   * | **单行省略**（不换行） | `nowrap` |
   * | 显示代码 / ASCII art（**完全保留**格式） | `pre` |
   * | Markdown / 富文本（**保留换行**但自动断行） | `preWrap` |
   *
   * ### nowrap 经典用法
   *
   * ```ts
   * // 一行省略
   * s.whiteSpace.nowrap
   * s.overflow.hidden
   * s.textOverflow.ellipsis
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 8 个 keyword | `normal` ｜ `nowrap` ｜ `pre` ｜ `preWrap` ｜ `preLine` ｜ `breakSpaces` ｜ `wrap` ｜ `collapse` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE    |
   * | :----: | :-----: | :----: | :----: | :-----: |
   * | **1**  |  **1**  | **1**  | **12** | **5.5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/white-space
   */
  whiteSpace: PropCarrier<CssValueOf<'whiteSpace'>, never, 'normal' | 'nowrap' | 'pre' | 'preWrap' | 'preLine' | 'breakSpaces' | 'wrap' | 'collapse' | GlobalKw, unknown, never>
  /**
     * Since March 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `collapse | preserve | preserve-breaks | preserve-spaces | break-spaces`
     *
     * **Initial value**: `collapse`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **114** | **124** | **17.4** | **114** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/white-space-collapse
     */
  whiteSpaceCollapse: PropFn<CssValueOf<'whiteSpaceCollapse'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `2`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **25** |   No    | **1.3** | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/widows
     */
  widows: PropFn<CssValueOf<'widows'>>
  /**
   * 设置元素的**内容区宽度**（content-box 模式）或**边框盒宽度**（border-box 模式）。
   *
   * ## 关键字
   *
   * ### 4 个尺寸关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `auto` | **默认值**。浏览器自动计算：块级元素（`display: block`）撑满父容器 content-box 宽度；行内元素 / flex 项目 / grid 单元格 = 内容宽度 | 通常不需要显式写，块级布局默认行为 |
   * | `minContent` | 元素尽可能收窄，直到再窄一个像素就会使内容溢出为止。等于"最长不可断单词/图片"的宽度 | 让宽度跟随最小内容，避免拉伸过宽；表格列紧凑排列 |
   * | `maxContent` | 元素扩展到"理想宽度"——如果空间无限大它会有多宽。等于最长文本行不换行时的宽度 | 让元素像 Tag / Badge 一样宽度跟随文字，但不被容器压缩 |
   * | `fitContent` | `min(max-content, max(min-content, 可用宽度))`：尽量撑到 max-content，但不超过父容器；比父容器窄时收到 max-content | 响应式 Tooltip / 弹窗宽度自适应内容但不溢出 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `width`。⚠️ `width` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `width` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `width` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `width` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 盒模型模式影响
   *
   * 默认（`box-sizing: content-box`）时，`width` 设置的是**内容区**宽度，实际占用宽度 = width + padding-left + padding-right + border-left + border-right。
   *
   * 推荐全局使用 `box-sizing: border-box`（即 CSS reset 常见做法），此时 `width` = 整个边框盒宽度，padding/border 向内挤压内容区，不再影响元素占位宽。
   *
   * ```ts
   * s.width.px(200)               // 200px 内容宽（默认 content-box）
   * s.boxSizing.borderBox          // 200px 边框盒宽（含 padding + border）
   * s.width.px(200)
   * ```
   *
   * ### 百分比参照
   *
   * `width: 50%` 参照**父元素 content-box 宽度**（与高度无关）。
   *
   * ### 与 max-width / min-width 优先级
   *
   * 实际计算宽度 = `min(max-width, max(min-width, width))`：
   * - `min-width` 优先于 `max-width`（两者冲突时 min-width 赢）
   * - `max-width` 优先于 `width`
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.width.px(200)         ≡ s.width('200px')
   * s.width.rem(1.5)        ≡ s.width('1.5rem')
   * s.width.em(2)           ≡ s.width('2em')      // 当前元素 font-size 的倍数
   * s.width.vw(50)          ≡ s.width('50vw')     // 视口宽 1%
   * s.width.dvw(50)         ≡ s.width('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.width.cqw(50)         ≡ s.width('50cqw')    // container query 容器尺寸
   * s.width.percent(50)     ≡ s.width('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.width('calc(100% - 32px)')
   * s.width('min(100%, 1200px)')
   * s.width('max(280px, 50%)')
   * s.width('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ### 常见陷阱
   *
   * - `width: 100%` 在 `content-box` 模式下，若元素还有 padding/border，实际会溢出父容器 —— 切 `border-box` 或改用 `width: auto`
   * - height: auto 不像 width: auto 自动撑满父容器 —— 父高度需显式设置，子元素 `height: 100%` 才生效
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | — | **默认值**；块级元素撑满父宽，行内 / flex 项 = 内容宽 |
   * | `minContent` | — | 收窄至最小内容宽（最长不可断处） |
   * | `maxContent` | — | 扩展至理想宽度（不换行全行宽） |
   * | `fitContent` | — | 内容宽但不超父容器 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/width
   */
  width: PropCarrier<CssValueOf<'width'>, SizeTokens<T>, 'auto' | 'minContent' | 'maxContent' | 'fitContent' | GlobalKw, LengthUnits, never>
  /**
   * 提示浏览器某元素**即将变化** —— 让浏览器**提前优化**该元素（创建合成层、GPU 加速）。
   *
   * ## 关键字
   *
   * ### 3 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。无优化提示 |
   * | `scrollPosition` | 提示元素将**滚动**，浏览器优化滚动性能 |
   * | `contents` | 提示元素**内容**将频繁变化（动画 / 文字） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `willChange`。⚠️ `willChange` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `willChange` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `willChange` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `willChange` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态：指定 CSS 属性名
   *
   * ```ts
   * // 即将动画 transform → 浏览器提前晋升合成层
   * s.willChange('transform')
   *
   * // 多个属性
   * s.willChange('transform, opacity')
   * ```
   *
   * ### 何时用 vs 不用
   *
   * **用**：动画开始前**短暂**加上（如 :hover 临时加，动画结束移除）。
   *
   * **不用**：
   * - 永久加上 —— 浏览器会**长期占用合成层内存**，反而拖慢页面
   * - 给所有元素加 —— 性能反向优化（变慢）
   * - 不动的元素加 —— 无效但耗内存
   *
   * ### 替代方案
   *
   * 直接用 `transform: translateZ(0)` 也可触发合成层，但 `will-change` 更标准。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 3 个 keyword | `auto` ｜ `scrollPosition` ｜ `contents` | 内建优化 |
   * | CSS 属性名 | `'transform'` `'opacity'` `'transform, opacity'` | kebab-case 属性名 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  | IE  |
   * | :----: | :-----: | :-----: | :----: | :-: |
   * | **36** | **36**  | **9.1** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/will-change
   */
  willChange: PropCarrier<CssValueOf<'willChange'>, never, 'auto' | 'scrollPosition' | 'contents' | GlobalKw, unknown, never>
  /**
   * 控制**单词何时可断行** —— 处理英文长单词溢出、CJK 文本断行规则。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。按语言规则断行（CJK 在任意字符间断，英文仅在空格 / 连字符断） |
   * | `breakAll` | **任意字符间**都可断（包括英文中间）—— 适合容纳长 URL |
   * | `keepAll` | CJK 文字**不可断**（仅在空格 / 连字符 / 标点处断） |
   * | `breakWord` | 已弃用，等同 `overflow-wrap: anywhere` |
   * | `autoPhrase` | CJK 智能短语断行（CSS Text 4 实验性） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `wordBreak`。⚠️ `wordBreak` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `wordBreak` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `wordBreak` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `wordBreak` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### wordBreak vs overflowWrap
   *
   * | 属性 | 行为 |
   * | --- | --- |
   * | `wordBreak` | 控制**所有字符**是否可断（侵入性强） |
   * | `overflowWrap` | 仅在**单词无法放下**时才断（更友好） |
   *
   * ### 用例
   *
   * ```ts
   * // 长 URL / hash 自动断
   * s.wordBreak.breakAll
   *
   * // CJK 不在字符间断（更自然）
   * s.wordBreak.keepAll
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个 keyword | `normal` ｜ `breakAll` ｜ `keepAll` ｜ `breakWord` ｜ `autoPhrase` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |   IE    |
   * | :----: | :-----: | :----: | :----: | :-----: |
   * | **1**  | **15**  | **3**  | **12** | **5.5** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/word-break
   */
  wordBreak: PropCarrier<CssValueOf<'wordBreak'>, never, 'normal' | 'breakAll' | 'keepAll' | 'breakWord' | 'autoPhrase' | GlobalKw, unknown, never>
  /**
   * 设置**单词之间**的额外间距（按空白字符识别单词）。对 CJK 文字效果有限（无空格分词）。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。字体本身的单词间距 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `wordSpacing`。⚠️ `wordSpacing` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `wordSpacing` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `wordSpacing` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `wordSpacing` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.wordSpacing.px(4)              // 单词间距加 4px
   * s.wordSpacing.em(0.25)           // 间距加当前字号的 25%
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.wordSpacing.px(200)         ≡ s.wordSpacing('200px')
   * s.wordSpacing.rem(1.5)        ≡ s.wordSpacing('1.5rem')
   * s.wordSpacing.em(2)           ≡ s.wordSpacing('2em')      // 当前元素 font-size 的倍数
   * s.wordSpacing.vw(50)          ≡ s.wordSpacing('50vw')     // 视口宽 1%
   * s.wordSpacing.dvw(50)         ≡ s.wordSpacing('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.wordSpacing.cqw(50)         ≡ s.wordSpacing('50cqw')    // container query 容器尺寸
   * s.wordSpacing.percent(50)     ≡ s.wordSpacing('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.wordSpacing('calc(100% - 32px)')
   * s.wordSpacing('min(100%, 1200px)')
   * s.wordSpacing('max(280px, 50%)')
   * s.wordSpacing('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'4px'` `'0.25em'` | 可正可负 |
   * | `normal` | — | 字体本身设定 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **6** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/word-spacing
   */
  wordSpacing: PropCarrier<CssValueOf<'wordSpacing'>, never, 'normal' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2018.
     *
     * **Syntax**: `normal | break-word`
     *
     * **Initial value**: `normal`
     */
  wordWrap: PropFn<CssValueOf<'wordWrap'>>
  /**
   * 设置**书写方向** —— 横排 / 竖排，从左到右 / 从右到左。CJK 古典竖排、日文 / 蒙文等需要。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `horizontalTb` | **默认值**。**横排**，从上到下流（最常见，中英文） |
   * | `verticalRl` | **竖排**，从**右到左**列流（日文 / 中文古籍） |
   * | `verticalLr` | **竖排**，从**左到右**列流（蒙文） |
   * | `sidewaysRl` | 横排文字侧躺，从右到左（罕用） |
   * | `sidewaysLr` | 横排文字侧躺，从左到右（罕用） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `writingMode`。⚠️ `writingMode` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `horizontalTb` |
   * | `unset` | `writingMode` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `writingMode` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `writingMode` 的值；不在 layer 中等同 `revert` |
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个 keyword | `horizontalTb` ｜ `verticalRl` ｜ `verticalLr` ｜ `sidewaysRl` ｜ `sidewaysLr` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `horizontalTb`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari   |  Edge  |  IE   |
   * | :-----: | :-----: | :-------: | :----: | :---: |
   * | **48**  | **41**  | **10.1**  | **12** | **9** |
   * | 8 _-x-_ |         | 5.1 _-x-_ |        |       |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/writing-mode
   */
  writingMode: PropCarrier<CssValueOf<'writingMode'>, never, 'horizontalTb' | 'verticalRl' | 'verticalLr' | 'sidewaysRl' | 'sidewaysLr' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **42** | **69**  | **9**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/x
     */
  x: PropFn<CssValueOf<'x'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **42** | **69**  | **9**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/y
     */
  y: PropFn<CssValueOf<'y'>>
  /**
   * 控制元素的**层叠顺序**（z 轴前后）。数值越大越靠前。**仅对 `position` 非 `static` 的元素生效**。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。不创建新层叠上下文，按 DOM 顺序堆叠 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `zIndex`。⚠️ `zIndex` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `zIndex` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `zIndex` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `zIndex` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * s.position.relative
   * s.zIndex(10)     // 浮起到第 10 层
   * s.position.fixed
   * s.zIndex(9999)      // Modal 最顶层（zui token：s.zIndex._modal）
   * ```
   *
   * ### 层叠上下文（stacking context）
   *
   * 某些属性会创建新的层叠上下文（隔离子元素的 z-index 与外部）：
   *
   * - `position` 非 `static` + `zIndex` 非 `auto`
   * - `opacity < 1`
   * - `transform` / `filter` / `will-change`（非 auto）
   * - `isolation: isolate`
   * - `mixBlendMode` 非 normal
   *
   * 子元素的 z-index **在新上下文内独立**计算 —— 外部 z-index: 9999 也可能被一个 opacity 0.99 的父元素"包住"。
   *
   * ### 主题 token
   *
   * ```ts
   * s.zIndex._modal      // 例如 1000
   * s.zIndex._tooltip    // 例如 2000
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<integer>` | `0` `10` `-1` `9999` | 可正可负整数 |
   * | `auto` | — | 不参与层叠（默认） |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/z-index
   */
  zIndex: PropCarrier<CssValueOf<'zIndex'>, ZIndexTokens<T>, 'auto' | GlobalKw, unknown, never>
  /**
     * Since May 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `normal | reset | <number [0,∞]> || <percentage [0,∞]>`
     *
     * **Initial value**: `1`
     *
     * | Chrome | Firefox | Safari  |  Edge  |   IE    |
     * | :----: | :-----: | :-----: | :----: | :-----: |
     * | **1**  | **126** | **3.1** | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/zoom
     */
  zoom: PropFn<CssValueOf<'zoom'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `initial | inherit | unset | revert | revert-layer`
     *
     * **Initial value**: There is no practical initial value for it.
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **37** | **27**  | **9.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/all
     */
  all: PropFn<CssValueOf<'all'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation>#`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **43**  | **16**  |  **9**  | **12** | **10** |
     * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation
     */
  animation: PropFn<CssValueOf<'animation'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <'animation-range-start'> <'animation-range-end'>? ]#`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-range
     */
  animationRange: PropFn<CssValueOf<'animationRange'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-layer>#? , <final-bg-layer>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background
     */
  background: PropFn<CssValueOf<'background'>>
  /**
   * 设置 `background-image` **在容器中的位置**。可用关键字、百分比、长度，单值或多值组合。
   *
   * ## 关键字
   *
   * ### 5 个位置关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `top` | 垂直上对齐（= `0%` 纵向） |
   * | `bottom` | 垂直下对齐（= `100%` 纵向） |
   * | `left` | 水平左对齐（= `0%` 横向） |
   * | `right` | 水平右对齐（= `100%` 横向） |
   * | `center` | 居中（= `50%`） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `backgroundPosition`。⚠️ `backgroundPosition` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0% 0%` |
   * | `unset` | `backgroundPosition` 非继承属性 → 等同 `initial`（= `0% 0%`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `backgroundPosition` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `backgroundPosition` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 1/2/3/4 值
   *
   * | 值数量 | 含义 |
   * | --- | --- |
   * | 1 | 单值（如 `center`）：另一轴默认 `center` |
   * | 2 | `X Y`：如 `'center top'` = 水平居中 + 顶端 |
   * | 3 / 4 | 边偏移：`'right 20px bottom 10px'` = 距右边 20px、距底边 10px |
   *
   * ### 百分比的含义
   *
   * ```ts
   * s.backgroundPosition('50% 50%')         // 等同 'center'
   * s.backgroundPosition('0% 0%')           // 等同 'left top'
   * s.backgroundPosition('100% 100%')       // 等同 'right bottom'
   * ```
   *
   * 百分比是 (容器尺寸 − 图片尺寸) 的比例 —— **50% 让图片中心对齐容器中心**（不像其他属性的百分比相对容器宽度）。
   *
   * ### 经典用法
   *
   * ```ts
   * // 居中的背景图
   * s.backgroundImage("url('/hero.jpg')")
   *   .backgroundPosition.center
   *   .backgroundSize.cover
   *
   * // 精灵图：定位到某个图标
   * s.backgroundImage("url('/sprite.png')")
   *   .backgroundPosition('-32px -64px')         // 取精灵图 (32, 64) 位置的图标
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.backgroundPosition.px(200)         ≡ s.backgroundPosition('200px')
   * s.backgroundPosition.rem(1.5)        ≡ s.backgroundPosition('1.5rem')
   * s.backgroundPosition.em(2)           ≡ s.backgroundPosition('2em')      // 当前元素 font-size 的倍数
   * s.backgroundPosition.vw(50)          ≡ s.backgroundPosition('50vw')     // 视口宽 1%
   * s.backgroundPosition.dvw(50)         ≡ s.backgroundPosition('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.backgroundPosition.cqw(50)         ≡ s.backgroundPosition('50cqw')    // container query 容器尺寸
   * s.backgroundPosition.percent(50)     ≡ s.backgroundPosition('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.backgroundPosition('calc(100% - 32px)')
   * s.backgroundPosition('min(100%, 1200px)')
   * s.backgroundPosition('max(280px, 50%)')
   * s.backgroundPosition('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 关键字 | `top` `bottom` `left` `right` `center` | 位置关键字 |
   * | 1 个值 | `'center'` | 另一轴默认 center |
   * | 2 个值（X Y） | `'center top'` `'100% 50%'` | 水平 / 垂直 |
   * | `<length>` | `'10px 20px'` `'-32px -64px'` | 从左上角偏移（可负 = 反向） |
   * | `<percentage>` | `'50% 50%'` | 50% = 中心对齐中心 |
   * | 边偏移（CSS 3） | `'right 20px bottom 10px'` | 距某边的距离 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0% 0%`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-position
   */
  backgroundPosition: PropCarrier<CssValueOf<'backgroundPosition'>, never, 'top' | 'bottom' | 'left' | 'right' | 'center' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width> || <line-style> || <color>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border
     */
  border: PropFn<CssValueOf<'border'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-block-start'>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block
     */
  borderBlock: PropFn<CssValueOf<'borderBlock'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-top-color'>{1,2}`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-color
     */
  borderBlockColor: PropFn<CssValueOf<'borderBlockColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'> || <'border-top-style'> || <color>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-end
     */
  borderBlockEnd: PropFn<CssValueOf<'borderBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'> || <'border-top-style'> || <color>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-start
     */
  borderBlockStart: PropFn<CssValueOf<'borderBlockStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-top-style'>{1,2}`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-style
     */
  borderBlockStyle: PropFn<CssValueOf<'borderBlockStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-top-width'>{1,2}`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-width
     */
  borderBlockWidth: PropFn<CssValueOf<'borderBlockWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width> || <line-style> || <color>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-bottom
     */
  borderBottom: PropFn<CssValueOf<'borderBottom'>>
  /**
   * 设置元素**四条边框**的颜色（简写，可一次设 1/2/3/4 个值）。
   *
   * ## 关键字
   *
   * ### 通用颜色关键字（4 个）
   *
   * | 关键字 | 等价 | 用途 |
   * | --- | --- | --- |
   * | `white` | `#FFFFFF` | 纯白 |
   * | `black` | `#000000` | 纯黑 |
   * | `transparent` | `rgba(0,0,0,0)` | 完全透明边框；仍占边框宽度位置，可见为间隙 |
   * | `currentColor` | **默认值**，跟随 `color` | 让边框色跟随文字色变（最常用） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderColor`。⚠️ `borderColor` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `currentColor` |
   * | `unset` | `borderColor` 非继承属性 → 等同 `initial`（= `currentColor`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderColor` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderColor` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法
   *
   * `s.borderColor('red')` 等同四边设为 red；多值时按 CSS 简写规则：
   *
   * - 1 值：四边相同
   * - 2 值：上下 / 左右
   * - 3 值：上 / 左右 / 下
   * - 4 值：上 / 右 / 下 / 左（顺时针）
   *
   * `s.borderColor('red green blue yellow')` 等同上=red 右=green 下=blue 左=yellow。
   *
   * ### 主题 token 写法
   *
   * ```ts
   * s.borderColor._primary                    // 主题主色（ZConfigProvider 切 light/dark 自动跟随）
   * s.borderColor._textPrimary                // 语义化文本主色（zui-vue ZuiSchema 提供）
   * s.borderColor._red500                     // Palette token（tailwind 风格 50–950 阶）
   * s.borderColor._primary.alpha(0.6)         // token + 修饰链
   * s.borderColor._primary.darken(0.1)
   * s.borderColor._primary.complement         // 互补色（色相 +180°）
   * ```
   *
   * **核心规则**：加 `_` 走 token，不加 `_` 走 CSS 关键字 ——
   * `s.borderColor._coral` 查 `schema.color.coral` token（必须有定义），
   * `s.borderColor.coral` 走 CSS 命名色，输出 CSS 值。
   *
   * ### 配合 borderStyle / borderWidth
   *
   * 只有 `border-style` 不是 `none` 时才显示边框 —— **新元素默认 border-style 是 none**，光设颜色不显示！
   * 正确写法：`s.border('1px solid'); s.borderColor._primary`（两条 statement，statement-only 风）。
   *
   * ## CSS 命名色（146 个，按色相分组）
   *
   * 全小写无连字符，如 `s.color.coral` / `s.backgroundColor.royalblue`。所有颜色属性通用。
   *
   * - **中性色（27）**：
   *   - 白系（17）：`white` `snow` `ivory` `floralwhite` `seashell` `linen` `oldlace` `antiquewhite`
   *     `beige` `lavenderblush` `mistyrose` `honeydew` `mintcream` `azure` `aliceblue` `ghostwhite` `whitesmoke`
   *     （⚠️ `azure` 不是天蓝，是带蓝色调的白 `#F0FFFF`）
   *   - 灰系（9）：`gainsboro` `lightgray`/`lightgrey` `silver` `darkgray`/`darkgrey` `gray`/`grey`
   *     `dimgray`/`dimgrey` `lightslategray` `slategray` `darkslategray`
   *     （⚠️ `darkgray #A9A9A9` 比 `gray #808080` **浅**，HTML 4 命名错误延续至今）
   *   - 黑（1）：`black`
   *
   * - **红系（10）**：`red` `crimson` `firebrick` `darkred` `indianred`
   *   `salmon` `darksalmon` `lightsalmon` `lightcoral` `rosybrown`
   *
   * - **粉系（6）**：`pink` `lightpink` `hotpink` `deeppink` `palevioletred` `mediumvioletred`
   *
   * - **橙系（5）**：`orange` `darkorange` `coral` `tomato` `orangered`
   *
   * - **黄系（11）**：`yellow` `gold` `khaki` `darkkhaki` `lightyellow` `lemonchiffon`
   *   `lightgoldenrodyellow` `papayawhip` `moccasin` `peachpuff` `palegoldenrod`
   *
   * - **棕 / 土系（16）**：`brown` `maroon` `chocolate` `peru` `sienna` `saddlebrown`
   *   `tan` `wheat` `burlywood` `sandybrown` `goldenrod` `darkgoldenrod`
   *   `cornsilk` `blanchedalmond` `bisque` `navajowhite`
   *
   * - **绿系（19）**：`green` `lime` `darkgreen` `forestgreen` `seagreen` `mediumseagreen`
   *   `darkseagreen` `lightgreen` `palegreen` `springgreen` `mediumspringgreen`
   *   `chartreuse` `lawngreen` `greenyellow` `yellowgreen` `limegreen`
   *   `olive` `olivedrab` `darkolivegreen`
   *   （⚠️ `lime #00FF00` 是 HTML 纯绿，`green #008000` 比 `lime` **暗**）
   *
   * - **青系（12）**：`cyan`/`aqua` `darkcyan` `teal` `lightcyan` `turquoise`
   *   `mediumturquoise` `darkturquoise` `aquamarine` `mediumaquamarine`
   *   `paleturquoise` `lightseagreen` `cadetblue`
   *   （⚠️ `cyan` ≡ `aqua`，完全相同的色 `#00FFFF`）
   *
   * - **蓝系（15）**：`blue` `darkblue` `mediumblue` `navy` `midnightblue`
   *   `dodgerblue` `cornflowerblue` `royalblue` `steelblue` `skyblue`
   *   `lightskyblue` `lightblue` `deepskyblue` `powderblue` `lightsteelblue`
   *
   * - **紫系（18）**：`purple` `indigo` `violet` `magenta`/`fuchsia` `darkmagenta`
   *   `orchid` `darkorchid` `mediumorchid` `plum` `lavender` `thistle`
   *   `blueviolet` `darkviolet` `mediumpurple` `slateblue` `mediumslateblue`
   *   `darkslateblue` `rebeccapurple`
   *   （⚠️ `magenta` ≡ `fuchsia`，完全相同的色 `#FF00FF`；
   *   `rebeccapurple` 为纪念 Eric Meyer 之女命名）
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<named-color>` | `'red'` `'coral'` `'royalblue'` | 146 个 CSS 命名色（见上） |
   * | `<hex-color>` | `'#f80'` `'#f80c'` `'#ff8800'` `'#ff8800cc'` | 3/4/6/8 位；4/8 位末两位为 alpha |
   * | `rgb()` / `rgba()` | `'rgb(255 128 0 / 0.8)'` `'rgba(255,128,0,0.8)'` | 现代空格语法（推荐）+ 旧逗号语法 |
   * | `hsl()` / `hsla()` | `'hsl(30 100% 50% / 0.8)'` | H 色相 / S 饱和 / L 明度 |
   * | `hwb()` | `'hwb(30 0% 0%)'` | 色相+白度+黑度（CSS Color 4） |
   * | `lab()` / `lch()` | `'lab(60% 40 30)'` `'lch(60% 50 30)'` | 感知均匀色彩（CSS Color 4） |
   * | `oklab()` / `oklch()` | `'oklch(0.7 0.15 30)'` | **推荐**，渐变插值最稳（CSS Color 4） |
   * | `color()` | `'color(display-p3 1 0.5 0)'` | 宽色域 P3 / Rec2020（CSS Color 4） |
   * | `color-mix()` | `'color-mix(in oklch, #f80 60%, #fff)'` | 浏览器原生混色（CSS Color 5） |
   * | `<system-color>` | `'canvas'` `'canvastext'` `'linktext'` `'buttonface'` | 系统色，跟随 OS 主题 |
   * | `currentColor` | — | 引用当前 `color` |
   * | 多值简写 | `'red green blue yellow'` | 1/2/3/4 个值按上述简写规则分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `currentColor`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-color
   */
  borderColor: ColorPropCarrier<CssValueOf<'borderColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'whitesmoke' | 'yellow' | 'yellowgreen' | GlobalKw, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>`
     *
     * | Chrome  |  Firefox  | Safari  |  Edge  |   IE   |
     * | :-----: | :-------: | :-----: | :----: | :----: |
     * | **16**  |  **15**   |  **6**  | **12** | **11** |
     * | 7 _-x-_ | 3.5 _-x-_ | 3 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-image
     */
  borderImage: PropFn<CssValueOf<'borderImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-block-start'>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline
     */
  borderInline: PropFn<CssValueOf<'borderInline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-top-color'>{1,2}`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-color
     */
  borderInlineColor: PropFn<CssValueOf<'borderInlineColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'> || <'border-top-style'> || <color>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-end
     */
  borderInlineEnd: PropFn<CssValueOf<'borderInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'> || <'border-top-style'> || <color>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-start
     */
  borderInlineStart: PropFn<CssValueOf<'borderInlineStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-top-style'>{1,2}`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-style
     */
  borderInlineStyle: PropFn<CssValueOf<'borderInlineStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-top-width'>{1,2}`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-width
     */
  borderInlineWidth: PropFn<CssValueOf<'borderInlineWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width> || <line-style> || <color>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-left
     */
  borderLeft: PropFn<CssValueOf<'borderLeft'>>
  /**
   * 设置元素**四个圆角**的半径（简写）。支持单值四角统一、多值各角不同、`/` 分隔横纵半径做椭圆角。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度 / 百分比 / 数学函数，**无关键字**（除全局关键字）` —— undefined
   * - `百分比相对元素对应轴尺寸；正方形 50% = 圆形` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderRadius`。⚠️ `borderRadius` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `borderRadius` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderRadius` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderRadius` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `borderRadius.px(8)` | 四角均为 8px |
   * | `borderRadius('8px 16px')` | 左上右下 8px，右上左下 16px |
   * | `borderRadius('8px 16px 4px 0')` | 左上 / 右上 / 右下 / 左下（顺时针） |
   *
   * ### 椭圆角：横纵半径分开
   *
   * 用 `/` 分隔：
   *
   * ```ts
   * s.borderRadius('10px / 20px')        // 横半径 10px，纵半径 20px
   * s.borderRadius('50%')                // 圆 / 椭圆
   * ```
   *
   * ### 经典用法
   *
   * ```ts
   * s.borderRadius('50%')                // 圆形（正方形元素时）
   * s.borderRadius.px(8)                 // 卡片圆角
   * s.borderRadius._md                   // 主题 token
   *
   * // 仅单边圆角
   * s.borderRadius('8px 0 0 8px')        // 左侧圆角，右侧直角
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderRadius.px(200)         ≡ s.borderRadius('200px')
   * s.borderRadius.rem(1.5)        ≡ s.borderRadius('1.5rem')
   * s.borderRadius.em(2)           ≡ s.borderRadius('2em')      // 当前元素 font-size 的倍数
   * s.borderRadius.vw(50)          ≡ s.borderRadius('50vw')     // 视口宽 1%
   * s.borderRadius.dvw(50)         ≡ s.borderRadius('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderRadius.cqw(50)         ≡ s.borderRadius('50cqw')    // container query 容器尺寸
   * s.borderRadius.percent(50)     ≡ s.borderRadius('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderRadius('calc(100% - 32px)')
   * s.borderRadius('min(100%, 1200px)')
   * s.borderRadius('max(280px, 50%)')
   * s.borderRadius('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'8px'` `'1rem'` | 具体长度 |
   * | `<percentage>` | `'50%'` | 相对元素对应轴尺寸 |
   * | 1/2/3/4 值简写 | `'8px 16px 4px 0'` | 左上 / 右上 / 右下 / 左下 |
   * | 椭圆角 | `'10px / 20px'` | `/` 前横半径，后纵半径 |
   * | 数学函数 | `'calc(...)'` | calc / min / max / clamp |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
   * | :-----: | :-----: | :-----: | :----: | :---: |
   * |  **4**  |  **4**  |  **5**  | **12** | **9** |
   * | 1 _-x-_ |         | 3 _-x-_ |        |       |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-radius
   */
  borderRadius: PropCarrier<CssValueOf<'borderRadius'>, RadiusTokens<T>, GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width> || <line-style> || <color>`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **1**  |  **1**  | **1**  | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-right
     */
  borderRight: PropFn<CssValueOf<'borderRight'>>
  /**
   * 设置元素**四条边框的样式**。这是显示边框的**开关** —— 默认 `none` 不显示，必须显式设为 `solid` 等才能看到边框。
   *
   * ## 关键字
   *
   * ### 10 个样式关键字
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。完全无边框，不占任何空间 |
   * | `hidden` | 视觉效果同 `none`（无边框），但在**表格冲突边框解析**中优先级高于 `none` |
   * | `dotted` | **点状**虚线边框（圆点） |
   * | `dashed` | **虚线**边框（短横线） |
   * | `solid` | **实线**边框（最常用） |
   * | `double` | **双线**边框（两条平行实线 + 中间空隙；总宽 ≥ 3px 才能看出效果） |
   * | `groove` | **凹槽**：模拟凹下去的边框（3D 效果，浏览器渲染差异大） |
   * | `ridge` | **凸脊**：模拟凸起的边框（3D 效果，与 `groove` 视觉相反） |
   * | `inset` | **凹陷**：让元素看起来嵌入页面（上左暗，下右亮） |
   * | `outset` | **凸起**：让元素看起来浮出页面（上左亮，下右暗） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderStyle`。⚠️ `borderStyle` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `borderStyle` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderStyle` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderStyle` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 重要：边框三件套
   *
   * CSS 边框需要 **width + style + color** 三件齐全才显示：
   *
   * - `borderWidth` 默认 `medium`（≈3px）✓
   * - `borderStyle` 默认 `none` ✗ **必须显式设**
   * - `borderColor` 默认 `currentColor`（跟随文字色）✓
   *
   * ### hidden vs none 在表格中
   *
   * `borderCollapse: collapse` 时，相邻单元格边框冲突解析：
   * - `hidden` 优先级**最高**，强制不显示
   * - `none` 优先级**最低**，让对方边框显示
   *
   * ### 简写：1/2/3/4 值
   *
   * ```ts
   * s.borderStyle.solid                            // 四边 solid
   * s.borderStyle('solid dashed')                  // 上下 solid，左右 dashed
   * s.borderStyle('solid dashed dotted none')      // 上 / 右 / 下 / 左
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 10 个样式 keyword | `none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset` | 见上方关键字表 |
   * | 1/2/3/4 值简写 | `'solid dashed'` | 上 / 右 / 下 / 左 顺时针 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-style
   */
  borderStyle: PropCarrier<CssValueOf<'borderStyle'>, never, 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width> || <line-style> || <color>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-top
     */
  borderTop: PropFn<CssValueOf<'borderTop'>>
  /**
   * 设置元素**四条边框的宽度**（简写，可一次设 1/2/3/4 个值）。⚠️ 必须配合非 `none` 的 `borderStyle` 才会显示。
   *
   * ## 关键字
   *
   * ### 3 个尺寸关键字（浏览器约定值）
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `thin` | 细边框（约 **1px**；具体由浏览器决定） |
   * | `medium` | 中等边框（**默认值**，约 **3px**） |
   * | `thick` | 粗边框（约 **5px**） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `borderWidth`。⚠️ `borderWidth` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `medium` |
   * | `unset` | `borderWidth` 非继承属性 → 等同 `initial`（= `medium`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `borderWidth` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `borderWidth` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写：1/2/3/4 值
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `borderWidth.px(1)` | 四边均为 1px |
   * | `borderWidth('1px 2px')` | 上下 1px，左右 2px |
   * | `borderWidth('1px 2px 3px 4px')` | 上 / 右 / 下 / 左（顺时针） |
   *
   * ### 必须配合 borderStyle
   *
   * ```ts
   * // ❌ 不显示
   * s.borderWidth.px(2)
   * s.borderColor._primary
   * // ✅
   * s.borderWidth.px(2)
   * s.borderStyle.solid
   * s.borderColor._primary
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.borderWidth.px(200)         ≡ s.borderWidth('200px')
   * s.borderWidth.rem(1.5)        ≡ s.borderWidth('1.5rem')
   * s.borderWidth.em(2)           ≡ s.borderWidth('2em')      // 当前元素 font-size 的倍数
   * s.borderWidth.vw(50)          ≡ s.borderWidth('50vw')     // 视口宽 1%
   * s.borderWidth.dvw(50)         ≡ s.borderWidth('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.borderWidth.cqw(50)         ≡ s.borderWidth('50cqw')    // container query 容器尺寸
   * s.borderWidth.percent(50)     ≡ s.borderWidth('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.borderWidth('calc(100% - 32px)')
   * s.borderWidth('min(100%, 1200px)')
   * s.borderWidth('max(280px, 50%)')
   * s.borderWidth('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'1px'` `'0.5rem'` | 具体长度（不能为负） |
   * | 3 个 keyword | `thin` ｜ `medium` ｜ `thick` | 浏览器约定值 |
   * | 1/2/3/4 值简写 | `'1px 2px 3px 4px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `medium`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-width
   */
  borderWidth: PropCarrier<CssValueOf<'borderWidth'>, BordersTokens<T>, 'thin' | 'medium' | 'thick' | GlobalKw, LengthUnits, never>
  /** **Syntax**: `<'caret-color'> || <'caret-shape'>` */
  caret: PropFn<CssValueOf<'caret'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **50**  | **52**  |  **9**  | **12** | **10** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-rule
     */
  columnRule: PropFn<CssValueOf<'columnRule'>>
  /**
   * 把元素内容**分成多栏**（类似报纸 / 杂志排版）。可指定栏数或栏宽。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动算（按 column-width 决定，或不分栏） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `columns`。⚠️ `columns` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `columns` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `columns` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `columns` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态
   *
   * ```ts
   * s.columns(3)                  // 3 栏（自动调整栏宽）
   * s.columns('300px')            // 每栏 300px（栏数自动）
   * s.columns('3 300px')          // 最多 3 栏，每栏不少于 300px
   * ```
   *
   * ### 用例
   *
   * ```ts
   * s.columns('250px')
   *   .columnGap.px(24)
   * // 类似 Pinterest 风格的多栏内容
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 栏数 | `3` `4` | 整数（栏数） |
   * | 栏宽 | `'300px'` `'20em'` | 每栏理想宽度 |
   * | 两值组合 | `'3 300px'` | 栏数 + 栏宽 |
   * | `auto` | — | 默认 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari  |  Edge  |   IE   |
   * | :----: | :-----: | :-----: | :----: | :----: |
   * | **50** | **52**  |  **9**  | **12** | **10** |
   * |        |         | 3 _-x-_ |        |        |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/columns
   */
  columns: PropCarrier<CssValueOf<'columns'>, never, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * **内禀占位尺寸**简写 —— 给 `contain: size` 或 `content-visibility: auto` 的元素一个"预估尺寸",避免坍缩。
   *
   * ## 关键字
   *
   * ### 取值形式
   *
   * | 形式 | 行为 |
   * | --- | --- |
   * | `none` | **默认值**。无内禀尺寸,可能坍缩 |
   * | `auto <length>` | **推荐**。`auto` 让浏览器记住实际渲染尺寸;`<length>` 是首次渲染前的占位 |
   * | `<length>` | 固定内禀宽 = 高 = N |
   * | `<length> <length>` | 分别设宽 高 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `containIntrinsicSize`。⚠️ `containIntrinsicSize` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `containIntrinsicSize` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `containIntrinsicSize` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `containIntrinsicSize` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **核心用途**:与 `content-visibility: auto` 配合实现**虚拟滚动列表**:
   *
   * ```ts
   * s.contentVisibility('auto')
   * s.containIntrinsicSize('auto 200px')   // 预估每项 200px 高
   * // → 视口外的项跳过渲染,布局滚动条仍准确
   * ```
   *
   * `auto` 让浏览器记住实际渲染过的尺寸,**滚动回去时复用**,避免抖动。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `none` | — | 无内禀尺寸 |
   * | `auto <length>` | `'auto 200px'` `'auto 100px 200px'` | 推荐:auto + 占位 |
   * | `<length>` | `'200px'` `'100px 200px'` | 固定占位 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **83** | **107** | **17** | **83** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/contain-intrinsic-size
   */
  containIntrinsicSize: PropFn<CssValueOf<'containIntrinsicSize'>>
  /**
   * **容器查询**简写 —— `container-name` 与 `container-type` 二合一,声明本元素成为**查询容器**让子节点用 `@container` 按本元素尺寸响应。
   *
   * ## 关键字
   *
   * ### 语法形式
   *
   * | 形式 | 展开 | 示例 |
   * | --- | --- | --- |
   * | 仅名 | `container-name: <name>` | `'card'` |
   * | 仅型 | `container-type: <type>` | `'inline-size'` |
   * | 名 / 型 | `<name> / <type>` | `'card / inline-size'` |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `container`。⚠️ `container` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `none` |
   * | `unset` | `container` 非继承属性 → 等同 `initial`（= `none`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `container` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `container` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **容器查询 vs 媒体查询**:
   * - `@media (min-width: 768px)` —— 看**视口宽度**,所有位置都用这个全局阈值
   * - `@container (min-width: 400px)` —— 看**最近的查询容器宽度**;同一组件放在 sidebar 和 main 里自动用不同布局
   *
   * **典型用法**:
   * ```ts
   * // 父级:声明本元素是 inline-size 容器
   * s.container('card / inline-size')   // 等同 'container-type: inline-size; container-name: card'
   *
   * // 子级:CSS @container 查询
   * // @container card (min-width: 400px) { .grid { grid-template-columns: 1fr 1fr } }
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 名 / 型 | `'card / inline-size'` | 完整简写 |
   * | 仅类型 | `'inline-size'` `'size'` | 匿名容器 |
   * | `none` | — | 不作为容器(默认) |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `none`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox | Safari |  Edge   | IE  |
   * | :-----: | :-----: | :----: | :-----: | :-: |
   * | **105** | **110** | **16** | **105** | No  |
   *
   * Chrome 105+ / Safari 16+ / Firefox 110+(2023 全面落地)。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/container
   */
  container: PropFn<CssValueOf<'container'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |    IE    |
     * | :------: | :-----: | :-----: | :----: | :------: |
     * |  **29**  | **22**  |  **9**  | **12** |  **11**  |
     * | 21 _-x-_ |         | 7 _-x-_ |        | 10 _-x-_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex
     */
  flex: PropFn<CssValueOf<'flex'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<'flex-direction'> || <'flex-wrap'>`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :------: | :-----: | :-----: | :----: | :----: |
     * |  **29**  | **28**  |  **9**  | **12** | **11** |
     * | 21 _-x-_ |         | 7 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex-flow
     */
  flexFlow: PropFn<CssValueOf<'flexFlow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ [ <'font-style'> || <font-variant-css2> || <'font-weight'> || <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ] | <system-family-name>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font
     */
  font: PropFn<CssValueOf<'font'>>
  /**
   * flex / grid / 多栏布局中**子元素之间的间距**（同时设行/列间距的简写）。比传统 `margin` 方案更优 —— 不会在边缘产生多余间距。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `normal` | **默认值**。flex/grid 中等于 `0`；多栏布局中浏览器默认值 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `gap`。⚠️ `gap` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `normal` |
   * | `unset` | `gap` 非继承属性 → 等同 `initial`（= `normal`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `gap` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `gap` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写：1 或 2 个值
   *
   * ```ts
   * s.gap.px(12)                  // 行列都 12px
   * s.gap('12px 24px')            // 行间距 12px，列间距 24px
   * ```
   *
   * 等价于：
   *
   * ```ts
   * s.rowGap.px(12)
   * s.columnGap.px(24)
   * ```
   *
   * ### gap vs margin
   *
   * | 方案 | 边缘多余间距 | 适应换行 |
   * | --- | --- | --- |
   * | `gap` | ✗ 无 | ✓ 自动 |
   * | `margin` | ✓ 有（需配合 `:first-child` 等） | ✗ 需手动处理 |
   *
   * `gap` 是现代 CSS 推荐方案。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.gap.px(200)         ≡ s.gap('200px')
   * s.gap.rem(1.5)        ≡ s.gap('1.5rem')
   * s.gap.em(2)           ≡ s.gap('2em')      // 当前元素 font-size 的倍数
   * s.gap.vw(50)          ≡ s.gap('50vw')     // 视口宽 1%
   * s.gap.dvw(50)         ≡ s.gap('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.gap.cqw(50)         ≡ s.gap('50cqw')    // container query 容器尺寸
   * s.gap.percent(50)     ≡ s.gap('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.gap('calc(100% - 32px)')
   * s.gap('min(100%, 1200px)')
   * s.gap('max(280px, 50%)')
   * s.gap('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 1 个 `<length>` | `'12px'` `'1rem'` | 行列相同 |
   * | 2 个 `<length>` | `'12px 24px'` | 行间距 / 列间距 |
   * | `<percentage>` | `'5%'` | 相对容器尺寸 |
   * | `normal` | — | 默认；flex/grid 中等于 0 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `normal`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **57** | **52**  | **10.1** | **16** | No  |
   *
   * flex `gap` 较晚普及：Chrome 84 / Firefox 63 / Safari 14.1。早期可用 margin + 负 margin 兼容方案。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/gap
   */
  gap: PropCarrier<CssValueOf<'gap'>, SpacingTokens<T>, 'normal' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<'grid-template'> | <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? | [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid
     */
  grid: PropFn<CssValueOf<'grid'>>
  /**
   * grid 子元素的**完整位置简写**（4 个值：row-start / column-start / row-end / column-end），或引用 `gridTemplateAreas` 中命名的区域。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。自动分配 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `gridArea`。⚠️ `gridArea` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `gridArea` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `gridArea` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `gridArea` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 两种用法
   *
   * **1. 引用命名区域**（最常用）：
   *
   * ```ts
   * // 父容器
   * s.display.grid
   *   .gridTemplateAreas(`
   *     "header header"
   *     "sidebar main"
   *     "footer footer"
   *   `)
   *
   * // 子元素引用区域名
   * s.gridArea('header')
   * s.gridArea('main')
   * ```
   *
   * **2. 4 值定位**（rowStart / colStart / rowEnd / colEnd）：
   *
   * ```ts
   * s.gridArea('1 / 1 / 3 / 3')             // 占据 (1,1) 到 (3,3)
   * s.gridArea('1 / 1 / span 2 / span 2')   // 同上，用 span 表达
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `auto` | — | 默认；自动分配 |
   * | 命名区域 | `'header'` | 引用 gridTemplateAreas 中的区域名 |
   * | 4 个值 | `'1 / 1 / 3 / 3'` | rowStart / colStart / rowEnd / colEnd |
   * | span 跨度 | `'1 / 1 / span 2 / span 2'` | 从 (1,1) 起跨 2×2 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **57** | **52**  | **10.1** | **16** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-area
   */
  gridArea: PropCarrier<CssValueOf<'gridArea'>, never, 'auto' | GlobalKw, unknown, never>
  /**
   * grid **子元素**占据的**列范围**（简写：`grid-column-start / grid-column-end`）。可用线编号 / 命名线 / span 跨度。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。自动分配（按 grid-auto-flow 顺序填入） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `gridColumn`。⚠️ `gridColumn` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `gridColumn` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `gridColumn` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `gridColumn` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态语法
   *
   * ```ts
   * s.gridColumn('1 / 3')              // 第 1 到 3 条线（跨 2 格）
   * s.gridColumn('span 2')             // 从当前位置起跨 2 格
   * s.gridColumn('2 / span 3')         // 从第 2 条线开始，跨 3 格
   * s.gridColumn('1 / -1')             // 撑满整行（-1 = 最后一条线）
   * s.gridColumn('main-start / main-end')  // 命名线
   * ```
   *
   * ### 线编号规则
   *
   * grid 列线从 **1** 开始（不是 0），最后一条线可用 `-1` 表示。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `auto` | — | 默认；自动分配 |
   * | 单值（终点用 auto） | `'2'` | 从第 2 条线开始 |
   * | start / end | `'1 / 3'` | 起始线 / 结束线 |
   * | span 跨度 | `'span 2'` `'2 / span 3'` | 跨 N 格 |
   * | 撑满整行 | `'1 / -1'` | 从第 1 条线到最后一条 |
   * | 命名线 | `'main-start / main-end'` | 使用 gridTemplate 中命名的线 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **57** | **52**  | **10.1** | **16** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-column
   */
  gridColumn: PropCarrier<CssValueOf<'gridColumn'>, never, 'auto' | GlobalKw, unknown, never>
  /**
   * grid **子元素**占据的**行范围**（简写）。规则同 `gridColumn`，方向变为垂直。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。自动分配（按 grid-auto-flow 顺序填入） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `gridRow`。⚠️ `gridRow` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `gridRow` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `gridRow` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `gridRow` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 函数态语法
   *
   * ```ts
   * s.gridColumn('1 / 3')              // 第 1 到 3 条线（跨 2 格）
   * s.gridColumn('span 2')             // 从当前位置起跨 2 格
   * s.gridColumn('2 / span 3')         // 从第 2 条线开始，跨 3 格
   * s.gridColumn('1 / -1')             // 撑满整行（-1 = 最后一条线）
   * s.gridColumn('main-start / main-end')  // 命名线
   * ```
   *
   * ### 线编号规则
   *
   * grid 列线从 **1** 开始（不是 0），最后一条线可用 `-1` 表示。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `auto` | — | 默认；自动分配 |
   * | 单值 | `'2'` | 从第 2 条行线开始 |
   * | start / end | `'1 / 3'` | 起始行线 / 结束行线 |
   * | span 跨度 | `'span 2'` | 跨 N 行 |
   * | 撑满整列 | `'1 / -1'` | 从第 1 条到最后一条行线 |
   * | 命名线 | `'header-start / footer-end'` | 使用 gridTemplate 中命名的线 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **57** | **52**  | **10.1** | **16** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-row
   */
  gridRow: PropCarrier<CssValueOf<'gridRow'>, never, 'auto' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `none | [ <'grid-template-rows'> / <'grid-template-columns'> ] | [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]?`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-template
     */
  gridTemplate: PropFn<CssValueOf<'gridTemplate'>>
  /**
   * **定位偏移简写**：同时设置 `top` / `right` / `bottom` / `left` 四个偏移值。**只在 `position` 非 `static` 时生效**。
   *
   * ## 关键字
   *
   * ### 1 个偏移关键字
   *
   * | 关键字 | 效果 | 说明 |
   * | --- | --- | --- |
   * | `auto` | **默认值**。不参与定位，交由浏览器按正常文档流决定位置 | 未定位元素（`position: static`）的默认状态；也用于取消之前设过的偏移 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `inset`。⚠️ `inset` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `inset` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `inset` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `inset` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### ⚠️ 必须配合 position: relative/absolute/fixed/sticky 才生效
   *
   * `top` / `right` / `bottom` / `left`（以及 `inset`）对 `position: static`（默认值）的元素**无效**。
   *
   * ### 简写语法（与 margin/padding 相同的 1/2/3/4 值规则）
   *
   * ```ts
   * s.inset.px(0)                     // 四边均偏移 0（常用于绝对定位充满父容器）
   * s.inset('0 16px')                 // 上下 0，左右 16px
   * s.inset('8px 16px 24px 32px')     // 上 右 下 左（顺时针）
   * ```
   *
   * ### 偏移基准（四种定位各不同）
   *
   * | position | 偏移基准 |
   * | --- | --- |
   * | `relative` | **元素原始位置**（偏移后原位仍占空间） |
   * | `absolute` | **最近的定位祖先**（position 非 static 的祖先）的 padding-box 边缘 |
   * | `fixed` | **视口**（viewport）边缘（⚠️ 祖先有 `transform` / `will-change: transform` / `filter` 时变为祖先 padding-box） |
   * | `sticky` | 正常文档流位置（偏移值 = 粘住后距视口边缘的距离） |
   *
   * ### 绝对定位充满父容器
   *
   * ```ts
   * s.position.absolute
   * s.inset.px(0)   // 等同 top:0 right:0 bottom:0 left:0
   * // 前提：父容器 position 不是 static
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.inset.px(200)         ≡ s.inset('200px')
   * s.inset.rem(1.5)        ≡ s.inset('1.5rem')
   * s.inset.em(2)           ≡ s.inset('2em')      // 当前元素 font-size 的倍数
   * s.inset.vw(50)          ≡ s.inset('50vw')     // 视口宽 1%
   * s.inset.dvw(50)         ≡ s.inset('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.inset.cqw(50)         ≡ s.inset('50cqw')    // container query 容器尺寸
   * s.inset.percent(50)     ≡ s.inset('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.inset('calc(100% - 32px)')
   * s.inset('min(100%, 1200px)')
   * s.inset('max(280px, 50%)')
   * s.inset('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | — | **默认值**；不偏移，由文档流决定位置 |
   * | 多值简写 | `'0 16px'` `'8px 16px 24px 32px'` | 1/2/3/4 个值，顺时针分配到四边 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **87** | **66**  | **14.1** | **87** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset
   */
  inset: PropCarrier<CssValueOf<'inset'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>{1,2}`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **63**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset-block
     */
  insetBlock: PropFn<CssValueOf<'insetBlock'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>{1,2}`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **63**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset-inline
     */
  insetInline: PropFn<CssValueOf<'insetInline'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <integer>`
     *
     * **Initial value**: `none`
     *
     * |   Chrome    |   Firefox    |  Safari   |     Edge     | IE  |
     * | :---------: | :----------: | :-------: | :----------: | :-: |
     * | **6** _-x-_ | **68** _-x-_ | 18.2-18.4 | **17** _-x-_ | No  |
     * |             |              |  5 _-x-_  |              |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/line-clamp
     */
  lineClamp: PropFn<CssValueOf<'lineClamp'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'list-style-type'> || <'list-style-position'> || <'list-style-image'>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/list-style
     */
  listStyle: PropFn<CssValueOf<'listStyle'>>
  /**
   * 设置元素**四条边外边距**（简写，可一次设 1/2/3/4 个值）。外边距是元素边框外到相邻元素之间的透明空间。
   *
   * ## 关键字
   *
   * ### 1 个外边距关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `auto` | 浏览器按剩余空间自动分配。**常用于水平居中**：`margin: 0 auto` 让块级元素在父容器中水平居中（左右各自分配剩余空间的一半） | 水平居中：`s.margin('0 auto')`；`margin-left: auto` 把元素推到右侧（flex 布局右对齐技巧） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `margin`。⚠️ `margin` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `margin` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `margin` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `margin` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `margin('16px')` | 四边均为 16px |
   * | `margin('8px 16px')` | 上下 8px，左右 16px |
   * | `margin('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `margin('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### 水平居中经典写法
   *
   * ```ts
   * s.width.px(800)
   * s.margin('0 auto')
   * // 块级元素 800px 宽，左右 auto 均分剩余空间 = 水平居中
   * // 等价于：marginLeft.auto + marginRight.auto
   * ```
   *
   * ⚠️ `margin: auto` **只在水平方向**对 block 元素生效；垂直居中需用 flex / grid。
   *
   * ### 百分比参照
   *
   * `margin: 25%` 参照**父元素宽度**（即使是 marginTop / marginBottom 也参照宽，这是反直觉的 CSS 规则）。
   *
   * ### 外边距折叠（Margin Collapse）
   *
   * ⚠️ **只有普通文档流中的块级元素**在**垂直方向**会发生外边距折叠：
   * - 相邻兄弟元素：两个上下 margin 取较大值（不是相加）
   * - 父子元素：父无 border/padding/BFC 时，子元素的 marginTop 会"穿透"成为父元素的 marginTop
   *
   * **以下情况不折叠**：flex 容器子项、grid 子项、绝对定位元素、inline 元素。
   *
   * ### 接受负值
   *
   * `margin` 接受**负值**，可以让元素向反方向移动甚至与相邻元素重叠。`padding` **不接受负值**。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.margin.px(200)         ≡ s.margin('200px')
   * s.margin.rem(1.5)        ≡ s.margin('1.5rem')
   * s.margin.em(2)           ≡ s.margin('2em')      // 当前元素 font-size 的倍数
   * s.margin.vw(50)          ≡ s.margin('50vw')     // 视口宽 1%
   * s.margin.dvw(50)         ≡ s.margin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.margin.cqw(50)         ≡ s.margin('50cqw')    // container query 容器尺寸
   * s.margin.percent(50)     ≡ s.margin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.margin('calc(100% - 32px)')
   * s.margin('min(100%, 1200px)')
   * s.margin('max(280px, 50%)')
   * s.margin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | `'auto'`（或多值如 `'0 auto'`） | 让浏览器按剩余空间分配；`0 auto` 水平居中 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，按上述简写规则分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **3** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin
   */
  margin: PropCarrier<CssValueOf<'margin'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * **逻辑属性**：同时设置元素块轴（Block Axis）起止两端的外边距。水平书写模式下等同 `marginTop + marginBottom`；竖排文字模式下等同左右外边距。其他规则同 [`margin`]。
   *
   * ## 关键字
   *
   * ### 1 个外边距关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `auto` | 浏览器按剩余空间自动分配。**常用于水平居中**：`margin: 0 auto` 让块级元素在父容器中水平居中（左右各自分配剩余空间的一半） | 水平居中：`s.margin('0 auto')`；`margin-left: auto` 把元素推到右侧（flex 布局右对齐技巧） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `marginBlock`。⚠️ `marginBlock` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `marginBlock` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `marginBlock` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `marginBlock` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `margin('16px')` | 四边均为 16px |
   * | `margin('8px 16px')` | 上下 8px，左右 16px |
   * | `margin('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `margin('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### 水平居中经典写法
   *
   * ```ts
   * s.width.px(800)
   * s.margin('0 auto')
   * // 块级元素 800px 宽，左右 auto 均分剩余空间 = 水平居中
   * // 等价于：marginLeft.auto + marginRight.auto
   * ```
   *
   * ⚠️ `margin: auto` **只在水平方向**对 block 元素生效；垂直居中需用 flex / grid。
   *
   * ### 百分比参照
   *
   * `margin: 25%` 参照**父元素宽度**（即使是 marginTop / marginBottom 也参照宽，这是反直觉的 CSS 规则）。
   *
   * ### 外边距折叠（Margin Collapse）
   *
   * ⚠️ **只有普通文档流中的块级元素**在**垂直方向**会发生外边距折叠：
   * - 相邻兄弟元素：两个上下 margin 取较大值（不是相加）
   * - 父子元素：父无 border/padding/BFC 时，子元素的 marginTop 会"穿透"成为父元素的 marginTop
   *
   * **以下情况不折叠**：flex 容器子项、grid 子项、绝对定位元素、inline 元素。
   *
   * ### 接受负值
   *
   * `margin` 接受**负值**，可以让元素向反方向移动甚至与相邻元素重叠。`padding` **不接受负值**。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.margin.px(200)         ≡ s.margin('200px')
   * s.margin.rem(1.5)        ≡ s.margin('1.5rem')
   * s.margin.em(2)           ≡ s.margin('2em')      // 当前元素 font-size 的倍数
   * s.margin.vw(50)          ≡ s.margin('50vw')     // 视口宽 1%
   * s.margin.dvw(50)         ≡ s.margin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.margin.cqw(50)         ≡ s.margin('50cqw')    // container query 容器尺寸
   * s.margin.percent(50)     ≡ s.margin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.margin('calc(100% - 32px)')
   * s.margin('min(100%, 1200px)')
   * s.margin('max(280px, 50%)')
   * s.margin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | `'auto'`（或多值如 `'0 auto'`） | 让浏览器按剩余空间分配；`0 auto` 水平居中 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，按上述简写规则分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **87** | **66**  | **14.1** | **87** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-block
   */
  marginBlock: PropCarrier<CssValueOf<'marginBlock'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * **逻辑属性**：同时设置元素行轴（Inline Axis）起止两端的外边距。水平书写模式下等同 `marginLeft + marginRight`。`marginInline.auto` 水平居中（等同 `margin: 0 auto`）。其他规则同 [`margin`]。
   *
   * ## 关键字
   *
   * ### 1 个外边距关键字
   *
   * | 关键字 | 效果 | 典型用途 |
   * | --- | --- | --- |
   * | `auto` | 浏览器按剩余空间自动分配。**常用于水平居中**：`margin: 0 auto` 让块级元素在父容器中水平居中（左右各自分配剩余空间的一半） | 水平居中：`s.margin('0 auto')`；`margin-left: auto` 把元素推到右侧（flex 布局右对齐技巧） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `marginInline`。⚠️ `marginInline` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `marginInline` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `marginInline` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `marginInline` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `margin('16px')` | 四边均为 16px |
   * | `margin('8px 16px')` | 上下 8px，左右 16px |
   * | `margin('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `margin('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### 水平居中经典写法
   *
   * ```ts
   * s.width.px(800)
   * s.margin('0 auto')
   * // 块级元素 800px 宽，左右 auto 均分剩余空间 = 水平居中
   * // 等价于：marginLeft.auto + marginRight.auto
   * ```
   *
   * ⚠️ `margin: auto` **只在水平方向**对 block 元素生效；垂直居中需用 flex / grid。
   *
   * ### 百分比参照
   *
   * `margin: 25%` 参照**父元素宽度**（即使是 marginTop / marginBottom 也参照宽，这是反直觉的 CSS 规则）。
   *
   * ### 外边距折叠（Margin Collapse）
   *
   * ⚠️ **只有普通文档流中的块级元素**在**垂直方向**会发生外边距折叠：
   * - 相邻兄弟元素：两个上下 margin 取较大值（不是相加）
   * - 父子元素：父无 border/padding/BFC 时，子元素的 marginTop 会"穿透"成为父元素的 marginTop
   *
   * **以下情况不折叠**：flex 容器子项、grid 子项、绝对定位元素、inline 元素。
   *
   * ### 接受负值
   *
   * `margin` 接受**负值**，可以让元素向反方向移动甚至与相邻元素重叠。`padding` **不接受负值**。
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.margin.px(200)         ≡ s.margin('200px')
   * s.margin.rem(1.5)        ≡ s.margin('1.5rem')
   * s.margin.em(2)           ≡ s.margin('2em')      // 当前元素 font-size 的倍数
   * s.margin.vw(50)          ≡ s.margin('50vw')     // 视口宽 1%
   * s.margin.dvw(50)         ≡ s.margin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.margin.cqw(50)         ≡ s.margin('50cqw')    // container query 容器尺寸
   * s.margin.percent(50)     ≡ s.margin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.margin('calc(100% - 32px)')
   * s.margin('min(100%, 1200px)')
   * s.margin('max(280px, 50%)')
   * s.margin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | `auto` | `'auto'`（或多值如 `'0 auto'`） | 让浏览器按剩余空间分配；`0 auto` 水平居中 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，按上述简写规则分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **87** | **66**  | **14.1** | **87** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-inline
   */
  marginInline: PropCarrier<CssValueOf<'marginInline'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * **遮罩**简写 —— 用一张图像/渐变作为元素**透明度模板**:模板黑色区域元素**隐藏**、白色**显示**、灰色按 alpha 半透明。一句话设全部 8 个子属性。
   *
   * ## 关键字
   *
   * ### 简写顺序
   *
   * | 位置 | 对应子属性 | 默认值 |
   * | --- | --- | --- |
   * | 第 1 段 | `mask-image` | `none` |
   * | 第 2 段 | `mask-mode` | `match-source` |
   * | 第 3 段 | `mask-repeat` | `repeat` |
   * | 第 4 段 | `mask-position` `/` `mask-size` | `center` `/` `auto` |
   * | 第 5 段 | `mask-origin` | `border-box` |
   * | 第 6 段 | `mask-clip` | `border-box` |
   * | 第 7 段 | `mask-composite` | `add` |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `mask`。⚠️ `mask` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `see individual properties` |
   * | `unset` | `mask` 非继承属性 → 等同 `initial`（= `see individual properties`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `mask` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `mask` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * **与 `background` 对偶**:写法几乎一致(image / position / size / repeat / origin / clip / composite),只是用途是"透明度模板"而非"背景图"。
   *
   * **典型用法**:
   * ```ts
   * s.mask('url(./fade.svg) center / cover no-repeat')         // SVG 蒙版居中盖满
   * s.mask('linear-gradient(black 50%, transparent) center')   // 渐变模板,上半显示下半淡出
   * ```
   *
   * **SVG `<mask>` 引用**: `mask: url(#myMask)` —— 引用同文档 SVG `<mask id="myMask">` 元素。
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<image>` | `'url(./mask.png)'` `'linear-gradient(black, transparent)'` | 图像 / 渐变作为蒙版 |
   * | `<id>` | `'url(#svgMaskId)'` | 引用 SVG `<mask>` 元素 |
   * | `none` | — | 无蒙版(默认) |
   * | 完整简写 | `'url(./m.svg) 50% / cover no-repeat'` | 组合多子属性 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `see individual properties`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari   | Edge  | IE  |
   * | :-----: | :-----: | :-------: | :---: | :-: |
   * | **120** | **53**  | **15.4**  | 12-79 | No  |
   * | 1 _-x-_ |         | 3.1 _-x-_ |       |     |
   *
   * WebKit 系曾用 `-webkit-mask-*` 前缀,现代 Chrome/Safari/Firefox 均原生支持无前缀(Firefox 53+ / Chrome 120+ / Safari 15.4+)。生产环境推荐双写 `-webkit-mask` + `mask`。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask
   */
  mask: PropFn<CssValueOf<'mask'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<'mask-border-source'> || <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? || <'mask-border-repeat'> || <'mask-border-mode'>`
     *
     * |              Chrome              | Firefox |             Safari             |               Edge                | IE  |
     * | :------------------------------: | :-----: | :----------------------------: | :-------------------------------: | :-: |
     * | **1** _(-webkit-mask-box-image)_ |   No    |            **17.2**            | **79** _(-webkit-mask-box-image)_ | No  |
     * |                                  |         | 3.1 _(-webkit-mask-box-image)_ |                                   |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-border
     */
  maskBorder: PropFn<CssValueOf<'maskBorder'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `[ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> || <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]?`
     *
     * |    Chrome     | Firefox | Safari |  Edge  | IE  |
     * | :-----------: | :-----: | :----: | :----: | :-: |
     * |    **55**     | **72**  | **16** | **79** | No  |
     * | 46 _(motion)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset
     */
  motion: PropFn<CssValueOf<'motion'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `[ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> || <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]?`
     *
     * |    Chrome     | Firefox | Safari |  Edge  | IE  |
     * | :-----------: | :-----: | :----: | :----: | :-: |
     * |    **55**     | **72**  | **16** | **79** | No  |
     * | 46 _(motion)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset
     */
  offset: PropFn<CssValueOf<'offset'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2023.
     *
     * **Syntax**: `<'outline-width'> || <'outline-style'> || <'outline-color'>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :------: | :----: | :---: |
     * | **94** | **88**  | **16.4** | **94** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/outline
     */
  outline: PropFn<CssValueOf<'outline'>>
  /**
   * 控制元素**内容溢出容器时**的处理方式（裁剪 / 滚动 / 显示）。可作 X 和 Y 两轴的简写。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `visible` | **默认值**。溢出内容可见（超出容器边界），不裁剪 |
   * | `hidden` | **裁剪**溢出，**不显示滚动条**；用户无法手动滚动，但 JS `scrollTo` 仍可 |
   * | `scroll` | **强制**显示滚动条（即使没溢出也占滚动条空间） |
   * | `auto` | 内容**溢出时**才显示滚动条（最常用） |
   * | `clip` | 同 `hidden` 但**禁止程序滚动**（更严格）；不创建滚动容器（不会成为 `sticky` 的祖先滚动容器） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `overflow`。⚠️ `overflow` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `visible` |
   * | `unset` | `overflow` 非继承属性 → 等同 `initial`（= `visible`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `overflow` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `overflow` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 两值简写
   *
   * `overflow` 可写 1 或 2 个值：第一个是 X，第二个是 Y。1 值时两轴相同。
   *
   * ```ts
   * s.overflow.hidden                   // 两轴都裁剪
   * s.overflow('auto hidden')           // X 滚动条按需，Y 裁剪
   * s.overflow.auto                     // 内容溢出时出滚动条
   * ```
   *
   * ### 创建 BFC 的副作用
   *
   * 任何非 `visible` 的 `overflow` 值都会**触发 BFC**（块格式化上下文），可用于：
   * - 包含浮动子元素（清浮动）
   * - 防止外边距合并
   *
   * ### 常见陷阱
   *
   * - `overflow: hidden` 在父级会**让 `position: sticky` 失效** —— sticky 找不到可粘的滚动祖先
   * - 父级 `overflow: hidden` **不会**裁剪 `position: absolute` 子元素，除非父级也 `position: relative`
   * - `overflow: scroll` 在 macOS 默认配置下滚动条不可见（hover 才出），但仍预留空间
   * - `overflow: clip` 不创建滚动容器 —— 适合纯视觉裁剪而不想破坏 sticky
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 1 个 keyword | `visible` ｜ `hidden` ｜ `scroll` ｜ `auto` ｜ `clip` | 两轴相同 |
   * | 2 个 keyword | `'auto hidden'` | 第 1 个 X，第 2 个 Y |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `visible`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * `clip` 较晚：Chrome 90 / Firefox 81 / Safari 16。其他远古支持。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow
   */
  overflow: PropCarrier<CssValueOf<'overflow'>, never, 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `[ contain | none | auto ]{1,2}`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **63** | **59**  | **16** | **18** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overscroll-behavior
     */
  overscrollBehavior: PropFn<CssValueOf<'overscrollBehavior'>>
  /**
   * 设置元素**四条边内边距**（简写，可一次设 1/2/3/4 个值）。内边距是内容区与边框之间的透明空间，会撑大元素盒子（content-box 模式），背景色/图会延伸到内边距区域。
   *
   * ## 关键字
   *
   * ### padding 关键字（仅含 auto，实际很少用）
   *
   * | 关键字 | 效果 | 说明 |
   * | --- | --- | --- |
   * | `auto` | 浏览器自动计算。⚠️ **`padding` 很少用 auto**，
   * 实际仅在某些布局情形（如 flex/grid 的 padding-inline）有意义 | 通常写具体长度值；`auto` 不像 margin 那样有居中效果 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `padding`。⚠️ `padding` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `padding` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `padding` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `padding` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值，与 margin 完全相同）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `padding('16px')` | 四边均为 16px |
   * | `padding('8px 16px')` | 上下 8px，左右 16px |
   * | `padding('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `padding('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### ⚠️ padding 不接受负值
   *
   * `padding` 不同于 `margin`，**不接受负值**。负 padding 无效，会被浏览器忽略。
   *
   * ### 背景延伸到 padding 区域
   *
   * 默认 `background-clip: border-box`，背景色/图会填充 padding 区域（直到边框）。
   * 改为 `background-clip: content-box` 可让背景只覆盖内容区。
   *
   * ### 百分比参照
   *
   * `padding: 25%` 参照**父元素宽度**（即使是 paddingTop / paddingBottom 也参照宽，同 margin）。
   * 这一点常被误解 —— 常用于实现"固定比例"盒子（如 16:9 视频容器）：
   *
   * ```ts
   * s.paddingTop('56.25%')   // = 16:9 比例（9/16 = 56.25%）
   * // 配合子元素 position:absolute 实现固定宽高比容器
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.padding.px(200)         ≡ s.padding('200px')
   * s.padding.rem(1.5)        ≡ s.padding('1.5rem')
   * s.padding.em(2)           ≡ s.padding('2em')      // 当前元素 font-size 的倍数
   * s.padding.vw(50)          ≡ s.padding('50vw')     // 视口宽 1%
   * s.padding.dvw(50)         ≡ s.padding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.padding.cqw(50)         ≡ s.padding('50cqw')    // container query 容器尺寸
   * s.padding.percent(50)     ≡ s.padding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.padding('calc(100% - 32px)')
   * s.padding('min(100%, 1200px)')
   * s.padding('max(280px, 50%)')
   * s.padding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，顺时针分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  |  IE   |
   * | :----: | :-----: | :----: | :----: | :---: |
   * | **1**  |  **1**  | **1**  | **12** | **4** |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding
   */
  padding: PropCarrier<CssValueOf<'padding'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * **逻辑属性**：同时设置元素块轴两端的内边距。水平书写模式下等同 `paddingTop + paddingBottom`。其他规则同 [`padding`]。
   *
   * ## 关键字
   *
   * ### padding 关键字（仅含 auto，实际很少用）
   *
   * | 关键字 | 效果 | 说明 |
   * | --- | --- | --- |
   * | `auto` | 浏览器自动计算。⚠️ **`padding` 很少用 auto**，
   * 实际仅在某些布局情形（如 flex/grid 的 padding-inline）有意义 | 通常写具体长度值；`auto` 不像 margin 那样有居中效果 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `paddingBlock`。⚠️ `paddingBlock` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `paddingBlock` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `paddingBlock` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `paddingBlock` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值，与 margin 完全相同）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `padding('16px')` | 四边均为 16px |
   * | `padding('8px 16px')` | 上下 8px，左右 16px |
   * | `padding('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `padding('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### ⚠️ padding 不接受负值
   *
   * `padding` 不同于 `margin`，**不接受负值**。负 padding 无效，会被浏览器忽略。
   *
   * ### 背景延伸到 padding 区域
   *
   * 默认 `background-clip: border-box`，背景色/图会填充 padding 区域（直到边框）。
   * 改为 `background-clip: content-box` 可让背景只覆盖内容区。
   *
   * ### 百分比参照
   *
   * `padding: 25%` 参照**父元素宽度**（即使是 paddingTop / paddingBottom 也参照宽，同 margin）。
   * 这一点常被误解 —— 常用于实现"固定比例"盒子（如 16:9 视频容器）：
   *
   * ```ts
   * s.paddingTop('56.25%')   // = 16:9 比例（9/16 = 56.25%）
   * // 配合子元素 position:absolute 实现固定宽高比容器
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.padding.px(200)         ≡ s.padding('200px')
   * s.padding.rem(1.5)        ≡ s.padding('1.5rem')
   * s.padding.em(2)           ≡ s.padding('2em')      // 当前元素 font-size 的倍数
   * s.padding.vw(50)          ≡ s.padding('50vw')     // 视口宽 1%
   * s.padding.dvw(50)         ≡ s.padding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.padding.cqw(50)         ≡ s.padding('50cqw')    // container query 容器尺寸
   * s.padding.percent(50)     ≡ s.padding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.padding('calc(100% - 32px)')
   * s.padding('min(100%, 1200px)')
   * s.padding('max(280px, 50%)')
   * s.padding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，顺时针分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **87** | **66**  | **14.1** | **87** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-block
   */
  paddingBlock: PropCarrier<CssValueOf<'paddingBlock'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
   * **逻辑属性**：同时设置元素行轴两端的内边距。水平书写模式下等同 `paddingLeft + paddingRight`。其他规则同 [`padding`]。
   *
   * ## 关键字
   *
   * ### padding 关键字（仅含 auto，实际很少用）
   *
   * | 关键字 | 效果 | 说明 |
   * | --- | --- | --- |
   * | `auto` | 浏览器自动计算。⚠️ **`padding` 很少用 auto**，
   * 实际仅在某些布局情形（如 flex/grid 的 padding-inline）有意义 | 通常写具体长度值；`auto` 不像 margin 那样有居中效果 |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `paddingInline`。⚠️ `paddingInline` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `paddingInline` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `paddingInline` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `paddingInline` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 简写语法（1/2/3/4 值，与 margin 完全相同）
   *
   * | 写法 | 效果 |
   * | --- | --- |
   * | `padding('16px')` | 四边均为 16px |
   * | `padding('8px 16px')` | 上下 8px，左右 16px |
   * | `padding('4px 8px 12px')` | 上 4px，左右 8px，下 12px |
   * | `padding('4px 8px 12px 16px')` | 上 4px，右 8px，下 12px，左 16px（顺时针） |
   *
   * ### ⚠️ padding 不接受负值
   *
   * `padding` 不同于 `margin`，**不接受负值**。负 padding 无效，会被浏览器忽略。
   *
   * ### 背景延伸到 padding 区域
   *
   * 默认 `background-clip: border-box`，背景色/图会填充 padding 区域（直到边框）。
   * 改为 `background-clip: content-box` 可让背景只覆盖内容区。
   *
   * ### 百分比参照
   *
   * `padding: 25%` 参照**父元素宽度**（即使是 paddingTop / paddingBottom 也参照宽，同 margin）。
   * 这一点常被误解 —— 常用于实现"固定比例"盒子（如 16:9 视频容器）：
   *
   * ```ts
   * s.paddingTop('56.25%')   // = 16:9 比例（9/16 = 56.25%）
   * // 配合子元素 position:absolute 实现固定宽高比容器
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.padding.px(200)         ≡ s.padding('200px')
   * s.padding.rem(1.5)        ≡ s.padding('1.5rem')
   * s.padding.em(2)           ≡ s.padding('2em')      // 当前元素 font-size 的倍数
   * s.padding.vw(50)          ≡ s.padding('50vw')     // 视口宽 1%
   * s.padding.dvw(50)         ≡ s.padding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.padding.cqw(50)         ≡ s.padding('50cqw')    // container query 容器尺寸
   * s.padding.percent(50)     ≡ s.padding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.padding('calc(100% - 32px)')
   * s.padding('min(100%, 1200px)')
   * s.padding('max(280px, 50%)')
   * s.padding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'200px'` `'12rem'` `'8em'` `'50vw'` `'50dvw'` `'50cqw'` `'16ch'` | 绝对/字体/视口/容器查询单位 |
   * | `<percentage>` | `'50%'` | 参照基准见详细说明 |
   * | 数学函数 | `'calc(100% - 32px)'` `'min(...)'` `'max(...)'` `'clamp(...)'` | 加减乘除 / 取小 / 取大 / 区间 |
   * | 多值简写 | `'8px 16px'` `'4px 8px 12px 16px'` | 1/2/3/4 个值，顺时针分配 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **87** | **66**  | **14.1** | **87** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-inline
   */
  paddingInline: PropCarrier<CssValueOf<'paddingInline'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'align-content'> <'justify-content'>?`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **59** | **45**  | **9**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/place-content
     */
  placeContent: PropFn<CssValueOf<'placeContent'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'align-items'> <'justify-items'>?`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **59** | **45**  | **11** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/place-items
     */
  placeItems: PropFn<CssValueOf<'placeItems'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'align-self'> <'justify-self'>?`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **59** | **45**  | **11** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/place-self
     */
  placeSelf: PropFn<CssValueOf<'placeSelf'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<'position-try-order'>? <'position-try-fallbacks'>`
     *
     * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
     * | :-----: | :---------: | :----: | :-----: | :-: |
     * | **125** | **preview** | **26** | **125** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position-try
     */
  positionTry: PropFn<CssValueOf<'positionTry'>>
  /**
   * 设置 snap item **对齐时**距容器边缘的**外边距偏移**（简写，1/2/3/4 值，类似 `margin`）。让 snap 时留出呼吸空间。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度（可负），**无关键字**` —— undefined
   * - `仅在元素是 snap item 时生效` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollMargin`。⚠️ `scrollMargin` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `scrollMargin` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollMargin` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollMargin` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 让 item 对齐时距容器左边缘留 20px 缓冲
   * s.scrollMargin.px(20)
   *
   * // 简写四方位
   * s.scrollMargin('10px 20px')
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollMargin.px(200)         ≡ s.scrollMargin('200px')
   * s.scrollMargin.rem(1.5)        ≡ s.scrollMargin('1.5rem')
   * s.scrollMargin.em(2)           ≡ s.scrollMargin('2em')      // 当前元素 font-size 的倍数
   * s.scrollMargin.vw(50)          ≡ s.scrollMargin('50vw')     // 视口宽 1%
   * s.scrollMargin.dvw(50)         ≡ s.scrollMargin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollMargin.cqw(50)         ≡ s.scrollMargin('50cqw')    // container query 容器尺寸
   * s.scrollMargin.percent(50)     ≡ s.scrollMargin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollMargin('calc(100% - 32px)')
   * s.scrollMargin('min(100%, 1200px)')
   * s.scrollMargin('max(280px, 50%)')
   * s.scrollMargin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'20px'` `'1rem'` | 可正可负 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |          Safari           |  Edge  | IE  |
   * | :----: | :-----: | :-----------------------: | :----: | :-: |
   * | **69** | **90**  |         **14.1**          | **79** | No  |
   * |        |         | 11 _(scroll-snap-margin)_ |        |     |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin
   */
  scrollMargin: PropCarrier<CssValueOf<'scrollMargin'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * snap 对齐时**块方向**（横排 = 纵轴）的外边距偏移（简写，1 或 2 值）。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度（可负），**无关键字**` —— undefined
   * - `仅在元素是 snap item 时生效` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollMarginBlock`。⚠️ `scrollMarginBlock` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `scrollMarginBlock` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollMarginBlock` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollMarginBlock` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 让 item 对齐时距容器左边缘留 20px 缓冲
   * s.scrollMargin.px(20)
   *
   * // 简写四方位
   * s.scrollMargin('10px 20px')
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollMargin.px(200)         ≡ s.scrollMargin('200px')
   * s.scrollMargin.rem(1.5)        ≡ s.scrollMargin('1.5rem')
   * s.scrollMargin.em(2)           ≡ s.scrollMargin('2em')      // 当前元素 font-size 的倍数
   * s.scrollMargin.vw(50)          ≡ s.scrollMargin('50vw')     // 视口宽 1%
   * s.scrollMargin.dvw(50)         ≡ s.scrollMargin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollMargin.cqw(50)         ≡ s.scrollMargin('50cqw')    // container query 容器尺寸
   * s.scrollMargin.percent(50)     ≡ s.scrollMargin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollMargin('calc(100% - 32px)')
   * s.scrollMargin('min(100%, 1200px)')
   * s.scrollMargin('max(280px, 50%)')
   * s.scrollMargin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'20px'` `'1rem'` | 可正可负 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **69** | **68**  | **15** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-block
   */
  scrollMarginBlock: PropCarrier<CssValueOf<'scrollMarginBlock'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * snap 对齐时**行内方向**（横排 = 横轴）的外边距偏移（简写）。
   *
   * ## 关键字
   *
   * ### 此属性的特点
   *
   * - `只接受长度（可负），**无关键字**` —— undefined
   * - `仅在元素是 snap item 时生效` —— undefined
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollMarginInline`。⚠️ `scrollMarginInline` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `0` |
   * | `unset` | `scrollMarginInline` 非继承属性 → 等同 `initial`（= `0`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollMarginInline` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollMarginInline` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例
   *
   * ```ts
   * // 让 item 对齐时距容器左边缘留 20px 缓冲
   * s.scrollMargin.px(20)
   *
   * // 简写四方位
   * s.scrollMargin('10px 20px')
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollMargin.px(200)         ≡ s.scrollMargin('200px')
   * s.scrollMargin.rem(1.5)        ≡ s.scrollMargin('1.5rem')
   * s.scrollMargin.em(2)           ≡ s.scrollMargin('2em')      // 当前元素 font-size 的倍数
   * s.scrollMargin.vw(50)          ≡ s.scrollMargin('50vw')     // 视口宽 1%
   * s.scrollMargin.dvw(50)         ≡ s.scrollMargin('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollMargin.cqw(50)         ≡ s.scrollMargin('50cqw')    // container query 容器尺寸
   * s.scrollMargin.percent(50)     ≡ s.scrollMargin('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollMargin('calc(100% - 32px)')
   * s.scrollMargin('min(100%, 1200px)')
   * s.scrollMargin('max(280px, 50%)')
   * s.scrollMargin('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `<length>` | `'20px'` `'1rem'` | 可正可负 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `0`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **69** | **68**  | **15** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-inline
   */
  scrollMarginInline: PropCarrier<CssValueOf<'scrollMarginInline'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * 在**滚动容器**上设置**内边距偏移** —— 让 snap point 距容器边缘留出空间（如固定头部、侧栏）。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动算（一般是 0） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollPadding`。⚠️ `scrollPadding` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `scrollPadding` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollPadding` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollPadding` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：固定头部 + snap
   *
   * ```ts
   * // 容器上
   * s.scrollPaddingTop.px(80)           // snap 时为顶部固定头部留 80px
   * // snap 子项对齐时不会贴到容器顶部，而是顶部留出 80px
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollPadding.px(200)         ≡ s.scrollPadding('200px')
   * s.scrollPadding.rem(1.5)        ≡ s.scrollPadding('1.5rem')
   * s.scrollPadding.em(2)           ≡ s.scrollPadding('2em')      // 当前元素 font-size 的倍数
   * s.scrollPadding.vw(50)          ≡ s.scrollPadding('50vw')     // 视口宽 1%
   * s.scrollPadding.dvw(50)         ≡ s.scrollPadding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollPadding.cqw(50)         ≡ s.scrollPadding('50cqw')    // container query 容器尺寸
   * s.scrollPadding.percent(50)     ≡ s.scrollPadding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollPadding('calc(100% - 32px)')
   * s.scrollPadding('min(100%, 1200px)')
   * s.scrollPadding('max(280px, 50%)')
   * s.scrollPadding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `auto` | — | 默认；浏览器自动 |
   * | `<length>` | `'20px'` | 具体长度（不可负） |
   * | `<percentage>` | `'10%'` | 相对容器对应轴尺寸 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox |  Safari  |  Edge  | IE  |
   * | :----: | :-----: | :------: | :----: | :-: |
   * | **69** | **68**  | **14.1** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding
   */
  scrollPadding: PropCarrier<CssValueOf<'scrollPadding'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * 滚动容器**块方向**（横排 = 纵轴）的内边距偏移（简写）。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动算（一般是 0） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollPaddingBlock`。⚠️ `scrollPaddingBlock` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `scrollPaddingBlock` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollPaddingBlock` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollPaddingBlock` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：固定头部 + snap
   *
   * ```ts
   * // 容器上
   * s.scrollPaddingTop.px(80)           // snap 时为顶部固定头部留 80px
   * // snap 子项对齐时不会贴到容器顶部，而是顶部留出 80px
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollPadding.px(200)         ≡ s.scrollPadding('200px')
   * s.scrollPadding.rem(1.5)        ≡ s.scrollPadding('1.5rem')
   * s.scrollPadding.em(2)           ≡ s.scrollPadding('2em')      // 当前元素 font-size 的倍数
   * s.scrollPadding.vw(50)          ≡ s.scrollPadding('50vw')     // 视口宽 1%
   * s.scrollPadding.dvw(50)         ≡ s.scrollPadding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollPadding.cqw(50)         ≡ s.scrollPadding('50cqw')    // container query 容器尺寸
   * s.scrollPadding.percent(50)     ≡ s.scrollPadding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollPadding('calc(100% - 32px)')
   * s.scrollPadding('min(100%, 1200px)')
   * s.scrollPadding('max(280px, 50%)')
   * s.scrollPadding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `auto` | — | 默认；浏览器自动 |
   * | `<length>` | `'20px'` | 具体长度（不可负） |
   * | `<percentage>` | `'10%'` | 相对容器对应轴尺寸 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **69** | **68**  | **15** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-block
   */
  scrollPaddingBlock: PropCarrier<CssValueOf<'scrollPaddingBlock'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
   * 滚动容器**行内方向**（横排 = 横轴）的内边距偏移（简写）。
   *
   * ## 关键字
   *
   * ### 1 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `auto` | **默认值**。浏览器自动算（一般是 0） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `scrollPaddingInline`。⚠️ `scrollPaddingInline` **非继承属性**，写 `inherit` 才显式继承 |
   * | `initial` | 重置为 CSS spec 初始值 `auto` |
   * | `unset` | `scrollPaddingInline` 非继承属性 → 等同 `initial`（= `auto`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `scrollPaddingInline` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `scrollPaddingInline` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### 用例：固定头部 + snap
   *
   * ```ts
   * // 容器上
   * s.scrollPaddingTop.px(80)           // snap 时为顶部固定头部留 80px
   * // snap 子项对齐时不会贴到容器顶部，而是顶部留出 80px
   * ```
   *
   * ### 长度单位
   *
   * zui Chain 提供单位方法简写：
   *
   * ```ts
   * s.scrollPadding.px(200)         ≡ s.scrollPadding('200px')
   * s.scrollPadding.rem(1.5)        ≡ s.scrollPadding('1.5rem')
   * s.scrollPadding.em(2)           ≡ s.scrollPadding('2em')      // 当前元素 font-size 的倍数
   * s.scrollPadding.vw(50)          ≡ s.scrollPadding('50vw')     // 视口宽 1%
   * s.scrollPadding.dvw(50)         ≡ s.scrollPadding('50dvw')    // 动态视口（移动浏览器 UI 折叠跟随）
   * s.scrollPadding.cqw(50)         ≡ s.scrollPadding('50cqw')    // container query 容器尺寸
   * s.scrollPadding.percent(50)     ≡ s.scrollPadding('50%')
   * ```
   *
   * ### 数学函数
   *
   * ```ts
   * s.scrollPadding('calc(100% - 32px)')
   * s.scrollPadding('min(100%, 1200px)')
   * s.scrollPadding('max(280px, 50%)')
   * s.scrollPadding('clamp(280px, 50%, 1200px)')
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | `auto` | — | 默认；浏览器自动 |
   * | `<length>` | `'20px'` | 具体长度（不可负） |
   * | `<percentage>` | `'10%'` | 相对容器对应轴尺寸 |
   * | 1/2/3/4 值 | `'10px 20px'` | 上 / 右 / 下 / 左 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `auto`
   *
   * ### 浏览器
   *
   * | Chrome | Firefox | Safari |  Edge  | IE  |
   * | :----: | :-----: | :----: | :----: | :-: |
   * | **69** | **68**  | **15** | **79** | No  |
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-inline
   */
  scrollPaddingInline: PropCarrier<CssValueOf<'scrollPaddingInline'>, SpacingTokens<T>, GlobalKw, LengthUnits, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2021.
     *
     * **Syntax**: `<length>{1,4}`
     *
     * | Chrome | Firefox |          Safari           |  Edge  | IE  |
     * | :----: | :-----: | :-----------------------: | :----: | :-: |
     * | **69** |  68-90  |         **14.1**          | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin
     */
  scrollSnapMargin: PropFn<CssValueOf<'scrollSnapMargin'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <'scroll-timeline-name'> <'scroll-timeline-axis'>? ]#`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-timeline
     */
  scrollTimeline: PropFn<CssValueOf<'scrollTimeline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'text-decoration-line'> || <'text-decoration-style'> || <'text-decoration-color'> || <'text-decoration-thickness'>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration
     */
  textDecoration: PropFn<CssValueOf<'textDecoration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `<'text-emphasis-style'> || <'text-emphasis-color'>`
     *
     * |  Chrome  | Firefox | Safari |   Edge   | IE  |
     * | :------: | :-----: | :----: | :------: | :-: |
     * |  **99**  | **46**  | **7**  |  **99**  | No  |
     * | 25 _-x-_ |         |        | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-emphasis
     */
  textEmphasis: PropFn<CssValueOf<'textEmphasis'>>
  /**
   * 控制**文本换行算法**（CSS Text 4）—— 让长段落的换行更美观（避免孤行、平衡每行长度）。
   *
   * ## 关键字
   *
   * ### 5 个 keyword
   *
   * | 关键字 | 行为 |
   * | --- | --- |
   * | `wrap` | **默认值**。允许换行 |
   * | `nowrap` | 不换行（同 `whiteSpace: nowrap`） |
   * | `balance` | **平衡换行**：每行宽度尽量接近（标题最佳实践，避免最后一行只有 1-2 个词） |
   * | `pretty` | 美化换行：浏览器避免"孤行"（段尾单独一个词的悬挂行）；性能比 balance 好 |
   * | `stable` | 保证文字增量更新时**前面行不变**（罕用，文本动画场景） |
   *
   * ### 全局关键字
   *
   * | 关键字 | 含义 |
   * | --- | --- |
   * | `inherit` | 强制继承父元素 `textWrap`。⚠️ `textWrap` **默认就是继承属性**，写 `inherit` 仅在被局部覆盖后用来还原 |
   * | `initial` | 重置为 CSS spec 初始值 `wrap` |
   * | `unset` | `textWrap` 是继承属性 → 等同 `inherit`（向上找继承值，找不到才用 `initial`） |
   * | `revert` | 回到**浏览器 user-agent 样式表**中 `textWrap` 的值 |
   * | `revertLayer` | 回到上一个 CSS `@layer` 中 `textWrap` 的值；不在 layer 中等同 `revert` |
   *
   * ## 详细说明
   *
   * ### balance vs pretty
   *
   * | 关键字 | 用途 | 性能 |
   * | --- | --- | --- |
   * | `balance` | **标题** / 短段落（≤ 6 行）| 较慢，浏览器多次试算 |
   * | `pretty` | **长段落正文** | 性能好，主要避免最后一行孤行 |
   *
   * ### 用例
   *
   * ```ts
   * s.textWrap.balance              // 标题最佳实践
   *
   * s.textWrap.pretty               // 长段落（避免末行孤词）
   * ```
   *
   * ## 兼容性
   *
   * ### 可用写法（Syntax）
   *
   * | 形式 | 示例 | 备注 |
   * | --- | --- | --- |
   * | 5 个 keyword | `wrap` ｜ `nowrap` ｜ `balance` ｜ `pretty` ｜ `stable` | 只接受关键字 |
   * | 全局关键字 | `inherit` `initial` `unset` `revert` `revertLayer` | 见上方关键字表 |
   *
   * **Initial value**: `wrap`
   *
   * ### 浏览器
   *
   * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
   * | :-----: | :-----: | :------: | :-----: | :-: |
   * | **114** | **121** | **17.4** | **114** | No  |
   *
   * `balance` Chrome 114 / Firefox 121 / Safari 17.5。`pretty` Chrome 117。`stable` 渐进推广。
   *
   * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-wrap
   */
  textWrap: PropCarrier<CssValueOf<'textWrap'>, never, 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable' | GlobalKw, unknown, never>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-transition>#`
     *
     * | Chrome  | Firefox |  Safari   |  Edge  |   IE   |
     * | :-----: | :-----: | :-------: | :----: | :----: |
     * | **26**  | **16**  |   **9**   | **12** | **10** |
     * | 1 _-x-_ |         | 3.1 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transition
     */
  transition: PropFn<CssValueOf<'transition'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <'view-timeline-name'> [ <'view-timeline-axis'> || <'view-timeline-inset'> ]? ]#`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/view-timeline
     */
  viewTimeline: PropFn<CssValueOf<'viewTimeline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     */
  MozAnimationDelay: PropFn<CssValueOf<'MozAnimationDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-direction>#`
     *
     * **Initial value**: `normal`
     */
  MozAnimationDirection: PropFn<CssValueOf<'MozAnimationDirection'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ auto | <time [0s,∞]> ]#`
     *
     * **Initial value**: `0s`
     */
  MozAnimationDuration: PropFn<CssValueOf<'MozAnimationDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-fill-mode>#`
     *
     * **Initial value**: `none`
     */
  MozAnimationFillMode: PropFn<CssValueOf<'MozAnimationFillMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-iteration-count>#`
     *
     * **Initial value**: `1`
     */
  MozAnimationIterationCount: PropFn<CssValueOf<'MozAnimationIterationCount'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ none | <keyframes-name> ]#`
     *
     * **Initial value**: `none`
     */
  MozAnimationName: PropFn<CssValueOf<'MozAnimationName'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-play-state>#`
     *
     * **Initial value**: `running`
     */
  MozAnimationPlayState: PropFn<CssValueOf<'MozAnimationPlayState'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     */
  MozAnimationTimingFunction: PropFn<CssValueOf<'MozAnimationTimingFunction'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | button | button-arrow-down | button-arrow-next | button-arrow-previous | button-arrow-up | button-bevel | button-focus | caret | checkbox | checkbox-container | checkbox-label | checkmenuitem | dualbutton | groupbox | listbox | listitem | menuarrow | menubar | menucheckbox | menuimage | menuitem | menuitemtext | menulist | menulist-button | menulist-text | menulist-textfield | menupopup | menuradio | menuseparator | meterbar | meterchunk | progressbar | progressbar-vertical | progresschunk | progresschunk-vertical | radio | radio-container | radio-label | radiomenuitem | range | range-thumb | resizer | resizerpanel | scale-horizontal | scalethumbend | scalethumb-horizontal | scalethumbstart | scalethumbtick | scalethumb-vertical | scale-vertical | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | separator | sheet | spinner | spinner-downbutton | spinner-textfield | spinner-upbutton | splitter | statusbar | statusbarpanel | tab | tabpanel | tabpanels | tab-scroll-arrow-back | tab-scroll-arrow-forward | textfield | textfield-multiline | toolbar | toolbarbutton | toolbarbutton-dropdown | toolbargripper | toolbox | tooltip | treeheader | treeheadercell | treeheadersortarrow | treeitem | treeline | treetwisty | treetwistyopen | treeview | -moz-mac-unified-toolbar | -moz-win-borderless-glass | -moz-win-browsertabbar-toolbox | -moz-win-communicationstext | -moz-win-communications-toolbox | -moz-win-exclude-glass | -moz-win-glass | -moz-win-mediatext | -moz-win-media-toolbox | -moz-window-button-box | -moz-window-button-box-maximized | -moz-window-button-close | -moz-window-button-maximize | -moz-window-button-minimize | -moz-window-button-restore | -moz-window-frame-bottom | -moz-window-frame-left | -moz-window-frame-right | -moz-window-titlebar | -moz-window-titlebar-maximized`
     *
     * **Initial value**: `none` (but this value is overridden in the user agent CSS)
     */
  MozAppearance: PropFn<CssValueOf<'MozAppearance'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `visible | hidden`
     *
     * **Initial value**: `visible`
     */
  MozBackfaceVisibility: PropFn<CssValueOf<'MozBackfaceVisibility'>>
  /**
     * **Syntax**: `<url> | none`
     *
     * **Initial value**: `none`
     */
  MozBinding: PropFn<CssValueOf<'MozBinding'>>
  /**
     * **Syntax**: `<color>+ | none`
     *
     * **Initial value**: `none`
     */
  MozBorderBottomColors: PropFn<CssValueOf<'MozBorderBottomColors'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     */
  MozBorderEndColor: PropFn<CssValueOf<'MozBorderEndColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-style'>`
     *
     * **Initial value**: `none`
     */
  MozBorderEndStyle: PropFn<CssValueOf<'MozBorderEndStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'>`
     *
     * **Initial value**: `medium`
     */
  MozBorderEndWidth: PropFn<CssValueOf<'MozBorderEndWidth'>>
  /**
     * **Syntax**: `<color>+ | none`
     *
     * **Initial value**: `none`
     */
  MozBorderLeftColors: PropFn<CssValueOf<'MozBorderLeftColors'>>
  /**
     * **Syntax**: `<color>+ | none`
     *
     * **Initial value**: `none`
     */
  MozBorderRightColors: PropFn<CssValueOf<'MozBorderRightColors'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     */
  MozBorderStartColor: PropFn<CssValueOf<'MozBorderStartColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-style'>`
     *
     * **Initial value**: `none`
     */
  MozBorderStartStyle: PropFn<CssValueOf<'MozBorderStartStyle'>>
  /**
     * **Syntax**: `<color>+ | none`
     *
     * **Initial value**: `none`
     */
  MozBorderTopColors: PropFn<CssValueOf<'MozBorderTopColors'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `content-box | border-box`
     *
     * **Initial value**: `content-box`
     */
  MozBoxSizing: PropFn<CssValueOf<'MozBoxSizing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  MozColumnRuleColor: PropFn<CssValueOf<'MozColumnRuleColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'border-style'>`
     *
     * **Initial value**: `none`
     */
  MozColumnRuleStyle: PropFn<CssValueOf<'MozColumnRuleStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'border-width'>`
     *
     * **Initial value**: `medium`
     */
  MozColumnRuleWidth: PropFn<CssValueOf<'MozColumnRuleWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since November 2016.
     *
     * **Syntax**: `<length> | auto`
     *
     * **Initial value**: `auto`
     */
  MozColumnWidth: PropFn<CssValueOf<'MozColumnWidth'>>
  /**
     * **Syntax**: `none | [ fill | fill-opacity | stroke | stroke-opacity ]#`
     *
     * **Initial value**: `none`
     */
  MozContextProperties: PropFn<CssValueOf<'MozContextProperties'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `normal | <feature-tag-value>#`
     *
     * **Initial value**: `normal`
     */
  MozFontFeatureSettings: PropFn<CssValueOf<'MozFontFeatureSettings'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | <string>`
     *
     * **Initial value**: `normal`
     */
  MozFontLanguageOverride: PropFn<CssValueOf<'MozFontLanguageOverride'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | manual | auto`
     *
     * **Initial value**: `manual`
     */
  MozHyphens: PropFn<CssValueOf<'MozHyphens'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     */
  MozMarginEnd: PropFn<CssValueOf<'MozMarginEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     */
  MozMarginStart: PropFn<CssValueOf<'MozMarginStart'>>
  /**
     * The **`-moz-orient`** CSS property specifies the orientation of the element to which it's applied.
     *
     * **Syntax**: `inline | block | horizontal | vertical`
     *
     * **Initial value**: `inline`
     */
  MozOrient: PropFn<CssValueOf<'MozOrient'>>
  /**
     * The **`font-smooth`** CSS property controls the application of anti-aliasing when fonts are rendered.
     *
     * **Syntax**: `auto | never | always | <absolute-size> | <length>`
     *
     * **Initial value**: `auto`
     */
  MozOsxFontSmoothing: PropFn<CssValueOf<'MozOsxFontSmoothing'>>
  /**
     * **Syntax**: `<outline-radius>`
     *
     * **Initial value**: `0`
     */
  MozOutlineRadiusBottomleft: PropFn<CssValueOf<'MozOutlineRadiusBottomleft'>>
  /**
     * **Syntax**: `<outline-radius>`
     *
     * **Initial value**: `0`
     */
  MozOutlineRadiusBottomright: PropFn<CssValueOf<'MozOutlineRadiusBottomright'>>
  /**
     * **Syntax**: `<outline-radius>`
     *
     * **Initial value**: `0`
     */
  MozOutlineRadiusTopleft: PropFn<CssValueOf<'MozOutlineRadiusTopleft'>>
  /**
     * **Syntax**: `<outline-radius>`
     *
     * **Initial value**: `0`
     */
  MozOutlineRadiusTopright: PropFn<CssValueOf<'MozOutlineRadiusTopright'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     */
  MozPaddingEnd: PropFn<CssValueOf<'MozPaddingEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     */
  MozPaddingStart: PropFn<CssValueOf<'MozPaddingStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <length>`
     *
     * **Initial value**: `none`
     */
  MozPerspective: PropFn<CssValueOf<'MozPerspective'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<position>`
     *
     * **Initial value**: `50% 50%`
     */
  MozPerspectiveOrigin: PropFn<CssValueOf<'MozPerspectiveOrigin'>>
  /**
     * **Syntax**: `ignore | stretch-to-fit`
     *
     * **Initial value**: `stretch-to-fit`
     */
  MozStackSizing: PropFn<CssValueOf<'MozStackSizing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since August 2021.
     *
     * **Syntax**: `<integer> | <length>`
     *
     * **Initial value**: `8`
     */
  MozTabSize: PropFn<CssValueOf<'MozTabSize'>>
  /**
     * **Syntax**: `none | blink`
     *
     * **Initial value**: `none`
     */
  MozTextBlink: PropFn<CssValueOf<'MozTextBlink'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | auto | <percentage>`
     *
     * **Initial value**: `auto` for smartphone browsers supporting inflation, `none` in other cases (and then not modifiable).
     */
  MozTextSizeAdjust: PropFn<CssValueOf<'MozTextSizeAdjust'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <transform-list>`
     *
     * **Initial value**: `none`
     */
  MozTransform: PropFn<CssValueOf<'MozTransform'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?`
     *
     * **Initial value**: `50% 50% 0`
     */
  MozTransformOrigin: PropFn<CssValueOf<'MozTransformOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `flat | preserve-3d`
     *
     * **Initial value**: `flat`
     */
  MozTransformStyle: PropFn<CssValueOf<'MozTransformStyle'>>
  /**
     * The **`user-modify`** property has no effect in Firefox. It was originally planned to determine whether or not the content of an element can be edited by a user.
     *
     * **Syntax**: `read-only | read-write | write-only`
     *
     * **Initial value**: `read-only`
     */
  MozUserModify: PropFn<CssValueOf<'MozUserModify'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | text | none | all`
     *
     * **Initial value**: `auto`
     */
  MozUserSelect: PropFn<CssValueOf<'MozUserSelect'>>
  /**
     * **Syntax**: `drag | no-drag`
     *
     * **Initial value**: `drag`
     */
  MozWindowDragging: PropFn<CssValueOf<'MozWindowDragging'>>
  /**
     * **Syntax**: `default | menu | tooltip | sheet | none`
     *
     * **Initial value**: `default`
     */
  MozWindowShadow: PropFn<CssValueOf<'MozWindowShadow'>>
  /**
     * **Syntax**: `false | true`
     *
     * **Initial value**: `false`
     */
  msAccelerator: PropFn<CssValueOf<'msAccelerator'>>
  /**
     * **Syntax**: `tb | rl | bt | lr`
     *
     * **Initial value**: `tb`
     */
  msBlockProgression: PropFn<CssValueOf<'msBlockProgression'>>
  /**
     * **Syntax**: `none | chained`
     *
     * **Initial value**: `none`
     */
  msContentZoomChaining: PropFn<CssValueOf<'msContentZoomChaining'>>
  /**
     * **Syntax**: `<percentage>`
     *
     * **Initial value**: `400%`
     */
  msContentZoomLimitMax: PropFn<CssValueOf<'msContentZoomLimitMax'>>
  /**
     * **Syntax**: `<percentage>`
     *
     * **Initial value**: `100%`
     */
  msContentZoomLimitMin: PropFn<CssValueOf<'msContentZoomLimitMin'>>
  /**
     * **Syntax**: `snapInterval( <percentage>, <percentage> ) | snapList( <percentage># )`
     *
     * **Initial value**: `snapInterval(0%, 100%)`
     */
  msContentZoomSnapPoints: PropFn<CssValueOf<'msContentZoomSnapPoints'>>
  /**
     * **Syntax**: `none | proximity | mandatory`
     *
     * **Initial value**: `none`
     */
  msContentZoomSnapType: PropFn<CssValueOf<'msContentZoomSnapType'>>
  /**
     * **Syntax**: `none | zoom`
     *
     * **Initial value**: zoom for the top level element, none for all other elements
     */
  msContentZooming: PropFn<CssValueOf<'msContentZooming'>>
  /**
     * **Syntax**: `<string>`
     *
     * **Initial value**: "" (the empty string)
     */
  msFilter: PropFn<CssValueOf<'msFilter'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `row | row-reverse | column | column-reverse`
     *
     * **Initial value**: `row`
     */
  msFlexDirection: PropFn<CssValueOf<'msFlexDirection'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     */
  msFlexPositive: PropFn<CssValueOf<'msFlexPositive'>>
  /**
     * **Syntax**: `[ none | <custom-ident> ]#`
     *
     * **Initial value**: `none`
     */
  msFlowFrom: PropFn<CssValueOf<'msFlowFrom'>>
  /**
     * **Syntax**: `[ none | <custom-ident> ]#`
     *
     * **Initial value**: `none`
     */
  msFlowInto: PropFn<CssValueOf<'msFlowInto'>>
  /**
     * **Syntax**: `none | <track-list> | <auto-track-list>`
     *
     * **Initial value**: `none`
     */
  msGridColumns: PropFn<CssValueOf<'msGridColumns'>>
  /**
     * **Syntax**: `none | <track-list> | <auto-track-list>`
     *
     * **Initial value**: `none`
     */
  msGridRows: PropFn<CssValueOf<'msGridRows'>>
  /**
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     */
  msHighContrastAdjust: PropFn<CssValueOf<'msHighContrastAdjust'>>
  /**
     * **Syntax**: `auto | <integer>{1,3}`
     *
     * **Initial value**: `auto`
     */
  msHyphenateLimitChars: PropFn<CssValueOf<'msHyphenateLimitChars'>>
  /**
     * **Syntax**: `no-limit | <integer>`
     *
     * **Initial value**: `no-limit`
     */
  msHyphenateLimitLines: PropFn<CssValueOf<'msHyphenateLimitLines'>>
  /**
     * **Syntax**: `<percentage> | <length>`
     *
     * **Initial value**: `0`
     */
  msHyphenateLimitZone: PropFn<CssValueOf<'msHyphenateLimitZone'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | manual | auto`
     *
     * **Initial value**: `manual`
     */
  msHyphens: PropFn<CssValueOf<'msHyphens'>>
  /**
     * **Syntax**: `auto | after`
     *
     * **Initial value**: `auto`
     */
  msImeAlign: PropFn<CssValueOf<'msImeAlign'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `auto | loose | normal | strict | anywhere`
     *
     * **Initial value**: `auto`
     */
  msLineBreak: PropFn<CssValueOf<'msLineBreak'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `0`
     */
  msOrder: PropFn<CssValueOf<'msOrder'>>
  /**
     * **Syntax**: `auto | none | scrollbar | -ms-autohiding-scrollbar`
     *
     * **Initial value**: `auto`
     */
  msOverflowStyle: PropFn<CssValueOf<'msOverflowStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `visible | hidden | clip | scroll | auto`
     *
     * **Initial value**: `visible`
     */
  msOverflowX: PropFn<CssValueOf<'msOverflowX'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `visible | hidden | clip | scroll | auto`
     *
     * **Initial value**: `visible`
     */
  msOverflowY: PropFn<CssValueOf<'msOverflowY'>>
  /**
     * **Syntax**: `chained | none`
     *
     * **Initial value**: `chained`
     */
  msScrollChaining: PropFn<CssValueOf<'msScrollChaining'>>
  /**
     * **Syntax**: `auto | <length>`
     *
     * **Initial value**: `auto`
     */
  msScrollLimitXMax: PropFn<CssValueOf<'msScrollLimitXMax'>>
  /**
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     */
  msScrollLimitXMin: PropFn<CssValueOf<'msScrollLimitXMin'>>
  /**
     * **Syntax**: `auto | <length>`
     *
     * **Initial value**: `auto`
     */
  msScrollLimitYMax: PropFn<CssValueOf<'msScrollLimitYMax'>>
  /**
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     */
  msScrollLimitYMin: PropFn<CssValueOf<'msScrollLimitYMin'>>
  /**
     * **Syntax**: `none | railed`
     *
     * **Initial value**: `railed`
     */
  msScrollRails: PropFn<CssValueOf<'msScrollRails'>>
  /**
     * **Syntax**: `snapInterval( <length-percentage>, <length-percentage> ) | snapList( <length-percentage># )`
     *
     * **Initial value**: `snapInterval(0px, 100%)`
     */
  msScrollSnapPointsX: PropFn<CssValueOf<'msScrollSnapPointsX'>>
  /**
     * **Syntax**: `snapInterval( <length-percentage>, <length-percentage> ) | snapList( <length-percentage># )`
     *
     * **Initial value**: `snapInterval(0px, 100%)`
     */
  msScrollSnapPointsY: PropFn<CssValueOf<'msScrollSnapPointsY'>>
  /**
     * **Syntax**: `none | proximity | mandatory`
     *
     * **Initial value**: `none`
     */
  msScrollSnapType: PropFn<CssValueOf<'msScrollSnapType'>>
  /**
     * **Syntax**: `none | vertical-to-horizontal`
     *
     * **Initial value**: `none`
     */
  msScrollTranslation: PropFn<CssValueOf<'msScrollTranslation'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: depends on user agent
     */
  msScrollbar3dlightColor: PropFn<CssValueOf<'msScrollbar3dlightColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `ButtonText`
     */
  msScrollbarArrowColor: PropFn<CssValueOf<'msScrollbarArrowColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: depends on user agent
     */
  msScrollbarBaseColor: PropFn<CssValueOf<'msScrollbarBaseColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `ThreeDDarkShadow`
     */
  msScrollbarDarkshadowColor: PropFn<CssValueOf<'msScrollbarDarkshadowColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `ThreeDFace`
     */
  msScrollbarFaceColor: PropFn<CssValueOf<'msScrollbarFaceColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `ThreeDHighlight`
     */
  msScrollbarHighlightColor: PropFn<CssValueOf<'msScrollbarHighlightColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `ThreeDDarkShadow`
     */
  msScrollbarShadowColor: PropFn<CssValueOf<'msScrollbarShadowColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `Scrollbar`
     */
  msScrollbarTrackColor: PropFn<CssValueOf<'msScrollbarTrackColor'>>
  /**
     * **Syntax**: `none | ideograph-alpha | ideograph-numeric | ideograph-parenthesis | ideograph-space`
     *
     * **Initial value**: `none`
     */
  msTextAutospace: PropFn<CssValueOf<'msTextAutospace'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | all | [ digits <integer>? ]`
     *
     * **Initial value**: `none`
     */
  msTextCombineHorizontal: PropFn<CssValueOf<'msTextCombineHorizontal'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ clip | ellipsis | <string> ]{1,2}`
     *
     * **Initial value**: `clip`
     */
  msTextOverflow: PropFn<CssValueOf<'msTextOverflow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2019.
     *
     * **Syntax**: `auto | none | [ [ pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom ] | manipulation`
     *
     * **Initial value**: `auto`
     */
  msTouchAction: PropFn<CssValueOf<'msTouchAction'>>
  /**
     * **Syntax**: `grippers | none`
     *
     * **Initial value**: `grippers`
     */
  msTouchSelect: PropFn<CssValueOf<'msTouchSelect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <transform-list>`
     *
     * **Initial value**: `none`
     */
  msTransform: PropFn<CssValueOf<'msTransform'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?`
     *
     * **Initial value**: `50% 50% 0`
     */
  msTransformOrigin: PropFn<CssValueOf<'msTransformOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     */
  msTransitionDelay: PropFn<CssValueOf<'msTransitionDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     */
  msTransitionDuration: PropFn<CssValueOf<'msTransitionDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <single-transition-property>#`
     *
     * **Initial value**: all
     */
  msTransitionProperty: PropFn<CssValueOf<'msTransitionProperty'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     */
  msTransitionTimingFunction: PropFn<CssValueOf<'msTransitionTimingFunction'>>
  /**
     * **Syntax**: `none | element | text`
     *
     * **Initial value**: `text`
     */
  msUserSelect: PropFn<CssValueOf<'msUserSelect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | break-all | keep-all | break-word | auto-phrase`
     *
     * **Initial value**: `normal`
     */
  msWordBreak: PropFn<CssValueOf<'msWordBreak'>>
  /**
     * **Syntax**: `auto | both | start | end | maximum | clear`
     *
     * **Initial value**: `auto`
     */
  msWrapFlow: PropFn<CssValueOf<'msWrapFlow'>>
  /**
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     */
  msWrapMargin: PropFn<CssValueOf<'msWrapMargin'>>
  /**
     * **Syntax**: `wrap | none`
     *
     * **Initial value**: `wrap`
     */
  msWrapThrough: PropFn<CssValueOf<'msWrapThrough'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr`
     *
     * **Initial value**: `horizontal-tb`
     */
  msWritingMode: PropFn<CssValueOf<'msWritingMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position>`
     *
     * **Initial value**: `normal`
     */
  WebkitAlignContent: PropFn<CssValueOf<'WebkitAlignContent'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `normal | stretch | <baseline-position> | [ <overflow-position>? <self-position> ] | anchor-center`
     *
     * **Initial value**: `normal`
     */
  WebkitAlignItems: PropFn<CssValueOf<'WebkitAlignItems'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `auto | normal | stretch | <baseline-position> | <overflow-position>? <self-position> | anchor-center`
     *
     * **Initial value**: `auto`
     */
  WebkitAlignSelf: PropFn<CssValueOf<'WebkitAlignSelf'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     */
  WebkitAnimationDelay: PropFn<CssValueOf<'WebkitAnimationDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-direction>#`
     *
     * **Initial value**: `normal`
     */
  WebkitAnimationDirection: PropFn<CssValueOf<'WebkitAnimationDirection'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ auto | <time [0s,∞]> ]#`
     *
     * **Initial value**: `0s`
     */
  WebkitAnimationDuration: PropFn<CssValueOf<'WebkitAnimationDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-fill-mode>#`
     *
     * **Initial value**: `none`
     */
  WebkitAnimationFillMode: PropFn<CssValueOf<'WebkitAnimationFillMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-iteration-count>#`
     *
     * **Initial value**: `1`
     */
  WebkitAnimationIterationCount: PropFn<CssValueOf<'WebkitAnimationIterationCount'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ none | <keyframes-name> ]#`
     *
     * **Initial value**: `none`
     */
  WebkitAnimationName: PropFn<CssValueOf<'WebkitAnimationName'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-play-state>#`
     *
     * **Initial value**: `running`
     */
  WebkitAnimationPlayState: PropFn<CssValueOf<'WebkitAnimationPlayState'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     */
  WebkitAnimationTimingFunction: PropFn<CssValueOf<'WebkitAnimationTimingFunction'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | button | button-bevel | caret | checkbox | default-button | inner-spin-button | listbox | listitem | media-controls-background | media-controls-fullscreen-background | media-current-time-display | media-enter-fullscreen-button | media-exit-fullscreen-button | media-fullscreen-button | media-mute-button | media-overlay-play-button | media-play-button | media-seek-back-button | media-seek-forward-button | media-slider | media-sliderthumb | media-time-remaining-display | media-toggle-closed-captions-button | media-volume-slider | media-volume-slider-container | media-volume-sliderthumb | menulist | menulist-button | menulist-text | menulist-textfield | meter | progress-bar | progress-bar-value | push-button | radio | searchfield | searchfield-cancel-button | searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical | square-button | textarea | textfield | -apple-pay-button`
     *
     * **Initial value**: `none` (but this value is overridden in the user agent CSS)
     */
  WebkitAppearance: PropFn<CssValueOf<'WebkitAppearance'>>
  /**
     * Since September 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | <filter-value-list>`
     *
     * **Initial value**: `none`
     */
  WebkitBackdropFilter: PropFn<CssValueOf<'WebkitBackdropFilter'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `visible | hidden`
     *
     * **Initial value**: `visible`
     */
  WebkitBackfaceVisibility: PropFn<CssValueOf<'WebkitBackfaceVisibility'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-clip>#`
     *
     * **Initial value**: `border-box`
     */
  WebkitBackgroundClip: PropFn<CssValueOf<'WebkitBackgroundClip'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<visual-box>#`
     *
     * **Initial value**: `padding-box`
     */
  WebkitBackgroundOrigin: PropFn<CssValueOf<'WebkitBackgroundOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-size>#`
     *
     * **Initial value**: `auto auto`
     */
  WebkitBackgroundSize: PropFn<CssValueOf<'WebkitBackgroundSize'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  WebkitBorderBeforeColor: PropFn<CssValueOf<'WebkitBorderBeforeColor'>>
  /**
     * **Syntax**: `<'border-style'>`
     *
     * **Initial value**: `none`
     */
  WebkitBorderBeforeStyle: PropFn<CssValueOf<'WebkitBorderBeforeStyle'>>
  /**
     * **Syntax**: `<'border-width'>`
     *
     * **Initial value**: `medium`
     */
  WebkitBorderBeforeWidth: PropFn<CssValueOf<'WebkitBorderBeforeWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     */
  WebkitBorderBottomLeftRadius: PropFn<CssValueOf<'WebkitBorderBottomLeftRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     */
  WebkitBorderBottomRightRadius: PropFn<CssValueOf<'WebkitBorderBottomRightRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ <number [0,∞]> | <percentage [0,∞]> ]{1,4}  && fill?`
     *
     * **Initial value**: `100%`
     */
  WebkitBorderImageSlice: PropFn<CssValueOf<'WebkitBorderImageSlice'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     */
  WebkitBorderTopLeftRadius: PropFn<CssValueOf<'WebkitBorderTopLeftRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     */
  WebkitBorderTopRightRadius: PropFn<CssValueOf<'WebkitBorderTopRightRadius'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `slice | clone`
     *
     * **Initial value**: `slice`
     */
  WebkitBoxDecorationBreak: PropFn<CssValueOf<'WebkitBoxDecorationBreak'>>
  /**
     * The **`-webkit-box-reflect`** CSS property lets you reflect the content of an element in one specific direction.
     *
     * **Syntax**: `[ above | below | right | left ]? <length>? <image>?`
     *
     * **Initial value**: `none`
     */
  WebkitBoxReflect: PropFn<CssValueOf<'WebkitBoxReflect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `none | <shadow>#`
     *
     * **Initial value**: `none`
     */
  WebkitBoxShadow: PropFn<CssValueOf<'WebkitBoxShadow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `content-box | border-box`
     *
     * **Initial value**: `content-box`
     */
  WebkitBoxSizing: PropFn<CssValueOf<'WebkitBoxSizing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<clip-source> | [ <basic-shape> || <geometry-box> ] | none`
     *
     * **Initial value**: `none`
     */
  WebkitClipPath: PropFn<CssValueOf<'WebkitClipPath'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<integer> | auto`
     *
     * **Initial value**: `auto`
     */
  WebkitColumnCount: PropFn<CssValueOf<'WebkitColumnCount'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `auto | balance`
     *
     * **Initial value**: `balance`
     */
  WebkitColumnFill: PropFn<CssValueOf<'WebkitColumnFill'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  WebkitColumnRuleColor: PropFn<CssValueOf<'WebkitColumnRuleColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'border-style'>`
     *
     * **Initial value**: `none`
     */
  WebkitColumnRuleStyle: PropFn<CssValueOf<'WebkitColumnRuleStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'border-width'>`
     *
     * **Initial value**: `medium`
     */
  WebkitColumnRuleWidth: PropFn<CssValueOf<'WebkitColumnRuleWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `none | all`
     *
     * **Initial value**: `none`
     */
  WebkitColumnSpan: PropFn<CssValueOf<'WebkitColumnSpan'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since November 2016.
     *
     * **Syntax**: `<length> | auto`
     *
     * **Initial value**: `auto`
     */
  WebkitColumnWidth: PropFn<CssValueOf<'WebkitColumnWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2016.
     *
     * **Syntax**: `none | <filter-value-list>`
     *
     * **Initial value**: `none`
     */
  WebkitFilter: PropFn<CssValueOf<'WebkitFilter'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `content | <'width'>`
     *
     * **Initial value**: `auto`
     */
  WebkitFlexBasis: PropFn<CssValueOf<'WebkitFlexBasis'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `row | row-reverse | column | column-reverse`
     *
     * **Initial value**: `row`
     */
  WebkitFlexDirection: PropFn<CssValueOf<'WebkitFlexDirection'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     */
  WebkitFlexGrow: PropFn<CssValueOf<'WebkitFlexGrow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `1`
     */
  WebkitFlexShrink: PropFn<CssValueOf<'WebkitFlexShrink'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `nowrap | wrap | wrap-reverse`
     *
     * **Initial value**: `nowrap`
     */
  WebkitFlexWrap: PropFn<CssValueOf<'WebkitFlexWrap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `normal | <feature-tag-value>#`
     *
     * **Initial value**: `normal`
     */
  WebkitFontFeatureSettings: PropFn<CssValueOf<'WebkitFontFeatureSettings'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | normal | none`
     *
     * **Initial value**: `auto`
     */
  WebkitFontKerning: PropFn<CssValueOf<'WebkitFontKerning'>>
  /**
     * The **`font-smooth`** CSS property controls the application of anti-aliasing when fonts are rendered.
     *
     * **Syntax**: `auto | never | always | <absolute-size> | <length>`
     *
     * **Initial value**: `auto`
     */
  WebkitFontSmoothing: PropFn<CssValueOf<'WebkitFontSmoothing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> ]`
     *
     * **Initial value**: `normal`
     */
  WebkitFontVariantLigatures: PropFn<CssValueOf<'WebkitFontVariantLigatures'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto | <string>`
     *
     * **Initial value**: `auto`
     */
  WebkitHyphenateCharacter: PropFn<CssValueOf<'WebkitHyphenateCharacter'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | manual | auto`
     *
     * **Initial value**: `manual`
     */
  WebkitHyphens: PropFn<CssValueOf<'WebkitHyphens'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | [ <number> <integer>? ]`
     *
     * **Initial value**: `normal`
     */
  WebkitInitialLetter: PropFn<CssValueOf<'WebkitInitialLetter'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ]`
     *
     * **Initial value**: `normal`
     */
  WebkitJustifyContent: PropFn<CssValueOf<'WebkitJustifyContent'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `auto | loose | normal | strict | anywhere`
     *
     * **Initial value**: `auto`
     */
  WebkitLineBreak: PropFn<CssValueOf<'WebkitLineBreak'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <integer>`
     *
     * **Initial value**: `none`
     */
  WebkitLineClamp: PropFn<CssValueOf<'WebkitLineClamp'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'width'>`
     *
     * **Initial value**: `auto`
     */
  WebkitLogicalHeight: PropFn<CssValueOf<'WebkitLogicalHeight'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'width'>`
     *
     * **Initial value**: `auto`
     */
  WebkitLogicalWidth: PropFn<CssValueOf<'WebkitLogicalWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     */
  WebkitMarginEnd: PropFn<CssValueOf<'WebkitMarginEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     */
  WebkitMarginStart: PropFn<CssValueOf<'WebkitMarginStart'>>
  /**
     * **Syntax**: `<attachment>#`
     *
     * **Initial value**: `scroll`
     */
  WebkitMaskAttachment: PropFn<CssValueOf<'WebkitMaskAttachment'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <length> | <number> ]{1,4}`
     *
     * **Initial value**: `0`
     */
  WebkitMaskBoxImageOutset: PropFn<CssValueOf<'WebkitMaskBoxImageOutset'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ stretch | repeat | round | space ]{1,2}`
     *
     * **Initial value**: `stretch`
     */
  WebkitMaskBoxImageRepeat: PropFn<CssValueOf<'WebkitMaskBoxImageRepeat'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<number-percentage>{1,4} fill?`
     *
     * **Initial value**: `0`
     */
  WebkitMaskBoxImageSlice: PropFn<CssValueOf<'WebkitMaskBoxImageSlice'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <image>`
     *
     * **Initial value**: `none`
     */
  WebkitMaskBoxImageSource: PropFn<CssValueOf<'WebkitMaskBoxImageSource'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <length-percentage> | <number> | auto ]{1,4}`
     *
     * **Initial value**: `auto`
     */
  WebkitMaskBoxImageWidth: PropFn<CssValueOf<'WebkitMaskBoxImageWidth'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ <coord-box> | no-clip | border | padding | content | text ]#`
     *
     * **Initial value**: `border`
     */
  WebkitMaskClip: PropFn<CssValueOf<'WebkitMaskClip'>>
  /**
     * The **`-webkit-mask-composite`** property specifies the manner in which multiple mask images applied to the same element are composited with one another. Mask images are composited in the opposite order that they are declared with the `-webkit-mask-image` property.
     *
     * **Syntax**: `<composite-style>#`
     *
     * **Initial value**: `source-over`
     */
  WebkitMaskComposite: PropFn<CssValueOf<'WebkitMaskComposite'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<mask-reference>#`
     *
     * **Initial value**: `none`
     */
  WebkitMaskImage: PropFn<CssValueOf<'WebkitMaskImage'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ <coord-box> | border | padding | content ]#`
     *
     * **Initial value**: `padding`
     */
  WebkitMaskOrigin: PropFn<CssValueOf<'WebkitMaskOrigin'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<position>#`
     *
     * **Initial value**: `0% 0%`
     */
  WebkitMaskPosition: PropFn<CssValueOf<'WebkitMaskPosition'>>
  /**
     * The `-webkit-mask-position-x` CSS property sets the initial horizontal position of a mask image.
     *
     * **Syntax**: `[ <length-percentage> | left | center | right ]#`
     *
     * **Initial value**: `0%`
     */
  WebkitMaskPositionX: PropFn<CssValueOf<'WebkitMaskPositionX'>>
  /**
     * The `-webkit-mask-position-y` CSS property sets the initial vertical position of a mask image.
     *
     * **Syntax**: `[ <length-percentage> | top | center | bottom ]#`
     *
     * **Initial value**: `0%`
     */
  WebkitMaskPositionY: PropFn<CssValueOf<'WebkitMaskPositionY'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<repeat-style>#`
     *
     * **Initial value**: `repeat`
     */
  WebkitMaskRepeat: PropFn<CssValueOf<'WebkitMaskRepeat'>>
  /**
     * The `-webkit-mask-repeat-x` property specifies whether and how a mask image is repeated (tiled) horizontally.
     *
     * **Syntax**: `repeat | no-repeat | space | round`
     *
     * **Initial value**: `repeat`
     */
  WebkitMaskRepeatX: PropFn<CssValueOf<'WebkitMaskRepeatX'>>
  /**
     * The `-webkit-mask-repeat-y` property sets whether and how a mask image is repeated (tiled) vertically.
     *
     * **Syntax**: `repeat | no-repeat | space | round`
     *
     * **Initial value**: `repeat`
     */
  WebkitMaskRepeatY: PropFn<CssValueOf<'WebkitMaskRepeatY'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<bg-size>#`
     *
     * **Initial value**: `auto auto`
     */
  WebkitMaskSize: PropFn<CssValueOf<'WebkitMaskSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'max-width'>`
     *
     * **Initial value**: `none`
     */
  WebkitMaxInlineSize: PropFn<CssValueOf<'WebkitMaxInlineSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `0`
     */
  WebkitOrder: PropFn<CssValueOf<'WebkitOrder'>>
  /**
     * **Syntax**: `auto | touch`
     *
     * **Initial value**: `auto`
     */
  WebkitOverflowScrolling: PropFn<CssValueOf<'WebkitOverflowScrolling'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     */
  WebkitPaddingEnd: PropFn<CssValueOf<'WebkitPaddingEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     */
  WebkitPaddingStart: PropFn<CssValueOf<'WebkitPaddingStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <length>`
     *
     * **Initial value**: `none`
     */
  WebkitPerspective: PropFn<CssValueOf<'WebkitPerspective'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<position>`
     *
     * **Initial value**: `50% 50%`
     */
  WebkitPerspectiveOrigin: PropFn<CssValueOf<'WebkitPerspectiveOrigin'>>
  /**
     * Since May 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `economy | exact`
     *
     * **Initial value**: `economy`
     */
  WebkitPrintColorAdjust: PropFn<CssValueOf<'WebkitPrintColorAdjust'>>
  /**
     * Since December 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ alternate || [ over | under ] ] | inter-character`
     *
     * **Initial value**: `alternate`
     */
  WebkitRubyPosition: PropFn<CssValueOf<'WebkitRubyPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2022.
     *
     * **Syntax**: `none | [ x | y | block | inline | both ] [ mandatory | proximity ]?`
     *
     * **Initial value**: `none`
     */
  WebkitScrollSnapType: PropFn<CssValueOf<'WebkitScrollSnapType'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<length-percentage>`
     *
     * **Initial value**: `0`
     */
  WebkitShapeMargin: PropFn<CssValueOf<'WebkitShapeMargin'>>
  /**
     * **`-webkit-tap-highlight-color`** is a non-standard CSS property that sets the color of the highlight that appears over a link while it's being tapped. The highlighting indicates to the user that their tap is being successfully recognized, and indicates which element they're tapping on.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `black`
     */
  WebkitTapHighlightColor: PropFn<CssValueOf<'WebkitTapHighlightColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | all | [ digits <integer>? ]`
     *
     * **Initial value**: `none`
     */
  WebkitTextCombine: PropFn<CssValueOf<'WebkitTextCombine'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  WebkitTextDecorationColor: PropFn<CssValueOf<'WebkitTextDecorationColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `none | [ underline || overline || line-through || blink ] | spelling-error | grammar-error`
     *
     * **Initial value**: `none`
     */
  WebkitTextDecorationLine: PropFn<CssValueOf<'WebkitTextDecorationLine'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | [ objects || [ spaces | [ leading-spaces || trailing-spaces ] ] || edges || box-decoration ]`
     *
     * **Initial value**: `objects`
     */
  WebkitTextDecorationSkip: PropFn<CssValueOf<'WebkitTextDecorationSkip'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `solid | double | dotted | dashed | wavy`
     *
     * **Initial value**: `solid`
     */
  WebkitTextDecorationStyle: PropFn<CssValueOf<'WebkitTextDecorationStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  WebkitTextEmphasisColor: PropFn<CssValueOf<'WebkitTextEmphasisColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `auto | [ over | under ] && [ right | left ]?`
     *
     * **Initial value**: `auto`
     */
  WebkitTextEmphasisPosition: PropFn<CssValueOf<'WebkitTextEmphasisPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ] | <string>`
     *
     * **Initial value**: `none`
     */
  WebkitTextEmphasisStyle: PropFn<CssValueOf<'WebkitTextEmphasisStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2016.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  WebkitTextFillColor: PropFn<CssValueOf<'WebkitTextFillColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2020.
     *
     * **Syntax**: `mixed | upright | sideways`
     *
     * **Initial value**: `mixed`
     */
  WebkitTextOrientation: PropFn<CssValueOf<'WebkitTextOrientation'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | auto | <percentage>`
     *
     * **Initial value**: `auto` for smartphone browsers supporting inflation, `none` in other cases (and then not modifiable).
     */
  WebkitTextSizeAdjust: PropFn<CssValueOf<'WebkitTextSizeAdjust'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  WebkitTextStrokeColor: PropFn<CssValueOf<'WebkitTextStrokeColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     */
  WebkitTextStrokeWidth: PropFn<CssValueOf<'WebkitTextStrokeWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `auto | from-font | [ under || [ left | right ] ]`
     *
     * **Initial value**: `auto`
     */
  WebkitTextUnderlinePosition: PropFn<CssValueOf<'WebkitTextUnderlinePosition'>>
  /**
     * The `-webkit-touch-callout` CSS property controls the display of the default callout shown when you touch and hold a touch target.
     *
     * **Syntax**: `default | none`
     *
     * **Initial value**: `default`
     */
  WebkitTouchCallout: PropFn<CssValueOf<'WebkitTouchCallout'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <transform-list>`
     *
     * **Initial value**: `none`
     */
  WebkitTransform: PropFn<CssValueOf<'WebkitTransform'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?`
     *
     * **Initial value**: `50% 50% 0`
     */
  WebkitTransformOrigin: PropFn<CssValueOf<'WebkitTransformOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `flat | preserve-3d`
     *
     * **Initial value**: `flat`
     */
  WebkitTransformStyle: PropFn<CssValueOf<'WebkitTransformStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     */
  WebkitTransitionDelay: PropFn<CssValueOf<'WebkitTransitionDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     */
  WebkitTransitionDuration: PropFn<CssValueOf<'WebkitTransitionDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <single-transition-property>#`
     *
     * **Initial value**: all
     */
  WebkitTransitionProperty: PropFn<CssValueOf<'WebkitTransitionProperty'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     */
  WebkitTransitionTimingFunction: PropFn<CssValueOf<'WebkitTransitionTimingFunction'>>
  /**
     * **Syntax**: `read-only | read-write | read-write-plaintext-only`
     *
     * **Initial value**: `read-only`
     */
  WebkitUserModify: PropFn<CssValueOf<'WebkitUserModify'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | text | none | all`
     *
     * **Initial value**: `auto`
     */
  WebkitUserSelect: PropFn<CssValueOf<'WebkitUserSelect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr`
     *
     * **Initial value**: `horizontal-tb`
     */
  WebkitWritingMode: PropFn<CssValueOf<'WebkitWritingMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation>#`
     */
  MozAnimation: PropFn<CssValueOf<'MozAnimation'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>`
     */
  MozBorderImage: PropFn<CssValueOf<'MozBorderImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>`
     */
  MozColumnRule: PropFn<CssValueOf<'MozColumnRule'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'column-width'> || <'column-count'>`
     */
  MozColumns: PropFn<CssValueOf<'MozColumns'>>
  /** **Syntax**: `<outline-radius>{1,4} [ / <outline-radius>{1,4} ]?` */
  MozOutlineRadius: PropFn<CssValueOf<'MozOutlineRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-transition>#`
     */
  MozTransition: PropFn<CssValueOf<'MozTransition'>>
  /** **Syntax**: `<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>` */
  msContentZoomLimit: PropFn<CssValueOf<'msContentZoomLimit'>>
  /** **Syntax**: `<'-ms-content-zoom-snap-type'> || <'-ms-content-zoom-snap-points'>` */
  msContentZoomSnap: PropFn<CssValueOf<'msContentZoomSnap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]`
     */
  msFlex: PropFn<CssValueOf<'msFlex'>>
  /** **Syntax**: `<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>` */
  msScrollLimit: PropFn<CssValueOf<'msScrollLimit'>>
  /** **Syntax**: `<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>` */
  msScrollSnapX: PropFn<CssValueOf<'msScrollSnapX'>>
  /** **Syntax**: `<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>` */
  msScrollSnapY: PropFn<CssValueOf<'msScrollSnapY'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-transition>#`
     */
  msTransition: PropFn<CssValueOf<'msTransition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation>#`
     */
  WebkitAnimation: PropFn<CssValueOf<'WebkitAnimation'>>
  /**
     * The **`-webkit-border-before`** CSS property is a shorthand property for setting the individual logical block start border property values in a single place in the style sheet.
     *
     * **Syntax**: `<'border-width'> || <'border-style'> || <color>`
     */
  WebkitBorderBefore: PropFn<CssValueOf<'WebkitBorderBefore'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>`
     */
  WebkitBorderImage: PropFn<CssValueOf<'WebkitBorderImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]?`
     */
  WebkitBorderRadius: PropFn<CssValueOf<'WebkitBorderRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>`
     */
  WebkitColumnRule: PropFn<CssValueOf<'WebkitColumnRule'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'column-width'> || <'column-count'>`
     */
  WebkitColumns: PropFn<CssValueOf<'WebkitColumns'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]`
     */
  WebkitFlex: PropFn<CssValueOf<'WebkitFlex'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<'flex-direction'> || <'flex-wrap'>`
     */
  WebkitFlexFlow: PropFn<CssValueOf<'WebkitFlexFlow'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ <mask-reference> || <position> [ / <bg-size> ]? || <repeat-style> || [ <visual-box> | border | padding | content | text ] || [ <visual-box> | border | padding | content ] ]#`
     */
  WebkitMask: PropFn<CssValueOf<'WebkitMask'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<'mask-border-source'> || <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? || <'mask-border-repeat'> || <'mask-border-mode'>`
     */
  WebkitMaskBoxImage: PropFn<CssValueOf<'WebkitMaskBoxImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `<'text-emphasis-style'> || <'text-emphasis-color'>`
     */
  WebkitTextEmphasis: PropFn<CssValueOf<'WebkitTextEmphasis'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<length> || <color>`
     */
  WebkitTextStroke: PropFn<CssValueOf<'WebkitTextStroke'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-transition>#`
     */
  WebkitTransition: PropFn<CssValueOf<'WebkitTransition'>>
  /**
     * The **`box-align`** CSS property specifies how an element aligns its contents across its layout in a perpendicular direction. The effect of the property is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | baseline | stretch`
     *
     * **Initial value**: `stretch`
     *
     * @deprecated
     */
  boxAlign: PropFn<CssValueOf<'boxAlign'>>
  /**
     * The **`box-direction`** CSS property specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).
     *
     * **Syntax**: `normal | reverse | inherit`
     *
     * **Initial value**: `normal`
     *
     * @deprecated
     */
  boxDirection: PropFn<CssValueOf<'boxDirection'>>
  /**
     * The **`-moz-box-flex`** and **`-webkit-box-flex`** CSS properties specify how a `-moz-box` or `-webkit-box` grows to fill the box that contains it, in the direction of the containing box's layout.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  boxFlex: PropFn<CssValueOf<'boxFlex'>>
  /**
     * The **`box-flex-group`** CSS property assigns the flexbox's child elements to a flex group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  boxFlexGroup: PropFn<CssValueOf<'boxFlexGroup'>>
  /**
     * The **`box-lines`** CSS property determines whether the box may have a single or multiple lines (rows for horizontally oriented boxes, columns for vertically oriented boxes).
     *
     * **Syntax**: `single | multiple`
     *
     * **Initial value**: `single`
     *
     * @deprecated
     */
  boxLines: PropFn<CssValueOf<'boxLines'>>
  /**
     * The **`box-ordinal-group`** CSS property assigns the flexbox's child elements to an ordinal group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  boxOrdinalGroup: PropFn<CssValueOf<'boxOrdinalGroup'>>
  /**
     * The **`box-orient`** CSS property sets whether an element lays out its contents horizontally or vertically.
     *
     * **Syntax**: `horizontal | vertical | inline-axis | block-axis | inherit`
     *
     * **Initial value**: `inline-axis`
     *
     * @deprecated
     */
  boxOrient: PropFn<CssValueOf<'boxOrient'>>
  /**
     * The **`-moz-box-pack`** and **`-webkit-box-pack`** CSS properties specify how a `-moz-box` or `-webkit-box` packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | justify`
     *
     * **Initial value**: `start`
     *
     * @deprecated
     */
  boxPack: PropFn<CssValueOf<'boxPack'>>
  /**
     * The **`clip`** CSS property defines a visible portion of an element. The `clip` property applies only to absolutely positioned elements — that is, elements with `position:absolute` or `position:fixed`.
     *
     * **Syntax**: `<shape> | auto`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  clip: PropFn<CssValueOf<'clip'>>
  /**
     * The **`font-stretch`** CSS property selects a normal, condensed, or expanded face from a font.
     *
     * **Syntax**: `<font-stretch-absolute>`
     *
     * **Initial value**: `normal`
     *
     * @deprecated
     */
  fontStretch: PropFn<CssValueOf<'fontStretch'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage>`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  gridColumnGap: PropFn<CssValueOf<'gridColumnGap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<'grid-row-gap'> <'grid-column-gap'>?`
     *
     * @deprecated
     */
  gridGap: PropFn<CssValueOf<'gridGap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<length-percentage>`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  gridRowGap: PropFn<CssValueOf<'gridRowGap'>>
  /**
     * **Syntax**: `auto | normal | active | inactive | disabled`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  imeMode: PropFn<CssValueOf<'imeMode'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <position-area>`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  insetArea: PropFn<CssValueOf<'insetArea'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>{1,2}`
     *
     * @deprecated
     */
  offsetBlock: PropFn<CssValueOf<'offsetBlock'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  offsetBlockEnd: PropFn<CssValueOf<'offsetBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  offsetBlockStart: PropFn<CssValueOf<'offsetBlockStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>{1,2}`
     *
     * @deprecated
     */
  offsetInline: PropFn<CssValueOf<'offsetInline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  offsetInlineEnd: PropFn<CssValueOf<'offsetInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  offsetInlineStart: PropFn<CssValueOf<'offsetInlineStart'>>
  /**
     * The **`page-break-after`** CSS property adjusts page breaks _after_ the current element.
     *
     * **Syntax**: `auto | always | avoid | left | right | recto | verso`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  pageBreakAfter: PropFn<CssValueOf<'pageBreakAfter'>>
  /**
     * The **`page-break-before`** CSS property adjusts page breaks _before_ the current element.
     *
     * **Syntax**: `auto | always | avoid | left | right | recto | verso`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  pageBreakBefore: PropFn<CssValueOf<'pageBreakBefore'>>
  /**
     * The **`page-break-inside`** CSS property adjusts page breaks _inside_ the current element.
     *
     * **Syntax**: `auto | avoid`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  pageBreakInside: PropFn<CssValueOf<'pageBreakInside'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | [ [<dashed-ident> || <try-tactic>] | <'position-area'> ]#`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  positionTryOptions: PropFn<CssValueOf<'positionTryOptions'>>
  /**
     * **Syntax**: `none | <position>#`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  scrollSnapCoordinate: PropFn<CssValueOf<'scrollSnapCoordinate'>>
  /**
     * **Syntax**: `<position>`
     *
     * **Initial value**: `0px 0px`
     *
     * @deprecated
     */
  scrollSnapDestination: PropFn<CssValueOf<'scrollSnapDestination'>>
  /**
     * **Syntax**: `none | repeat( <length-percentage> )`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  scrollSnapPointsX: PropFn<CssValueOf<'scrollSnapPointsX'>>
  /**
     * **Syntax**: `none | repeat( <length-percentage> )`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  scrollSnapPointsY: PropFn<CssValueOf<'scrollSnapPointsY'>>
  /**
     * **Syntax**: `none | mandatory | proximity`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  scrollSnapTypeX: PropFn<CssValueOf<'scrollSnapTypeX'>>
  /**
     * **Syntax**: `none | mandatory | proximity`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  scrollSnapTypeY: PropFn<CssValueOf<'scrollSnapTypeY'>>
  /**
     * The **`box-align`** CSS property specifies how an element aligns its contents across its layout in a perpendicular direction. The effect of the property is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | baseline | stretch`
     *
     * **Initial value**: `stretch`
     *
     * @deprecated
     */
  KhtmlBoxAlign: PropFn<CssValueOf<'KhtmlBoxAlign'>>
  /**
     * The **`box-direction`** CSS property specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).
     *
     * **Syntax**: `normal | reverse | inherit`
     *
     * **Initial value**: `normal`
     *
     * @deprecated
     */
  KhtmlBoxDirection: PropFn<CssValueOf<'KhtmlBoxDirection'>>
  /**
     * The **`-moz-box-flex`** and **`-webkit-box-flex`** CSS properties specify how a `-moz-box` or `-webkit-box` grows to fill the box that contains it, in the direction of the containing box's layout.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  KhtmlBoxFlex: PropFn<CssValueOf<'KhtmlBoxFlex'>>
  /**
     * The **`box-flex-group`** CSS property assigns the flexbox's child elements to a flex group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  KhtmlBoxFlexGroup: PropFn<CssValueOf<'KhtmlBoxFlexGroup'>>
  /**
     * The **`box-lines`** CSS property determines whether the box may have a single or multiple lines (rows for horizontally oriented boxes, columns for vertically oriented boxes).
     *
     * **Syntax**: `single | multiple`
     *
     * **Initial value**: `single`
     *
     * @deprecated
     */
  KhtmlBoxLines: PropFn<CssValueOf<'KhtmlBoxLines'>>
  /**
     * The **`box-ordinal-group`** CSS property assigns the flexbox's child elements to an ordinal group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  KhtmlBoxOrdinalGroup: PropFn<CssValueOf<'KhtmlBoxOrdinalGroup'>>
  /**
     * The **`box-orient`** CSS property sets whether an element lays out its contents horizontally or vertically.
     *
     * **Syntax**: `horizontal | vertical | inline-axis | block-axis | inherit`
     *
     * **Initial value**: `inline-axis`
     *
     * @deprecated
     */
  KhtmlBoxOrient: PropFn<CssValueOf<'KhtmlBoxOrient'>>
  /**
     * The **`-moz-box-pack`** and **`-webkit-box-pack`** CSS properties specify how a `-moz-box` or `-webkit-box` packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | justify`
     *
     * **Initial value**: `start`
     *
     * @deprecated
     */
  KhtmlBoxPack: PropFn<CssValueOf<'KhtmlBoxPack'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `auto | loose | normal | strict | anywhere`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  KhtmlLineBreak: PropFn<CssValueOf<'KhtmlLineBreak'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<opacity-value>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  KhtmlOpacity: PropFn<CssValueOf<'KhtmlOpacity'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | text | none | all`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  KhtmlUserSelect: PropFn<CssValueOf<'KhtmlUserSelect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-clip>#`
     *
     * **Initial value**: `border-box`
     *
     * @deprecated
     */
  MozBackgroundClip: PropFn<CssValueOf<'MozBackgroundClip'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<visual-box>#`
     *
     * **Initial value**: `padding-box`
     *
     * @deprecated
     */
  MozBackgroundOrigin: PropFn<CssValueOf<'MozBackgroundOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-size>#`
     *
     * **Initial value**: `auto auto`
     *
     * @deprecated
     */
  MozBackgroundSize: PropFn<CssValueOf<'MozBackgroundSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]?`
     *
     * @deprecated
     */
  MozBorderRadius: PropFn<CssValueOf<'MozBorderRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  MozBorderRadiusBottomleft: PropFn<CssValueOf<'MozBorderRadiusBottomleft'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  MozBorderRadiusBottomright: PropFn<CssValueOf<'MozBorderRadiusBottomright'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  MozBorderRadiusTopleft: PropFn<CssValueOf<'MozBorderRadiusTopleft'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  MozBorderRadiusTopright: PropFn<CssValueOf<'MozBorderRadiusTopright'>>
  /**
     * The **`box-align`** CSS property specifies how an element aligns its contents across its layout in a perpendicular direction. The effect of the property is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | baseline | stretch`
     *
     * **Initial value**: `stretch`
     *
     * @deprecated
     */
  MozBoxAlign: PropFn<CssValueOf<'MozBoxAlign'>>
  /**
     * The **`box-direction`** CSS property specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).
     *
     * **Syntax**: `normal | reverse | inherit`
     *
     * **Initial value**: `normal`
     *
     * @deprecated
     */
  MozBoxDirection: PropFn<CssValueOf<'MozBoxDirection'>>
  /**
     * The **`-moz-box-flex`** and **`-webkit-box-flex`** CSS properties specify how a `-moz-box` or `-webkit-box` grows to fill the box that contains it, in the direction of the containing box's layout.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  MozBoxFlex: PropFn<CssValueOf<'MozBoxFlex'>>
  /**
     * The **`box-ordinal-group`** CSS property assigns the flexbox's child elements to an ordinal group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  MozBoxOrdinalGroup: PropFn<CssValueOf<'MozBoxOrdinalGroup'>>
  /**
     * The **`box-orient`** CSS property sets whether an element lays out its contents horizontally or vertically.
     *
     * **Syntax**: `horizontal | vertical | inline-axis | block-axis | inherit`
     *
     * **Initial value**: `inline-axis`
     *
     * @deprecated
     */
  MozBoxOrient: PropFn<CssValueOf<'MozBoxOrient'>>
  /**
     * The **`-moz-box-pack`** and **`-webkit-box-pack`** CSS properties specify how a `-moz-box` or `-webkit-box` packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | justify`
     *
     * **Initial value**: `start`
     *
     * @deprecated
     */
  MozBoxPack: PropFn<CssValueOf<'MozBoxPack'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `none | <shadow>#`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  MozBoxShadow: PropFn<CssValueOf<'MozBoxShadow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<integer> | auto`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  MozColumnCount: PropFn<CssValueOf<'MozColumnCount'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `auto | balance`
     *
     * **Initial value**: `balance`
     *
     * @deprecated
     */
  MozColumnFill: PropFn<CssValueOf<'MozColumnFill'>>
  /**
     * The non-standard **`-moz-float-edge`** CSS property specifies whether the height and width properties of the element include the margin, border, or padding thickness.
     *
     * **Syntax**: `border-box | content-box | margin-box | padding-box`
     *
     * **Initial value**: `content-box`
     *
     * @deprecated
     */
  MozFloatEdge: PropFn<CssValueOf<'MozFloatEdge'>>
  /**
     * The **`-moz-force-broken-image-icon`** extended CSS property can be used to force the broken image icon to be shown even when a broken image has an `alt` attribute.
     *
     * **Syntax**: `0 | 1`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  MozForceBrokenImageIcon: PropFn<CssValueOf<'MozForceBrokenImageIcon'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<opacity-value>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  MozOpacity: PropFn<CssValueOf<'MozOpacity'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2023.
     *
     * **Syntax**: `<'outline-width'> || <'outline-style'> || <'outline-color'>`
     *
     * @deprecated
     */
  MozOutline: PropFn<CssValueOf<'MozOutline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <color>`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  MozOutlineColor: PropFn<CssValueOf<'MozOutlineColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <outline-line-style>`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  MozOutlineStyle: PropFn<CssValueOf<'MozOutlineStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width>`
     *
     * **Initial value**: `medium`
     *
     * @deprecated
     */
  MozOutlineWidth: PropFn<CssValueOf<'MozOutlineWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `auto | start | end | left | right | center | justify`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  MozTextAlignLast: PropFn<CssValueOf<'MozTextAlignLast'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     *
     * @deprecated
     */
  MozTextDecorationColor: PropFn<CssValueOf<'MozTextDecorationColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `none | [ underline || overline || line-through || blink ] | spelling-error | grammar-error`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  MozTextDecorationLine: PropFn<CssValueOf<'MozTextDecorationLine'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `solid | double | dotted | dashed | wavy`
     *
     * **Initial value**: `solid`
     *
     * @deprecated
     */
  MozTextDecorationStyle: PropFn<CssValueOf<'MozTextDecorationStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * @deprecated
     */
  MozTransitionDelay: PropFn<CssValueOf<'MozTransitionDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * @deprecated
     */
  MozTransitionDuration: PropFn<CssValueOf<'MozTransitionDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <single-transition-property>#`
     *
     * **Initial value**: all
     *
     * @deprecated
     */
  MozTransitionProperty: PropFn<CssValueOf<'MozTransitionProperty'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     *
     * @deprecated
     */
  MozTransitionTimingFunction: PropFn<CssValueOf<'MozTransitionTimingFunction'>>
  /**
     * The **`-moz-user-focus`** CSS property is used to indicate whether an element can have the focus.
     *
     * **Syntax**: `ignore | normal | select-after | select-before | select-menu | select-same | select-all | none`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  MozUserFocus: PropFn<CssValueOf<'MozUserFocus'>>
  /**
     * In Mozilla applications, **`-moz-user-input`** determines if an element will accept user input.
     *
     * **Syntax**: `auto | none | enabled | disabled`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  MozUserInput: PropFn<CssValueOf<'MozUserInput'>>
  /**
     * **Syntax**: `auto | normal | active | inactive | disabled`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  msImeMode: PropFn<CssValueOf<'msImeMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation>#`
     *
     * @deprecated
     */
  OAnimation: PropFn<CssValueOf<'OAnimation'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * @deprecated
     */
  OAnimationDelay: PropFn<CssValueOf<'OAnimationDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-direction>#`
     *
     * **Initial value**: `normal`
     *
     * @deprecated
     */
  OAnimationDirection: PropFn<CssValueOf<'OAnimationDirection'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ auto | <time [0s,∞]> ]#`
     *
     * **Initial value**: `0s`
     *
     * @deprecated
     */
  OAnimationDuration: PropFn<CssValueOf<'OAnimationDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-fill-mode>#`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  OAnimationFillMode: PropFn<CssValueOf<'OAnimationFillMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-iteration-count>#`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  OAnimationIterationCount: PropFn<CssValueOf<'OAnimationIterationCount'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ none | <keyframes-name> ]#`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  OAnimationName: PropFn<CssValueOf<'OAnimationName'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-play-state>#`
     *
     * **Initial value**: `running`
     *
     * @deprecated
     */
  OAnimationPlayState: PropFn<CssValueOf<'OAnimationPlayState'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     *
     * @deprecated
     */
  OAnimationTimingFunction: PropFn<CssValueOf<'OAnimationTimingFunction'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-size>#`
     *
     * **Initial value**: `auto auto`
     *
     * @deprecated
     */
  OBackgroundSize: PropFn<CssValueOf<'OBackgroundSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>`
     *
     * @deprecated
     */
  OBorderImage: PropFn<CssValueOf<'OBorderImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `fill | contain | cover | none | scale-down`
     *
     * **Initial value**: `fill`
     *
     * @deprecated
     */
  OObjectFit: PropFn<CssValueOf<'OObjectFit'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<position>`
     *
     * **Initial value**: `50% 50%`
     *
     * @deprecated
     */
  OObjectPosition: PropFn<CssValueOf<'OObjectPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since August 2021.
     *
     * **Syntax**: `<integer> | <length>`
     *
     * **Initial value**: `8`
     *
     * @deprecated
     */
  OTabSize: PropFn<CssValueOf<'OTabSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ clip | ellipsis | <string> ]{1,2}`
     *
     * **Initial value**: `clip`
     *
     * @deprecated
     */
  OTextOverflow: PropFn<CssValueOf<'OTextOverflow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <transform-list>`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  OTransform: PropFn<CssValueOf<'OTransform'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?`
     *
     * **Initial value**: `50% 50% 0`
     *
     * @deprecated
     */
  OTransformOrigin: PropFn<CssValueOf<'OTransformOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-transition>#`
     *
     * @deprecated
     */
  OTransition: PropFn<CssValueOf<'OTransition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * @deprecated
     */
  OTransitionDelay: PropFn<CssValueOf<'OTransitionDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * @deprecated
     */
  OTransitionDuration: PropFn<CssValueOf<'OTransitionDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <single-transition-property>#`
     *
     * **Initial value**: all
     *
     * @deprecated
     */
  OTransitionProperty: PropFn<CssValueOf<'OTransitionProperty'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     *
     * @deprecated
     */
  OTransitionTimingFunction: PropFn<CssValueOf<'OTransitionTimingFunction'>>
  /**
     * The **`box-align`** CSS property specifies how an element aligns its contents across its layout in a perpendicular direction. The effect of the property is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | baseline | stretch`
     *
     * **Initial value**: `stretch`
     *
     * @deprecated
     */
  WebkitBoxAlign: PropFn<CssValueOf<'WebkitBoxAlign'>>
  /**
     * The **`box-direction`** CSS property specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).
     *
     * **Syntax**: `normal | reverse | inherit`
     *
     * **Initial value**: `normal`
     *
     * @deprecated
     */
  WebkitBoxDirection: PropFn<CssValueOf<'WebkitBoxDirection'>>
  /**
     * The **`-moz-box-flex`** and **`-webkit-box-flex`** CSS properties specify how a `-moz-box` or `-webkit-box` grows to fill the box that contains it, in the direction of the containing box's layout.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  WebkitBoxFlex: PropFn<CssValueOf<'WebkitBoxFlex'>>
  /**
     * The **`box-flex-group`** CSS property assigns the flexbox's child elements to a flex group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  WebkitBoxFlexGroup: PropFn<CssValueOf<'WebkitBoxFlexGroup'>>
  /**
     * The **`box-lines`** CSS property determines whether the box may have a single or multiple lines (rows for horizontally oriented boxes, columns for vertically oriented boxes).
     *
     * **Syntax**: `single | multiple`
     *
     * **Initial value**: `single`
     *
     * @deprecated
     */
  WebkitBoxLines: PropFn<CssValueOf<'WebkitBoxLines'>>
  /**
     * The **`box-ordinal-group`** CSS property assigns the flexbox's child elements to an ordinal group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  WebkitBoxOrdinalGroup: PropFn<CssValueOf<'WebkitBoxOrdinalGroup'>>
  /**
     * The **`box-orient`** CSS property sets whether an element lays out its contents horizontally or vertically.
     *
     * **Syntax**: `horizontal | vertical | inline-axis | block-axis | inherit`
     *
     * **Initial value**: `inline-axis`
     *
     * @deprecated
     */
  WebkitBoxOrient: PropFn<CssValueOf<'WebkitBoxOrient'>>
  /**
     * The **`-moz-box-pack`** and **`-webkit-box-pack`** CSS properties specify how a `-moz-box` or `-webkit-box` packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | justify`
     *
     * **Initial value**: `start`
     *
     * @deprecated
     */
  WebkitBoxPack: PropFn<CssValueOf<'WebkitBoxPack'>>
  colorInterpolation: PropFn<CssValueOf<'colorInterpolation'>>
  colorRendering: PropFn<CssValueOf<'colorRendering'>>
  glyphOrientationVertical: PropFn<CssValueOf<'glyphOrientationVertical'>>
}
