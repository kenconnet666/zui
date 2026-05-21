/**
 * 边框 / 轮廓 / 圆角 / 阴影属性中文文档（border 分组）。
 */

import { lengthUnitsSnippet, type DocsGroup } from './_common'

const BORDER_STYLE_ROWS: ReadonlyArray<readonly string[]> = [
  ['`none`', '**默认值**。完全无边框，不占任何空间'],
  ['`hidden`', '视觉效果同 `none`（无边框），但在**表格冲突边框解析**中优先级高于 `none`'],
  ['`dotted`', '**点状**虚线边框（圆点）'],
  ['`dashed`', '**虚线**边框（短横线）'],
  ['`solid`', '**实线**边框（最常用）'],
  ['`double`', '**双线**边框（两条平行实线 + 中间空隙；总宽 ≥ 3px 才能看出效果）'],
  ['`groove`', '**凹槽**：模拟凹下去的边框（3D 效果，浏览器渲染差异大）'],
  ['`ridge`', '**凸脊**：模拟凸起的边框（3D 效果，与 `groove` 视觉相反）'],
  ['`inset`', '**凹陷**：让元素看起来嵌入页面（上左暗，下右亮）'],
  ['`outset`', '**凸起**：让元素看起来浮出页面（上左亮，下右暗）'],
]

