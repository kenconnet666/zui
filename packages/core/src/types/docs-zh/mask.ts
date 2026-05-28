/**
 * `mask` / `clip-path` 家族中文文档。
 *
 * 涵盖 CSS Masking Module Level 1 的核心属性 + `clipPath`。SVG / 浏览器兼容性
 * 由 generator 从 csstype 自动抽取浏览器表追加,这里只补充语义级中文说明。
 */
import type { DocsGroup } from './_common'

const mask: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // mask (shorthand) + 各子属性
  // ════════════════════════════════════════════════════════════════════

  mask: {
    firstLine:
      '**遮罩**简写 —— 用一张图像/渐变作为元素**透明度模板**:模板黑色区域元素**隐藏**、白色**显示**、灰色按 alpha 半透明。一句话设全部 8 个子属性。',
    keywordGroups: [
      {
        label: '简写顺序',
        headers: ['位置', '对应子属性', '默认值'],
        rows: [
          ['第 1 段', '`mask-image`', '`none`'],
          ['第 2 段', '`mask-mode`', '`match-source`'],
          ['第 3 段', '`mask-repeat`', '`repeat`'],
          ['第 4 段', '`mask-position` `/` `mask-size`', '`center` `/` `auto`'],
          ['第 5 段', '`mask-origin`', '`border-box`'],
          ['第 6 段', '`mask-clip`', '`border-box`'],
          ['第 7 段', '`mask-composite`', '`add`'],
        ],
      },
    ],
    details: `**与 \`background\` 对偶**:写法几乎一致(image / position / size / repeat / origin / clip / composite),只是用途是"透明度模板"而非"背景图"。

**典型用法**:
\`\`\`ts
s.mask('url(./fade.svg) center / cover no-repeat')         // SVG 蒙版居中盖满
s.mask('linear-gradient(black 50%, transparent) center')   // 渐变模板,上半显示下半淡出
\`\`\`

**SVG \`<mask>\` 引用**: \`mask: url(#myMask)\` —— 引用同文档 SVG \`<mask id="myMask">\` 元素。`,
    syntax: [
      [
        '`<image>`',
        "`'url(./mask.png)'` `'linear-gradient(black, transparent)'`",
        '图像 / 渐变作为蒙版',
      ],
      ['`<id>`', "`'url(#svgMaskId)'`", '引用 SVG `<mask>` 元素'],
      ['`none`', '—', '无蒙版(默认)'],
      ['完整简写', "`'url(./m.svg) 50% / cover no-repeat'`", '组合多子属性'],
    ],
    initialValue: 'see individual properties',
    inherits: false,
    browserNote:
      'WebKit 系曾用 `-webkit-mask-*` 前缀,现代 Chrome/Safari/Firefox 均原生支持无前缀(Firefox 53+ / Chrome 120+ / Safari 15.4+)。生产环境推荐双写 `-webkit-mask` + `mask`。',
  },

  maskImage: {
    firstLine: '蒙版**图像/渐变源**。模板的 alpha(或 luminance,见 `mask-mode`)决定元素显示/隐藏。',
    keywordGroups: [
      {
        label: '取值形式',
        headers: ['关键字 / 形式', '行为'],
        rows: [
          ['`none`', '**默认值**。无蒙版'],
          ['`<image>`', '任意 CSS 图像:`url(...)` / 渐变 / `image-set(...)`'],
          ['`<gradient>`', '`linear-gradient` / `radial-gradient` / `conic-gradient` 等'],
          ['多张叠加', '逗号分隔多个值:第一张在顶层,按 `mask-composite` 复合'],
        ],
      },
    ],
    details: `**配合 \`mask-mode\` 决定如何读模板**:
- \`alpha\` —— 模板 alpha 通道决定透明度(默认行为)
- \`luminance\` —— 模板亮度决定透明度(黑=隐藏 / 白=显示;适合无 alpha 的灰阶图)

**叠加 vs 复合**:多张 mask-image 用 \`mask-composite\` 控制相互关系(add / subtract / intersect / exclude)。`,
    syntax: [
      ['`<image>`', "`'url(./m.png)'` `'linear-gradient(black, transparent)'`", '单图'],
      ['多张', "`'url(a.svg), url(b.svg)'`", '逗号分隔,按 composite 复合'],
      ['`none`', '—', '清除蒙版'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  maskMode: {
    firstLine: '蒙版**读取通道**:从 alpha 还是亮度(luminance)取值。',
    keywordGroups: [
      {
        label: '3 个关键字',
        headers: ['关键字', '行为'],
        rows: [
          ['`match-source`', '**默认值**。SVG `<mask>` 默认走 luminance,其它默认走 alpha'],
          ['`alpha`', '强制读 alpha 通道(透明=隐藏 / 不透明=显示)'],
          ['`luminance`', '强制读亮度(黑=隐藏 / 白=显示,常用于灰阶图)'],
        ],
      },
    ],
    details: `**关键陷阱**:把 PNG 当 alpha mask 时用 \`match-source\`(默认即可);把灰阶 JPEG 当 mask 时**必须** \`luminance\`,否则 JPEG 无 alpha 会全显示。`,
    syntax: [['关键字', '`match-source` / `alpha` / `luminance`', '见上']],
    initialValue: 'match-source',
    inherits: false,
  },

  maskRepeat: {
    firstLine: '蒙版图像**平铺方式**(与 `background-repeat` 等价语义)。',
    keywordGroups: [
      {
        label: '6 个关键字',
        headers: ['关键字', '行为'],
        rows: [
          ['`repeat`', '**默认值**。双向平铺'],
          ['`repeat-x`', '仅水平平铺'],
          ['`repeat-y`', '仅垂直平铺'],
          ['`no-repeat`', '不平铺,单次贴'],
          ['`space`', '平铺但用间距填满(无裁剪)'],
          ['`round`', '平铺,允许缩放到刚好整数次填满'],
        ],
      },
    ],
    syntax: [
      ['关键字', '`repeat` / `no-repeat` / `space` / `round` / `repeat-x` / `repeat-y`', '见上'],
      ['多轴', "`'repeat space'`", '第 1 值水平 / 第 2 值垂直'],
    ],
    initialValue: 'repeat',
    inherits: false,
  },

  maskPosition: {
    firstLine: '蒙版图像**起点位置**(与 `background-position` 等价语义)。',
    keywordGroups: [
      {
        label: '关键字形式',
        headers: ['关键字', '等价 %'],
        rows: [
          ['`left`', '`0%`'],
          ['`center`', '`50%`'],
          ['`right`', '`100%`'],
          ['`top`', '`0%`'],
          ['`bottom`', '`100%`'],
        ],
      },
    ],
    details: `**两值语法**: \`<x> <y>\`(水平 然后 垂直)。

\`\`\`ts
s.maskPosition('center')                  // = 'center center' = '50% 50%'
s.maskPosition('left top')                // 左上
s.maskPosition('20% 80%')                 // 百分比
s.maskPosition('10px 20px')               // 像素
s.maskPosition('right 16px bottom 8px')   // 4 值:从右 16px / 从底 8px
\`\`\``,
    syntax: [
      ['关键字', "`'center'` `'left top'`", '5 个位置关键字组合'],
      ['`<percentage>`', "`'50%'` `'20% 80%'`", '相对蒙版定位区域'],
      ['`<length>`', "`'10px 20px'`", '从原点偏移'],
      ['4 值', "`'right 16px bottom 8px'`", '从右/底偏移(CSS 4)'],
    ],
    initialValue: '0% 0%',
    inherits: false,
  },

  maskSize: {
    firstLine: '蒙版图像**缩放尺寸**(与 `background-size` 等价语义)。',
    keywordGroups: [
      {
        label: '3 个关键字 + 长度/百分比',
        headers: ['关键字 / 形式', '行为'],
        rows: [
          ['`auto`', '**默认值**。保持图像原尺寸 / SVG 内禀比例'],
          ['`cover`', '等比缩放**完全覆盖**定位区域(可能裁剪)'],
          ['`contain`', '等比缩放**完全装入**定位区域(可能留白)'],
          ['`<length>`', '`10px` `2em` 等明确尺寸'],
          ['`<percentage>`', '`50%` 相对定位区域'],
        ],
      },
    ],
    syntax: [
      ['关键字', '`auto` / `cover` / `contain`', '见上'],
      ['1 值', "`'200px'`", '宽度,高度 auto'],
      ['2 值', "`'200px 100px'`", '宽 高'],
    ],
    initialValue: 'auto',
    inherits: false,
  },

  maskOrigin: {
    firstLine: '蒙版**定位区域起点**:从 border-box / padding-box / content-box 哪个边缘开始。',
    keywordGroups: [
      {
        label: '5 个关键字',
        headers: ['关键字', '行为'],
        rows: [
          ['`border-box`', '**默认值**。从 border 外缘起算(包含 border 区域)'],
          ['`padding-box`', '从 padding 外缘起算(不含 border)'],
          ['`content-box`', '从内容区起算(不含 padding 和 border)'],
          ['`fill-box`', 'SVG 专用:`<` 元素的几何盒'],
          ['`stroke-box`', 'SVG 专用:含 stroke 的盒'],
        ],
      },
    ],
    syntax: [
      [
        '关键字',
        '`border-box` / `padding-box` / `content-box` / `fill-box` / `stroke-box`',
        '见上',
      ],
    ],
    initialValue: 'border-box',
    inherits: false,
  },

  maskClip: {
    firstLine: '蒙版**生效区域**裁剪边界:超出该边界的蒙版部分被裁掉。',
    keywordGroups: [
      {
        label: '6 个关键字',
        headers: ['关键字', '行为'],
        rows: [
          ['`border-box`', '**默认值**。蒙版裁到 border 外缘'],
          ['`padding-box`', '蒙版裁到 padding 外缘'],
          ['`content-box`', '蒙版裁到内容区'],
          ['`fill-box`', 'SVG 几何盒'],
          ['`stroke-box`', 'SVG 含 stroke 盒'],
          ['`no-clip`', '不裁剪(CSS 4)'],
        ],
      },
    ],
    details:
      '**与 `mask-origin` 区别**:`origin` 是蒙版"起点"(原点位置),`clip` 是蒙版"边界"(超出剪掉)。两者通常同步设。',
    syntax: [
      [
        '关键字',
        '`border-box` / `padding-box` / `content-box` / `fill-box` / `stroke-box` / `no-clip`',
        '见上',
      ],
    ],
    initialValue: 'border-box',
    inherits: false,
  },

  maskComposite: {
    firstLine: '多张蒙版**复合方式**(类似 Photoshop 图层混合)。',
    keywordGroups: [
      {
        label: '4 种复合',
        headers: ['关键字', '运算', '直观效果'],
        rows: [
          ['`add`', 'A ∪ B', '**默认值**。两蒙版并集 —— 任一显示即显示'],
          ['`subtract`', 'A - B', '从 A 减去 B 显示区(打洞)'],
          ['`intersect`', 'A ∩ B', '两蒙版交集 —— 两者都显示才显示'],
          ['`exclude`', 'A ⊕ B', '异或 —— 只在一个里时显示(交集隐藏)'],
        ],
      },
    ],
    details: '多值时第 N 个 composite 控制第 N 张 mask-image 与下层合成结果的关系。',
    syntax: [['关键字', '`add` / `subtract` / `intersect` / `exclude`', '见上']],
    initialValue: 'add',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // clipPath —— 几何裁剪
  // ════════════════════════════════════════════════════════════════════

  clipPath: {
    firstLine:
      '**几何裁剪**:把元素显示区裁成任意形状/路径。与 mask 区别 —— clip-path 是**硬边裁切**(0/1),mask 是**alpha 渐变**。',
    keywordGroups: [
      {
        label: 'CSS 基本形状(`<basic-shape>`)',
        headers: ['形式', '示例', '说明'],
        rows: [
          ['`inset()`', "`'inset(10px 20px 30px 40px round 8px)'`", '矩形内缩裁剪,可圆角'],
          ['`circle()`', "`'circle(50% at 50% 50%)'`", '圆形,半径 + 中心点'],
          ['`ellipse()`', "`'ellipse(50% 30% at center)'`", '椭圆,半轴 + 中心点'],
          ['`polygon()`', "`'polygon(0 0, 100% 0, 100% 100%, 0 100%)'`", '多边形顶点列表'],
          ['`path()`', '`\'path("M0 0 L100 0 L50 100 Z")\'`', 'SVG path 命令'],
          ['`rect()`', "`'rect(10px 90% 90% 10px)'`", '四边偏移矩形(CSS 4)'],
          ['`xywh()`', "`'xywh(0 0 100% 100%)'`", 'XY+宽高 矩形(CSS 4)'],
          ['`shape()`', "`'shape(from 0 0, line to 100px 0, curve to ...)'`", '声明式形状(CSS 4)'],
        ],
      },
      {
        label: '其它取值',
        headers: ['关键字 / 形式', '行为'],
        rows: [
          ['`none`', '**默认值**。无裁剪'],
          ['`<url>`', "`'url(#svgClip)'` 引用 SVG `<clipPath>`"],
          [
            '`<geometry-box>`',
            '`border-box` / `padding-box` / `content-box` / `margin-box` / `fill-box` / `stroke-box` / `view-box`,定义裁切参照盒',
          ],
        ],
      },
    ],
    details: `**典型用法**:
\`\`\`ts
s.clipPath('circle(50%)')                          // 圆形头像
s.clipPath('polygon(0 0, 100% 0, 100% 80%, 0 100%)')  // 斜切底边
s.clipPath('inset(0 round 8px)')                   // 仅圆角裁切(等同 border-radius 但更强)
s.clipPath('url(#myClip)')                         // 引用 SVG <clipPath>
\`\`\`

**配合动画**:同类形状之间(如 \`circle\` ↔ \`circle\`、\`polygon\` 顶点数相同)可平滑 transition,跨类不可。

**已废弃** \`clip\` 属性(矩形裁剪) —— 用 \`clip-path: inset(...)\` 替代。`,
    syntax: [
      ['基本形状', "`'circle(50%)'` `'polygon(...)'` `'inset(...)'`", '见上'],
      ['SVG 引用', "`'url(#clipId)'`", '复用 SVG `<clipPath>`'],
      ['几何盒', "`'border-box'` `'view-box'`", '改裁切基准'],
      ['`none`', '—', '无裁剪'],
    ],
    initialValue: 'none',
    inherits: false,
    browserNote:
      '`path()` Chrome 88+ / Safari 13.1+ / Firefox 97+。`shape()` Chrome 130+(2024 末新)。SVG `<clipPath>` 引用所有现代浏览器都支持。',
  },
}

export default mask
