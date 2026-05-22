/**
 * 文字 / 字体 / 列表 / 表格 / 书写方向相关属性中文文档（typography 分组）。
 */

import { lengthUnitsSnippet, type DocsGroup } from './_common'

const typography: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // fontSize
  // ════════════════════════════════════════════════════════════════════
  fontSize: {
    firstLine:
      '设置元素的**字号**。可用长度（px/rem/em 等）、百分比（相对父级字号）、关键字（绝对大小 / 相对大小）。',
    keywordGroups: [
      {
        label: '8 个绝对大小关键字',
        headers: ['关键字', '行为'],
        rows: [
          ['`xxSmall`', '约 9px（浏览器约定）'],
          ['`xSmall`', '约 10px'],
          ['`small`', '约 13px'],
          ['`medium`', '**默认值**，约 16px（浏览器默认字号）'],
          ['`large`', '约 18px'],
          ['`xLarge`', '约 24px'],
          ['`xxLarge`', '约 32px'],
          ['`xxxLarge`', '约 48px'],
        ],
      },
      {
        label: '2 个相对大小关键字',
        headers: ['关键字', '行为'],
        rows: [
          ['`smaller`', '比父元素字号**小一档**（参考 8 阶绝对大小）'],
          ['`larger`', '比父元素字号**大一档**'],
        ],
      },
    ],
    details: `### em vs rem vs px

| 单位 | 参照 | 何时用 |
| --- | --- | --- |
| \`px\` | 绝对 | 精确控制，不响应用户字号设置 |
| \`em\` | **父级**字号 | 跟随上下文缩放（如组件内嵌） |
| \`rem\` | **根元素** \`<html>\` 字号 | 全站统一缩放点（推荐） |
| \`%\` | **父级**字号 | 同 em 行为 |

### 响应式字号

\`\`\`ts
s.fontSize('clamp(14px, 2vw, 18px)')        // 最小 14，理想 2vw，最大 18px
\`\`\`

### 可访问性

直接写 \`px\` 时用户在浏览器调大字号设置**不会缩放**；用 \`rem\` 则会跟随根字号变化 —— 建议用 \`rem\` / \`em\`。

${lengthUnitsSnippet('fontSize')}`,
    syntax: [
      ['`<length>`', "`'16px'` `'1rem'` `'1.2em'`", '具体长度'],
      ['`<percentage>`', "`'120%'`", '相对父字号'],
      ['8 个绝对大小', '`xxSmall` `xSmall` `small` `medium` `large` `xLarge` `xxLarge` `xxxLarge`', '浏览器约定值'],
      ['2 个相对大小', '`smaller` ｜ `larger`', '相对父字号'],
      ['数学函数', "`'clamp(14px, 2vw, 18px)'`", '响应式字号'],
    ],
    initialValue: 'medium',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // fontWeight
  // ════════════════════════════════════════════════════════════════════
  fontWeight: {
    firstLine:
      '设置字体的**粗细**（重量）。可用关键字或数字（100-900，整百）；支持可变字体的任意精细值。',
    keywordGroups: [
      {
        label: '4 个关键字',
        headers: ['关键字', '等价数字', '说明'],
        rows: [
          ['`normal`', '`400`', '**默认值**。常规粗细'],
          ['`bold`', '`700`', '加粗'],
          ['`lighter`', '相对父级', '比父元素**减一档**（在 400 时 → 100）'],
          ['`bolder`', '相对父级', '比父元素**加一档**（在 400 时 → 700）'],
        ],
      },
      {
        label: '数字',
        asTable: false,
        rows: [
          ['`100` Thin / Hairline'],
          ['`200` Extra Light / Ultra Light'],
          ['`300` Light'],
          ['`400` Regular / Normal（= `normal`）'],
          ['`500` Medium'],
          ['`600` Semi Bold / Demi Bold'],
          ['`700` Bold（= `bold`）'],
          ['`800` Extra Bold / Ultra Bold'],
          ['`900` Black / Heavy'],
        ],
      },
    ],
    details: `### 字体能否显示某个 weight 取决于字体文件

不是所有字体都有 9 个 weight。常规字体只有 \`400\` 和 \`700\`：

- 写 \`fontWeight(300)\` 但字体没有 300 → 浏览器降级显示最接近的（通常退回 400）
- 写 \`fontWeight(500)\` 同理

### 可变字体（Variable Font）

支持任意精细值：

\`\`\`ts
s.fontWeight(450)         // 介于 400 和 500 之间（仅可变字体支持）
\`\`\``,
    syntax: [
      ['关键字', '`normal` ｜ `bold` ｜ `lighter` ｜ `bolder`', '基础粗细'],
      ['数字', '`100` … `900`（整百）', '具体粗细等级'],
      ['可变字体', '`450` `550` 等任意值', '仅可变字体支持'],
    ],
    initialValue: 'normal',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // fontFamily
  // ════════════════════════════════════════════════════════════════════
  fontFamily: {
    firstLine:
      '设置元素使用的**字体族**。可写具体字体名 + 回退族，或仅写通用族关键字。',
    keywordGroups: [
      {
        label: '5 个传统通用族（generic family）',
        headers: ['关键字', '行为'],
        rows: [
          ['`serif`', '**衬线**字体（笔画末端有装饰）：宋体、Times New Roman'],
          ['`sansSerif`', '**无衬线**字体：黑体、Arial、Helvetica（屏幕阅读首选）'],
          ['`monospace`', '**等宽**字体：所有字符宽度相同；代码、表格首选'],
          ['`cursive`', '**手写体** / 草书风格'],
          ['`fantasy`', '**艺术装饰**字体（高度可变，少用）'],
        ],
      },
      {
        label: '8 个现代 UI 通用族（CSS Fonts 4）',
        headers: ['关键字', '行为'],
        rows: [
          ['`systemUi`', '**系统 UI 字体**（macOS: SF Pro，Windows: Segoe UI，Linux: Cantarell 等）—— 现代 Web App 首选'],
          ['`uiSerif`', '系统 UI 的衬线版本'],
          ['`uiSansSerif`', '系统 UI 的无衬线版本'],
          ['`uiMonospace`', '系统 UI 的等宽版本'],
          ['`uiRounded`', '系统 UI 的圆角版本（macOS: SF Pro Rounded）'],
          ['`emoji`', '彩色 emoji 字体（自动选择系统 emoji 字体）'],
          ['`math`', '数学公式字体（Cambria Math 等）'],
          ['`fangsong`', '仿宋字体（CJK 专用）'],
        ],
      },
    ],
    details: `### 函数态：字体栈

按优先级列出多个字体，找不到就用下一个，最后兜底通用族：

\`\`\`ts
s.fontFamily("'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")
\`\`\`

### 现代推荐

\`\`\`ts
s.fontFamily('systemUi')                  // 跨平台原生字体（macOS/Win/Linux 各显示对应系统字体）
s.fontFamily.systemUi                     // 等价 token 写法
\`\`\`

### 字体名包含空格 / 中文必须加引号

\`\`\`ts
s.fontFamily("'PingFang SC', 'Microsoft YaHei', sans-serif")
\`\`\``,
    syntax: [
      ['函数态字体栈', "`\"'Inter', sans-serif\"`", '按优先级列出，逗号分隔'],
      ['通用族关键字', '`serif` `sansSerif` `monospace` `cursive` `fantasy`', '5 个传统通用族'],
      ['现代 UI 族', '`systemUi` `uiSerif` `uiSansSerif` `uiMonospace` `uiRounded` `emoji` `math` `fangsong`', 'CSS Fonts 4'],
    ],
    initialValue: '取决于浏览器（一般为 sans-serif）',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // lineHeight
  // ════════════════════════════════════════════════════════════════════
  lineHeight: {
    firstLine:
      '设置文字**行高** —— 每行文字占据的垂直空间。直接影响段落呼吸感与可读性。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`normal`', '**默认值**。浏览器默认（约 1.0~1.2，因字体而异）']],
      },
    ],
    details: `### 函数态：多种写法

| 写法 | 例 | 计算 |
| --- | --- | --- |
| **无单位数字** | \`lineHeight(1.5)\` | 当前字号 × 1.5（**推荐**：子元素继承时按各自字号计算） |
| 长度 | \`lineHeight.px(24)\` | 固定 24px（子元素继承会用固定值，可能不合适） |
| 百分比 | \`lineHeight('150%')\` | 当前字号的 150%（**已计算成长度继承**） |
| em | \`lineHeight('1.5em')\` | 当前字号 × 1.5（已计算） |

### 推荐用无单位数字

\`\`\`ts
s.lineHeight(1.5)                // 子元素继承后按各自字号重新算（最稳）
\`\`\`

### 常用值参考

- \`1.0\` 紧密（标题）
- \`1.2~1.4\` 紧凑（按钮、表格）
- \`1.5~1.6\` 段落正文（最舒适阅读）
- \`1.8~2.0\` 宽松（强调可读性）

${lengthUnitsSnippet('lineHeight')}`,
    syntax: [
      ['无单位数字', '`1.5` `1.2`', '**推荐**：子元素按各自字号算'],
      ['`<length>`', "`'24px'` `'1.5rem'`", '固定长度（继承时维持固定值）'],
      ['`<percentage>`', "`'150%'`", '相对字号'],
      ['`normal`', '—', '浏览器默认'],
    ],
    initialValue: 'normal',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // letterSpacing
  // ════════════════════════════════════════════════════════════════════
  letterSpacing: {
    firstLine:
      '设置**字符之间**的额外间距（正值变宽松，负值变紧凑）。常用于标题字间距优化。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`normal`', '**默认值**。字体本身的间距设定']],
      },
    ],
    details: `### 用例

\`\`\`ts
// 大标题增加字间距（视觉更稳）
s.fontSize('48px')
s.letterSpacing.px(-1)     // 负值（紧凑）

// 全大写英文加字间距（提升可读性）
s.textTransform.uppercase
s.letterSpacing.em(0.05)

// 中文标题适度展开
s.letterSpacing.em(0.1)
\`\`\`

${lengthUnitsSnippet('letterSpacing')}`,
    syntax: [
      ['`<length>`', "`'0.5px'` `'-0.5px'` `'0.05em'`", '可正可负'],
      ['`normal`', '—', '字体本身的间距'],
    ],
    initialValue: 'normal',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // wordSpacing
  // ════════════════════════════════════════════════════════════════════
  wordSpacing: {
    firstLine:
      '设置**单词之间**的额外间距（按空白字符识别单词）。对 CJK 文字效果有限（无空格分词）。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`normal`', '**默认值**。字体本身的单词间距']],
      },
    ],
    details: `### 用例

\`\`\`ts
s.wordSpacing.px(4)              // 单词间距加 4px
s.wordSpacing.em(0.25)           // 间距加当前字号的 25%
\`\`\`

${lengthUnitsSnippet('wordSpacing')}`,
    syntax: [
      ['`<length>`', "`'4px'` `'0.25em'`", '可正可负'],
      ['`normal`', '—', '字体本身设定'],
    ],
    initialValue: 'normal',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // textAlign
  // ════════════════════════════════════════════════════════════════════
  textAlign: {
    firstLine:
      '设置文本**水平对齐方式** —— 左对齐、居中、右对齐、两端对齐等。',
    keywordGroups: [
      {
        label: '8 个对齐 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`start`', '**默认值**。文字方向起点对齐（LTR = 左对齐，RTL = 右对齐）'],
          ['`end`', '文字方向终点对齐'],
          ['`left`', '**强制左**对齐（不依赖书写方向）'],
          ['`right`', '**强制右**对齐'],
          ['`center`', '**水平居中**'],
          ['`justify`', '**两端对齐**：通过调整单词间距让每行齐平左右边界（最后一行除外）；中文效果不佳'],
          ['`matchParent`', '与父元素的 `text-align` **相同**（解决 `start`/`end` 继承时的方向问题）'],
          ['`justifyAll`', '**所有行**都两端对齐（包括最后一行；实验性）'],
        ],
      },
    ],
    details: `### justify 的中文场景

中文没有显著的单词空格，\`justify\` 会拉大字符间距，效果常常不佳。

更好的方案：
\`\`\`ts
s.textAlign.justify
  .textJustify('inter-character')   // 强制按字符调整（CSS 3，浏览器支持不一）
\`\`\`

### 用例

\`\`\`ts
s.textAlign.center                // 居中
s.textAlign.right                 // 右对齐
s.textAlign.justify               // 两端对齐（书籍 / 报纸风格）
\`\`\``,
    syntax: [
      [
        '8 个对齐 keyword',
        '`start` ｜ `end` ｜ `left` ｜ `right` ｜ `center` ｜ `justify` ｜ `matchParent` ｜ `justifyAll`',
        '只接受关键字',
      ],
    ],
    initialValue: 'start',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // textDecorationLine
  // ════════════════════════════════════════════════════════════════════
  textDecorationLine: {
    firstLine:
      '设置**文本装饰线**的类型（下划线 / 删除线 / 上划线 / 拼写错误）。可多选叠加。',
    keywordGroups: [
      {
        label: '6 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`none`', '**默认值**。无装饰线'],
          ['`underline`', '**下划线**（最常用）'],
          ['`overline`', '**上划线**（少用）'],
          ['`lineThrough`', '**删除线**（穿过文字中部）'],
          ['`spellingError`', '拼写错误标记（浏览器原生 typo 红波浪线样式）'],
          ['`grammarError`', '语法错误标记（浏览器原生绿波浪线样式）'],
        ],
      },
    ],
    details: `### 函数态可叠加多个

\`\`\`ts
s.textDecorationLine('underline lineThrough')      // 同时下划线 + 删除线
\`\`\`

### 配合其他装饰属性

完整装饰线写法：

\`\`\`ts
s.textDecorationLine.underline
  .textDecorationStyle.wavy             // 样式
  .textDecorationColor._danger          // 颜色
  .textDecorationThickness.px(2)        // 粗细
\`\`\`

或简写：\`s.textDecoration('underline wavy red 2px')\``,
    syntax: [
      ['6 个 keyword', '`none` ｜ `underline` ｜ `overline` ｜ `lineThrough` ｜ `spellingError` ｜ `grammarError`', '可叠加'],
      ['多个叠加', "`'underline lineThrough'`", '空格分隔多个'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // textDecorationStyle
  // ════════════════════════════════════════════════════════════════════
  textDecorationStyle: {
    firstLine:
      '设置文本装饰线的**样式**（实线 / 虚线 / 双线 / 波浪线）。',
    keywordGroups: [
      {
        label: '5 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`solid`', '**默认值**。实线'],
          ['`double`', '双线'],
          ['`dotted`', '点状虚线'],
          ['`dashed`', '虚线'],
          ['`wavy`', '波浪线（常用于拼写错误提示样式）'],
        ],
      },
    ],
    syntax: [
      ['5 个 keyword', '`solid` ｜ `double` ｜ `dotted` ｜ `dashed` ｜ `wavy`', '只接受关键字'],
    ],
    initialValue: 'solid',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // textDecorationThickness
  // ════════════════════════════════════════════════════════════════════
  textDecorationThickness: {
    firstLine:
      '设置文本装饰线的**粗细**。可精细控制下划线 / 删除线粗细。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。浏览器自动选（按字号 / 字体）'],
          ['`fromFont`', '使用字体文件中**内置**的下划线粗细（如果字体有此元数据）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
s.textDecorationLine.underline
s.textDecorationThickness.px(2)
// 2px 粗下划线（无视字号）
\`\`\`

${lengthUnitsSnippet('textDecorationThickness')}`,
    syntax: [
      ['`<length>`', "`'2px'` `'0.1em'`", '具体长度'],
      ['`<percentage>`', "`'10%'`", '相对字号'],
      ['`auto`', '—', '默认；浏览器自动'],
      ['`fromFont`', '—', '使用字体内置的下划线粗细'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // textTransform
  // ════════════════════════════════════════════════════════════════════
  textTransform: {
    firstLine:
      '控制文字的**大小写转换** / 全角半角转换（不修改 DOM，仅显示层变换）。',
    keywordGroups: [
      {
        label: '7 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`none`', '**默认值**。不变换'],
          ['`capitalize`', '每个单词**首字母大写**（按 Unicode 词边界）'],
          ['`uppercase`', '**全部大写**'],
          ['`lowercase`', '**全部小写**'],
          ['`fullWidth`', '转**全角**字符（半角→全角，CJK 排版用）'],
          ['`fullSizeKana`', '日文小写假名→大写假名（罕用）'],
          ['`mathAuto`', '数学公式自动样式（CSS Math，实验性）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
s.textTransform.uppercase            // HELLO WORLD
s.textTransform.capitalize           // Hello World
\`\`\`

### a11y 注意

\`textTransform: uppercase\` 不修改 DOM —— 屏幕阅读器仍按原文朗读，对全大写英文阅读体验更好。`,
    syntax: [
      [
        '7 个 keyword',
        '`none` ｜ `capitalize` ｜ `uppercase` ｜ `lowercase` ｜ `fullWidth` ｜ `fullSizeKana` ｜ `mathAuto`',
        '只接受关键字',
      ],
    ],
    initialValue: 'none',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // textOverflow
  // ════════════════════════════════════════════════════════════════════
  textOverflow: {
    firstLine:
      '决定**溢出文本**的处理方式（截断或省略号）。需配合 `overflow: hidden` + `whiteSpace: nowrap`（或 line-clamp）才生效。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`clip`', '**默认值**。直接裁剪（在字符中间也会切）'],
          ['`ellipsis`', '**省略号**显示溢出（…），最常用'],
        ],
      },
    ],
    details: `### 单行省略

\`\`\`ts
s.whiteSpace.nowrap          // 不换行
  .overflow.hidden           // 溢出裁剪
  .textOverflow.ellipsis     // 显示省略号
\`\`\`

### 多行省略

需 CSS line-clamp（不属于 textOverflow）：

\`\`\`ts
s.display('-webkit-box')
  .webkitBoxOrient('vertical')
  .webkitLineClamp(2)         // 2 行后省略
  .overflow.hidden
\`\`\``,
    syntax: [['2 个 keyword', '`clip` ｜ `ellipsis`', '只接受关键字']],
    initialValue: 'clip',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // textIndent
  // ════════════════════════════════════════════════════════════════════
  textIndent: {
    firstLine:
      '设置**首行缩进** —— 段落第一行的左侧（或 LTR/RTL 起点侧）额外缩进。中文排版常用 2 字符。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [
          ['只接受长度 / 百分比，**无 CSS 关键字**（除全局关键字）'],
          ['百分比相对**包含块宽度**'],
          ['可为**负值**（首行外凸缩进，悬挂效果）'],
        ],
      },
    ],
    details: `### 中文典型用法

\`\`\`ts
s.textIndent.em(2)              // 首行缩进 2 字符（最常用）
\`\`\`

### 悬挂缩进（hanging indent）

\`\`\`ts
s.textIndent.em(-2)
s.paddingLeft.em(2)
// 首行外凸 2 字符，配合 padding-left 让首行齐左边，其他行向右缩进
\`\`\`

${lengthUnitsSnippet('textIndent')}`,
    syntax: [
      ['`<length>`', "`'2em'` `'32px'`", '可正可负'],
      ['`<percentage>`', "`'10%'`", '相对包含块宽度'],
    ],
    initialValue: '0',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // whiteSpace
  // ════════════════════════════════════════════════════════════════════
  whiteSpace: {
    firstLine:
      '控制文本中**空白字符**（空格、换行、tab）的处理 + 是否换行。CSS 中最容易混淆的属性之一。',
    keywordGroups: [
      {
        label: '8 个 keyword',
        headers: ['关键字', '空白', '换行符', '自动换行'],
        rows: [
          ['`normal`', '**默认值**。多个空白合并为一个', '换行符当空格处理', '✓ 内容溢出时换行'],
          ['`nowrap`', '多空白合并', '换行符当空格', '✗ **不换行**（单行）'],
          ['`pre`', '**保留**所有空白', '**保留**换行', '✗ 不自动换行（同 `<pre>`）'],
          ['`preWrap`', '保留所有空白', '保留换行', '✓ 同时自动换行'],
          ['`preLine`', '多空白合并', '**保留**换行', '✓ 自动换行'],
          ['`breakSpaces`', '保留所有空白（含尾部空格）', '保留换行', '✓ 自动换行（更严格）'],
          ['`wrap`', '同 `normal`（CSS Text 4 新别名）', '换行符当空格', '✓'],
          ['`collapse`', '同 `normal` 的合并行为（CSS Text 4 新）', '—', '—'],
        ],
      },
    ],
    details: `### 速查

| 需求 | 写法 |
| --- | --- |
| 默认 | \`normal\` |
| **单行省略**（不换行） | \`nowrap\` |
| 显示代码 / ASCII art（**完全保留**格式） | \`pre\` |
| Markdown / 富文本（**保留换行**但自动断行） | \`preWrap\` |

### nowrap 经典用法

\`\`\`ts
// 一行省略
s.whiteSpace.nowrap
s.overflow.hidden
s.textOverflow.ellipsis
\`\`\``,
    syntax: [
      [
        '8 个 keyword',
        '`normal` ｜ `nowrap` ｜ `pre` ｜ `preWrap` ｜ `preLine` ｜ `breakSpaces` ｜ `wrap` ｜ `collapse`',
        '只接受关键字',
      ],
    ],
    initialValue: 'normal',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // wordBreak
  // ════════════════════════════════════════════════════════════════════
  wordBreak: {
    firstLine:
      '控制**单词何时可断行** —— 处理英文长单词溢出、CJK 文本断行规则。',
    keywordGroups: [
      {
        label: '5 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          [
            '`normal`',
            '**默认值**。按语言规则断行（CJK 在任意字符间断，英文仅在空格 / 连字符断）',
          ],
          ['`breakAll`', '**任意字符间**都可断（包括英文中间）—— 适合容纳长 URL'],
          ['`keepAll`', 'CJK 文字**不可断**（仅在空格 / 连字符 / 标点处断）'],
          ['`breakWord`', '已弃用，等同 `overflow-wrap: anywhere`'],
          ['`autoPhrase`', 'CJK 智能短语断行（CSS Text 4 实验性）'],
        ],
      },
    ],
    details: `### wordBreak vs overflowWrap

| 属性 | 行为 |
| --- | --- |
| \`wordBreak\` | 控制**所有字符**是否可断（侵入性强） |
| \`overflowWrap\` | 仅在**单词无法放下**时才断（更友好） |

### 用例

\`\`\`ts
// 长 URL / hash 自动断
s.wordBreak.breakAll

// CJK 不在字符间断（更自然）
s.wordBreak.keepAll
\`\`\``,
    syntax: [
      ['5 个 keyword', '`normal` ｜ `breakAll` ｜ `keepAll` ｜ `breakWord` ｜ `autoPhrase`', '只接受关键字'],
    ],
    initialValue: 'normal',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // textWrap
  // ════════════════════════════════════════════════════════════════════
  textWrap: {
    firstLine:
      '控制**文本换行算法**（CSS Text 4）—— 让长段落的换行更美观（避免孤行、平衡每行长度）。',
    keywordGroups: [
      {
        label: '5 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`wrap`', '**默认值**。允许换行'],
          ['`nowrap`', '不换行（同 `whiteSpace: nowrap`）'],
          [
            '`balance`',
            '**平衡换行**：每行宽度尽量接近（标题最佳实践，避免最后一行只有 1-2 个词）',
          ],
          [
            '`pretty`',
            '美化换行：浏览器避免"孤行"（段尾单独一个词的悬挂行）；性能比 balance 好',
          ],
          ['`stable`', '保证文字增量更新时**前面行不变**（罕用，文本动画场景）'],
        ],
      },
    ],
    details: `### balance vs pretty

| 关键字 | 用途 | 性能 |
| --- | --- | --- |
| \`balance\` | **标题** / 短段落（≤ 6 行）| 较慢，浏览器多次试算 |
| \`pretty\` | **长段落正文** | 性能好，主要避免最后一行孤行 |

### 用例

\`\`\`ts
s.textWrap.balance              // 标题最佳实践

s.textWrap.pretty               // 长段落（避免末行孤词）
\`\`\``,
    syntax: [
      ['5 个 keyword', '`wrap` ｜ `nowrap` ｜ `balance` ｜ `pretty` ｜ `stable`', '只接受关键字'],
    ],
    initialValue: 'wrap',
    inherits: true,
    browserNote:
      '`balance` Chrome 114 / Firefox 121 / Safari 17.5。`pretty` Chrome 117。`stable` 渐进推广。',
  },

  // ════════════════════════════════════════════════════════════════════
  // 表格 + 列表 + 书写方向
  // ════════════════════════════════════════════════════════════════════
  tableLayout: {
    firstLine:
      '决定 `<table>` 列宽**算法**。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。浏览器读完全部内容后**自适应**列宽（慢，但灵活）'],
          [
            '`fixed`',
            '**首行决定**所有列宽（快）；超出内容截断或换行，不影响列宽',
          ],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
