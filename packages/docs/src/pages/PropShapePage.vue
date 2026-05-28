<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import ApiTable from '../components/ApiTable.vue'
</script>

<template>
  <section>
    <ZTitle :level="1">props 范式</ZTitle>
    <ZParagraph>
      zui-vue 所有组件的 prop 接口遵循<strong>一套统一的形态规则</strong>:外观维度(color / size /
      direction / 等)统一走 <ZCode code="chain factory" />,视觉变体走<strong>内联字面量 union</strong>,
      真二态状态走 <ZCode code="boolean" />,业务/原生 HTML 字段保留原类型。这套规则让每个组件的 API
      表面极小,IDE 补全总落在<strong>chain 端</strong>(token / keyword / unit method / modifier),
      不爆 prop 本身的字面量噪声。
    </ZParagraph>

    <ZTitle :level="2">5 种 prop 形态总览</ZTitle>
    <ApiTable
      :columns="[
        { key: 'type', label: '类型', mono: true, width: '110px' },
        { key: 'name', label: '名称',  width: '180px' },
        { key: 'shape', label: '示例签名', mono: true, width: '320px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { type: 'Type A', name: '单属性 factory',   shape: '((c: Chain[\\'color\\']) => void) | undefined',    desc: 'prop 名 ≈ CSS 属性名,carrier 直接对应该属性。如 color / direction / justify / align。' },
        { type: 'Type B', name: '复合 wire factory', shape: '((d: Chain[\\'animationDuration\\']) => void) | undefined', desc: '启用即 wire 一组规则(name/iteration/timing 等自动加),用户只控关键参数(如 spin 的速度)。' },
        { type: 'Type C', name: '一对多 factory',    shape: '((w: Chain[\\'width\\']) => void) | undefined',    desc: '同一 factory 作用到多个 CSS 属性。如 ZIcon.size = width + height 同步。' },
        { type: 'Type V', name: 'variant 字面量 union', shape: '\\'filled\\' | \\'outlined\\' | \\'text\\'',     desc: '视觉变体。内联到 props,不导出独立 type alias。' },
        { type: 'Type N', name: '真二态 / 原生 / 第三方', shape: 'boolean | \\'button\\' | Placement',           desc: '布尔状态、原生 HTML 字段、第三方继承(如 floating-ui Placement)保留原类型。' },
      ]"
    />

    <ZTitle :level="2">决策史</ZTitle>
    <ZParagraph>
      props 范式经历过两次大调整,最终落定在「全 chain factory + variant 字面量」组合:
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'date',   label: '日期',     mono: true, width: '120px' },
        { key: 'stage',  label: '决策',     width: '220px' },
        { key: 'desc',   label: '内容' },
      ]"
      :rows="[
        { date: '2026-05-22', stage: 'Stage 2 cssRoot → css',         desc: '所有简单单根组件的兜底逃生口从 cssRoot 改名为 css(更扁平)。' },
        { date: '2026-05-22', stage: 'B5 Size5 union(已撤销)',         desc: '尝试 size?: factory | Size5,允许 size=\\'small\\' 简写,但 IDE 补全冲突 + 跟其他 prop 不一致,撤销。' },
        { date: '2026-05-23', stage: 'Pure chain factory(当前)',       desc: '所有 size/color/spacing/layout 类一律 factory。variant 类保留字面量但内联。文档:.claude/decisions/2026-05-23-prop-shape-pure-factory.md' },
        { date: '2026-05-24', stage: '数值尺寸用 number(iem 倍数)',     desc: '复杂交互组件(ZButton/ZInput)的 size prop 退化成 number,组件内全 iem 联动。简单组件仍走 factory。' },
      ]"
    />

    <ZTitle :level="2">Type A —— 单属性 carrier factory</ZTitle>
    <ZParagraph>
      最常见。prop 名直接对应 chain 上的一个 carrier,实现时 <ZCode code="props.color(s.color)" />
      一行应用。用户在 callback 内拥有该 carrier 的完整补全:token / keyword / unit / modifier。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`// ZText.color
interface ZTextProps {
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
}

// 实现
icss(theme.value, (s) => {
  if (props.color) props.color(s.color)
})`"
    />
    <ZParagraph>用户写法:</ZParagraph>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<!-- token -->
