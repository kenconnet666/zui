/**
 * Grid 布局相关属性中文文档（grid 分组）。
 * 覆盖：gridAutoFlow / gridColumn / gridRow / gridArea
 */

import type { DocsGroup } from './_common'

const grid: DocsGroup = {
  gridAutoFlow: {
    firstLine:
      'grid 中**未显式定位的子元素**如何自动填入网格 —— 沿行还是沿列、是否填补空隙。',
    keywordGroups: [
      {
        label: '5 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`row`', '**默认值**。子元素**逐行**填入（先填满一行再换下一行）'],
          ['`column`', '子元素**逐列**填入（先填满一列再换下一列）'],
          ['`dense`', '允许**回填**空隙：后面的小子元素可填入前面留下的空隙；但可能打乱 DOM 顺序'],
          ['`rowDense`', '组合：逐行 + 回填空隙'],
          ['`columnDense`', '组合：逐列 + 回填空隙'],
        ],
      },
    ],
    details: `### dense 用例

masonry 风格瀑布流：

\`\`\`ts
s.display.grid
  .gridTemplateColumns('repeat(auto-fill, 200px)')
  .gridAutoFlow.dense              // 后面的小图填入前面大图留下的空隙
\`\`\`

⚠️ \`dense\` 会让视觉顺序与 DOM 顺序不一致，**影响屏幕阅读器**。`,
    syntax: [
      ['5 个 keyword', '`row` ｜ `column` ｜ `dense` ｜ `rowDense` ｜ `columnDense`', '只接受关键字'],
    ],
    initialValue: 'row',
    inherits: false,
  },

  gridColumn: {
    firstLine:
      'grid **子元素**占据的**列范围**（简写：`grid-column-start / grid-column-end`）。可用线编号 / 命名线 / span 跨度。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`auto`', '**默认值**。自动分配（按 grid-auto-flow 顺序填入）']],
      },
    ],
    details: `### 函数态语法

\`\`\`ts
s.gridColumn('1 / 3')              // 第 1 到 3 条线（跨 2 格）
s.gridColumn('span 2')             // 从当前位置起跨 2 格
s.gridColumn('2 / span 3')         // 从第 2 条线开始，跨 3 格
s.gridColumn('1 / -1')             // 撑满整行（-1 = 最后一条线）
s.gridColumn('main-start / main-end')  // 命名线
\`\`\`

### 线编号规则

grid 列线从 **1** 开始（不是 0），最后一条线可用 \`-1\` 表示。`,
    syntax: [
      ['`auto`', '—', '默认；自动分配'],
      ['单值（终点用 auto）', "`'2'`", '从第 2 条线开始'],
      ['start / end', "`'1 / 3'`", '起始线 / 结束线'],
      ['span 跨度', "`'span 2'` `'2 / span 3'`", '跨 N 格'],
      ['撑满整行', "`'1 / -1'`", '从第 1 条线到最后一条'],
      ['命名线', "`'main-start / main-end'`", '使用 gridTemplate 中命名的线'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  gridRow: {
    extends: 'gridColumn',
    firstLine:
      'grid **子元素**占据的**行范围**（简写）。规则同 `gridColumn`，方向变为垂直。',
    syntax: [
      ['`auto`', '—', '默认；自动分配'],
      ['单值', "`'2'`", '从第 2 条行线开始'],
      ['start / end', "`'1 / 3'`", '起始行线 / 结束行线'],
      ['span 跨度', "`'span 2'`", '跨 N 行'],
      ['撑满整列', "`'1 / -1'`", '从第 1 条到最后一条行线'],
      ['命名线', "`'header-start / footer-end'`", '使用 gridTemplate 中命名的线'],
    ],
  },

  gridArea: {
    firstLine:
      'grid 子元素的**完整位置简写**（4 个值：row-start / column-start / row-end / column-end），或引用 `gridTemplateAreas` 中命名的区域。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`auto`', '**默认值**。自动分配']],
      },
    ],
    details: `### 两种用法

**1. 引用命名区域**（最常用）：

\`\`\`ts
// 父容器
s.display.grid
  .gridTemplateAreas(\`
    "header header"
    "sidebar main"
    "footer footer"
  \`)

// 子元素引用区域名
s.gridArea('header')
s.gridArea('main')
\`\`\`

**2. 4 值定位**（rowStart / colStart / rowEnd / colEnd）：

\`\`\`ts
s.gridArea('1 / 1 / 3 / 3')             // 占据 (1,1) 到 (3,3)
s.gridArea('1 / 1 / span 2 / span 2')   // 同上，用 span 表达
\`\`\``,
    syntax: [
      ['`auto`', '—', '默认；自动分配'],
      ['命名区域', "`'header'`", '引用 gridTemplateAreas 中的区域名'],
      ['4 个值', "`'1 / 1 / 3 / 3'`", 'rowStart / colStart / rowEnd / colEnd'],
      ['span 跨度', "`'1 / 1 / span 2 / span 2'`", '从 (1,1) 起跨 2×2'],
    ],
    initialValue: 'auto',
    inherits: false,
  },
}

export default grid
