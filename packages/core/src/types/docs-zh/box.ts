/**
 * box 分组中文文档。
 *
 * 覆盖：width / height / minWidth / maxWidth / minHeight / maxHeight（尺寸 6 个）
 *       margin + 6 方位变体（外边距 7 个）
 *       padding + 6 方位变体（内边距 7 个）
 *       inset + top / right / bottom / left（定位偏移 5 个）
 *       aspectRatio（长宽比 1 个）
 *
 * 共 26 个属性。
 */

import { LENGTH_SYNTAX_ROWS, lengthUnitsSnippet, type DocsGroup } from './_common'

const box: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // width —— 最详细模板，其他尺寸属性参考此模式
  // ════════════════════════════════════════════════════════════════════
  width: {
    firstLine: '设置元素的**内容区宽度**（content-box 模式）或**边框盒宽度**（border-box 模式）。',

    keywordGroups: [
      {
        label: '4 个尺寸关键字',
        headers: ['关键字', '效果', '典型用途'],
        rows: [
          [
            '`auto`',
            '**默认值**。浏览器自动计算：块级元素（`display: block`）撑满父容器 content-box 宽度；行内元素 / flex 项目 / grid 单元格 = 内容宽度',
            '通常不需要显式写，块级布局默认行为',
          ],
          [
            '`minContent`',
            '元素尽可能收窄，直到再窄一个像素就会使内容溢出为止。等于"最长不可断单词/图片"的宽度',
            '让宽度跟随最小内容，避免拉伸过宽；表格列紧凑排列',
          ],
          [
            '`maxContent`',
            '元素扩展到"理想宽度"——如果空间无限大它会有多宽。等于最长文本行不换行时的宽度',
            '让元素像 Tag / Badge 一样宽度跟随文字，但不被容器压缩',
          ],
          [
            '`fitContent`',
            '`min(max-content, max(min-content, 可用宽度))`：尽量撑到 max-content，但不超过父容器；比父容器窄时收到 max-content',
            '响应式 Tooltip / 弹窗宽度自适应内容但不溢出',
          ],
        ],
      },
    ],

    details: `### 盒模型模式影响

默认（\`box-sizing: content-box\`）时，\`width\` 设置的是**内容区**宽度，实际占用宽度 = width + padding-left + padding-right + border-left + border-right。

推荐全局使用 \`box-sizing: border-box\`（即 CSS reset 常见做法），此时 \`width\` = 整个边框盒宽度，padding/border 向内挤压内容区，不再影响元素占位宽。

\`\`\`ts
s.width.px(200)               // 200px 内容宽（默认 content-box）
s.boxSizing.borderBox          // 200px 边框盒宽（含 padding + border）
s.width.px(200)
\`\`\`

### 百分比参照

\`width: 50%\` 参照**父元素 content-box 宽度**（与高度无关）。

### 与 max-width / min-width 优先级

实际计算宽度 = \`min(max-width, max(min-width, width))\`：
- \`min-width\` 优先于 \`max-width\`（两者冲突时 min-width 赢）
- \`max-width\` 优先于 \`width\`

${lengthUnitsSnippet('width')}

### 常见陷阱

- \`width: 100%\` 在 \`content-box\` 模式下，若元素还有 padding/border，实际会溢出父容器 —— 切 \`border-box\` 或改用 \`width: auto\`
- height: auto 不像 width: auto 自动撑满父容器 —— 父高度需显式设置，子元素 \`height: 100%\` 才生效`,

    syntax: [
      ...LENGTH_SYNTAX_ROWS,
      ['`auto`', '—', '**默认值**；块级元素撑满父宽，行内 / flex 项 = 内容宽'],
      ['`minContent`', '—', '收窄至最小内容宽（最长不可断处）'],
      ['`maxContent`', '—', '扩展至理想宽度（不换行全行宽）'],
      ['`fitContent`', '—', '内容宽但不超父容器'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // height
  // ════════════════════════════════════════════════════════════════════
  height: {
    extends: 'width',
    firstLine:
      '设置元素的**内容区高度**。行为与 `width` 类似，但百分比参照父元素**高度**（且父高度需显式设置才生效）。',
    details: `### 百分比参照与父高度依赖

\`height: 50%\` 参照**父元素 content-box 高度**。若父元素未设置明确高度（如父元素 \`height: auto\`），百分比高度**无效**，等同 \`auto\`。

这是 CSS 布局中最常见的困惑：想让子元素高度 100% 填满父容器，必须确保祖先链上每一级都有明确高度，或改用 flex / grid 布局。

### 块级 vs 行内

块级元素 \`height: auto\` = 高度跟随内容；行内元素 \`height\` 设置无效（改用 \`line-height\`）。

${lengthUnitsSnippet('height')}`,
  },

  // ════════════════════════════════════════════════════════════════════
  // minWidth
  // ════════════════════════════════════════════════════════════════════
  minWidth: {
    extends: 'width',
    firstLine:
      '设置元素的**最小宽度**下限。元素宽度不会缩小到此值以下（即使父容器更窄），可防止内容被压碎。',
    details: `### 与 width / max-width 优先级

\`min-width\` 优先级**最高**：即使写了 \`width: 0\` 也不会低于 \`min-width\`。
当 \`min-width\` > \`max-width\` 时，\`min-width\` 赢。

### Flex / Grid 布局注意

flex 项目默认 \`min-width: auto\`（跟随内容最小宽），导致内容超出 flex 容器。
修复：给 flex 子项加 \`min-width: 0\` 允许缩小。

${lengthUnitsSnippet('minWidth')}`,
  },

  // ════════════════════════════════════════════════════════════════════
  // maxWidth
  // ════════════════════════════════════════════════════════════════════
  maxWidth: {
    firstLine:
      '设置元素的**最大宽度**上限。元素宽度不会超过此值，常用于响应式布局限制内容区最宽。',
    inherits: false,
    details: `### 经典用法：内容区宽度限制

\`\`\`ts
s.width('100%')
s.maxWidth.px(1200)
s.marginInline.auto
// 等宽占满但不超 1200px，左右 auto 水平居中
\`\`\`

### none = 无限制

\`max-width\` 初始值为 \`none\`（不设上限）。写 \`maxWidth.none\` 可取消之前设过的 max-width。

${lengthUnitsSnippet('maxWidth')}`,
    syntax: [
      ...LENGTH_SYNTAX_ROWS,
      ['`none`', '—', '**默认值**；无宽度上限'],
      ['`minContent`', '—', '上限 = 最小内容宽'],
      ['`maxContent`', '—', '上限 = 理想内容宽'],
      ['`fitContent`', '—', '上限 = 内容宽但不超父容器'],
    ],
    keywordGroups: [
      {
        label: '5 个尺寸关键字',
        headers: ['关键字', '效果', '典型用途'],
        rows: [
          ['`none`', '**默认值**。无宽度上限，元素可以任意宽', '默认；不设上限'],
          ['`auto`', '浏览器自动（继承 width 行为）', '一般同 none，很少单独使用'],
          ['`minContent`', '上限收窄至最小内容宽', '罕用于 maxWidth'],
          ['`maxContent`', '上限 = 理想内容宽（不换行）', '按内容设上限'],
          ['`fitContent`', '内容驱动但不超父容器', '弹性上限'],
        ],
      },
    ],
    initialValue: 'none',
  },

  // ════════════════════════════════════════════════════════════════════
  // minHeight
  // ════════════════════════════════════════════════════════════════════
  minHeight: {
    extends: 'height',
    firstLine:
      '设置元素的**最小高度**下限。内容较少时不会缩到比此高度更小，常用于保证卡片/区块最低高度。',
    details: `### 常见用途

\`\`\`ts
s.minHeight('100dvh')   // 内容少时也占满动态视口高度（移动端适配）
s.minHeight.px(48)      // 保证按钮/输入框最低高度 48px（可访问性最小点击区域）
\`\`\`

${lengthUnitsSnippet('minHeight')}`,
  },

  // ════════════════════════════════════════════════════════════════════
  // maxHeight
  // ════════════════════════════════════════════════════════════════════
  maxHeight: {
    firstLine:
      '设置元素的**最大高度**上限。内容超出时通常配合 `overflow: auto/hidden` 截断或滚动。',
    inherits: false,
    details: `### 经典用法：下拉列表高度限制

\`\`\`ts
s.maxHeight.px(300)
s.overflowY.auto
// 最多 300px 高，超出时内部滚动
\`\`\`

${lengthUnitsSnippet('maxHeight')}`,
    syntax: [
      ...LENGTH_SYNTAX_ROWS,
      ['`none`', '—', '**默认值**；无高度上限'],
      ['`minContent`', '—', '上限 = 最小内容高'],
      ['`maxContent`', '—', '上限 = 理想内容高'],
      ['`fitContent`', '—', '内容驱动但不超父容器高'],
    ],
    keywordGroups: [
      {
        label: '5 个尺寸关键字',
        headers: ['关键字', '效果', '典型用途'],
        rows: [
          ['`none`', '**默认值**。无高度上限', '默认；不设上限'],
          ['`auto`', '跟随内容高度', '一般同 none'],
          ['`minContent`', '上限收窄至最小内容高', '罕用'],
          ['`maxContent`', '上限 = 理想内容高', '按内容设上限'],
          ['`fitContent`', '内容驱动但不超父容器高', '弹性上限'],
        ],
      },
    ],
    initialValue: 'none',
  },

  // ════════════════════════════════════════════════════════════════════
  // margin —— 详细，含简写规则 + auto 居中用法
  // ════════════════════════════════════════════════════════════════════
  margin: {
    firstLine:
      '设置元素**四条边外边距**（简写，可一次设 1/2/3/4 个值）。外边距是元素边框外到相邻元素之间的透明空间。',

    keywordGroups: [
      {
        label: '1 个外边距关键字',
        headers: ['关键字', '效果', '典型用途'],
        rows: [
          [
            '`auto`',
            '浏览器按剩余空间自动分配。**常用于水平居中**：`margin: 0 auto` 让块级元素在父容器中水平居中（左右各自分配剩余空间的一半）',
            '水平居中：`s.margin(\'0 auto\')`；`margin-left: auto` 把元素推到右侧（flex 布局右对齐技巧）',
          ],
        ],
      },
    ],

    details: `### 简写语法（1/2/3/4 值）

| 写法 | 效果 |
| --- | --- |
| \`margin('16px')\` | 四边均为 16px |
| \`margin('8px 16px')\` | 上下 8px，左右 16px |
| \`margin('4px 8px 12px')\` | 上 4px，左右 8px，下 12px |
| \`margin('4px 8px 12px 16px')\` | 上 4px，右 8px，下 12px，左 16px（顺时针） |

### 水平居中经典写法

\`\`\`ts
s.width.px(800)
s.margin('0 auto')
// 块级元素 800px 宽，左右 auto 均分剩余空间 = 水平居中
// 等价于：marginLeft.auto + marginRight.auto
\`\`\`

⚠️ \`margin: auto\` **只在水平方向**对 block 元素生效；垂直居中需用 flex / grid。

### 百分比参照

\`margin: 25%\` 参照**父元素宽度**（即使是 marginTop / marginBottom 也参照宽，这是反直觉的 CSS 规则）。

### 外边距折叠（Margin Collapse）

⚠️ **只有普通文档流中的块级元素**在**垂直方向**会发生外边距折叠：
- 相邻兄弟元素：两个上下 margin 取较大值（不是相加）
- 父子元素：父无 border/padding/BFC 时，子元素的 marginTop 会"穿透"成为父元素的 marginTop

**以下情况不折叠**：flex 容器子项、grid 子项、绝对定位元素、inline 元素。

### 接受负值

\`margin\` 接受**负值**，可以让元素向反方向移动甚至与相邻元素重叠。\`padding\` **不接受负值**。

${lengthUnitsSnippet('margin')}`,

    syntax: [
      ...LENGTH_SYNTAX_ROWS,
      ['`auto`', "`'auto'`（或多值如 `'0 auto'`）", '让浏览器按剩余空间分配；`0 auto` 水平居中'],
      ['多值简写', "`'8px 16px'` `'4px 8px 12px 16px'`", '1/2/3/4 个值，按上述简写规则分配'],
    ],
    initialValue: '0',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // marginTop / marginRight / marginBottom / marginLeft / marginBlock / marginInline
  // ════════════════════════════════════════════════════════════════════
  marginTop: {
    extends: 'margin',
    firstLine:
      '设置元素的**上外边距**。正值向下推开相邻内容，负值让元素上移。其他规则同 [`margin`]。',
  },
  marginRight: {
    extends: 'margin',
    firstLine:
      '设置元素的**右外边距**。正值向右推开相邻内容，`auto` 可把元素推到容器左侧（右侧留空）。其他规则同 [`margin`]。',
  },
  marginBottom: {
    extends: 'margin',
    firstLine:
      '设置元素的**下外边距**。常用于段落 / 标题之间的垂直间隔。其他规则同 [`margin`]。',
  },
  marginLeft: {
    extends: 'margin',
    firstLine:
      '设置元素的**左外边距**。`auto` 可把元素推到容器右侧（左侧留空），是 flex 布局末尾对齐常用技巧。其他规则同 [`margin`]。',
  },
  marginBlock: {
    extends: 'margin',
    firstLine:
      '**逻辑属性**：同时设置元素块轴（Block Axis）起止两端的外边距。水平书写模式下等同 `marginTop + marginBottom`；竖排文字模式下等同左右外边距。其他规则同 [`margin`]。',
  },
  marginInline: {
    extends: 'margin',
    firstLine:
      '**逻辑属性**：同时设置元素行轴（Inline Axis）起止两端的外边距。水平书写模式下等同 `marginLeft + marginRight`。`marginInline.auto` 水平居中（等同 `margin: 0 auto`）。其他规则同 [`margin`]。',
  },

  // ════════════════════════════════════════════════════════════════════
  // padding —— 详细，含简写规则 + 不接受负值特别说明
  // ════════════════════════════════════════════════════════════════════
  padding: {
    firstLine:
      '设置元素**四条边内边距**（简写，可一次设 1/2/3/4 个值）。内边距是内容区与边框之间的透明空间，会撑大元素盒子（content-box 模式），背景色/图会延伸到内边距区域。',

    keywordGroups: [
      {
        label: 'padding 关键字（仅含 auto，实际很少用）',
        headers: ['关键字', '效果', '说明'],
        rows: [
          [
            '`auto`',
            '浏览器自动计算。⚠️ **`padding` 很少用 auto**，\n实际仅在某些布局情形（如 flex/grid 的 padding-inline）有意义',
            '通常写具体长度值；`auto` 不像 margin 那样有居中效果',
          ],
        ],
      },
    ],

    details: `### 简写语法（1/2/3/4 值，与 margin 完全相同）

| 写法 | 效果 |
| --- | --- |
| \`padding('16px')\` | 四边均为 16px |
| \`padding('8px 16px')\` | 上下 8px，左右 16px |
| \`padding('4px 8px 12px')\` | 上 4px，左右 8px，下 12px |
| \`padding('4px 8px 12px 16px')\` | 上 4px，右 8px，下 12px，左 16px（顺时针） |

### ⚠️ padding 不接受负值

\`padding\` 不同于 \`margin\`，**不接受负值**。负 padding 无效，会被浏览器忽略。

### 背景延伸到 padding 区域

默认 \`background-clip: border-box\`，背景色/图会填充 padding 区域（直到边框）。
改为 \`background-clip: content-box\` 可让背景只覆盖内容区。

### 百分比参照

\`padding: 25%\` 参照**父元素宽度**（即使是 paddingTop / paddingBottom 也参照宽，同 margin）。
这一点常被误解 —— 常用于实现"固定比例"盒子（如 16:9 视频容器）：

\`\`\`ts
s.paddingTop('56.25%')   // = 16:9 比例（9/16 = 56.25%）
// 配合子元素 position:absolute 实现固定宽高比容器
\`\`\`

${lengthUnitsSnippet('padding')}`,

    syntax: [
      ...LENGTH_SYNTAX_ROWS,
      ['多值简写', "`'8px 16px'` `'4px 8px 12px 16px'`", '1/2/3/4 个值，顺时针分配'],
    ],
    initialValue: '0',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // paddingTop / paddingRight / paddingBottom / paddingLeft / paddingBlock / paddingInline
  // ════════════════════════════════════════════════════════════════════
  paddingTop: {
    extends: 'padding',
    firstLine:
      '设置元素的**上内边距**。⚠️ 百分比参照**父容器宽度**（非高度），常用于实现固定宽高比容器。其他规则同 [`padding`]。',
  },
  paddingRight: {
    extends: 'padding',
    firstLine: '设置元素的**右内边距**。其他规则同 [`padding`]。',
  },
  paddingBottom: {
    extends: 'padding',
    firstLine:
      '设置元素的**下内边距**。⚠️ 百分比参照**父容器宽度**（非高度）。其他规则同 [`padding`]。',
  },
  paddingLeft: {
    extends: 'padding',
    firstLine: '设置元素的**左内边距**。其他规则同 [`padding`]。',
  },
  paddingBlock: {
    extends: 'padding',
    firstLine:
      '**逻辑属性**：同时设置元素块轴两端的内边距。水平书写模式下等同 `paddingTop + paddingBottom`。其他规则同 [`padding`]。',
  },
  paddingInline: {
    extends: 'padding',
    firstLine:
      '**逻辑属性**：同时设置元素行轴两端的内边距。水平书写模式下等同 `paddingLeft + paddingRight`。其他规则同 [`padding`]。',
  },

  // ════════════════════════════════════════════════════════════════════
  // inset —— 详细，四方位简写 + 仅在 position 非 static 时生效
  // ════════════════════════════════════════════════════════════════════
  inset: {
    firstLine:
      '**定位偏移简写**：同时设置 `top` / `right` / `bottom` / `left` 四个偏移值。**只在 `position` 非 `static` 时生效**。',

    keywordGroups: [
      {
        label: '1 个偏移关键字',
        headers: ['关键字', '效果', '说明'],
        rows: [
          [
            '`auto`',
            '**默认值**。不参与定位，交由浏览器按正常文档流决定位置',
            '未定位元素（`position: static`）的默认状态；也用于取消之前设过的偏移',
          ],
        ],
      },
    ],

    details: `### ⚠️ 必须配合 position: relative/absolute/fixed/sticky 才生效

\`top\` / \`right\` / \`bottom\` / \`left\`（以及 \`inset\`）对 \`position: static\`（默认值）的元素**无效**。

### 简写语法（与 margin/padding 相同的 1/2/3/4 值规则）

\`\`\`ts
s.inset.px(0)                     // 四边均偏移 0（常用于绝对定位充满父容器）
s.inset('0 16px')                 // 上下 0，左右 16px
s.inset('8px 16px 24px 32px')     // 上 右 下 左（顺时针）
\`\`\`

### 偏移基准（四种定位各不同）

| position | 偏移基准 |
| --- | --- |
| \`relative\` | **元素原始位置**（偏移后原位仍占空间） |
| \`absolute\` | **最近的定位祖先**（position 非 static 的祖先）的 padding-box 边缘 |
| \`fixed\` | **视口**（viewport）边缘（⚠️ 祖先有 \`transform\` / \`will-change: transform\` / \`filter\` 时变为祖先 padding-box） |
| \`sticky\` | 正常文档流位置（偏移值 = 粘住后距视口边缘的距离） |

### 绝对定位充满父容器

\`\`\`ts
s.position.absolute
s.inset.px(0)   // 等同 top:0 right:0 bottom:0 left:0
// 前提：父容器 position 不是 static
\`\`\`

${lengthUnitsSnippet('inset')}`,

    syntax: [
      ...LENGTH_SYNTAX_ROWS,
      ['`auto`', '—', '**默认值**；不偏移，由文档流决定位置'],
      ['多值简写', "`'0 16px'` `'8px 16px 24px 32px'`", '1/2/3/4 个值，顺时针分配到四边'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // top / right / bottom / left
  // ════════════════════════════════════════════════════════════════════
  top: {
    extends: 'inset',
    firstLine:
      '设置定位元素距**顶部**的偏移量。正值向下移，负值向上移。**只在 `position` 非 `static` 时生效**。其他规则同 [`inset`]。',
  },
  right: {
    extends: 'inset',
    firstLine:
      '设置定位元素距**右侧**的偏移量。正值向左移（向内缩），负值向右溢出。**只在 `position` 非 `static` 时生效**。其他规则同 [`inset`]。',
  },
  bottom: {
    extends: 'inset',
    firstLine:
      '设置定位元素距**底部**的偏移量。正值向上移，负值向下移。**只在 `position` 非 `static` 时生效**。其他规则同 [`inset`]。',
  },
  left: {
    extends: 'inset',
    firstLine:
      '设置定位元素距**左侧**的偏移量。正值向右移，负值向左溢出。**只在 `position` 非 `static` 时生效**。其他规则同 [`inset`]。',
  },

  // ════════════════════════════════════════════════════════════════════
  // aspectRatio
  // ════════════════════════════════════════════════════════════════════
  aspectRatio: {
    firstLine:
      '设置元素的**宽高比**。只设了宽度时浏览器按比例自动算高度（反之亦然），无需手动维护两者同步。',

    keywordGroups: [
      {
        label: '1 个关键字',
        headers: ['关键字', '效果'],
        rows: [
          [
            '`auto`',
            '**默认值**。不设宽高比，宽高各自独立（普通盒子的默认行为）。如果同时设了 `auto` 和一个比例（如 `auto 16 / 9`），替换内容（如 `<img>`）使用其内在比例，非替换内容使用指定比例',
          ],
        ],
      },
    ],

    details: `### 函数态可用形式

\`\`\`ts
s.aspectRatio('16 / 9')     // 16:9 横屏（视频、横幅常用）
s.aspectRatio('1 / 1')      // 1:1 正方形（头像、图标常用）
s.aspectRatio('4 / 3')      // 4:3 传统屏
s.aspectRatio('1.618')      // 黄金比例
s.aspectRatio('auto')       // 不设比例（默认）
\`\`\`

### 搭配 width 使用

设了 \`aspectRatio\` 后，只需设一个轴的尺寸，另一个轴自动计算：

\`\`\`ts
s.width('100%')
s.aspectRatio('16 / 9')
// 宽度撑满父容器，高度按 16:9 自动算出
\`\`\`

### 替代旧的 padding-top 技巧

旧写法（CSS 2 时代）：
\`\`\`ts
s.paddingTop('56.25%')   // 9/16 = 0.5625 = 56.25%（很难读）
\`\`\`
新写法（CSS 3，现代浏览器全支持）：
\`\`\`ts
s.aspectRatio('16 / 9')  // 清晰易读
\`\`\`

### 与 min/max-height 配合

\`aspect-ratio\` 指定的高度是**期望值**，仍受 \`min-height\` / \`max-height\` 约束：

\`\`\`ts
s.width('100%')
s.aspectRatio('16 / 9')
s.maxHeight('80vh')
// 宽 100% 时按 16:9 算高，但不超过视口高度 80%
\`\`\``,

    syntax: [
      ['`auto`', '—', '**默认值**；不设宽高比'],
      ['`<ratio>`', "`'16 / 9'` `'1 / 1'` `'4 / 3'`", '分子 / 分母（注意分隔符两侧有空格）'],
      ['`<number>`', "`'1.618'` `'1'`", '等同 `<number> / 1`'],
      ['`auto <ratio>`', "`'auto 16 / 9'`", '替换内容用内在比例，非替换内容用指定比例'],
    ],
    initialValue: 'auto',
    inherits: false,
    browserNote: 'Chrome 88+ / Firefox 89+ / Safari 15+ 全面支持（2021+）。旧浏览器需用 padding-top hack。',
  },
}

export default box