<ZText :color=&quot;(c) => c._primary&quot;>主色文字</ZText>

<!-- token + modifier 链 -->
<ZText :color=&quot;(c) => c._danger.alpha(60)&quot;>半透明错误色</ZText>

<!-- 字面量 -->
<ZText :color=&quot;(c) => c('#ff00aa')&quot;>自定义色</ZText>

<!-- keyword -->
<ZText :color=&quot;(c) => c.currentColor&quot;>跟随父色</ZText>

<!-- ZFlex.gap 也是 Type A -->
<ZFlex :gap=&quot;(g) => g._middle&quot;>...</ZFlex>
<ZFlex :gap=&quot;(g) => g.iem(0.5)&quot;>...</ZFlex>`"
    />

    <ZTitle :level="2">Type B —— 复合 wire factory</ZTitle>
    <ZParagraph>
      一个 prop 启用时,组件内部<strong>自动 wire 一组规则</strong>;用户只暴露最关键的参数。
      经典案例:<ZCode code="ZIcon.spin" />,启用时 setup 自动加上 animationName / iteration /
      timingFunction,用户只传速度。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`interface ZIconProps {
  spin?: ((d: Chain<ZuiSchema>['animationDuration']) => void) | undefined
}

// 实现:启用时 wire 4 条规则,用户只控 duration
if (props.spin) {
  s.animationName(presetAnimations.spin)
  s.animationIterationCount.infinite
  s.animationTimingFunction.linear
  s.animationDuration(props.spin)
}`"
    />
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<!-- 1 秒一圈 -->
<ZIcon :component=&quot;Reload&quot; :spin=&quot;(d) => d.s(1)&quot; />

<!-- 300ms -->
<ZIcon :component=&quot;Reload&quot; :spin=&quot;(d) => d.ms(300)&quot; />

<!-- schema duration token -->
<ZIcon :component=&quot;Reload&quot; :spin=&quot;(d) => d._middle&quot; />`"
    />

    <ZTitle :level="2">Type C —— 一对多 factory</ZTitle>
    <ZParagraph>
      用户写一次,作用到多个 CSS 属性。<ZCode code="ZIcon.size" /> 同步 width + height 保正方形;
      <ZCode code="ZFlex.gap" /> 一次设 row-gap + column-gap。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`interface ZIconProps {
  size?: ((w: Chain<ZuiSchema>['width']) => void) | undefined
}

// 实现:用户操作 width carrier;组件把 width 复制到 height
props.size(s.width)
if (s._node.width !== undefined) s._node.height = s._node.width`"
    />
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<!-- 1iem × 1iem -->
<ZIcon :component=&quot;Heart&quot; :size=&quot;(w) => w.iem(1)&quot; />

<!-- 走 schema sizes token -->
<ZIcon :component=&quot;Heart&quot; :size=&quot;(w) => w._middle&quot; />

<!-- 跟随父字号 -->
<ZIcon :component=&quot;Heart&quot; :size=&quot;(w) => w.em(1.25)&quot; />`"
    />

    <ZTitle :level="2">Size5 字符串 + factory 二选一</ZTitle>
    <ZParagraph>
      <strong>复杂交互组件</strong>(ZButton / ZInput / ZSpin)的 size prop 退化成
      <ZCode code="number" />(iem 倍数,2026-05-24 决策),不接 factory。这是为了让组件内部能用一个数字
      <strong>全 iem 联动</strong> padding / border-radius / font-size 等多个维度。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`interface ZInputProps {
  /**
   * 尺寸(iem 倍数,默认 1iem=16px)。
   * size=1 → height=2iem, padding-y=0.25iem, font-size=1iem
   * size=1.25 → 整体放大 25%
   */
  size?: number
}

