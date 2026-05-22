/**
 * SVG 专属属性中文文档（svg 分组）。
 *
 * 覆盖：strokeWidth / strokeLinecap / strokeLinejoin / strokeDasharray / strokeDashoffset
 * （fill / stroke 颜色在 colors 分组）
 */

import { lengthUnitsSnippet, type DocsGroup } from './_common'

const svg: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // strokeWidth
  // ════════════════════════════════════════════════════════════════════
  strokeWidth: {
    firstLine:
      'SVG 专属：设置图形**描边的粗细**。仅在 SVG 元素（`<path>` / `<circle>` 等）上生效。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [
          ['只接受 `<length>` / `<percentage>` / 数字，**无关键字**（除全局关键字）'],
          ['SVG 中 `stroke-width: 1` 不带单位即可（=1 用户坐标单位）'],
          ['默认值 = `1`（SVG 默认）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
s.stroke._primary
s.strokeWidth.px(2)            // 2px 描边
s.strokeWidth(0.5)                             // 0.5 用户坐标单位
\`\`\`

### 描边四件套

完整描边样式：

\`\`\`ts
s.stroke._primary
  .strokeWidth.px(2)
  .strokeLinecap.round        // 端点圆角
  .strokeLinejoin.round       // 拐角圆角
\`\`\`

${lengthUnitsSnippet('strokeWidth')}`,
    syntax: [
      ['`<length>`', "`'2px'` `'0.5em'`", '具体长度'],
      ['`<number>`', '`1` `0.5` `2`', '数字（用户坐标单位）'],
      ['`<percentage>`', "`'50%'`", '相对 viewBox 对角线'],
    ],
    initialValue: '1',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // strokeLinecap
  // ════════════════════════════════════════════════════════════════════
  strokeLinecap: {
    firstLine:
      'SVG 专属：决定**描边线段端点**的形状（直角 / 圆角 / 方块延伸）。',
    keywordGroups: [
      {
        label: '3 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`butt`', '**默认值**。**直角**端点（线段在端点处直接截断）'],
          [
            '`round`',
            '**圆角**端点（端点处加一个半圆，半径 = strokeWidth/2）—— 让线条看起来更柔和',
          ],
          [
            '`square`',
            '**方角**端点（端点处加一个矩形延伸出去，长度 = strokeWidth/2）',
          ],
        ],
      },
    ],
    details: `### 视觉对比

\`\`\`
butt（默认）:   ━━━━━━━━━━━     端点齐刷刷截断
round:          ●━━━━━━━━━━●   端点圆滑
square:         ┃━━━━━━━━━━┃   端点方块延伸（实际线条略长 strokeWidth）
\`\`\`

### 用例

\`\`\`ts
// 现代图标库标配（柔和外观）
s.strokeLinecap.round
\`\`\``,
    syntax: [['3 个 keyword', '`butt` ｜ `round` ｜ `square`', '只接受关键字']],
    initialValue: 'butt',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // strokeLinejoin
  // ════════════════════════════════════════════════════════════════════
  strokeLinejoin: {
    firstLine:
      'SVG 专属：决定**描边拐角**的形状（尖角 / 圆角 / 斜切 / 弧形）。',
    keywordGroups: [
      {
        label: '5 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`miter`', '**默认值**。**尖角**（两边延伸出尖角）'],
          ['`round`', '**圆角**拐角（用圆弧平滑过渡）—— 现代图标库标配'],
          ['`bevel`', '**斜切**拐角（两边相交处用直线连接，砍掉尖角）'],
          ['`arcs`', '**弧形**拐角（CSS 4，类似 round 但用圆弧填充更平滑）'],
          ['`miterClip`', '类似 miter 但超出 `stroke-miterlimit` 时截断（CSS 4）'],
        ],
      },
    ],
    details: `### 视觉对比

\`\`\`
miter（默认）:    ╱ ╲     尖角
                  ▲

round:            ╱ ╲     圆角
                  ⌒

bevel:            ╱ ╲     斜切
                  ─

arcs:             ╱ ╲     弧形
                  ⌣
\`\`\`

### 用例

\`\`\`ts
// Material Design / Feather Icons 风格
s.strokeLinecap.round
s.strokeLinejoin.round
\`\`\``,
    syntax: [
      ['5 个 keyword', '`miter` ｜ `round` ｜ `bevel` ｜ `arcs` ｜ `miterClip`', '只接受关键字'],
    ],
    initialValue: 'miter',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // strokeDasharray
  // ════════════════════════════════════════════════════════════════════
  strokeDasharray: {
    firstLine:
      'SVG 专属：设置**虚线描边**的模式（实线段长度和间隔长度）。可创建虚线、点状线、复杂图案。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。**实线**']],
      },
    ],
    details: `### 函数态语法

\`\`\`ts
s.strokeDasharray('5')           // 实线 5 + 间隔 5（单值会重复）
s.strokeDasharray('10 5')        // 实线 10 + 间隔 5
s.strokeDasharray('5 5 2 5')     // 复杂模式：5 实 + 5 空 + 2 实 + 5 空（循环）
s.strokeDasharray('1 8')         // 点状线（很短的实段 + 长间隔）
\`\`\`

### 经典：进度环动画

\`\`\`ts
// 圆周长例如 314.16
s.strokeDasharray('314.16')
s.strokeDashoffset('157.08')
// 显示 50% 进度（offset 让虚线偏移半圈）

// 配合 transition 动画 strokeDashoffset 0 → 314.16
// 实现"画圆"的进度动画
\`\`\``,
    syntax: [
      ['`none`', '—', '**默认值**，实线'],
      ['单个数字 / 长度', "`'5'` `'10px'`", '实段 = 间隔'],
      ['多值（实-空-实-空 ...）', "`'10 5'` `'5 5 2 5'`", '循环模式'],
      ['百分比', "`'10% 5%'`", '相对路径长度'],
    ],
    initialValue: 'none',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // strokeDashoffset
  // ════════════════════════════════════════════════════════════════════
  strokeDashoffset: {
    firstLine:
      'SVG 专属：设置**虚线描边的起始偏移** —— 让虚线从路径的哪个位置开始。常用于实现"画线 / 进度环"动画。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [
          ['只接受 `<length>` / `<percentage>` / 数字，**无关键字**（除全局关键字）'],
          ['默认 0；正值让虚线向前偏移（顺路径方向），负值向后'],
        ],
      },
    ],
    details: `### 经典：进度环动画

完整实现步骤：

\`\`\`ts
// 1. 准备一个 SVG 圆，例如 r=50 → 周长 = 2πr ≈ 314.16

// 2. 设 strokeDasharray = 路径总长（让虚线 = 整圈）
s.strokeDasharray('314.16')

// 3. strokeDashoffset 控制偏移：314.16 = 完全隐藏，0 = 完整显示
s.strokeDashoffset('314.16')          // 起始 0%
// 动画到 0 → 100%

// 4. 加上 transition 即可流畅
s.transition('stroke-dashoffset 1s ease-out')
\`\`\`

### 路径长度

可用 JS \`path.getTotalLength()\` 获取任意 path 的精确长度。

${lengthUnitsSnippet('strokeDashoffset')}`,
    syntax: [
      ['`<length>`', "`'10px'`", '具体长度'],
      ['`<number>`', '`50` `-20`', '可正可负'],
      ['`<percentage>`', "`'50%'`", '相对路径总长'],
    ],
    initialValue: '0',
    inherits: true,
  },
}

export default svg
