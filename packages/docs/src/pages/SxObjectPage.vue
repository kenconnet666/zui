<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import ApiTable from '../components/ApiTable.vue'
import CodeBlock from '../components/CodeBlock.vue'
</script>

<template>
  <section>
    <ZTitle :level="1">SxObject 模型</ZTitle>
    <ZParagraph>
      <ZCode code="SxObject" /> 是 zui-vue
      专门为<strong>复合组件子节点</strong>设计的「单参数平铺配置」类型。 像
      <ZCode code="ZCard" /> 的 head / body / foot 三个子节点、<ZCode code="ZModal" /> 的 mask /
      dialog 两个子节点——它们各自需要独立的 <ZCode code="css" /> / <ZCode code="class" /> /
      <ZCode code="style" /> / <ZCode code="ref" /> / DOM attrs(<ZCode code="onClick" /> /
      <ZCode code="aria-*" /> / <ZCode code="data-*" /> ……)。<ZCode code="SxObject" />
      用<strong>一个对象平铺这些字段</strong>, 避免「嵌套属性的属性」陷阱。
    </ZParagraph>

    <ZTitle :level="2">设计动机</ZTitle>
    <ZParagraph>
      单根简单组件(<ZCode code="ZIcon" /> / <ZCode code="ZText" /> / <ZCode code="ZTag" />)只暴露
      一个 <ZCode code="css" /> 作为兜底逃生口就够用。但复合组件(ZCard / ZModal / ZTabs / ZSelect)的
      <strong>每个子节点</strong>都需要逃生口。如果按"嵌套属性"方式设计:
    </ZParagraph>
    <CodeBlock
      lang="ts"
      :code="`// ❌ 反例:嵌套属性的属性
interface ZCardProps {
  head?: {
    css?: (s: Chain<ZuiSchema>) => void
    class?: string
    style?: object
    onClick?: (e: MouseEvent) => void
    'aria-labelledby'?: string
    // ... 加一个 prop 就要改 head 的类型
  }
  body?: { /* 同上 */ }
  foot?: { /* 同上 */ }
}`"
    />
    <ZParagraph> 用户视角看上去合理,但有几个问题: </ZParagraph>
    <ZParagraph>
      ① 三个子节点的「DOM attrs 类型」要各自重复一遍;<br />
      ② IDE 补全要先点开 head 对象再深入字段,层级深;<br />
      ③ 跟 Vue 标准 <ZCode code=":class" /> / <ZCode code=":style" /> 的扁平用法不一致。
    </ZParagraph>
    <ZParagraph>
      <ZCode code="SxObject" /> 采用<strong>平铺对象</strong> +
      <strong>HTMLAttributes 类型 intersect</strong>, 使一个对象内同时容纳 zui 专属字段(<ZCode
        code="css"
      />)+ Vue 标准字段(<ZCode code="class" /> / <ZCode code="style" /> / <ZCode code="ref" />)+
      任意 DOM attrs。
    </ZParagraph>

    <ZTitle :level="2">类型签名</ZTitle>
    <ZParagraph> 来自 <ZCode code="packages/ui-vue/src/_internal/sx.ts" />: </ZParagraph>
    <CodeBlock
      lang="ts"
      :code="`import type { Chain, ThemeSchema } from '@kenconnet666/zui-core'
import type { HTMLAttributes, VNodeRef } from 'vue'
import type { ZuiSchema } from '../provider/theme'