// 实现:数字驱动所有维度
const cls = computed(() => icss(theme.value, (s) => {
  const k = props.size ?? 1
  s.height.iem(2 * k)
  s.paddingTop.iem(0.25 * k)
  s.paddingBottom.iem(0.25 * k)
  s.paddingLeft.iem(0.75 * k)
  s.paddingRight.iem(0.75 * k)
  s.fontSize.iem(1 * k)
}))`"
    />
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<!-- 标准尺寸 -->
<ZInput :size=&quot;1&quot; />

<!-- 紧凑 -->
<ZInput :size=&quot;0.875&quot; />

<!-- 大号 -->
<ZInput :size=&quot;1.25&quot; />`"
    />
    <ZParagraph>
      <strong>简单展示组件</strong>(ZIcon / ZText / ZBadge)还是走 factory——它们只有「一个维度」要控制,
      用 factory 让用户能直接选 token / 单位 / keyword。
    </ZParagraph>

    <ZTitle :level="2">Type V —— variant 内联字面量 union</ZTitle>
    <ZParagraph>
      <strong>视觉变体</strong>(filled / outlined / text / ghost / link 等)走字符串字面量。
      内联到 props 接口,不导出独立 <ZCode code="type ZButtonVariant = ..." /> 别名(避免给用户额外的导入心智)。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`interface ZButtonProps {
  /**
   * 视觉变体。
   * - filled:实心填充(M3 Filled,默认)
   * - outlined:线框
   * - text:无背景无边框
   * - ghost:轻透明背景
   * - link:链接样式(下划线)
   */
  variant?: 'filled' | 'outlined' | 'text' | 'ghost' | 'link'
}

// 实现:defineVariants 把 variant 映射到不同 chain factory
const buttonVariants = defineVariants(theme, {
  base: (s) => { /* ... */ },
  variants: {
    variant: {
      filled:   (s) => { s.background.color._primary; s.color._bg },
      outlined: (s) => { s.borderWidth._thin; s.borderColor._primary },
      text:     (s) => { s.background.transparent },
      ghost:    (s) => { s.background.color._primary.alpha(8) },
      link:     (s) => { s.textDecoration.underline },
    },
  },
  defaultVariants: { variant: 'filled' },
})`"
    />

    <ZTitle :level="2">Type N —— 真二态 / 原生 / 第三方</ZTitle>
    <ZParagraph>
      下列字段<strong>保留原类型</strong>,不要为了"风格统一"硬塞进 factory:
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'kind',  label: '类别',    mono: true, width: '180px' },
        { key: 'ex',    label: '例子',    mono: true, width: '260px' },
        { key: 'desc',  label: '为什么不走 factory' },
      ]"
      :rows="[
        { kind: '真二态 boolean',    ex: 'disabled / checked / loading', desc: '只有 true/false,套 factory 多此一举。' },
        { kind: '业务字符串 union',  ex: 'trigger: \\'hover\\' | \\'click\\'', desc: '触发行为不是 CSS,跟 chain 无关。' },
        { kind: '原生 HTML 字段',    ex: 'type: \\'button\\' | \\'submit\\'', desc: '直接透传到 DOM 属性,跟 HTML 规范对齐。' },
        { kind: '第三方继承类型',    ex: 'placement: Placement(@floating-ui)', desc: '走第三方类型生态,避免重新定义。' },
      ]"
    />

    <ZTitle :level="2">主题 token 引用</ZTitle>
    <ZParagraph>
      所有 chain factory 内,用户都能访问当前 theme 的全部 token。<strong><ZCode code="_" />
      前缀</strong>表示「这是一个 schema token,不是 CSS keyword」。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<!-- 语义色 token -->
:color=&quot;(c) => c._primary&quot;       <!-- schema.color.primary -->
:color=&quot;(c) => c._danger&quot;
:color=&quot;(c) => c._textSecondary&quot;
:color=&quot;(c) => c._border&quot;

<!-- Tailwind palette token -->
:color=&quot;(c) => c._blue600&quot;
:color=&quot;(c) => c._slate900&quot;

<!-- 尺寸 token(5 阶) -->
:size=&quot;(w) => w._tiny&quot;          <!-- schema.sizes.tiny -->
:size=&quot;(w) => w._small&quot;
:size=&quot;(w) => w._middle&quot;
:size=&quot;(w) => w._large&quot;
:size=&quot;(w) => w._huge&quot;

