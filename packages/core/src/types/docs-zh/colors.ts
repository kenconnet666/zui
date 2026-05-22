/**
 * 颜色属性中文文档（colors 分组）。
 *
 * 覆盖：color / backgroundColor / borderColor + 4 方位 / outlineColor /
 * textDecorationColor / caretColor / accentColor / columnRuleColor / fill / stroke
 */

import { colorTokenUsage, COLOR_SYNTAX_ROWS, type DocsGroup } from './_common'

const colors: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // color —— 前景色 / currentColor 源（最详细，其他颜色属性参考此模式）
  // ════════════════════════════════════════════════════════════════════
  color: {
    firstLine:
      '设置元素的**前景色** —— 文字色，并作为 `currentColor` 源被 `border-color` / `outline-color` / svg `fill` / `caret-color` 等在未显式设置时引用。',

    keywordGroups: [
      {
        label: '通用颜色关键字（4 个）',
        headers: ['关键字', '等价', '用途'],
        rows: [
          ['`white`', '`#FFFFFF`', '纯白'],
          ['`black`', '`#000000`', '纯黑'],
          [
            '`transparent`',
            '`rgba(0,0,0,0)`',
            '完全透明；用于渐变端点比直接写透明色更稳定（避免某些浏览器在 alpha=0 时丢色相）',
          ],
          [
            '`currentColor`',
            '引用当前层级 `color`',
            '让 border / outline / svg fill 跟随文字色（"跟随文字色"最常用关键字）',
          ],
        ],
      },
    ],

    details: `\`color\` 作用范围远超"文字色"：
1. **文字主色**（所有未被 \`::selection\` / 子元素覆盖的文字）
2. **文本装饰线**（\`text-decoration-color\` 未设时跟随）
3. **\`currentColor\` 链的源头**：\`border-color\` / \`outline-color\` / svg \`fill\` / \`stroke\` /
   \`caret-color\` 等未显式设置时都回退到 \`currentColor\`，即沿用当前 \`color\`
4. 调一处 \`color\` 可联动一组相关视觉，无需写一堆 \`borderColor\` / \`fill\`

${colorTokenUsage('color')}

### 常见陷阱

- \`currentColor\` 是**动态引用**：父元素 \`color\` 改了，子元素用 \`currentColor\` 的属性都跟着变
- 继承属性，给容器设了会影响所有未单独设色的子元素（包括 svg \`<use>\` / \`<symbol>\`）
- \`transparent\` 视觉上等同 \`rgba(0,0,0,0)\`，但渐变 / \`color-mix()\` 中行为更稳定（前者保留色相，后者可能丢）`,

    insertNamedColors: true,

    syntax: COLOR_SYNTAX_ROWS,
    initialValue: 'canvastext',
    inherits: true,
    browserNote:
      '远古属性，所有浏览器都支持。OKLCH / `color-mix()` / `<system-color>` 等 CSS 4/5 新形式需较新浏览器（2023+）。',
  },

  // ════════════════════════════════════════════════════════════════════
  // backgroundColor
  // ════════════════════════════════════════════════════════════════════
  backgroundColor: {
    firstLine: '设置元素的**背景色**。叠在 `background-image` 之下，常用作底色。',

    keywordGroups: [
      {
        label: '通用颜色关键字（4 个）',
        headers: ['关键字', '等价', '用途'],
        rows: [
          ['`white`', '`#FFFFFF`', '纯白'],
          ['`black`', '`#000000`', '纯黑'],
          ['`transparent`', '`rgba(0,0,0,0)`', '**默认值**。完全透明，露出父背景'],
          ['`currentColor`', '引用当前 `color`', '让背景跟随文字色变（罕用）'],
        ],
      },
    ],

    details: `背景色在 \`background\` 简写中可省略；与 \`background-image\` 共存时背景图叠在背景色之上。

${colorTokenUsage('backgroundColor')}

### 常见陷阱

- 默认 \`transparent\` 而不是 \`white\`（与传统认知不同）
- 与 \`background-clip\` 配合：\`backgroundClip.text\` 让背景色只在文字范围显示（霓虹字效果）
- 非继承属性 —— 子元素不会继承父背景色`,

    insertNamedColors: true,

    syntax: COLOR_SYNTAX_ROWS,
    initialValue: 'transparent',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // borderColor —— 四方位简写
  // ════════════════════════════════════════════════════════════════════
  borderColor: {
    firstLine: '设置元素**四条边框**的颜色（简写，可一次设 1/2/3/4 个值）。',

    keywordGroups: [
      {
        label: '通用颜色关键字（4 个）',
        headers: ['关键字', '等价', '用途'],
        rows: [
          ['`white`', '`#FFFFFF`', '纯白'],
          ['`black`', '`#000000`', '纯黑'],
          ['`transparent`', '`rgba(0,0,0,0)`', '完全透明边框；仍占边框宽度位置，可见为间隙'],
          ['`currentColor`', '**默认值**，跟随 `color`', '让边框色跟随文字色变（最常用）'],
        ],
      },
    ],

    details: `### 简写语法

\`s.borderColor('red')\` 等同四边设为 red；多值时按 CSS 简写规则：

- 1 值：四边相同
- 2 值：上下 / 左右
- 3 值：上 / 左右 / 下
- 4 值：上 / 右 / 下 / 左（顺时针）

\`s.borderColor('red green blue yellow')\` 等同上=red 右=green 下=blue 左=yellow。

${colorTokenUsage('borderColor')}

### 配合 borderStyle / borderWidth

只有 \`border-style\` 不是 \`none\` 时才显示边框 —— **新元素默认 border-style 是 none**，光设颜色不显示！
正确写法：\`s.border('1px solid'); s.borderColor._primary\`（两条 statement，statement-only 风）。`,

    insertNamedColors: true,

    syntax: [
      ...COLOR_SYNTAX_ROWS,
      ['多值简写', "`'red green blue yellow'`", '1/2/3/4 个值按上述简写规则分配'],
    ],
    initialValue: 'currentColor',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // borderTopColor / borderRightColor / borderBottomColor / borderLeftColor
  // ════════════════════════════════════════════════════════════════════
  borderTopColor: {
    extends: 'borderColor',
    firstLine: '设置元素**上边框**的颜色。其他规则同 [`borderColor`]。',
  },
  borderRightColor: {
    extends: 'borderColor',
    firstLine: '设置元素**右边框**的颜色。其他规则同 [`borderColor`]。',
  },
  borderBottomColor: {
    extends: 'borderColor',
    firstLine: '设置元素**下边框**的颜色。其他规则同 [`borderColor`]。',
  },
  borderLeftColor: {
    extends: 'borderColor',
    firstLine: '设置元素**左边框**的颜色。其他规则同 [`borderColor`]。',
  },

  // ════════════════════════════════════════════════════════════════════
  // outlineColor
  // ════════════════════════════════════════════════════════════════════
  outlineColor: {
    firstLine: '设置元素的**外轮廓 outline 颜色**。outline 不占空间、可跨圆角包绕，常用于焦点态高亮。',

    keywordGroups: [
      {
        label: '通用颜色关键字（4 个）',
        headers: ['关键字', '等价', '用途'],
        rows: [
          ['`white`', '`#FFFFFF`', '纯白'],
          ['`black`', '`#000000`', '纯黑'],
          ['`transparent`', '`rgba(0,0,0,0)`', '透明轮廓（保留焦点行为但不可见，**慎用，影响可访问性**）'],
          [
            '`currentColor`',
            '**默认值**，跟随 `color`',
            '轮廓色跟随文字色变（最常用）',
          ],
        ],
      },
      {
        label: '此属性特有',
        headers: ['关键字', '行为'],
        rows: [
          [
            '`invert`',
            '反色：将下方像素颜色取反作为 outline 颜色（深色变浅、浅色变深，保证可见）。**浏览器实现不一致**，常退化为 `currentColor`',
          ],
        ],
      },
    ],

    details: `**outline 与 border 的区别**：
- outline **不占空间**（不撑大盒子），border 占
- outline 可在 \`borderRadius\` 圆角**外**包绕，CSS 3 起跟随圆角
- outline 默认不能分边设置（CSS 4 起部分浏览器支持 \`outline-top-color\` 等）

${colorTokenUsage('outlineColor')}

### 常见用途

- \`:focus-visible\` 高亮：键盘聚焦时显示蓝色 outline（用 \`outline\` 而非 \`border\` 不抖动布局）
- 调试：临时 \`outline: 1px solid red\` 给元素加可见框不影响布局`,

    insertNamedColors: true,

    syntax: [
      ...COLOR_SYNTAX_ROWS,
      ['`invert`', '—', '反色（罕用，浏览器实现不一致）'],
    ],
    initialValue: 'currentColor',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // textDecorationColor
  // ════════════════════════════════════════════════════════════════════
  textDecorationColor: {
    firstLine:
      '设置**文本装饰线**（下划线 / 删除线 / 上划线）的颜色。未设置时跟随 `color`。',

    keywordGroups: [
      {
        label: '通用颜色关键字（4 个）',
        headers: ['关键字', '等价', '用途'],
        rows: [
          ['`white`', '`#FFFFFF`', '纯白'],
          ['`black`', '`#000000`', '纯黑'],
          ['`transparent`', '`rgba(0,0,0,0)`', '隐藏装饰线（但仍占位）'],
          [
            '`currentColor`',
            '**默认值**，跟随 `color`',
            '装饰线跟随文字色（最常用）',
          ],
        ],
      },
    ],

    details: `### 配合 textDecorationLine / textDecorationStyle

需要先开启装饰线（\`textDecorationLine.underline\` 等）才能看到颜色生效：

\`\`\`ts
s.textDecorationLine.underline
  .textDecorationStyle.wavy
  .textDecorationColor._danger    // 红色波浪下划线（错误提示常用）
\`\`\`

${colorTokenUsage('textDecorationColor')}`,

    insertNamedColors: true,

    syntax: COLOR_SYNTAX_ROWS,
    initialValue: 'currentColor',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // caretColor
  // ════════════════════════════════════════════════════════════════════
  caretColor: {
    firstLine:
      '设置**文本输入光标**（caret）的颜色 —— `<input>` / `<textarea>` / `contenteditable` 元素聚焦时的闪烁竖线。',

    keywordGroups: [
      {
        label: '通用颜色关键字（4 个）',
        headers: ['关键字', '等价', '用途'],
        rows: [
          ['`white`', '`#FFFFFF`', '纯白光标（深色背景输入框常用）'],
          ['`black`', '`#000000`', '纯黑光标'],
          [
            '`transparent`',
            '`rgba(0,0,0,0)`',
            '隐藏光标（仍可输入，**慎用，影响可访问性**；只在自定义光标动画时用）',
          ],
          ['`currentColor`', '引用 `color`', '光标跟随文字色变'],
        ],
      },
      {
        label: '此属性特有',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。浏览器自动选择（一般同 `color`，但会针对背景做对比度调整）'],
        ],
      },
    ],

    details: `### 用例

\`\`\`ts
s.caretColor._primary           // 让光标用品牌色
s.caretColor.transparent        // 隐藏光标（配合 JS 自定义光标）
\`\`\`

${colorTokenUsage('caretColor')}

### 常见陷阱

- 在 \`<input type="checkbox">\` / \`<input type="radio">\` 上无效（这些控件无文本光标）
- 仅在元素**聚焦时**可见`,

    insertNamedColors: true,

    syntax: [
      ...COLOR_SYNTAX_ROWS,
      ['`auto`', '—', '默认；浏览器按对比度自动选'],
    ],
    initialValue: 'auto',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // accentColor
  // ════════════════════════════════════════════════════════════════════
  accentColor: {
    firstLine:
      '设置**原生表单控件**（checkbox / radio / range slider / progress bar）的强调色。让 `<input type="checkbox">` 等不用自定义 CSS 即可染色。',

    keywordGroups: [
      {
        label: '通用颜色关键字（4 个）',
        headers: ['关键字', '等价', '用途'],
        rows: [
          ['`white`', '`#FFFFFF`', '纯白'],
          ['`black`', '`#000000`', '纯黑'],
          ['`transparent`', '`rgba(0,0,0,0)`', '透明（罕用）'],
          ['`currentColor`', '引用 `color`', '表单强调色跟随文字色'],
        ],
      },
      {
        label: '此属性特有',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。浏览器使用平台原生强调色（macOS 蓝、Windows 蓝）'],
        ],
      },
    ],

    details: `### 用例

\`\`\`html
<input type="checkbox" :style="{ accentColor: theme.color._primary }" />
\`\`\`

\`\`\`ts
s.accentColor._primary     // 全站表单控件用品牌色
\`\`\`

适用控件：\`<input type="checkbox"|"radio"|"range">\` / \`<progress>\`。

${colorTokenUsage('accentColor')}

### 浏览器支持

CSS Color 4 新属性，Chrome 93+ / Firefox 92+ / Safari 15.4+ 支持。旧浏览器自动忽略，回退到平台原生色。`,

    insertNamedColors: true,

    syntax: [
      ...COLOR_SYNTAX_ROWS,
      ['`auto`', '—', '默认；平台原生强调色'],
    ],
    initialValue: 'auto',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // columnRuleColor
  // ════════════════════════════════════════════════════════════════════
  columnRuleColor: {
    firstLine:
      '设置**多栏布局**（`column-count` / `columns`）中**栏间分隔线**的颜色。类似栏间的 border。',

    keywordGroups: [
      {
        label: '通用颜色关键字（4 个）',
        headers: ['关键字', '等价', '用途'],
        rows: [
          ['`white`', '`#FFFFFF`', '纯白'],
          ['`black`', '`#000000`', '纯黑'],
          ['`transparent`', '`rgba(0,0,0,0)`', '透明分隔线（不可见）'],
          ['`currentColor`', '**默认值**，跟随 `color`', '分隔线跟随文字色'],
        ],
      },
    ],

    details: `### 多栏布局示例

\`\`\`ts
s.columns(3)                          // 三栏
  .columnRuleStyle.solid
  .columnRuleWidth.px(1)
  .columnRuleColor._textDisabled      // 灰色分隔线
\`\`\`

${colorTokenUsage('columnRuleColor')}

### 配合 columnRuleStyle / columnRuleWidth

类似边框三件套：必须同时设 \`columnRuleStyle\`（默认是 \`none\`），否则线不显示。`,

    insertNamedColors: true,

    syntax: COLOR_SYNTAX_ROWS,
    initialValue: 'currentColor',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // fill —— SVG
  // ════════════════════════════════════════════════════════════════════
  fill: {
    firstLine:
      'SVG 专属：设置 SVG 图形（`<path>` / `<circle>` / `<rect>` 等）的**填充颜色**。',

    keywordGroups: [
      {
        label: '通用颜色关键字（4 个）',
        headers: ['关键字', '等价', '用途'],
        rows: [
          ['`white`', '`#FFFFFF`', '纯白填充'],
          ['`black`', '`#000000`', '**默认值**。纯黑填充'],
          ['`transparent`', '`rgba(0,0,0,0)`', '完全透明，等同 `none`（露出下层）'],
          [
            '`currentColor`',
            '引用 `color`',
            '让 SVG 跟随文字色 —— **icon font 风格**的核心写法',
          ],
        ],
      },
      {
        label: 'SVG 专属',
        headers: ['关键字', '行为'],
        rows: [
          ['`none`', '无填充（与 `transparent` 视觉相同，但语义更清晰）'],
          [
            '`context-fill`',
            '引用调用 SVG 的元素的 fill（在 `<use>` 引用的 \\<symbol\\> 内使用）',
          ],
          ['`context-stroke`', '引用调用元素的 stroke'],
        ],
      },
      {
        label: 'SVG paint server 引用',
        headers: ['形式', '示例', '用途'],
        rows: [
          ['`url(#id)`', "`'url(#gradient1)'`", '引用 `<linearGradient>` / `<radialGradient>` / `<pattern>` 实现渐变/图案填充'],
        ],
      },
    ],

    details: `### Icon font 风格写法

SVG 图标继承文字色的标准模式 —— SVG 内 \`fill="currentColor"\`：

\`\`\`html
<svg viewBox="0 0 24 24"><path fill="currentColor" d="..." /></svg>
\`\`\`

外层只需改 \`color\` 即可整体染色：

\`\`\`ts
s.color._danger      // 文字 + svg 全变红
\`\`\`

${colorTokenUsage('fill')}

### 常见陷阱

- 浏览器渲染 SVG 时 \`fill\` 默认为 \`black\` 而不是 \`currentColor\` —— icon 库通常会自动加 \`fill="currentColor"\`
- 同时设了 SVG 属性 \`fill="red"\` 和 CSS \`fill\`：CSS 优先级**低于** presentation attribute，但比 inline style 低（CSS Spec 已修正，现代浏览器 CSS > attribute）`,

    insertNamedColors: true,

    syntax: [
      ...COLOR_SYNTAX_ROWS,
      ['`none`', '—', '无填充（SVG 专属）'],
      ['`url(#id)`', "`'url(#grad)'`", 'SVG paint server 引用（渐变/图案）'],
      ['`context-fill` / `context-stroke`', '—', '在 `<symbol>` 内引用调用元素的 fill/stroke'],
    ],
    initialValue: 'black',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // stroke —— SVG
  // ════════════════════════════════════════════════════════════════════
  stroke: {
    firstLine:
      'SVG 专属：设置 SVG 图形的**描边颜色**（线条 / 轮廓）。配合 `stroke-width` 控制粗细。',

    keywordGroups: [
      {
        label: '通用颜色关键字（4 个）',
        headers: ['关键字', '等价', '用途'],
        rows: [
          ['`white`', '`#FFFFFF`', '纯白描边'],
          ['`black`', '`#000000`', '纯黑描边'],
          ['`transparent`', '`rgba(0,0,0,0)`', '完全透明（等同 `none`）'],
          ['`currentColor`', '引用 `color`', 'icon 风格：描边跟随文字色'],
        ],
      },
      {
        label: 'SVG 专属',
        headers: ['关键字', '行为'],
        rows: [
          ['`none`', '**默认值**。无描边'],
          ['`context-fill` / `context-stroke`', '在 `<symbol>` 内引用调用元素的 fill/stroke'],
        ],
      },
    ],

    details: `### 配合 strokeWidth / strokeLinecap / strokeLinejoin

完整描边需要四件套：

\`\`\`ts
// SVG 元素
s.stroke._primary
  .strokeWidth.px(2)
  .strokeLinecap.round              // 端点圆角
  .strokeLinejoin.round             // 拐角圆角
\`\`\`

${colorTokenUsage('stroke')}

### 常见陷阱

- 默认 \`stroke: none\`（与 \`fill: black\` 相反）—— 不写 stroke 就没有描边
- \`stroke-width\` 默认 \`1px\` —— 即使写了 \`stroke\` 不指定宽度也能看到 1px 细线`,

    insertNamedColors: true,

    syntax: [
      ...COLOR_SYNTAX_ROWS,
      ['`none`', '—', '无描边（**默认值**）'],
      ['`url(#id)`', "`'url(#grad)'`", 'SVG paint server 引用'],
    ],
    initialValue: 'none',
    inherits: true,
  },
}

export default colors
