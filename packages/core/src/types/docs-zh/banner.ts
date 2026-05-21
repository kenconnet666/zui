/**
 * 文件顶部 banner —— CSS 属性值通用指南。
 *
 * 由 generator 整段注入到 `properties.generated.ts` 文件顶部，作为 `IcxPropMethods`
 * 接口前的 JSDoc 文档块。读者先读完 §1-§7 学习通用知识，之后每个属性的 JSDoc 只需聚焦它特有的部分。
 */
export const FILE_BANNER_ZH = `# zui CSS 属性值通用指南（中文）

本文件由 generator 生成。下方 §1-§7 是**所有属性共享的基础知识**，
看完后每个属性的 JSDoc 只需关注它特有的部分。

- §1 全局关键字（所有属性都能用）
- §2 颜色值 \`<color>\`
- §3 长度值 \`<length>\` / 单位方法
- §4 百分比 \`<percentage>\` 的参照基准
- §5 角度 \`<angle>\` / 时间 \`<time>\`
- §6 "跟随父级 / 自动 / 默认"机制关键字
- §7 zui Chain 四态调用约定

----------------------------------------------------------------------

## §1 全局关键字 GlobalKw（所有属性都接受）

| 关键字 | 行为 |
| --- | --- |
| \`inherit\` | 强制继承父元素该属性的**计算值**。继承属性（color/font）默认就继承，对非继承属性（border/width）才有意义 |
| \`initial\` | 重置为该属性 CSS spec 定义的**初始值**（不同属性不同，如 \`color\` 的 initial 是 \`canvastext\`） |
| \`unset\` | 继承属性 → 等同 \`inherit\`；非继承属性 → 等同 \`initial\` |
| \`revert\` | 回到**浏览器默认样式表**（user-agent stylesheet）的值。比 \`initial\` 更接近"原始浏览器样子" |
| \`revertLayer\` | 回到上一个 CSS \`@layer\` 中该属性的值 |

链式调用：\`s.color.inherit\` / \`s.padding.initial\` / \`s.fontSize.unset\`。

----------------------------------------------------------------------

## §2 颜色值 \`<color>\`

所有颜色属性（\`color\` / \`backgroundColor\` / \`borderColor\` / \`caretColor\` / \`outlineColor\` / \`fill\` 等）
都接受相同形式的颜色值。

### §2.1 函数态可接受形式

| 形式 | 示例 | 说明 |
| --- | --- | --- |
| 十六进制 | \`'#f80'\` \`'#ff8800'\` \`'#ff8800cc'\` | 3/4/6/8 位；4/8 位末两位为 alpha |
| \`rgb()\` | \`'rgb(255 128 0 / 0.8)'\` | 现代空格语法（旧逗号语法兼容） |
| \`hsl()\` | \`'hsl(30 100% 50% / 0.8)'\` | H 色相 / S 饱和 / L 明度 |
| \`hwb()\` | \`'hwb(30 0% 0%)'\` | 色相+白度+黑度（CSS 4） |
| \`lab()\` \`lch()\` | \`'lab(60% 40 30)'\` | 感知均匀色彩（CSS 4） |
| \`oklab()\` \`oklch()\` | \`'oklch(0.7 0.15 30)'\` | 推荐，渐变插值最稳（CSS 4） |
| \`color()\` | \`'color(display-p3 1 0.5 0)'\` | 宽色域 P3 / Rec2020 |
| \`color-mix()\` | \`'color-mix(in oklch, #f80 60%, #fff)'\` | 浏览器原生混色（CSS 5） |

### §2.2 4 个通用颜色关键字

| 关键字 | 等价 | 用途 |
| --- | --- | --- |
| \`white\` | \`#FFFFFF\` | 纯白 |
| \`black\` | \`#000000\` | 纯黑 |
| \`transparent\` | \`rgba(0,0,0,0)\` | 完全透明。用于渐变端点比 \`rgba(0,0,0,0)\` 更稳 |
| \`currentColor\` | 引用当前元素 \`color\` | **"跟随文字色"最常用关键字** |

### §2.3 146 个 CSS 命名色

颜色属性的 JSDoc 会附详细的分组色名表（中性 / 红 / 粉 / 橙 / 黄 / 棕 / 绿 / 青 / 蓝 / 紫，按色相组织）。

### §2.4 zui 主题 token 写法

\`\`\`ts
s.color._primary                    // 主题主色（跟随 ZConfigProvider light/dark 切换）
s.color._textPrimary                // 语义化文本主色
s.color._red500                     // Palette token（tailwind 50–950 阶）
s.color._primary.alpha(0.6)         // token + 修饰链
s.color._primary.darken(0.1)
s.color._primary.complement         // 互补色（色相 +180°）
\`\`\`

**核心规则**：加 \`_\` 走 token，不加走 CSS 关键字。

----------------------------------------------------------------------

## §3 长度值 \`<length>\`

所有长度属性（\`width\` / \`height\` / \`padding*\` / \`margin*\` / \`top\` / \`fontSize\` / \`borderWidth\` ...）都接受这些单位。

zui Chain 上有 \`.px()\` / \`.em()\` / \`.rem()\` / \`.vw()\` 等单位方法，等价于"字符串+单位"：

\`\`\`ts
s.width.px(200)      ≡ s.width('200px')
s.padding.rem(1.5)   ≡ s.padding('1.5rem')
\`\`\`

### §3.1 单位分类

| 类别 | 单位 | 1 单位 = ? | 用例 |
| --- | --- | --- | --- |
| **绝对** | \`px\` | 1 CSS 像素 | 精确控制 |
| | \`pt\` \`cm\` \`mm\` \`in\` \`pc\` \`Q\` | 物理单位 | 打印 |
| **字体相对** | \`em\` | 当前元素 \`font-size\` 的倍数 | **跟随当前字号**缩放 |
| | \`rem\` | **根元素** \`<html>\` \`font-size\` 的倍数 | **全站统一缩放点** |
| | \`ex\` | 当前字体小写 x 高度 | 罕用 |
| | \`ch\` | 当前字体 "0" 字符宽 | 限制等宽行宽 |
| | \`cap\` | 大写字母高度（新） | |
| | \`ic\` | 表意文字宽度（CJK） | |
| | \`lh\` | 当前元素 \`line-height\` | 精确对齐行高 |
| | \`rlh\` | 根元素 \`line-height\` | |
| **视口相对** | \`vw\` \`vh\` | 视口宽 / 高 的 1% | 全屏区块 |
| | \`vmin\` \`vmax\` | 视口短边 / 长边 1% | 横竖屏自适应 |
| | \`svw\` \`svh\` | **小**视口（移动浏览器折叠 UI 时） | 移动适配 |
| | \`lvw\` \`lvh\` | **大**视口（移动浏览器全展开时） | |
| | \`dvw\` \`dvh\` | **动态**视口（随 UI 折叠变） | 移动 \`100vh\` 顶替方案 |
| **容器相对** | \`cqw\` \`cqh\` \`cqi\` \`cqb\` \`cqmin\` \`cqmax\` | container query 容器尺寸 1% | 组件级响应式 |
| **百分比** | \`%\` | 见 §4 | 不同属性参照不同 |

### §3.2 数学函数

\`\`\`ts
s.width('calc(100% - 32px)')               // 加减乘除
s.width('min(100%, 1200px)')                // 取小
s.width('max(280px, 50%)')                  // 取大
s.fontSize('clamp(14px, 2vw, 18px)')        // 限制在区间（响应式字号利器）
\`\`\`

### §3.3 数字 0

length 上下文写 \`0\` **不需要单位**：\`s.margin(0)\` ≡ \`s.margin('0px')\`。

----------------------------------------------------------------------

## §4 百分比 \`<percentage>\` 的参照基准

⚠️ **CSS 学习者最常困惑的点**：百分比的"100% 等于什么"**取决于所在属性**，不是统一规则。

| 属性 | 100% 参照 |
| --- | --- |
| \`width\` \`min-width\` \`max-width\` \`inset-inline-*\` \`left\` \`right\` | 父元素 **content-box 宽度** |
| \`height\` \`min-height\` \`max-height\` \`top\` \`bottom\` | 父元素 content-box **高度**（且**父高度需明确**才生效） |
| \`margin*\` \`padding*\` | 父元素 **content-box 宽度**（即使是 \`marginTop\`/\`paddingTop\` 也参照**宽**！） |
| \`font-size\` | 父元素 \`font-size\` |
| \`line-height\` | 当前元素 \`font-size\` |
| \`background-position\` | (容器尺寸 - 自身尺寸) 的差值 |
| \`background-size\` | 容器对应轴尺寸 |
| \`transform: translate()\` \`transform-origin\` | **元素自身**对应尺寸 |
| \`border-radius\` | 元素自身对应轴尺寸 |

----------------------------------------------------------------------

## §5 角度 \`<angle>\` / 时间 \`<time>\`

### 角度
| 单位 | 1 单位 = ? |
| --- | --- |
| \`deg\` | 1 度，360deg 一圈 |
| \`rad\` | 弧度，2π rad 一圈 |
| \`grad\` | 百分度，400grad 一圈 |
| \`turn\` | 圈，1turn = 360deg |

### 时间
| 单位 | 1 单位 = ? |
| --- | --- |
| \`s\` | 1 秒 |
| \`ms\` | 1 毫秒（1s = 1000ms） |

\`\`\`ts
s.animationDuration.s(0.3)    ≡ s.animationDuration('0.3s')
s.transitionDuration.ms(300)  ≡ s.transitionDuration('300ms')
\`\`\`

----------------------------------------------------------------------

## §6 "跟随父级 / 自动 / 默认"机制关键字

这一类关键字让 CSS 学习者最困惑，因为含义**取决于上下文**。

### \`auto\` —— 浏览器自动算（不同属性算法不同）
| 属性 | \`auto\` 含义 |
| --- | --- |
| \`width\` \`height\` | 内容驱动；block 元素 \`width: auto\` = 撑满父容器，inline / flex item = 内容宽 |
| \`margin: 0 auto\` | 水平居中（左右自动分配剩余空间） |
| \`overflow\` | 内容溢出才显示滚动条 |
| \`cursor\` | 浏览器按上下文选光标 |
| \`flex-basis\` | 等于元素 \`width\`（或 \`height\`，看 flex 方向） |
| \`grid-auto-columns/rows\` | 内容驱动轨道大小 |
| \`inset\` / \`top\` / \`left\` | 不参与定位（默认） |

### \`inherit\` —— 显式继承父
拷贝父元素该属性的**计算值**。继承属性（color/font）默认就继承，对非继承属性（border/background/width）才显式生效。

### \`currentColor\` —— 跟随当前 \`color\`
引用当前元素 \`color\`。让 \`border-color\` / \`outline-color\` / svg \`fill\` / \`stroke\` / \`caret-color\` 等跟随文字色变。

### \`min-content\` / \`max-content\` / \`fit-content\` —— 内容驱动尺寸
| 关键字 | 行为 |
| --- | --- |
| \`min-content\` | **最小内容宽**（再窄就溢出，等于最长单词 / 不可断处长度） |
| \`max-content\` | **最大内容宽**（理想宽度，等同无约束时 \`width: auto\`） |
| \`fit-content\` | \`min(max-content, max(min-content, 可用宽度))\` —— 跟内容长但不超容器 |

用例：Tag / Toast 宽度跟随文字、表格列宽自适应。

### \`none\` —— 关闭某种效果
| 属性 | \`none\` 含义 |
| --- | --- |
| \`display\` | 元素及子元素不渲染（不占空间） |
| \`border-style\` | 无边框 |
| \`text-decoration\` | 无下划线/删除线 |
| \`pointer-events\` | 不响应鼠标（事件穿透） |
| \`outline\` | 无外轮廓（⚠️慎用，影响键盘可访问性） |
| \`list-style\` | 列表无标记 |
| \`box-shadow\` \`filter\` \`transform\` | 无效果 |

### \`normal\` —— "默认行为"（不同属性含义不同）
| 属性 | \`normal\` 含义 |
| --- | --- |
| \`font-style\` | 正体（非 italic） |
| \`font-weight\` | 400 |
| \`line-height\` | 浏览器默认（一般 1.2 左右） |
| \`letter-spacing\` \`word-spacing\` | 字符/单词默认间距 |
| \`white-space\` | 默认空白处理（多空格合并） |
| \`align-items\` / \`justify-content\` | 触发新规范行为（flex 容器=\`stretch\`/\`flex-start\`） |

### \`stretch\` / \`baseline\`
flex / grid 容器子项的对齐：\`stretch\` 撑满交叉轴；\`baseline\` 沿文字基线对齐（不同字号子项也能整齐）。

----------------------------------------------------------------------

## §7 zui Chain 四态调用约定

每个 ENHANCED_PROPS 属性都支持以下 4 种调用：

\`\`\`ts
// 1) 函数态 —— 直接传任意 CSS 值
s.color('#ff0080')

// 2) token 态 —— 加 \`_\` 前缀，从主题 schema 查值（自动跟随主题）
s.color._primary
s.padding._lg

// 3) keyword 态 —— 不加 \`_\`，CSS 关键字 / 命名色
s.color.transparent
s.display.flex
s.width.auto

// 4) 单位方法 —— length / time / angle 属性的单位简写
s.width.px(200)        ≡ s.width('200px')
s.fontSize.rem(1.2)
s.animationDuration.ms(300)
\`\`\`

**非 ENHANCED_PROPS**（如 \`transform\` / \`filter\` / \`clipPath\` / \`gridTemplateColumns\` 等复杂语法属性）
只有函数态 + GlobalKw 关键字（\`inherit\` / \`initial\` / \`unset\` / \`revert\` / \`revertLayer\`）。`
