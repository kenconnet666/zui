/**
 * 杂项属性中文文档（misc 分组）。
 *
 * 覆盖：zIndex / opacity / aspectRatio / objectFit / objectPosition / colorScheme /
 *   columns* / breakBefore / breakAfter / breakInside / boxDecorationBreak / anchorName / positionAnchor /
 *   content / counterReset / counterIncrement / counterSet
 */

import { lengthUnitsSnippet, type DocsGroup } from './_common'

const misc: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // zIndex
  // ════════════════════════════════════════════════════════════════════
  zIndex: {
    firstLine:
      '控制元素的**层叠顺序**（z 轴前后）。数值越大越靠前。**仅对 `position` 非 `static` 的元素生效**。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`auto`', '**默认值**。不创建新层叠上下文，按 DOM 顺序堆叠']],
      },
    ],
    details: `### 用例

\`\`\`ts
s.position.relative
s.zIndex(10)     // 浮起到第 10 层
s.position.fixed
s.zIndex(9999)      // Modal 最顶层（zui token：s.zIndex._modal）
\`\`\`

### 层叠上下文（stacking context）

某些属性会创建新的层叠上下文（隔离子元素的 z-index 与外部）：

- \`position\` 非 \`static\` + \`zIndex\` 非 \`auto\`
- \`opacity < 1\`
- \`transform\` / \`filter\` / \`will-change\`（非 auto）
- \`isolation: isolate\`
- \`mixBlendMode\` 非 normal

子元素的 z-index **在新上下文内独立**计算 —— 外部 z-index: 9999 也可能被一个 opacity 0.99 的父元素"包住"。

### 主题 token

\`\`\`ts
s.zIndex._modal      // 例如 1000
s.zIndex._tooltip    // 例如 2000
\`\`\``,
    syntax: [
      ['`<integer>`', '`0` `10` `-1` `9999`', '可正可负整数'],
      ['`auto`', '—', '不参与层叠（默认）'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // opacity
  // ════════════════════════════════════════════════════════════════════
  opacity: {
    firstLine:
      '设置元素的**整体透明度**（0 完全透明 → 1 完全不透明）。影响整个元素**包括子元素**。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [
          ['只接受 0-1 数字（或 0%-100% 百分比），**无关键字**（除全局关键字）'],
          ['默认值 = `1`（完全不透明）'],
          ['影响子元素 —— 与 `rgba/hsla` 的 alpha 不同（后者只影响该属性的颜色）'],
        ],
      },
    ],
    details: `### opacity vs alpha

| 写法 | 影响范围 |
| --- | --- |
| \`opacity: 0.5\` | **整个元素 + 子元素**都半透明 |
| \`background-color: rgba(0,0,0,0.5)\` | **只**该属性的颜色半透明 |
| \`color: rgba(0,0,0,0.5)\` | **只**文字颜色半透明 |

子元素需要不同透明度时，**避免用 opacity** —— 给具体属性 alpha 更精细。

### 副作用：创建层叠上下文

\`opacity < 1\` 会创建新的层叠上下文，这是 fixed 子元素相对祖先错乱的常见原因。

### token 写法

\`\`\`ts
s.opacity._disabled       // 例如 0.5
\`\`\``,
    syntax: [
      ['`<number>`', '`0` `0.5` `1`', '0-1 范围（可超出但被截断）'],
      ['`<percentage>`', '`50%` `100%`', '相当于 0-1 数字'],
    ],
    initialValue: '1',
    inherits: false,
  },

  // aspectRatio 在 box 分组（与 width/height 同组）

  // ════════════════════════════════════════════════════════════════════
  // objectFit
  // ════════════════════════════════════════════════════════════════════
  objectFit: {
    firstLine:
      '决定**替换元素**（`<img>` / `<video>`）的内容如何**适应容器**（拉伸 / 包含 / 覆盖等）。',
    keywordGroups: [
      {
        label: '5 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`fill`', '**默认值**。**拉伸填满**容器（会变形）'],
          ['`contain`', '**等比缩放完整显示**（不裁剪，可能留空白）—— 整图展示首选'],
          ['`cover`', '**等比缩放铺满**（可能裁剪溢出部分）—— 头像 / 封面首选'],
          ['`none`', '**不缩放**（原始尺寸，可能溢出或留空）'],
          ['`scaleDown`', '`contain` 和 `none` 中较小的（不放大，仅缩小）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// 头像（裁剪铺满）
s.width.px(80)
s.height.px(80)
s.objectFit.cover

// 商品图（完整显示）
s.objectFit.contain
s.backgroundColor._neutral100      // 留白处用浅灰
\`\`\``,
    syntax: [
      ['5 个 keyword', '`fill` ｜ `contain` ｜ `cover` ｜ `none` ｜ `scaleDown`', '只接受关键字'],
    ],
    initialValue: 'fill',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // objectPosition
  // ════════════════════════════════════════════════════════════════════
  objectPosition: {
    firstLine:
      '决定**替换元素**（`<img>` / `<video>`）内容**在容器中的位置**（配合 `objectFit: cover/contain` 使用）。',
    keywordGroups: [
      {
        label: '5 个位置关键字',
        headers: ['关键字', '行为'],
        rows: [
          ['`top`', '顶部对齐'],
          ['`bottom`', '底部对齐'],
          ['`left`', '左侧对齐'],
          ['`right`', '右侧对齐'],
          ['`center`', '**默认值**。居中'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// cover 模式下，让头像聚焦在人脸（顶部）
s.objectFit.cover
s.objectPosition.top

// 精确控制
s.objectPosition('25% 75%')           // 横向 25%，纵向 75%
\`\`\`

${lengthUnitsSnippet('objectPosition')}`,
    syntax: [
      ['关键字', '`top` `bottom` `left` `right` `center`', '5 个位置'],
      ['`<length>` / `<percentage>`', "`'25% 75%'` `'10px 20px'`", 'X / Y'],
    ],
    initialValue: '50% 50%',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // colorScheme
  // ════════════════════════════════════════════════════════════════════
  colorScheme: {
    firstLine:
      '告诉浏览器元素支持**哪种配色模式**（light / dark） —— 让原生表单 / 滚动条 / 系统色等自动适配。',
    keywordGroups: [
      {
        label: '5 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`normal`', '**默认值**。无明确偏好，浏览器使用 light'],
          ['`light`', '仅支持浅色（强制浅色 UI）'],
          ['`dark`', '仅支持深色（强制深色 UI）'],
          ['`lightDark`', '**两种都支持**（让浏览器根据用户系统主题自动切换）'],
          [
            '`only`',
            '关键字修饰符：`only light` 表示严格只支持 light（关闭浏览器自动 dark mode）',
          ],
        ],
      },
    ],
    details: `### 用例

\`\`\`html
<html style="color-scheme: light dark">
<!-- 浏览器原生 <input> / <select> / 滚动条都会跟随系统主题切换 -->
\`\`\`

\`\`\`ts
s.colorScheme.lightDark              // 推荐：跟随系统
s.colorScheme.light                  // 强制浅色
s.colorScheme('only light')          // 严格浅色，禁用浏览器自动 dark
\`\`\``,
    syntax: [
      ['5 个 keyword', '`normal` ｜ `light` ｜ `dark` ｜ `lightDark` ｜ `only`', '只接受关键字'],
      ['组合', "`'light dark'` `'only light'`", '空格分隔'],
    ],
    initialValue: 'normal',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // columns (多栏)
  // ════════════════════════════════════════════════════════════════════
  columns: {
    firstLine:
      '把元素内容**分成多栏**（类似报纸 / 杂志排版）。可指定栏数或栏宽。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`auto`', '**默认值**。浏览器自动算（按 column-width 决定，或不分栏）']],
      },
    ],
    details: `### 函数态

\`\`\`ts
s.columns(3)                  // 3 栏（自动调整栏宽）
s.columns('300px')            // 每栏 300px（栏数自动）
s.columns('3 300px')          // 最多 3 栏，每栏不少于 300px
\`\`\`

### 用例

\`\`\`ts
s.columns('250px')
  .columnGap.px(24)
// 类似 Pinterest 风格的多栏内容
\`\`\``,
    syntax: [
      ['栏数', '`3` `4`', '整数（栏数）'],
      ['栏宽', "`'300px'` `'20em'`", '每栏理想宽度'],
      ['两值组合', "`'3 300px'`", '栏数 + 栏宽'],
      ['`auto`', '—', '默认'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  columnCount: {
    firstLine:
      '指定**栏数**（多栏布局的简单方式）。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`auto`', '**默认值**。按 column-width 决定']],
      },
    ],
    syntax: [
      ['`<integer>`', '`2` `3` `4`', '栏数'],
      ['`auto`', '—', '自动'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  columnWidth: {
    firstLine:
      '指定**每栏的理想宽度**（栏数由容器宽度自动算）。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`auto`', '**默认值**']],
      },
    ],
    details: `### 用例

\`\`\`ts
s.columnWidth.px(250)
// 容器 800px → 3 栏（800/250 = 3.2，向下取整）
// 容器 600px → 2 栏
\`\`\`

${lengthUnitsSnippet('columnWidth')}`,
    syntax: [
      ['`<length>`', "`'250px'` `'20em'`", '理想宽度'],
      ['`auto`', '—', '自动'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  columnSpan: {
    firstLine:
      '让元素**跨越所有栏**（多栏内容中的标题 / 横幅常用）。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`none`', '**默认值**。不跨栏（正常分栏）'],
          ['`all`', '**横跨所有栏**（撑满容器宽度）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// 多栏内容里的章节标题
s.columnSpan.all          // 跨栏显示
\`\`\``,
    syntax: [['2 个 keyword', '`none` ｜ `all`', '只接受关键字']],
    initialValue: 'none',
    inherits: false,
  },

  columnFill: {
    firstLine:
      '决定多栏内容如何**填充各栏** —— 平衡（每栏内容等高）还是顺序填充（先填满第一栏再换下一栏）。',
    keywordGroups: [
      {
        label: '3 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          [
            '`balance`',
            '**默认值**。**平衡填充** —— 内容均分到各栏让每栏内容高度接近（最常用）',
          ],
          ['`auto`', '**顺序填充** —— 先填满前一栏再填下一栏'],
          [
            '`balanceAll`',
            '所有 column-break 区域都平衡（不只是最后一段）',
          ],
        ],
      },
    ],
    syntax: [
      ['3 个 keyword', '`balance` ｜ `auto` ｜ `balanceAll`', '只接受关键字'],
    ],
    initialValue: 'balance',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // breakBefore / breakAfter / breakInside
  // ════════════════════════════════════════════════════════════════════
  breakBefore: {
    firstLine:
      '控制元素**前**是否**强制分页 / 分栏 / 分区域**（打印分页 / 多栏布局换栏）。',
    keywordGroups: [
      {
        label: '通用',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。浏览器自动决定'],
          ['`avoid`', '尽量**避免**在元素前分页/分栏'],
          ['`always`', '**强制在元素前**分页/分栏'],
          ['`all`', '强制分所有可能的边界（分页 + 分栏 + 区域）'],
        ],
      },
      {
        label: '分页专属',
        headers: ['关键字', '行为'],
        rows: [
          ['`avoidPage`', '尽量避免**分页**'],
          ['`page`', '强制分页'],
          ['`left`', '强制分页且下一页是**左页**（书籍排版用）'],
          ['`right`', '强制分页且下一页是**右页**'],
          ['`recto`', '逻辑右页（西方书 = right，阿拉伯书 = left）'],
          ['`verso`', '逻辑左页'],
        ],
      },
      {
        label: '分栏专属',
        headers: ['关键字', '行为'],
        rows: [
          ['`avoidColumn`', '尽量避免分栏'],
          ['`column`', '强制分栏'],
        ],
      },
      {
        label: '区域专属（CSS Regions）',
        headers: ['关键字', '行为'],
        rows: [
          ['`avoidRegion`', '尽量避免分区域'],
          ['`region`', '强制分区域'],
        ],
      },
    ],
    details: `### 用例：打印

\`\`\`ts
// 每个 <h1> 前都强制分页
s.breakBefore.page

// 表格行尽量不在分页处断开
s.breakInside.avoid
\`\`\``,
    syntax: [
      ['通用', '`auto` ｜ `avoid` ｜ `always` ｜ `all`', ''],
      ['分页', '`avoidPage` ｜ `page` ｜ `left` ｜ `right` ｜ `recto` ｜ `verso`', ''],
      ['分栏', '`avoidColumn` ｜ `column`', ''],
      ['区域', '`avoidRegion` ｜ `region`', ''],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  breakAfter: {
    extends: 'breakBefore',
    firstLine: '控制元素**后**是否强制分页 / 分栏。规则同 `breakBefore`。',
  },

  breakInside: {
    firstLine:
      '控制元素**内部**是否允许分页 / 分栏。常用于让卡片 / 表格行**不被打印分页拆断**。',
    keywordGroups: [
      {
        label: '5 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。浏览器自动决定（可能拆断）'],
          ['`avoid`', '**尽量避免在内部**分页 / 分栏 / 分区域（最常用）'],
          ['`avoidPage`', '尽量避免**分页**（仅打印）'],
          ['`avoidColumn`', '尽量避免**分栏**'],
          ['`avoidRegion`', '尽量避免分区域'],
        ],
      },
    ],
    syntax: [
      ['5 个 keyword', '`auto` ｜ `avoid` ｜ `avoidPage` ｜ `avoidColumn` ｜ `avoidRegion`', '只接受关键字'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // boxDecorationBreak
  // ════════════════════════════════════════════════════════════════════
  boxDecorationBreak: {
    firstLine:
      '决定**跨行 / 跨栏 / 跨页**元素的**装饰**（border / padding / background / box-shadow）如何处理 —— 整体计算还是每片单独计算。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          [
            '`slice`',
            '**默认值**。装饰被**切断**：跨行元素第一段有起始边框，最后一段有结束边框，中间无两端装饰',
          ],
          [
            '`clone`',
            '装饰**每段独立**：每段都完整应用装饰（如每行都有完整 border）',
          ],
        ],
      },
    ],
    details: `### 用例：多行文字高亮

\`\`\`html
<span class="highlight">这是一段很长的文字会换行<br/>第二行</span>
\`\`\`

\`\`\`ts
// slice（默认）：第一行只有左圆角，最后一行只有右圆角
// clone：每行都有完整左右圆角
s.padding.px(4)
s.backgroundColor._yellow200
s.borderRadius.px(4)
s.boxDecorationBreak.clone
\`\`\``,
    syntax: [['2 个 keyword', '`slice` ｜ `clone`', '只接受关键字']],
    initialValue: 'slice',
    inherits: false,
    browserNote: 'Safari/iOS 需 `-webkit-box-decoration-break` 前缀。',
  },

  // ════════════════════════════════════════════════════════════════════
  // anchorName / positionAnchor （CSS Anchor Positioning，实验性）
  // ════════════════════════════════════════════════════════════════════
  anchorName: {
    firstLine:
      '给元素**命名为锚点** —— 让其他绝对定位的元素可以**相对此锚点定位**（CSS Anchor Positioning，实验性）。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。不作为锚点']],
      },
    ],
    details: `### 用例：tooltip 跟随按钮

\`\`\`ts
// 按钮（锚点）
s.anchorName('--my-btn')

// tooltip（被锚定，绝对定位）
s.positionAnchor('--my-btn')
  .position.absolute.top('anchor(bottom)')        // 锚点底部
\`\`\`

⚠️ **实验性**：仅 Chrome 125+ 支持。其他浏览器需 JS / popper 方案兜底。`,
    syntax: [
      ['`<dashed-ident>`', "`'--my-anchor'`", '必须以 `--` 开头的标识符'],
      ['`none`', '—', '默认'],
    ],
    initialValue: 'none',
    inherits: false,
    browserNote: 'CSS Anchor Positioning（实验性），Chrome 125+。',
  },

  positionAnchor: {
    firstLine:
      '绑定到一个已命名的**锚点元素**，让自己相对该锚点定位（CSS Anchor Positioning，实验性）。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`auto`', '**默认值**。隐式锚点（如有）']],
      },
    ],
    syntax: [
      ['`<dashed-ident>`', "`'--my-anchor'`", '引用 anchorName 设置的名称'],
      ['`auto`', '—', '默认'],
    ],
    initialValue: 'auto',
    inherits: false,
    browserNote: 'CSS Anchor Positioning（实验性），Chrome 125+。',
  },

  // ════════════════════════════════════════════════════════════════════
  // content / counter*
  // ════════════════════════════════════════════════════════════════════
  content: {
    firstLine:
      '在 `::before` / `::after` 伪元素中**插入内容**（文字 / 图片 / counter 数值 / attr）。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`none`', '**默认值**（普通元素上）。不生成内容'],
          ['`normal`', '伪元素默认值（等同 `none` 在 ::before / ::after 上）'],
        ],
      },
    ],
    details: `### 函数态：常见值

\`\`\`ts
// 字符串
s.content("'★'")                      // 引号必须

// 引用 attr
s.content("attr(data-tip)")           // 显示元素的 data-tip 属性值

// counter
s.content("counter(section)")         // 当前 section 计数器值

// 图片
s.content("url('/icons/check.svg')")

// 多个组合
s.content("counter(item) '. '")
\`\`\`

### 用例：清浮动 hack（旧）

\`\`\`ts
// ::after
s.content("''")
s.display.block
s.clear.both
\`\`\`

### 现代替代

\`display: flow-root\` 已取代清浮动 hack；\`content\` 现在主要用于**伪元素装饰内容**。`,
    syntax: [
      ['`none`', '—', '不生成'],
      ['`normal`', '—', '伪元素默认'],
      ['字符串', "`\"'★'\"`", '内嵌单引号'],
      ['`attr()`', "`'attr(data-x)'`", '引用属性值'],
      ['`counter()`', "`'counter(section)'`", 'CSS 计数器'],
      ['URL', "`\"url('/icon.svg')\"`", '图片'],
      ['组合', "`\"counter(item) '. '\"`", '空格连接多个值'],
    ],
    initialValue: 'normal',
    inherits: false,
  },

  counterReset: {
    firstLine:
      '**重置 CSS 计数器**到指定值（默认 0）。配合 `content: counter(...)` 实现自定义编号。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。不重置任何计数器']],
      },
    ],
    details: `### 用例：章节编号

\`\`\`ts
// 在容器上重置 chapter
s.counterReset('chapter')

// 每个 <h2> 上递增并显示
// h2: s.counterIncrement('chapter')
// h2::before: s.content("'第 ' counter(chapter) ' 章 '")
\`\`\``,
    syntax: [
      ['`none`', '—', '默认'],
      ['名称', "`'chapter'`", '重置为 0'],
      ['名称 + 数字', "`'chapter 5'`", '重置为指定值'],
      ['多个计数器', "`'chapter section 0'`", '空格分隔'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  counterIncrement: {
    firstLine:
      '**递增 CSS 计数器**（每遇到该元素时计数器 +1，或自定义增量）。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。不递增']],
      },
    ],
    syntax: [
      ['`none`', '—', '默认'],
      ['名称', "`'chapter'`", '递增 1'],
      ['名称 + 数字', "`'chapter 2'`", '递增指定值（可负 = 递减）'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  counterSet: {
    firstLine:
      '**设置 CSS 计数器**到指定值（不依赖前值）。与 `counterReset` 类似但语义更强：明确设置而非"重置"。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。不设置']],
      },
    ],
    syntax: [
      ['`none`', '—', '默认'],
      ['名称 + 数字', "`'chapter 5'`", '设为指定值'],
    ],
    initialValue: 'none',
    inherits: false,
  },
}

export default misc
