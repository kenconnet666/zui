/**
 * Flex 布局相关属性中文文档（flex 分组）。
 *
 * 覆盖：flexDirection / flexWrap / justifyContent / justifyItems / justifySelf /
 *   alignItems / alignContent / alignSelf / flexGrow / flexShrink / flexBasis / order /
 *   gap / rowGap / columnGap
 */

import { lengthUnitsSnippet, type DocsGroup } from './_common'

const flex: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // flexDirection
  // ════════════════════════════════════════════════════════════════════
  flexDirection: {
    firstLine:
      '决定 flex 容器的**主轴方向** —— 子元素是横向排列还是纵向排列、是否反向。仅对 `display: flex/inlineFlex` 容器生效。',
    keywordGroups: [
      {
        label: '4 个方向关键字',
        headers: ['关键字', '主轴方向'],
        rows: [
          ['`row`', '**默认值**。主轴 = 从**左到右**（LTR）/ 从右到左（RTL）'],
          ['`rowReverse`', '主轴 = 从**右到左**（LTR）/ 从左到右（RTL）'],
          ['`column`', '主轴 = 从**上到下**（垂直排列）'],
          ['`columnReverse`', '主轴 = 从**下到上**（垂直反向）'],
        ],
      },
    ],
    details: `### 主轴 vs 交叉轴

- **主轴**：\`flexDirection\` 决定的方向，子元素沿此方向排列
- **交叉轴**：与主轴垂直的方向

| flexDirection | 主轴 | 交叉轴 | \`justifyContent\` 控制 | \`alignItems\` 控制 |
| --- | --- | --- | --- | --- |
| \`row\` | 横向 | 纵向 | 水平对齐 | 垂直对齐 |
| \`column\` | 纵向 | 横向 | 垂直对齐 | 水平对齐 |

### 经典用法

\`\`\`ts
s.display.flex
s.flexDirection.column
s.gap.px(12)
// 垂直堆叠子元素，间距 12px
\`\`\``,
    syntax: [
      ['4 个方向 keyword', '`row` ｜ `rowReverse` ｜ `column` ｜ `columnReverse`', '只接受关键字'],
    ],
    initialValue: 'row',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // flexWrap
  // ════════════════════════════════════════════════════════════════════
  flexWrap: {
    firstLine:
      '决定 flex 子元素**是否换行**。默认所有子元素挤在一行（必要时压缩尺寸），开启换行后超出宽度的会换行排列。',
    keywordGroups: [
      {
        label: '3 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`nowrap`', '**默认值**。所有子元素挤在一行（一列），不换行（必要时收缩子元素尺寸）'],
          ['`wrap`', '允许换行，从**上到下**新行（主轴 row 时）'],
          ['`wrapReverse`', '允许换行，从**下到上**新行（顺序反向）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
s.display.flex
s.flexWrap.wrap
s.gap.px(8)
// 子元素挤不下时换行，每行间隔 8px
\`\`\`

### nowrap 的坑

\`nowrap\` 默认 + 子元素总宽度超过容器时：
- 子元素会被**强制压缩**（按 \`flex-shrink: 1\`）
- 想"不压缩"用 \`flex-shrink: 0\`
- 想"溢出滚动"配合 \`overflow.auto\``,
    syntax: [['3 个 keyword', '`nowrap` ｜ `wrap` ｜ `wrapReverse`', '只接受关键字']],
    initialValue: 'nowrap',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // justifyContent
  // ════════════════════════════════════════════════════════════════════
  justifyContent: {
    firstLine:
      'flex / grid 容器**主轴方向**上的对齐方式。控制子元素如何分配剩余空间（左对齐 / 居中 / 两端 / 等距等）。',
    keywordGroups: [
      {
        label: '基础对齐（沿主轴起点 / 终点 / 中点）',
        headers: ['关键字', '行为'],
        rows: [
          ['`flexStart`', '**默认值**（flex 容器）。子元素挤到主轴**起点**'],
          ['`flexEnd`', '挤到主轴**终点**'],
          ['`center`', '主轴**居中**'],
          ['`start`', '挤到容器**逻辑起点**（取代 flex-start，对 flex/grid 通用）'],
          ['`end`', '挤到容器**逻辑终点**'],
          ['`left`', '挤到容器**左侧**（不依赖书写方向）'],
          ['`right`', '挤到容器**右侧**'],
        ],
      },
      {
        label: '分布对齐（分配剩余空间）',
        headers: ['关键字', '行为'],
        rows: [
          [
            '`spaceBetween`',
            '两端贴边，**其余空间均分到子元素之间**（第一个贴起点，最后一个贴终点）',
          ],
          ['`spaceAround`', '每个子元素两侧距离相等（**端点间距 = 中间间距的一半**）'],
          ['`spaceEvenly`', '所有间距都相等（**端点间距 = 中间间距**）'],
        ],
      },
      {
        label: '其他',
        headers: ['关键字', '行为'],
        rows: [
          ['`normal`', '行为同 `start`（grid 容器中触发新规范）'],
          ['`stretch`', 'flex 中无效；grid 中让子元素撑满轨道'],
        ],
      },
    ],
    details: `### 三种 space-* 视觉对比

容器宽 600px，3 个子元素各 80px，剩余 360px 空间分配方式：

\`\`\`
spaceBetween:   [A]          [B]          [C]      间距 180 / 180，两端 0
spaceAround:      [A]       [B]       [C]          端点 60，中间 120
spaceEvenly:        [A]    [B]    [C]              所有间距 90
\`\`\`

### 经典用法

\`\`\`ts
// 完美居中
s.display.flex
s.justifyContent.center
s.alignItems.center

// 两端对齐导航
s.display.flex
s.justifyContent.spaceBetween         // [logo] ............. [user]

// 工具栏
s.display.flex
s.justifyContent.flexEnd
s.gap.px(8)    // 按钮组右对齐
\`\`\``,
    syntax: [
      [
        '基础对齐',
        '`flexStart` ｜ `flexEnd` ｜ `center` ｜ `start` ｜ `end` ｜ `left` ｜ `right`',
        '子元素挤到某一端 / 居中',
      ],
      ['分布对齐', '`spaceBetween` ｜ `spaceAround` ｜ `spaceEvenly`', '剩余空间分配规则'],
      ['其他', '`normal` ｜ `stretch`', 'grid 容器中常用'],
    ],
    initialValue: 'normal',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // justifyItems / justifySelf
  // ════════════════════════════════════════════════════════════════════
  justifyItems: {
    extends: 'justifyContent',
    firstLine:
      '**grid** 容器中：所有子元素在**主轴方向**（行内方向）上的默认对齐方式。在 flex 容器中无效（用 `justifyContent`）。',
  },
  justifySelf: {
    extends: 'justifyContent',
    firstLine:
      '**grid 子元素**在**主轴方向**（行内方向）上的对齐方式（覆盖父的 `justifyItems`）。在 flex 子元素中无效。',
    syntax: [
      [
        '基础对齐',
        '`flexStart` ｜ `flexEnd` ｜ `center` ｜ `start` ｜ `end` ｜ `left` ｜ `right` ｜ `auto`',
        '`auto` 表示继承父的 justifyItems',
      ],
      ['分布对齐', '`spaceBetween` ｜ `spaceAround` ｜ `spaceEvenly`', ''],
      ['其他', '`normal` ｜ `stretch`', ''],
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // alignItems
  // ════════════════════════════════════════════════════════════════════
  alignItems: {
    firstLine:
      'flex / grid 容器**交叉轴方向**上**所有子元素**的对齐方式（flex row 时控制垂直对齐）。',
    keywordGroups: [
      {
        label: '8 个对齐 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`stretch`', '**默认值**。子元素在交叉轴方向**撑满容器**（前提：未设交叉轴尺寸）'],
          ['`flexStart`', '子元素挤到交叉轴**起点**'],
          ['`flexEnd`', '挤到交叉轴**终点**'],
          ['`center`', '交叉轴**居中**（垂直居中神器）'],
          [
            '`baseline`',
            '子元素沿**文字基线**对齐 —— 不同字号子元素也能整齐排列（不同字体 line-height 不同时尤其有用）',
          ],
          ['`start`', '逻辑起点（对 flex/grid 通用）'],
          ['`end`', '逻辑终点'],
          ['`normal`', '行为同 `stretch`'],
        ],
      },
    ],
    details: `### 经典：完美居中

\`\`\`ts
s.display.flex
  .justifyContent.center
  .alignItems.center
// 横纵都居中
\`\`\`

### baseline 神器

不同字号 / 字体的子元素，用 \`baseline\` 比 \`center\` 更整齐：

\`\`\`ts
s.display.flex
s.alignItems.baseline
// <span>大</span> <small>小</small>
// 大字和小字按 baseline 对齐，视觉更稳
\`\`\``,
    syntax: [
      [
        '8 个对齐 keyword',
        '`stretch` ｜ `flexStart` ｜ `flexEnd` ｜ `center` ｜ `baseline` ｜ `start` ｜ `end` ｜ `normal`',
        '只接受关键字',
      ],
    ],
    initialValue: 'normal',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // alignContent
  // ════════════════════════════════════════════════════════════════════
  alignContent: {
    firstLine:
      'flex / grid 容器**交叉轴方向**上**多行内容**之间的对齐方式。**仅在 `flexWrap: wrap/wrapReverse`（多行）或 grid 多行时生效**。',
    keywordGroups: [
      {
        label: '11 个对齐 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`normal`', '**默认值**。等同 `stretch` 在 flex 容器中'],
          ['`stretch`', '多行**撑满**交叉轴方向（每行平分剩余空间）'],
          ['`flexStart`', '多行挤到交叉轴**起点**'],
          ['`flexEnd`', '挤到交叉轴**终点**'],
          ['`center`', '多行整体**居中**'],
          ['`baseline`', '按基线对齐（罕用）'],
          ['`start`', '逻辑起点'],
          ['`end`', '逻辑终点'],
          ['`spaceBetween`', '首尾贴边，其余间距均分'],
          ['`spaceAround`', '每行两侧距离相等'],
          ['`spaceEvenly`', '所有间距相等'],
        ],
      },
    ],
    details: `### alignItems vs alignContent 区别

| 属性 | 控制对象 | 生效条件 |
| --- | --- | --- |
| \`alignItems\` | **单行内**子元素的对齐 | 任何 flex/grid |
| \`alignContent\` | **多行**之间的对齐 | 必须多行（flex 需 wrap 或 grid 多行） |

### 用例

\`\`\`ts
// 多行 grid 整体居中
s.display.grid
s.gridTemplateColumns('repeat(3, 1fr)')
s.alignContent.center

// flex 多行内容均匀分布
s.display.flex
s.flexWrap.wrap
s.alignContent.spaceBetween
\`\`\``,
    syntax: [
      [
        '基础对齐',
        '`stretch` ｜ `flexStart` ｜ `flexEnd` ｜ `center` ｜ `start` ｜ `end` ｜ `baseline` ｜ `normal`',
        '只接受关键字',
      ],
      ['分布对齐', '`spaceBetween` ｜ `spaceAround` ｜ `spaceEvenly`', '间距分配'],
    ],
    initialValue: 'normal',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // alignSelf
  // ════════════════════════════════════════════════════════════════════
  alignSelf: {
    extends: 'alignItems',
    firstLine:
      'flex / grid **子元素**在交叉轴方向上的对齐方式（覆盖父的 `alignItems`）。可让单个子元素与其他兄弟对齐方式不同。',
    syntax: [
      [
        '9 个对齐 keyword',
        '`auto` ｜ `stretch` ｜ `flexStart` ｜ `flexEnd` ｜ `center` ｜ `baseline` ｜ `start` ｜ `end` ｜ `normal`',
        '`auto` = 继承父的 alignItems',
      ],
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // flexGrow / flexShrink
  // ════════════════════════════════════════════════════════════════════
  flexGrow: {
    firstLine:
      'flex 子元素的**放大比例** —— 容器有剩余空间时，按此比例分配给各子元素。**默认 0**（不放大）。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [
          ['接受非负数字（含 0）。无关键字（除全局关键字）'],
          ['多个子元素的 flexGrow 比例决定剩余空间分配'],
        ],
      },
    ],
    details: `### 算法

容器剩余空间 = 容器总宽 − 所有子元素 \`flex-basis\` 之和

每个子元素分到 = 剩余空间 × (自己的 flexGrow / 所有子元素 flexGrow 之和)

### 经典用法

\`\`\`ts
// 子元素 A:1, B:2, C:1 → A 和 C 各占剩余 25%，B 占 50%
s.display.flex
// childA: flexGrow(1)
// childB: flexGrow(2)
// childC: flexGrow(1)

// "填充剩余空间"模式（导航、侧栏）
s.flexGrow(1)        // 此子元素占满剩余空间，其他兄弟保持原大小
\`\`\``,
    syntax: [['`<number>`', '`0` `1` `2.5`', '非负数字（不带单位）']],
    initialValue: '0',
    inherits: false,
  },

  flexShrink: {
    firstLine:
      'flex 子元素的**收缩比例** —— 容器空间不足时，按此比例缩小各子元素。**默认 1**（允许收缩）。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [
          ['接受非负数字（含 0）。无关键字（除全局关键字）'],
          ['设为 `0` = 该子元素**不收缩**（即使溢出也保持原尺寸）'],
        ],
      },
    ],
    details: `### 常见用法

\`\`\`ts
// 防止图标 / 按钮被压缩
s.flexShrink(0)
s.width.px(40)

// 让长文本可压缩
s.flexShrink(1)
s.minWidth(0)
// minWidth(0) 是关键 —— flex 子元素默认 min-width: auto 会阻止收缩到内容以下
\`\`\``,
    syntax: [['`<number>`', '`0` `1` `2`', '非负数字']],
    initialValue: '1',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // flexBasis
  // ════════════════════════════════════════════════════════════════════
  flexBasis: {
    firstLine:
      'flex 子元素的**初始尺寸** —— 在剩余空间分配（flexGrow/flexShrink）之前的"起步大小"。',
    keywordGroups: [
      {
        label: '6 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。等于元素自身 `width` / `height`（视 flex 方向）'],
          ['`fill`', '撑满可用空间（实验性，未标准化）'],
          ['`maxContent`', '理想内容尺寸（不换行的宽度）'],
          ['`minContent`', '最小内容尺寸（最长不可断处）'],
          ['`fitContent`', '内容驱动但不超容器'],
          ['`content`', '基于内容自动算（**忽略** width 设置）'],
        ],
      },
    ],
    details: `### flexBasis vs width

flex 子元素上同时设 \`width\` 和 \`flexBasis\` 时：
- \`flexBasis: auto\` → 用 \`width\` 的值
- \`flexBasis: <length>\` → **覆盖** width

推荐做法：直接用 \`width\` 即可，无需写 \`flexBasis\` 除非要特殊行为。

### flex 简写

\`\`\`ts
s.flex(1)                       // flex: 1 1 0 → grow:1 shrink:1 basis:0
s.flex('0 0 200px')             // 不增不缩，固定 200px
s.flex('1 1 auto')              // 经典：可增可缩，起步 = 内容尺寸
\`\`\`

${lengthUnitsSnippet('flexBasis')}`,
    syntax: [
      ['`<length>`', "`'200px'` `'12rem'`", '具体长度起步'],
      ['`<percentage>`', "`'50%'`", '相对容器主轴尺寸'],
      [
        '6 个 keyword',
        '`auto` ｜ `fill` ｜ `maxContent` ｜ `minContent` ｜ `fitContent` ｜ `content`',
        '内容驱动 / 自适应',
      ],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // order
  // ════════════════════════════════════════════════════════════════════
  order: {
    firstLine: 'flex / grid 子元素的**显示顺序** —— 不改变 DOM 顺序但改变视觉顺序。可为**负数**。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [
          ['接受整数（可负，**默认 0**）。无关键字（除全局关键字）'],
          ['数字越小越靠前；相同 order 按 DOM 顺序'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// DOM 顺序：[A] [B] [C]
// 改成视觉顺序：[B] [A] [C]
// 给 B 设 order(-1)
s.order(-1)

// 给 C 设 order(99) 排到最后
s.order(99)
\`\`\`

### a11y 注意

\`order\` 不改变屏幕阅读器和键盘 Tab 顺序（仍按 DOM 顺序），可能造成视觉与朗读顺序不一致 —— **影响视觉顺序请改 DOM**，order 仅用于响应式微调。`,
    syntax: [['`<integer>`', '`0` `1` `-1` `99`', '可正可负的整数']],
    initialValue: '0',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // gap / rowGap / columnGap
  // ════════════════════════════════════════════════════════════════════
  gap: {
    firstLine:
      'flex / grid / 多栏布局中**子元素之间的间距**（同时设行/列间距的简写）。比传统 `margin` 方案更优 —— 不会在边缘产生多余间距。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`normal`', '**默认值**。flex/grid 中等于 `0`；多栏布局中浏览器默认值']],
      },
    ],
    details: `### 简写：1 或 2 个值

\`\`\`ts
s.gap.px(12)                  // 行列都 12px
s.gap('12px 24px')            // 行间距 12px，列间距 24px
\`\`\`

等价于：

\`\`\`ts
s.rowGap.px(12)
s.columnGap.px(24)
\`\`\`

### gap vs margin

| 方案 | 边缘多余间距 | 适应换行 |
| --- | --- | --- |
| \`gap\` | ✗ 无 | ✓ 自动 |
| \`margin\` | ✓ 有（需配合 \`:first-child\` 等） | ✗ 需手动处理 |

\`gap\` 是现代 CSS 推荐方案。

${lengthUnitsSnippet('gap')}`,
    syntax: [
      ['1 个 `<length>`', "`'12px'` `'1rem'`", '行列相同'],
      ['2 个 `<length>`', "`'12px 24px'`", '行间距 / 列间距'],
      ['`<percentage>`', "`'5%'`", '相对容器尺寸'],
      ['`normal`', '—', '默认；flex/grid 中等于 0'],
    ],
    initialValue: 'normal',
    inherits: false,
    browserNote:
      'flex `gap` 较晚普及：Chrome 84 / Firefox 63 / Safari 14.1。早期可用 margin + 负 margin 兼容方案。',
  },

  rowGap: {
    extends: 'gap',
    firstLine: '仅设置**行间距**（垂直方向）。可单独覆盖 `gap` 简写的行间距值。',
  },

  columnGap: {
    extends: 'gap',
    firstLine: '仅设置**列间距**（水平方向）。可单独覆盖 `gap` 简写的列间距值。',
  },
}

export default flex
