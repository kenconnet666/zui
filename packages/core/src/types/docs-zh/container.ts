/**
 * Container Queries / CSS Containment 中文文档。
 *
 * 涵盖 CSS Containment Module Level 3 的核心:`container-type` / `container-name`
 * 简写 `container`,以及性能优化用 `contain` / `contain-intrinsic-*` 系列。
 */
import type { DocsGroup } from './_common'

const container: DocsGroup = {
  // ════════════════════════════════════════════════════════════════════
  // Container Queries —— 真正的"相对容器"响应式
  // ════════════════════════════════════════════════════════════════════

  container: {
    firstLine:
      '**容器查询**简写 —— `container-name` 与 `container-type` 二合一,声明本元素成为**查询容器**让子节点用 `@container` 按本元素尺寸响应。',
    keywordGroups: [
      {
        label: '语法形式',
        headers: ['形式', '展开', '示例'],
        rows: [
          ['仅名', '`container-name: <name>`', "`'card'`"],
          ['仅型', '`container-type: <type>`', "`'inline-size'`"],
          ['名 / 型', '`<name> / <type>`', "`'card / inline-size'`"],
        ],
      },
    ],
    details: `**容器查询 vs 媒体查询**:
- \`@media (min-width: 768px)\` —— 看**视口宽度**,所有位置都用这个全局阈值
- \`@container (min-width: 400px)\` —— 看**最近的查询容器宽度**;同一组件放在 sidebar 和 main 里自动用不同布局

**典型用法**:
\`\`\`ts
// 父级:声明本元素是 inline-size 容器
s.container('card / inline-size')   // 等同 'container-type: inline-size; container-name: card'

// 子级:CSS @container 查询
// @container card (min-width: 400px) { .grid { grid-template-columns: 1fr 1fr } }
\`\`\``,
    syntax: [
      ['名 / 型', "`'card / inline-size'`", '完整简写'],
      ['仅类型', "`'inline-size'` `'size'`", '匿名容器'],
      ['`none`', '—', '不作为容器(默认)'],
    ],
    initialValue: 'none',
    inherits: false,
    browserNote: 'Chrome 105+ / Safari 16+ / Firefox 110+(2023 全面落地)。',
  },

  containerType: {
    firstLine: '本元素的**容器查询类型** —— 决定 `@container` 查询能查询哪些维度。',
    keywordGroups: [
      {
        label: '3 个关键字',
        headers: ['关键字', '允许查询', '布局副作用'],
        rows: [
          ['`normal`', '**默认值**。**不**作为查询容器', '无副作用'],
          [
            '`inline-size`',
            '查询**主轴**尺寸(横向布局时 = 宽度)',
            '主轴含布局/样式/绘制 containment;子树不能 affect 外层宽度',
          ],
          [
            '`size`',
            '查询**两个轴**尺寸(宽 + 高)',
            '两轴 containment;**子树必须明确尺寸**(否则布局崩),通常需配 `contain-intrinsic-size`',
          ],
        ],
      },
    ],
    details: `**陷阱:为什么 \`size\` 比 \`inline-size\` 罕见**?

\`size\` 在两个轴都建 containment,意味着**容器自身高度不能由子内容撑开**(否则就是循环依赖:子靠容器尺寸决定 layout,容器靠子撑开)。所以 \`size\` 需要容器**显式设高度**或配 \`contain-intrinsic-size\` 给个 placeholder 尺寸。

绝大多数场景用 \`inline-size\` —— 仅查询宽度,高度仍由内容撑开,无布局副作用。`,
    syntax: [['关键字', '`normal` / `inline-size` / `size`', '见上']],
    initialValue: 'normal',
    inherits: false,
  },

  containerName: {
    firstLine: '本元素的**容器名** —— 给 `@container <name> (...)` 引用,实现"按名定向查询"。',
    keywordGroups: [
      {
        label: '取值',
        headers: ['形式', '行为'],
        rows: [
          ['`none`', '**默认值**。匿名容器(只能用 `@container (...)` 无名查询匹配最近祖先)'],
          [
            '`<custom-ident>`',
            "`'card'` `'sidebar'` 等自定义名;`@container card (...)` 只匹配同名容器",
          ],
          ['多个名', "`'card sidebar'` 同时拥有多个名;空格分隔"],
        ],
      },
    ],
    details: `**为什么要给容器命名**?多层嵌套容器时,匿名查询只匹配**最近**的查询容器,可能不是你期望的那层。命名让你跳过中间层,精确指向需要的容器。

\`\`\`ts
// 外层 card 容器
s.container('card / inline-size')
//   ... 中间层(可能也是匿名容器)
//      .item:子节点想响应外层 card,而非中间层 → @container card (min-width: 400px) { ... }
\`\`\``,
    syntax: [
      ['`<custom-ident>`', "`'card'` `'main-grid'`", '自定义名,字母数字 + `-`/`_` 开头'],
      ['多个', "`'card sidebar'`", '空格分隔'],
      ['`none`', '—', '匿名'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  // ════════════════════════════════════════════════════════════════════
  // CSS Containment —— 性能优化
  // ════════════════════════════════════════════════════════════════════

  contain: {
    firstLine:
      '**containment 隔离** —— 告诉浏览器本元素子树**不会影响**外部布局/绘制/样式,允许跳过子树的渲染开销。性能优化属性。',
    keywordGroups: [
      {
        label: '6 个关键字',
        headers: ['关键字', '隔离范围', '常用场景'],
        rows: [
          ['`none`', '**默认值**。无隔离', '一般元素'],
          ['`strict`', '= `size layout paint style`,**最强**隔离', '复杂卡片 / 列表项'],
          [
            '`content`',
            '= `layout paint style`,**不**含 size(子尺寸仍影响父)',
            '可滚动列表 / 折叠面板',
          ],
          ['`size`', '子布局不影响本元素尺寸(必须配自给尺寸,否则坍缩)', '虚拟列表项'],
          ['`layout`', '子布局不影响外部', '复杂组件根'],
          ['`paint`', '子内容不绘制到本元素外', '溢出隐藏区'],
          ['`style`', 'CSS counter/quotes 等不向外冒泡', '罕用'],
        ],
      },
    ],
    details: `**注意**:\`contain: size\` 不配 \`contain-intrinsic-size\` 会让元素坍缩到 0×0。

**典型用法**:
\`\`\`ts
s.contain('content')                  // 列表项最常用,平衡性能与正确性
s.contain('strict')                   // 必须配 width/height 或 contain-intrinsic-size
s.contain('layout paint')             // 组合多个 keyword
\`\`\`

**与 container queries 关系**:\`container-type: size\` 隐含 \`contain: size layout style paint\`(完整 containment);\`container-type: inline-size\` 隐含 \`contain: inline-size layout style paint\`。`,
    syntax: [
      ['单一', '`none` / `strict` / `content` / `size` / `layout` / `paint` / `style`', '见上'],
      ['多个', "`'layout paint'`", '空格组合(`size layout paint style` 任意子集)'],
    ],
    initialValue: 'none',
    inherits: false,
    browserNote:
      'Chrome 52+ / Safari 15.4+ / Firefox 69+,稳定可用。`content-visibility` 配套使用效益更高。',
  },

  containIntrinsicSize: {
    firstLine:
      '**内禀占位尺寸**简写 —— 给 `contain: size` 或 `content-visibility: auto` 的元素一个"预估尺寸",避免坍缩。',
    keywordGroups: [
      {
        label: '取值形式',
        headers: ['形式', '行为'],
        rows: [
          ['`none`', '**默认值**。无内禀尺寸,可能坍缩'],
          [
            '`auto <length>`',
            '**推荐**。`auto` 让浏览器记住实际渲染尺寸;`<length>` 是首次渲染前的占位',
          ],
          ['`<length>`', '固定内禀宽 = 高 = N'],
          ['`<length> <length>`', '分别设宽 高'],
        ],
      },
    ],
    details: `**核心用途**:与 \`content-visibility: auto\` 配合实现**虚拟滚动列表**:

\`\`\`ts
s.contentVisibility('auto')
s.containIntrinsicSize('auto 200px')   // 预估每项 200px 高
// → 视口外的项跳过渲染,布局滚动条仍准确
\`\`\`

\`auto\` 让浏览器记住实际渲染过的尺寸,**滚动回去时复用**,避免抖动。`,
    syntax: [
      ['`none`', '—', '无内禀尺寸'],
      ['`auto <length>`', "`'auto 200px'` `'auto 100px 200px'`", '推荐:auto + 占位'],
      ['`<length>`', "`'200px'` `'100px 200px'`", '固定占位'],
    ],
    initialValue: 'none',
    inherits: false,
  },

  containIntrinsicWidth: {
    extends: 'containIntrinsicSize',
    firstLine:
      '`contain-intrinsic-size` 的**宽度分量**(单轴版)。详情见 [`contain-intrinsic-size`]。',
  },

  containIntrinsicHeight: {
    extends: 'containIntrinsicSize',
    firstLine:
      '`contain-intrinsic-size` 的**高度分量**(单轴版)。详情见 [`contain-intrinsic-size`]。',
  },

  containIntrinsicBlockSize: {
    extends: 'containIntrinsicSize',
    firstLine:
      '`contain-intrinsic-size` 的**块轴分量**(逻辑属性版,跟随 `writing-mode`)。详情见 [`contain-intrinsic-size`]。',
  },

  containIntrinsicInlineSize: {
    extends: 'containIntrinsicSize',
    firstLine:
      '`contain-intrinsic-size` 的**行轴分量**(逻辑属性版,跟随 `writing-mode`)。详情见 [`contain-intrinsic-size`]。',
  },

  contentVisibility: {
    firstLine:
      '**内容可见性优化** —— 浏览器对视口外子树**跳过渲染**(类似 `display: none` 但保留可达性 + 自动复活)。性能利器,通常配 `contain-intrinsic-size` 使用。',
    keywordGroups: [
      {
        label: '3 个关键字',
        headers: ['关键字', '行为', '何时用'],
        rows: [
          ['`visible`', '**默认值**。正常渲染', '一般元素'],
          [
            '`auto`',
            '视口外**跳过**渲染(layout / style / paint),进入视口**自动恢复**;不影响 a11y/find-in-page',
            '长列表 / 文档站每个 section',
          ],
          [
            '`hidden`',
            '**始终**跳过渲染(类似 `display: none` 但保留布局空间状态可瞬间恢复)',
            '手动管理的虚拟列表',
          ],
        ],
      },
    ],
    details: `**与 \`display: none\` 区别**:
- \`display: none\` —— 元素**不存在**于布局,Tab 不到,find-in-page 找不到
- \`content-visibility: hidden\` —— **保留**布局占位 + a11y / find-in-page 可达,只是不绘制
- \`content-visibility: auto\` —— 上述基础上**自动**在视口边界激活/休眠

**必须配 \`contain-intrinsic-size\`** 否则视口外元素坍缩,滚动条乱跳:
\`\`\`ts
s.contentVisibility('auto')
s.containIntrinsicSize('auto 300px')   // 预估占位高度
\`\`\``,
    syntax: [['关键字', '`visible` / `auto` / `hidden`', '见上']],
    initialValue: 'visible',
    inherits: false,
    browserNote: 'Chrome 85+ / Edge 85+ / Safari 18+(2024)。Firefox 暂不支持(2026 中状态)。',
  },
}

export default container
