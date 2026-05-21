/**
 * 交互相关属性中文文档（interaction 分组）。
 *
 * 覆盖：cursor / userSelect / pointerEvents / touchAction / appearance / willChange /
 *   fieldSizing / interpolateSize
 */

import type { DocsGroup } from './_common'

const interaction: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // cursor
  // ════════════════════════════════════════════════════════════════════
  cursor: {
    firstLine:
      '设置元素**鼠标指针**的样式 —— 箭头 / 手型 / 文字光标 / 等待 / 拖动 / 调整方向等。',
    keywordGroups: [
      {
        label: '通用 / 自动',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。浏览器按上下文自动选（可点击元素 → pointer，文字 → text 等）'],
          ['`default`', '操作系统默认指针（箭头 ↖）'],
          ['`none`', '隐藏指针'],
        ],
      },
      {
        label: '交互类（最常用）',
        headers: ['关键字', '行为'],
        rows: [
          ['`pointer`', '**手型**（表示可点击 —— 链接、按钮）'],
          ['`text`', '文字光标 I 字（表示文本可选）'],
          ['`verticalText`', '垂直文字光标（竖排文本）'],
          ['`wait`', '沙漏 / 转圈（等待）'],
          ['`progress`', '箭头 + 沙漏（操作中但仍可交互）'],
          ['`help`', '问号 ?（hover 显示帮助）'],
          ['`contextMenu`', '右键菜单图标'],
          ['`cell`', '十字形（表格单元选择，如 Excel）'],
          ['`crosshair`', '十字线（精确选择，画图工具）'],
        ],
      },
      {
        label: '拖放类',
        headers: ['关键字', '行为'],
        rows: [
          ['`move`', '十字双箭头（可移动）'],
          ['`grab`', '手掌张开（可抓取）'],
          ['`grabbing`', '手掌握紧（抓取中）'],
          ['`alias`', '快捷方式箭头'],
          ['`copy`', '加号（复制）'],
          ['`notAllowed`', '禁止符号 🚫'],
          ['`noDrop`', '禁止符号（不允许放下）'],
        ],
      },
      {
        label: '缩放类',
        headers: ['关键字', '行为'],
        rows: [
          ['`allScroll`', '四向箭头（可朝任意方向滚动）'],
          ['`zoomIn`', '放大镜 +（可放大）'],
          ['`zoomOut`', '放大镜 -（可缩小）'],
        ],
      },
      {
        label: '调整大小（resize）',
        headers: ['关键字', '行为'],
        rows: [
          ['`colResize`', '左右双箭头（调整列宽）'],
          ['`rowResize`', '上下双箭头（调整行高）'],
          ['`eResize` / `wResize`', '左右单向（东 / 西方向调整）'],
          ['`nResize` / `sResize`', '上下单向（北 / 南方向调整）'],
          ['`neResize` `nwResize` `seResize` `swResize`', '4 个对角线方向（东北 / 西北 / 东南 / 西南）'],
          ['`ewResize` / `nsResize`', '横 / 纵双向调整'],
          ['`neswResize` / `nwseResize`', '对角线双向调整'],
        ],
      },
    ],
    details: `### 自定义图片光标

\`\`\`ts
s.cursor("url('/cursors/sword.png'), pointer")     // 自定义 + 兜底关键字
s.cursor("url('/sword.png') 16 16, pointer")       // 带热点坐标（图片中心点偏移）
\`\`\`

### 限制

- 自定义图片需 ≤ 128×128 像素（多数浏览器）
- 必须**带兜底关键字**（如上例的 \`pointer\`），否则浏览器加载失败时无指针
- iOS Safari **完全忽略 cursor**（触摸设备无指针概念）`,
    syntax: [
      ['通用', '`auto` ｜ `default` ｜ `none`', '基础'],
      ['交互', '`pointer` ｜ `text` ｜ `wait` ｜ `progress` ｜ `help` ｜ `contextMenu` ｜ `cell` ｜ `crosshair` ｜ `verticalText`', '最常用'],
      ['拖放', '`move` ｜ `grab` ｜ `grabbing` ｜ `alias` ｜ `copy` ｜ `notAllowed` ｜ `noDrop`', '拖放交互'],
      ['缩放', '`allScroll` ｜ `zoomIn` ｜ `zoomOut`', ''],
      ['调整大小', '`colResize` ｜ `rowResize` ｜ `eResize` ｜ `wResize` ｜ `nResize` ｜ `sResize` ｜ `neResize` ｜ `nwResize` ｜ `seResize` ｜ `swResize` ｜ `ewResize` ｜ `nsResize` ｜ `neswResize` ｜ `nwseResize`', '8 方向 + 4 双向'],
      ['自定义图片', "`\"url('/cursor.png'), pointer\"`", 'URL + 兜底关键字（必须）'],
      ['图片 + 热点', "`\"url('/c.png') 16 16, pointer\"`", '坐标为图片热点位置'],
    ],
    initialValue: 'auto',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // userSelect
  // ════════════════════════════════════════════════════════════════════
  userSelect: {
    firstLine:
      '控制文本是否**可被用户选中**（鼠标拖选、键盘 Ctrl+A 等）。',
    keywordGroups: [
      {
        label: '5 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。文本可选'],
          ['`none`', '**禁止选中**（按钮、UI 控件常用，防止误选）'],
          ['`text`', '强制可选（覆盖父级 `none`）'],
          ['`all`', '点击即**全选**（如代码块）'],
          ['`contain`', '允许选中但限制范围在当前元素内（不会延伸到父/兄弟）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// 按钮 / 标签 / 拖拽手柄：禁止选中
s.userSelect.none

// 代码片段：点击全选
s.userSelect.all
\`\`\`

### a11y 注意

\`userSelect: none\` 会让屏幕阅读器和键盘用户无法选中文本 —— **正文内容不要禁用**，仅 UI 控件用。`,
    syntax: [
      ['5 个 keyword', '`auto` ｜ `none` ｜ `text` ｜ `all` ｜ `contain`', '只接受关键字'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // pointerEvents
  // ════════════════════════════════════════════════════════════════════
  pointerEvents: {
    firstLine:
      '控制元素**是否响应鼠标 / 触摸事件**（点击、hover、拖动）。`none` 让元素**事件穿透**到下方。',
    keywordGroups: [
      {
        label: '通用',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。响应所有事件'],
          ['`none`', '**事件穿透** —— 元素不响应任何事件，事件直接传给下方元素（覆盖层 / 装饰元素常用）'],
        ],
      },
      {
        label: 'SVG 专属（仅在 SVG 元素生效）',
        headers: ['关键字', '行为'],
        rows: [
          ['`visiblePainted`', '仅可见且有 fill / stroke 的区域响应（SVG 默认）'],
          ['`visibleFill`', '仅可见且有 fill 的区域响应'],
          ['`visibleStroke`', '仅可见且有 stroke 的区域响应'],
          ['`visible`', '所有可见区域都响应（包括 fill: none 的填充区）'],
          ['`painted`', '所有有 fill / stroke 的区域响应（不管可见性）'],
          ['`fill`', '所有有 fill 的区域响应'],
          ['`stroke`', '所有有 stroke 的区域响应'],
          ['`all`', '所有区域都响应（包括透明）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// 让 disabled 按钮不响应点击
s.pointerEvents.none.opacity(0.5)

// 装饰性遮罩不阻挡下层交互
s.position.absolute.inset(0).pointerEvents.none

// 仅让按钮内的图标透传点击到按钮本身
// icon: s.pointerEvents.none
\`\`\`

### 注意

- \`pointerEvents: none\` 不会改变**屏幕阅读器** —— 仍可访问。需配合 \`aria-hidden\` 才彻底"消失"
- 仍会响应键盘 focus（仅鼠标 / 触摸事件被禁）`,
    syntax: [
      ['通用', '`auto` ｜ `none`', '最常用'],
      [
        'SVG 专属',
        '`visiblePainted` ｜ `visibleFill` ｜ `visibleStroke` ｜ `visible` ｜ `painted` ｜ `fill` ｜ `stroke` ｜ `all`',
        '仅 SVG 元素生效',
      ],
    ],
    initialValue: 'auto',
    inherits: true,
  },

  // ════════════════════════════════════════════════════════════════════
  // touchAction
  // ════════════════════════════════════════════════════════════════════
  touchAction: {
    firstLine:
      '决定**触摸操作**（移动端）哪些动作由浏览器默认处理（滚动 / 缩放）、哪些被 JS 接管。常用于绘图 / 拖拽组件禁用浏览器手势。',
    keywordGroups: [
      {
        label: '10 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。浏览器接管所有手势（双指缩放 / 滑动滚动等）'],
          ['`none`', '**禁用所有触摸手势** —— 所有触摸事件由 JS 处理（绘图板必备）'],
          ['`panX`', '仅允许浏览器处理**水平**滚动手势'],
          ['`panY`', '仅允许浏览器处理**垂直**滚动手势（最常用 —— 让 JS 接管横滑用作 Carousel）'],
          ['`panLeft`', '仅允许**向左**滑动'],
          ['`panRight`', '仅允许**向右**滑动'],
          ['`panUp`', '仅允许**向上**滑动'],
          ['`panDown`', '仅允许**向下**滑动'],
          ['`pinchZoom`', '仅允许双指缩放（其他手势由 JS 处理）'],
          [
            '`manipulation`',
            '允许 pan + zoom，**禁用双击缩放** —— 让按钮点击响应更快（移除 300ms 等待双击的延迟）',
          ],
        ],
      },
    ],
    details: `### 经典用例

\`\`\`ts
// 横向 Carousel：让浏览器处理纵向滚动，横向手势让 JS 处理
s.touchAction.panY

// 绘图板：禁用所有触摸默认行为
s.touchAction.none

// 按钮：消除 300ms 双击缩放延迟（旧 iOS 兼容）
s.touchAction.manipulation
\`\`\``,
    syntax: [
      [
        '10 个 keyword',
        '`auto` ｜ `none` ｜ `panX` ｜ `panY` ｜ `panLeft` ｜ `panRight` ｜ `panUp` ｜ `panDown` ｜ `pinchZoom` ｜ `manipulation`',
        '只接受关键字',
      ],
      ['多个组合', "`'pan-y pinch-zoom'`", '空格分隔允许多种手势'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // appearance
  // ════════════════════════════════════════════════════════════════════
  appearance: {
    firstLine:
      '控制原生表单控件的**外观渲染** —— 用浏览器默认样式、平台原生样式、或完全去除让 CSS 接管。',
    keywordGroups: [
      {
        label: '4 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。浏览器按元素类型决定样式（如 `<select>` 显示下拉箭头）'],
          ['`none`', '**完全去除原生外观** —— 让 CSS 完全接管（最常用，定制按钮 / select 时）'],
          ['`textfield`', '强制按 `<input type="text">` 渲染（让 `type="search"` 等显示文本框外观）'],
          ['`menulistButton`', '强制按下拉按钮渲染'],
        ],
      },
    ],
    details: `### 经典用法

\`\`\`ts
// 自定义 select 样式（去除浏览器默认箭头）
s.appearance.none
  .background("url('/icons/chevron.svg') no-repeat right 12px center")
  .paddingRight.px(32)

// 自定义 checkbox（hide 原生勾选）
s.appearance.none.width.px(16).height.px(16).border('2px solid')
\`\`\`

### 前缀

旧浏览器需 \`-webkit-appearance\` / \`-moz-appearance\` 前缀。zui 链式调用会自动加。`,
    syntax: [
      ['4 个 keyword', '`auto` ｜ `none` ｜ `textfield` ｜ `menulistButton`', '只接受关键字'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // willChange
  // ════════════════════════════════════════════════════════════════════
  willChange: {
    firstLine:
      '提示浏览器某元素**即将变化** —— 让浏览器**提前优化**该元素（创建合成层、GPU 加速）。',
    keywordGroups: [
      {
        label: '3 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`auto`', '**默认值**。无优化提示'],
          ['`scrollPosition`', '提示元素将**滚动**，浏览器优化滚动性能'],
          ['`contents`', '提示元素**内容**将频繁变化（动画 / 文字）'],
        ],
      },
    ],
    details: `### 函数态：指定 CSS 属性名

\`\`\`ts
// 即将动画 transform → 浏览器提前晋升合成层
s.willChange('transform')

// 多个属性
s.willChange('transform, opacity')
\`\`\`

### 何时用 vs 不用

**用**：动画开始前**短暂**加上（如 :hover 临时加，动画结束移除）。

**不用**：
- 永久加上 —— 浏览器会**长期占用合成层内存**，反而拖慢页面
- 给所有元素加 —— 性能反向优化（变慢）
- 不动的元素加 —— 无效但耗内存

### 替代方案

直接用 \`transform: translateZ(0)\` 也可触发合成层，但 \`will-change\` 更标准。`,
    syntax: [
      ['3 个 keyword', '`auto` ｜ `scrollPosition` ｜ `contents`', '内建优化'],
      ['CSS 属性名', "`'transform'` `'opacity'` `'transform, opacity'`", 'kebab-case 属性名'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // fieldSizing
  // ════════════════════════════════════════════════════════════════════
  fieldSizing: {
    firstLine:
      '控制 `<input>` / `<textarea>` / `<select>` 等表单元素的**尺寸自动调整模式** —— 是固定还是按内容增长。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`fixed`', '**默认值**。固定尺寸（按 CSS / HTML 属性的宽度，不跟随内容增长）'],
          [
            '`content`',
            '**按内容自动调整**：`<input>` 跟随输入文字宽度，`<textarea>` 跟随内容高度（无需 JS 自适应高度）',
          ],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// 自动增高的 textarea（替代 JS 方案）
s.fieldSizing.content
\`\`\``,
    syntax: [['2 个 keyword', '`fixed` ｜ `content`', '只接受关键字']],
    initialValue: 'fixed',
    inherits: false,
    browserNote: 'CSS UI 4 新属性，Chrome 123+。其他浏览器尚未支持。',
  },

  // ════════════════════════════════════════════════════════════════════
  // interpolateSize
  // ════════════════════════════════════════════════════════════════════
  interpolateSize: {
    firstLine:
      '允许 `auto` / `min-content` 等**内容驱动尺寸关键字**参与 `transition` / `@keyframes` 动画（默认这些值无法动画）。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`numericOnly`', '**默认值**。仅数值（如 px）才能动画'],
          [
            '`allowKeywords`',
            '允许 `auto` / `fit-content` / `min-content` / `max-content` 等关键字参与动画',
          ],
        ],
      },
    ],
    details: `### 用例：高度从 0 → auto 动画

\`\`\`ts
// 给祖先（如 :root）
s.interpolateSize.allowKeywords

// 然后子元素可以动画 height: auto
s.transition('height 300ms').height(0)
// hover/active: s.height('auto')         // 现在可以动画了
\`\`\``,
    syntax: [['2 个 keyword', '`numericOnly` ｜ `allowKeywords`', '只接受关键字']],
    initialValue: 'numericOnly',
    inherits: true,
    browserNote: 'CSS Values 5 新属性，Chrome 129+。其他浏览器尚未支持。',
  },
}

export default interaction
