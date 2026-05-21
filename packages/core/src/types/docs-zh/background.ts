/**
 * 背景相关属性中文文档（background 分组）。
 * 覆盖：backgroundPosition / backgroundSize / backgroundRepeat / backgroundClip / backgroundBlendMode
 */

import { lengthUnitsSnippet, type DocsGroup } from './_common'

const background: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // backgroundPosition
  // ════════════════════════════════════════════════════════════════════
  backgroundPosition: {
    firstLine:
      '设置 `background-image` **在容器中的位置**。可用关键字、百分比、长度，单值或多值组合。',
    keywordGroups: [
      {
        label: '5 个位置关键字',
        headers: ['关键字', '行为'],
        rows: [
          ['`top`', '垂直上对齐（= `0%` 纵向）'],
          ['`bottom`', '垂直下对齐（= `100%` 纵向）'],
          ['`left`', '水平左对齐（= `0%` 横向）'],
          ['`right`', '水平右对齐（= `100%` 横向）'],
          ['`center`', '居中（= `50%`）'],
        ],
      },
    ],
    details: `### 1/2/3/4 值

| 值数量 | 含义 |
| --- | --- |
| 1 | 单值（如 \`center\`）：另一轴默认 \`center\` |
| 2 | \`X Y\`：如 \`'center top'\` = 水平居中 + 顶端 |
| 3 / 4 | 边偏移：\`'right 20px bottom 10px'\` = 距右边 20px、距底边 10px |

### 百分比的含义

\`\`\`ts
s.backgroundPosition('50% 50%')         // 等同 'center'
s.backgroundPosition('0% 0%')           // 等同 'left top'
s.backgroundPosition('100% 100%')       // 等同 'right bottom'
\`\`\`

百分比是 (容器尺寸 − 图片尺寸) 的比例 —— **50% 让图片中心对齐容器中心**（不像其他属性的百分比相对容器宽度）。

### 经典用法

\`\`\`ts
// 居中的背景图
s.backgroundImage("url('/hero.jpg')")
  .backgroundPosition.center
  .backgroundSize.cover

// 精灵图：定位到某个图标
s.backgroundImage("url('/sprite.png')")
  .backgroundPosition('-32px -64px')         // 取精灵图 (32, 64) 位置的图标
\`\`\`

${lengthUnitsSnippet('backgroundPosition')}`,
    syntax: [
      ['关键字', '`top` `bottom` `left` `right` `center`', '位置关键字'],
      ['1 个值', "`'center'`", '另一轴默认 center'],
      ['2 个值（X Y）', "`'center top'` `'100% 50%'`", '水平 / 垂直'],
      ['`<length>`', "`'10px 20px'` `'-32px -64px'`", '从左上角偏移（可负 = 反向）'],
      ['`<percentage>`', "`'50% 50%'`", '50% = 中心对齐中心'],
      ['边偏移（CSS 3）', "`'right 20px bottom 10px'`", '距某边的距离'],
    ],
    initialValue: '0% 0%',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // backgroundSize
  // ════════════════════════════════════════════════════════════════════
  backgroundSize: {
    firstLine:
      '设置 `background-image` 的**显示尺寸** —— 拉伸 / 包含 / 覆盖 / 平铺时的图片大小。',
    keywordGroups: [
      {
        label: '3 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。图片原始尺寸（一轴 auto 时按比例缩放另一轴）'],
          [
            '`cover`',
            '**等比缩放铺满容器**（可能裁剪溢出部分）；适合 hero 图、卡片封面',
          ],
          [
            '`contain`',
            '**等比缩放完整显示**（不裁剪，可能留空白）；适合 logo、整图展示',
          ],
        ],
      },
    ],
    details: `### 1/2 值

\`\`\`ts
s.backgroundSize.cover                     // 铺满
s.backgroundSize('100px')                  // 宽 100px，高 auto（按比例）
s.backgroundSize('100px 50px')             // 宽 100，高 50
s.backgroundSize('100% auto')              // 宽撑满，高按比例
\`\`\`

### cover vs contain

\`\`\`
容器 200×100，图片 100×100：

cover（铺满，裁剪）：
┌────────────────────┐
│ ╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳ │  ← 上下被裁
│ ░░░░░░░░░░░░░░░░░░ │
│ ╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳ │
└────────────────────┘

contain（完整显示，留空白）：
┌────────────────────┐
│       ░░░░░░       │
│ 空白  ░░░░░░  空白 │
│       ░░░░░░       │
└────────────────────┘
\`\`\`

${lengthUnitsSnippet('backgroundSize')}`,
    syntax: [
      ['3 个 keyword', '`auto` ｜ `cover` ｜ `contain`', '常用'],
      ['1 个长度 / 百分比', "`'100px'` `'50%'`", '宽，高自动'],
      ['2 个值', "`'100px 50px'` `'100% auto'`", '宽 / 高'],
    ],
    initialValue: 'auto auto',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // backgroundRepeat
  // ════════════════════════════════════════════════════════════════════
  backgroundRepeat: {
    firstLine:
      '决定 `background-image` 在容器中**是否平铺**、如何平铺。',
    keywordGroups: [
      {
        label: '6 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`repeat`', '**默认值**。两轴都**平铺**（可能在边缘有半个图）'],
          ['`noRepeat`', '**不平铺**，只显示一张'],
          ['`repeatX`', '仅水平方向平铺'],
          ['`repeatY`', '仅垂直方向平铺'],
          [
            '`round`',
            '**整数次**平铺：缩放图片让边缘正好放下整数张（避免半张图）',
          ],
          ['`space`', '**等距分布**：平铺整数次 + 在图之间留间距（不缩放图）'],
        ],
      },
    ],
    details: `### 两值简写

第 1 个 X 轴，第 2 个 Y 轴：

\`\`\`ts
s.backgroundRepeat('repeat no-repeat')      // 横向平铺，纵向不平铺
\`\`\`

### round vs space 对比

容器 100px 宽，图片 30px 宽：

- \`repeat\`：3.33 张图（边缘裁切 0.33 张）
- \`round\`：3 张图但**缩放到 33.33px 宽**（无裁切）
- \`space\`：3 张 30px 图 + 之间分配剩余 10px 间距（不缩放）`,
    syntax: [
      ['6 个 keyword', '`repeat` ｜ `noRepeat` ｜ `repeatX` ｜ `repeatY` ｜ `round` ｜ `space`', '只接受关键字'],
      ['2 个 keyword', "`'repeat no-repeat'`", '第 1 个 X，第 2 个 Y'],
    ],
    initialValue: 'repeat',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // backgroundClip
  // ════════════════════════════════════════════════════════════════════
  backgroundClip: {
    firstLine:
      '决定背景（image 和 color）**绘制范围** —— border 内 / padding 内 / content 内 / 仅文字。',
    keywordGroups: [
      {
        label: '4 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`borderBox`', '**默认值**。背景延伸到 border **外边缘**（包括 border 区）'],
          ['`paddingBox`', '背景仅在 padding **外边缘**内（不包括 border 区）'],
          ['`contentBox`', '背景仅在 content **外边缘**内（不包括 padding 和 border）'],
          [
            '`text`',
            '**背景仅显示在文字范围内**（霓虹字 / 渐变字效果）。需要配合 `color: transparent`',
          ],
        ],
      },
    ],
    details: `### 文字渐变（霓虹字效果）

\`\`\`ts
s.backgroundImage('linear-gradient(45deg, #ff00ff, #00ffff)')
  .backgroundClip.text
  .color.transparent             // 让文字本身透明，露出背景渐变
\`\`\`

⚠️ 早期需要 \`-webkit-background-clip: text\` 前缀（现代浏览器均支持无前缀，但 Safari 仍推荐加前缀确保兼容）。`,
    syntax: [
      ['4 个 keyword', '`borderBox` ｜ `paddingBox` ｜ `contentBox` ｜ `text`', '只接受关键字'],
    ],
    initialValue: 'borderBox',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // backgroundBlendMode
  // ════════════════════════════════════════════════════════════════════
  backgroundBlendMode: {
    firstLine:
      '决定**多重背景**之间（或 background-image 与 background-color 之间）的**混合模式**。可叠加滤镜般的色彩效果。',
    keywordGroups: [
      {
        label: '16 种混合模式',
        headers: ['关键字', '行为'],
        rows: [
          ['`normal`', '**默认值**。无混合（上层完全覆盖下层）'],
          ['`multiply`', '**正片叠底**：颜色相乘 —— 整体变暗（白 = 无效，黑 = 全黑）'],
          ['`screen`', '**滤色**：取反相乘 —— 整体变亮（黑 = 无效，白 = 全白）'],
          ['`overlay`', '**叠加**：multiply + screen 组合，增强对比'],
          ['`darken`', '**变暗**：每像素取两层中较深的色'],
          ['`lighten`', '**变亮**：每像素取两层中较浅的色'],
          ['`colorDodge`', '**颜色减淡**：基于上层降低对比度（高光更亮）'],
          ['`colorBurn`', '**颜色加深**：基于上层增加对比度（阴影更暗）'],
          ['`hardLight`', '**强光**：等同 overlay 但上下层调换'],
          ['`softLight`', '**柔光**：变暗 / 变亮取决于上层（柔和叠加）'],
          ['`difference`', '**差值**：取两层颜色差的绝对值'],
          ['`exclusion`', '**排除**：类似 difference 但对比度低'],
          ['`hue`', '保留下层亮度+饱和度，使用上层**色相**'],
          ['`saturation`', '保留下层色相+亮度，使用上层**饱和度**'],
          ['`color`', '保留下层亮度，使用上层**色相+饱和度**'],
          ['`luminosity`', '保留下层色相+饱和度，使用上层**亮度**'],
          ['`plusDarker`', '加性变暗（实验性，CSS Compositing 2）'],
          ['`plusLighter`', '加性变亮（实验性，CSS Compositing 2）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// 给背景图加品牌色滤镜
s.backgroundImage("url('/hero.jpg')")
  .backgroundColor._primary
  .backgroundBlendMode.multiply         // 把品牌色乘进背景图
\`\`\``,
    syntax: [
      [
        '16 种混合 keyword',
        '`normal` `multiply` `screen` `overlay` `darken` `lighten` `colorDodge` `colorBurn` `hardLight` `softLight` `difference` `exclusion` `hue` `saturation` `color` `luminosity` `plusDarker` `plusLighter`',
        '见上方关键字表',
      ],
      ['多个值（多背景层各一个）', "`'multiply screen'`", '逗号分隔'],
    ],
    initialValue: 'normal',
    inherits: false,
  },
}

export default background