export type SxObject<S extends ThemeSchema = ZuiSchema> = {
  /** chain factory —— 该节点样式逃生口 */
  css?: (s: Chain<S>) => void
  /** Vue 标准 class 形式(字符串 / 数组 / 对象) */
  class?: string | string[] | Record<string, boolean>
  /** Vue 标准 style 形式(字符串 / 对象) */
  style?: string | Record<string, string | number>
  /** template ref(string / function / Ref 对象) —— 让用户拿到该子节点 DOM */
  ref?: VNodeRef
} & Omit<HTMLAttributes, 'class' | 'style' | 'ref'>
  & Record<string, unknown>`"
    />

    <ZTitle :level="2">配套 helper</ZTitle>
    <ZParagraph>
      sx.ts 一并导出两个内部 helper,组件实现里成对使用——一个吃 chain 注入 css factory,
      一个把剩余字段拆出来给模板 <ZCode code="v-bind" />。
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'name', label: '函数', mono: true, width: '180px' },
        { key: 'sig', label: '签名', mono: true, width: '380px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'applySx',
          sig: '(s: Chain<ZuiSchema>, sx?: SxObject) => void',
          desc: '若 sx?.css 存在则调用 sx.css(s),把用户 chain factory 应用到当前 chain。',
        },
        {
          name: 'extractSxAttrs',
          sig: '(sx?: SxObject) => { class, style, ref, attrs }',
          desc: '把 css 丢弃,把 class/style/ref 分离,剩余字段聚合到 attrs 供模板 v-bind 透传。',
        },
      ]"
    />

    <ZTitle :level="3">applySx 实现</ZTitle>
    <CodeBlock
      lang="ts"
      :code="`export function applySx(s: Chain<ZuiSchema>, sx?: SxObject): void {
  if (sx?.css) sx.css(s)
}`"
    />

    <ZTitle :level="3">extractSxAttrs 实现</ZTitle>
    <CodeBlock
      lang="ts"
      :code="`export function extractSxAttrs(sx?: SxObject): {
  class: SxObject['class'] | undefined
  style: SxObject['style'] | undefined
  ref: VNodeRef | undefined
  attrs: Record<string, unknown>
} {
  if (!sx) return { class: undefined, style: undefined, ref: undefined, attrs: {} }
  const { css: _css, class: cls, style, ref, ...attrs } = sx
  return { class: cls, style, ref: ref as VNodeRef | undefined, attrs }
}`"
    />

    <ZTitle :level="2">组件实现里的用法</ZTitle>
    <ZParagraph>
      复合组件按「子节点」拆 prop,每个 sx prop 在 setup 里都成对调用 <ZCode code="applySx" /> 与
      <ZCode code="extractSxAttrs" />。
    </ZParagraph>
    <CodeBlock
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { computed } from 'vue'
import { icss, useZTheme } from '@kenconnet666/zui-vue'
import { applySx, extractSxAttrs, type SxObject } from '../_internal/sx'

interface ZCardProps {
  sxHead?: SxObject
  sxBody?: SxObject
  sxFoot?: SxObject
  css?: (s: Chain<ZuiSchema>) => void
}
const props = defineProps<ZCardProps>()
const theme = useZTheme()

const headClass = computed(() => icss(theme.value, (s) => {
  s.padding.px(16)
  s.borderBottomWidth._thin
  s.borderBottomStyle.solid
  s.borderBottomColor._border
  applySx(s, props.sxHead)   // 把用户 css factory 合到 head chain 末尾
}))
const headAttrs = computed(() => extractSxAttrs(props.sxHead))
<\/script>

<template>
  <div :class=&quot;rootClass&quot;>
    <div
      :ref=&quot;headAttrs.ref&quot;
      :class=&quot;[headClass, headAttrs.class]&quot;
      :style=&quot;headAttrs.style&quot;
      v-bind=&quot;headAttrs.attrs&quot;
    >
      <slot name=&quot;head&quot; />
    </div>
    <!-- body / foot 同理 -->
  </div>
</template>`"
    />

    <ZTitle :level="2">ZCard 使用样例</ZTitle>
    <ZParagraph>
      <ZCode code="ZCard" /> 提供 <ZCode code="sxHead" /> / <ZCode code="sxBody" /> /
      <ZCode code="sxFoot" /> 三个 prop——用户对三个子节点的能力完全对称。
    </ZParagraph>
    <CodeBlock
      lang="vue"
      :code="`<ZCard
  :sx-head=&quot;{
    css: (s) => { s.background.color._primary.alpha(8) },
    onClick: handleHeadClick,
    'aria-label': '卡片标题区',
  }&quot;
  :sx-body=&quot;{
    css: (s) => { s.padding.px(32) },
    ref: bodyRef,                  // 拿到 body DOM
  }&quot;
  :sx-foot=&quot;{
    class: 'card-foot-extra',
    style: { textAlign: 'right' },
    'data-testid': 'card-foot',
  }&quot;
>
  <template #head>标题</template>
  <template #body>内容</template>
  <template #foot>底部</template>
