/**
 * 过渡 / 动画属性中文文档（animation 分组）。
 *
 * 覆盖：transition* / animation*
 */

import type { DocsGroup } from './_common'

const TIMING_FUNCTION_ROWS: ReadonlyArray<readonly string[]> = [
  ['`linear`', '匀速（无加速 / 减速）'],
  ['`ease`', '**默认值**。慢-快-慢（CSS 默认，类似 ease-in-out 但开头更慢）'],
  ['`easeIn`', '由慢到快（先慢加速）'],
  ['`easeOut`', '由快到慢（先快减速，最常用 —— 进入动画首选）'],
  ['`easeInOut`', '两端慢，中间快（自然来回）'],
  ['`stepStart`', '瞬间跳到终态（在开始时刻立即完成）'],
  ['`stepEnd`', '保持初态直到结束才瞬间跳到终态'],
]

const animation: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // Transition
  // ════════════════════════════════════════════════════════════════════
  transitionDuration: {
    firstLine: '设置 CSS 过渡（`transition`）的**持续时间**。0 表示无过渡（即时变化）。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [
          ['只接受 `<time>`（`s` 或 `ms`），**无关键字**（除全局关键字）'],
          ['多个值用逗号分隔，对应多个属性（与 `transitionProperty` 顺序一致）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
s.transitionDuration.ms(300)             // 300 毫秒
s.transitionDuration.s(0.5)              // 0.5 秒
s.transitionDuration('300ms, 500ms')     // 多属性各自时长（与 transitionProperty 对应）
\`\`\`

### 常用时长参考

| 场景 | 推荐时长 |
| --- | --- |
| 微交互（hover、focus） | 150-200ms |
| 中等交互（modal 弹出） | 200-300ms |
| 大动画（页面切换） | 300-500ms |
| 注意力 / 强调 | 500ms+ |`,
    syntax: [
      ['`<time>`', "`'300ms'` `'0.3s'`", '具体时长'],
      ['多个值', "`'300ms, 500ms'`", '逗号分隔，与 transitionProperty 对应'],
    ],
    initialValue: '0s',
    inherits: false,
  },

  transitionDelay: {
    firstLine: '设置 CSS 过渡**开始前的延迟**。可为负值（让过渡从中间状态开始）。',
    keywordGroups: [
      {
        label: '此属性的特点',
        asTable: false,
        rows: [
          ['只接受 `<time>`（`s` 或 `ms`），可正可负，**无关键字**'],
          ['负值 = 过渡"跳过"前 N 时间，直接从该时刻继续'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
s.transition('opacity 300ms')
s.transitionDelay.ms(100)     // 等 100ms 才开始

// 错峰动画
// child1: transitionDelay 0ms
// child2: transitionDelay 100ms
// child3: transitionDelay 200ms
\`\`\``,
    syntax: [
      ['`<time>`', "`'100ms'` `'-200ms'`", '可正可负'],
      ['多个值', "`'0ms, 100ms, 200ms'`", '逗号分隔'],
    ],
    initialValue: '0s',
    inherits: false,
  },

  transitionTimingFunction: {
    firstLine: '设置 CSS 过渡的**速率曲线**（缓动函数）—— 决定过渡是匀速、加速、减速还是阶梯式。',
    keywordGroups: [
      {
        label: '7 个标准缓动关键字',
        headers: ['关键字', '行为'],
        rows: TIMING_FUNCTION_ROWS,
      },
    ],
    details: `### 函数态：自定义曲线

\`\`\`ts
// 三次贝塞尔曲线（4 个控制点 x1,y1,x2,y2）
s.transitionTimingFunction('cubic-bezier(0.4, 0, 0.2, 1)')      // Material Design 标准曲线

// 阶梯函数
s.transitionTimingFunction('steps(5, end)')                     // 分 5 步执行
s.transitionTimingFunction('steps(10, jump-start)')             // 10 步，开始时立即跳一步
\`\`\`

### 选择建议

- **进入动画**（fade-in、scale-in）：\`easeOut\`（先快后慢，自然停止）
- **退出动画**（fade-out、scale-out）：\`easeIn\`（先慢后快，加速离开）
- **来回 / 双向**（modal 弹出弹回）：\`easeInOut\`
- **匀速**（loading 旋转）：\`linear\`
- **打字机 / 像素跳变**：\`steps(N)\``,
    syntax: [
      [
        '7 个标准 keyword',
        '`linear` ｜ `ease` ｜ `easeIn` ｜ `easeOut` ｜ `easeInOut` ｜ `stepStart` ｜ `stepEnd`',
        '常用',
      ],
      ['贝塞尔曲线', "`'cubic-bezier(0.4, 0, 0.2, 1)'`", '4 个控制点（前两个 X∈[0,1]，Y 无限制）'],
      [
        '阶梯函数',
        "`'steps(5, end)'`",
        'N 步 + 方向（start / end / jump-start / jump-end / jump-both / jump-none）',
      ],
    ],
    initialValue: 'ease',
    inherits: false,
  },

  transitionProperty: {
    firstLine:
      '指定**哪些 CSS 属性**要应用过渡动画。可以是单个属性名、多个属性名、或 `all` / `none`。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`all`', '**默认值**。所有可过渡属性都过渡（方便但有性能风险 —— 任意变化都触发动画）'],
          ['`none`', '禁用所有过渡'],
        ],
      },
    ],
    details: `### 函数态：指定属性名

\`\`\`ts
// 单属性
s.transitionProperty('opacity')

// 多属性（逗号分隔）
s.transitionProperty('opacity, transform, background-color')

// 全部过渡（同 'all' 关键字）
s.transitionProperty('all')
\`\`\`

### 与其他 transition-* 属性配合

\`\`\`ts
// 推荐用 transition 简写
s.transition('opacity 300ms ease-out, transform 200ms ease-in')

// 或分开写
s.transitionProperty('opacity, transform')
  .transitionDuration('300ms, 200ms')
  .transitionTimingFunction('ease-out, ease-in')
\`\`\`

### 不可过渡的属性

不是所有 CSS 属性都能过渡。可过渡属性必须是"可计算的连续值"（数字 / 颜色 / 长度等），不能过渡 \`display\` / \`visibility\`（visibility 是离散值，但有特殊插值规则）等。`,
    syntax: [
      ['关键字', '`all` ｜ `none`', '全部 / 全不过渡'],
      ['单属性名', "`'opacity'`", 'CSS 属性 kebab-case 名'],
      ['多属性名', "`'opacity, transform, color'`", '逗号分隔'],
    ],
    initialValue: 'all',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // Animation
  // ════════════════════════════════════════════════════════════════════
  animationDuration: {
    extends: 'transitionDuration',
    firstLine: '设置 `@keyframes` **动画的持续时间**。0 表示动画立即跳到终态。',
  },

  animationDelay: {
    extends: 'transitionDelay',
    firstLine: '设置 `@keyframes` 动画**开始前的延迟**。可负值（让动画从中间状态开始）。',
  },

  animationTimingFunction: {
    extends: 'transitionTimingFunction',
    firstLine:
      '设置 `@keyframes` 动画的**速率曲线**。规则同 `transitionTimingFunction`，但作用于关键帧动画。',
    syntax: [
      [
        '7 个标准 keyword',
        '`linear` ｜ `ease` ｜ `easeIn` ｜ `easeOut` ｜ `easeInOut` ｜ `stepStart` ｜ `stepEnd`',
        '常用',
      ],
      ['贝塞尔曲线', "`'cubic-bezier(0.4, 0, 0.2, 1)'`", '4 个控制点'],
      ['阶梯函数', "`'steps(5, end)'`", 'N 步 + 方向'],
    ],
  },

  animationIterationCount: {
    firstLine: '设置动画**循环次数**。可为整数、小数（不完整循环）、或 `infinite`（无限循环）。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`infinite`', '**无限循环**（loading 旋转、心跳等场景）']],
      },
    ],
    details: `### 用例

\`\`\`ts
s.animationIterationCount(1)         // **默认值**。只播一次
s.animationIterationCount(3)         // 播 3 次
s.animationIterationCount('2.5')     // 播 2.5 次（最后一次只播一半）
s.animationIterationCount.infinite   // 无限循环
\`\`\``,
    syntax: [
      ['数字', '`1` `3` `2.5`', '循环次数（可小数）'],
      ['`infinite`', '—', '无限循环'],
    ],
    initialValue: '1',
    inherits: false,
  },

  animationName: {
    firstLine: '指定使用的 `@keyframes` **关键帧动画名称**。多个动画用逗号分隔，同时播放。',
    keywordGroups: [
      {
        label: '1 个 keyword',
        headers: ['关键字', '行为'],
        rows: [['`none`', '**默认值**。不使用动画']],
      },
    ],
    details: `### 用例

\`\`\`ts
// 先定义 @keyframes
const spinKeyframes = ikeyframes\`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
\`

// 使用
s.animationName(spinKeyframes)
  .animationDuration.s(1)
  .animationIterationCount.infinite
  .animationTimingFunction.linear

// 多个动画同时播
s.animationName('fadeIn, slideUp')
  .animationDuration('300ms, 400ms')
\`\`\``,
    syntax: [
      ['`<custom-ident>`', "`'fadeIn'` `'spin'`", '@keyframes 名称（kebab-case 或 camelCase）'],
      ['多个动画', "`'fadeIn, slideUp'`", '逗号分隔，同时播放'],
      ['`none`', '—', '不使用动画'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  animationDirection: {
    firstLine: '设置动画**播放方向** —— 正向、反向、交替（来回）。',
    keywordGroups: [
      {
        label: '4 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`normal`', '**默认值**。从 0% 到 100% 正向播放'],
          ['`reverse`', '从 100% 到 0% **反向**播放'],
          [
            '`alternate`',
            '**交替播放**：第 1 次正向，第 2 次反向，第 3 次正向...（来回往复，最常用于"呼吸"动画）',
          ],
          ['`alternateReverse`', '交替播放，但**首次反向**'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// 心跳呼吸动画
s.animationName('pulse')
  .animationIterationCount.infinite
  .animationDirection.alternate    // 来回缩放
\`\`\``,
    syntax: [
      [
        '4 个 keyword',
        '`normal` ｜ `reverse` ｜ `alternate` ｜ `alternateReverse`',
        '只接受关键字',
      ],
    ],
    initialValue: 'normal',
    inherits: false,
  },

  animationFillMode: {
    firstLine:
      '决定动画**结束后**（以及开始前延迟期间）元素保留**哪个状态** —— 起始 / 终止 / 双向 / 都不保留。',
    keywordGroups: [
      {
        label: '4 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`none`', '**默认值**。动画结束后**回到元素原本样式**（动画的样式不保留）'],
          [
            '`forwards`',
            '动画结束后**保持最后一帧（100%）**的样式（最常用 —— 进入动画后保持终态）',
          ],
          ['`backwards`', '动画**开始前的延迟期间**就应用第一帧（0%）的样式（避免延迟期间的闪烁）'],
          ['`both`', '同时启用 `forwards` 和 `backwards`'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// 元素 fade-in 后保持完全显示
s.animationName('fadeIn')
  .animationDuration.ms(300)
  .animationFillMode.forwards    // 不写的话动画结束会回到初始 opacity:1，但若 fadeIn 从 0→1，初始可能就是 1，最关键的是用 forwards 让进入动画的"中间状态"得以保留

// 延迟 200ms 才开始动画，但希望延迟期间元素已是 0% 状态
s.animationDelay.ms(200)
s.animationFillMode.backwards
\`\`\``,
    syntax: [['4 个 keyword', '`none` ｜ `forwards` ｜ `backwards` ｜ `both`', '只接受关键字']],
    initialValue: 'none',
    inherits: false,
  },

  animationPlayState: {
    firstLine: '控制动画**播放 / 暂停**状态。可用于 JS 控制动画暂停。',
    keywordGroups: [
      {
        label: '2 个 keyword',
        headers: ['关键字', '行为'],
        rows: [
          ['`running`', '**默认值**。正在播放'],
          ['`paused`', '**暂停**（保持当前帧不动）'],
        ],
      },
    ],
    details: `### 用例

\`\`\`ts
// hover 时暂停动画
s.animationName('spin')
s.animationDuration.s(2)
s.animationIterationCount.infinite
// :hover 选择器或 hover 状态下：
//   s.animationPlayState.paused
\`\`\``,
    syntax: [['2 个 keyword', '`running` ｜ `paused`', '只接受关键字']],
    initialValue: 'running',
    inherits: false,
  },
}

export default animation