<!-- 间距 / 圆角 / 字号 / blur 等 6+ category 都同样 _ 前缀 -->
:gap=&quot;(g) => g._small&quot;          <!-- schema.spacing.small -->
:radius=&quot;(r) => r._middle&quot;       <!-- schema.radius.middle -->`"
    />

    <ZTitle :level="2">css 兜底口</ZTitle>
    <ZParagraph>
      <strong>所有组件</strong>都有一个 <ZCode code="css" /> prop——任何已暴露 prop 没覆盖的场景,
      直接走 <ZCode code="css" /> chain factory。它是组件的「最后一道逃生口」,在所有维度 prop
      应用完之后执行,可以覆盖任意属性 + 加伪类 / 媒体查询 / 嵌套选择器。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<!-- 加 hover 状态 -->
<ZIcon
  :component=&quot;Heart&quot;
  :css=&quot;(s) => {
    s.cursor.pointer
    s._hover(h => h.color(c => c._danger))
    s._active(a => a.transform('scale(0.9)'))
  }&quot;
/>

<!-- 加媒体查询 -->
<ZText :css=&quot;(s) => {
  s.fontSize._middle
  s._media('_small', (m) => { m.fontSize._large })
}&quot;>响应式文字</ZText>

<!-- 加任意属性(逃生口里没有禁区) -->
<ZBox :css=&quot;(s) => {
  s._prop('scrollbarWidth', 'none')
  s._prop('msOverflowStyle', 'none')
  s._nest('& > * + *', (c) => c.marginTop.iem(1))
}&quot;>...</ZBox>`"
    />

    <ZTitle :level="2">禁忌</ZTitle>
    <ZParagraph>下面这些写法<strong>违反范式,必须改</strong>:</ZParagraph>
    <ApiTable
      :columns="[
        { key: 'bad', label: '错误形态', mono: true, width: '320px' },
        { key: 'good', label: '正确形态', mono: true, width: '320px' },
      ]"
      :rows="[
        { bad: 'justify?: \\'between\\' (配 MAP 翻译表)',         good: 'justify?: factory(Type A)' },
        { bad: 'size?: \\'small\\' | \\'middle\\' | \\'large\\'(简单组件)', good: 'size?: factory(Type C)' },
        { bad: 'color?: \\'primary\\' | \\'danger\\'',           good: 'color?: factory(Type A)' },
        { bad: 'direction?: \\'horizontal\\' | \\'vertical\\'',   good: 'direction?: factory(操作 flexDirection)' },
        { bad: 'export type ZXxxVariant = ...(独立 alias)',       good: '内联到 props interface(Type V)' },
        { bad: '组件内 SIZE_MAP: Record<size, css-value>',         good: '直接 factory + chain token access' },
      ]"
    />

    <ZTitle :level="2">undefined 显式标注</ZTitle>
    <ZParagraph>
      所有 factory prop 类型签名<strong>显式加 <ZCode code="| undefined" /></strong>——与 TypeScript 严格选项
      <ZCode code="exactOptionalPropertyTypes: true" /> 兼容(用户工程开了严格模式时可以传
      <ZCode code="undefined" /> 等同于不传)。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`// ❌ exactOptionalPropertyTypes: true 下会报错
interface Bad {
  color?: (c: Chain<ZuiSchema>['color']) => void
}

// ✅ 显式 | undefined
interface Good {
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
}`"
    />

    <ZTitle :level="2">参照实现</ZTitle>
    <ZParagraph>
      <ZCode code="ZIcon" /> 是 chain factory props 范式的<strong>首个落地</strong>(2026-05-22),
      4 个外观维度全 carrier factory:<ZCode code="size" /> / <ZCode code="color" /> /
      <ZCode code="depth" /> / <ZCode code="spin" />,加一个 <ZCode code="css" /> 兜底。组件实现
      ~150 行,完整覆盖 33 个测试 case,无 const map / 无 cx 拼接。后续 80+ 组件均按此画像。
    </ZParagraph>
  </section>
</template>
