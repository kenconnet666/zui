/**
 * 布局相关属性中文文档（layout 分组）。
 *
 * 覆盖：display / position / visibility / overflow* / boxSizing / float / clear / isolation
 */

import type { DocsGroup } from './_common'

const layout: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // display
  // ════════════════════════════════════════════════════════════════════
  display: {
    firstLine:
      '决定元素的**显示类型** —— 是块级、行内、flex 容器、grid 容器还是不显示等。CSS 布局的总开关。',

    keywordGroups: [
      {
        label: '基础显示类型（外部布局）',
        headers: ['关键字', '行为'],
        rows: [
          ['`block`', '**块级**：独占一行，可设宽高；如 `<div>`/`<p>` 的默认表现'],
          [
            '`inline`',
            '**行内**：与文字同行，宽高/marginY/paddingY 部分无效；如 `<span>`/`<a>` 的默认表现',
          ],
          [
            '`inlineBlock`',
            '**行内块**：与文字同行（不换行），但可设完整 width/height/margin/padding；按钮/标签常用',
          ],
          [
            '`none`',
            '**完全不渲染**（不占任何空间）。注意：屏幕阅读器**仍会跳过**，可访问性需评估',
          ],
          [
            '`contents`',
            '元素自身消失但**子元素照常渲染**，子元素直接成为父的子；用于去掉无意义包装层',
          ],
        ],
      },
      {
        label: 'Flex / Grid 容器',
        headers: ['关键字', '行为'],
        rows: [
          ['`flex`', '**块级 flex 容器**：子元素自动成为 flex item，按主轴/交叉轴排列'],
          ['`inlineFlex`', '行内 flex 容器（与文字同行）'],
          ['`grid`', '**块级 grid 容器**：子元素自动成为 grid item，按行列排布'],
          ['`inlineGrid`', '行内 grid 容器'],
        ],
      },
      {
        label: '其他特殊容器',
        headers: ['关键字', '行为'],
        rows: [
          [
            '`flowRoot`',
            '**触发 BFC**（块格式化上下文）—— 现代清浮动方案；元素内的浮动不会影响外部',
          ],
          ['`listItem`', '生成列表标记符号（与 `list-style` 配合）；如 `<li>` 默认'],
          ['`ruby`', '日文/中文注音排版（基线对齐注音字符）；罕用'],
        ],
      },
      {
        label: 'Table 家族（模拟 HTML 表格）',
        headers: ['关键字', '行为'],
        rows: [
          ['`table`', '块级表格容器（同 `<table>`）'],
          ['`inlineTable`', '行内表格容器'],
          [
            '`tableCell`',
            '表格单元格（同 `<td>`/`<th>`）—— 经常用于精确垂直居中（配合 `vertical-align: middle`）',
          ],
          ['`tableRow`', '表格行（同 `<tr>`）'],
          ['`tableColumn`', '表格列定义（同 `<col>`）'],
          ['`tableRowGroup`', '同 `<tbody>`'],
          ['`tableHeaderGroup`', '同 `<thead>`'],
          ['`tableFooterGroup`', '同 `<tfoot>`'],
          ['`tableColumnGroup`', '同 `<colgroup>`'],
          ['`tableCaption`', '同 `<caption>`'],
        ],
      },
    ],

    details: `### 默认值与元素类型

\`display\` **默认值取决于 HTML 元素类型**（user-agent 样式表决定）：
- \`<div>\` \`<p>\` \`<section>\` 等：\`block\`
- \`<span>\` \`<a>\` \`<strong>\` 等：\`inline\`
- \`<img>\` \`<input>\` \`<button>\`：\`inline-block\` 风格（但实际是 \`inline\` 加替换元素特殊处理）
- \`<table>\`：\`table\`
- \`<li>\`：\`list-item\`

### 经典用法

\`\`\`ts
// flex 容器（最常用）
s.display.flex                   // 子元素水平排列
  .alignItems.center             // 垂直居中
  .gap.px(12)                    // 子元素间距

// 完全隐藏元素（不占位）
s.display.none

// 去掉无意义包装层（保留子元素正常布局）
s.display.contents               // <wrapper> 消失，子元素直接成为父的子

// 触发 BFC，清除内部浮动
s.display.flowRoot               // 现代清浮动方案，替代经典 \`clearfix\` hack
\`\`\`

### \`display: none\` vs \`visibility: hidden\` vs \`opacity: 0\`

| 写法 | 占位 | 事件触发 | 屏幕阅读器 |
| --- | --- | --- | --- |
| \`display: none\` | ✗ 不占位 | ✗ 无 | ✗ 跳过 |
| \`visibility: hidden\` | ✓ 占位 | ✗ 无 | ✗ 跳过 |
| \`opacity: 0\` | ✓ 占位 | ✓ **可点击** | ✓ 读出 |`,

    syntax: [
      ['基础类型', '`block` `inline` `inlineBlock` `none` `contents`', '常用'],
      ['容器类型', '`flex` `inlineFlex` `grid` `inlineGrid` `flowRoot`', '现代布局'],
      ['list-item', '`listItem`', '生成列表标记'],
      [
        'table 家族',
        '`table` `inlineTable` `tableCell` `tableRow` `tableColumn` `tableRowGroup` ...',
        '模拟 HTML 表格行为',
      ],
      ['ruby', '`ruby`', 'CJK 注音排版（罕用）'],
      [
        '两值语法',
        "`'block flow'` `'inline flex'`",
        'CSS Display Module 3（新，外/内类型分开写，多数浏览器尚未实现）',
      ],
    ],
    initialValue: 'inline',
    inherits: false,
    browserNote:
      '基础类型 / table 家族 / flex 远古支持。`grid` Chrome 57 / Firefox 52。`contents` Chrome 65 / Firefox 37。`flowRoot` Chrome 58 / Firefox 53。两值语法 Firefox 70+ 已实现，Chrome / Safari 部分支持。',
  },

  // ════════════════════════════════════════════════════════════════════
  // position
  // ════════════════════════════════════════════════════════════════════
  position: {
    firstLine:
      '决定元素的**定位上下文** —— 影响该元素如何参与文档流，以及 `top` / `right` / `bottom` / `left` / `inset` / `z-index` 是否生效、以谁为基准。',

    keywordGroups: [
      {
        label: '5 个定位关键字',
        headers: ['关键字', '占位', '偏移属性生效', '偏移基准', '用途'],
        rows: [
          [
            '`static`',
            '✓ 占位',
            '✗ 无效',
            '—',
            '**默认值**。正常文档流，`top/left/...` 无效，`z-index` 也无效',
          ],
          [
            '`relative`',
            '✓ 占位',
            '✓',
            '**自己原位置**',
            '让自己微量偏移（视觉移动，原位置仍占）；同时可作 absolute 子元素的"定位父"',
          ],
          [
            '`absolute`',
            '✗ **脱离文档流**',
            '✓',
            '**最近的非 static 祖先**',
            '脱离文档流，绝对定位；找不到非 static 祖先则退回 `<html>`',
          ],
          ['`fixed`', '✗ 脱离文档流', '✓', '**视口** viewport', '固定在视口；滚动不动'],
          [
            '`sticky`',
            '✓ 占位',
            '✓',
            '**最近的滚动容器**',
            '阈值前同 `relative`，滚动到阈值后变 `fixed` —— 实现"粘性头部 / 侧边栏"',
          ],
        ],
      },
    ],

    details: `### 常见陷阱

- **\`absolute\` 找不到定位父** → 退回 \`<html>\` 为参照（常见 bug：写了 \`position: absolute\` 但忘了给父加 \`position: relative\`，结果元素跑到 body 左上角）
- **\`fixed\` 在祖先有 \`transform\` / \`filter\` / \`perspective\` / \`will-change: transform\` / \`contain: paint\`** 时会变成相对该祖先定位（**不再相对视口**）—— Safari 经常踩
- **\`sticky\` 在父元素有 \`overflow: hidden\`/\`auto\`/\`scroll\`** 时**不会粘** —— 父创建了新的滚动上下文，sticky 找不到可粘的祖先
- **\`sticky\` 必须配合至少一个阈值**：\`s.position.sticky\` + \`s.top(0)\` 才生效
- **z-index 仅对非 static 元素生效**：\`position: static\` 写 \`z-index\` 是无效的
- **flex / grid item 上的 \`absolute\`**：让该 item 脱离布局流，不再参与对齐

### 经典布局示例

\`\`\`ts
// 居中遮罩
s.position.fixed
s.inset(0)             // 4 边都贴视口 = 全屏
s.display.flex
s.alignItems.center
s.justifyContent.center

// 粘性头部
s.position.sticky
s.top(0)
s.zIndex(10)

// 绝对定位徽标
s.position.absolute
s.top.px(-8)
s.right.px(-8)
\`\`\``,

    syntax: [
      [
        '5 个定位关键字',
        '`static` ｜ `relative` ｜ `absolute` ｜ `fixed` ｜ `sticky`',
        '只接受关键字',
      ],
    ],
    initialValue: 'static',
    inherits: false,
    browserNote: '远古基础属性。`sticky` 较晚：Chrome 56 / Firefox 32 / Safari 13。',
  },

  // ════════════════════════════════════════════════════════════════════
  // visibility
  // ════════════════════════════════════════════════════════════════════
  visibility: {
    firstLine:
      '控制元素是否**可见**（但仍占空间，与 `display: none` 不同）。还可用于表格行 / 列的隐藏。',

    keywordGroups: [
      {
        label: '3 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`visible`', '**默认值**。可见'],
          [
            '`hidden`',
            '隐藏但**仍占位**（与 `display: none` 区别！）；不触发鼠标事件；屏幕阅读器跳过；transition 可生效',
          ],
          [
            '`collapse`',
            '仅对 `<table>` 行 / 列 / 行组生效：隐藏整行 / 列且**让其他单元格占用其空间**（不像 `hidden` 那样留空）；在非表格元素上等同 `hidden`',
          ],
        ],
      },
    ],

    details: `### \`visibility: hidden\` vs \`display: none\`

| 行为 | \`visibility: hidden\` | \`display: none\` |
| --- | --- | --- |
| 是否占位 | ✓ 占位 | ✗ 不占位 |
| 是否触发事件 | ✗ 不触发 | ✗ 不触发 |
| transition 可用 | ✓（visibility 可过渡） | ✗（display 不能动画） |
| 子元素 \`visibility: visible\` 能覆盖 | ✓ 可见 | ✗ 不可恢复 |

\`\`\`ts
// 占位但不可见（保留布局空间）
s.visibility.hidden

// 切换显隐时保持动画（visibility 是可 transition 的）
s.transition('opacity 0.3s, visibility 0.3s')
  .visibility.hidden.opacity(0)
\`\`\``,

    syntax: [['可见性关键字', '`visible` ｜ `hidden` ｜ `collapse`', '只接受关键字']],
    initialValue: 'visible',
    inherits: true,
    browserNote: '所有浏览器远古支持。',
  },

  // ════════════════════════════════════════════════════════════════════
  // overflow
  // ════════════════════════════════════════════════════════════════════
  overflow: {
    firstLine:
      '控制元素**内容溢出容器时**的处理方式（裁剪 / 滚动 / 显示）。可作 X 和 Y 两轴的简写。',

    keywordGroups: [
      {
        label: '5 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`visible`', '**默认值**。溢出内容可见（超出容器边界），不裁剪'],
          ['`hidden`', '**裁剪**溢出，**不显示滚动条**；用户无法手动滚动，但 JS `scrollTo` 仍可'],
          ['`scroll`', '**强制**显示滚动条（即使没溢出也占滚动条空间）'],
          ['`auto`', '内容**溢出时**才显示滚动条（最常用）'],
          [
            '`clip`',
            '同 `hidden` 但**禁止程序滚动**（更严格）；不创建滚动容器（不会成为 `sticky` 的祖先滚动容器）',
          ],
        ],
      },
    ],

    details: `### 两值简写

\`overflow\` 可写 1 或 2 个值：第一个是 X，第二个是 Y。1 值时两轴相同。

\`\`\`ts
s.overflow.hidden                   // 两轴都裁剪
s.overflow('auto hidden')           // X 滚动条按需，Y 裁剪
s.overflow.auto                     // 内容溢出时出滚动条
\`\`\`

### 创建 BFC 的副作用

任何非 \`visible\` 的 \`overflow\` 值都会**触发 BFC**（块格式化上下文），可用于：
- 包含浮动子元素（清浮动）
- 防止外边距合并

### 常见陷阱

- \`overflow: hidden\` 在父级会**让 \`position: sticky\` 失效** —— sticky 找不到可粘的滚动祖先
- 父级 \`overflow: hidden\` **不会**裁剪 \`position: absolute\` 子元素，除非父级也 \`position: relative\`
- \`overflow: scroll\` 在 macOS 默认配置下滚动条不可见（hover 才出），但仍预留空间
- \`overflow: clip\` 不创建滚动容器 —— 适合纯视觉裁剪而不想破坏 sticky`,

    syntax: [
      ['1 个 keyword', '`visible` ｜ `hidden` ｜ `scroll` ｜ `auto` ｜ `clip`', '两轴相同'],
      ['2 个 keyword', "`'auto hidden'`", '第 1 个 X，第 2 个 Y'],
    ],
    initialValue: 'visible',
    inherits: false,
    browserNote: '`clip` 较晚：Chrome 90 / Firefox 81 / Safari 16。其他远古支持。',
  },

  // ════════════════════════════════════════════════════════════════════
  // overflowX / overflowY
  // ════════════════════════════════════════════════════════════════════
  overflowX: {
    extends: 'overflow',
    firstLine: '控制元素**水平方向**内容溢出的处理。其他规则同 [`overflow`]，但只接受单值。',
    syntax: [
      [
        '5 个 keyword',
        '`visible` ｜ `hidden` ｜ `scroll` ｜ `auto` ｜ `clip`',
        '单轴只接受 1 个值',
      ],
    ],
  },
  overflowY: {
    extends: 'overflow',
    firstLine: '控制元素**垂直方向**内容溢出的处理。其他规则同 [`overflow`]，但只接受单值。',
    syntax: [
      [
        '5 个 keyword',
        '`visible` ｜ `hidden` ｜ `scroll` ｜ `auto` ｜ `clip`',
        '单轴只接受 1 个值',
      ],
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // boxSizing
  // ════════════════════════════════════════════════════════════════════
  boxSizing: {
    firstLine:
      '决定元素的 `width` / `height` **是否包含** `padding` 和 `border`。CSS 历史上最经典的"踩坑点"。',

    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          [
            '`contentBox`',
            '**默认值**。`width`/`height` 仅指**内容区**；最终总宽 = `width` + `padding-left` + `padding-right` + `border-left` + `border-right`（容易算错）',
          ],
          [
            '`borderBox`',
            '`width`/`height` 包含 `padding` 和 `border`（直观），内容区会自动收缩。**现代项目通常 reset 为此值**',
          ],
        ],
      },
    ],

    details: `### 经典 reset

绝大多数现代项目会全局设：

\`\`\`css
*, *::before, *::after { box-sizing: border-box; }
\`\`\`

这样所有元素的尺寸计算更符合直觉：写 \`width: 100px\` 就是真的 100px 宽（含 padding+border）。

### contentBox vs borderBox

\`\`\`
contentBox（默认，反直觉）：
┌──────────────────────────────────────┐
│ margin                               │
│  ┌────────────────────────────────┐  │
│  │ border                         │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │ padding                  │  │  │
│  │  │  ┌────────────────────┐  │  │  │
│  │  │  │ content (width)    │  │  │  │  ← width 只算这里
│  │  │  └────────────────────┘  │  │  │
│  │  └──────────────────────────┘  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘

borderBox（直观）：
┌──────────────────────────────────────┐
│ margin                               │
│  ┌─[ width ─────────────────────]─┐  │
│  │ border                         │  │
│  │  padding                       │  │
│  │   content                      │  │  ← width 算到 border 外侧
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
\`\`\``,

    syntax: [['2 个 keyword', '`contentBox` ｜ `borderBox`', '只接受关键字']],
    initialValue: 'contentBox',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // float
  // ════════════════════════════════════════════════════════════════════
  float: {
    firstLine:
      '让元素**浮动**到容器一侧，**脱离正常文档流**，文字 / 行内元素会环绕它。现代布局已被 flex / grid 取代，但 `<img>` 文字环绕仍是经典场景。',

    keywordGroups: [
      {
        label: '5 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`none`', '**默认值**。不浮动'],
          ['`left`', '浮动到容器**左侧**，文字从右侧环绕'],
          ['`right`', '浮动到容器**右侧**，文字从左侧环绕'],
          ['`inlineStart`', '逻辑属性：阅读方向起始侧（LTR 文档 = `left`，RTL 文档 = `right`）'],
          ['`inlineEnd`', '逻辑属性：阅读方向结束侧（LTR = `right`，RTL = `left`）'],
        ],
      },
    ],

    details: `### 经典用法

文字环绕图片：

\`\`\`ts
// 给 <img>
s.float.left
s.marginRight.px(16)
s.marginBottom.px(8)
// 旁边的文字会自动环绕
\`\`\`

### 浮动后的副作用

- 浮动元素**脱离文档流**：父容器高度不再包含浮动子元素 → 需要清除浮动（\`clear\` 或父级 \`overflow: hidden\` / \`display: flow-root\`）
- 浮动元素自动变成块级（\`display: block\`），可设宽高
- 现代项目多用 flex/grid 替代`,

    syntax: [
      ['浮动方向', '`none` ｜ `left` ｜ `right` ｜ `inlineStart` ｜ `inlineEnd`', '物理/逻辑方向'],
    ],
    initialValue: 'none',
    inherits: false,
    browserNote: '`inlineStart` / `inlineEnd` Chrome 118 / Firefox 119 / Safari 17.4+。',
  },

  // ════════════════════════════════════════════════════════════════════
  // clear
  // ════════════════════════════════════════════════════════════════════
  clear: {
    firstLine:
      '让元素**不与浮动元素并排** —— 在它之前的浮动元素结束之后才开始布局。配合 `float` 使用。',

    keywordGroups: [
      {
        label: '6 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`none`', '**默认值**。不避开浮动'],
          ['`left`', '不与左浮动元素并排（让自己下移到左浮动元素下方）'],
          ['`right`', '不与右浮动元素并排'],
          ['`both`', '**最常用**：不与任何方向浮动元素并排（彻底清除浮动）'],
          ['`inlineStart`', '逻辑属性：避开阅读方向起始侧的浮动'],
          ['`inlineEnd`', '逻辑属性：避开阅读方向结束侧的浮动'],
        ],
      },
    ],

    details: `### 经典清浮动（旧）

\`\`\`css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
\`\`\`

### 现代替代

直接给父容器加 \`display: flow-root\` 即可触发 BFC 包含浮动子元素，无需 clear。`,

    syntax: [
      [
        '清除方向',
        '`none` ｜ `left` ｜ `right` ｜ `both` ｜ `inlineStart` ｜ `inlineEnd`',
        '物理/逻辑方向',
      ],
    ],
    initialValue: 'none',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // isolation
  // ════════════════════════════════════════════════════════════════════
  isolation: {
    firstLine:
      '控制元素是否创建**新的层叠上下文**（stacking context）。常用于让 `mix-blend-mode` 局部生效，不影响外部。',

    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          [
            '`auto`',
            '**默认值**。不强制创建层叠上下文（但其他属性如 `opacity < 1` / `transform` 仍可能创建）',
          ],
          [
            '`isolate`',
            '**强制创建**新的层叠上下文 —— 内部的 `mix-blend-mode` 只与本上下文内的元素混合，不影响外部',
          ],
        ],
      },
    ],

    details: `### 用例

让 \`mix-blend-mode\` 局部生效：

\`\`\`ts
// 父容器
s.isolation.isolate                  // 创建层叠上下文

// 子元素
s.mixBlendMode.multiply              // 只与本上下文内的兄弟混合，不影响整页
\`\`\`

### 不引入额外副作用

相比其他"触发层叠上下文"的属性（\`opacity\` / \`transform\` / \`will-change\`），\`isolation: isolate\` 不带任何视觉副作用，是**最干净**的层叠上下文触发器。`,

    syntax: [['2 个 keyword', '`auto` ｜ `isolate`', '只接受关键字']],
    initialValue: 'auto',
    inherits: false,
    browserNote: 'Chrome 41 / Firefox 36 / Safari 8。',
  },
}

export default layout