const border: DocsGroup = {
  borderWidth: {
    firstLine:
      '设置元素**四条边框的宽度**（简写，可一次设 1/2/3/4 个值）。⚠️ 必须配合非 `none` 的 `borderStyle` 才会显示。',
    keywordGroups: [
      {
        label: '3 个尺寸关键字（浏览器约定值）',
        headers: ['关键字', '行为'],
        rows: [
          ['`thin`', '细边框（约 **1px**；具体由浏览器决定）'],
          ['`medium`', '中等边框（**默认值**，约 **3px**）'],
          ['`thick`', '粗边框（约 **5px**）'],
        ],
      },
    ],
    details: `### 简写：1/2/3/4 值

| 写法 | 效果 |
| --- | --- |
| \`borderWidth.px(1)\` | 四边均为 1px |
| \`borderWidth('1px 2px')\` | 上下 1px，左右 2px |
| \`borderWidth('1px 2px 3px 4px')\` | 上 / 右 / 下 / 左（顺时针） |

### 必须配合 borderStyle

\`\`\`ts
s.borderWidth.px(2).borderColor._primary             // ❌ 不显示
s.borderWidth.px(2).borderStyle.solid.borderColor._primary  // ✅
\`\`\`

${lengthUnitsSnippet('borderWidth')}`,
    syntax: [
      ['`<length>`', "`'1px'` `'0.5rem'`", '具体长度（不能为负）'],
      ['3 个 keyword', '`thin` ｜ `medium` ｜ `thick`', '浏览器约定值'],
      ['1/2/3/4 值简写', "`'1px 2px 3px 4px'`", '上 / 右 / 下 / 左'],
    ],
    initialValue: 'medium',
    inherits: false,
  },

  borderTopWidth: {
    extends: 'borderWidth',
    firstLine: '设置元素**上边框**的宽度。规则同 `borderWidth`。',
    syntax: [
      ['`<length>`', "`'1px'` `'0.5rem'`", '具体长度'],
      ['3 个 keyword', '`thin` ｜ `medium` ｜ `thick`', '浏览器约定值'],
    ],
  },
  borderRightWidth: {
    extends: 'borderWidth',
    firstLine: '设置元素**右边框**的宽度。规则同 `borderWidth`。',
    syntax: [
      ['`<length>`', "`'1px'` `'0.5rem'`", '具体长度'],
      ['3 个 keyword', '`thin` ｜ `medium` ｜ `thick`', '浏览器约定值'],
    ],
  },
  borderBottomWidth: {
    extends: 'borderWidth',
    firstLine: '设置元素**下边框**的宽度。规则同 `borderWidth`。',
    syntax: [
      ['`<length>`', "`'1px'` `'0.5rem'`", '具体长度'],
      ['3 个 keyword', '`thin` ｜ `medium` ｜ `thick`', '浏览器约定值'],
    ],
  },
  borderLeftWidth: {
    extends: 'borderWidth',
    firstLine: '设置元素**左边框**的宽度。规则同 `borderWidth`。',
    syntax: [
      ['`<length>`', "`'1px'` `'0.5rem'`", '具体长度'],
      ['3 个 keyword', '`thin` ｜ `medium` ｜ `thick`', '浏览器约定值'],
    ],
  },
  outlineWidth: {
    extends: 'borderWidth',
    firstLine: '设置 **outline 的宽度**。outline 不占空间，可跨圆角包绕。',
    syntax: [
      ['`<length>`', "`'1px'` `'2px'`", '具体长度'],
      ['3 个 keyword', '`thin` ｜ `medium` ｜ `thick`', '浏览器约定值'],
    ],
  },

  borderStyle: {
    firstLine:
      '设置元素**四条边框的样式**。这是显示边框的**开关** —— 默认 `none` 不显示，必须显式设为 `solid` 等才能看到边框。',
    keywordGroups: [
      {
        label: '10 个样式关键字',
        headers: ['关键字', '行为'],
        rows: BORDER_STYLE_ROWS,
      },
    ],
    details: `### 重要：边框三件套

CSS 边框需要 **width + style + color** 三件齐全才显示：

- \`borderWidth\` 默认 \`medium\`（≈3px）✓
- \`borderStyle\` 默认 \`none\` ✗ **必须显式设**
- \`borderColor\` 默认 \`currentColor\`（跟随文字色）✓

### hidden vs none 在表格中

\`borderCollapse: collapse\` 时，相邻单元格边框冲突解析：
- \`hidden\` 优先级**最高**，强制不显示
- \`none\` 优先级**最低**，让对方边框显示

### 简写：1/2/3/4 值

\`\`\`ts
s.borderStyle.solid                            // 四边 solid
s.borderStyle('solid dashed')                  // 上下 solid，左右 dashed
s.borderStyle('solid dashed dotted none')      // 上 / 右 / 下 / 左
\`\`\``,
    syntax: [
      [
        '10 个样式 keyword',
        '`none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset`',
        '见上方关键字表',
      ],
      ['1/2/3/4 值简写', "`'solid dashed'`", '上 / 右 / 下 / 左 顺时针'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  borderTopStyle: {
    extends: 'borderStyle',
    firstLine: '设置元素**上边框**的样式。规则同 `borderStyle`。',
    syntax: [
      ['10 个 keyword', '`none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset`', '见关键字表'],
    ],
  },
  borderRightStyle: {
    extends: 'borderStyle',
    firstLine: '设置元素**右边框**的样式。规则同 `borderStyle`。',
    syntax: [
      ['10 个 keyword', '`none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset`', '见关键字表'],
    ],
  },
  borderBottomStyle: {
    extends: 'borderStyle',
    firstLine: '设置元素**下边框**的样式。规则同 `borderStyle`。',
    syntax: [
      ['10 个 keyword', '`none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset`', '见关键字表'],
    ],
  },
  borderLeftStyle: {
    extends: 'borderStyle',
    firstLine: '设置元素**左边框**的样式。规则同 `borderStyle`。',
    syntax: [
      ['10 个 keyword', '`none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset`', '见关键字表'],
    ],
  },
  outlineStyle: {
    extends: 'borderStyle',
    firstLine: '设置 outline 的样式。同 `borderStyle`，常用 `solid`。outline 还接受 `auto`（平台原生焦点环）。',
    syntax: [
      ['10 个 keyword', '`none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset`', '同 borderStyle'],
      ['`auto`', '—', 'outline 特有：浏览器使用平台原生焦点轮廓（如 macOS 蓝光环）'],
    ],
  },

  outlineOffset: {
    firstLine:
      '控制 **outline 与元素边缘的距离**。可为**负值**（outline 缩入元素内部），常用于焦点环呼吸感。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [
          ['只接受 `<length>`，可正可负，无关键字（除全局关键字）'],
          ['正值 = outline 向外推；负值 = outline 向内缩'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
s.outlineWidth.px(2).outlineStyle.solid.outlineColor._primary
  .outlineOffset.px(4)             // 焦点环离元素 4px 远

s.outlineOffset.px(-2)             // outline 缩入元素 2px，防止被父级 overflow:hidden 裁切
\`\`\`

${lengthUnitsSnippet('outlineOffset')}`,
    syntax: [['`<length>`', "`'4px'` `'-2px'` `'0.5rem'`", '可正可负']],
    initialValue: '0',
    inherits: false,
  },

  borderRadius: {
    firstLine:
      '设置元素**四个圆角**的半径（简写）。支持单值四角统一、多值各角不同、`/` 分隔横纵半径做椭圆角。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [
          ['只接受长度 / 百分比 / 数学函数，**无关键字**（除全局关键字）'],
          ['百分比相对元素对应轴尺寸；正方形 50% = 圆形'],
        ],
      },
    ],
    details: `### 简写语法（1/2/3/4 值）

| 写法 | 效果 |
| --- | --- |
| \`borderRadius.px(8)\` | 四角均为 8px |
| \`borderRadius('8px 16px')\` | 左上右下 8px，右上左下 16px |
| \`borderRadius('8px 16px 4px 0')\` | 左上 / 右上 / 右下 / 左下（顺时针） |

### 椭圆角：横纵半径分开

用 \`/\` 分隔：

\`\`\`ts
s.borderRadius('10px / 20px')        // 横半径 10px，纵半径 20px
s.borderRadius('50%')                // 圆 / 椭圆
\`\`\`

### 经典用法

\`\`\`ts
s.borderRadius('50%')                // 圆形（正方形元素时）
s.borderRadius.px(8)                 // 卡片圆角
s.borderRadius._md                   // 主题 token

// 仅单边圆角
s.borderRadius('8px 0 0 8px')        // 左侧圆角，右侧直角
\`\`\`

${lengthUnitsSnippet('borderRadius')}`,
    syntax: [
      ['`<length>`', "`'8px'` `'1rem'`", '具体长度'],
      ['`<percentage>`', "`'50%'`", '相对元素对应轴尺寸'],
      ['1/2/3/4 值简写', "`'8px 16px 4px 0'`", '左上 / 右上 / 右下 / 左下'],
      ['椭圆角', "`'10px / 20px'`", '`/` 前横半径，后纵半径'],
      ['数学函数', "`'calc(...)'`", 'calc / min / max / clamp'],
    ],
    initialValue: '0',
    inherits: false,
  },

  borderTopLeftRadius: {
    extends: 'borderRadius',
    firstLine: '设置元素**左上角**的圆角半径。可用 2 个值指定该角的横/纵半径（椭圆角）。',
    syntax: [
      ['`<length>` / `<percentage>`', "`'8px'` `'50%'`", '该角的圆角半径'],
      ['椭圆角（单角）', "`'10px 20px'`", '横半径 / 纵半径（注意这里不用 `/`）'],
    ],
  },
  borderTopRightRadius: {
    extends: 'borderRadius',
    firstLine: '设置元素**右上角**的圆角半径。',
    syntax: [
      ['`<length>` / `<percentage>`', "`'8px'` `'50%'`", '该角的圆角半径'],
      ['椭圆角（单角）', "`'10px 20px'`", '横半径 / 纵半径'],
    ],
  },
  borderBottomLeftRadius: {
    extends: 'borderRadius',
    firstLine: '设置元素**左下角**的圆角半径。',
    syntax: [
      ['`<length>` / `<percentage>`', "`'8px'` `'50%'`", '该角的圆角半径'],
      ['椭圆角（单角）', "`'10px 20px'`", '横半径 / 纵半径'],
    ],
  },
  borderBottomRightRadius: {
    extends: 'borderRadius',
    firstLine: '设置元素**右下角**的圆角半径。',
    syntax: [
      ['`<length>` / `<percentage>`', "`'8px'` `'50%'`", '该角的圆角半径'],
      ['椭圆角（单角）', "`'10px 20px'`", '横半径 / 纵半径'],
    ],
  },

  boxShadow: {
    firstLine:
      '给元素添加**阴影**。可叠加多组（逗号分隔），支持外/内阴影。CSS 中最常用的视觉增强属性。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。无阴影']],
      },
      {
        label: '函数态特殊关键字',
        headers: ['关键字', '行为'],
        rows: [
          ['`inset`', '让阴影变为**内阴影**（投影在元素内部）；写在 offset/blur/spread/color 之前'],
        ],
      },
    ],
    details: `### 函数态语法

\`boxShadow: [inset?] <offsetX> <offsetY> <blur>? <spread>? <color>?\`

| 参数 | 必填 | 含义 |
| --- | --- | --- |
| \`inset\` | 否 | 写则为内阴影 |
| \`offsetX\` | ✓ | 水平偏移（正右负左） |
| \`offsetY\` | ✓ | 垂直偏移（正下负上） |
| \`blur\` | 否 | 模糊半径（≥ 0） |
| \`spread\` | 否 | 扩散半径，正值放大阴影，负值缩小 |
| \`color\` | 否 | 阴影颜色（默认 \`currentColor\`） |

### 多阴影叠加

逗号分隔，**先写的在最前**：

\`\`\`ts
s.boxShadow(\`
  0 1px 3px rgba(0,0,0,0.1),
  0 1px 2px rgba(0,0,0,0.06)
\`)
\`\`\`

### 经典写法

\`\`\`ts
s.boxShadow('0 4px 12px rgba(0,0,0,0.1)')        // 卡片浮起
s.boxShadow._md                                  // 主题 token
s.boxShadow('inset 0 2px 4px rgba(0,0,0,0.06)')  // 内阴影
s.boxShadow('0 0 0 1px rgba(0,0,0,0.1)')         // 模拟 border（不占空间）
s.boxShadow('0 0 0 3px rgba(59,130,246,0.4)')    // 焦点环
\`\`\`

### 性能提示

- \`boxShadow\` 触发 paint；频繁动画的大模糊半径会卡顿
- 优化：用 \`filter: drop-shadow()\` 或多个小阴影代替`,
    syntax: [
      ['`none`', '—', '**默认值**'],
      ['单组阴影', "`'2px 4px 8px #0002'`", 'offsetX offsetY blur color'],
      ['完整 5 参数', "`'inset 0 2px 4px 0 rgba(0,0,0,0.1)'`", 'inset offsetX offsetY blur spread color'],
      ['多组叠加', "`'0 1px 3px #0001, 0 1px 2px #0006'`", '逗号分隔'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  textShadow: {
    firstLine:
      '给**文字**添加阴影。比 `boxShadow` 简化，**无 `spread`，无 `inset`**。可叠加多组。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。无文字阴影']],
      },
    ],
    details: `### 函数态语法

\`textShadow: <offsetX> <offsetY> <blur>? <color>?\`

参数同 \`boxShadow\` 但**无 spread、无 inset**。

### 经典用法

\`\`\`ts
// 文字浮起感
s.textShadow('0 1px 2px rgba(0,0,0,0.3)')

// 多方向描边
s.textShadow(\`
  -1px -1px 0 #fff,
   1px -1px 0 #fff,
  -1px  1px 0 #fff,
   1px  1px 0 #fff
\`)

// 霓虹光效
s.textShadow(\`
  0 0 6px #fff,
  0 0 12px #ff00ff,
  0 0 24px #ff00ff
\`)
\`\`\``,
    syntax: [
      ['`none`', '—', '**默认值**'],
      ['单组阴影', "`'1px 1px 2px #0008'`", 'offsetX offsetY blur color'],
      ['多组叠加', "`'1px 1px 0 #fff, -1px -1px 0 #fff'`", '逗号分隔实现描边等效果'],
    ],
    initialValue: 'none',
    inherits: true,
  },

  borderCollapse: {
    firstLine:
      '决定 `<table>` 中相邻单元格**边框合并还是分离**。表格样式的核心开关。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`separate`', '**默认值**。相邻单元格边框**独立**（有间距），间距由 `borderSpacing` 控制'],
          ['`collapse`', '相邻单元格边框**合并**（消除间距 + 重叠时取优先级高的样式）'],
        ],
      },
    ],
    details: `### 影响

- \`separate\`：可用 \`borderSpacing\`；\`borderRadius\` 可圆角
- \`collapse\`：\`borderSpacing\` 无效；\`borderRadius\` 在多数浏览器**无效**

### 边框冲突解决（collapse 模式）

按优先级：
1. \`hidden\` > 任何（强制无边框）
2. 宽 > 窄
3. \`double\` > \`solid\` > \`dashed\` > \`dotted\` > \`ridge\` > \`outset\` > \`groove\` > \`inset\`
4. 相同时取 cell 自身`,
    syntax: [['2 个 keyword', '`separate` ｜ `collapse`', '只接受关键字']],
    initialValue: 'separate',
    inherits: true,
  },

  borderSpacing: {
    firstLine:
      '设置 `<table>` 中相邻单元格**边框之间的距离**。仅在 `borderCollapse: separate` 时生效。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [
          ['只接受 1 或 2 个长度值，**无关键字**'],
          ['1 值：横纵相同；2 值：横距 / 纵距'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
s.borderCollapse.separate.borderSpacing.px(8)
s.borderSpacing('12px 4px')         // 横 12px，纵 4px
\`\`\`

${lengthUnitsSnippet('borderSpacing')}`,
    syntax: [
      ['1 个长度', "`'8px'`", '横纵相同'],
      ['2 个长度', "`'12px 4px'`", '横距 / 纵距'],
    ],
    initialValue: '0',
    inherits: true,
  },

  columnRuleWidth: {
    extends: 'borderWidth',
    firstLine:
      '设置**多栏布局**（`columns` / `columnCount`）中**栏间分隔线**的宽度。规则同 `borderWidth`。',
    syntax: [
      ['`<length>`', "`'1px'` `'2px'`", '具体长度'],
      ['3 个 keyword', '`thin` ｜ `medium` ｜ `thick`', '浏览器约定值'],
    ],
  },
  columnRuleStyle: {
    extends: 'borderStyle',
    firstLine:
      '设置**多栏布局**中**栏间分隔线**的样式。规则同 `borderStyle`。⚠️ 必须设非 `none` 才显示。',
    syntax: [
      ['10 个 keyword', '`none` `hidden` `dotted` `dashed` `solid` `double` `groove` `ridge` `inset` `outset`', '同 borderStyle'],
    ],
  },
}

export default border