s.tableLayout.fixed
s.width('100%')
// 大表格性能优化：跳过列宽计算，按首行/colgroup 设的宽
\`\`\``,
    syntax: [['2 个 keyword', '`auto` ｜ `fixed`', '只接受关键字']],
    initialValue: 'auto',
    inherits: false,
  },

  captionSide: {
    firstLine:
      '决定 `<caption>` 元素（表格标题）**显示在表格上方还是下方**。',
    keywordGroups: [
      {
        label: '6 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`top`', '**默认值**。标题在表格**上方**'],
          ['`bottom`', '标题在表格**下方**'],
          ['`blockStart`', '逻辑属性：块方向起点（横向书写 = top）'],
          ['`blockEnd`', '逻辑属性：块方向终点（横向书写 = bottom）'],
          ['`inlineStart`', '逻辑属性：行内方向起点（罕用）'],
          ['`inlineEnd`', '逻辑属性：行内方向终点'],
        ],
      },
    ],
    syntax: [
      ['6 个 keyword', '`top` ｜ `bottom` ｜ `blockStart` ｜ `blockEnd` ｜ `inlineStart` ｜ `inlineEnd`', '物理 / 逻辑方向'],
    ],
    initialValue: 'top',
    inherits: true,
  },

  listStyleType: {
    firstLine:
      '设置列表项的**标记类型**（点 / 数字 / 罗马字 / 自定义）。',
    keywordGroups: [
      {
        label: '基础标记',
        headers: ['关键字', '行为'],
        rows: [
          ['`disc`', '**默认值**（`<ul>`）。实心圆点 •'],
          ['`circle`', '空心圆 ○'],
          ['`square`', '实心方块 ▪'],
          ['`none`', '**无标记**（常用于自定义列表）'],
        ],
      },
      {
        label: '数字 / 字母',
        headers: ['关键字', '行为'],
        rows: [
          ['`decimal`', '**默认值**（`<ol>`）。阿拉伯数字 1, 2, 3'],
          ['`decimalLeadingZero`', '带前导零的数字 01, 02, 03'],
          ['`lowerRoman`', '小写罗马字 i, ii, iii'],
          ['`upperRoman`', '大写罗马字 I, II, III'],
          ['`lowerAlpha`', '小写字母 a, b, c'],
          ['`upperAlpha`', '大写字母 A, B, C'],
        ],
      },
      {
        label: '国际化',
        headers: ['关键字', '行为'],
        rows: [
          ['`lowerGreek`', '小写希腊字母 α, β, γ'],
          ['`armenian`', '亚美尼亚数字'],
          ['`georgian`', '格鲁吉亚数字'],
          ['`hebrew`', '希伯来数字'],
          ['`hiragana`', '日语平假名 あ, い, う'],
          ['`katakana`', '日语片假名 ア, イ, ウ'],
          ['`cjkIdeographic`', 'CJK 表意文字 一, 二, 三'],
        ],
      },
    ],
    details: `### 函数态：自定义符号

\`\`\`ts
s.listStyleType("'→ '")              // 用箭头作标记
s.listStyleType('"★ "')              // 自定义符号
\`\`\``,
    syntax: [
      ['基础标记', '`disc` ｜ `circle` ｜ `square` ｜ `none`', '常用'],
      ['数字 / 字母', '`decimal` `decimalLeadingZero` `lowerRoman` `upperRoman` `lowerAlpha` `upperAlpha`', ''],
      ['国际化', '`lowerGreek` `armenian` `georgian` `hebrew` `hiragana` `katakana` `cjkIdeographic`', ''],
      ['自定义字符', "`\"'★ '\"`", '用字符串作为标记'],
    ],
    initialValue: 'disc',
    inherits: true,
  },

  listStylePosition: {
    firstLine:
      '决定列表标记**在文本之外还是文本流之内**。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`outside`', '**默认值**。标记在 li 的内容框**外侧**（标记不参与换行缩进）'],
          [
            '`inside`',
            '标记**在 li 内容内**（标记跟随文字一起缩进、参与换行）',
          ],
        ],
      },
    ],
    syntax: [['2 个 keyword', '`outside` ｜ `inside`', '只接受关键字']],
    initialValue: 'outside',
    inherits: true,
  },

  listStyleImage: {
    firstLine:
      '使用**图片**作为列表标记（替代 `listStyleType` 的字符）。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。不使用图片']],
      },
    ],
    details: `### 用例

\`\`\`ts
s.listStyleImage("url('/icons/check.svg')")
\`\`\`

⚠️ 浏览器对图片大小无统一控制，**多数现代项目改用 \`::marker\` 伪元素或自定义符号**。`,
    syntax: [
      ['`<url>`', "`\"url('/icons/dot.svg')\"`", '图片 URL'],
      ['`none`', '—', '不使用图片'],
    ],
    initialValue: 'none',
    inherits: true,
  },

  writingMode: {
    firstLine:
      '设置**书写方向** —— 横排 / 竖排，从左到右 / 从右到左。CJK 古典竖排、日文 / 蒙文等需要。',
    keywordGroups: [
      {
        label: '5 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`horizontalTb`', '**默认值**。**横排**，从上到下流（最常见，中英文）'],
          [
            '`verticalRl`',
            '**竖排**，从**右到左**列流（日文 / 中文古籍）',
          ],
          ['`verticalLr`', '**竖排**，从**左到右**列流（蒙文）'],
          ['`sidewaysRl`', '横排文字侧躺，从右到左（罕用）'],
          ['`sidewaysLr`', '横排文字侧躺，从左到右（罕用）'],
        ],
      },
    ],
    syntax: [
      ['5 个 keyword', '`horizontalTb` ｜ `verticalRl` ｜ `verticalLr` ｜ `sidewaysRl` ｜ `sidewaysLr`', '只接受关键字'],
    ],
    initialValue: 'horizontalTb',
    inherits: true,
  },

  direction: {
    firstLine:
      '设置**文本流方向** —— 从左到右（LTR）或从右到左（RTL）。RTL 用于阿拉伯语 / 希伯来语。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`ltr`', '**默认值**。从**左到右**（中英文、大多数语言）'],
          ['`rtl`', '从**右到左**（阿拉伯语、希伯来语等）'],
        ],
      },
    ],
    details: `⚠️ **推荐用 HTML \`dir\` 属性**而非 CSS \`direction\` —— HTML 属性还会影响 Unicode 双向算法 (BiDi)，更全面。

\`\`\`html
<html lang="ar" dir="rtl">
\`\`\``,
    syntax: [['2 个 keyword', '`ltr` ｜ `rtl`', '只接受关键字']],
    initialValue: 'ltr',
    inherits: true,
  },

  textOrientation: {
    firstLine:
      '在竖排书写（`writingMode: verticalRl/verticalLr`）时，控制单个**字符的朝向**。',
    keywordGroups: [
      {
        label: '3 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`mixed`', '**默认值**。CJK 字符正立，西文字符侧躺'],
          ['`upright`', '**所有字符都正立**（西文字符也正立，每字单独一行）'],
          ['`sideways`', '**所有字符侧躺**（变成 90° 旋转的横排）'],
        ],
      },
    ],
    syntax: [['3 个 keyword', '`mixed` ｜ `upright` ｜ `sideways`', '只接受关键字']],
    initialValue: 'mixed',
    inherits: true,
  },
}

export default typography