</ZCard>`"
    />

    <ZTitle :level="2">ZModal 使用样例</ZTitle>
    <ZParagraph>
      <ZCode code="ZModal" /> 暴露 <ZCode code="sxMask" />(遮罩层)与
      <ZCode code="sxDialog" />(弹窗本体) 两个 sx prop。
    </ZParagraph>
    <CodeBlock
      lang="vue"
      :code="`<ZModal
  v-model:open=&quot;visible&quot;
  :sx-mask=&quot;{
    css: (s) => { s.background.color._overlayBg.alpha(70) },   // 把遮罩调暗
    onClick: handleMaskClick,
  }&quot;
  :sx-dialog=&quot;{
    css: (s) => {
      s.width.px(640)
      s.maxHeight._screenH
      s.boxShadow._huge
    },
    role: 'alertdialog',                                        // 改 a11y role
    'aria-describedby': 'modal-desc',
  }&quot;
>
  内容...
</ZModal>`"
    />

    <ZTitle :level="2">反模式</ZTitle>
    <ZParagraph>
      <ZCode code="SxObject" /> 是<strong>子节点的 DOM 层配置</strong>,只放
      <strong>DOM 表现</strong>相关字段。<strong>不要</strong>把组件级 props(open / size / variant /
      data 等业务字段)塞进 sx——这些字段属于宿主组件本身,应当走顶层 prop。
    </ZParagraph>
    <CodeBlock
      lang="vue"
      :code="`<!-- ❌ 错误:open 是组件级状态,不该塞进 sxDialog -->
<ZModal :sx-dialog=&quot;{ open: true, size: 'large' }&quot; />

<!-- ✅ 正确:组件级 props 走顶层 -->
<ZModal v-model:open=&quot;visible&quot; size=&quot;large&quot; :sx-dialog=&quot;{ css: ... }&quot; />`"
    />
    <ZParagraph>
      同样地,<ZCode code="sx" /> 内的
      <ZCode code="css" /> factory<strong>仅影响该子节点的样式</strong>,
      不能用来切换组件状态。要联动状态走顶层 prop 或 emit。
    </ZParagraph>

    <ZTitle :level="2">命名约定</ZTitle>
    <ApiTable
      :columns="[
        { key: 'pattern', label: '模式', mono: true, width: '220px' },
        { key: 'apply', label: '适用场景' },
      ]"
      :rows="[
        {
          pattern: 'sx{NodeName}',
          apply:
            '复合组件每个子节点一个 sx prop。NodeName 用 PascalCase,如 sxHead / sxBody / sxMask / sxDialog / sxPanel。',
        },
        {
          pattern: 'css',
          apply: '单根简单组件唯一逃生口 prop(不需要 sxRoot)。如 ZIcon / ZText / ZTag / ZBadge。',
        },
        { pattern: 'sxRoot', apply: '★ 不要这样写。L6 决策:单根组件直接用 css。' },
      ]"
    />

    <ZTitle :level="2">类型补全</ZTitle>
    <ZParagraph>
      <ZCode code="SxObject" /> intersect 了
      <ZCode code="Omit&lt;HTMLAttributes, 'class' | 'style' | 'ref'&gt;" />
      —— IDE 在 sx 对象字面量内会自动补全全部标准 HTML attribute(包括
      <ZCode code="onClick" /> / <ZCode code="onKeyDown" /> / <ZCode code="aria-*" /> /
      <ZCode code="role" /> 等)。 末尾的 <ZCode code="Record&lt;string, unknown&gt;" /> 兜底让自定义
      <ZCode code="data-*" />
      属性也不报错。
    </ZParagraph>

    <ZTitle :level="2">与单根组件 css 的关系</ZTitle>
    <ZParagraph>
      简单组件的 <ZCode code="css" /> prop 与复合组件的 <ZCode code="sx*.css" /> 字段语义完全一致——
      都是「该节点 chain factory 兜底」。区别仅在于:
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'kind', label: '组件类型', mono: true, width: '160px' },
        { key: 'prop', label: '逃生口 prop', mono: true, width: '220px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          kind: '单根简单组件',
          prop: 'css: (s) => void',
          desc: 'ZIcon / ZText / ZBadge / ZTag 等。一个 css 就够。',
        },
        {
          kind: '复合组件',
          prop: 'sx{Node}: SxObject',
          desc: 'ZCard / ZModal / ZTabs。每子节点一个 sx prop,sx.css 等于「该子节点的 css」。',
        },
      ]"
    />
  </section>
</template>
