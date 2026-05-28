/**
 * 滚动相关属性中文文档（scroll 分组）。
 *
 * 覆盖：scrollBehavior / scrollSnap* / scrollMargin* / scrollPadding* / overflowAnchor / resize
 */

import { lengthUnitsSnippet, type DocsGroup } from './_common'

const scroll: DocsGroup = {
  scrollBehavior: {
    firstLine: '设置滚动**是否平滑过渡** —— JS `scrollTo` / 锚点跳转时是瞬间跳过去还是平滑滚过去。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。瞬间跳转（无动画）'],
          ['`smooth`', '**平滑滚动**（自动缓动动画）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// 全站平滑滚动（给根元素或 body）
s.scrollBehavior.smooth

// 锚点跳转 <a href="#section"> 时自动平滑滚到目标
// JS: window.scrollTo({ top: 0, behavior: 'smooth' }) 也是另一种方式
\`\`\`

### a11y 注意

部分用户系统设了"减少动画"偏好（prefers-reduced-motion），应配合：

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * { scroll-behavior: auto !important; }
}
\`\`\``,
    syntax: [['2 个 keyword', '`auto` ｜ `smooth`', '只接受关键字']],
    initialValue: 'auto',
    inherits: false,
  },

  scrollSnapType: {
    firstLine:
      '在**滚动容器**上启用**滚动捕捉** —— 滚动结束时自动对齐到子元素。常用于卡片轮播、全屏滑动。',
    keywordGroups: [
      {
        label: '基础模式',
        headers: ['关键字', '行为'],
        rows: [
          ['`none`', '**默认值**。无滚动捕捉'],
          ['`x`', '横向轴启用捕捉'],
          ['`y`', '纵向轴启用捕捉'],
          ['`block`', '逻辑块方向（横排文 = y）'],
          ['`inline`', '逻辑行内方向（横排文 = x）'],
          ['`both`', '两轴都启用'],
        ],
      },
      {
        label: '严格程度',
        headers: ['关键字', '行为'],
        rows: [
          ['`mandatory`', '**强制对齐**：滚动结束**必须**对齐到某个子元素（即使滚动到中间）'],
          ['`proximity`', '**邻近时对齐**：仅当滚动结束接近某个 snap point 时才对齐（默认）'],
        ],
      },
    ],
    details: `### 函数态：方向 + 严格程度

\`\`\`ts
s.scrollSnapType('x mandatory')        // 横轴强制对齐
s.scrollSnapType('y proximity')        // 纵轴邻近对齐
s.scrollSnapType('both mandatory')     // 双轴
\`\`\`

### 完整轮播示例

\`\`\`ts
// 容器
s.scrollSnapType('x mandatory')
s.overflowX.auto
s.display.flex

// 每个 item
s.scrollSnapAlign.start              // 滚动停止时对齐到 item 起点
\`\`\``,
    syntax: [
      ['方向 keyword', '`none` ｜ `x` ｜ `y` ｜ `block` ｜ `inline` ｜ `both`', '只接受关键字'],
      ['严格程度', '`mandatory` ｜ `proximity`', '配合方向使用'],
      ['组合', "`'x mandatory'` `'y proximity'`", '方向 + 严格程度'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  scrollSnapAlign: {
    firstLine:
      '在**滚动项**（snap children）上设置**对齐点** —— 滚动停止时该 item 的哪一边对齐到容器边缘。',
    keywordGroups: [
      {
        label: '4 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`none`', '**默认值**。该 item 不参与 snap'],
          ['`start`', '对齐 item **起点**（左 / 上）到容器对应边缘'],
          ['`end`', '对齐 item **终点**（右 / 下）到容器对应边缘'],
          ['`center`', 'item **中心**对齐容器中心'],
        ],
      },
    ],
    syntax: [
      ['4 个 keyword', '`none` ｜ `start` ｜ `end` ｜ `center`', '只接受关键字'],
      ['两个值（块 / 行内）', "`'start end'`", '块方向 / 行内方向'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  scrollSnapStop: {
    firstLine: '决定滚动是否**必须停在每个 snap point**（不允许快速滑过多个）。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`normal`', '**默认值**。快速滚动可跳过多个 snap point'],
          ['`always`', '**必须停**在下一个 snap point（即使用户快速 fling，也只滚 1 个 item）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// 全屏 PPT 风滑动：每次只滑 1 屏
s.scrollSnapType('y mandatory')
s.scrollSnapStop.always
\`\`\``,
    syntax: [['2 个 keyword', '`normal` ｜ `always`', '只接受关键字']],
    initialValue: 'normal',
    inherits: false,
  },

  // ─── scrollMargin* ───
  scrollMargin: {
    firstLine:
      '设置 snap item **对齐时**距容器边缘的**外边距偏移**（简写，1/2/3/4 值，类似 `margin`）。让 snap 时留出呼吸空间。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [['只接受长度（可负），**无关键字**'], ['仅在元素是 snap item 时生效']],
      },
    ],
    details: `### 用例

\`\`\`ts
// 让 item 对齐时距容器左边缘留 20px 缓冲
s.scrollMargin.px(20)

// 简写四方位
s.scrollMargin('10px 20px')
\`\`\`

${lengthUnitsSnippet('scrollMargin')}`,
    syntax: [
      ['`<length>`', "`'20px'` `'1rem'`", '可正可负'],
      ['1/2/3/4 值', "`'10px 20px'`", '上 / 右 / 下 / 左'],
    ],
    initialValue: '0',
    inherits: false,
  },

  scrollMarginTop: {
    extends: 'scrollMargin',
    firstLine: 'snap 对齐时**上方**的外边距偏移。常用于锚点跳转时避开固定头部。',
    details: `### 用例：避开固定头部

\`\`\`ts
// 给锚点目标元素
s.scrollMarginTop.px(80)
// 锚点跳转后，元素位置往下 80px（让出固定头部空间）
\`\`\`

${lengthUnitsSnippet('scrollMarginTop')}`,
  },
  scrollMarginRight: {
    extends: 'scrollMargin',
    firstLine: 'snap 对齐时**右侧**的外边距偏移。',
  },
  scrollMarginBottom: {
    extends: 'scrollMargin',
    firstLine: 'snap 对齐时**下方**的外边距偏移。',
  },
  scrollMarginLeft: {
    extends: 'scrollMargin',
    firstLine: 'snap 对齐时**左侧**的外边距偏移。',
  },
  scrollMarginBlock: {
    extends: 'scrollMargin',
    firstLine: 'snap 对齐时**块方向**（横排 = 纵轴）的外边距偏移（简写，1 或 2 值）。',
  },
  scrollMarginInline: {
    extends: 'scrollMargin',
    firstLine: 'snap 对齐时**行内方向**（横排 = 横轴）的外边距偏移（简写）。',
  },

  // ─── scrollPadding* ───
  scrollPadding: {
    firstLine:
      '在**滚动容器**上设置**内边距偏移** —— 让 snap point 距容器边缘留出空间（如固定头部、侧栏）。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`auto`', '**默认值**。浏览器自动算（一般是 0）']],
      },
    ],
    details: `### 用例：固定头部 + snap

\`\`\`ts
// 容器上
s.scrollPaddingTop.px(80)           // snap 时为顶部固定头部留 80px
// snap 子项对齐时不会贴到容器顶部，而是顶部留出 80px
\`\`\`

${lengthUnitsSnippet('scrollPadding')}`,
    syntax: [
      ['`auto`', '—', '默认；浏览器自动'],
      ['`<length>`', "`'20px'`", '具体长度（不可负）'],
      ['`<percentage>`', "`'10%'`", '相对容器对应轴尺寸'],
      ['1/2/3/4 值', "`'10px 20px'`", '上 / 右 / 下 / 左'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  scrollPaddingTop: {
    extends: 'scrollPadding',
    firstLine: '滚动容器**顶部**的内边距偏移。最常用 —— 让出固定头部空间。',
  },
  scrollPaddingRight: { extends: 'scrollPadding', firstLine: '滚动容器**右侧**的内边距偏移。' },
  scrollPaddingBottom: { extends: 'scrollPadding', firstLine: '滚动容器**底部**的内边距偏移。' },
  scrollPaddingLeft: { extends: 'scrollPadding', firstLine: '滚动容器**左侧**的内边距偏移。' },
  scrollPaddingBlock: {
    extends: 'scrollPadding',
    firstLine: '滚动容器**块方向**（横排 = 纵轴）的内边距偏移（简写）。',
  },
  scrollPaddingInline: {
    extends: 'scrollPadding',
    firstLine: '滚动容器**行内方向**（横排 = 横轴）的内边距偏移（简写）。',
  },

  overflowAnchor: {
    firstLine:
      '控制**滚动锚定**（scroll anchoring）—— 防止页面顶部加载新内容时**当前可视区跳动**。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          [
            '`auto`',
            '**默认值**。启用滚动锚定（浏览器自动记住当前可视位置，新内容插入上方时保持视图稳定）',
          ],
          ['`none`', '禁用（用于动画中的元素，避免锚定行为干扰）'],
        ],
      },
    ],
    details: `### 用例

社交媒体 feed 加载新内容时，浏览器自动锚定让你不会被"推走"位置。

\`\`\`ts
// 默认启用，无需写代码

// 对动画元素禁用（避免锚定算法错误"锚住"动画中的元素）
s.overflowAnchor.none
\`\`\``,
    syntax: [['2 个 keyword', '`auto` ｜ `none`', '只接受关键字']],
    initialValue: 'auto',
    inherits: false,
  },

  resize: {
    firstLine: '允许用户**手动调整元素尺寸**（拖右下角）。最常用于 `<textarea>` 让用户拖动改大小。',
    keywordGroups: [
      {
        label: '6 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`none`', '**默认值**。不可调整'],
          ['`both`', '可同时调整宽和高'],
          ['`horizontal`', '仅可调整**宽度**'],
          ['`vertical`', '仅可调整**高度**'],
          ['`block`', '逻辑：块方向（横排 = 高度）'],
          ['`inline`', '逻辑：行内方向（横排 = 宽度）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// textarea 仅允许调高度（避免破坏布局）
s.resize.vertical

// 禁用 textarea 默认的调整功能
s.resize.none
\`\`\`

### 生效前提

\`resize\` 需要元素是 \`overflow\` 非 \`visible\`（默认 \`<textarea>\` 满足，其他元素需 \`overflow: auto/hidden/scroll\`）。`,
    syntax: [
      [
        '6 个 keyword',
        '`none` ｜ `both` ｜ `horizontal` ｜ `vertical` ｜ `block` ｜ `inline`',
        '只接受关键字',
      ],
    ],
    initialValue: 'none',
    inherits: false,
  },
}

export default scroll
