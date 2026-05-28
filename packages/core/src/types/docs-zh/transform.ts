/**
 * Transform / Filter 相关属性中文文档（transform 分组）。
 *
 * 覆盖：transformOrigin / rotate / scale / translate / perspective /
 *   filter / backdropFilter / mixBlendMode
 */

import { lengthUnitsSnippet, type DocsGroup } from './_common'

const transform: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // transformOrigin
  // ════════════════════════════════════════════════════════════════════
  transformOrigin: {
    firstLine:
      '设置 `transform` 变换的**原点位置** —— 旋转/缩放围绕哪个点进行。默认元素中心 (50% 50%)。',
    keywordGroups: [
      {
        label: '5 个位置关键字',
        headers: ['关键字', '行为'],
        rows: [
          ['`top`', '上侧（= `50% 0%`）'],
          ['`bottom`', '下侧（= `50% 100%`）'],
          ['`left`', '左侧（= `0% 50%`）'],
          ['`right`', '右侧（= `100% 50%`）'],
          ['`center`', '中心（= `50% 50%`，**默认值**）'],
        ],
      },
    ],
    details: `### 1/2/3 值

| 值数量 | 含义 |
| --- | --- |
| 1 | X 或关键字（Y 默认 center） |
| 2 | X Y（如 \`'left top'\` 或 \`'0% 50%'\`） |
| 3 | X Y Z（Z 用于 3D 变换深度） |

### 经典用法

\`\`\`ts
// 围绕左上角旋转
s.transformOrigin('left top')
s.transform('rotate(45deg)')

// 围绕底部中心缩放（从底向上展开）
s.transformOrigin.bottom
s.transform('scaleY(0)')
// transition 后 scaleY(1) 就是"从底部展开"动画
\`\`\`

${lengthUnitsSnippet('transformOrigin')}`,
    syntax: [
      ['关键字', '`top` `bottom` `left` `right` `center`', '5 个位置'],
      ['`<length>`', "`'10px 20px'`", 'X 和 Y 偏移'],
      ['`<percentage>`', "`'50% 50%'`", '相对元素自身尺寸'],
      ['3 值（含 Z）', "`'50% 50% 100px'`", '3D 变换深度'],
    ],
    initialValue: '50% 50%',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // rotate
  // ════════════════════════════════════════════════════════════════════
  rotate: {
    firstLine:
      '设置元素的**旋转角度**（CSS Transforms 2，独立属性，等价于 `transform: rotate()`）。可指定旋转轴。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。不旋转']],
      },
    ],
    details: `### 函数态

\`\`\`ts
s.rotate('45deg')                   // 2D 旋转 45 度（顺时针）
s.rotate('-90deg')                  // 逆时针 90 度
s.rotate('0.5turn')                 // 半圈 = 180deg

// 3D 旋转（需指定轴）
s.rotate('x 45deg')                 // 围绕 X 轴旋转
s.rotate('y 90deg')                 // 围绕 Y 轴旋转
s.rotate('1 1 0 45deg')             // 围绕自定义轴向量
\`\`\`

### rotate 独立属性 vs transform

\`\`\`ts
// 现代写法（独立属性 + 复合）
s.rotate('45deg')
s.scale('1.2')
s.translate('10px, 20px')

// 经典写法（transform 综合）
s.transform('rotate(45deg) scale(1.2) translate(10px, 20px)')
\`\`\`

独立属性的优势：**单独动画化某一项变换**（如只动画 rotate，保留 scale 不变）。`,
    syntax: [
      ['`<angle>`', "`'45deg'` `'-90deg'` `'0.5turn'`", '2D 旋转'],
      ['轴 + 角度', "`'x 45deg'` `'y 90deg'` `'z 45deg'`", '3D 旋转，指定轴'],
      ['向量 + 角度', "`'1 1 0 45deg'`", '围绕自定义轴向量'],
      ['`none`', '—', '不旋转'],
    ],
    initialValue: 'none',
    inherits: false,
    browserNote:
      'CSS Transforms 2 独立属性 Chrome 104 / Firefox 72 / Safari 14.1+。旧浏览器用 `transform: rotate()`。',
  },

  // ════════════════════════════════════════════════════════════════════
  // scale
  // ════════════════════════════════════════════════════════════════════
  scale: {
    firstLine:
      '设置元素的**缩放比例**（CSS Transforms 2 独立属性）。1.0 = 原始大小，2 = 双倍，0.5 = 一半。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。不缩放（等同 `1`）']],
      },
    ],
    details: `### 函数态

\`\`\`ts
s.scale(1.2)               // X、Y 都放大 1.2 倍
s.scale('1.2 0.8')         // X 放大 1.2，Y 缩小到 0.8
s.scale('1.2 1.2 1.5')     // 3D 缩放（X Y Z）
\`\`\`

### 用例

\`\`\`ts
// hover 微放大
s.transition('scale 200ms ease-out')
// :hover { scale: 1.05 }

// 翻转
s.scale('-1 1')            // 水平翻转
s.scale('1 -1')            // 垂直翻转
\`\`\``,
    syntax: [
      ['1 个数字', '`1.2` `0.5`', 'X 和 Y 同时缩放'],
      ['2 个数字', "`'1.2 0.8'`", 'X / Y 分别缩放'],
      ['3 个数字', "`'1 1 1.5'`", 'X / Y / Z (3D)'],
      ['`<percentage>`', "`'120%'`", '相当于 1.2'],
      ['`none`', '—', '不缩放'],
    ],
    initialValue: 'none',
    inherits: false,
    browserNote: 'CSS Transforms 2 独立属性 Chrome 104 / Firefox 72 / Safari 14.1+。',
  },

  // ════════════════════════════════════════════════════════════════════
  // translate
  // ════════════════════════════════════════════════════════════════════
  translate: {
    firstLine:
      '设置元素的**平移量**（CSS Transforms 2 独立属性）。等价于 `transform: translate()`，可单独动画化。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。不平移']],
      },
    ],
    details: `### 函数态

\`\`\`ts
s.translate('20px')                  // 仅 X 平移
s.translate('20px 10px')             // X 和 Y
s.translate('20px 10px 5px')         // X Y Z（3D）

// 百分比相对元素自身
s.translate('-50% -50%')             // 经典：负值半身，配合 position absolute + top/left 50% 居中

// 主题 token
s.translate.px(8)
\`\`\`

### 经典："绝对定位居中"

\`\`\`ts
s.position.absolute
s.top('50%')
s.left('50%')
s.translate('-50% -50%')
// 元素中心位于父容器中心，无视元素尺寸
\`\`\`

${lengthUnitsSnippet('translate')}`,
    syntax: [
      ['1 个值', "`'20px'`", '仅 X 平移'],
      ['2 个值', "`'20px 10px'`", 'X / Y'],
      ['3 个值', "`'20px 10px 5px'`", 'X / Y / Z (3D)'],
      ['`<percentage>`', "`'-50% -50%'`", '相对元素自身（不是父容器）'],
      ['`none`', '—', '不平移'],
    ],
    initialValue: 'none',
    inherits: false,
    browserNote: 'CSS Transforms 2 独立属性 Chrome 104 / Firefox 72 / Safari 14.1+。',
  },

  // ════════════════════════════════════════════════════════════════════
  // perspective
  // ════════════════════════════════════════════════════════════════════
  perspective: {
    firstLine:
      '设置 **3D 透视距离** —— 观察者到 Z=0 平面的距离。值越小透视越强烈（夸张），越大越平。设此属性可让子元素的 3D 变换看起来"立体"。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。无透视（3D 变换看起来是 2D 平面投影）']],
      },
    ],
    details: `### 用例

\`\`\`ts
// 父容器开启透视
s.perspective.px(800)

// 子元素 3D 旋转才会有立体感
// child: s.transform('rotateY(45deg)')
\`\`\`

### perspective 属性 vs transform 函数

| 写法 | 影响范围 |
| --- | --- |
| \`perspective: 800px\`（本属性）| 给**所有子元素**应用相同的观察距离（容器级） |
| \`transform: perspective(800px)\` | 仅当前元素的 3D 变换有透视效果 |

容器级 \`perspective\` 让多个子元素**共享同一灭点**（看起来"在一个 3D 空间里"）；transform 函数则各自独立。

### 常用值

- \`300-500px\`：强烈透视（卡片翻转、画廊效果）
- \`800-1200px\`：温和透视
- \`> 2000px\`：几乎无透视

${lengthUnitsSnippet('perspective')}`,
    syntax: [
      ['`<length>`', "`'800px'` `'30em'`", '透视距离（必须 > 0）'],
      ['`none`', '—', '无透视'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // filter
  // ════════════════════════════════════════════════════════════════════
  filter: {
    firstLine:
      '给元素应用**视觉滤镜** —— 模糊、亮度、对比度、灰度、阴影等。可链式叠加多个滤镜函数。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。无滤镜']],
      },
    ],
    details: `### 11 个滤镜函数

| 函数 | 参数 | 效果 |
| --- | --- | --- |
| \`blur(<length>)\` | 模糊半径 | **高斯模糊**（如 \`blur(8px)\`） |
| \`brightness(<%>)\` | 0-∞ | 亮度（100% 原值，> 100% 变亮，< 100% 变暗，0 全黑） |
| \`contrast(<%>)\` | 0-∞ | 对比度（100% 原值，0 全灰） |
| \`grayscale(<%>)\` | 0-100% | 灰度（100% 完全黑白） |
| \`sepia(<%>)\` | 0-100% | 棕褐色调（怀旧滤镜） |
| \`saturate(<%>)\` | 0-∞ | 饱和度（100% 原值，0 灰度） |
| \`hue-rotate(<angle>)\` | 角度 | 色相旋转（0deg-360deg） |
| \`invert(<%>)\` | 0-100% | 反色（100% 完全反相） |
| \`opacity(<%>)\` | 0-100% | 透明度（同 \`opacity\` 属性但参与滤镜链） |
| \`drop-shadow(...)\` | 同 boxShadow（无 spread/inset）| **真实阴影**（跟随透明像素边缘，svg/png 可见） |
| \`url(#filter)\` | SVG filter | 引用 SVG 中定义的滤镜（最强大） |

### 用例

\`\`\`ts
// hover 增亮
s.filter('brightness(1.1)')

// disable 灰度
s.filter('grayscale(1) opacity(0.5)')

// 毛玻璃文字（配合 backdrop-filter）
s.filter('blur(2px)')

// 跟随透明边缘的阴影（svg icon、png）
s.filter('drop-shadow(0 2px 4px rgba(0,0,0,0.2))')
\`\`\`

### filter vs boxShadow

- \`boxShadow\`：阴影按**元素矩形边界**绘制（包括透明背景区）
- \`filter: drop-shadow()\`：阴影按**实际可见像素**绘制（适合非矩形元素如 SVG）

### 性能提示

filter 触发**合成层** —— 性能比 boxShadow 好，但**多个滤镜叠加**会变慢，避免动画大模糊半径。`,
    syntax: [
      ['`none`', '—', '**默认值**'],
      ['blur', "`'blur(8px)'`", '高斯模糊'],
      ['brightness', "`'brightness(1.2)'`", '亮度'],
      ['contrast', "`'contrast(150%)'`", '对比度'],
      ['grayscale', "`'grayscale(0.5)'`", '灰度'],
      ['sepia', "`'sepia(80%)'`", '棕褐色调'],
      ['saturate', "`'saturate(200%)'`", '饱和度'],
      ['hue-rotate', "`'hue-rotate(90deg)'`", '色相旋转'],
      ['invert', "`'invert(1)'`", '反色'],
      ['opacity', "`'opacity(0.5)'`", '透明度'],
      ['drop-shadow', "`'drop-shadow(0 2px 4px #0003)'`", '真实阴影'],
      ['SVG filter', "`'url(#myFilter)'`", '引用 SVG 滤镜'],
      ['链式叠加', "`'blur(2px) brightness(1.1)'`", '空格分隔多个函数'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // backdropFilter
  // ════════════════════════════════════════════════════════════════════
  backdropFilter: {
    extends: 'filter',
    firstLine:
      '给元素**身后的内容**应用滤镜（毛玻璃、玻璃拟态最常用）。元素本身不变，但**透过它看到的下层**被滤镜处理。',
    details: `### 经典：毛玻璃效果

\`\`\`ts
s.backgroundColor('rgba(255,255,255,0.6)')         // 半透明白底
  .backdropFilter('blur(20px) saturate(1.5)')      // 后方模糊 + 增饱和
// 经典 macOS 风格毛玻璃
\`\`\`

### 性能 / 兼容性

- Safari 早期需要 \`-webkit-backdrop-filter\` 前缀（现代版本已无需）
- Firefox 较晚支持（103+，且需用户开启 \`layout.css.backdrop-filter.enabled\`）
- **性能开销大** —— 每帧重新合成下层，移动端慎用大模糊半径`,
    browserNote: 'Chrome 76 / Safari 9（需前缀至 18）/ Firefox 103+。移动端性能需评估。',
  },

  // ════════════════════════════════════════════════════════════════════
  // mixBlendMode
  // ════════════════════════════════════════════════════════════════════
  mixBlendMode: {
    firstLine:
      '决定元素**与下层内容**的**混合模式**（不仅是背景之间，还可与父级 / 兄弟元素混合）。',
    keywordGroups: [
      {
        label: '18 种混合模式（同 backgroundBlendMode）',
        headers: ['关键字', '行为'],
        rows: [
          ['`normal`', '**默认值**。无混合'],
          ['`multiply`', '正片叠底（整体变暗）'],
          ['`screen`', '滤色（整体变亮）'],
          ['`overlay`', '叠加（multiply + screen 组合）'],
          ['`darken`', '取较深'],
          ['`lighten`', '取较浅'],
          ['`colorDodge`', '颜色减淡'],
          ['`colorBurn`', '颜色加深'],
          ['`hardLight`', '强光'],
          ['`softLight`', '柔光'],
          ['`difference`', '差值'],
          ['`exclusion`', '排除'],
          ['`hue`', '色相'],
          ['`saturation`', '饱和度'],
          ['`color`', '色彩'],
          ['`luminosity`', '亮度'],
          ['`plusDarker`', '加性变暗（实验性）'],
          ['`plusLighter`', '加性变亮（实验性）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// 黑色文字在彩色背景上 → 反相文字效果
s.color.white
s.mixBlendMode.difference

// 让 SVG icon 与背景融合
s.mixBlendMode.multiply
\`\`\`

### 副作用：创建层叠上下文

mixBlendMode 非 \`normal\` 时，元素自动创建新的**层叠上下文** —— 类似 \`opacity < 1\` 或 \`transform\`。

### 配合 isolation

如果**希望混合范围局限在某个父容器内**（而不是混合到整页背景），父容器加 \`isolation: isolate\`：

\`\`\`ts
// 父容器
s.isolation.isolate          // 创建层叠上下文边界

// 子元素 mixBlendMode 仅在父内生效，不影响外部
\`\`\``,
    syntax: [
      [
        '18 种混合 keyword',
        '`normal` `multiply` `screen` `overlay` `darken` `lighten` `colorDodge` `colorBurn` `hardLight` `softLight` `difference` `exclusion` `hue` `saturation` `color` `luminosity` `plusDarker` `plusLighter`',
        '见上方关键字表',
      ],
    ],
    initialValue: 'normal',
    inherits: false,
  },
}

export default transform
